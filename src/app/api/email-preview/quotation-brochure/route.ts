import { NextResponse } from "next/server";
import type { Booking } from "@/lib/bookings/types";
import { renderQuotationBrochurePdf } from "@/lib/documents/quotationBrochurePdf";

export const runtime = "nodejs";

const SAMPLE: Booking = {
  id: "preview-booking",
  booking_code: "BKG-TRAVEL",
  quotation_number: "QT-TRAVEL",
  type: "standard",
  booking_source: "package",
  access_token: "preview",
  user_id: null,
  agent_id: null,
  package_id: "sikkim-special",
  package_title: "Mystic Northeast & Sikkim Special",
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
  status: "new",
  price_amount: "129375",
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
      { key: "adults", label: "Adult package", quantity: 2, unitPrice: 45500, amount: 91000 },
      {
        key: "children-with-bed",
        label: "Child package - with bed",
        quantity: 1,
        unitPrice: 34125,
        amount: 34125,
      },
      {
        key: "addon-private-airport-transfer",
        label: "Private airport transfer",
        quantity: 1,
        unitPrice: 2500,
        amount: 2500,
      },
    ],
    subtotal: 127625,
    total: 127625,
    depositPercent: 25,
    depositAmount: 31906,
    balanceAmount: 95719,
    validityDays: 7,
    generatedAt: new Date().toISOString(),
    isIndicative: true,
  },
  package_snapshot: {
    source: "package",
    id: "sikkim-special",
    title: "Mystic Northeast & Sikkim Special",
    destination: "Sikkim & Darjeeling",
    category: "Domestic",
    duration: "9 Nights / 10 Days",
    tagline: "Prayer flags, alpine lakes, tea gardens and mountain horizons.",
    overview:
      "This journey threads together the finest of the Eastern Himalayas - the monasteries and mountain passes of Gangtok, the sacred glacial waters of Tsomgo Lake, and the colonial charm of Darjeeling's tea country.",
    heroImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1600",
    bestTime: "March-June and October-December",
    startingPoint: "Bagdogra Airport (IXB)",
    groupSize: "2-16 guests",
    highlights: [
      "Gangtok monasteries and city sights",
      "Tsomgo Lake and Baba Mandir",
      "Darjeeling tea estates",
      "Sunrise over Kanchenjunga from Tiger Hill",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive at Bagdogra - Drive to Gangtok",
        description:
          "Meet your driver at Bagdogra Airport and follow the Teesta River into Sikkim. Evening free for MG Marg.",
        meals: "Dinner",
        stay: "Gangtok",
      },
      {
        day: 2,
        title: "Gangtok Monasteries & City Sights",
        description:
          "Visit Rumtek, Enchey Monastery, the Institute of Tibetology and Tashi Viewpoint.",
        meals: "Breakfast, Dinner",
        stay: "Gangtok",
      },
      {
        day: 3,
        title: "Tsomgo Lake & Baba Mandir",
        description:
          "A high-altitude excursion to the sacred glacial lake and Baba Harbhajan Singh Mandir.",
        meals: "Breakfast, Dinner",
        stay: "Gangtok",
      },
      {
        day: 4,
        title: "Continue through the Eastern Himalayas",
        description:
          "Travel through waterfall trails, mountain villages and tea country with curated stops.",
        meals: "Breakfast, Dinner",
        stay: "Darjeeling",
      },
    ],
    inclusions: [
      "Nine nights in handpicked hotels and heritage stays",
      "Daily breakfast and dinner",
      "Private transfers and sightseeing",
      "Local permits and driver allowances",
    ],
    exclusions: [
      "Flights or train fare to Bagdogra",
      "Lunch and personal expenses",
      "Optional activities not selected above",
      "Travel insurance unless added",
    ],
    themes: ["Himalayas", "Monasteries", "Tea Estates"],
    gallery: [],
  },
  terms_accepted: true,
  quotation_status: "generated",
  brochure_sent_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }
  const pdf = await renderQuotationBrochurePdf(SAMPLE);
  return new NextResponse(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Bandhan-Tours-Quotation-Brochure-Sample.pdf"',
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
