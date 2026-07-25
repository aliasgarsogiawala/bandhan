import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";
import { getActor } from "@/lib/bookings/authz";
import { getBookingDetail } from "@/lib/bookings/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }

  const { id } = await params;
  const detail = await getBookingDetail(id);
  if (!detail) return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });

  const userId = await getSessionUserId();
  const actor = await getActor(request);

  const isOwner = userId && detail.user_id === userId;
  if (!isOwner && !actor) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, booking: detail });
}
