import { z } from "zod";
import { zodToErrorResponse, toErrorResponse } from "@/lib/api/errors";
// import { requireSession } from "@/lib/api/auth-guard"; // if this is secure

const Query = z.object({
  city: z.string().min(1),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsed = Query.parse({
      city: url.searchParams.get("city"),
      start: url.searchParams.get("start"),
      end: url.searchParams.get("end"),
    });

    // If secure, uncomment
    // await requireSession();

    // ... your data fetch using parsed.city/start/end ...
    return Response.json({ city: parsed.city, series: [] });
  } catch (e: any) {
    return e?.name === "ZodError" ? zodToErrorResponse(e) : toErrorResponse(e);
  }
}
