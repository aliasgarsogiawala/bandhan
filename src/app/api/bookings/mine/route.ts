import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";
import { listForUser } from "@/lib/bookings/db";

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ bookings: [] });

  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  try {
    const bookings = await listForUser(userId);
    return NextResponse.json({ ok: true, bookings });
  } catch (error) {
    console.error("list my bookings error:", error);
    return NextResponse.json({ ok: false, error: "Could not load your bookings." }, { status: 500 });
  }
}
