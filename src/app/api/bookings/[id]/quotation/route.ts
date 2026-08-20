import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { actorCanViewBooking, getActor } from "@/lib/bookings/authz";
import { getBookingById } from "@/lib/bookings/db";
import { quotationFileName, renderQuotationPdf } from "@/lib/documents/quotationPdf";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  }

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const userId = await getSessionUserId();
  const actor = await getActor(request);
  const isOwner = Boolean(userId && booking.user_id === userId);
  const hasAccessToken = Boolean(token && token === booking.access_token);
  const actorHasAccess = actor ? actorCanViewBooking(actor, booking) : false;
  if (!isOwner && !actorHasAccess && !hasAccessToken) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }

  const pdf = await renderQuotationPdf(booking);
  const disposition = url.searchParams.get("download") === "1" ? "attachment" : "inline";
  return new NextResponse(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${quotationFileName(booking)}"`,
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
