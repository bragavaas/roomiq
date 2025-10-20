import { secure } from "@/lib/api/handler";

export const GET = secure(async () => {
  return Response.json({ min: 1, max: 10, buckets: [1, 2, 3, 4, 5, "6+"] });
});