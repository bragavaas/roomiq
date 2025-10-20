import { secure } from "@/lib/api/handler";

export const GET = secure(async (req) => {
  const url = new URL(req.url);
  const metric = url.searchParams.get("metric") ?? "totalRevenue";
  const order = url.searchParams.get("order") ?? "top";
  const limit = Number(url.searchParams.get("limit") ?? 10);

  const rows = [
    {
      rank: 1,
      propertyId: "P987",
      name: "Downtown Pods",
      city: "Atlanta",
      state: "GA",
      bedrooms: 9,
      propertyType: "co-living",
      values: {
        avgOccupancy: 0.92,
        totalRevenue: 184000.3,
        avgMonthlyRevenue: 15333.4,
        avgPrice: 46.2,
        totalOccupiedStays: 1290,
      },
    },
    {
      rank: 2,
      propertyId: "P123",
      name: "Peachtree House",
      city: "Atlanta",
      state: "GA",
      bedrooms: 7,
      propertyType: "co-living",
      values: {
        avgOccupancy: 0.86,
        totalRevenue: 125000.7,
        avgMonthlyRevenue: 10416.7,
        avgPrice: 45.5,
        totalOccupiedStays: 980,
      },
    },
  ].slice(0, limit);

  return Response.json({ metric, order, rows });
});