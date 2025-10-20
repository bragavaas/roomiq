import { secure } from "@/lib/api/handler";

export const GET = secure(async () => {
  return Response.json([{ type: "co-living" }, { type: "apartment" }, { type: "house" }]);
});