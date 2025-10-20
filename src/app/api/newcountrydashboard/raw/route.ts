import { secure } from "@/lib/api/handler";

export const GET = secure(async (req) => {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Number(url.searchParams.get("pageSize") ?? 50);

  const total = 1234;
  const rows = Array.from({ length: Math.min(pageSize, total) }, (_, i) => ({
    date: "2025-09-29",
    propertyId: `P${100 + i}`,
    city: "Atlanta",
    state: "GA",
    occupancyRate: 0.84,
    avgRate: 44.1,
    revenue: 410.0,
    rooms: 12,
    occupiedRooms: 10,
  }));

  return Response.json({ page, pageSize, total, rows });
});