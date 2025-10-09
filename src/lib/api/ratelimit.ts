// src/lib/api/ratelimit.ts

// Defaults; can be overridden via env
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000); // 1 minute
const MAX_TOKENS = Number(process.env.RATE_LIMIT_MAX ?? 60);         // 60 req/min
const REFILL_RATE = MAX_TOKENS / WINDOW_MS; // tokens per ms

type Bucket = { tokens: number; last: number };
const buckets = new Map<string, Bucket>();

function getIp(req: Request): string {
  // Try standard proxy headers first, then fall back
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  // As a last resort, bucket by user-agent to avoid collapsing all to one bucket in dev
  return `ua:${req.headers.get("user-agent") ?? "unknown"}`;
}

/**
 * Throws an error when rate limit is exceeded.
 * Use inside handlers or wrappers.
 */
export async function rateLimit(req: Request): Promise<void> {
  const key = getIp(req);
  const now = Date.now();

  const bucket = buckets.get(key) ?? { tokens: MAX_TOKENS, last: now };
  // Refill tokens based on elapsed time
  const elapsed = now - bucket.last;
  bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + elapsed * REFILL_RATE);
  bucket.last = now;

  if (bucket.tokens < 1) {
    const err: any = new Error("Too many requests");
    err.status = 429;
    err.code = "RATE_LIMITED";
    // Optional: rough Retry-After; not exact for token buckets
    err.headers = { "Retry-After": Math.ceil(60).toString() };
    throw err;
  }

  // Consume one token
  bucket.tokens -= 1;
  buckets.set(key, bucket);
}
