import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Stateless session: the cookie holds `<userId>.<HMAC(userId)>`. We recompute
 * the HMAC to validate it, so no sessions table or DB lookup is needed to trust
 * the cookie. Override AUTH_SECRET in production.
 */
export const USER_COOKIE = "bandhan_user_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const SECRET = process.env.AUTH_SECRET || "bandhan-user-auth-dev-secret";

function hmac(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function signSession(userId: string): string {
  return `${userId}.${hmac(userId)}`;
}

export function verifySession(token?: string | null): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const userId = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = hmac(userId);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return crypto.timingSafeEqual(a, b) ? userId : null;
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  return verifySession(store.get(USER_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  };
}
