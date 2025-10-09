// src/lib/api/handler.ts
import { toErrorResponse } from "./errors";
import { requireSession } from "./auth-guard";
import { rateLimit } from "./ratelimit";

type Handler = (req: Request) => Promise<Response> | Response;

/** Wrap any handler to standardize JSON errors */
export function withErrors(h: Handler): Handler {
  return async (req) => {
    try {
      return await h(req);
    } catch (e) {
      return toErrorResponse(e);
    }
  };
}

/** Secure handler: rate-limit + auth check + error mapping */
export function secure(h: Handler): Handler {
  return withErrors(async (req) => {
    await rateLimit(req);   // throws { status: 429, code: "RATE_LIMITED" }
    await requireSession(); // throws { status: 401, code: "UNAUTHORIZED" }
    return h(req);
  });
}
