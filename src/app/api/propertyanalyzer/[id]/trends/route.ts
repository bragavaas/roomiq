import { secure } from "@/lib/api/handler";

type Params = { params: { id: string } };

export const GET = secure(async (req, { params }: Params) => {
  const id = params.id;
  // const url = new URL(req.url);
  // const start = url.searchParams.get("start");
  // const end = url.searchParams.get("end");
  // const granularity = url.searchParams.get("granularity") ?? "weekly";

  const data = {
    propertyId: id,
    occupancyRate: [
      { date: "2025-08-04", value: 0.82 },
      { date: "2025-08-11", value: 0.84 },
      { date: "2025-08-18", value: 0.85 },
      { date: "2025-08-25", value: 0.83 },
    ],
    roomsAvailable: [
      { date: "2025-08-04", value: 12 },
      { date: "2025-08-11", value: 12 },
      { date: "2025-08-18", value: 12 },
      { date: "2025-08-25", value: 12 },
    ],
    reviewCounts: [
      { date: "2025-08-04", value: 2 },
      { date: "2025-08-11", value: 3 },
      { date: "2025-08-18", value: 1 },
      { date: "2025-08-25", value: 4 },
    ],
    priceDrops: [
      { date: "2025-08-10", count: 2 },
      { date: "2025-08-20", count: 1 },
    ],
  };

  return Response.json(data);
});