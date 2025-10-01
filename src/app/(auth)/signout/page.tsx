"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignOutPage() {
  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-xl font-semibold mb-3">Sign out</h1>
      <Button onClick={() => signOut({ callbackUrl: "/signin" })}>Sign out</Button>
    </div>
  );
}
