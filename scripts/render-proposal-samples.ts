import fs from "node:fs/promises";
import path from "node:path";
import { featuredPackages } from "../src/data/mockData";
import { packageSnapshot } from "../src/lib/bookings/pricing";
import type { Booking } from "../src/lib/bookings/types";
import { renderQuotationPdf } from "../src/lib/documents/quotationPdf";
import { renderQuotationBrochurePdf } from "../src/lib/documents/quotationBrochurePdf";

const previewPackage = featuredPackages.find((pkg) => pkg.id === "sikkim-darjeeling-9n");
if (!previewPackage) throw new Error("Preview package not found.");

const snapshot = packageSnapshot(previewPackage);
// Keep local QA deterministic and independent of external image hosts.
snapshot.heroImage = undefined;

const sample: Booking = {
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
  travel_date: "2026-10-15",
  departure_city: "Mumbai",
  duration_label: "9 Nights / 10 Days",
  travellers_count: 5,
  traveller_names: "Aarav Mehta\nNaina Mehta\nRiya Mehta\nKabir Mehta",
  budget: null,
  special_requirements:
    "Vegetarian meals for the whole family, two adjoining rooms wherever available, and a relaxed sightseeing pace for the grandparents.",
  contact_name: "Aarav Mehta",
  contact_email: "aarav@example.com",
  contact_phone: "+91 98765 43210",
  booked_for: "guest",
  booker_name: "Riya Mehta",
  booker_email: "riya@example.com",
  booker_phone: "+91 90000 11122",
  booker_relation: "Family",
  notify_booker: true,
  agent_reference: null,
  status: "new",
  price_amount: "231500",
  payment_status: "pending",
  internal_remarks: null,
  adults: 3,
  children_with_bed: 1,
  children_without_bed: 1,
  infants: 0,
  room_configuration: { singleRooms: 1, doubleRooms: 2, tripleRooms: 0 },
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
      { key: "adults", label: "Adult package", quantity: 3, unitPrice: 52500, amount: 157500 },
      {
        key: "children-with-bed",
        label: "Child package - with bed",
        quantity: 1,
        unitPrice: 39500,
        amount: 39500,
      },
      {
        key: "children-without-bed",
        label: "Child package - without bed",
        quantity: 1,
        unitPrice: 26000,
        amount: 26000,
      },
      {
        key: "single-room-supplement",
        label: "Single room supplement",
        quantity: 1,
        unitPrice: 6000,
        amount: 6000,
      },
      {
        key: "addon-private-airport-transfer",
        label: "Private airport transfer",
        quantity: 1,
        unitPrice: 2500,
        amount: 2500,
      },
    ],
    subtotal: 231500,
    total: 231500,
    depositPercent: 25,
    depositAmount: 57875,
    balanceAmount: 173625,
    validityDays: 7,
    generatedAt: "2026-08-20T09:30:00.000Z",
    isIndicative: true,
  },
  package_snapshot: snapshot,
  terms_accepted: true,
  quotation_status: "generated",
  brochure_sent_at: null,
  created_at: "2026-08-20T09:30:00.000Z",
  updated_at: "2026-08-20T09:30:00.000Z",
};

async function main() {
  const outputDir = path.join(process.cwd(), "output", "pdf");
  await fs.mkdir(outputDir, { recursive: true });

  const [quotation, brochure] = await Promise.all([
    renderQuotationPdf(sample),
    renderQuotationBrochurePdf(sample),
  ]);

  await Promise.all([
    fs.writeFile(path.join(outputDir, "bandhan-quotation-sample.pdf"), quotation),
    fs.writeFile(path.join(outputDir, "bandhan-trip-brochure-sample.pdf"), brochure),
  ]);

  console.log(`Quotation: ${quotation.byteLength} bytes`);
  console.log(`Brochure: ${brochure.byteLength} bytes`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
