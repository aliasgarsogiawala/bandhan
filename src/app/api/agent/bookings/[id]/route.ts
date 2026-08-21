import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { actorCanManageBooking, actorCanViewBooking, getActor } from "@/lib/bookings/authz";
import { findAgentById } from "@/lib/auth/agents";
import { getDepartureById } from "@/lib/departures/db";
import { parseMoney } from "@/lib/bookings/pricing";
import {
  assignAgent,
  getBookingById,
  setPaymentStatus,
  setPricing,
  setRemarks,
  updateStatus,
  SoldOutError,
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
  | "complete";

interface PatchBody {
  action?: Action;
  priceAmount?: string;
  remarks?: string;
  note?: string;
  agentId?: string;
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
      default:
        return NextResponse.json({ ok: false, error: "Unknown action." }, { status: 400 });
    }
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    if (error instanceof SoldOutError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 409 });
    }
    console.error("update booking error:", error);
    return NextResponse.json({ ok: false, error: "Could not update the booking." }, { status: 500 });
  }
}

function validateWorkflowAction(action: Action | undefined, status: string): string | null {
  if (!action || ["assign", "assignTo", "setRemarks"].includes(action)) return null;
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
