import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { actorCanManageBooking, actorCanViewBooking, getActor } from "@/lib/bookings/authz";
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

  try {
    let booking = existing;
    switch (body.action) {
      case "assign": {
        if (actor.kind !== "agent") {
          return NextResponse.json({ ok: false, error: "Only agents can self-assign." }, { status: 400 });
        }
        booking = (await assignAgent(id, actor.id, actor.label)) ?? existing;
        break;
      }
      case "assignTo": {
        if (actor.kind !== "admin") {
          return NextResponse.json({ ok: false, error: "Only admins can assign to any agent." }, { status: 400 });
        }
        if (!body.agentId) return NextResponse.json({ ok: false, error: "Missing agentId." }, { status: 400 });
        booking = (await assignAgent(id, body.agentId, actor.label)) ?? existing;
        break;
      }
      case "setPricing": {
        if (!body.priceAmount) return NextResponse.json({ ok: false, error: "Missing price." }, { status: 400 });
        booking = (await setPricing(id, body.priceAmount, actor.label)) ?? existing;
        break;
      }
      case "approve": {
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
        booking = (await setRemarks(id, body.remarks)) ?? existing;
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
