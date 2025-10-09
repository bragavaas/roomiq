import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/api/secure/:path*"],
};

export function middleware(req: NextRequest) {
  // next-auth cookie names (JWT strategy)
  const maybe =
    req.cookies.get("__Secure-next-auth.session-token") ??
    req.cookies.get("next-auth.session-token");

  if (!maybe) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return NextResponse.next();
}
