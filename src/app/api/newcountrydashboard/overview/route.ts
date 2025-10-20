import { secure } from "@/lib/api/handler";

export const GET = secure(async () => {
  const data = {
    periodSummary: {
      uniqueProperties: 1423,
      totalRevenue: 12450000.25,
      avgOccupancyRate: 0.81,
      avgPrice: 42.75,
    },
    latestSnapshot: {
      asOf: "2025-09-30",
      activeProperties: 1187,
      occupancyRate: 0.83,
      avgPrice: 44.1,
    },
    distributions: {
      latestDay: {
        propertyTypes: [
          { type: "co-living", count: 870 },
          { type: "apartment", count: 250 },
          { type: "house", count: 67 },
        ],
        occupancyBuckets: [
          { bucket: "0–20%", properties: 120 },
          { bucket: "20–40%", properties: 240 },
          { bucket: "40–60%", properties: 360 },
          { bucket: "60–80%", properties: 290 },
          { bucket: "80–100%", properties: 177 },
        ],
        bedrooms: [
          { bedrooms: 1, properties: 320 },
          { bedrooms: 2, properties: 285 },
          { bedrooms: 3, properties: 210 },
          { bedrooms: 4, properties: 140 },
          { bedrooms: 5, properties: 90 },
          { bedrooms: 6, properties: 60 },
        ],
      },
    },
  };
  return Response.json(data);
});