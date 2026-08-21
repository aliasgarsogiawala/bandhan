import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { findAgentById } from "@/lib/auth/agents";
import { findUserByEmail } from "@/lib/auth/users";
import {
  assignAgent,
  getBookingById,
  setPaymentStatus,
  setPricing,
  setRemarks,
  SoldOutError,
  unassignAgent,
  updateManagedBookingDetails,
  updateStatus,
} from "@/lib/bookings/db";
import { EMAIL_RE } from "@/lib/bookings/party";
import { parseMoney, type RoomConfiguration, type TravellerBreakdown } from "@/lib/bookings/pricing";
import type { Booking } from "@/lib/bookings/types";
import { getDepartureById } from "@/lib/departures/db";
import { isDbConfigured } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

type AdminAction =
  | "assignTo"
  | "unassign"
  | "setPricing"
  | "approve"
  | "reject"
  | "cancel"
  | "markPaymentReceived"
  | "setRemarks"
  | "complete"
  | "updateDetails";

const ADMIN_ACTIONS: AdminAction[] = [
  "assignTo",
  "unassign",
  "setPricing",
  "approve",
  "reject",
  "cancel",
  "markPaymentReceived",
  "setRemarks",
  "complete",
  "updateDetails",
];

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
  action?: AdminAction;
  agentId?: string;
  priceAmount?: string;
  remarks?: string;
  note?: string;
  details?: DetailsInput;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getBookingById(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as PatchBody | null;
  if (!body?.action || !ADMIN_ACTIONS.includes(body.action)) {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const workflowError = validateWorkflowAction(body.action, existing);
  if (workflowError) {
    return NextResponse.json({ ok: false, error: workflowError }, { status: 409 });
  }

  try {
    let booking: Booking | null = existing;
    switch (body.action) {
      case "assignTo": {
        if (!body.agentId) return fail("Select an agent.");
        const agent = await findAgentById(body.agentId);
        if (!agent || agent.status !== "active") return fail("Select an active agent.");
        booking = await assignAgent(id, agent.id, "admin", agent.name);
        break;
      }
      case "unassign":
        booking = await unassignAgent(id, "admin");
        break;
      case "setPricing":
        if (parseMoney(body.priceAmount) <= 0) return fail("Enter a valid quoted price.");
        booking = await setPricing(id, body.priceAmount || "", "admin");
        break;
      case "approve":
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
        booking = await updateStatus(id, "approved", "admin", cleanNote(body.note));
        break;
      case "reject":
        booking = await updateStatus(id, "rejected", "admin", cleanNote(body.note));
        break;
      case "cancel":
        booking = await updateStatus(id, "cancelled", "admin", cleanNote(body.note));
        break;
      case "markPaymentReceived":
        booking = await setPaymentStatus(id, "received", "admin");
        break;
      case "setRemarks":
        if (typeof body.remarks !== "string") return fail("Enter internal remarks.");
        booking = await setRemarks(id, body.remarks.trim(), "admin");
        break;
      case "complete":
        booking = await updateStatus(id, "completed", "admin", cleanNote(body.note));
        break;
      case "updateDetails":
        booking = await updateDetails(id, existing, body.details);
        break;
    }

    if (!booking) {
      return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    if (error instanceof UserInputError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    if (error instanceof SoldOutError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 409 });
    }
    console.error("admin booking update error:", error);
    return NextResponse.json({ ok: false, error: "Could not update the booking." }, { status: 500 });
  }
}

function validateWorkflowAction(action: AdminAction, booking: Booking): string | null {
  const status = booking.status;
  const terminal = ["rejected", "cancelled", "completed"].includes(status);
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
  if (action === "cancel" && terminal) return "This booking is already closed.";
  if (action === "updateDetails" && !["new", "reviewing"].includes(status)) {
    return "Traveller and trip details can only be edited before pricing is confirmed.";
  }
  return null;
}

async function updateDetails(
  id: string,
  existing: Booking,
  input: DetailsInput | undefined
): Promise<Booking | null> {
  if (!input) throw new Error("Missing booking details.");
  const contactName = (input.contactName || "").trim();
  const contactEmail = (input.contactEmail || "").trim().toLowerCase();
  const contactPhone = (input.contactPhone || "").trim();
  if (contactName.length < 2) throw new UserInputError("Enter the lead traveller's name.");
  if (!EMAIL_RE.test(contactEmail)) throw new UserInputError("Enter a valid email address.");
  if (contactPhone.replace(/\D/g, "").length < 8) {
    throw new UserInputError("Enter a valid phone number.");
  }
  if (!(input.travelDate || "").trim()) throw new UserInputError("Enter the travel date.");
  if (!existing.package_title && !(input.destination || "").trim()) {
    throw new UserInputError("Enter the destination.");
  }

  const travellers: TravellerBreakdown = {
    adults: safeCount(input.travellers?.adults, 1),
    childrenWithBed: safeCount(input.travellers?.childrenWithBed),
    childrenWithoutBed: safeCount(input.travellers?.childrenWithoutBed),
    infants: safeCount(input.travellers?.infants),
  };
  const total =
    travellers.adults +
    travellers.childrenWithBed +
    travellers.childrenWithoutBed +
    travellers.infants;
  if (total < 1) throw new UserInputError("Add at least one traveller.");
  const rooms: RoomConfiguration = {
    singleRooms: safeCount(input.rooms?.singleRooms),
    doubleRooms: safeCount(input.rooms?.doubleRooms),
    tripleRooms: safeCount(input.rooms?.tripleRooms),
  };
  if (rooms.singleRooms + rooms.doubleRooms + rooms.tripleRooms < 1) {
    throw new UserInputError("Add at least one room.");
  }

  const customer = await findUserByEmail(contactEmail);
  return updateManagedBookingDetails(
    id,
    {
      contactName,
      contactEmail,
      contactPhone,
      destination: input.destination,
      travelDate: input.travelDate,
      departureCity: input.departureCity,
      durationLabel: input.durationLabel,
      travellerNames: input.travellerNames,
      budget: input.budget,
      specialRequirements: input.specialRequirements,
      travellers,
      rooms,
      userId: customer?.id ?? null,
    },
    "admin"
  );
}

class UserInputError extends Error {}

function safeCount(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(99, Math.max(0, Math.floor(numeric))) : fallback;
}

function cleanNote(value?: string) {
  return (value || "").trim() || undefined;
}

function fail(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
