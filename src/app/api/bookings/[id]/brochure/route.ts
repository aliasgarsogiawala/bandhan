import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { getActor } from "@/lib/bookings/authz";
import { getBookingById } from "@/lib/bookings/db";
import {
  quotationBrochureFileName,
  renderQuotationBrochurePdf,
} from "@/lib/documents/quotationBrochurePdf";

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
  if (!isOwner && !actor && !hasAccessToken) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }

  const pdf = await renderQuotationBrochurePdf(booking);
  const disposition = url.searchParams.get("download") === "1" ? "attachment" : "inline";
  return new NextResponse(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${quotationBrochureFileName(booking)}"`,
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
