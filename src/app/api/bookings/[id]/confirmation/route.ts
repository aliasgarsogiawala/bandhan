import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";
import { actorCanViewBooking, getActor } from "@/lib/bookings/authz";
import { getBookingById } from "@/lib/bookings/db";
import {
  bookingConfirmationFileName,
  bookingConfirmationInputFromBooking,
  buildBookingConfirmationDocument,
} from "@/lib/documents/bookingConfirmation";
import { renderBookingConfirmationPdf } from "@/lib/documents/bookingConfirmationPdf";

/**
 * Serves the booking-confirmation voucher for a booking.
 *
 * Defaults to a generated PDF (`Content-Disposition: inline`, so browsers show
 * it in their viewer). `?format=html` returns the printable HTML version, and
 * `?download=1` forces a file download.
 *
 * Visible to the booking's owner, or to an admin/agent.
 */

// pdf-lib embeds fonts from disk, so this must run on the Node.js runtime.
export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }

  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  }
  const url = new URL(request.url);

  const userId = await getSessionUserId();
  const actor = await getActor(request);
  const isOwner = userId && booking.user_id === userId;
  const actorHasAccess = actor ? actorCanViewBooking(actor, booking) : false;
  if (!isOwner && !actorHasAccess) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }

  // The voucher only makes sense once the trip is actually locked in.
  if (!["confirmed", "completed"].includes(booking.status) && !actorHasAccess) {
    return NextResponse.json(
      { ok: false, error: "This booking is not confirmed yet." },
      { status: 409 }
    );
  }

  const input = bookingConfirmationInputFromBooking(booking);

  if (url.searchParams.get("format") === "html") {
    const html = buildBookingConfirmationDocument({
      ...input,
      autoPrint: url.searchParams.get("print") === "1",
    });
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const pdf = await renderBookingConfirmationPdf(input);
  const fileName = bookingConfirmationFileName(booking.booking_code);
  const disposition = url.searchParams.get("download") === "1" ? "attachment" : "inline";

  return new NextResponse(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${fileName}"`,
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
