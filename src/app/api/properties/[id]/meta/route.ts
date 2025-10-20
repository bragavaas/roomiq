import { secure } from "@/lib/api/handler";
import { propertyMeta } from "@/mocks/analyzer";

type Params = { params: { id: string } };

export const GET = secure(async (_req, { params }: Params) => {
  const data = propertyMeta(params.id);
  if (!data) return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  return Response.json(data);
});