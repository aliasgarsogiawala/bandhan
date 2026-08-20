import type { Booking } from "@/lib/bookings/types";
import { formatMoney } from "@/lib/bookings/pricing";
import { BRAND, COMPANY } from "@/lib/email/company";
import {
  bookedByLabel,
  formatProposalDate,
  quotationValidUntil,
  roomSummary,
  safePackageSnapshot,
  safeQuoteSnapshot,
  travellerMix,
  travellerNames,
  totalTravellersForBooking,
} from "./proposalData";
import {
  CONTENT_WIDTH,
  MARGIN,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  PdfDoc,
  hex,
} from "./pdf/layout";

const C = {
  primary: hex(BRAND.primary),
  primaryLight: hex(BRAND.primaryLight),
  accent: hex(BRAND.accent),
  gold: hex(BRAND.gold),
  sand: hex(BRAND.sand),
  muted: hex(BRAND.muted),
  light: hex(BRAND.light),
  border: hex(BRAND.border),
  white: hex(BRAND.white),
  foreground: hex(BRAND.foreground),
  green: hex("#13795B"),
  greenLight: hex("#EAF7F2"),
};

const FOOTER_TOP = PAGE_HEIGHT - 48;

export function quotationFileName(booking: Booking): string {
  return `Bandhan-Tours-Quotation-${booking.quotation_number}.pdf`;
}

function footer(doc: PdfDoc, pageIndex: number) {
  doc.rule(FOOTER_TOP, C.gold, 0, PAGE_WIDTH, 2);
  doc.rect(0, FOOTER_TOP + 2, PAGE_WIDTH, PAGE_HEIGHT - FOOTER_TOP - 2, C.primary);
  doc.textAt(`${COMPANY.name}  |  ${COMPANY.phoneLabel}  |  ${COMPANY.email}`, {
    x: MARGIN,
    y: FOOTER_TOP + 16,
    size: 7,
    color: C.light,
  });
  doc.textAt(`Quotation  |  Page ${pageIndex + 1}`, {
    x: MARGIN,
    y: FOOTER_TOP + 16,
    width: CONTENT_WIDTH,
    align: "right",
    size: 7,
    bold: true,
    color: C.gold,
  });
}

function continuationHeader(doc: PdfDoc, booking: Booking) {
  doc.rect(0, 0, PAGE_WIDTH, 56, C.primary);
  doc.rect(0, 56, PAGE_WIDTH, 3, C.gold);
  doc.textAt(COMPANY.name, { x: MARGIN, y: 17, size: 13, bold: true, color: C.white });
  doc.textAt("PERSONALISED QUOTATION", {
    x: MARGIN,
    y: 16,
    width: CONTENT_WIDTH,
    align: "right",
    size: 7,
    bold: true,
    color: C.gold,
    charSpacing: 0.9,
  });
  doc.textAt(booking.quotation_number, {
    x: MARGIN,
    y: 32,
    width: CONTENT_WIDTH,
    align: "right",
    size: 8,
    bold: true,
    color: C.white,
  });
  doc.y = 80;
}

function sectionTitle(doc: PdfDoc, eyebrow: string, title: string, note?: string) {
  doc.ensure(note ? 55 : 43);
  doc.textAt(eyebrow.toUpperCase(), {
    y: doc.y,
    size: 6.5,
    bold: true,
    color: C.accent,
    charSpacing: 1,
  });
  doc.y += 13;
  doc.textAt(title, { y: doc.y, size: 14, bold: true, color: C.primary });
  if (note) {
    doc.textAt(note, {
      y: doc.y + 2,
      width: CONTENT_WIDTH,
      align: "right",
      size: 7.5,
      color: C.muted,
    });
  }
  doc.y += 24;
  doc.rule(doc.y, C.border);
  doc.y += 12;
}

function cardLabelValue(
  doc: PdfDoc,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  options?: { dark?: boolean; valueSize?: number }
) {
  const dark = options?.dark ?? false;
  doc.textAt(label.toUpperCase(), {
    x,
    y,
    width,
    size: 6.2,
    bold: true,
    color: dark ? C.gold : C.muted,
    charSpacing: 0.55,
  });
  const valueLines = doc.wrap(value || "To be confirmed", width, options?.valueSize || 8.5, true);
  valueLines.slice(0, 2).forEach((line, index) => {
    doc.textAt(line, {
      x,
      y: y + 13 + index * 11,
      width,
      size: options?.valueSize || 8.5,
      bold: true,
      color: dark ? C.white : C.primary,
    });
  });
}

function bullets(doc: PdfDoc, values: string[]) {
  for (const value of values) {
    const lines = doc.wrap(value, CONTENT_WIDTH - 18, 8.2);
    doc.ensure(lines.length * 12 + 5);
    doc.textAt("-", { x: MARGIN, y: doc.y, size: 8.5, bold: true, color: C.accent });
    for (const line of lines) {
      doc.textAt(line, { x: MARGIN + 14, y: doc.y, size: 8.2, color: C.foreground });
      doc.y += 12;
    }
    doc.y += 4;
  }
}

export async function renderQuotationPdf(booking: Booking): Promise<Uint8Array> {
  const snapshot = safePackageSnapshot(booking);
  const quote = safeQuoteSnapshot(booking);
  const mix = travellerMix(booking);
  const names = travellerNames(booking);
  const totalTravellers = totalTravellersForBooking(booking);
  const doc = await PdfDoc.create();
  doc.contentBottom = FOOTER_TOP - 16;

  // Page one: commercial summary.
  doc.rect(0, 0, PAGE_WIDTH, 148, C.primary);
  doc.rect(0, 0, 7, 148, C.gold);
  doc.textAt(COMPANY.name, { x: MARGIN, y: 24, size: 15, bold: true, color: C.white });
  doc.textAt(COMPANY.tagline.toUpperCase(), {
    x: MARGIN,
    y: 44,
    size: 6.5,
    bold: true,
    color: C.gold,
    charSpacing: 0.9,
  });
  doc.textAt("PERSONALISED QUOTATION", {
    x: MARGIN,
    y: 76,
    size: 8,
    bold: true,
    color: C.gold,
    charSpacing: 1.3,
  });
  const titleLines = doc.wrap(snapshot.title, 330, 20, true).slice(0, 2);
  titleLines.forEach((line, index) => {
    doc.textAt(line, { x: MARGIN, y: 94 + index * 25, size: 20, bold: true, color: C.white });
  });
  doc.textAt("QUOTE NUMBER", {
    x: 406,
    y: 27,
    width: 149,
    align: "right",
    size: 6.3,
    bold: true,
    color: C.gold,
    charSpacing: 0.7,
  });
  doc.textAt(booking.quotation_number, {
    x: 406,
    y: 42,
    width: 149,
    align: "right",
    size: 13,
    bold: true,
    color: C.white,
  });
  doc.textAt(quote.isIndicative ? "INDICATIVE - LIVE AVAILABILITY PENDING" : "CONFIRMED", {
    x: 350,
    y: 113,
    width: 205,
    align: "right",
    size: 6.5,
    bold: true,
    color: quote.isIndicative ? C.gold : C.greenLight,
    charSpacing: 0.4,
  });
  footer(doc, 0);
  doc.onNewPage = (current, pageIndex) => {
    continuationHeader(current, booking);
    footer(current, pageIndex);
  };

  doc.y = 172;
  const introCardWidth = (CONTENT_WIDTH - 20) / 3;
  const introCards: Array<[string, string]> = [
    ["Prepared for", booking.contact_name],
    ["Issued on", formatProposalDate(quote.generatedAt)],
    ["Valid until", quotationValidUntil(quote)],
  ];
  introCards.forEach(([label, value], index) => {
    const x = MARGIN + index * (introCardWidth + 10);
    doc.rect(x, doc.y, introCardWidth, 58, C.sand);
    doc.rect(x, doc.y, 3, 58, index === 2 ? C.accent : C.gold);
    cardLabelValue(doc, label, value, x + 13, doc.y + 13, introCardWidth - 24);
  });
  doc.y += 80;

  sectionTitle(doc, "Trip at a glance", "The journey priced for you");
  const detailWidth = (CONTENT_WIDTH - 16) / 2;
  const details: Array<[string, string]> = [
    ["Destination", snapshot.destination],
    ["Travel date", formatProposalDate(booking.travel_date)],
    ["Departure", booking.departure_city || snapshot.startingPoint || "To be confirmed"],
    ["Duration", booking.duration_label || snapshot.duration || "Custom duration"],
  ];
  for (let index = 0; index < details.length; index += 2) {
    const top = doc.y;
    details.slice(index, index + 2).forEach(([label, value], offset) => {
      const x = MARGIN + offset * (detailWidth + 16);
      doc.strokeRect(x, top, detailWidth, 49, C.border, 0.7);
      cardLabelValue(doc, label, value, x + 12, top + 11, detailWidth - 24);
    });
    doc.y += 58;
  }

  doc.y += 5;
  sectionTitle(doc, "Party configuration", `${totalTravellers} traveller${totalTravellers === 1 ? "" : "s"} and selected rooms`);
  const mixGap = 7;
  const mixWidth = (CONTENT_WIDTH - mixGap * 3) / 4;
  mix.forEach((item, index) => {
    const x = MARGIN + index * (mixWidth + mixGap);
    doc.rect(x, doc.y, mixWidth, 60, item.count ? C.primary : C.sand);
    doc.textAt(String(item.count), {
      x: x + 11,
      y: doc.y + 10,
      size: 18,
      bold: true,
      color: item.count ? C.gold : C.light,
    });
    doc.textAt(item.shortLabel.toUpperCase(), {
      x: x + 11,
      y: doc.y + 35,
      width: mixWidth - 20,
      size: 6.2,
      bold: true,
      color: item.count ? C.white : C.muted,
      charSpacing: 0.35,
    });
    doc.textAt(item.note, {
      x: x + 11,
      y: doc.y + 47,
      width: mixWidth - 20,
      size: 5.8,
      color: item.count ? C.light : C.muted,
    });
  });
  doc.y += 70;
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 36, C.greenLight);
  doc.textAt("ROOM PLAN", {
    x: MARGIN + 12,
    y: doc.y + 11,
    size: 6.5,
    bold: true,
    color: C.green,
    charSpacing: 0.7,
  });
  doc.textAt(roomSummary(booking), {
    x: MARGIN + 90,
    y: doc.y + 10,
    width: CONTENT_WIDTH - 102,
    size: 8.5,
    bold: true,
    color: C.primary,
  });
  doc.y += 55;

  sectionTitle(doc, "Transparent pricing", "Traveller-by-traveller quotation", "All amounts in INR");
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 29, C.primary);
  doc.textAt("DESCRIPTION", { x: MARGIN + 12, y: doc.y + 10, size: 6.5, bold: true, color: C.gold });
  doc.textAt("QTY", { x: 355, y: doc.y + 10, width: 40, align: "center", size: 6.5, bold: true, color: C.gold });
  doc.textAt("RATE", { x: 398, y: doc.y + 10, width: 70, align: "right", size: 6.5, bold: true, color: C.gold });
  doc.textAt("AMOUNT", { x: 470, y: doc.y + 10, width: 73, align: "right", size: 6.5, bold: true, color: C.gold });
  doc.y += 29;

  if (!quote.lineItems.length) {
    doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 46, C.sand);
    doc.textAt("Detailed pricing is being prepared by your travel consultant.", {
      x: MARGIN + 12,
      y: doc.y + 15,
      size: 8.5,
      color: C.muted,
    });
    doc.y += 52;
  } else {
    for (const item of quote.lineItems) {
      doc.ensure(33);
      const rowTop = doc.y;
      doc.textAt(item.label, { x: MARGIN + 12, y: rowTop + 10, width: 295, size: 8, color: C.foreground });
      doc.textAt(String(item.quantity), { x: 355, y: rowTop + 10, width: 40, align: "center", size: 8, color: C.muted });
      doc.textAt(formatMoney(item.unitPrice), { x: 398, y: rowTop + 10, width: 70, align: "right", size: 7.5, color: C.muted });
      doc.textAt(formatMoney(item.amount), { x: 470, y: rowTop + 10, width: 73, align: "right", size: 8, bold: true, color: C.primary });
      doc.y += 29;
      doc.rule(doc.y, C.border);
    }
  }

  doc.ensure(120);
  doc.y += 9;
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 105, C.primary);
  doc.rect(MARGIN, doc.y, 5, 105, C.gold);
  doc.textAt("TOTAL TRIP ESTIMATE", {
    x: MARGIN + 18,
    y: doc.y + 17,
    size: 7,
    bold: true,
    color: C.gold,
    charSpacing: 0.8,
  });
  doc.textAt(formatMoney(quote.total), {
    x: MARGIN + 18,
    y: doc.y + 36,
    size: 22,
    bold: true,
    color: C.white,
  });
  doc.textAt(`${totalTravellers} traveller${totalTravellers === 1 ? "" : "s"}  |  ${roomSummary(booking)}`, {
    x: MARGIN + 18,
    y: doc.y + 70,
    width: 278,
    size: 7,
    color: C.light,
  });
  cardLabelValue(doc, `${quote.depositPercent}% advance`, formatMoney(quote.depositAmount), MARGIN + 320, doc.y + 19, 86, { dark: true, valueSize: 11 });
  cardLabelValue(doc, "Balance", formatMoney(quote.balanceAmount), MARGIN + 420, doc.y + 19, 72, { dark: true, valueSize: 11 });
  doc.y += 125;

  // Continue with named travellers and commercial terms. The flow helper keeps
  // this directly after pricing when space allows and starts a clean page when
  // a longer quotation needs it.
  doc.ensure(195);

  sectionTitle(doc, "Prepared around your party", "Traveller and booking details");
  const partyTop = doc.y;
  const partyWidth = (CONTENT_WIDTH - 10) / 2;
  doc.rect(MARGIN, partyTop, partyWidth, 68, C.sand);
  cardLabelValue(doc, "Lead traveller", booking.contact_name, MARGIN + 13, partyTop + 13, partyWidth - 26);
  doc.textAt(booking.contact_email || booking.contact_phone || "Contact details pending", {
    x: MARGIN + 13,
    y: partyTop + 47,
    width: partyWidth - 26,
    size: 7,
    color: C.muted,
  });
  doc.rect(MARGIN + partyWidth + 10, partyTop, partyWidth, 68, C.primary);
  cardLabelValue(doc, "Booked by", bookedByLabel(booking), MARGIN + partyWidth + 23, partyTop + 13, partyWidth - 26, { dark: true });
  doc.textAt(booking.notify_booker && booking.booker_email ? "Booker copied on updates" : "Lead traveller receives updates", {
    x: MARGIN + partyWidth + 23,
    y: partyTop + 47,
    width: partyWidth - 26,
    size: 7,
    color: C.light,
  });
  doc.y += 87;

  doc.textAt("TRAVELLER NAMES", { y: doc.y, size: 6.5, bold: true, color: C.accent, charSpacing: 0.8 });
  doc.y += 15;
  const namedTravellerText = names.names
    .map((name, index) => `${String(index + 1).padStart(2, "0")} ${name}`)
    .join("   |   ");
  const namedTravellerLines = doc.wrap(namedTravellerText, CONTENT_WIDTH - 24, 8, true);
  const namesBoxHeight =
    18 + namedTravellerLines.length * 13 + (names.pendingCount ? 18 : 0);
  doc.ensure(namesBoxHeight + 8);
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, namesBoxHeight, C.sand);
  namedTravellerLines.forEach((line, index) => {
    doc.textAt(line, {
      x: MARGIN + 12,
      y: doc.y + 11 + index * 13,
      width: CONTENT_WIDTH - 24,
      size: 8,
      bold: true,
      color: C.primary,
    });
  });
  if (names.pendingCount) {
    doc.textAt(
      `${names.pendingCount} additional traveller name${names.pendingCount === 1 ? "" : "s"} can be added before ticketing.`,
      {
        x: MARGIN + 12,
        y: doc.y + 13 + namedTravellerLines.length * 13,
        size: 7,
        color: C.muted,
      }
    );
  }
  doc.y += namesBoxHeight + 8;

  if (booking.special_requirements) {
    doc.y += 5;
    sectionTitle(doc, "Preferences recorded", "Notes for your travel consultant");
    doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 8, C.gold);
    doc.y += 18;
    doc.paragraph(booking.special_requirements, {
      x: MARGIN + 12,
      maxWidth: CONTENT_WIDTH - 24,
      size: 8.3,
      lineHeight: 13,
      color: C.foreground,
      spaceAfter: 10,
    });
  }

  doc.y += 8;
  sectionTitle(doc, "Commercial notes", "What this quotation means");
  bullets(doc, [
    `This quotation is ${quote.isIndicative ? "indicative" : "confirmed"} and valid until ${quotationValidUntil(quote)}.`,
    "Hotel rooms, transport, tickets and experiences remain subject to live supplier availability until confirmed in writing.",
    `A ${quote.depositPercent}% advance is requested only after availability is verified and you approve the final services.`,
    "Cancellation, amendment, visa, insurance and supplier-specific conditions will be shared before payment.",
    "Anything not expressly listed as included in the proposal brochure should be treated as excluded.",
    "Next: share any changes to dates, traveller mix, rooms or experiences before your consultant rechecks availability.",
  ]);

  return doc.save();
}
