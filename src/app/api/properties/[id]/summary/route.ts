import { secure } from "@/lib/api/handler";
import { propertySummary } from "@/mocks/analyzer";

type Params = { params: { id: string } };

export const GET = secure(async (_req, { params }: Params) => {
  const data = propertySummary(params.id);
  if (!data) return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  return Response.json(data);
});