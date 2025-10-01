"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = React.useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await signIn("email", {
        email,
        callbackUrl: "/dashboard",
        redirect: false, // handle UI feedback here; NextAuth will still send the email
      });

      if (res?.ok) {
        setStatus("sent");
        setMessage("Magic link sent. In development, check the server console for the link.");
      } else {
        setStatus("error");
        setMessage("Could not send magic link. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Unexpected error. Please try again.");
    }
  }

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your email to receive a one-time magic link.
        </p>

        <form onSubmit={onSubmit} className="grid gap-4" aria-describedby="signin-help">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={status === "error" ? "true" : "false"}
            />
          </div>

          <Button type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Sending…" : "Send magic link"}
          </Button>

          <p id="signin-help" className="sr-only">
            You will receive a sign-in link by email.
          </p>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}
            >
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 text-xs text-muted-foreground">
          <p>
            Dev note: configure email transport for production with <code>EMAIL_SERVER</code> and{" "}
            <code>EMAIL_FROM</code>. In dev, we log the magic link to the terminal.
          </p>
        </div>
      </Card>
    </div>
  );
}
