import { secure } from "@/lib/api/handler";

type Params = { params: { id: string } };

export const GET = secure(async (_req, { params }: Params) => {
  const { id } = params;

  const data = [
    { propertyId: "P555", name: "Midtown Flats", city: "Houston", state: "TX", bedrooms: 5, score: 0.82 },
    { propertyId: "P777", name: "Grove Commons", city: "Atlanta", state: "GA", bedrooms: 8, score: 0.79 },
  ];

  return Response.json({ propertyId: id, results: data });
});