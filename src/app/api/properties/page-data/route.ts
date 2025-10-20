import { secure } from "@/lib/api/handler";
import { overview, mapMarkers, raw } from "@/mocks/dashboard";

// ---- types (optional but useful in app code) ----
type Filters = {
  start?: string;
  end?: string;
  country?: string;
  city?: string;
  propertyType?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
};

type KPI = {
  uniqueProperties: number;
  avgOccupancyRate: number; // 0..1
  avgDailyPrice: number;    // currency-agnostic
  latestSnapshot: {
    asOf: string;
    activeProperties: number;
    occupancyRate: number;  // 0..1
    avgPrice: number;       // daily
  };
};

type Delta = { value: number; deltaPct: number | null };

function parseFilters(url: URL): Filters {
  const getNum = (k: string) => {
    const v = url.searchParams.get(k);
    return v == null ? undefined : Number(v);
  };
  return {
    start: url.searchParams.get("start") ?? undefined,
    end: url.searchParams.get("end") ?? undefined,
    country: url.searchParams.get("country") ?? undefined,
    city: url.searchParams.get("city") ?? undefined,
    propertyType: url.searchParams.get("propertyType") ?? undefined,
    minBedrooms: getNum("minBedrooms"),
    maxBedrooms: getNum("maxBedrooms"),
  };
}

function normalizeDate(d: string) {
  // expects YYYY-MM-DD; fallback to today if bad
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : new Date().toISOString().slice(0, 10);
}

function previousWindow(start?: string, end?: string) {
  if (!start || !end) return { prevStart: undefined as string|undefined, prevEnd: undefined as string|undefined };
  const s = new Date(start + "T00:00:00Z");
  const e = new Date(end + "T00:00:00Z");
  const days = Math.max(1, Math.round((+e - +s) / 86400000) + 1);
  const prevEndDate = new Date(s);
  prevEndDate.setUTCDate(s.getUTCDate() - 1);
  const prevStartDate = new Date(prevEndDate);
  prevStartDate.setUTCDate(prevEndDate.getUTCDate() - (days - 1));
  return {
    prevStart: prevStartDate.toISOString().slice(0, 10),
    prevEnd: prevEndDate.toISOString().slice(0, 10),
  };
}

function pctDelta(curr: number, prev: number): number | null {
  if (!isFinite(prev) || Math.abs(prev) < 1e-9) return null;
  return (curr - prev) / prev;
}

function toBookingsSeries(rawData: { rows: Array<{ date: string; occupiedRooms: number }> }) {
  const map = new Map<string, number>();
  for (const r of rawData.rows) {
    map.set(r.date, (map.get(r.date) ?? 0) + r.occupiedRooms);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

export const GET = secure(async (req) => {
  const t0 = performance.now();
  const url = new URL(req.url);
  const filters = parseFilters(url);

  // Ensure start/end if UI didn’t pass them (default: last 90d)
  let { start, end } = filters;
  if (!start || !end) {
    const today = new Date();
    const endD = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const startD = new Date(endD);
    startD.setUTCDate(endD.getUTCDate() - 89);
    start = start ?? startD.toISOString().slice(0, 10);
    end = end ?? endD.toISOString().slice(0, 10);
  }
  start = normalizeDate(start);
  end = normalizeDate(end);

  // Compose current period results
  const currentOverview = overview({ ...filters, start, end });
  const currentRaw = raw({ ...filters, start, end }, 1, 10_000);
  const bookings = toBookingsSeries(currentRaw);
  const markers = mapMarkers({ ...filters, start, end });

  // Build KPI block
  const kpi: KPI = {
    uniqueProperties: currentOverview.periodSummary.uniqueProperties,
    avgOccupancyRate: currentOverview.periodSummary.avgOccupancyRate,
    avgDailyPrice: currentOverview.periodSummary.avgPrice,
    latestSnapshot: currentOverview.latestSnapshot,
  };

  // Deltas vs previous period (for trend badges)
  const { prevStart, prevEnd } = previousWindow(start, end);
  let deltas: {
    uniqueProperties: Delta;
    avgOccupancyRate: Delta;
    avgDailyPrice:    Delta;
  } = {
    uniqueProperties: { value: kpi.uniqueProperties, deltaPct: null },
    avgOccupancyRate: { value: kpi.avgOccupancyRate, deltaPct: null },
    avgDailyPrice:    { value: kpi.avgDailyPrice,    deltaPct: null },
  };

  if (prevStart && prevEnd) {
    const prevOverview = overview({ ...filters, start: prevStart, end: prevEnd });
    deltas = {
      uniqueProperties: {
        value: kpi.uniqueProperties,
        deltaPct: pctDelta(kpi.uniqueProperties, prevOverview.periodSummary.uniqueProperties),
      },
      avgOccupancyRate: {
        value: kpi.avgOccupancyRate,
        deltaPct: pctDelta(kpi.avgOccupancyRate, prevOverview.periodSummary.avgOccupancyRate),
      },
      avgDailyPrice: {
        value: kpi.avgDailyPrice,
        deltaPct: pctDelta(kpi.avgDailyPrice, prevOverview.periodSummary.avgPrice),
      },
    };
  }

  const t1 = performance.now();

  return Response.json({
    filters: { ...filters, start, end },
    kpis: kpi,
    deltas,                 // use for “+13.7%” badges (multiply by 100 for %)
    bookings: {
      granularity: "daily",
      series: bookings,     // [{ date, value }]
      window: { start, end }
    },
    map: markers,           // { asOf, markers: [...] }
    meta: {
      generatedAt: new Date().toISOString(),
      generationTimeMs: Math.round((t1 - t0) * 100) / 100,
      dataVersion: "mock-v1"
    }
  });
});
