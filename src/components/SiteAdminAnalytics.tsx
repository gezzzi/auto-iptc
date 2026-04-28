"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SiteAdminAnalytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const query = search.toString();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        name: "page_view",
        dimensions: {
          path: pathname,
          query: query || undefined,
          referrer: document.referrer || undefined,
        },
      }),
    }).catch(() => {
      /* analytics is fire-and-forget */
    });
  }, [pathname, search]);

  return null;
}
