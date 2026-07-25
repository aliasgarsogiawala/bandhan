import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getActor } from "@/lib/bookings/authz";
import { addNotification, getBookingById } from "@/lib/bookings/db";
import type { NotificationChannel } from "@/lib/bookings/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const CHANNELS: NotificationChannel[] = ["email", "whatsapp", "in-app"];

export async function POST(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }

  const actor = await getActor(request);
  if (!actor) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });

  const { id } = await params;
  const existing = await getBookingById(id);
  if (!existing) return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });

  let body: { channel?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const channel = CHANNELS.includes(body.channel as NotificationChannel)
    ? (body.channel as NotificationChannel)
    : "in-app";
  const message = (body.message || "").trim();
  if (!message) return NextResponse.json({ ok: false, error: "Missing message." }, { status: 400 });

  // No real email/WhatsApp send is wired up yet (third-party APIs are outside
  // this phase's scope) — the notification is logged so it shows up in the
  // customer portal, and this is the single place to plug in a real provider.
  try {
    const notification = await addNotification(id, channel, message);
    return NextResponse.json({ ok: true, notification });
  } catch (error) {
    console.error("add notification error:", error);
    return NextResponse.json({ ok: false, error: "Could not log the notification." }, { status: 500 });
  }
}
