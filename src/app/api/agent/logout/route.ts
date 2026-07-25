import { NextResponse } from "next/server";
import { AGENT_COOKIE } from "@/lib/auth/agentSession";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(AGENT_COOKIE);
  return response;
}
