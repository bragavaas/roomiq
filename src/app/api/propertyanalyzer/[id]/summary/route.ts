import { secure } from "@/lib/api/handler";

type Params = { params: { id: string } };

export const GET = secure(async (_req, { params }: Params) => {
  const { id } = params;

  const data = {
    propertyId: id,
    name: id === "P987" ? "Downtown Pods" : "Peachtree House",
    city: "Atlanta",
    state: "GA",
    propertyType: "co-living",
    bedrooms: id === "P987" ? 9 : 7,
    rooms: id === "P987" ? 20 : 12,
    overall: {
      avgOccupancy: id === "P987" ? 0.88 : 0.81,
      estAvgWeeklyRate: id === "P987" ? 340 : 310,
      estAvgMonthlyRate: id === "P987" ? 1450 : 1280,
      totalRecordedRevenue: id === "P987" ? 325000.5 : 245000.5,
      avgMonthlyPropertyRevenue: id === "P987" ? 13541.7 : 10208.4,
    },
  };
  return Response.json(data);
});