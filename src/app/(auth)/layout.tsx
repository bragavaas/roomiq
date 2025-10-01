// src/app/(auth)/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

// ensure this runs on the server each request
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  // Our wrapper in lib/auth.ts already binds authOptions.
  const session = await getServerSession();

  if (session) {
    // already authenticated → push them to the app
    redirect("/dashboard");
  }

  // not signed in → render the auth pages
  return <>{children}</>;
}
