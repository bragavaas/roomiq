import { secure } from "@/lib/api/handler";
import { propertyTrends } from "@/mocks/analyzer";

type Params = { params: { id: string } };

export const GET = secure(async (req, { params }: Params) => {
  // const url = new URL(req.url);
  // const start = url.searchParams.get("start");
  // const end = url.searchParams.get("end");
  const data = propertyTrends(params.id);
  return Response.json(data);
});