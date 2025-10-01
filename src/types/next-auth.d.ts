import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    role?: "free" | "paid";
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    role?: "free" | "paid";
    userId?: string;
  }
}
