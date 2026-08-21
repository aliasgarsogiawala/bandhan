import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { actorCanManageBooking, getActor } from "@/lib/bookings/authz";
import { addNotification, getBookingById } from "@/lib/bookings/db";
import { escapeHtml } from "@/lib/email/company";
import { sendTransactionalEmail } from "@/lib/email/sendEmail";
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
  if (!actorCanManageBooking(actor, existing)) {
    return NextResponse.json({ ok: false, error: "This booking is not assigned to you." }, { status: 403 });
  }

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

  if (message.length > 2000) {
    return NextResponse.json({ ok: false, error: "Keep the message under 2,000 characters." }, { status: 400 });
  }

  try {
    if (channel === "whatsapp") {
      const phone = existing.contact_phone.replace(/\D/g, "");
      if (phone.length < 8) {
        return NextResponse.json(
          { ok: false, error: "The lead traveller does not have a valid WhatsApp number." },
          { status: 409 }
        );
      }
      const notification = await addNotification(id, channel, message);
      const shareUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      return NextResponse.json({ ok: true, notification, delivered: false, mode: "share", shareUrl });
    }

    if (channel === "email") {
      const subject = `Bandhan Tours update · ${existing.booking_code}`;
      const result = await sendTransactionalEmail({
        to: existing.contact_email,
        cc:
          existing.notify_booker &&
          existing.booker_email &&
          existing.booker_email !== existing.contact_email
            ? [existing.booker_email]
            : undefined,
        subject,
        text: message,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#1f2937"><p>${escapeHtml(
          message
        ).replaceAll("\n", "<br />")}</p><p style="font-size:12px;color:#64748b">Booking ${escapeHtml(
          existing.booking_code
        )} · Bandhan Tours</p></div>`,
      });
      const notification = await addNotification(id, channel, message);
      if (result.delivered) {
        return NextResponse.json({ ok: true, notification, delivered: true, provider: result.provider });
      }
      const mailtoUrl = `mailto:${encodeURIComponent(existing.contact_email)}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message)}`;
      return NextResponse.json({
        ok: true,
        notification,
        delivered: false,
        provider: result.provider,
        mailtoUrl,
      });
    }

    const notification = await addNotification(id, channel, message);
    return NextResponse.json({ ok: true, notification, delivered: true, mode: "in-app" });
  } catch (error) {
    console.error("send booking notification error:", error);
    return NextResponse.json({ ok: false, error: "Could not send the notification." }, { status: 500 });
  }
}
