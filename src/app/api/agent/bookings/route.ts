import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getActor } from "@/lib/bookings/authz";
import { findAgentById } from "@/lib/auth/agents";
import { findUserByEmail } from "@/lib/auth/users";
import {
  createBooking,
  listAll,
  listForAgent,
  setRemarks,
  SoldOutError,
} from "@/lib/bookings/db";
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

interface CreateAgentBookingBody {
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
  /** The client travelling. Their email/phone fall back to the agent's. */
  contact?: PartyContactInput;
  agentReference?: string;
  internalRemarks?: string;
  notifyBooker?: boolean;
}

/**
 * Creates a booking an agent is raising on behalf of a client.
 *
 * This is deliberately not the public journey: there is no terms checkbox for
 * the agent to tick on the client's behalf, the agent is recorded as the
 * booker, the booking is assigned to them immediately (so it never lands in
 * the unassigned queue), and it opens at "reviewing" because a human is
 * already working it.
 */
export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Not available — the database isn't configured." },
      { status: 503 }
    );
  }

  const actor = await getActor(request);
  if (!actor) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });

  let body: CreateAgentBookingBody;
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

  const agent = actor.kind === "agent" ? await findAgentById(actor.id) : null;
  if (actor.kind === "agent" && !agent) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  let party;
  try {
    party = normalizeParty(
      { bookedFor: "client", contact: body.contact, notifyBooker: body.notifyBooker },
      {
        allow: ["client"],
        agentContact: agent
          ? { name: agent.name, email: agent.email, phone: agent.phone || "—" }
          : { name: "Bandhan Tours desk", email: "desk@bandhantours.local", phone: "—" },
      }
    );
  } catch (error) {
    if (error instanceof PartyError) return fail(error.message);
    throw error;
  }

  if (type === "customized" && !(body.destination || "").trim()) {
    return fail("Please enter the destination your client wants.");
  }
  if (type === "standard" && !(body.packageTitle || "").trim() && !body.departureId) {
    return fail("Select a package or a group departure.");
  }
  if (!(body.travelDate || "").trim()) return fail("Please enter the travel date.");

  const travellers = sanitizeTravellers(body.travellers, body.travellersCount);
  const travellersCount = totalTravellers(travellers);
  if (travellersCount < 1) return fail("Please add at least one traveller.");

  // A client who already has an account keeps this booking in their own
  // "My trips" list, so the agent's work is visible to them straight away.
  const existingCustomer = await findUserByEmail(party.contact.email);

  try {
    const booking = await createBooking({
      type,
      userId: existingCustomer?.id ?? null,
      agentId: actor.kind === "agent" ? actor.id : null,
      agentReference: (body.agentReference || "").trim() || null,
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
      party,
      status: "reviewing",
      createdBy: actor.label,
      createdNote: `Raised by ${party.booker?.name} for ${party.contact.name}`,
    });

    const remarks = (body.internalRemarks || "").trim();
    if (remarks) await setRemarks(booking.id, remarks);

    return NextResponse.json({
      ok: true,
      booking,
      brochureUrl: `/api/bookings/${booking.id}/brochure?token=${booking.access_token}`,
    });
  } catch (error) {
    if (error instanceof SoldOutError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 409 });
    }
    console.error("create agent booking error:", error);
    return NextResponse.json({ ok: false, error: "Could not create the booking." }, { status: 500 });
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
