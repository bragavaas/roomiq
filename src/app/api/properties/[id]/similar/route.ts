import { secure } from "@/lib/api/handler";
import { similarProperties } from "@/mocks/analyzer";

type Params = { params: { id: string } };

export const GET = secure(async (_req, { params }: Params) => {
  const data = similarProperties(params.id, 10);
  return Response.json(data);
});