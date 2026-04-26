export type SiteAdminEventInput = {
  type: string;
  payload: Record<string, unknown>;
};

export type SiteAdminMetricOptions = {
  value?: number;
  dimensions?: Record<string, unknown>;
};

export async function submitSiteAdminEvent(
  event: SiteAdminEventInput,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const url = process.env.SITE_ADMIN_URL;
  const key = process.env.SITE_ADMIN_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[site-admin] SITE_ADMIN_URL / SITE_ADMIN_KEY missing; skipping event");
    }
    return { ok: false, error: "env-missing" };
  }

  try {
    const res = await fetch(`${url}/api/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(event),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[site-admin] ingest failed (${res.status}): ${detail}`);
      return { ok: false, error: `http-${res.status}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[site-admin] ingest threw:", err);
    return { ok: false, error: "network" };
  }
}

export async function recordMetric(
  name: string,
  options: SiteAdminMetricOptions = {},
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const url = process.env.SITE_ADMIN_URL;
  const key = process.env.SITE_ADMIN_KEY;

  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[site-admin] SITE_ADMIN_URL / SITE_ADMIN_KEY missing; skipping metric");
    }
    return { ok: false, error: "env-missing" };
  }

  try {
    const res = await fetch(`${url}/api/metrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ name, ...options }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[site-admin] metric failed (${res.status}): ${detail}`);
      return { ok: false, error: `http-${res.status}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    console.error("[site-admin] metric threw:", err);
    return { ok: false, error: "network" };
  }
}
