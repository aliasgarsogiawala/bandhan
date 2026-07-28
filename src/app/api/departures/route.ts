import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { listActiveDepartures } from "@/lib/departures/db";

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ departures: [] });

  try {
    const departures = await listActiveDepartures();
    return NextResponse.json({ ok: true, departures });
  } catch (error) {
    console.error("list departures error:", error);
    return NextResponse.json({ ok: false, error: "Could not load departures." }, { status: 500 });
  }
}
