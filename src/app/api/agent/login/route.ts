import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { findAgentByEmail } from "@/lib/auth/agents";
import { verifyPassword } from "@/lib/auth/password";
import { AGENT_COOKIE, agentSessionCookieOptions, signAgentSession } from "@/lib/auth/agentSession";
import { isAuthConfigured } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ ok: false, error: "Authentication is not configured." }, { status: 503 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Sign-in isn't available yet — the database isn't configured." },
      { status: 503 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Enter your email and password." }, { status: 400 });
  }

  try {
    const agent = await findAgentByEmail(email);
    if (!agent || agent.status !== "active" || !verifyPassword(password, agent.password_hash)) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({
      ok: true,
      agent: { id: agent.id, name: agent.name, email: agent.email },
    });
    response.cookies.set(AGENT_COOKIE, signAgentSession(agent.id), agentSessionCookieOptions());
    return response;
  } catch (error) {
    console.error("agent login error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
