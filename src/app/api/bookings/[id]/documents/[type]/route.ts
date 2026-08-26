import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { actorCanViewBooking, getActor } from "@/lib/bookings/authz";
import { getBookingById } from "@/lib/bookings/db";
import { formatMoney, parseMoney } from "@/lib/bookings/pricing";
import { bookingConfirmationInputFromBooking } from "@/lib/documents/bookingConfirmation";
import { renderBookingConfirmationPdf } from "@/lib/documents/bookingConfirmationPdf";
import { renderQuotationBrochurePdf } from "@/lib/documents/quotationBrochurePdf";

export const runtime = "nodejs";

const TYPES = ["invoice", "receipt", "itinerary", "voucher"] as const;
type GeneratedDocumentType = (typeof TYPES)[number];

export async function GET(request: Request, { params }: { params: Promise<{ id: string; type: string }> }) {
  const { id, type: requestedType } = await params;
  if (!TYPES.includes(requestedType as GeneratedDocumentType)) {
    return NextResponse.json({ ok: false, error: "Unknown document type." }, { status: 404 });
  }
  const type = requestedType as GeneratedDocumentType;
  const booking = await getBookingById(id);
  if (!booking) return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });

  const userId = await getSessionUserId();
  const actor = await getActor(request);
  const isOwner = Boolean(userId && booking.user_id === userId);
  const actorHasAccess = actor ? actorCanViewBooking(actor, booking) : false;
  if (!isOwner && !actorHasAccess) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });

  if ((type === "voucher" || type === "receipt") && booking.status !== "completed" && booking.status !== "confirmed") {
    return NextResponse.json({ ok: false, error: `${type === "voucher" ? "Voucher" : "Receipt"} becomes available after confirmation.` }, { status: 409 });
  }
  if (type === "receipt" && booking.payment_status !== "received") {
    return NextResponse.json({ ok: false, error: "Payment has not been recorded yet." }, { status: 409 });
  }
  if (type === "invoice" && !booking.price_amount && !booking.pricing_snapshot?.total) {
    return NextResponse.json({ ok: false, error: "Pricing has not been confirmed yet." }, { status: 409 });
  }

  const suffix = booking.booking_code.replace(/^BKG-/, "");
  let pdf: Uint8Array;
  let fileName: string;
  if (type === "itinerary") {
    pdf = await renderQuotationBrochurePdf(booking);
    fileName = `Bandhan-Tours-Itinerary-${booking.booking_code}.pdf`;
  } else {
    const total = parseMoney(booking.price_amount || booking.pricing_snapshot?.total);
    const labels = {
      invoice: {
        label: "Invoice",
        number: `INV-${suffix}`,
        intro: "This invoice records the verified package value and booking details. Please quote the reference below for payment and correspondence.",
      },
      receipt: {
        label: "Payment Receipt",
        number: `REC-${suffix}`,
        intro: "Payment has been recorded for this booking. Keep this receipt with your travel documents for future reference.",
      },
      voucher: {
        label: "Travel Voucher",
        number: booking.booking_code,
        intro: "Your journey is confirmed. Present this voucher to Bandhan Tours and the named service partners whenever requested.",
      },
    } as const;
    const selected = labels[type];
    pdf = await renderBookingConfirmationPdf(bookingConfirmationInputFromBooking(booking, {
      documentLabel: selected.label,
      documentNumber: selected.number,
      introText: selected.intro,
      amountPaid: type === "receipt" && total ? formatMoney(total) : undefined,
      balanceDue: type === "receipt" ? formatMoney(0) : booking.pricing_snapshot?.balanceAmount ? formatMoney(booking.pricing_snapshot.balanceAmount) : undefined,
      notes: type === "invoice"
        ? ["This computer-generated invoice is based on the approved booking quotation.", "Please quote the invoice and booking references on all payment correspondence."]
        : undefined,
    }));
    fileName = `Bandhan-Tours-${selected.label.replace(/\s+/g, "-")}-${selected.number}.pdf`;
  }

  const disposition = new URL(request.url).searchParams.get("download") === "1" ? "attachment" : "inline";
  return new NextResponse(pdf as BodyInit, { headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `${disposition}; filename="${fileName}"`,
    "Content-Length": String(pdf.byteLength),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  } });
}
