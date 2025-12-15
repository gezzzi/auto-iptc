import { NextRequest, NextResponse } from "next/server";

const CLOUD_RUN_URL = process.env.IPTC_CLOUD_RUN_URL;
const CLOUD_RUN_API_KEY = process.env.IPTC_CLOUD_RUN_API_KEY;

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!CLOUD_RUN_URL) {
    console.error("IPTC_CLOUD_RUN_URL is not configured");
    return NextResponse.json(
      { error: "IPTC service is not configured." },
      { status: 500 }
    );
  }

  if (!CLOUD_RUN_API_KEY) {
    console.error("IPTC_CLOUD_RUN_API_KEY is not configured");
    return NextResponse.json(
      { error: "IPTC service authentication is not configured." },
      { status: 500 }
    );
  }

  try {
    // Forward the incoming FormData to Cloud Run
    const formData = await request.formData();

    const cloudRunResponse = await fetch(`${CLOUD_RUN_URL}/api/iptc/write`, {
      method: "POST",
      headers: {
        "X-API-Key": CLOUD_RUN_API_KEY,
      },
      body: formData,
    });

    if (!cloudRunResponse.ok) {
      // Try to parse error message from Cloud Run
      const contentType = cloudRunResponse.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const errorData = await cloudRunResponse.json();
        return NextResponse.json(
          { error: errorData.error || "IPTC処理中にエラーが発生しました。" },
          { status: cloudRunResponse.status }
        );
      }
      return NextResponse.json(
        { error: "IPTC処理中にエラーが発生しました。" },
        { status: cloudRunResponse.status }
      );
    }

    // Get the image buffer from Cloud Run response
    const imageBuffer = await cloudRunResponse.arrayBuffer();

    // Forward response headers
    const contentDisposition = cloudRunResponse.headers.get("content-disposition");
    const responseHeaders: Record<string, string> = {
      "Content-Type": "image/jpeg",
    };

    if (contentDisposition) {
      responseHeaders["Content-Disposition"] = contentDisposition;
    }

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Failed to call Cloud Run IPTC service:", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "IPTC処理中にエラーが発生しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
