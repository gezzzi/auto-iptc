import { NextRequest, NextResponse } from "next/server";
import { FileState, GoogleAIFileManager } from "@google/generative-ai/server";

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

/**
 * 1枚の画像をGemini File APIにアップロードし、fileUri を返す
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY が設定されていません。" },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const clientId = formData.get("id");
  const originalName = formData.get("name");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "画像ファイルを選択してください。" },
      { status: 400 },
    );
  }

  if (!isSupportedFile(file)) {
    return NextResponse.json(
      { error: "JPEG / PNG / WebP 形式のみ対応しています。" },
      { status: 400 },
    );
  }

  const fileManager = new GoogleAIFileManager(apiKey);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const displayName = typeof originalName === "string" ? originalName : file.name || "image";
    
    const uploadResponse = await fileManager.uploadFile(buffer, {
      displayName,
      mimeType: resolveMimeType(file),
    });

    const readyFile = await waitForFileActivation(
      fileManager,
      uploadResponse.file.name,
      uploadResponse.file.state,
    );

    return NextResponse.json({
      id: typeof clientId === "string" ? clientId : undefined,
      name: displayName,
      fileUri: readyFile.uri,
      mimeType: readyFile.mimeType,
      geminiFileName: readyFile.name,
    });
  } catch (error) {
    console.error("Gemini file upload failed", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Gemini へのファイルアップロード中にエラーが発生しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

