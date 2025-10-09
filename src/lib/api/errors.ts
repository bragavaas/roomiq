// Standard JSON error responses for API routes
export function toErrorResponse(err: any) {
  const code =
    err?.code ??
    (err?.status === 401 ? "UNAUTHORIZED" :
     err?.status === 403 ? "FORBIDDEN" : "BAD_REQUEST");

  const status =
    err?.status ?? (code === "UNAUTHORIZED" ? 401 :
                    code === "FORBIDDEN" ? 403 : 400);

  return Response.json(
    { error: code, message: err?.message ?? "" },
    { status }
  );
}

export function zodToErrorResponse(e: any) {
  if (e?.name === "ZodError") {
    return Response.json(
      { error: "VALIDATION_ERROR", details: e.issues ?? [] },
      { status: 400 }
    );
  }
  return toErrorResponse(e);
}
