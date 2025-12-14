"use client";

import JSZip from "jszip";
import Image from "next/image";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type SVGProps,
} from "react";

type MetadataLanguage = "en" | "ja";
type Status = "idle" | "pending" | "success" | "error";

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
  title: string;
  description: string;
  tags: string;
  metadataStatus: Status;
  iptcStatus: Status;
  iptcMessage?: string;
};

type MetadataResponse = {
  results?: Array<{
    id?: string;
    title?: string;
    description?: string;
    tags?: string[] | string;
  }>;
  error?: string;
};

const MAX_UPLOADS = 40;
const SUPPORTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/x-webp",
]);

const formatTimestampForFile = (timestamp: number) => {
  const d = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  const ss = pad(d.getSeconds());
  return `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
};

const formatBytes = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const extractFilename = (contentDisposition: string | null) => {
  if (!contentDisposition) return null;
  const match = contentDisposition.match(/filename=\"?([^\";]+)\"?/i);
  return match?.[1] ?? null;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const trimText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const readErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as { error?: unknown };
    if (typeof data?.error === "string" && data.error.trim().length > 0) {
      return data.error;
    }
  } catch {
    // fall back to text
  }

  try {
    const text = await response.text();
    if (text.trim().length > 0) {
      return text.trim();
    }
  } catch {
    // ignore
  }

  return `IPTC 書き込みに失敗しました (HTTP ${response.status})`;
};

const ZapIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M13 2 4 13.5h6.5L9.5 22 20 9.8h-6.4z" />
  </svg>
);

const SparklesIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17 3.5 18.5 8 23 9.5 18.5 11 17 15.5 15.5 11 11 9.5 15.5 8z" />
    <path d="M9.5 16 11 19l3 1.5-3 1.5L9.5 25 8 22l-3-1.5 3-1.5z" />
    <path d="m23 18 1.5 4L29 24l-4.5 2-1.5 4-1.5-4L17 24l4.5-2z" />
  </svg>
);

export default function Home() {
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [language, setLanguage] = useState<MetadataLanguage>("ja");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [metadataMessage, setMetadataMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWritingAll, setIsWritingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalSize = useMemo(
    () => uploads.reduce((sum, item) => sum + item.size, 0),
    [uploads],
  );

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return;

      setErrorMessage(null);
      const files = Array.from(fileList);
      const availableSlots = Math.max(0, MAX_UPLOADS - uploads.length);

      const accepted: UploadedImage[] = [];
      const rejected: string[] = [];

      for (const file of files.slice(0, availableSlots)) {
        const type = (file.type || "").toLowerCase();
        const name = file.name || "image";

        const isSupported =
          SUPPORTED_TYPES.has(type) || /\.(?:jpe?g|png|webp)$/i.test(name);
        if (!isSupported) {
          rejected.push(name);
          continue;
        }

        const id = crypto.randomUUID();
        const previewUrl = URL.createObjectURL(file);

        accepted.push({
          id,
          file,
          previewUrl,
          name,
          size: file.size,
          type: type || "image/*",
          title: "",
          description: "",
          tags: "",
          metadataStatus: "idle",
          iptcStatus: "idle",
          iptcMessage: undefined,
        });
      }

      if (accepted.length > 0) {
        setUploads((prev) => [...accepted, ...prev].slice(0, MAX_UPLOADS));
      }

      if (rejected.length > 0) {
        setErrorMessage(
          `非対応の形式をスキップしました（JPEG / PNG / WebP のみ）。 ${rejected.join(", ")}`,
        );
      } else if (accepted.length === 0) {
        setErrorMessage("追加できるファイルがありません。");
      }

      resetFileInput();
    },
    [uploads.length],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      addFiles(event.dataTransfer?.files ?? null);
    },
    [addFiles],
  );

  const handleRemove = useCallback((id: string) => {
    setUploads((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const clearUploads = useCallback(() => {
    setUploads((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    setErrorMessage(null);
    setMetadataMessage(null);
    resetFileInput();
  }, []);

  const updateField = useCallback(
    (id: string, field: "title" | "description" | "tags", value: string) => {
      setUploads((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                [field]: value,
                iptcStatus: "idle",
                iptcMessage: undefined,
              }
            : item,
        ),
      );
    },
    [],
  );

  const handleGenerateMetadata = useCallback(
    async (targets?: UploadedImage[]) => {
      const targetList = (targets && targets.length > 0 ? targets : uploads).slice(
        0,
        MAX_UPLOADS,
      );

      if (targetList.length === 0) {
        setErrorMessage("まず画像をアップロードしてください。");
        return;
      }

      const targetIds = new Set(targetList.map((item) => item.id));

      setIsGenerating(true);
      setMetadataMessage(null);
      setErrorMessage(null);

      setUploads((prev) =>
        prev.map((item) =>
          targetIds.has(item.id)
            ? { ...item, metadataStatus: "pending" as Status }
            : item,
        ),
      );

      try {
        const formData = new FormData();
        formData.append(
          "meta",
          JSON.stringify(
            targetList.map((item) => ({
              id: item.id,
              name: item.name,
            })),
          ),
        );
        formData.append("language", language);
        targetList.forEach((item) => formData.append("files", item.file, item.name));

        const response = await fetch("/api/gemini/metadata", {
          method: "POST",
          body: formData,
        });

        const body = (await response.json()) as MetadataResponse;
        if (!response.ok) {
          throw new Error(body.error ?? "メタデータ生成に失敗しました。");
        }

        const results = body.results ?? [];
        const resultMap = new Map<
          string,
          { title?: string; description?: string; tags?: string[] | string }
        >();

        results.forEach((item) => {
          if (item?.id) {
            resultMap.set(item.id, {
              title: item.title,
              description: item.description,
              tags: item.tags,
            });
          }
        });

        const missing = new Set(targetIds);
        resultMap.forEach((_value, key) => missing.delete(key));

        setUploads((prev) =>
          prev.map((item) => {
            if (!targetIds.has(item.id)) return item;
            const match = resultMap.get(item.id);
            if (!match) {
              return { ...item, metadataStatus: "error" as Status };
            }

            const tagsText = Array.isArray(match.tags)
              ? match.tags
                  .map((tag) => trimText(tag))
                  .filter((tag) => tag.length > 0)
                  .join(", ")
              : trimText(match.tags);

            return {
              ...item,
              title: trimText(match.title) || item.title,
              description: trimText(match.description) || item.description,
              tags: tagsText || item.tags,
              metadataStatus: "success" as Status,
              iptcStatus: "idle" as Status,
              iptcMessage: undefined,
            };
          }),
        );

        if (missing.size > 0) {
          setMetadataMessage({
            type: "error",
            text: `${missing.size} 件の画像でメタデータを取得できませんでした。`,
          });
        } else {
          setMetadataMessage({
            type: "success",
            text: `${resultMap.size} 件のメタデータを反映しました。`,
          });
        }
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Gemini 呼び出し中にエラーが発生しました。";
        setErrorMessage(message);
        setMetadataMessage({ type: "error", text: message });
        setUploads((prev) =>
          prev.map((item) =>
            targetIds.has(item.id)
              ? { ...item, metadataStatus: "error" as Status }
              : item,
          ),
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [language, uploads],
  );

  const writeIptc = useCallback(
    async (
      upload: UploadedImage,
      options?: { skipDownload?: boolean },
    ): Promise<{ success: true; blob: Blob; filename: string } | { success: false }> => {
      const pendingMessage = options?.skipDownload ? "ZIP に追加中…" : "IPTC 書き込み中…";
      setUploads((prev) =>
        prev.map((item) =>
          item.id === upload.id
            ? {
                ...item,
                iptcStatus: "pending",
                iptcMessage: pendingMessage,
              }
            : item,
        ),
      );

      try {
        const formData = new FormData();
        formData.append("file", upload.file);
        if (upload.title.trim()) {
          formData.append("title", upload.title.trim());
        }
        if (upload.tags.trim()) {
          formData.append("tags", upload.tags.trim());
        }
        if (upload.description.trim()) {
          formData.append("description", upload.description.trim());
        }

        const response = await fetch("/api/iptc/write", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const message = await readErrorMessage(response);
          throw new Error(message);
        }

        const blob = await response.blob();
        const contentDisposition = response.headers.get("Content-Disposition");
        const downloadName =
          extractFilename(contentDisposition) ||
          `${(upload.name || "image").replace(/\.[^.]+$/, "")}-iptc.jpg`;

        if (!options?.skipDownload) {
          downloadBlob(blob, downloadName);
        }

        setUploads((prev) =>
          prev.map((item) =>
            item.id === upload.id
              ? {
                  ...item,
                  iptcStatus: "success",
                  iptcMessage: options?.skipDownload ? "ZIP に追加済み" : "IPTC 書き込み済み",
                }
              : item,
          ),
        );

        return { success: true, blob, filename: downloadName };
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "IPTC 書き込み中にエラーが発生しました。";
        setErrorMessage(message);
        setUploads((prev) =>
          prev.map((item) =>
            item.id === upload.id
              ? {
                  ...item,
                  iptcStatus: "error",
                  iptcMessage: message,
                }
              : item,
          ),
        );
      }

      return { success: false };
    },
    [],
  );

  const handleWriteIptc = useCallback(
    async (upload: UploadedImage) => {
      await writeIptc(upload);
    },
    [writeIptc],
  );

  const handleWriteAll = useCallback(async () => {
    if (!uploads.length) {
      setErrorMessage("まず画像をアップロードしてください。");
      return;
    }

    setIsWritingAll(true);
    setErrorMessage(null);

    try {
      const zip = new JSZip();
      let successCount = 0;

      for (const upload of uploads) {
        const result = await writeIptc(upload, { skipDownload: true });
        if (result.success) {
          zip.file(result.filename, result.blob);
          successCount += 1;
        }
      }

      if (successCount === 0) {
        setErrorMessage("ZIP の作成に失敗しました。");
        return;
      }

      const content = await zip.generateAsync({ type: "blob" });
      downloadBlob(content, `iptc_download_${formatTimestampForFile(Date.now())}.zip`);

      if (successCount < uploads.length) {
        setErrorMessage(
          `${uploads.length - successCount} 件で IPTC 書き込みに失敗しました。成功分のみ ZIP に含まれています。`,
        );
      }
    } finally {
      setIsWritingAll(false);
    }
  }, [uploads, writeIptc]);

  return (
    <main className="relative min-h-screen bg-[#FFDEE9] pb-24 font-[var(--font-space-mono)] text-black">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-cross opacity-35"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12">
        <header className="relative mb-20 border-4 border-black bg-[#FF0080] p-8 text-white shadow-[8px_8px_0px_0px_#000] transition-transform duration-300 hover:rotate-0 md:rotate-1">
          <div className="flex flex-col gap-4">
            <p className="text-4xl font-bold uppercase leading-[0.85] tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.7)] md:text-7xl">
              AUTO IPTC
            </p>
            <span className="w-fit -rotate-1 bg-black px-4 py-1 text-base font-bold uppercase tracking-[0.2em] text-[#FAFF00] shadow-[4px_4px_0px_rgba(255,255,255,1)] md:text-xl">
              Gemini Flash v2.5
            </span>
            <p className="max-w-3xl text-sm uppercase tracking-[0.3em] text-slate-100">
              アップロード画像に対して Gemini でタイトル・説明・タグを生成し、IPTC として書き込みできます
            </p>
          </div>
          <div className="absolute -right-6 -top-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-black bg-[#FAFF00] text-black shadow-[4px_4px_0px_0px_#000]">
            <ZapIcon className="h-8 w-8" />
          </div>
        </header>

        <section className="relative">
          <div className="relative z-10 transform border-4 border-black bg-white p-8 shadow-[12px_12px_0px_0px_#000] md:-rotate-1">
            <div className="grid gap-6 md:grid-cols-[2fr_1fr] md:items-start">
              <div className="grid gap-3">
                <label
                  htmlFor="file-input"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  className="relative flex min-h-44 cursor-pointer flex-col items-center justify-center border-4 border-dashed border-black bg-[#F2F2F2] px-6 py-6 text-center text-sm uppercase tracking-[0.2em] transition hover:-translate-y-1 hover:-translate-x-1 hover:bg-[#FAFF00]/70"
                >
                  <input
                    id="file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(event) => addFiles(event.target.files)}
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-black">
                    JPEG / PNG / WebP
                  </span>
                  <p className="mt-2 max-w-md text-base font-bold uppercase tracking-[0.2em]">
                    ここにドロップ or クリックで選択
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-black/60">
                    最大 {MAX_UPLOADS} 枚まで追加可能
                  </p>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded border-4 border-black bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_#000]">
                    <span>メタデータ言語</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-pressed={language === "en"}
                        onClick={() => setLanguage("en")}
                        className={`border-2 border-black px-3 py-1 transition ${
                          language === "en"
                            ? "bg-[#FAFF00]"
                            : "bg-white hover:bg-[#FAFF00]/60"
                        }`}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        aria-pressed={language === "ja"}
                        onClick={() => setLanguage("ja")}
                        className={`border-2 border-black px-3 py-1 transition ${
                          language === "ja"
                            ? "bg-[#FAFF00]"
                            : "bg-white hover:bg-[#FAFF00]/60"
                        }`}
                      >
                        日本語
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-xs uppercase tracking-[0.25em] text-black">
                    <span>アップロード: {uploads.length} / {MAX_UPLOADS}</span>
                    <span>合計サイズ: {formatBytes(totalSize)}</span>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 rounded-lg border-4 border-black bg-[#F2F2F2] p-4 shadow-[6px_6px_0px_0px_#000]">
                <p className="text-sm font-bold uppercase tracking-[0.2em]">
                  アクション
                </p>
                <button
                  type="button"
                  onClick={() => handleGenerateMetadata()}
                  disabled={!uploads.length || isGenerating}
                  className="flex items-center justify-center gap-2 border-4 border-black bg-[#FAFF00] px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] transition hover:-translate-y-1 hover:-translate-x-1 hover:bg-[#FAFF00] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? "Gemini 生成中…" : "AI でまとめてメタデータ生成"}
                </button>
                <button
                  type="button"
                  onClick={handleWriteAll}
                  disabled={!uploads.length || isWritingAll}
                  className="flex items-center justify-center gap-2 border-4 border-black bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] transition hover:-translate-y-1 hover:-translate-x-1 hover:bg-[#00E5FF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isWritingAll ? "ZIP 作成中…" : "全件 IPTC 付きでDL (ZIP)"}
                </button>
                <button
                  type="button"
                  onClick={clearUploads}
                  className="flex items-center justify-center gap-2 border-4 border-black bg-black px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:-translate-y-1 hover:-translate-x-1 hover:bg-[#FAFF00] hover:text-black"
                >
                  アップロードをクリア
                </button>
                <p className="text-[11px] uppercase tracking-[0.25em] text-black/70">
                  <span className="block">おすすめの使い方：</span>
                  <span className="block">①画像をアップロード</span>
                  <span className="block">②AIでまとめてメタデータ生成</span>
                  <span className="block">③全件IPTC付きでDL</span>
                </p>
                {metadataMessage && (
                  <p
                    className={`text-[11px] font-bold uppercase tracking-[0.2em] ${
                      metadataMessage.type === "success" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {metadataMessage.text}
                  </p>
                )}
              </div>
            </div>
          </div>

          {errorMessage && (
            <p className="mt-6 border-4 border-black bg-red-500 px-6 py-4 text-center text-base font-bold uppercase text-white shadow-[8px_8px_0px_0px_#000]">
              エラー: {errorMessage}
            </p>
          )}
        </section>

        {uploads.length > 0 ? (
          <section className="mt-20">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-4">
                <h2 className="text-3xl font-bold uppercase tracking-tighter">
                  アップロード済み
                </h2>
                <p className="text-xs uppercase tracking-[0.4em] text-black/60">
                  {uploads.length} 件
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-black/70">
                <span>ドラッグで並べ替え不要、上から順に処理</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {uploads.map((upload) => {
                const statusColor =
                  upload.iptcStatus === "success"
                    ? "text-green-700"
                    : upload.iptcStatus === "error"
                      ? "text-red-700"
                      : "text-blue-700";
                return (
                  <article
                    key={upload.id}
                    className="group relative border-4 border-black bg-white shadow-[12px_12px_0px_0px_#000] transition hover:-translate-y-2 hover:shadow-[16px_16px_0px_0px_#000]"
                  >
                    <span className="absolute left-4 top-4 -rotate-6 border-4 border-black bg-[#FAFF00] px-3 py-1 text-xs font-bold uppercase shadow-[4px_4px_0px_0px_#000]">
                      アップロード
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(upload.id)}
                      className="absolute right-3 top-3 z-10 border-2 border-black bg-white px-2 py-1 text-xs font-bold uppercase tracking-[0.1em] shadow-[3px_3px_0px_0px_#000] transition-colors opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-red-500 hover:text-white"
                      aria-label="画像を削除"
                    >
                      ✕
                    </button>
                    <div className="relative overflow-hidden border-b-4 border-black bg-[#F8F8F8]">
                      <Image
                        src={upload.previewUrl}
                        alt={upload.name}
                        width={900}
                        height={600}
                        unoptimized
                        className="h-64 w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="truncate text-sm uppercase tracking-[0.15em]">
                        {upload.name}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-black/60">
                        <span>{formatBytes(upload.size)}</span>
                        <span>{upload.type || "image"}</span>
                      </div>
                      <div className="mt-4 grid gap-3 rounded border-2 border-black bg-[#F2F2F2] p-3 shadow-[4px_4px_0px_0px_#000]">
                        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.2em] text-black">
                          <span>タイトル</span>
                          <input
                            type="text"
                            value={upload.title}
                            onChange={(event) =>
                              updateField(upload.id, "title", event.target.value)
                            }
                            className="border-2 border-black px-3 py-2 text-xs uppercase tracking-[0.1em] outline-none focus:bg-[#FAFF00]"
                            placeholder="タイトルを入力"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.2em] text-black">
                          <span>説明</span>
                          <textarea
                            value={upload.description}
                            onChange={(event) =>
                              updateField(upload.id, "description", event.target.value)
                            }
                            className="h-20 border-2 border-black px-3 py-2 text-xs uppercase tracking-[0.1em] outline-none focus:bg-[#FAFF00]"
                            placeholder="1文でシーンを説明"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.2em] text-black">
                          <span>タグ (カンマ区切り)</span>
                          <input
                            type="text"
                            value={upload.tags}
                            onChange={(event) =>
                              updateField(upload.id, "tags", event.target.value)
                            }
                            className="border-2 border-black px-3 py-2 text-xs uppercase tracking-[0.1em] outline-none focus:bg-[#FAFF00]"
                            placeholder="例: portrait, neon, dusk"
                          />
                        </label>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleWriteIptc(upload)}
                            disabled={upload.iptcStatus === "pending" || isWritingAll}
                            className="border-2 border-black bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#FAFF00] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {upload.iptcStatus === "pending" ? "書き込み中…" : "IPTC 付きでDL"}
                          </button>
                          {upload.iptcMessage && (
                            <p
                              className={`${statusColor} text-left text-[11px] font-bold uppercase tracking-[0.2em]`}
                            >
                              {upload.iptcMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="mt-32 select-none text-center opacity-60">
            <div className="mb-4 flex justify-center text-black/40">
              <SparklesIcon className="h-32 w-32" />
            </div>
            <p className="inline-block -rotate-3 border-4 border-black bg-black px-4 py-2 text-2xl font-bold uppercase tracking-tight text-white">
              アップロードなし
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
