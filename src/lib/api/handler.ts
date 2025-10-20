// src/lib/api/handler.ts
import { toErrorResponse } from "./errors";
import { requireSession } from "./auth-guard";
import { rateLimit } from "./ratelimit";
import { isAdmin } from "../admin";

type NextHandler = (req: Request, ctx?: any, session?: any) => Promise<Response> | Response;

export function withErrors(h: NextHandler): (req: Request, ctx?: any) => Promise<Response> {
  return async (req, ctx) => {
    try {
      return await h(req, ctx);
    } catch (e) {
      return toErrorResponse(e);
    }
  };
}

export function secure(
  h: NextHandler,
  opts?: { role?: "admin" | "free" }
): (req: Request, ctx?: any) => Promise<Response> {
  return withErrors(async (req, ctx) => {
    await rateLimit(req);
    const session = await requireSession();

    // RBAC (defaults to free; only enforce admin when asked)
    if (opts?.role === "admin") {
      const email = session?.user?.email ?? null;
      if (!isAdmin(email)) {
        const err: any = new Error("FORBIDDEN");
        err.status = 403;
        err.code = "FORBIDDEN";
        throw err;
      }
    }
    return h(req, ctx, session);
  });
}