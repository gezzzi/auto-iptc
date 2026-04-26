import { NextResponse } from "next/server";
import { submitSiteAdminEvent } from "@/lib/site-admin";

export const dynamic = "force-dynamic";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export async function POST(req: Request) {
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json" }, { status: 400 });
  }

  const { name, email, subject, message } = body;

  if (
    !isNonEmptyString(name, 100) ||
    !isNonEmptyString(email, 200) ||
    !isNonEmptyString(subject, 200) ||
    !isNonEmptyString(message, 5000)
  ) {
    return NextResponse.json({ success: false, error: "invalid_fields" }, { status: 400 });
  }

  const result = await submitSiteAdminEvent({
    type: "contact_form",
    payload: {
      name,
      email,
      subject,
      message,
      source: "autoiptc.com",
    },
  });

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: result.error ?? "site_admin_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true, id: result.id });
}
