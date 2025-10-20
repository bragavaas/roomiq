import { secure } from "@/lib/api/handler";
import { ranking } from "@/mocks/dashboard";

export const GET = secure(async (req) => {
  const url = new URL(req.url);
  const metric = (url.searchParams.get("metric") ?? "totalRevenue") as
    | "avgOccupancy" | "totalRevenue" | "avgMonthlyRevenue" | "avgPrice" | "totalOccupiedStays";
  const order = (url.searchParams.get("order") ?? "top") as "top" | "bottom";
  const limit = Number(url.searchParams.get("limit") ?? 10);

  const data = ranking(
    {
      start: url.searchParams.get("start") ?? undefined,
      end: url.searchParams.get("end") ?? undefined,
      country: url.searchParams.get("country") ?? undefined,
      city: url.searchParams.get("city") ?? undefined,
      propertyType: url.searchParams.get("propertyType") ?? undefined,
      minBedrooms: url.searchParams.get("minBedrooms") ? Number(url.searchParams.get("minBedrooms")) : undefined,
      maxBedrooms: url.searchParams.get("maxBedrooms") ? Number(url.searchParams.get("maxBedrooms")) : undefined,
    },
    metric,
    order,
    limit
  );
  return Response.json(data);
});