import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { createAgent, listAgents } from "@/lib/auth/agents";
import { hashPassword } from "@/lib/auth/password";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ agents: [] });
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  try {
    const agents = await listAgents();
    return NextResponse.json({ ok: true, agents });
  } catch (error) {
    console.error("list agents error:", error);
    return NextResponse.json({ ok: false, error: "Could not load agents." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Not available — the database isn't configured." },
      { status: 503 }
    );
  }
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  let body: { name?: string; email?: string; password?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const phone = (body.phone || "").trim();

  if (name.length < 2) return fail("Please enter the agent's name.");
  if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.");
  if (password.length < 8) return fail("Password must be at least 8 characters.");

  try {
    const agent = await createAgent(name, email, hashPassword(password), phone || undefined);
    return NextResponse.json({ ok: true, agent });
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === "23505") {
      return NextResponse.json(
        { ok: false, error: "An agent with this email already exists." },
        { status: 409 }
      );
    }
    console.error("create agent error:", error);
    return NextResponse.json({ ok: false, error: "Could not create the agent." }, { status: 500 });
  }
}

function fail(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
