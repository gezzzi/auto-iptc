import { NextRequest, NextResponse } from "next/server";
import { FileState, GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI, type Part } from "@google/generative-ai";

type MetadataLanguage = "en" | "ja";

const MODEL_NAME = "gemini-2.5-flash";
const MAX_FILES = 40;
const MAX_TAGS = 12;
const UPLOAD_CONCURRENCY = 12;

const SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/x-webp",
]);

const EXTENSION_MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const resolveMimeType = (file: File): string => {
  const type = (file.type || "").toLowerCase();
  if (SUPPORTED_MIME_TYPES.has(type)) {
    return type;
  }

  const name = file.name || "";
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex !== -1 && dotIndex < name.length - 1) {
    const ext = name.slice(dotIndex + 1).toLowerCase();
    if (ext in EXTENSION_MIME_MAP) {
      return EXTENSION_MIME_MAP[ext]!;
    }
  }

  return "application/octet-stream";
};

const isSupportedFile = (file: File) => {
  const type = (file.type || "").toLowerCase();
  if (SUPPORTED_MIME_TYPES.has(type)) {
    return true;
  }
  const name = file.name || "";
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === name.length - 1) {
    return false;
  }
  const ext = name.slice(dotIndex + 1).toLowerCase();
  return ext in EXTENSION_MIME_MAP;
};

const waitForFileActivation = async (
  fileManager: GoogleAIFileManager,
  fileName: string,
  initialState: FileState,
) => {
  if (initialState === FileState.ACTIVE) {
    return fileManager.getFile(fileName);
  }

  const timeoutMs = 20000;
  const startedAt = Date.now();
  // Poll until Gemini finishes processing the uploaded file.
  while (Date.now() - startedAt < timeoutMs) {
    await delay(800);
    const fileMetadata = await fileManager.getFile(fileName);
    if (fileMetadata.state === FileState.ACTIVE) {
      return fileMetadata;
    }
    if (fileMetadata.state === FileState.FAILED) {
      throw new Error("Gemini によるファイル処理に失敗しました。");
    }
  }

  throw new Error("Gemini がファイルを処理するまでにタイムアウトしました。");
};

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

const getMetadataLanguage = (value: FormDataEntryValue | null): MetadataLanguage => {
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized === "ja") return "ja";
  }
  return "en";
};

const buildPromptIntro = (language: MetadataLanguage, count: number) => {
  const templates = PROMPT_INTRO[language];
  return count === 1 ? templates.single : templates.multi(count);
};

const runWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const current = cursor;
      cursor += 1;
      results[current] = await worker(items[current]!, current);
    }
  });

  await Promise.all(runners);
  return results;
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY が設定されていません。" },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const language = getMetadataLanguage(formData.get("language"));
  const files = formData
    .getAll("files")
    .filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "画像ファイルを選択してください。" },
      { status: 400 },
    );
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `一度に送信できる画像は最大 ${MAX_FILES} 枚です。` },
      { status: 400 },
    );
  }

  const metaRaw = formData.get("meta");
  let metaList: { id: string; name?: string }[] = [];

  if (typeof metaRaw === "string" && metaRaw.trim().length > 0) {
    try {
      const parsed: unknown = JSON.parse(metaRaw);
      if (Array.isArray(parsed)) {
        metaList = parsed
          .map((item) => (typeof item === "object" && item !== null ? item : null))
          .filter((item): item is { id: string; name?: string } =>
            typeof item?.id === "string",
          )
          .map((item) => ({
            id: item.id,
            name: typeof item.name === "string" ? item.name : undefined,
          }));
      }
    } catch (error) {
      console.warn("Failed to parse meta payload", error);
    }
  }

  const fileEntries = files.map((file, index) => {
    const fallbackId = `file-${index + 1}`;
    const meta = metaList[index];
    return {
      clientId: typeof meta?.id === "string" ? meta.id : fallbackId,
      originalName: typeof meta?.name === "string" ? meta.name : file.name || fallbackId,
      file,
    };
  });

  for (const entry of fileEntries) {
    if (!isSupportedFile(entry.file)) {
      return NextResponse.json(
        { error: "JPEG / PNG / WebP 形式のみ対応しています。" },
        { status: 400 },
      );
    }
  }

  const fileManager = new GoogleAIFileManager(apiKey);
  const generativeAI = new GoogleGenerativeAI(apiKey);
  const model = generativeAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: SYSTEM_PROMPTS[language],
  });

  const uploadedFileIds: string[] = [];

  try {
    const preparedFiles = await runWithConcurrency(
      fileEntries,
      Math.min(UPLOAD_CONCURRENCY, fileEntries.length),
      async (entry) => {
        const buffer = Buffer.from(await entry.file.arrayBuffer());
        const uploadResponse = await fileManager.uploadFile(buffer, {
          displayName: entry.originalName,
          mimeType: resolveMimeType(entry.file),
        });

        uploadedFileIds.push(uploadResponse.file.name);
        const readyFile = await waitForFileActivation(
          fileManager,
          uploadResponse.file.name,
          uploadResponse.file.state,
        );

        return {
          clientId: entry.clientId,
          originalName: entry.originalName,
          fileMetadata: readyFile,
        };
      },
    );

    const promptIntro = buildPromptIntro(language, preparedFiles.length);

    const parts: Part[] = [
      {
        text: `${promptIntro}\nUse the provided image ID and include it in the JSON results.`,
      },
    ];

    for (const prepared of preparedFiles) {
      parts.push({ text: `画像ID: ${prepared.clientId} / ファイル: ${prepared.originalName}` });
      parts.push({
        fileData: {
          mimeType: prepared.fileMetadata.mimeType,
          fileUri: prepared.fileMetadata.uri,
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
    await Promise.all(
      uploadedFileIds.map((fileId) =>
        fileManager.deleteFile(fileId).catch(() => undefined),
      ),
    );
  }
}
