import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import { ExiftoolProcess } from "node-exiftool";
import distExiftool from "dist-exiftool";
import sharp from "sharp";

// ============================================================================
// Types
// ============================================================================

type IPTCPayload = {
  title?: string;
  tags?: string[];
  description?: string;
};

// ============================================================================
// Constants
// ============================================================================

const PORT = parseInt(process.env.PORT || "8080", 10);
const API_KEY = process.env.IPTC_API_KEY || "";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const JPEG_MIME = "image/jpeg";
const PNG_MIME = "image/png";
const WEBP_MIME = "image/webp";
const WEBP_MIME_ALT = "image/x-webp";

// ============================================================================
// Utilities
// ============================================================================

const sanitizeFilenameForDownload = (baseName: string): string => {
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

  // Prefer exiftool binary in standard locations
  const candidates = [
    normalized,
    "/usr/bin/exiftool", // Linux system install
    path.join(path.dirname(normalized), "exiftool"),
    path.join(process.cwd(), "node_modules", "dist-exiftool", "vendor", "exiftool"),
  ];

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

const getUploadFormat = (
  mimetype: string,
  filename: string
): "jpeg" | "png" | "webp" | null => {
  const type = (mimetype || "").toLowerCase();

  if (type === JPEG_MIME) {
    return "jpeg";
  }

  if (type === PNG_MIME) {
    return "png";
  }

  if (type === WEBP_MIME || type === WEBP_MIME_ALT) {
    return "webp";
  }

  const extension = path.extname(filename || "").toLowerCase();
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

// ============================================================================
// Middleware
// ============================================================================

// API Key authentication middleware
const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!API_KEY) {
    // If no API key is configured, skip authentication (for development)
    console.warn("Warning: IPTC_API_KEY is not set. Authentication is disabled.");
    next();
    return;
  }

  const providedKey = req.headers["x-api-key"];

  if (!providedKey || providedKey !== API_KEY) {
    res.status(401).json({ error: "Unauthorized: Invalid or missing API key" });
    return;
  }

  next();
};

// ============================================================================
// Express App Setup
// ============================================================================

const app = express();

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (ALLOWED_ORIGINS.length === 0) {
      // If no allowed origins are configured, allow all (for development)
      console.warn("Warning: ALLOWED_ORIGINS is not set. Allowing all origins.");
      callback(null, true);
      return;
    }

    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-API-Key"],
};

app.use(cors(corsOptions));

// Multer for file uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Health check endpoint
app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "iptc-api" });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

// ============================================================================
// IPTC Write Endpoint
// ============================================================================

app.post(
  "/api/iptc/write",
  authenticateApiKey,
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "画像ファイルを選択してください。" });
      return;
    }

    const uploadFormat = getUploadFormat(req.file.mimetype, req.file.originalname);
    if (!uploadFormat) {
      res.status(400).json({ error: "JPEG / PNG / WebP 形式のみ対応しています。" });
      return;
    }

    const titleValue = req.body.title;
    const tagsValue = req.body.tags;
    const descriptionValue = req.body.description;

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

    let buffer: Buffer = req.file.buffer;

    // Convert PNG/WebP to JPEG
    if (uploadFormat === "png" || uploadFormat === "webp") {
      buffer = await sharp(buffer).jpeg({ quality: 95 }).toBuffer();
    }

    const tempFilePath = path.join(os.tmpdir(), `iptc-${crypto.randomUUID()}.jpg`);
    const downloadName = sanitizeFilenameForDownload(
      path.parse(req.file.originalname || "image").name
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
          (exiftoolPath || undefined) as string | undefined
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

      res.set({
        "Content-Type": JPEG_MIME,
        "Content-Disposition": `attachment; filename="${downloadName}"`,
      });
      res.send(updatedBuffer);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "IPTC 書き込み中にエラーが発生しました。";
      console.error("Failed to write IPTC metadata", error);
      res.status(500).json({ error: message });
    } finally {
      await fs.unlink(tempFilePath).catch(() => undefined);
    }
  }
);

// ============================================================================
// Start Server
// ============================================================================

app.listen(PORT, () => {
  console.log(`IPTC API server listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`IPTC write endpoint: POST http://localhost:${PORT}/api/iptc/write`);
});

