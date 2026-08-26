import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { actorCanManageBooking, actorCanViewBooking, getActor } from "@/lib/bookings/authz";
import { findAgentById } from "@/lib/auth/agents";
import { findUserByEmail } from "@/lib/auth/users";
import { getDepartureById } from "@/lib/departures/db";
import { EMAIL_RE } from "@/lib/bookings/party";
import { parseMoney, type RoomConfiguration, type TravellerBreakdown } from "@/lib/bookings/pricing";
import type { Booking } from "@/lib/bookings/types";
import {
  assignAgent,
  getBookingById,
  setPaymentStatus,
  setPricing,
  setRemarks,
  updateStatus,
  SoldOutError,
  updateManagedBookingDetails,
} from "@/lib/bookings/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

type Action =
  | "assign"
  | "assignTo"
  | "setPricing"
  | "approve"
  | "reject"
  | "cancel"
  | "markPaymentReceived"
  | "setRemarks"
  | "complete"
  | "updateDetails";

interface DetailsInput {
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  destination?: string;
  travelDate?: string;
  departureCity?: string;
  durationLabel?: string;
  travellerNames?: string;
  budget?: string;
  specialRequirements?: string;
  travellers?: Partial<TravellerBreakdown>;
  rooms?: Partial<RoomConfiguration>;
}

interface PatchBody {
  action?: Action;
  priceAmount?: string;
  remarks?: string;
  note?: string;
  agentId?: string;
  details?: DetailsInput;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }

  const actor = await getActor(request);
  if (!actor) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });

  const { id } = await params;
  const existing = await getBookingById(id);
  if (!existing) return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });

  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (body.action === "assign") {
    if (!actorCanViewBooking(actor, existing) || existing.agent_id !== null) {
      return NextResponse.json({ ok: false, error: "This booking is assigned to another agent." }, { status: 403 });
    }
  } else if (!actorCanManageBooking(actor, existing)) {
    return NextResponse.json({ ok: false, error: "This booking is not assigned to you." }, { status: 403 });
  }

  const workflowError = validateWorkflowAction(body.action, existing.status);
  if (workflowError) {
    return NextResponse.json({ ok: false, error: workflowError }, { status: 409 });
  }

  try {
    let booking = existing;
    switch (body.action) {
      case "assign": {
        if (actor.kind !== "agent") {
          return NextResponse.json({ ok: false, error: "Only agents can self-assign." }, { status: 400 });
        }
        booking = (await assignAgent(id, actor.id, actor.label, actor.label)) ?? existing;
        break;
      }
      case "assignTo": {
        if (actor.kind !== "admin") {
          return NextResponse.json({ ok: false, error: "Only admins can assign to any agent." }, { status: 400 });
        }
        if (!body.agentId) return NextResponse.json({ ok: false, error: "Missing agentId." }, { status: 400 });
        const assignee = await findAgentById(body.agentId);
        if (!assignee || assignee.status !== "active") {
          return NextResponse.json({ ok: false, error: "Select an active agent." }, { status: 400 });
        }
        booking = (await assignAgent(id, body.agentId, actor.label, assignee.name)) ?? existing;
        break;
      }
      case "setPricing": {
        if (parseMoney(body.priceAmount) <= 0) {
          return NextResponse.json({ ok: false, error: "Enter a valid quoted price." }, { status: 400 });
        }
        booking = (await setPricing(id, body.priceAmount || "", actor.label)) ?? existing;
        break;
      }
      case "approve": {
        if (existing.departure_id) {
          const departure = await getDepartureById(existing.departure_id);
          const requiredSeats = Math.max(1, existing.travellers_count || 1);
          if (!departure || departure.seats_left < requiredSeats) {
            return NextResponse.json(
              {
                ok: false,
                error: departure
                  ? `Only ${departure.seats_left} seat${departure.seats_left === 1 ? " is" : "s are"} available for this departure.`
                  : "The selected departure is no longer available.",
              },
              { status: 409 }
            );
          }
        }
        booking = (await updateStatus(id, "approved", actor.label, body.note)) ?? existing;
        break;
      }
      case "reject": {
        booking = (await updateStatus(id, "rejected", actor.label, body.note)) ?? existing;
        break;
      }
      case "cancel": {
        booking = (await updateStatus(id, "cancelled", actor.label, body.note)) ?? existing;
        break;
      }
      case "markPaymentReceived": {
        booking = (await setPaymentStatus(id, "received", actor.label)) ?? existing;
        break;
      }
      case "setRemarks": {
        if (typeof body.remarks !== "string") {
          return NextResponse.json({ ok: false, error: "Missing remarks." }, { status: 400 });
        }
        booking = (await setRemarks(id, body.remarks, actor.label)) ?? existing;
        break;
      }
      case "complete": {
        booking = (await updateStatus(id, "completed", actor.label, body.note)) ?? existing;
        break;
      }
      case "updateDetails": {
        booking = (await updateDetails(id, existing, body.details, actor.label)) ?? existing;
        break;
      }
      default:
        return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
    }
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    if (error instanceof UserInputError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    if (error instanceof SoldOutError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 409 });
    }
    console.error("update booking error:", error);
    return NextResponse.json({ ok: false, error: "Could not update the booking." }, { status: 500 });
  }
}

function validateWorkflowAction(action: Action | undefined, status: string): string | null {
  if (!action || ["assign", "assignTo", "setRemarks"].includes(action)) return null;
  if (action === "updateDetails" && !["new", "reviewing", "quoted", "approved", "payment_pending"].includes(status)) {
    return "Confirmed or closed bookings cannot be edited.";
  }
  if (action === "setPricing" && !["new", "reviewing", "quoted"].includes(status)) {
    return "Pricing can only be confirmed while the request is under review.";
  }
  if (action === "approve" && status !== "quoted") {
    return "Confirm pricing before approving this booking.";
  }
  if (action === "markPaymentReceived" && !["approved", "payment_pending"].includes(status)) {
    return "Approve the booking before recording payment.";
  }
  if (action === "complete" && status !== "confirmed") {
    return "Only a confirmed booking can be completed.";
  }
  if (action === "reject" && !["new", "reviewing", "quoted", "approved"].includes(status)) {
    return "This booking can no longer be rejected. Cancel it instead if appropriate.";
  }
  if (action === "cancel" && ["rejected", "cancelled", "completed"].includes(status)) {
    return "This booking is already closed.";
  }
  return null;
}

async function updateDetails(
  id: string,
  existing: Booking,
  input: DetailsInput | undefined,
  changedBy: string
): Promise<Booking | null> {
  if (!input) throw new UserInputError("Missing booking details.");
  const contactName = (input.contactName || "").trim();
  const contactEmail = (input.contactEmail || "").trim().toLowerCase();
  const contactPhone = (input.contactPhone || "").trim();
  if (contactName.length < 2) throw new UserInputError("Enter the lead traveller's name.");
  if (!EMAIL_RE.test(contactEmail)) throw new UserInputError("Enter a valid email address.");
  if (contactPhone.replace(/\D/g, "").length < 8) throw new UserInputError("Enter a valid phone number.");
  const travelDate = (input.travelDate || "").trim();
  if (!travelDate) throw new UserInputError("Enter the travel date.");
  if (existing.departure_id && travelDate !== existing.travel_date) {
    throw new UserInputError("The date is locked to its group departure. Select a different departure by creating a revised booking.");
  }
  if (!existing.package_title && !(input.destination || "").trim()) {
    throw new UserInputError("Enter the destination.");
  }

  const travellers: TravellerBreakdown = {
    adults: safeCount(input.travellers?.adults, 1),
    childrenWithBed: safeCount(input.travellers?.childrenWithBed),
    childrenWithoutBed: safeCount(input.travellers?.childrenWithoutBed),
    infants: safeCount(input.travellers?.infants),
  };
  const total = travellers.adults + travellers.childrenWithBed + travellers.childrenWithoutBed + travellers.infants;
  if (total < 1) throw new UserInputError("Add at least one traveller.");
  const rooms: RoomConfiguration = {
    singleRooms: safeCount(input.rooms?.singleRooms),
    doubleRooms: safeCount(input.rooms?.doubleRooms),
    tripleRooms: safeCount(input.rooms?.tripleRooms),
  };
  if (rooms.singleRooms + rooms.doubleRooms + rooms.tripleRooms < 1) {
    throw new UserInputError("Add at least one room.");
  }
  if (existing.departure_id) {
    const departure = await getDepartureById(existing.departure_id);
    if (!departure || departure.seats_left < total) {
      throw new UserInputError(departure ? `Only ${departure.seats_left} seats remain on this departure.` : "The selected departure is no longer available.");
    }
  }

  const customer = await findUserByEmail(contactEmail);
  return updateManagedBookingDetails(id, {
    contactName,
    contactEmail,
    contactPhone,
    destination: input.destination,
    travelDate,
    departureCity: input.departureCity,
    durationLabel: input.durationLabel,
    travellerNames: input.travellerNames,
    budget: input.budget,
    specialRequirements: input.specialRequirements,
    travellers,
    rooms,
    userId: customer?.id ?? null,
  }, changedBy);
}

class UserInputError extends Error {}

function safeCount(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(99, Math.max(0, Math.floor(numeric))) : fallback;
}
