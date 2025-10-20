import { secure } from "@/lib/api/handler";

type Params = { params: { id: string } };

export const GET = secure(async (req, { params }: Params) => {
  const id = params.id;
  // const url = new URL(req.url);
  // const start = url.searchParams.get("start");
  // const end = url.searchParams.get("end");

  const data = [
    { date: "2025-08-10", from: 45.0, to: 39.0 },
    { date: "2025-09-02", from: 47.0, to: 42.0 },
  ];

  return Response.json({ propertyId: id, events: data });
});