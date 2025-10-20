import { secure } from "@/lib/api/handler";
import { priceDrops } from "@/mocks/analyzer";

type Params = { params: { id: string } };

export const GET = secure(async (_req, { params }: Params) => {
  const data = priceDrops(params.id);
  return Response.json(data);
});