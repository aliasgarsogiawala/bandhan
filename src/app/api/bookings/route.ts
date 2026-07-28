import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";
import { createBooking, SoldOutError } from "@/lib/bookings/db";
import type { BookingType } from "@/lib/bookings/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CreateBookingBody {
  type?: BookingType;
  packageId?: string;
  packageTitle?: string;
  departureId?: string;
  destination?: string;
  travelDate?: string;
  travellersCount?: string | number;
  travellerNames?: string;
  budget?: string;
  specialRequirements?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Booking isn't available yet — the database isn't configured." },
      { status: 503 }
    );
  }

  let body: CreateBookingBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const type: BookingType = body.type === "customized" ? "customized" : "standard";
  const contactName = (body.contactName || "").trim();
  const contactEmail = (body.contactEmail || "").trim().toLowerCase();
  const contactPhone = (body.contactPhone || "").trim();

  if (contactName.length < 2) return fail("Please enter your name.");
  if (!EMAIL_RE.test(contactEmail)) return fail("Please enter a valid email address.");
  if (contactPhone.length < 6) return fail("Please enter a valid phone number.");

  const userId = await getSessionUserId();

  if (type === "customized" && !userId) {
    return NextResponse.json(
      { ok: false, error: "Please sign in to submit a customized trip request." },
      { status: 401 }
    );
  }

  if (type === "customized" && !(body.destination || "").trim()) {
    return fail("Please tell us your preferred destination.");
  }

  if (type === "standard" && !(body.packageTitle || "").trim()) {
    return fail("Missing package details.");
  }

  const travellersCount = body.travellersCount ? Number(body.travellersCount) : undefined;

  try {
    const booking = await createBooking({
      type,
      userId,
      packageId: body.packageId,
      packageTitle: body.packageTitle,
      departureId: body.departureId,
      destination: body.destination,
      travelDate: body.travelDate,
      travellersCount: Number.isFinite(travellersCount) ? travellersCount : undefined,
      travellerNames: body.travellerNames,
      budget: body.budget,
      specialRequirements: body.specialRequirements,
      contactName,
      contactEmail,
      contactPhone,
    });
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    if (error instanceof SoldOutError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 409 });
    }
    console.error("create booking error:", error);
    return NextResponse.json(
      { ok: false, error: "Could not submit your booking. Please try again." },
      { status: 500 }
    );
  }
}

function fail(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
