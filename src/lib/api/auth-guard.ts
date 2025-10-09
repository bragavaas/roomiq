import { getServerSession } from "@/lib/auth";

export async function requireSession() {
  const session = await getServerSession();
  if (!session) {
    const err = new Error("UNAUTHORIZED") as any;
    err.status = 401;
    err.code = "UNAUTHORIZED";
    throw err;
  }
  return session as any;
}

export async function requirePaid() {
  const session = await requireSession();
  if (session.role !== "paid") {
    const err = new Error("FORBIDDEN") as any;
    err.status = 403;
    err.code = "FORBIDDEN";
    throw err;
  }
  return session;
}
