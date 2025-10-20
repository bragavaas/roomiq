import { secure } from "@/lib/api/handler";

export const GET = secure(async (req) => {
  const url = new URL(req.url);
  const country = url.searchParams.get("country") ?? "US";

  const mockByCountry: Record<string, Array<{ city: string; city_slug: string; state?: string }>> = {
    US: [
      { city: "Atlanta", city_slug: "atlanta", state: "GA" },
      { city: "Houston", city_slug: "houston", state: "TX" },
      { city: "Tampa", city_slug: "tampa", state: "FL" },
    ],
    CA: [
      { city: "Toronto", city_slug: "toronto", state: "ON" },
      { city: "Vancouver", city_slug: "vancouver", state: "BC" },
    ],
    BR: [
      { city: "São Paulo", city_slug: "sao-paulo", state: "SP" },
      { city: "Rio de Janeiro", city_slug: "rio-de-janeiro", state: "RJ" },
    ],
  };

  return Response.json(mockByCountry[country] ?? []);
});