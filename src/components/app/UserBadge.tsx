"use client";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

export function UserBadge() {
  const { data, status } = useSession();
  if (status === "loading") return <Badge variant="secondary">Loading…</Badge>;
  if (!data) return <Badge variant="outline">Signed out</Badge>;
  const email = data.user?.email ?? "unknown";
  const role: "free" | "paid" = data.role ?? "free";
  return <Badge>{email} • {role}</Badge>;
}
