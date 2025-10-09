"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { useSession } from "next-auth/react";

export function PaywallGuard({
  children,
  fallback = null,
}: PropsWithChildren<{ fallback?: ReactNode }>) {
  const { data } = useSession();
  const role = data?.role ?? "free";
  if (role !== "paid") return <>{fallback}</>;
  return <>{children}</>;
}
