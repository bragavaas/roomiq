import { secure } from "@/lib/api/handler";
import { overview, mapMarkers } from "@/mocks/dashboard";
import { PROPERTIES } from "@/mocks/data.properties";
import { generateDaily } from "@/mocks/data.daily";

export const GET = secure(async (req) => {
  const started = Date.now();
  const url = new URL(req.url);

  const filters = {
    start: url.searchParams.get("start") ?? undefined,
    end: url.searchParams.get("end") ?? undefined,
    country: url.searchParams.get("country") ?? undefined,
    city: url.searchParams.get("city") ?? undefined,
    propertyType: url.searchParams.get("propertyType") ?? undefined,
    minBedrooms: url.searchParams.get("minBedrooms") ? Number(url.searchParams.get("minBedrooms")) : undefined,
    maxBedrooms: url.searchParams.get("maxBedrooms") ? Number(url.searchParams.get("maxBedrooms")) : undefined,
  } as const;

  const ov = overview(filters);
  const map = mapMarkers(filters);

  // Build a simple daily bookings series (sum of occupiedRooms per day) for the window.
  const daily = generateDaily(90);
  const propertyMatches = (p: (typeof PROPERTIES)[number]) => {
    if (filters.country && p.country !== filters.country) return false;
    if (filters.city && p.city !== filters.city) return false;
    if (filters.propertyType && p.propertyType !== filters.propertyType) return false;
    if (filters.minBedrooms && p.bedrooms < filters.minBedrooms) return false;
    if (filters.maxBedrooms && p.bedrooms > filters.maxBedrooms) return false;
    return true;
  };
  const propertyIds = new Set(PROPERTIES.filter(propertyMatches).map((p) => p.propertyId));
  const startDate = filters.start;
  const endDate = filters.end ?? ov.latestSnapshot.asOf;
  const seriesMap = new Map<string, number>();
  for (const r of daily) {
    if (!propertyIds.has(r.propertyId)) continue;
    if (startDate && r.date < startDate) continue;
    if (endDate && r.date > endDate) continue;
    seriesMap.set(r.date, (seriesMap.get(r.date) ?? 0) + r.occupiedRooms);
  }
  const series = [...seriesMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));

  const payload = {
    filters,
    kpis: {
      uniqueProperties: ov.periodSummary.uniqueProperties,
      avgOccupancyRate: ov.periodSummary.avgOccupancyRate,
      avgDailyPrice: ov.periodSummary.avgPrice,
      latestSnapshot: ov.latestSnapshot,
    },
    deltas: {
      uniqueProperties: { value: ov.periodSummary.uniqueProperties, deltaPct: null },
      avgOccupancyRate: { value: ov.periodSummary.avgOccupancyRate, deltaPct: null },
      avgDailyPrice: { value: ov.periodSummary.avgPrice, deltaPct: null },
    },
    bookings: {
      granularity: "daily" as const,
      series,
      window: {
        start: series[0]?.date ?? endDate,
        end: series[series.length - 1]?.date ?? endDate,
      },
    },
    map,
    meta: {
      generatedAt: new Date().toISOString(),
      generationTimeMs: Date.now() - started,
      dataVersion: "mock-v1",
    },
  };

  return Response.json(payload);
});

