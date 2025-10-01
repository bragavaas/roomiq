import { type NextAuthOptions, getServerSession as nextAuthGetServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";

const isDev = process.env.NODE_ENV !== "production";

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url /*, provider*/ }) => {
        // DEV ONLY: log magic link; in prod wire SMTP or Resend/Sendgrid.
        // eslint-disable-next-line no-console
        console.log(`[Magic Link] To: ${identifier}\n${url}\n`);
      },
      // In production, configure proper email server:
      // server: process.env.EMAIL_SERVER,
      // from: process.env.EMAIL_FROM,
      maxAge: 60 * 60, // 1h
    }),
    // Optional OAuth (commented until configured):
    // GitHubProvider({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
    // GoogleProvider({ clientId: process.env.GOOGLE_ID!, clientSecret: process.env.GOOGLE_SECRET! }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Ensure role exists for later gating; defaults to 'free'
      if (user && !("role" in token)) token.role = "free";
      return token;
    },
    async session({ session, token }) {
      // Expose role to client
      (session as any).role = (token as any).role ?? "free";
      return session;
    },
  },
  // Security hardening
  cookies: {}, // use defaults; secure in prod automatically on HTTPS
  // NOTE: Set NEXTAUTH_URL and NEXTAUTH_SECRET in env
};

export function getServerSession() {
  return nextAuthGetServerSession(authOptions);
}
