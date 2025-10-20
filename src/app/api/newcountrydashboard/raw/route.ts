import { secure } from "@/lib/api/handler";
import { raw } from "@/mocks/dashboard";

export const GET = secure(async (req) => {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Number(url.searchParams.get("pageSize") ?? 50);

  const data = raw(
    {
      start: url.searchParams.get("start") ?? undefined,
      end: url.searchParams.get("end") ?? undefined,
      country: url.searchParams.get("country") ?? undefined,
      city: url.searchParams.get("city") ?? undefined,
      propertyType: url.searchParams.get("propertyType") ?? undefined,
      minBedrooms: url.searchParams.get("minBedrooms") ? Number(url.searchParams.get("minBedrooms")) : undefined,
      maxBedrooms: url.searchParams.get("maxBedrooms") ? Number(url.searchParams.get("maxBedrooms")) : undefined,
    },
    page,
    pageSize
  );
  return Response.json(data);
});