import { secure } from "@/lib/api/handler";

type Params = { params: { id: string } };

export const GET = secure(async (_req, { params }: Params) => {
  const { id } = params;

  const data = {
    propertyId: id,
    name: id === "P987" ? "Downtown Pods" : "Peachtree House",
    propertyType: "co-living",
    specs: { bedrooms: id === "P987" ? 9 : 7, bathrooms: 4, sqft: 3100, hasCommonSpace: true },
    description: "Modern co-living property ideal for workforce housing and students.",
    amenities: [{ amenity: "wifi" }, { amenity: "laundry" }, { amenity: "cleaning-service" }],
    rooms: [
      { roomId: "R1", name: "A1", type: "private", sqft: 110, privateBathroom: false },
      { roomId: "R2", name: "A2", type: "private", sqft: 120, privateBathroom: true },
      { roomId: "R3", name: "A3", type: "shared", sqft: 160, privateBathroom: false },
    ],
  };

  return Response.json(data);
});