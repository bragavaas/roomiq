import { PROPERTIES } from "./data.properties";
import { hashSeed, mulberry32 } from "./seed";
import type { DailyMetric } from "./types";

/**
 * Generate N days of deterministic daily metrics for each property.
 * Default range: last 90 days from today (UTC).
 */
export function generateDaily(days: number = 90): DailyMetric[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const out: DailyMetric[] = [];
  for (const p of PROPERTIES) {
    const baseSeed = hashSeed(p.propertyId + p.city + p.propertyType);
    const rand = mulberry32(baseSeed);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - i);
      const date = d.toISOString().slice(0, 10);

      // Seasonality & city/type variance
      const season = 0.1 * Math.sin((i / 14) * Math.PI * 2) + 0.02 * Math.cos((i / 30) * Math.PI * 2);
      const typeBoost = p.propertyType === "co-living" ? 0.05 : p.propertyType === "apartment" ? 0.0 : -0.02;
      const cityBoost =
        p.city.toLowerCase().includes("atlanta") ? 0.02 :
        p.city.toLowerCase().includes("houston") ? 0.01 :
        p.country === "BR" ? 0.03 :
        0.0;

      // occupancy
      const occBase = 0.72 + season + typeBoost + cityBoost + (rand() - 0.5) * 0.06;
      const occupancyRate = Math.max(0.35, Math.min(0.98, occBase));

      // price
      const rateBase =
        35 + (p.country === "CA" ? 8 : p.country === "BR" ? -2 : 0) +
        (p.propertyType === "co-living" ? 6 : p.propertyType === "apartment" ? 4 : 2) +
        (rand() - 0.5) * 4;
      const avgRate = Math.max(20, Math.round((rateBase + season * 8) * 100) / 100);

      const occupiedRooms = Math.max(0, Math.min(p.rooms, Math.round(p.rooms * occupancyRate)));
      const revenue = Math.round(occupiedRooms * avgRate * 100) / 100;

      out.push({
        date,
        propertyId: p.propertyId,
        occupancyRate,
        avgRate,
        revenue,
        rooms: p.rooms,
        occupiedRooms,
      });
    }
  }
  return out;
}