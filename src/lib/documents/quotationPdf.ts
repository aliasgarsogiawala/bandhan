import type { Booking } from "@/lib/bookings/types";
import { formatMoney } from "@/lib/bookings/pricing";
import { COMPANY } from "@/lib/email/company";
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
  PAGE_WIDTH,
  PdfDoc,
} from "./pdf/layout";
import { drawImageCover, loadProposalImage } from "./pdf/images";
import {
  C,
  FOOTER_TOP,
  bullets,
  drawDocFooter,
  drawDocHeader,
  labelValue,
  repaintContinuationChrome,
  sectionHeading,
} from "./pdf/chrome";

export function quotationFileName(booking: Booking): string {
  return `Bandhan-Tours-Quotation-${booking.quotation_number}.pdf`;
}

function attachChrome(doc: PdfDoc, booking: Booking) {
  doc.contentBottom = FOOTER_TOP - 16;
  doc.onNewPage = (current, pageIndex) => {
    drawDocHeader(current, {
      eyebrow: "Personalised quotation",
      reference: booking.quotation_number,
    });
    drawDocFooter(current, pageIndex, "Quotation");
  };
}

export async function renderQuotationPdf(booking: Booking): Promise<Uint8Array> {
  const snapshot = safePackageSnapshot(booking);
  const quote = safeQuoteSnapshot(booking);
  const mix = travellerMix(booking);
  const names = travellerNames(booking);
  const totalTravellers = totalTravellersForBooking(booking);
  const doc = await PdfDoc.create();
  attachChrome(doc, booking);
  const heroImage = await loadProposalImage(doc, snapshot.heroImage);

  // ── Hero band ──────────────────────────────────────────────────────────
  doc.rect(0, 0, PAGE_WIDTH, 172, C.primary);
  if (heroImage) {
    drawImageCover(doc, heroImage, 360, 0, PAGE_WIDTH - 360, 172, 0.9);
    doc.rect(330, 0, PAGE_WIDTH - 330, 172, C.primary, 0.42);
  }
  doc.rect(0, 0, 5, 172, C.gold);

  doc.textAt(COMPANY.name, {
    x: MARGIN,
    y: 22,
    size: 14,
    bold: true,
    color: C.white,
  });
  doc.textAt(COMPANY.tagline.toUpperCase(), {
    x: MARGIN,
    y: 42,
    size: 6.5,
    bold: true,
    color: C.gold,
    charSpacing: 0.95,
  });
  doc.textAt("PERSONALISED QUOTATION", {
    x: MARGIN,
    y: 72,
    size: 7.5,
    bold: true,
    color: C.gold,
    charSpacing: 1.25,
  });

  const titleLines = doc.wrap(snapshot.title, 300, 21, false, "serif").slice(0, 3);
  titleLines.forEach((line, index) => {
    doc.textAt(line, {
      x: MARGIN,
      y: 88 + index * 23,
      size: 21,
      family: "serif",
      color: C.white,
    });
  });

  doc.textAt("QUOTE NUMBER", {
    x: 380,
    y: 24,
    width: 165,
    align: "right",
    size: 6.2,
    bold: true,
    color: C.gold,
    charSpacing: 0.7,
  });
  doc.textAt(booking.quotation_number, {
    x: 380,
    y: 40,
    width: 165,
    align: "right",
    size: 13,
    bold: true,
    color: C.white,
  });
  doc.textAt(quote.isIndicative ? "INDICATIVE · LIVE AVAILABILITY PENDING" : "CONFIRMED PRICING", {
    x: 300,
    y: 142,
    width: 255,
    align: "right",
    size: 6.4,
    bold: true,
    color: quote.isIndicative ? C.gold : C.greenLight,
    charSpacing: 0.35,
  });

  drawDocFooter(doc, 0, "Quotation");

  // ── Intro cards ────────────────────────────────────────────────────────
  doc.y = 194;
  const introWidth = (CONTENT_WIDTH - 16) / 3;
  (
    [
      ["Prepared for", booking.contact_name],
      ["Issued on", formatProposalDate(quote.generatedAt)],
      ["Valid until", quotationValidUntil(quote)],
    ] as const
  ).forEach(([label, value], index) => {
    const x = MARGIN + index * (introWidth + 8);
    doc.rect(x, doc.y, introWidth, 56, C.sand);
    doc.rect(x, doc.y, 3, 56, index === 2 ? C.accent : C.gold);
    labelValue(doc, label, value, x + 12, doc.y + 12, introWidth - 24, { valueSize: 9 });
  });
  doc.y += 72;

  // ── Trip glance ────────────────────────────────────────────────────────
  sectionHeading(doc, "Trip at a glance", "The journey priced for you");
  const detailWidth = (CONTENT_WIDTH - 12) / 2;
  const details: Array<[string, string]> = [
    ["Destination", snapshot.destination],
    ["Travel date", formatProposalDate(booking.travel_date)],
    ["Departure", booking.departure_city || snapshot.startingPoint || "To be confirmed"],
    ["Duration", booking.duration_label || snapshot.duration || "Custom duration"],
  ];
  for (let i = 0; i < details.length; i += 2) {
    doc.ensure(56);
    const top = doc.y;
    details.slice(i, i + 2).forEach(([label, value], offset) => {
      const x = MARGIN + offset * (detailWidth + 12);
      doc.strokeRect(x, top, detailWidth, 50, C.border, 0.7);
      labelValue(doc, label, value, x + 12, top + 11, detailWidth - 24, { valueSize: 9 });
    });
    doc.y += 60;
  }

  // ── Party mix ──────────────────────────────────────────────────────────
  sectionHeading(
    doc,
    "Party configuration",
    `${totalTravellers} traveller${totalTravellers === 1 ? "" : "s"} and selected rooms`
  );
  const mixGap = 8;
  const mixWidth = (CONTENT_WIDTH - mixGap * 3) / 4;
  mix.forEach((item, index) => {
    const x = MARGIN + index * (mixWidth + mixGap);
    const active = item.count > 0;
    doc.rect(x, doc.y, mixWidth, 62, active ? C.primary : C.sand);
    if (active) doc.rect(x, doc.y, mixWidth, 3, C.gold);
    doc.textAt(String(item.count), {
      x: x + 11,
      y: doc.y + 12,
      size: 19,
      bold: true,
      color: active ? C.gold : C.light,
    });
    doc.textAt(item.shortLabel.toUpperCase(), {
      x: x + 11,
      y: doc.y + 36,
      width: mixWidth - 20,
      size: 6.2,
      bold: true,
      color: active ? C.white : C.muted,
      charSpacing: 0.35,
    });
    doc.textAt(item.note, {
      x: x + 11,
      y: doc.y + 48,
      width: mixWidth - 20,
      size: 5.8,
      color: active ? C.light : C.muted,
    });
  });
  doc.y += 74;

  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 36, C.greenLight);
  doc.rect(MARGIN, doc.y, 3.5, 36, C.green);
  doc.textAt("ROOM PLAN", {
    x: MARGIN + 14,
    y: doc.y + 12,
    size: 6.3,
    bold: true,
    color: C.green,
    charSpacing: 0.7,
  });
  doc.textAt(roomSummary(booking), {
    x: MARGIN + 92,
    y: doc.y + 11,
    width: CONTENT_WIDTH - 106,
    size: 8.5,
    bold: true,
    color: C.primary,
  });
  doc.y += 52;

  // ── Pricing table ──────────────────────────────────────────────────────
  sectionHeading(doc, "Transparent pricing", "Traveller-by-traveller quotation", "All amounts in INR");
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 28, C.primary);
  doc.textAt("DESCRIPTION", { x: MARGIN + 12, y: doc.y + 10, size: 6.4, bold: true, color: C.gold });
  doc.textAt("QTY", { x: 350, y: doc.y + 10, width: 40, align: "center", size: 6.4, bold: true, color: C.gold });
  doc.textAt("RATE", { x: 392, y: doc.y + 10, width: 70, align: "right", size: 6.4, bold: true, color: C.gold });
  doc.textAt("AMOUNT", { x: 465, y: doc.y + 10, width: 78, align: "right", size: 6.4, bold: true, color: C.gold });
  doc.y += 28;

  if (!quote.lineItems.length) {
    doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 44, C.sand);
    doc.textAt("Detailed pricing is being prepared by your travel consultant.", {
      x: MARGIN + 12,
      y: doc.y + 15,
      size: 8.5,
      color: C.muted,
    });
    doc.y += 52;
  } else {
    quote.lineItems.forEach((item, index) => {
      doc.ensure(30);
      if (index % 2 === 0) doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 28, C.sand);
      doc.textAt(item.label, {
        x: MARGIN + 12,
        y: doc.y + 9,
        width: 290,
        size: 8.2,
        color: C.foreground,
      });
      doc.textAt(String(item.quantity), {
        x: 350,
        y: doc.y + 9,
        width: 40,
        align: "center",
        size: 8,
        color: C.muted,
      });
      doc.textAt(formatMoney(item.unitPrice), {
        x: 392,
        y: doc.y + 9,
        width: 70,
        align: "right",
        size: 7.6,
        color: C.muted,
      });
      doc.textAt(formatMoney(item.amount), {
        x: 465,
        y: doc.y + 9,
        width: 78,
        align: "right",
        size: 8.3,
        bold: true,
        color: C.primary,
      });
      doc.y += 28;
    });
  }

  doc.ensure(118);
  doc.y += 10;
  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 102, C.primary);
  doc.rect(MARGIN, doc.y, 4, 102, C.gold);
  doc.textAt("TOTAL TRIP ESTIMATE", {
    x: MARGIN + 18,
    y: doc.y + 16,
    size: 7,
    bold: true,
    color: C.gold,
    charSpacing: 0.8,
  });
  doc.textAt(formatMoney(quote.total), {
    x: MARGIN + 18,
    y: doc.y + 34,
    size: 22,
    bold: true,
    color: C.white,
  });
  doc.textAt(
    `${totalTravellers} traveller${totalTravellers === 1 ? "" : "s"}  ·  ${roomSummary(booking)}`,
    {
      x: MARGIN + 18,
      y: doc.y + 68,
      width: 290,
      size: 7,
      color: C.light,
    }
  );
  labelValue(
    doc,
    `${quote.depositPercent}% advance`,
    formatMoney(quote.depositAmount),
    MARGIN + 330,
    doc.y + 22,
    90,
    { dark: true, valueSize: 12 }
  );
  labelValue(
    doc,
    "Balance",
    formatMoney(quote.balanceAmount),
    MARGIN + 435,
    doc.y + 22,
    80,
    { dark: true, valueSize: 12 }
  );
  doc.y += 118;

  // ── Traveller details ──────────────────────────────────────────────────
  doc.ensure(190);
  sectionHeading(doc, "Prepared around your party", "Traveller and booking details");

  const partyWidth = (CONTENT_WIDTH - 10) / 2;
  const partyTop = doc.y;
  doc.rect(MARGIN, partyTop, partyWidth, 68, C.sand);
  labelValue(doc, "Lead traveller", booking.contact_name, MARGIN + 13, partyTop + 13, partyWidth - 26);
  doc.textAt(booking.contact_email || booking.contact_phone || "Contact details pending", {
    x: MARGIN + 13,
    y: partyTop + 48,
    width: partyWidth - 26,
    size: 7,
    color: C.muted,
  });
  doc.rect(MARGIN + partyWidth + 10, partyTop, partyWidth, 68, C.primary);
  labelValue(
    doc,
    "Booked by",
    bookedByLabel(booking),
    MARGIN + partyWidth + 23,
    partyTop + 13,
    partyWidth - 26,
    { dark: true }
  );
  doc.textAt(
    booking.notify_booker && booking.booker_email
      ? "Booker copied on updates"
      : "Lead traveller receives updates",
    {
      x: MARGIN + partyWidth + 23,
      y: partyTop + 48,
      width: partyWidth - 26,
      size: 7,
      color: C.light,
    }
  );
  doc.y += 84;

  doc.textAt("TRAVELLER NAMES", {
    y: doc.y,
    size: 6.4,
    bold: true,
    color: C.accent,
    charSpacing: 0.8,
  });
  doc.y += 14;
  const namedTravellerText = names.names
    .map((name, index) => `${String(index + 1).padStart(2, "0")}  ${name}`)
    .join("     ");
  const namedTravellerLines = doc.wrap(
    namedTravellerText || "Traveller names to be confirmed",
    CONTENT_WIDTH - 24,
    8,
    true
  );
  const namesBoxHeight = 18 + namedTravellerLines.length * 13 + (names.pendingCount ? 18 : 0);
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
  doc.y += namesBoxHeight + 10;

  // Mini itinerary preview on the commercial quote — first/last days only if long.
  const itinerary = snapshot.itinerary || [];
  if (itinerary.length) {
    sectionHeading(
      doc,
      "Itinerary snapshot",
      "Day-by-day outline",
      `Full detail in the trip brochure · ${itinerary.length} days`
    );
    const preview =
      itinerary.length <= 6
        ? itinerary
        : [...itinerary.slice(0, 3), ...itinerary.slice(-2)];
    const skipped = itinerary.length - preview.length;

    preview.forEach((item, index) => {
      if (skipped && index === 3) {
        doc.ensure(22);
        doc.textAt(`… ${skipped} more day${skipped === 1 ? "" : "s"} in the brochure …`, {
          y: doc.y,
          width: CONTENT_WIDTH,
          align: "center",
          size: 7.5,
          bold: true,
          color: C.muted,
        });
        doc.y += 18;
      }
      const titleLines = doc.wrap(item.title, CONTENT_WIDTH - 70, 8.5, true).slice(0, 1);
      doc.ensure(28);
      doc.rect(MARGIN, doc.y, 36, 22, C.primary);
      doc.textAt(String(item.day).padStart(2, "0"), {
        x: MARGIN,
        y: doc.y + 6,
        width: 36,
        align: "center",
        size: 9,
        bold: true,
        color: C.gold,
      });
      doc.textAt(titleLines[0] || item.title, {
        x: MARGIN + 46,
        y: doc.y + 6,
        width: CONTENT_WIDTH - 46,
        size: 8.5,
        bold: true,
        color: C.primary,
      });
      doc.y += 28;
    });
    doc.y += 6;
  }

  if (booking.special_requirements) {
    doc.ensure(105);
    sectionHeading(doc, "Preferences recorded", "Notes for your travel consultant");
    doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 6, C.gold);
    doc.y += 14;
    doc.paragraph(booking.special_requirements, {
      x: MARGIN + 4,
      maxWidth: CONTENT_WIDTH - 8,
      size: 8.3,
      lineHeight: 13,
      color: C.foreground,
      spaceAfter: 12,
    });
  }

  sectionHeading(doc, "Commercial notes", "What this quotation means");
  bullets(doc, [
    `This quotation is ${quote.isIndicative ? "indicative" : "confirmed"} and valid until ${quotationValidUntil(quote)}.`,
    "Hotel rooms, transport, tickets and experiences remain subject to live supplier availability until confirmed in writing.",
    `A ${quote.depositPercent}% advance is requested only after availability is verified and you approve the final services.`,
    "Cancellation, amendment, visa, insurance and supplier-specific conditions will be shared before payment.",
    "Anything not expressly listed as included in the proposal brochure should be treated as excluded.",
    "Next: share any changes to dates, traveller mix, rooms or experiences before your consultant rechecks availability.",
  ]);

  repaintContinuationChrome(doc, {
    eyebrow: "Personalised quotation",
    reference: booking.quotation_number,
    label: "Quotation",
  });
  return doc.save();
}
