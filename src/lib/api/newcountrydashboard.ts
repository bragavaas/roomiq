import "server-only";
import { headers } from "next/headers";
import { getBaseUrl } from "@/lib/http";
import type { CountryDashboardPageData } from "@/types/dashboard-country";

export async function fetchNewCountryDashboardPageData(
  params: Record<string, string | number | undefined>
) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }

  const base = await getBaseUrl();
  const url = `${base}/api/dashboard/country/page-data${qs.size ? `?${qs.toString()}` : ""}`;

  // ✅ forward cookies from the current RSC request so NextAuth can read the session
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      cookie,
      // (optional but harmless) forward language/UA if you care
      "accept-language": h.get("accept-language") ?? "",
      "user-agent": h.get("user-agent") ?? "",
    },
  });

  if (!res.ok) throw new Error(`Failed to load page-data (${res.status})`);
  return (await res.json()) as CountryDashboardPageData;
}