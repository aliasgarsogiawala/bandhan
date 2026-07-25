import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { listAll } from "@/lib/bookings/db";

export async function GET(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ bookings: [] });
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  try {
    const bookings = await listAll();
    return NextResponse.json({ ok: true, bookings });
  } catch (error) {
    console.error("list admin bookings error:", error);
    return NextResponse.json({ ok: false, error: "Could not load bookings." }, { status: 500 });
  }
}
