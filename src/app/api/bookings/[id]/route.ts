import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";
import { actorCanViewBooking, getActor } from "@/lib/bookings/authz";
import { getBookingDetail, updateCustomerBookingDetails } from "@/lib/bookings/db";

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
  const actorHasAccess = actor ? actorCanViewBooking(actor, detail) : false;
  if (!isOwner && !actorHasAccess) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, booking: detail });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  const { id } = await params;
  const detail = await getBookingDetail(id);
  if (!detail || detail.user_id !== userId) {
    return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  }
  if (!["new", "reviewing", "quoted", "approved"].includes(detail.status)) {
    return NextResponse.json(
      { ok: false, error: "Traveller details can no longer be changed online for this booking." },
      { status: 409 }
    );
  }
  const body = (await request.json().catch(() => null)) as
    | { travellerNames?: string; contactPhone?: string; specialRequirements?: string }
    | null;
  if (!body) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  try {
    const booking = await updateCustomerBookingDetails(id, {
      travellerNames: body.travellerNames,
      contactPhone: body.contactPhone,
      specialRequirements: body.specialRequirements,
    });
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    console.error("update customer booking error:", error);
    return NextResponse.json({ ok: false, error: "Could not update traveller details." }, { status: 500 });
  }
}
