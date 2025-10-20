// src/lib/http.ts
import "server-only";
import { headers } from "next/headers";

/** Returns an absolute origin like https://myapp.com */
export async function getBaseUrl(): Promise<string> {
  // Prefer explicit env in all envs
  const env =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (env) return env.replace(/\/$/, "");

  // Infer from incoming request (RSC/route handlers)
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}
