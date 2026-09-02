import { BRAND, COMPANY } from "@/lib/email/company";
import { BOOKING_STATUS_LABELS } from "@/lib/bookings/types";
import {
  CONTENT_WIDTH,
  MARGIN,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  PdfDoc,
  hex,
} from "./pdf/layout";
import { drawBrandMark } from "./pdf/chrome";
import type { BookingConfirmationInput } from "./bookingConfirmation";

/**
 * Renders the booking-confirmation voucher as a real PDF (pdf-lib, no
 * headless browser). Shares its input type with the HTML version in
 * `bookingConfirmation.ts` so both outputs stay in sync.
 */

const C = {
  primary: hex(BRAND.primary),
  accent: hex(BRAND.accent),
  accentDark: hex(BRAND.accentDark),
  gold: hex(BRAND.gold),
  sand: hex(BRAND.sand),
  foreground: hex(BRAND.foreground),
  muted: hex(BRAND.muted),
  light: hex(BRAND.light),
  border: hex(BRAND.border),
  white: hex(BRAND.white),
  footerText: hex("#AEBACB"),
  footerFine: hex("#6E7F94"),
};

const HEADER_HEIGHT = 74;
const FOOTER_HEIGHT = 62;
const FOOTER_TOP = PAGE_HEIGHT - FOOTER_HEIGHT;

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

function formatIssued(date: Date): string {
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseNames(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,]+/)
    .map((n) => n.trim())
    .filter(Boolean);
}

/** Navy masthead. Repeated (compact) on continuation pages. */
function drawHeader(doc: PdfDoc, input: BookingConfirmationInput, issued: string, compact: boolean) {
  const height = compact ? 44 : HEADER_HEIGHT;
  doc.rect(0, 0, PAGE_WIDTH, height, C.primary);
  doc.rect(0, height, PAGE_WIDTH, 3, C.gold);

  // `dark` skips the navy plate the mark paints on light surfaces — the
  // masthead is already navy. Falls back to the wordmark if the logo is
  // missing from the bundle.
  drawBrandMark(doc, {
    y: compact ? 11 : 14,
    dark: true,
    width: compact ? 70 : 94,
  });

  if (!compact) {
    doc.textAt(COMPANY.tagline.toUpperCase(), {
      x: MARGIN,
      y: 52,
      size: 7,
      bold: true,
      color: C.gold,
      charSpacing: 1.4,
    });
  }

  const right = { x: MARGIN, width: CONTENT_WIDTH, align: "right" as const };
  doc.textAt((input.documentLabel || "Booking Confirmation").toUpperCase(), {
    ...right,
    y: compact ? 15 : 18,
    size: compact ? 8 : 10,
    bold: true,
    color: C.white,
    charSpacing: 1.1,
  });
  doc.textAt(input.documentNumber || input.bookingCode, {
    ...right,
    y: compact ? 27 : 32,
    size: compact ? 9 : 13,
    bold: true,
    color: C.gold,
  });
  if (!compact) {
    doc.textAt(`Issued ${issued}`, { ...right, y: 50, size: 8, color: C.footerText });
  }

  doc.y = height + 3 + (compact ? 16 : 22);
}

/** Navy footer band, drawn on every page. */
function drawFooter(doc: PdfDoc, pageIndex: number) {
  doc.rect(0, FOOTER_TOP, PAGE_WIDTH, FOOTER_HEIGHT, C.primary);

  drawBrandMark(doc, { y: FOOTER_TOP + 10, dark: true, width: 66 });
  const footText = MARGIN + 82;
  doc.textAt(COMPANY.address, {
    x: footText,
    y: FOOTER_TOP + 12,
    size: 7.5,
    color: C.footerText,
  });
  doc.textAt(`${COMPANY.phoneLabel}  ·  ${COMPANY.email}  ·  ${COMPANY.website}`, {
    x: footText,
    y: FOOTER_TOP + 24,
    size: 7.5,
    color: C.gold,
  });
  doc.textAt(
    `24×7 travel assistance on the numbers above. Office hours: ${COMPANY.hours}. This is a computer-generated document and is valid without a signature.`,
    { x: MARGIN, y: FOOTER_TOP + 46, size: 6.5, color: C.footerFine }
  );
  doc.textAt(`Page ${pageIndex + 1}`, {
    x: MARGIN,
    width: CONTENT_WIDTH,
    align: "right",
    y: FOOTER_TOP + 11,
    size: 7.5,
    color: C.footerText,
  });
}

/** Uppercase section heading with an underline. */
function sectionHeading(doc: PdfDoc, label: string) {
  doc.ensure(34);
  doc.textAt(label.toUpperCase(), {
    y: doc.y,
    size: 8,
    bold: true,
    color: C.muted,
    charSpacing: 1.1,
  });
  doc.y += 13;
  doc.rule(doc.y, C.border);
  doc.y += 10;
}

/** Two-column label/value grid. */
function detailGrid(doc: PdfDoc, items: Array<[string, string]>) {
  const colWidth = (CONTENT_WIDTH - 20) / 2;
  for (let i = 0; i < items.length; i += 2) {
    const pair = [items[i], items[i + 1]].filter(Boolean) as Array<[string, string]>;
    const heights = pair.map(([, value]) => doc.wrap(value, colWidth, 10, true).length * 13);
    const rowHeight = 12 + Math.max(...heights) + 8;
    doc.ensure(rowHeight);

    const top = doc.y;
    pair.forEach(([label, value], col) => {
      const x = MARGIN + col * (colWidth + 20);
      doc.textAt(label.toUpperCase(), {
        x,
        y: top,
        size: 6.5,
        color: C.light,
        charSpacing: 0.5,
        width: colWidth,
      });
      let lineY = top + 11;
      for (const line of doc.wrap(value, colWidth, 10, true)) {
        doc.textAt(line, { x, y: lineY, size: 10, bold: true, color: C.foreground, width: colWidth });
        lineY += 13;
      }
    });
    doc.y = top + rowHeight;
  }
}

/** Label/amount rows with hairline separators. */
function paymentTable(doc: PdfDoc, rows: Array<{ label: string; value: string; emphasis?: boolean }>) {
  for (const row of rows) {
    doc.ensure(24);
    const top = doc.y;
    const color = row.emphasis ? C.accentDark : C.muted;
    doc.textAt(row.label, { y: top + 5, size: 9.5, color, bold: row.emphasis });
    doc.textAt(row.value, {
      y: top + 5,
      size: 9.5,
      bold: true,
      color: row.emphasis ? C.accentDark : C.foreground,
      align: "right",
    });
    doc.y = top + 21;
    doc.rule(doc.y, C.border);
    doc.y += 3;
  }
}

/** Bulleted list constrained to `width`, starting at absolute `x`/`y`. */
function bullets(
  doc: PdfDoc,
  items: string[],
  opts: { x?: number; width?: number; size?: number } = {}
): number {
  const { x = MARGIN, width = CONTENT_WIDTH, size = 8.5 } = opts;
  const lineHeight = size * 1.55;
  const textX = x + 10;
  const textWidth = width - 10;

  for (const item of items) {
    const lines = doc.wrap(item, textWidth, size);
    doc.ensure(lines.length * lineHeight + 3);
    doc.textAt("•", { x, y: doc.y, size, color: C.accent });
    for (const line of lines) {
      doc.textAt(line, { x: textX, y: doc.y, size, color: C.foreground, width: textWidth });
      doc.y += lineHeight;
    }
    doc.y += 3;
  }
  return doc.y;
}

/** Pill-style chips for traveller names, wrapping across lines. */
function chips(doc: PdfDoc, labels: string[]) {
  const size = 8.5;
  const padX = 8;
  const chipHeight = 17;
  const rowGap = 5;

  // Lay the rows out first so the whole block can be kept on one page.
  const rows: Array<Array<{ label: string; width: number }>> = [[]];
  let rowWidth = 0;
  for (const label of labels) {
    const width = doc.measure(label, size, true) + padX * 2;
    if (rowWidth && rowWidth + width > CONTENT_WIDTH) {
      rows.push([]);
      rowWidth = 0;
    }
    rows[rows.length - 1].push({ label, width });
    rowWidth += width + 5;
  }

  doc.ensure(rows.length * (chipHeight + rowGap) + 8);
  let top = doc.y;
  for (const row of rows) {
    let x = MARGIN;
    for (const chip of row) {
      doc.rect(x, top, chip.width, chipHeight, C.sand);
      doc.strokeRect(x, top, chip.width, chipHeight, C.border);
      doc.textAt(chip.label, { x: x + padX, y: top + 4.5, size, bold: true, color: C.primary });
      x += chip.width + 5;
    }
    top += chipHeight + rowGap;
  }
  doc.y = top + 3;
}

export async function renderBookingConfirmationPdf(
  input: BookingConfirmationInput
): Promise<Uint8Array> {
  const {
    bookingCode,
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
  } = input;

  const issued = formatIssued(issuedAt);
  const doc = await PdfDoc.create();
  doc.contentBottom = FOOTER_TOP - 18;

  // Repaint chrome on every page break; page 1 is painted below.
  doc.onNewPage = (d, pageIndex) => {
    drawHeader(d, input, issued, true);
    drawFooter(d, pageIndex);
  };
  drawHeader(doc, input, issued, false);
  drawFooter(doc, 0);

  // ---- Confirmation banner ----
  const titleLines = doc.wrap(packageTitle, CONTENT_WIDTH - 34, 15, true);
  const blurb = introText;
  const blurbLines = doc.wrap(blurb, CONTENT_WIDTH - 34, 8.5);
  const bannerHeight = 16 + titleLines.length * 19 + blurbLines.length * 13 + 12;

  doc.ensure(bannerHeight + 12);
  const bannerTop = doc.y;
  doc.rect(MARGIN, bannerTop, CONTENT_WIDTH, bannerHeight, C.sand);
  doc.strokeRect(MARGIN, bannerTop, CONTENT_WIDTH, bannerHeight, C.border);
  doc.rect(MARGIN, bannerTop, 3.5, bannerHeight, C.accent);

  let bannerY = bannerTop + 13;
  for (const line of titleLines) {
    doc.textAt(line, { x: MARGIN + 16, y: bannerY, size: 15, bold: true, color: C.primary });
    bannerY += 19;
  }
  bannerY += 2;
  for (const line of blurbLines) {
    doc.textAt(line, { x: MARGIN + 16, y: bannerY, size: 8.5, color: C.muted });
    bannerY += 13;
  }
  doc.y = bannerTop + bannerHeight + 20;

  // ---- Trip details ----
  const tripDetails: Array<[string, string]> = [];
  if (destination) tripDetails.push(["Destination", destination]);
  if (travelDate) tripDetails.push(["Travel Dates", travelDate]);
  if (durationLabel) tripDetails.push(["Duration", durationLabel]);
  if (travellersCount != null) tripDetails.push(["Travellers", String(travellersCount)]);
  tripDetails.push(["Booking Reference", bookingCode]);
  tripDetails.push(["Status", BOOKING_STATUS_LABELS[status]]);

  sectionHeading(doc, "Trip Details");
  detailGrid(doc, tripDetails);
  doc.y += 12;

  // ---- Traveller & contact ----
  const contactDetails: Array<[string, string]> = [
    ["Lead Traveller", customerName],
    ["Email", customerEmail],
    ["Phone", customerPhone],
  ];
  if (agentName) contactDetails.push(["Travel Consultant", agentName]);

  sectionHeading(doc, "Traveller & Contact");
  detailGrid(doc, contactDetails);

  const names = parseNames(travellerNames);
  if (names.length) {
    doc.y += 4;
    doc.textAt("TRAVELLING PARTY", { y: doc.y, size: 6.5, color: C.light, charSpacing: 0.5 });
    doc.y += 12;
    chips(doc, names);
  }
  doc.y += 8;

  // ---- Payment summary ----
  const paymentRows: Array<{ label: string; value: string; emphasis?: boolean }> = [];
  if (priceAmount) paymentRows.push({ label: "Total Package Cost", value: priceAmount });
  if (amountPaid) paymentRows.push({ label: "Advance Received", value: amountPaid });
  if (balanceDue) {
    paymentRows.push({
      label: paymentDueNote ? `Balance Due (${paymentDueNote})` : "Balance Due",
      value: balanceDue,
      emphasis: true,
    });
  }
  paymentRows.push({
    label: "Payment Status",
    value: paymentStatus === "received" ? "Received" : "Pending",
  });

  sectionHeading(doc, "Payment Summary");
  paymentTable(doc, paymentRows);
  doc.y += 14;

  // ---- Inclusions / exclusions, side by side ----
  const includedItems = inclusions?.length ? inclusions : DEFAULT_INCLUSIONS;
  const excludedItems = exclusions?.length ? exclusions : DEFAULT_EXCLUSIONS;
  const colWidth = (CONTENT_WIDTH - 24) / 2;
  const rightX = MARGIN + colWidth + 24;

  // Both columns are drawn from the same starting cursor, so the block must be
  // placed on a page that can hold the taller of the two in full.
  const columnHeight = (items: string[]) =>
    items.reduce((total, item) => total + doc.wrap(item, colWidth - 10, 8.5).length * 13.2 + 3, 0);
  doc.ensure(34 + 12 + Math.max(columnHeight(includedItems), columnHeight(excludedItems)));

  sectionHeading(doc, "Inclusions & Exclusions");
  const columnsTop = doc.y;

  doc.textAt("INCLUDED", { x: MARGIN, y: columnsTop, size: 6.5, color: C.light, charSpacing: 0.5 });
  doc.textAt("NOT INCLUDED", { x: rightX, y: columnsTop, size: 6.5, color: C.light, charSpacing: 0.5 });

  doc.y = columnsTop + 12;
  const leftEnd = bullets(doc, includedItems, { x: MARGIN, width: colWidth });

  // Reset the cursor to the top of the right column, then take the taller side.
  doc.y = columnsTop + 12;
  const rightEnd = bullets(doc, excludedItems, { x: rightX, width: colWidth });
  doc.y = Math.max(leftEnd, rightEnd) + 14;

  // ---- Special requirements ----
  if (specialRequirements) {
    sectionHeading(doc, "Special Requirements");
    doc.paragraph(specialRequirements, {
      size: 8.5,
      lineHeight: 13.5,
      color: C.foreground,
      spaceAfter: 14,
    });
  }

  // ---- Important information ----
  sectionHeading(doc, "Important Information");
  bullets(doc, notes?.length ? notes : DEFAULT_NOTES);

  return doc.save();
}
