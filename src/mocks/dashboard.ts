import { PROPERTIES } from "./data.properties";
import { generateDaily } from "./data.daily";
import type { DailyMetric, BedroomsCount, TypeCount, BucketCount, TrendPoint } from "./types";

const DAILY = generateDaily(90);

type Filters = {
  start?: string;
  end?: string;
  country?: string;
  city?: string;
  propertyType?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
};

function inRange(date: string, start?: string, end?: string) {
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

function propertyMatches(p: typeof PROPERTIES[number], f: Filters) {
  if (f.country && p.country !== f.country) return false;
  if (f.city && p.city !== f.city) return false;
  if (f.propertyType && p.propertyType !== f.propertyType) return false;
  if (f.minBedrooms && p.bedrooms < f.minBedrooms) return false;
  if (f.maxBedrooms && p.bedrooms > f.maxBedrooms) return false;
  return true;
}

function filterDaily(f: Filters) {
  const ids = new Set(PROPERTIES.filter((p) => propertyMatches(p, f)).map((p) => p.propertyId));
  return DAILY.filter((d) => ids.has(d.propertyId) && inRange(d.date, f.start, f.end));
}

export function overview(f: Filters) {
  const rows = filterDaily(f);
  const byProp = new Map<string, DailyMetric[]>();
  rows.forEach((r) => {
    if (!byProp.has(r.propertyId)) byProp.set(r.propertyId, []);
    byProp.get(r.propertyId)!.push(r);
  });

  const uniqueProperties = byProp.size;
  let totalRevenue = 0;
  let occSum = 0;
  let priceSum = 0;
  let n = 0;

  rows.forEach((r) => {
    totalRevenue += r.revenue;
    occSum += r.occupancyRate;
    priceSum += r.avgRate;
    n++;
  });

  // latest snapshot = last date in the filtered set
  const lastDate = rows.reduce((max, r) => (r.date > max ? r.date : max), "0000-00-00");
  const latestRows = rows.filter((r) => r.date === lastDate);
  const latestActive = new Set(latestRows.map((r) => r.propertyId)).size;
  const latestOcc = latestRows.reduce((s, r) => s + r.occupancyRate, 0) / Math.max(1, latestRows.length);
  const latestPrice = latestRows.reduce((s, r) => s + r.avgRate, 0) / Math.max(1, latestRows.length);

  // distributions (latest day)
  const latestIds = new Set(latestRows.map((r) => r.propertyId));
  const latestProps = PROPERTIES.filter((p) => latestIds.has(p.propertyId));
  const typeMap = new Map<string, number>();
  const bedroomMap = new Map<number, number>();
  const occBuckets: BucketCount[] = [
    { bucket: "0–20%", properties: 0 },
    { bucket: "20–40%", properties: 0 },
    { bucket: "40–60%", properties: 0 },
    { bucket: "60–80%", properties: 0 },
    { bucket: "80–100%", properties: 0 },
  ];

  latestProps.forEach((p) => {
    typeMap.set(p.propertyType, (typeMap.get(p.propertyType) ?? 0) + 1);
    bedroomMap.set(p.bedrooms, (bedroomMap.get(p.bedrooms) ?? 0) + 1);
  });

  latestRows.forEach((r) => {
    const pct = r.occupancyRate;
    const idx = pct < 0.2 ? 0 : pct < 0.4 ? 1 : pct < 0.6 ? 2 : pct < 0.8 ? 3 : 4;
    occBuckets[idx].properties += 1;
  });

  const propertyTypes: TypeCount[] = [...typeMap.entries()].map(([type, count]) => ({ type: type as any, count }));
  const bedrooms: BedroomsCount[] = [...bedroomMap.entries()].map(([bedrooms, properties]) => ({ bedrooms, properties }));

  return {
    periodSummary: {
      uniqueProperties,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      avgOccupancyRate: n ? occSum / n : 0,
      avgPrice: n ? priceSum / n : 0,
    },
    latestSnapshot: {
      asOf: lastDate,
      activeProperties: latestActive,
      occupancyRate: latestOcc || 0,
      avgPrice: latestPrice || 0,
    },
    distributions: {
      latestDay: { propertyTypes, occupancyBuckets: occBuckets, bedrooms },
    },
  };
}

export function trends(f: Filters) {
  const rows = filterDaily(f);
  // Weekly (ISO week grouping) & Monthly (YYYY-MM)
  const weekly = new Map<string, { occ: number; price: number; n: number }>();
  const monthly = new Map<string, { occ: number; price: number; n: number }>();

  rows.forEach((r) => {
    const d = new Date(r.date + "T00:00:00Z");
    const week = isoWeek(d);
    const month = r.date.slice(0, 7);
    const w = weekly.get(week) ?? { occ: 0, price: 0, n: 0 };
    w.occ += r.occupancyRate; w.price += r.avgRate; w.n++; weekly.set(week, w);
    const m = monthly.get(month) ?? { occ: 0, price: 0, n: 0 };
    m.occ += r.occupancyRate; m.price += r.avgRate; m.n++; monthly.set(month, m);
  });

  const weeklyOcc: TrendPoint[] = [...weekly.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([week, v]) => ({ date: week, value: v.n ? v.occ / v.n : 0 }));
  const weeklyPrice: TrendPoint[] = [...weekly.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([week, v]) => ({ date: week, value: v.n ? v.price / v.n : 0 }));
  const monthlyOcc: TrendPoint[] = [...monthly.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([month, v]) => ({ date: month, value: v.n ? v.occ / v.n : 0 }));
  const monthlyPrice: TrendPoint[] = [...monthly.entries()].sort(([a],[b]) => a.localeCompare(b)).map(([month, v]) => ({ date: month, value: v.n ? v.price / v.n : 0 }));

  return {
    weekly: { occupancyRate: weeklyOcc.map(({date,value}) => ({ week: date, value })), avgRate: weeklyPrice.map(({date,value}) => ({ week: date, value })) },
    monthly: { occupancyRate: monthlyOcc.map(({date,value}) => ({ month: date, value })), avgRate: monthlyPrice.map(({date,value}) => ({ month: date, value })) },
  };
}

export function mapMarkers(f: Filters) {
  const rows = filterDaily(f);
  const lastDate = rows.reduce((max, r) => (r.date > max ? r.date : max), "0000-00-00");
  const latest = rows.filter((r) => r.date === lastDate);
  const byProp = new Map<string, DailyMetric>();
  latest.forEach((r) => byProp.set(r.propertyId, r));

  const markers = PROPERTIES
    .filter((p) => propertyMatches(p, f))
    .map((p) => {
      const m = byProp.get(p.propertyId);
      return {
        propertyId: p.propertyId,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        metrics: {
          occupancyRate: m?.occupancyRate ?? 0.7,
          avgPrice: m?.avgRate ?? 40,
          revenue: m?.revenue ?? 400,
          bedrooms: p.bedrooms,
          rooms: p.rooms,
          occupiedRooms: m?.occupiedRooms ?? Math.round(p.rooms * 0.7),
          propertyType: p.propertyType,
        },
      };
    });

  return { asOf: lastDate, markers };
}

export function ranking(f: Filters, metric: "avgOccupancy"|"totalRevenue"|"avgMonthlyRevenue"|"avgPrice"|"totalOccupiedStays", order: "top"|"bottom", limit = 10) {
  const rows = filterDaily(f);
  const byProp = new Map<string, DailyMetric[]>();
  rows.forEach((r) => {
    if (!byProp.has(r.propertyId)) byProp.set(r.propertyId, []);
    byProp.get(r.propertyId)!.push(r);
  });

  const scored = [...byProp.entries()].map(([propertyId, r]) => {
    const p = PROPERTIES.find((x) => x.propertyId === propertyId)!;
    const avgOccupancy = r.reduce((s, x) => s + x.occupancyRate, 0) / r.length;
    const avgPrice = r.reduce((s, x) => s + x.avgRate, 0) / r.length;
    const totalRevenue = r.reduce((s, x) => s + x.revenue, 0);
    const totalOccupiedStays = r.reduce((s, x) => s + x.occupiedRooms, 0);
    const months = new Set(r.map((x) => x.date.slice(0,7))).size || 1;
    const avgMonthlyRevenue = totalRevenue / months;

    const values = { avgOccupancy, totalRevenue, avgMonthlyRevenue, avgPrice, totalOccupiedStays };
    const score = values[metric];

    return {
      propertyId, name: p.name, city: p.city, state: p.state, bedrooms: p.bedrooms, propertyType: p.propertyType,
      values, score
    };
  });

  scored.sort((a, b) => (order === "top" ? b.score - a.score : a.score - b.score));
  const rowsOut = scored.slice(0, limit).map((row, i) => ({ rank: i + 1, ...row }));
  return { metric, order, rows: rowsOut };
}

export function raw(f: Filters, page = 1, pageSize = 50) {
  const rows = filterDaily(f);
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const slice = rows.slice(start, start + pageSize).map((r) => {
    const p = PROPERTIES.find((x) => x.propertyId === r.propertyId)!;
    return {
      date: r.date,
      propertyId: r.propertyId,
      city: p.city,
      state: p.state,
      occupancyRate: r.occupancyRate,
      avgRate: r.avgRate,
      revenue: r.revenue,
      rooms: r.rooms,
      occupiedRooms: r.occupiedRooms,
    };
  });
  return { page, pageSize, total, rows: slice };
}

// ---- helpers ----
function isoWeek(d: Date) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}