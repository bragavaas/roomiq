// src/app/api/dashboard/country/page-data/route.ts
import { secure } from "@/lib/api/handler";
import { overview, mapMarkers, raw } from "@/mocks/dashboard";

type Filters = {
  start?: string; end?: string; country?: string; city?: string;
  propertyType?: string; minBedrooms?: number; maxBedrooms?: number;
};

const parse = (req: Request): Filters => {
  const url = new URL(req.url);
  const n = (k: string) => (url.searchParams.get(k) ? Number(url.searchParams.get(k)) : undefined);
  return {
    start: url.searchParams.get("start") ?? undefined,
    end: url.searchParams.get("end") ?? undefined,
    country: url.searchParams.get("country") ?? undefined,
    city: url.searchParams.get("city") ?? undefined,
    propertyType: url.searchParams.get("propertyType") ?? undefined,
    minBedrooms: n("minBedrooms"),
    maxBedrooms: n("maxBedrooms"),
  };
};

const normDate = (s?: string) =>
  s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : new Date().toISOString().slice(0, 10);

const prevWindow = (start?: string, end?: string) => {
  if (!start || !end) return { prevStart: undefined, prevEnd: undefined };
  const s = new Date(start + "T00:00:00Z");
  const e = new Date(end + "T00:00:00Z");
  const days = Math.max(1, Math.round((+e - +s) / 86400000) + 1);
  const prevEndDate = new Date(s); prevEndDate.setUTCDate(s.getUTCDate() - 1);
  const prevStartDate = new Date(prevEndDate); prevStartDate.setUTCDate(prevEndDate.getUTCDate() - (days - 1));
  return {
    prevStart: prevStartDate.toISOString().slice(0, 10),
    prevEnd: prevEndDate.toISOString().slice(0, 10),
  };
};

const pctDelta = (curr: number, prev: number) =>
  !isFinite(prev) || Math.abs(prev) < 1e-9 ? null : (curr - prev) / prev;

const bookingsFromRaw = (rawData: { rows: Array<{ date: string; occupiedRooms: number }> }) => {
  const m = new Map<string, number>();
  rawData.rows.forEach(r => m.set(r.date, (m.get(r.date) ?? 0) + r.occupiedRooms));
  return [...m.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([date, value]) => ({ date, value }));
};

export const GET = secure(async (req) => {
  const f = parse(req);

  // default last 90 days if not provided
  let start = f.start, end = f.end;
  if (!start || !end) {
    const today = new Date();
    const endD = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const startD = new Date(endD); startD.setUTCDate(endD.getUTCDate() - 89);
    start = start ?? startD.toISOString().slice(0, 10);
    end = end ?? endD.toISOString().slice(0, 10);
  }
  start = normDate(start); end = normDate(end);

  const currentOverview = overview({ ...f, start, end });
  const currentRaw = raw({ ...f, start, end }, 1, 10_000);
  const markers = mapMarkers({ ...f, start, end });

  const kpis = {
    uniqueProperties: currentOverview.periodSummary.uniqueProperties,
    avgOccupancyRate: currentOverview.periodSummary.avgOccupancyRate,
    avgDailyPrice: currentOverview.periodSummary.avgPrice,
    latestSnapshot: currentOverview.latestSnapshot,
  };

  const { prevStart, prevEnd } = prevWindow(start, end);
  let deltas = {
    uniqueProperties: { value: kpis.uniqueProperties, deltaPct: null as number | null },
    avgOccupancyRate: { value: kpis.avgOccupancyRate, deltaPct: null as number | null },
    avgDailyPrice: { value: kpis.avgDailyPrice, deltaPct: null as number | null },
  };
  if (prevStart && prevEnd) {
    const prevOverview = overview({ ...f, start: prevStart, end: prevEnd });
    deltas = {
      uniqueProperties: { value: kpis.uniqueProperties, deltaPct: pctDelta(kpis.uniqueProperties, prevOverview.periodSummary.uniqueProperties) },
      avgOccupancyRate: { value: kpis.avgOccupancyRate, deltaPct: pctDelta(kpis.avgOccupancyRate, prevOverview.periodSummary.avgOccupancyRate) },
      avgDailyPrice: { value: kpis.avgDailyPrice, deltaPct: pctDelta(kpis.avgDailyPrice, prevOverview.periodSummary.avgPrice) },
    };
  }

  const bookings = { granularity: "daily" as const, series: bookingsFromRaw(currentRaw), window: { start, end } };

  return Response.json({
    filters: { ...f, start, end },
    kpis,
    deltas,
    bookings,
    map: markers,
    meta: { generatedAt: new Date().toISOString(), generationTimeMs: 0, dataVersion: "mock-v1" },
  });
});