import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getActor } from "@/lib/bookings/authz";
import { listAll, listForAgent } from "@/lib/bookings/db";

export async function GET(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ bookings: [] });

  const actor = await getActor(request);
  if (!actor) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });

  try {
    const bookings = actor.kind === "admin" ? await listAll() : await listForAgent(actor.id);
    return NextResponse.json({ ok: true, bookings });
  } catch (error) {
    console.error("list agent bookings error:", error);
    return NextResponse.json({ ok: false, error: "Could not load bookings." }, { status: 500 });
  }
}
