import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteDeparture, updateDeparture } from "@/lib/departures/db";
import type { DepartureStatus } from "@/lib/departures/types";

const STATUSES: DepartureStatus[] = ["filling-fast", "limited-seats", "guaranteed", "sold-out"];

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface PatchBody {
  destination?: string;
  date?: string;
  duration?: string;
  price?: string;
  totalSeats?: string | number;
  seatsLeft?: string | number;
  status?: string;
  isActive?: boolean;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const { id } = await params;
  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const totalSeats = body.totalSeats !== undefined ? Number(body.totalSeats) : undefined;
  if (totalSeats !== undefined && (!Number.isFinite(totalSeats) || totalSeats < 1)) {
    return NextResponse.json({ ok: false, error: "Invalid total seat count." }, { status: 400 });
  }
  const seatsLeft = body.seatsLeft !== undefined ? Number(body.seatsLeft) : undefined;
  if (seatsLeft !== undefined && (!Number.isFinite(seatsLeft) || seatsLeft < 0)) {
    return NextResponse.json({ ok: false, error: "Invalid seats-left count." }, { status: 400 });
  }
  if (body.status !== undefined && !STATUSES.includes(body.status as DepartureStatus)) {
    return NextResponse.json({ ok: false, error: "Invalid status." }, { status: 400 });
  }

  try {
    const departure = await updateDeparture(id, {
      destination: body.destination?.trim(),
      date: body.date?.trim(),
      duration: body.duration?.trim(),
      price: body.price?.trim(),
      totalSeats,
      seatsLeft,
      status: body.status as DepartureStatus | undefined,
      isActive: body.isActive,
    });
    if (!departure) return NextResponse.json({ ok: false, error: "Departure not found." }, { status: 404 });
    return NextResponse.json({ ok: true, departure });
  } catch (error) {
    console.error("update departure error:", error);
    return NextResponse.json({ ok: false, error: "Could not update the departure." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteDeparture(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("delete departure error:", error);
    return NextResponse.json({ ok: false, error: "Could not delete the departure." }, { status: 500 });
  }
}
