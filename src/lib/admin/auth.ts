import crypto from "node:crypto";

export const ADMIN_COOKIE = "bandhan_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

// Fallbacks let the panel work out-of-the-box in dev; override in .env.local.
const DEFAULT_PASSWORD = "bandhan@admin";
const DEFAULT_SECRET = "bandhan-admin-session-secret";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

/**
 * Deterministic session token derived from the admin password + a server
 * secret. The proxy recomputes it to validate the cookie, so a forged cookie
 * value won't pass without knowing both secrets.
 */
export function sessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || DEFAULT_SECRET;
  return crypto
    .createHash("sha256")
    .update(`${getAdminPassword()}::${secret}`)
    .digest("hex");
}

export function isValidToken(token?: string | null): boolean {
  if (!token) return false;
  const expected = sessionToken();
  // Length guard avoids timingSafeEqual throwing on mismatched buffer sizes.
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

/** True if the incoming request carries a valid admin session cookie. */
export function requireAdmin(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  const token = match ? decodeURIComponent(match.slice(ADMIN_COOKIE.length + 1)) : null;
  return isValidToken(token);
}
