import { NextResponse } from "next/server";
import { buildCustomPackageEmail } from "@/lib/email/customPackageEmail";

/**
 * Dev-only preview of the custom-package delivery email. Open
 * /api/email-preview/custom-package in the browser to see the rendered HTML,
 * or add ?format=text for the plain-text fallback. Disabled in production.
 */
export function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const email = buildCustomPackageEmail({
    customerName: "Neha Kapoor",
    bookingCode: "BKG-7QX4K2",
    packageTitle: "Your Custom Kerala Backwaters Escape",
    destination: "Kerala",
    travelDate: "12–19 Sep 2026",
    durationLabel: "7 Nights / 8 Days",
    travellersCount: 2,
    priceAmount: "₹1,24,000",
    pdfUrl: "https://example.com/itineraries/BKG-7QX4K2.pdf",
    portalUrl: "https://bandhantours.com/account/bookings/BKG-7QX4K2",
    agentName: "Priya from Bandhan Tours",
    validityNote: "This quote is held for 7 days. Prices may vary with season and availability.",
  });

  const format = new URL(request.url).searchParams.get("format");
  if (format === "text") {
    return new NextResponse(email.text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(email.html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
