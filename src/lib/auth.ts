// src/lib/auth.ts
import { type NextAuthOptions, getServerSession as _getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";

// If you also use OAuth later, import providers conditionally by envs
// import GitHubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";

const isProd = process.env.NODE_ENV === "production";

/**
 * Central NextAuth config used by both the route handler and server components.
 * - Email provider logs the magic link in dev (no SMTP needed).
 * - PrismaAdapter persists verification tokens & users (required for Email).
 * - JWT strategy with role copied from the User table into the token/session.
 * - Safe redirect callback -> defaults to /dashboard.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        if (!isProd) {
          // Dev-only convenience: log the magic link so you can click it
          // eslint-disable-next-line no-console
          console.log(`[Magic Link]\nTo: ${identifier}\n${url}\n`);
          return;
        }
        // In production, set EMAIL_SERVER and EMAIL_FROM in env and let NextAuth send via nodemailer.
      },
      maxAge: 60 * 60, // 1 hour
      // server: process.env.EMAIL_SERVER, // (enable in prod)
      // from: process.env.EMAIL_FROM,     // (enable in prod)
    }),
    // Conditionally add OAuth later:
    // ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [GitHubProvider({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! })] : []),
    // ...(process.env.GOOGLE_ID && process.env.GOOGLE_SECRET ? [GoogleProvider({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! })] : []),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // copy DB fields to token at first sign-in
        (token as any).userId = (user as any).id;
        (token as any).role = (user as any).role ?? "free";
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).role = (token as any).role ?? "free";
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`; // relative OK
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;            // same-origin OK
      } catch { /* ignore */ }
      return `${baseUrl}/dashboard`;                    // fallback
    },
  },
};

/**
 * App Router helper so server components/route handlers can do:
 *   const session = await getServerSession();
 */
export function getServerSession() {
  return _getServerSession(authOptions);
}
