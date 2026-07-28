import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { createDeparture, listAllDepartures } from "@/lib/departures/db";
import type { DepartureStatus } from "@/lib/departures/types";

const STATUSES: DepartureStatus[] = ["filling-fast", "limited-seats", "guaranteed", "sold-out"];

export async function GET(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ departures: [] });
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  try {
    const departures = await listAllDepartures();
    return NextResponse.json({ ok: true, departures });
  } catch (error) {
    console.error("list departures error:", error);
    return NextResponse.json({ ok: false, error: "Could not load departures." }, { status: 500 });
  }
}

interface CreateBody {
  destination?: string;
  date?: string;
  duration?: string;
  price?: string;
  totalSeats?: string | number;
  seatsLeft?: string | number;
  status?: string;
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

  const destination = (body.destination || "").trim();
  const date = (body.date || "").trim();
  const totalSeats = Number(body.totalSeats);
  const status = STATUSES.includes(body.status as DepartureStatus)
    ? (body.status as DepartureStatus)
    : "guaranteed";

  if (destination.length < 2) return fail("Please enter a destination.");
  if (!date) return fail("Please enter a departure date.");
  if (!Number.isFinite(totalSeats) || totalSeats < 1) return fail("Please enter a valid seat count.");

  const seatsLeft = body.seatsLeft !== undefined ? Number(body.seatsLeft) : totalSeats;
  if (!Number.isFinite(seatsLeft) || seatsLeft < 0 || seatsLeft > totalSeats) {
    return fail("Seats left must be between 0 and the total seat count.");
  }

  try {
    const departure = await createDeparture({
      destination,
      date,
      duration: (body.duration || "").trim() || undefined,
      price: (body.price || "").trim() || undefined,
      totalSeats,
      seatsLeft,
      status,
    });
    return NextResponse.json({ ok: true, departure });
  } catch (error) {
    console.error("create departure error:", error);
    return NextResponse.json({ ok: false, error: "Could not create the departure." }, { status: 500 });
  }
}

function fail(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
