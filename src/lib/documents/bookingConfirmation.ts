import { BRAND, COMPANY, escapeHtml } from "@/lib/email/company";
import type { Booking, BookingStatus } from "@/lib/bookings/types";
import { BOOKING_STATUS_LABELS } from "@/lib/bookings/types";

/**
 * Builds the printable "Booking Confirmation" document (the travel voucher a
 * customer receives once their booking is confirmed).
 *
 * It renders a self-contained, A4-sized HTML document with print styles, so it
 * can be served straight to the browser and saved as a PDF (Ctrl/Cmd+P →
 * "Save as PDF"), emailed as an HTML attachment, or piped through any
 * HTML→PDF renderer later without touching this file.
 */
export interface BookingConfirmationInput {
  bookingCode: string;
  documentLabel?: string;
  documentNumber?: string;
  introText?: string;
  /** Trip title, e.g. "Kerala Backwaters Escape". */
  packageTitle: string;
  destination?: string | null;
  /** Human travel date/period, e.g. "12–19 Sep 2026". */
  travelDate?: string | null;
  durationLabel?: string | null;
  travellersCount?: number | null;
  /** Newline- or comma-separated list of traveller names. */
  travellerNames?: string | null;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  status?: BookingStatus;
  /** Total price, already formatted, e.g. "₹1,24,000". */
  priceAmount?: string | null;
  /** Formatted advance already received, e.g. "₹30,000". */
  amountPaid?: string | null;
  /** Formatted balance still due, e.g. "₹94,000". */
  balanceDue?: string | null;
  paymentStatus?: "pending" | "received";
  /** When the balance must be settled, e.g. "by 20 Aug 2026". */
  paymentDueNote?: string | null;

  specialRequirements?: string | null;
  /** Free-text inclusions, one per line or already an array. */
  inclusions?: string[] | null;
  exclusions?: string[] | null;
  /** Extra notes printed under "Important Information". */
  notes?: string[] | null;

  /** Travel designer / consultant handling the booking. */
  agentName?: string | null;
  /** Date shown in the header. Defaults to now. */
  issuedAt?: Date;
  /** Injects a script that opens the print dialog on load. */
  autoPrint?: boolean;
}

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const DEFAULT_INCLUSIONS = [
  "Accommodation as per the confirmed itinerary",
  "Daily breakfast at all hotels",
  "All transfers and sightseeing by private air-conditioned vehicle",
  "Driver allowance, toll, parking and state permits",
  "All applicable taxes on the above services",
];

const DEFAULT_EXCLUSIONS = [
  "Airfare / train fare unless explicitly stated",
  "Lunch, dinner and any meals not mentioned above",
  "Monument entry fees, camera charges and optional activities",
  "Personal expenses — laundry, tips, telephone, minibar",
  "Anything not listed under Inclusions",
];

const DEFAULT_NOTES = [
  "Please carry a printed or digital copy of this voucher along with a valid photo ID for every traveller.",
  "Standard hotel check-in is 2:00 PM and check-out is 11:00 AM unless otherwise confirmed.",
  "Rooms, vehicles and activities are confirmed as per the itinerary; substitutions of similar category may be made in case of unforeseen unavailability.",
  "Cancellation and refunds are governed by the terms shared with your quotation.",
];

/** Formats a date for the document header/footer in Indian style. */
function formatIssued(date: Date): string {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Splits a newline/comma separated traveller list into trimmed names. */
function parseNames(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]+/)
    .map((n) => n.trim())
    .filter(Boolean);
}

/** One label/value cell in the details grid. */
function detailCell(label: string, value: string): string {
  return `
    <td class="cell">
      <span class="cell-label">${escapeHtml(label)}</span>
      <span class="cell-value">${escapeHtml(value)}</span>
    </td>`;
}

/** Lays detail cells out two-per-row so it prints predictably. */
function detailGrid(items: Array<[string, string]>): string {
  const rows: string[] = [];
  for (let i = 0; i < items.length; i += 2) {
    const left = detailCell(items[i][0], items[i][1]);
    const right = items[i + 1] ? detailCell(items[i + 1][0], items[i + 1][1]) : `<td class="cell"></td>`;
    rows.push(`<tr>${left}${right}</tr>`);
  }
  return `<table class="grid">${rows.join("")}</table>`;
}

function bulletList(items: string[]): string {
  return `<ul class="bullets">${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
}

export function buildBookingConfirmationDocument(input: BookingConfirmationInput): string {
  const {
    bookingCode,
    documentLabel = "Booking Confirmation",
    documentNumber = bookingCode,
    introText = "Your booking is confirmed. Please keep this voucher with you for the duration of your trip — our team and on-ground partners will use the reference above for all assistance.",
    packageTitle,
    destination,
    travelDate,
    durationLabel,
    travellersCount,
    travellerNames,
    customerName,
    customerEmail,
    customerPhone,
    status = "confirmed",
    priceAmount,
    amountPaid,
    balanceDue,
    paymentStatus = "pending",
    paymentDueNote,
    specialRequirements,
    inclusions,
    exclusions,
    notes,
    agentName,
    issuedAt = new Date(),
    autoPrint = false,
  } = input;

  const names = parseNames(travellerNames);
  const title = `${documentLabel} — ${documentNumber} — ${COMPANY.name}`;

  const tripDetails: Array<[string, string]> = [];
  if (destination) tripDetails.push(["Destination", destination]);
  if (travelDate) tripDetails.push(["Travel Dates", travelDate]);
  if (durationLabel) tripDetails.push(["Duration", durationLabel]);
  if (travellersCount != null) tripDetails.push(["Travellers", String(travellersCount)]);
  tripDetails.push(["Booking Reference", bookingCode]);
  tripDetails.push(["Status", BOOKING_STATUS_LABELS[status]]);

  const contactDetails: Array<[string, string]> = [
    ["Lead Traveller", customerName],
    ["Email", customerEmail],
    ["Phone", customerPhone],
  ];
  if (agentName) contactDetails.push(["Travel Consultant", agentName]);

  const paymentRows: string[] = [];
  if (priceAmount) {
    paymentRows.push(
      `<tr><td>Total Package Cost</td><td class="amount">${escapeHtml(priceAmount)}</td></tr>`
    );
  }
  if (amountPaid) {
    paymentRows.push(
      `<tr><td>Advance Received</td><td class="amount">${escapeHtml(amountPaid)}</td></tr>`
    );
  }
  if (balanceDue) {
    paymentRows.push(
      `<tr class="due"><td>Balance Due${
        paymentDueNote ? ` <span class="due-note">${escapeHtml(paymentDueNote)}</span>` : ""
      }</td><td class="amount">${escapeHtml(balanceDue)}</td></tr>`
    );
  }
  paymentRows.push(
    `<tr><td>Payment Status</td><td class="amount">${
      paymentStatus === "received" ? "Received" : "Pending"
    }</td></tr>`
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${BRAND.sandBg};
    font-family: ${FONT_STACK};
    color: ${BRAND.foreground};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet {
    width: 210mm;
    min-height: 297mm;
    margin: 16px auto;
    background: ${BRAND.white};
    border: 1px solid ${BRAND.border};
    display: flex;
    flex-direction: column;
  }
  .header {
    background: ${BRAND.primary};
    color: ${BRAND.white};
    padding: 22px 28px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .brand { font-size: 20px; font-weight: 800; letter-spacing: .3px; }
  .tagline {
    font-size: 10px; font-weight: 600; letter-spacing: 1.4px;
    text-transform: uppercase; color: ${BRAND.gold}; margin-top: 4px;
  }
  .doc-meta { text-align: right; font-size: 11px; line-height: 1.7; color: #AEBACB; }
  .doc-type {
    font-size: 13px; font-weight: 800; letter-spacing: 1.2px;
    text-transform: uppercase; color: ${BRAND.white};
  }
  .doc-code { font-size: 15px; font-weight: 800; color: ${BRAND.gold}; }
  .rule { height: 4px; background: ${BRAND.gold}; }
  .content { padding: 26px 28px 0 28px; flex: 1; }

  .banner {
    border: 1px solid ${BRAND.border};
    background: ${BRAND.sand};
    border-left: 4px solid ${BRAND.accent};
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 22px;
  }
  .banner h1 {
    margin: 0 0 4px 0; font-size: 19px; line-height: 1.25;
    font-weight: 800; color: ${BRAND.primary};
  }
  .banner p { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${BRAND.muted}; }

  h2.section {
    margin: 0 0 8px 0; font-size: 11px; font-weight: 800; letter-spacing: 1.2px;
    text-transform: uppercase; color: ${BRAND.muted};
    border-bottom: 1px solid ${BRAND.border}; padding-bottom: 5px;
  }
  section { margin-bottom: 20px; break-inside: avoid; }

  table.grid { width: 100%; border-collapse: collapse; }
  table.grid td.cell { width: 50%; padding: 8px 10px 8px 0; vertical-align: top; }
  .cell-label {
    display: block; font-size: 10.5px; letter-spacing: .4px;
    text-transform: uppercase; color: ${BRAND.light}; margin-bottom: 2px;
  }
  .cell-value { display: block; font-size: 13.5px; font-weight: 700; color: ${BRAND.foreground}; }

  table.payment { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.payment td { padding: 9px 0; border-bottom: 1px solid ${BRAND.border}; color: ${BRAND.muted}; }
  table.payment td.amount { text-align: right; font-weight: 700; color: ${BRAND.foreground}; }
  table.payment tr.due td { color: ${BRAND.accentDark}; font-weight: 700; }
  table.payment tr.due td.amount { color: ${BRAND.accentDark}; }
  .due-note { font-weight: 500; font-size: 11px; color: ${BRAND.muted}; }

  .names { display: flex; flex-wrap: wrap; gap: 6px; }
  .name-chip {
    font-size: 12px; font-weight: 600; color: ${BRAND.primary};
    background: ${BRAND.sand}; border: 1px solid ${BRAND.border};
    border-radius: 999px; padding: 4px 12px;
  }

  .two-col { display: flex; gap: 24px; }
  .two-col > div { flex: 1; }
  ul.bullets { margin: 0; padding-left: 16px; }
  ul.bullets li { font-size: 12px; line-height: 1.7; color: ${BRAND.foreground}; }
  p.body { margin: 0; font-size: 12.5px; line-height: 1.7; color: ${BRAND.foreground}; }

  .footer {
    background: ${BRAND.primary}; color: #AEBACB;
    padding: 18px 28px; font-size: 11px; line-height: 1.65; margin-top: 24px;
  }
  .footer strong { color: ${BRAND.white}; font-size: 12.5px; }
  .footer a { color: ${BRAND.gold}; text-decoration: none; }
  .footer .fine { color: #6E7F94; font-size: 10px; margin-top: 8px; }

  .toolbar { text-align: center; padding: 12px; }
  .toolbar button {
    font-family: inherit; font-size: 13px; font-weight: 700; color: ${BRAND.white};
    background: ${BRAND.primary}; border: 0; border-radius: 999px;
    padding: 11px 26px; cursor: pointer;
  }
  @media print {
    body { background: ${BRAND.white}; }
    .sheet { margin: 0; width: auto; min-height: 0; border: 0; }
    .toolbar { display: none; }
  }
</style>
</head>
<body>
  <div class="toolbar"><button type="button" onclick="window.print()">Download / Print PDF</button></div>

  <div class="sheet">
    <div class="header">
      <div>
        <div class="brand">${escapeHtml(COMPANY.name)}</div>
        <div class="tagline">${escapeHtml(COMPANY.tagline)}</div>
      </div>
      <div class="doc-meta">
        <div class="doc-type">${escapeHtml(documentLabel)}</div>
        <div class="doc-code">${escapeHtml(documentNumber)}</div>
        <div>Issued ${escapeHtml(formatIssued(issuedAt))}</div>
      </div>
    </div>
    <div class="rule"></div>

    <div class="content">
      <div class="banner">
        <h1>${escapeHtml(packageTitle)}</h1>
        <p>${escapeHtml(introText)}</p>
      </div>

      <section>
        <h2 class="section">Trip Details</h2>
        ${detailGrid(tripDetails)}
      </section>

      <section>
        <h2 class="section">Traveller &amp; Contact</h2>
        ${detailGrid(contactDetails)}
        ${
          names.length
            ? `<div style="margin-top:10px;">
                 <span class="cell-label">Travelling Party</span>
                 <div class="names">${names
                   .map((n) => `<span class="name-chip">${escapeHtml(n)}</span>`)
                   .join("")}</div>
               </div>`
            : ""
        }
      </section>

      <section>
        <h2 class="section">Payment Summary</h2>
        <table class="payment">${paymentRows.join("")}</table>
      </section>

      <section>
        <h2 class="section">Inclusions &amp; Exclusions</h2>
        <div class="two-col">
          <div>
            <span class="cell-label">Included</span>
            ${bulletList(inclusions?.length ? inclusions : DEFAULT_INCLUSIONS)}
          </div>
          <div>
            <span class="cell-label">Not Included</span>
            ${bulletList(exclusions?.length ? exclusions : DEFAULT_EXCLUSIONS)}
          </div>
        </div>
      </section>

      ${
        specialRequirements
          ? `<section>
               <h2 class="section">Special Requirements</h2>
               <p class="body">${escapeHtml(specialRequirements)}</p>
             </section>`
          : ""
      }

      <section>
        <h2 class="section">Important Information</h2>
        ${bulletList(notes?.length ? notes : DEFAULT_NOTES)}
      </section>
    </div>

    <div class="footer">
      <p style="margin:0 0 6px 0;"><strong>${escapeHtml(COMPANY.name)}</strong></p>
      <p style="margin:0 0 4px 0;">${escapeHtml(COMPANY.address)}</p>
      <p style="margin:0;">
        <a href="${COMPANY.phoneHref}">${escapeHtml(COMPANY.phoneLabel)}</a> ·
        <a href="mailto:${COMPANY.email}">${escapeHtml(COMPANY.email)}</a> ·
        <a href="${COMPANY.whatsappHref}">WhatsApp</a> ·
        ${escapeHtml(COMPANY.website)}
      </p>
      <p class="fine">
        24×7 travel assistance on the numbers above. Office hours: ${escapeHtml(COMPANY.hours)}.
        This is a computer-generated document and is valid without a signature.
      </p>
    </div>
  </div>
${autoPrint ? `  <script>window.addEventListener("load", function () { window.print(); });</script>\n` : ""}</body>
</html>`;
}

/** Maps a stored booking row onto the document input, with optional overrides. */
export function bookingConfirmationInputFromBooking(
  booking: Booking,
  overrides: Partial<BookingConfirmationInput> = {}
): BookingConfirmationInput {
  return {
    bookingCode: booking.booking_code,
    packageTitle: booking.package_title || booking.destination || "Your Trip with Bandhan Tours",
    destination: booking.destination,
    travelDate: booking.travel_date,
    travellersCount: booking.travellers_count,
    travellerNames: booking.traveller_names,
    customerName: booking.contact_name,
    customerEmail: booking.contact_email,
    customerPhone: booking.contact_phone,
    status: booking.status,
    priceAmount: booking.price_amount,
    paymentStatus: booking.payment_status,
    specialRequirements: booking.special_requirements,
    ...overrides,
  };
}

/** Suggested file name when the document is downloaded or attached. */
export function bookingConfirmationFileName(bookingCode: string): string {
  return `Bandhan-Tours-Booking-Confirmation-${bookingCode}.pdf`;
}
