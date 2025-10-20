import { secure } from "@/lib/api/handler";
import { searchProperties } from "@/mocks/analyzer";

export const GET = secure(async (req) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const limit = Number(url.searchParams.get("limit") ?? 10);
  return Response.json(searchProperties(q, limit));
});