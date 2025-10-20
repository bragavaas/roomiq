import { secure } from "@/lib/api/handler";

export const GET = secure(async (req) => {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").toLowerCase();
  const limit = Number(url.searchParams.get("limit") ?? 10);

  const all = [
    { propertyId: "P123", name: "Peachtree House", city: "Atlanta", state: "GA", bedrooms: 7, propertyType: "co-living" },
    { propertyId: "P987", name: "Downtown Pods", city: "Atlanta", state: "GA", bedrooms: 9, propertyType: "co-living" },
    { propertyId: "P555", name: "Midtown Flats", city: "Houston", state: "TX", bedrooms: 5, propertyType: "apartment" },
  ];

  const filtered = q ? all.filter(p => p.name.toLowerCase().includes(q) || p.propertyId.toLowerCase() === q) : all;
  return Response.json(filtered.slice(0, limit));
});