import { NextRequest, NextResponse } from "next/server";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI, type Part } from "@google/generative-ai";

type MetadataLanguage = "en" | "ja";

const MODEL_NAME = "gemini-2.5-flash";
const MAX_FILES = 50;
const MAX_TAGS = 12;

const SYSTEM_PROMPTS: Record<MetadataLanguage, string> = {
  en: `You are a photo metadata assistant. For each image return:
- title: a concise English description (around 6–10 words, up to ~60 characters)
- description: a natural English sentence (~1 sentence) describing the key subject and context
- tags: up to twelve English keywords ordered from most important to least important. Do not include symbols or punctuation.

Respond only with JSON in the exact shape:
{"results":[{"id":"imageId","title":"Title","description":"Description","tags":["tag1","tag2"]}]}`,
  ja: `You are a photo metadata assistant. For each image return:
- title: a concise Japanese description (around 6–10 words, up to ~60 characters)
- description: a natural Japanese sentence (~1 sentence) describing the key subject and context
- tags: up to twelve Japanese keywords ordered from most important to least important. Do not include symbols or punctuation.

Respond only with JSON in the exact shape:
{"results":[{"id":"imageId","title":"タイトル","description":"説明","tags":["タグ1","タグ2"]}]}`,
};

const PROMPT_INTRO = {
  en: {
    single:
      "Generate an English title, one-sentence description, and twelve English tags (ordered most important to least important) for the image below.",
    multi: (count: number) =>
      `Generate an English title, one-sentence description, and twelve English tags (ordered most important to least important) for each of the ${count} images below.`,
  },
  ja: {
    single:
      "下記の画像に対して、日本語のタイトル・一文の説明・重要度順のタグ12個を生成してください。",
    multi: (count: number) =>
      `下記の${count}枚の画像それぞれに対して、日本語のタイトル・一文の説明・重要度順のタグ12個を生成してください。`,
  },
};

export const runtime = "nodejs";

type GeminiResult = { id: string; title: string; description?: string; tags: string[] };

const sanitizeResults = (raw: unknown): GeminiResult[] => {
  const container = raw as { results?: unknown };
  const list: unknown[] = Array.isArray(container?.results)
    ? (container.results as unknown[])
    : Array.isArray(raw)
      ? (raw as unknown[])
      : [];

  const sanitized: GeminiResult[] = [];

  for (const candidate of list) {
    if (!candidate || typeof candidate !== "object") {
      continue;
    }

    const item = candidate as { id?: unknown; title?: unknown; description?: unknown; tags?: unknown };

    const id = typeof item.id === "string" ? item.id.trim() : "";
    const title = typeof item.title === "string" ? item.title.trim() : "";

    if (!id || !title) {
      continue;
    }

    const description =
      typeof item.description === "string" ? item.description.trim() : "";

    const rawTags = item.tags;
    let tags: string[] = [];

    if (Array.isArray(rawTags)) {
      tags = rawTags
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter((tag) => tag.length > 0);
    } else if (typeof rawTags === "string") {
      tags = rawTags
        .split(/[\n,]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    tags = tags.slice(0, MAX_TAGS);

    sanitized.push({ id, title, description, tags });
  }

  return sanitized;
};

const buildPromptIntro = (language: MetadataLanguage, count: number) => {
  const templates = PROMPT_INTRO[language];
  return count === 1 ? templates.single : templates.multi(count);
};

type UploadedFile = {
  id: string;
  name: string;
  fileUri: string;
  mimeType: string;
  geminiFileName: string;
};

/**
 * アップロード済みファイルのURIを受け取り、メタデータを生成する
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY が設定されていません。" },
      { status: 500 },
    );
  }

  let body: { files?: unknown; language?: unknown };
  
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディが不正です。" },
      { status: 400 },
    );
  }

  const language = typeof body.language === "string" && body.language.toLowerCase() === "ja" ? "ja" : "en";

  if (!Array.isArray(body.files) || body.files.length === 0) {
    return NextResponse.json(
      { error: "ファイル情報が必要です。" },
      { status: 400 },
    );
  }

  if (body.files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `一度に処理できる画像は最大 ${MAX_FILES} 枚です。` },
      { status: 400 },
    );
  }

  // Validate file entries
  const files: UploadedFile[] = [];
  for (const entry of body.files) {
    if (
      typeof entry !== "object" ||
      entry === null ||
      typeof entry.id !== "string" ||
      typeof entry.fileUri !== "string" ||
      typeof entry.mimeType !== "string"
    ) {
      return NextResponse.json(
        { error: "不正なファイル情報が含まれています。" },
        { status: 400 },
      );
    }
    files.push({
      id: entry.id,
      name: typeof entry.name === "string" ? entry.name : entry.id,
      fileUri: entry.fileUri,
      mimeType: entry.mimeType,
      geminiFileName: typeof entry.geminiFileName === "string" ? entry.geminiFileName : "",
    });
  }

  const fileManager = new GoogleAIFileManager(apiKey);
  const generativeAI = new GoogleGenerativeAI(apiKey);
  const model = generativeAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPTS[language],
  });

  // Collect Gemini file names for cleanup
  const geminiFileNames = files
    .map((f) => f.geminiFileName)
    .filter((name) => name.length > 0);

  try {
    const promptIntro = buildPromptIntro(language, files.length);

    const parts: Part[] = [
      {
        text: `${promptIntro}\nUse the provided image ID and include it in the JSON results.`,
      },
    ];

    for (const file of files) {
      parts.push({ text: `画像ID: ${file.id} / ファイル: ${file.name}` });
      parts.push({
        fileData: {
          mimeType: file.mimeType,
          fileUri: file.fileUri,
        },
      });
    }

    const generation = await model.generateContent({
      contents: [
        {
          role: "user",
          parts,
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = generation.response;
    if (!response) {
      throw new Error("Gemini からの応答を取得できませんでした。");
    }

    const text = response.text();
    const parsed: unknown = JSON.parse(text);
    const sanitized = sanitizeResults(parsed);

    if (sanitized.length === 0) {
      throw new Error("Gemini から有効なタイトル/説明/タグを受け取れませんでした。");
    }

    return NextResponse.json({ results: sanitized });
  } catch (error) {
    console.error("Gemini metadata generation failed", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Gemini でのメタデータ生成中にエラーが発生しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    // Clean up uploaded files from Gemini
    await Promise.all(
      geminiFileNames.map((fileId) =>
        fileManager.deleteFile(fileId).catch(() => undefined),
      ),
    );
  }
}
