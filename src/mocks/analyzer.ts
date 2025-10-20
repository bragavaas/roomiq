import { PROPERTIES } from "./data.properties";
import { generateDaily } from "./data.daily";
import type { TrendPoint } from "./types";

const DAILY = generateDaily(90);

export function searchProperties(q: string, limit = 10) {
  const s = q.trim().toLowerCase();
  const all = PROPERTIES.filter((p) =>
    !s ||
    p.propertyId.toLowerCase() === s ||
    p.name.toLowerCase().includes(s) ||
    p.city.toLowerCase().includes(s)
  );
  return all.slice(0, limit).map(({ propertyId, name, city, state, bedrooms, propertyType }) => ({
    propertyId, name, city, state, bedrooms, propertyType
  }));
}

export function propertySummary(id: string) {
  const p = PROPERTIES.find((x) => x.propertyId === id);
  if (!p) return null;

  const rows = DAILY.filter((r) => r.propertyId === id);
  const avgOccupancy = rows.reduce((s,x)=>s+x.occupancyRate,0) / Math.max(1,rows.length);
  const avgRate = rows.reduce((s,x)=>s+x.avgRate,0) / Math.max(1,rows.length);
  const weeks = new Set(rows.map((r)=>r.date)).size / 7;
  const months = new Set(rows.map((r)=>r.date.slice(0,7))).size || 1;
  const estAvgWeeklyRate = Math.round(avgRate * 7 * 100)/100;
  const estAvgMonthlyRate = Math.round(avgRate * 30 * 100)/100;
  const totalRecordedRevenue = Math.round(rows.reduce((s,x)=>s+x.revenue,0)*100)/100;
  const avgMonthlyPropertyRevenue = Math.round((totalRecordedRevenue / months) * 100)/100;

  return {
    propertyId: p.propertyId,
    name: p.name,
    city: p.city,
    state: p.state,
    propertyType: p.propertyType,
    bedrooms: p.bedrooms,
    rooms: p.rooms,
    overall: {
      avgOccupancy,
      estAvgWeeklyRate,
      estAvgMonthlyRate,
      totalRecordedRevenue,
      avgMonthlyPropertyRevenue,
    },
  };
}

export function propertyTrends(id: string) {
  const rows = DAILY.filter((r) => r.propertyId === id);
  const byWeek = groupBy(rows, (r)=>r.date.slice(0,7)+"-"+weekIndex(r.date));
  const occ: TrendPoint[] = [];
  const avail: TrendPoint[] = [];
  const reviews: TrendPoint[] = [];
  const drops: { date: string; count: number }[] = [];

  // price drops: simplistic day-over-day negative delta beyond threshold
  let prevRate: number | null = null;
  rows.forEach((r) => {
    if (prevRate != null && r.avgRate < prevRate - 3) drops.push({ date: r.date, count: 1 });
    prevRate = r.avgRate;
  });

  for (const [k, arr] of byWeek.entries()) {
    const date = arr[0].date; // any in the group
    occ.push({ date, value: arr.reduce((s,x)=>s+x.occupancyRate,0) / arr.length });
    avail.push({ date, value: arr.reduce((s,x)=>s+x.rooms,0) / arr.length });
    reviews.push({ date, value: Math.max(0, Math.round(Math.random() * 4 - 1)) });
  }

  return {
    occupancyRate: occ.slice(-12),
    roomsAvailable: avail.slice(-12),
    reviewCounts: reviews.slice(-12),
    priceDrops: aggregateSameDay(drops),
  };
}

export function propertyMeta(id: string) {
  const p = PROPERTIES.find((x) => x.propertyId === id);
  if (!p) return null;

  return {
    propertyId: p.propertyId,
    name: p.name,
    propertyType: p.propertyType,
    specs: { bedrooms: p.bedrooms, bathrooms: Math.max(2, Math.round(p.bedrooms/2)), sqft: 2500 + p.rooms*50, hasCommonSpace: p.propertyType !== "apartment" },
    description: p.description ?? "Modern co-living property ideal for workforce housing and students.",
    amenities: (p.amenities ?? ["wifi","laundry"]).map((a)=>({ amenity: a })),
    rooms: Array.from({ length: p.rooms }, (_,i)=>({
      roomId: `R${i+1}`,
      name: `Unit ${i+1}`,
      type: i % 3 === 0 ? "shared" : "private",
      sqft: 100 + (i%5)*10,
      privateBathroom: i % 4 === 0,
    })),
  };
}

export function similarProperties(id: string, limit = 10) {
  const p = PROPERTIES.find((x) => x.propertyId === id);
  if (!p) return { propertyId: id, results: [] };
  const results = PROPERTIES
    .filter((x) => x.propertyId !== id && x.city === p.city)
    .map((x) => ({
      propertyId: x.propertyId,
      name: x.name,
      city: x.city,
      state: x.state,
      bedrooms: x.bedrooms,
      score: 1 - Math.abs(x.bedrooms - p.bedrooms) / 10 - (x.propertyType === p.propertyType ? 0 : 0.1),
    }))
    .sort((a,b)=>b.score-a.score)
    .slice(0, limit);
  return { propertyId: id, results };
}

export function priceDrops(id: string) {
  // Reuse the simplistic detection in propertyTrends to emit 2 sample events
  return {
    propertyId: id,
    events: [
      { date: "2025-08-10", from: 47.0, to: 41.0 },
      { date: "2025-09-02", from: 46.0, to: 42.0 },
    ],
  };
}

// helpers
function groupBy<T>(arr: T[], key: (x: T) => string) {
  const m = new Map<string, T[]>();
  for (const it of arr) {
    const k = key(it);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(it);
  }
  return m;
}
function weekIndex(date: string) {
  // 0..3 per month (rough)
  const d = new Date(date + "T00:00:00Z");
  return Math.floor((d.getUTCDate() - 1) / 7);
}
function aggregateSameDay(arr: {date: string; count: number}[]) {
  const m = new Map<string, number>();
  arr.forEach(({date, count}) => m.set(date, (m.get(date) ?? 0) + count));
  return [...m.entries()].map(([date, count]) => ({ date, count }));
}