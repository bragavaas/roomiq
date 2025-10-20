import "server-only";
import type { CountryDashboardPageData } from "@/types/newcountrydashboard";

export async function fetchCountryDashboardPageData(params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  const res = await fetch(`/api/dashboard/country/page-data?${qs.toString()}`, {
    cache: "no-store", // or revalidate: 60 if you want caching
  });
  if (!res.ok) throw new Error("Failed to load country dashboard data");
  return (await res.json()) as CountryDashboardPageData;
}
