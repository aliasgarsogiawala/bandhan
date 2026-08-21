import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { createBooking, listAll, SoldOutError } from "@/lib/bookings/db";
import { findUserByEmail } from "@/lib/auth/users";
import { normalizeParty, PartyError, type PartyContactInput } from "@/lib/bookings/party";
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
  contact?: PartyContactInput;
  bookingSource?: BookingSource;
  departureCity?: string;
  durationLabel?: string;
  travellers?: TravellerBreakdown;
  rooms?: RoomConfiguration;
  selectedAddons?: SelectedAddon[];
  pricingSnapshot?: QuoteSnapshot;
  packageSnapshot?: BookingPackageSnapshot;
  internalRemarks?: string;
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
  const bookingSource: BookingSource =
    body.bookingSource === "destination" || body.bookingSource === "custom"
      ? body.bookingSource
      : "package";

  let party;
  try {
    party = normalizeParty(
      {
        bookedFor: "self",
        contact: body.contact || {
          name: body.contactName,
          email: body.contactEmail,
          phone: body.contactPhone,
        },
      },
      { allow: ["self"] }
    );
  } catch (error) {
    if (error instanceof PartyError) return fail(error.message);
    throw error;
  }

  if (type === "customized" && !(body.destination || "").trim()) {
    return fail("Please enter the destination the customer wants.");
  }
  if (type === "standard" && !(body.packageTitle || "").trim() && !body.departureId) {
    return fail("Select a package or a group departure.");
  }
  if (!(body.travelDate || "").trim() && !body.departureId) {
    return fail("Please enter the travel date.");
  }

  const travellers = sanitizeTravellers(body.travellers, body.travellersCount);
  const travellersCount = totalTravellers(travellers);
  if (travellersCount < 1) return fail("Please add at least one traveller.");
  const rooms = sanitizeRooms(body.rooms, travellersCount);
  const existingCustomer = await findUserByEmail(party.contact.email);

  try {
    const booking = await createBooking({
      type,
      userId: existingCustomer?.id ?? null,
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
      rooms,
      selectedAddons: body.selectedAddons,
      pricingSnapshot: body.pricingSnapshot,
      packageSnapshot: body.packageSnapshot,
      party,
      createdBy: "admin",
      createdNote: "Logged by admin",
      internalRemarks: body.internalRemarks,
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

function sanitizeRooms(value: RoomConfiguration | undefined, travellersCount: number): RoomConfiguration {
  const safe = (input: unknown) => {
    const numeric = Number(input);
    return Number.isFinite(numeric) ? Math.min(99, Math.max(0, Math.floor(numeric))) : 0;
  };
  const rooms = {
    singleRooms: safe(value?.singleRooms),
    doubleRooms: safe(value?.doubleRooms),
    tripleRooms: safe(value?.tripleRooms),
  };
  if (rooms.singleRooms + rooms.doubleRooms + rooms.tripleRooms === 0) {
    rooms.doubleRooms = Math.max(1, Math.ceil(travellersCount / 2));
  }
  return rooms;
}
