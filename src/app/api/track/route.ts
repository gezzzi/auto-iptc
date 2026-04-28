import { NextResponse, type NextRequest } from "next/server";
import { recordMetric } from "@/lib/site-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }

  const name = typeof (body as { name?: unknown }).name === "string"
    ? (body as { name: string }).name
    : "";
  if (!name || name.length > 64) {
    return NextResponse.json({ error: "bad name" }, { status: 400 });
  }

  const value = typeof (body as { value?: unknown }).value === "number"
    ? (body as { value: number }).value
    : undefined;
  const dim = (body as { dimensions?: unknown }).dimensions;
  const dimensions =
    dim && typeof dim === "object" && !Array.isArray(dim)
      ? (dim as Record<string, unknown>)
      : undefined;

  void recordMetric(name, { value, dimensions });

  return NextResponse.json({ ok: true });
}
