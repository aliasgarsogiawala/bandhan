import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { setAgentStatus } from "@/lib/auth/agents";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const { id } = await params;
  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (body.status !== "active" && body.status !== "inactive") {
    return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  }

  try {
    const agent = await setAgentStatus(id, body.status);
    if (!agent) return NextResponse.json({ ok: false, error: "Agent not found." }, { status: 404 });
    return NextResponse.json({ ok: true, agent });
  } catch (error) {
    console.error("update agent error:", error);
    return NextResponse.json({ ok: false, error: "Could not update the agent." }, { status: 500 });
  }
}
