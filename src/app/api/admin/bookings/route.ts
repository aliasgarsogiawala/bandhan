import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { createBooking, listAll, SoldOutError } from "@/lib/bookings/db";
import type { BookingType } from "@/lib/bookings/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

interface CreateBody {
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
      { ok: false, error: "Not available — the database isn't configured." },
      { status: 503 }
    );
  }
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  let body: CreateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const type: BookingType = body.type === "customized" ? "customized" : "standard";
  const contactName = (body.contactName || "").trim();
  const contactEmail = (body.contactEmail || "").trim().toLowerCase();
  const contactPhone = (body.contactPhone || "").trim();

  if (contactName.length < 2) return fail("Please enter the customer's name.");
  if (!EMAIL_RE.test(contactEmail)) return fail("Please enter a valid email address.");
  if (contactPhone.length < 6) return fail("Please enter a valid phone number.");
  if (!body.packageId && !body.departureId && !(body.destination || "").trim()) {
    return fail("Select a package, a departure, or enter a destination.");
  }

  const travellersCount = body.travellersCount ? Number(body.travellersCount) : undefined;

  try {
    const booking = await createBooking({
      type,
      packageId: body.packageId,
      packageTitle: body.packageTitle,
      departureId: body.departureId,
      destination: body.destination,
      travelDate: body.travelDate,
      travellersCount: Number.isFinite(travellersCount) ? travellersCount : undefined,
      travellerNames: body.travellerNames,
      budget: body.budget,
      specialRequirements: body.specialRequirements,
      // A walk-in or phone booking is still the customer booking for
      // themselves — admin is recording it, not travelling.
      party: {
        bookedFor: "self",
        contact: { name: contactName, email: contactEmail, phone: contactPhone },
        booker: null,
        relation: null,
        notifyBooker: true,
      },
      createdBy: "admin",
      createdNote: "Logged by admin",
    });
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    if (error instanceof SoldOutError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 409 });
    }
    console.error("create admin booking error:", error);
    return NextResponse.json({ ok: false, error: "Could not create the booking." }, { status: 500 });
  }
}

function fail(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
