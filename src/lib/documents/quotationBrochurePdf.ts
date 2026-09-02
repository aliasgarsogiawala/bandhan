import type { Booking } from "@/lib/bookings/types";
import { formatMoney } from "@/lib/bookings/pricing";
import { COMPANY } from "@/lib/email/company";
import {
  formatProposalDate,
  safePackageSnapshot,
  safeQuoteSnapshot,
  totalTravellersForBooking,
} from "./proposalData";
import { CONTENT_WIDTH, MARGIN, PdfDoc } from "./pdf/layout";
import { drawImageCover, loadProposalImage } from "./pdf/images";
import {
  C,
  FOOTER_TOP,
  bullets,
  drawBrochureCover,
  drawDocFooter,
  drawDocHeader,
  drawItineraryDay,
  labelValue,
  repaintContinuationChrome,
  sectionHeading,
  splitLists,
} from "./pdf/chrome";

function attachChrome(doc: PdfDoc, booking: Booking) {
  doc.contentBottom = FOOTER_TOP - 18;
  doc.onNewPage = (current, pageIndex) => {
    drawDocHeader(current, {
      eyebrow: "Travel proposal",
      reference: booking.quotation_number,
    });
    drawDocFooter(current, pageIndex, "Brochure");
  };
}

export function tripBrochureFileName(booking: Booking): string {
  return `Bandhan-Tours-Trip-Brochure-${booking.quotation_number}.pdf`;
}

/** Backwards-compatible export for existing email delivery integrations. */
export const quotationBrochureFileName = tripBrochureFileName;

export async function renderQuotationBrochurePdf(booking: Booking): Promise<Uint8Array> {
  const snapshot = safePackageSnapshot(booking);
  const quote = safeQuoteSnapshot(booking);
  const totalTravellers = totalTravellersForBooking(booking);
  const itinerary = snapshot.itinerary || [];
  const doc = await PdfDoc.create();
  attachChrome(doc, booking);
  const imageSources = [...new Set(
    [snapshot.heroImage, ...(snapshot.gallery || []).map((item) => item.image)]
      .filter((value): value is string => Boolean(value))
  )];
  const loadedImages = await Promise.all(imageSources.map((source) => loadProposalImage(doc, source)));
  const availableImages = loadedImages.filter((image): image is NonNullable<typeof image> => Boolean(image));

  // ── Cover ──────────────────────────────────────────────────────────────
  drawBrochureCover(doc, {
    image: availableImages[0] || null,
    reference: `Travel proposal  /  ${booking.quotation_number}`,
    eyebrow: `Prepared for ${booking.contact_name}`,
    title: snapshot.title,
    tagline: snapshot.tagline,
    meta: [
      ["Prepared for", booking.contact_name],
      ["Travel date", formatProposalDate(booking.travel_date)],
      ["Travellers", String(totalTravellers)],
      [
        booking.booker_name ? "Trip ref · booked by" : "Trip reference",
        booking.booker_name
          ? `${booking.booking_code} · ${booking.booker_name}`
          : booking.booking_code,
      ],
      ["Duration", snapshot.duration || booking.duration_label || "Custom"],
      ["Indicative total", formatMoney(quote.total)],
    ],
  });

  // ── Journey overview ───────────────────────────────────────────────────
  doc.addPage();
  sectionHeading(doc, "About this trip", snapshot.destination || snapshot.title);

  doc.paragraph(
    snapshot.overview ||
      `This proposal has been prepared around your preferred dates, travelling party and requirements for ${snapshot.destination}. Your travel consultant will verify final hotel and transport availability before confirmation.`,
    { size: 9.2, lineHeight: 14.5, color: C.foreground, spaceAfter: 18 }
  );

  const galleryImages = availableImages.slice(0, 2);
  if (galleryImages.length) {
    const gap = 10;
    const imageWidth = (CONTENT_WIDTH - gap) / 2;
    galleryImages.forEach((image, index) => {
      drawImageCover(doc, image, MARGIN + index * (imageWidth + gap), doc.y, imageWidth, 168);
      const caption = snapshot.gallery?.[index]?.caption || snapshot.destination;
      doc.rect(MARGIN + index * (imageWidth + gap), doc.y + 148, imageWidth, 20, C.primary, 0.72);
      doc.textAt(caption, { x: MARGIN + 9 + index * (imageWidth + gap), y: doc.y + 154, width: imageWidth - 18, size: 6.4, color: C.white });
    });
    doc.y += 186;
  }

  const detailCards: Array<[string, string]> = [
    ["Destination", snapshot.destination],
    ["Starts from", booking.departure_city || snapshot.startingPoint || "To be confirmed"],
    ["Best time", snapshot.bestTime || "Year-round"],
    ["Your party", `${totalTravellers} guest${totalTravellers === 1 ? "" : "s"}`],
  ];
  const detailWidth = (CONTENT_WIDTH - 12) / 2;
  for (let i = 0; i < detailCards.length; i += 2) {
    doc.ensure(58);
    const y = doc.y;
    detailCards.slice(i, i + 2).forEach(([label, value], offset) => {
      const x = MARGIN + offset * (detailWidth + 12);
      doc.rect(x, y, detailWidth, 52, C.sand);
      doc.rect(x, y, 3, 52, C.gold);
      labelValue(doc, label, value, x + 14, y + 12, detailWidth - 28, { valueSize: 9 });
    });
    doc.y += 64;
  }

  if (snapshot.highlights?.length) {
    doc.y += 4;
    sectionHeading(doc, "Highlights", "What you will see");
    snapshot.highlights.forEach((highlight, index) => {
      doc.ensure(27);
      doc.rule(doc.y + 23, C.border, MARGIN, CONTENT_WIDTH, 0.5);
      doc.textAt(String(index + 1).padStart(2, "0"), { x: MARGIN, y: doc.y + 4, size: 9, bold: true, color: C.goldDark });
      doc.textAt(highlight, { x: MARGIN + 34, y: doc.y + 4, width: CONTENT_WIDTH - 34, size: 8.3, bold: true, color: C.primary });
      doc.y += 27;
    });
  }

  // ── Itinerary ──────────────────────────────────────────────────────────
  if (itinerary.length) {
    doc.addPage();
    sectionHeading(
      doc,
      "Itinerary",
      "Your day-by-day plan",
      `${itinerary.length} day${itinerary.length === 1 ? "" : "s"}`
    );

    // Route ribbon — overnight stops at a glance.
    const stays = itinerary
      .map((day) => (day.stay || "").trim())
      .filter((stay) => stay && stay !== "—");
    const uniqueStays = [...new Set(stays)];
    if (uniqueStays.length) {
      doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 34, C.primary);
      doc.textAt("ROUTE", {
        x: MARGIN + 12,
        y: doc.y + 12,
        size: 6.2,
        bold: true,
        color: C.gold,
        charSpacing: 0.8,
      });
      doc.textAt(uniqueStays.join("  →  "), {
        x: MARGIN + 58,
        y: doc.y + 11,
        width: CONTENT_WIDTH - 70,
        size: 8.2,
        bold: true,
        color: C.white,
      });
      doc.y += 48;
    }

    itinerary.forEach((item, index) => {
      drawItineraryDay(doc, item, {
        isLast: index === itinerary.length - 1,
        image: undefined,
      });
    });
  }

  // ── Pricing ────────────────────────────────────────────────────────────
  if (itinerary.length) doc.addPage();
  doc.y += 6;
  sectionHeading(doc, "Your estimate", "Cost summary", "All amounts in INR");

  // Columns measured in from the panel's right edge. The amount column was
  // pinned there already but "Calculation" sat at a hardcoded x, so the two
  // drifted apart from the table they label.
  const rowPad = 12;
  const rowRight = MARGIN + CONTENT_WIDTH - rowPad;
  const amountW = 104;
  const calcW = 108;
  const amountX = rowRight - amountW;
  const calcX = amountX - 16 - calcW;
  const labelX = MARGIN + rowPad;
  const labelW = calcX - labelX - 12;

  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 28, C.primary);
  doc.textAt("Description", {
    x: labelX,
    y: doc.y + 10,
    size: 6.4,
    bold: true,
    color: C.gold,
  });
  doc.textAt("Calculation", {
    x: calcX,
    y: doc.y + 10,
    width: calcW,
    align: "right",
    size: 6.4,
    bold: true,
    color: C.gold,
  });
  doc.textAt("Amount", {
    x: amountX,
    y: doc.y + 10,
    width: amountW,
    align: "right",
    size: 6.4,
    bold: true,
    color: C.gold,
  });
  doc.y += 28;

  if (!quote.lineItems.length) {
    doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 42, C.sand);
    doc.textAt("Detailed pricing is being prepared by your travel consultant.", {
      x: MARGIN + 14,
      y: doc.y + 15,
      size: 8.5,
      color: C.muted,
    });
    doc.y += 50;
  } else {
    quote.lineItems.forEach((item, index) => {
      doc.ensure(30);
      if (index % 2 === 0) doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 28, C.sand);
      doc.textAt(item.label, {
        x: labelX,
        y: doc.y + 9,
        width: labelW,
        size: 8.3,
        color: C.foreground,
      });
      doc.textAt(`${item.quantity} × ${formatMoney(item.unitPrice)}`, {
        x: calcX,
        y: doc.y + 9,
        width: calcW,
        align: "right",
        size: 7.5,
        color: C.muted,
      });
      doc.textAt(formatMoney(item.amount), {
        x: amountX,
        y: doc.y + 9,
        width: amountW,
        align: "right",
        size: 8.5,
        bold: true,
        color: C.primary,
      });
      doc.y += 28;
    });
  }

  const bandHeight = 100;
  doc.ensure(bandHeight + 16);
  doc.y += 8;
  const bandTop = doc.y;
  const bandPad = 18;
  const bandRight = MARGIN + CONTENT_WIDTH - bandPad;
  // Two stat columns pinned to the panel's right edge and sized to the widest
  // figure they can hold. The previous fixed offsets put the balance column's
  // right edge 5pt outside the panel, so the amount sat flush against the fill
  // and a seven-figure balance would have run straight off it.
  const statW = 132;
  const balanceX = bandRight - statW;
  const advanceX = balanceX - 12 - statW;

  doc.rect(MARGIN, bandTop, CONTENT_WIDTH, bandHeight, C.primary);
  doc.rect(MARGIN, bandTop, 4, bandHeight, C.gold);
  doc.textAt("Estimated trip total", {
    x: MARGIN + bandPad,
    y: bandTop + 17,
    size: 7,
    bold: true,
    color: C.gold,
  });
  doc.textAt(formatMoney(quote.total), {
    x: MARGIN + bandPad,
    y: bandTop + 35,
    size: 22,
    bold: true,
    color: C.white,
  });
  doc.textAt(
    `Indicative quotation valid for ${quote.validityDays} days. Final price confirmed after hotel, transport and departure availability verification.`,
    {
      x: MARGIN + bandPad,
      // Kept clear of the stat columns above so a longer note cannot run under
      // them.
      y: bandTop + 72,
      width: advanceX - MARGIN - bandPad - 16,
      size: 6.8,
      color: C.light,
    }
  );
  labelValue(
    doc,
    `${quote.depositPercent}% booking advance`,
    formatMoney(quote.depositAmount),
    advanceX,
    bandTop + 24,
    statW,
    { dark: true, valueSize: 13, valueLines: 1, align: "right" }
  );
  labelValue(
    doc,
    "Balance due",
    formatMoney(quote.balanceAmount),
    balanceX,
    bandTop + 24,
    statW,
    { dark: true, valueSize: 13, valueLines: 1, align: "right" }
  );
  doc.y = bandTop + bandHeight + 16;

  // ── Inclusions / exclusions ────────────────────────────────────────────
  if (snapshot.inclusions?.length || snapshot.exclusions?.length) {
    sectionHeading(doc, "Price details", "What is included");
    splitLists(
      doc,
      "Inclusions",
      snapshot.inclusions?.length ? snapshot.inclusions : ["Confirmed with your consultant"],
      "Exclusions",
      snapshot.exclusions?.length ? snapshot.exclusions : ["Anything not listed as included"]
    );
  }

  // Booking instructions close the brochure on a deliberate, image-led page.
  doc.addPage();

  if (booking.special_requirements) {
    sectionHeading(doc, "Your notes", "For the travel consultant");
    // The rule has to be measured, not assumed: at a fixed height it overhung
    // a short note and struck through the heading that follows.
    const noteLines = doc.wrap(booking.special_requirements, CONTENT_WIDTH - 24, 8.6);
    doc.rect(MARGIN, doc.y - 2, 3, noteLines.length * 13.5 + 6, C.gold);
    doc.paragraph(booking.special_requirements, {
      x: MARGIN + 16,
      maxWidth: CONTENT_WIDTH - 24,
      size: 8.6,
      lineHeight: 13.5,
      color: C.foreground,
      spaceAfter: 22,
    });
  }

  // ── Next steps ─────────────────────────────────────────────────────────
  sectionHeading(doc, "Before you book", "What happens next");
  bullets(doc, [
    "Review this proposal and share any changes to dates, hotels, room configuration or pace.",
    "Your travel consultant will verify live availability and issue the final confirmation.",
    `A ${quote.depositPercent}% advance secures the confirmed services; the remaining payment schedule will be shared before booking.`,
    "Cancellation and amendment charges depend on the final suppliers selected and will be disclosed before payment.",
  ]);

  doc.ensure(96);
  doc.y += 10;
  const closingTop = doc.y;
  doc.rect(MARGIN, closingTop, CONTENT_WIDTH, 84, C.primary);
  doc.rect(MARGIN, closingTop, 4, 84, C.gold);
  doc.textAt("Questions or changes?", {
    x: MARGIN + 18,
    y: closingTop + 16,
    size: 8,
    bold: true,
    color: C.gold,
  });
  doc.textAt("Speak with your Bandhan Tours consultant", {
    x: MARGIN + 18,
    y: closingTop + 34,
    size: 13,
    bold: true,
    color: C.white,
  });
  doc.textAt(`${COMPANY.phoneLabel}  ·  ${COMPANY.email}  ·  ${COMPANY.website}`, {
    x: MARGIN + 18,
    y: closingTop + 56,
    size: 8,
    color: C.light,
  });

  if (availableImages[1] || availableImages[0]) {
    const imageTop = closingTop + 104;
    drawImageCover(doc, availableImages[1] || availableImages[0], MARGIN, imageTop, CONTENT_WIDTH, 230);
    doc.rect(MARGIN, imageTop + 204, CONTENT_WIDTH, 26, C.primary, 0.72);
    doc.textAt(snapshot.gallery?.[1]?.caption || snapshot.destination, {
      x: MARGIN + 12,
      y: imageTop + 213,
      width: CONTENT_WIDTH - 24,
      size: 6.5,
      color: C.white,
    });
  }

  repaintContinuationChrome(doc, {
    eyebrow: "Travel proposal",
    reference: booking.quotation_number,
    label: "Brochure",
  });
  return doc.save();
}
