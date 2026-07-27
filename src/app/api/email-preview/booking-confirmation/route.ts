import { NextResponse } from "next/server";
import { buildBookingConfirmationDocument } from "@/lib/documents/bookingConfirmation";
import { renderBookingConfirmationPdf } from "@/lib/documents/bookingConfirmationPdf";
import type { BookingConfirmationInput } from "@/lib/documents/bookingConfirmation";

/**
 * Dev-only preview of the booking-confirmation voucher with sample data. Open
 * /api/email-preview/booking-confirmation for the generated PDF, or add
 * ?format=html for the printable HTML version. Disabled in production.
 */

export const runtime = "nodejs";

const SAMPLE: BookingConfirmationInput = {
  bookingCode: "BKG-7QX4K2",
  packageTitle: "Kerala Backwaters Escape",
  destination: "Kerala — Kochi, Munnar, Alleppey",
  travelDate: "12–19 Sep 2026",
  durationLabel: "7 Nights / 8 Days",
  travellersCount: 2,
  travellerNames: "Neha Kapoor, Arjun Kapoor",
  customerName: "Neha Kapoor",
  customerEmail: "neha.kapoor@example.com",
  customerPhone: "+91 98200 44112",
  status: "confirmed",
  priceAmount: "₹1,24,000",
  amountPaid: "₹30,000",
  balanceDue: "₹94,000",
  paymentStatus: "pending",
  paymentDueNote: "payable by 20 Aug 2026",
  specialRequirements:
    "Vegetarian meals for both travellers. Ground-floor room in Munnar if available.",
  agentName: "Priya Sen",
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = new URL(request.url);

  if (url.searchParams.get("format") === "html") {
    const html = buildBookingConfirmationDocument({
      ...SAMPLE,
      autoPrint: url.searchParams.get("print") === "1",
    });
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const pdf = await renderBookingConfirmationPdf(SAMPLE);
  return new NextResponse(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Bandhan-Tours-Booking-Confirmation-Sample.pdf"',
      "Content-Length": String(pdf.byteLength),
    },
  });
}
