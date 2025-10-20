import { secure } from "@/lib/api/handler";
import { trends } from "@/mocks/dashboard";

export const GET = secure(async (req) => {
  const url = new URL(req.url);
  const data = trends({
    start: url.searchParams.get("start") ?? undefined,
    end: url.searchParams.get("end") ?? undefined,
    country: url.searchParams.get("country") ?? undefined,
    city: url.searchParams.get("city") ?? undefined,
    propertyType: url.searchParams.get("propertyType") ?? undefined,
    minBedrooms: url.searchParams.get("minBedrooms") ? Number(url.searchParams.get("minBedrooms")) : undefined,
    maxBedrooms: url.searchParams.get("maxBedrooms") ? Number(url.searchParams.get("maxBedrooms")) : undefined,
  });
  return Response.json(data);
});