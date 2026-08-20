import { NextResponse } from "next/server";
import type { Booking } from "@/lib/bookings/types";
import { packageSnapshot } from "@/lib/bookings/pricing";
import { renderQuotationBrochurePdf } from "@/lib/documents/quotationBrochurePdf";
import { renderQuotationPdf } from "@/lib/documents/quotationPdf";
import { featuredPackages } from "@/data/mockData";

export const runtime = "nodejs";

const previewPackage = featuredPackages.find(
  (pkg) => pkg.id === "sikkim-darjeeling-9n"
)!;

const SAMPLE: Booking = {
  id: "preview-booking",
  booking_code: "BKG-TRAVEL",
  quotation_number: "QT-TRAVEL",
  type: "standard",
  booking_source: "package",
  access_token: "preview",
  user_id: null,
  agent_id: null,
  package_id: previewPackage.id,
  package_title: previewPackage.title,
  departure_id: null,
  destination: "Sikkim & Darjeeling",
  travel_date: "15-24 October 2026",
  departure_city: "Mumbai",
  duration_label: "9 Nights / 10 Days",
  travellers_count: 3,
  traveller_names: "Aarav Mehta\nNaina Mehta\nRiya Mehta",
  budget: null,
  special_requirements: "Vegetarian meals and adjoining rooms wherever available.",
  contact_name: "Aarav Mehta",
  contact_email: "aarav@example.com",
  contact_phone: "+91 98765 43210",
  // Previewed as a "booking for someone else" so the brochure is exercised
  // with a booker attached, not just the simpler self-booking shape.
  booked_for: "guest",
  booker_name: "Riya Mehta",
  booker_email: "riya@example.com",
  booker_phone: "+91 90000 11122",
  booker_relation: "Family",
  notify_booker: true,
  agent_reference: null,
  status: "new",
  price_amount: "155000",
  payment_status: "pending",
  internal_remarks: null,
  adults: 2,
  children_with_bed: 1,
  children_without_bed: 0,
  infants: 0,
  room_configuration: { singleRooms: 0, doubleRooms: 2, tripleRooms: 0 },
  selected_addons: [
    {
      id: "private-airport-transfer",
      title: "Private airport transfer",
      quantity: 1,
      unitPrice: 2500,
      pricing: "per-booking",
    },
  ],
  pricing_snapshot: {
    currency: "INR",
    lineItems: [
      { key: "adults", label: "Adult package", quantity: 2, unitPrice: 52500, amount: 105000 },
      {
        key: "children-with-bed",
        label: "Child package - with bed",
        quantity: 1,
        unitPrice: 47500,
        amount: 47500,
      },
      {
        key: "addon-private-airport-transfer",
        label: "Private airport transfer",
        quantity: 1,
        unitPrice: 2500,
        amount: 2500,
      },
    ],
    subtotal: 155000,
    total: 155000,
    depositPercent: 25,
    depositAmount: 38750,
    balanceAmount: 116250,
    validityDays: 7,
    generatedAt: new Date().toISOString(),
    isIndicative: true,
  },
  package_snapshot: packageSnapshot(previewPackage),
  terms_accepted: true,
  quotation_status: "generated",
  brochure_sent_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }
  const documentType = new URL(request.url).searchParams.get("document");
  const quotationOnly = documentType === "quotation";
  const pdf = quotationOnly
    ? await renderQuotationPdf(SAMPLE)
    : await renderQuotationBrochurePdf(SAMPLE);
  return new NextResponse(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Bandhan-Tours-${
        quotationOnly ? "Quotation" : "Trip-Brochure"
      }-Sample.pdf"`,
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
