import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Stateless session for agents, same shape as the customer session in
 * session.ts: the cookie holds `<agentId>.<HMAC(agentId)>`, so proxy.ts can
 * verify it without a DB round trip.
 */
export const AGENT_COOKIE = "bandhan_agent_session";
export const AGENT_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const SECRET = process.env.AUTH_SECRET || "bandhan-user-auth-dev-secret";

function hmac(value: string): string {
  return crypto.createHmac("sha256", `agent:${SECRET}`).update(value).digest("hex");
}

export function signAgentSession(agentId: string): string {
  return `${agentId}.${hmac(agentId)}`;
}

export function verifyAgentSession(token?: string | null): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const agentId = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = hmac(agentId);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return crypto.timingSafeEqual(a, b) ? agentId : null;
}

export async function getSessionAgentId(): Promise<string | null> {
  const store = await cookies();
  return verifyAgentSession(store.get(AGENT_COOKIE)?.value);
}

export function agentSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: AGENT_SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  };
}
