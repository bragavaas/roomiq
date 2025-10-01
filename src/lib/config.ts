export const cfg = {
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean),
};
