// npm install node-exiftool dist-exiftool sharp
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import { ExiftoolProcess } from "node-exiftool";
import distExiftool from "dist-exiftool";
import sharp from "sharp";

type IPTCPayload = {
  title?: string;
  tags?: string[];
  description?: string;
};

const JPEG_MIME = "image/jpeg";
const PNG_MIME = "image/png";
const WEBP_MIME = "image/webp";
const WEBP_MIME_ALT = "image/x-webp";

export const runtime = "nodejs";

const sanitizeFilenameForDownload = (baseName: string) => {
  const safeBase = baseName.replace(/[^a-zA-Z0-9-_]+/g, "_");
  return (safeBase || "image") + "-iptc.jpg";
};

const resolveDistExiftoolPath = (rawPath: string): string => {
  if (!rawPath) {
    return rawPath;
  }

  if (/^(?:\\|\/)ROOT[\\/]/.test(rawPath)) {
    const relative = rawPath.replace(/^(?:\\|\/)ROOT[\\/]/, "");
    const segments = relative.split(/[/\\]+/).filter(Boolean);
    return path.join(process.cwd(), ...segments);
  }

  return rawPath;
};

const findExiftoolPath = async (): Promise<string | null> => {
  const normalized = resolveDistExiftoolPath(distExiftool as string);

  // Prefer Windows exe when on Windows to avoid spawn issues with perl script.
  const exeFallbacks = [
    path.join(process.cwd(), "node_modules", "exiftool.exe", "vendor", "exiftool.exe"),
    path.join(path.dirname(normalized), "exiftool.exe"),
    path.join(process.cwd(), "node_modules", "exiftool.pl", "vendor", "exiftool.exe"),
  ];

  const scriptFallbacks = [
    normalized,
    path.join(path.dirname(normalized), "exiftool"), // sometimes the actual binary lives next to the script
    path.join(process.cwd(), "node_modules", "exiftool.pl", "vendor", "exiftool"),
  ];

  const candidates =
    process.platform === "win32" ? [...exeFallbacks, ...scriptFallbacks] : [...scriptFallbacks, ...exeFallbacks];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // try next candidate
    }
  }

  return null;
};

const getUploadFormat = (file: File): "jpeg" | "png" | "webp" | null => {
  const type = (file.type || "").toLowerCase();

  if (type === JPEG_MIME) {
    return "jpeg";
  }

  if (type === PNG_MIME) {
    return "png";
  }

  if (type === WEBP_MIME || type === WEBP_MIME_ALT) {
    return "webp";
  }

  const extension = path.extname(file.name || "").toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") {
    return "jpeg";
  }
  if (extension === ".png") {
    return "png";
  }
  if (extension === ".webp") {
    return "webp";
  }
  return null;
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "画像ファイルを選択してください。" },
      { status: 400 },
    );
  }

  const uploadFormat = getUploadFormat(file);
  if (!uploadFormat) {
    return NextResponse.json(
      { error: "JPEG / PNG / WebP 形式のみ対応しています。" },
      { status: 400 },
    );
  }

  const titleValue = formData.get("title");
  const tagsValue = formData.get("tags");
  const descriptionValue = formData.get("description");

  const payload: IPTCPayload = {};

  if (typeof titleValue === "string" && titleValue.trim().length > 0) {
    payload.title = titleValue.trim();
  }

  if (typeof descriptionValue === "string" && descriptionValue.trim().length > 0) {
    payload.description = descriptionValue.trim();
  }

  if (typeof tagsValue === "string") {
    const tagList = tagsValue
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (tagList.length > 0) {
      payload.tags = tagList;
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  let buffer: Buffer = Buffer.from(arrayBuffer);

  if (uploadFormat === "png" || uploadFormat === "webp") {
    buffer = await sharp(buffer).jpeg({ quality: 95 }).toBuffer();
  }

  const tempFilePath = path.join(
    os.tmpdir(),
    `iptc-${crypto.randomUUID()}.jpg`,
  );

  const downloadName = sanitizeFilenameForDownload(
    path.parse(file.name || "image").name,
  );

  try {
    await fs.writeFile(tempFilePath, buffer);

    const metadataUpdates: Record<string, string | string[]> = {};

    if (payload.title) {
      metadataUpdates["XMP-dc:Title"] = payload.title;
      metadataUpdates["IPTC:ObjectName"] = payload.title;
    }

    if (payload.description) {
      metadataUpdates["XMP-dc:Description"] = payload.description;
      metadataUpdates["IPTC:Caption-Abstract"] = payload.description;
    }

    if (payload.tags) {
      metadataUpdates["XMP-dc:Subject"] = payload.tags;
      metadataUpdates["IPTC:Keywords"] = payload.tags;
      metadataUpdates["IPTC:CodedCharacterSet"] = "UTF8";
    }

    if (Object.keys(metadataUpdates).length > 0) {
      const exiftoolPath = await findExiftoolPath();
      const exiftool = new ExiftoolProcess(
        (exiftoolPath || undefined) as string | undefined,
      );

      await exiftool.open();
      try {
        await exiftool.writeMetadata(tempFilePath, metadataUpdates, [
          "overwrite_original",
        ]);
      } finally {
        await exiftool.close();
      }
    }

    const updatedBuffer = await fs.readFile(tempFilePath);

    return new NextResponse(updatedBuffer, {
      status: 200,
      headers: {
        "Content-Type": JPEG_MIME,
        "Content-Disposition": `attachment; filename="${downloadName}"`,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "IPTC 書き込み中にエラーが発生しました。";
    console.error("Failed to write IPTC metadata", error);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  } finally {
    await fs.unlink(tempFilePath).catch(() => undefined);
  }
}
