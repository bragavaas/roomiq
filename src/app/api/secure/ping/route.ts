import { requireSession } from "@/lib/api/auth-guard";
import { toErrorResponse } from "@/lib/api/errors";
import { secure } from "@/lib/api/handler";

export const GET = secure(async () => {
  const session = await requireSession();
  return Response.json({ ok: true, email: session.user?.email, role: session.role });
})
