import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";
import { createBooking, SoldOutError } from "@/lib/bookings/db";
import type { BookingType } from "@/lib/bookings/types";
import type {
  BookingPackageSnapshot,
  BookingSource,
  QuoteSnapshot,
  RoomConfiguration,
  SelectedAddon,
  TravellerBreakdown,
} from "@/lib/bookings/pricing";
import { totalTravellers } from "@/lib/bookings/pricing";

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
  bookingSource?: BookingSource;
  departureCity?: string;
  durationLabel?: string;
  travellers?: TravellerBreakdown;
  rooms?: RoomConfiguration;
  selectedAddons?: SelectedAddon[];
  pricingSnapshot?: QuoteSnapshot;
  packageSnapshot?: BookingPackageSnapshot;
  termsAccepted?: boolean;
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
  const bookingSource: BookingSource =
    body.bookingSource === "destination" || body.bookingSource === "custom"
      ? body.bookingSource
      : "package";
  const contactName = (body.contactName || "").trim();
  const contactEmail = (body.contactEmail || "").trim().toLowerCase();
  const contactPhone = (body.contactPhone || "").trim();

  if (contactName.length < 2) return fail("Please enter your name.");
  if (!EMAIL_RE.test(contactEmail)) return fail("Please enter a valid email address.");
  if (contactPhone.length < 6) return fail("Please enter a valid phone number.");

  const userId = await getSessionUserId();

  if (bookingSource === "custom" && !userId) {
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

  if (!(body.travelDate || "").trim()) return fail("Please select your travel date.");
  if (!body.termsAccepted) return fail("Please accept the booking and cancellation terms.");

  const travellers = sanitizeTravellers(body.travellers, body.travellersCount);
  const travellersCount = totalTravellers(travellers);
  if (travellersCount < 1) return fail("Please add at least one traveller.");
  if (!body.pricingSnapshot || !Number.isFinite(Number(body.pricingSnapshot.total))) {
    return fail("The quotation could not be calculated. Please review your trip details.");
  }

  try {
    const booking = await createBooking({
      type,
      userId,
      packageId: body.packageId,
      packageTitle: body.packageTitle,
      departureId: body.departureId,
      bookingSource,
      destination: body.destination,
      travelDate: body.travelDate,
      travellersCount,
      travellerNames: body.travellerNames,
      budget: body.budget,
      specialRequirements: body.specialRequirements,
      departureCity: body.departureCity,
      durationLabel: body.durationLabel,
      travellers,
      rooms: body.rooms,
      selectedAddons: body.selectedAddons,
      pricingSnapshot: body.pricingSnapshot,
      packageSnapshot: body.packageSnapshot,
      termsAccepted: body.termsAccepted,
      contactName,
      contactEmail,
      contactPhone,
    });
    return NextResponse.json({
      ok: true,
      booking,
      accessToken: booking.access_token,
      brochureUrl: `/api/bookings/${booking.id}/brochure?token=${booking.access_token}`,
    });
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

function sanitizeTravellers(
  value: TravellerBreakdown | undefined,
  fallback: string | number | undefined
): TravellerBreakdown {
  const safe = (input: unknown, defaultValue = 0) => {
    const numeric = Number(input);
    return Number.isFinite(numeric) ? Math.min(99, Math.max(0, Math.floor(numeric))) : defaultValue;
  };
  return {
    adults: safe(value?.adults, safe(fallback, 1)),
    childrenWithBed: safe(value?.childrenWithBed),
    childrenWithoutBed: safe(value?.childrenWithoutBed),
    infants: safe(value?.infants),
  };
}

function fail(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
