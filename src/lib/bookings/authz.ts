import { requireAdmin } from "@/lib/admin/auth";
import { AGENT_COOKIE, verifyAgentSession } from "@/lib/auth/agentSession";
import { findAgentById } from "@/lib/auth/agents";
import type { Booking } from "./types";

export type Actor =
  | { kind: "admin"; label: "admin" }
  | { kind: "agent"; id: string; label: string };

function cookieValue(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") || "";
  const match = header
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/** Resolves the acting admin or agent from request cookies, or null if neither. */
export async function getActor(request: Request): Promise<Actor | null> {
  if (requireAdmin(request)) return { kind: "admin", label: "admin" };

  const agentId = verifyAgentSession(cookieValue(request, AGENT_COOKIE));
  if (!agentId) return null;

  const agent = await findAgentById(agentId);
  if (!agent || agent.status !== "active") return null;

  return { kind: "agent", id: agent.id, label: `agent:${agent.name}` };
}

/** Admins can see everything; agents can see their work and the unassigned queue. */
export function actorCanViewBooking(actor: Actor, booking: Booking): boolean {
  return actor.kind === "admin" || booking.agent_id === actor.id || booking.agent_id === null;
}

/** Mutations require an assigned agent. Self-assignment is handled separately. */
export function actorCanManageBooking(actor: Actor, booking: Booking): boolean {
  return actor.kind === "admin" || booking.agent_id === actor.id;
}
