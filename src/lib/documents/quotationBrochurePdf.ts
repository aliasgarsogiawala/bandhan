import type { Booking } from "@/lib/bookings/types";
import { formatMoney } from "@/lib/bookings/pricing";
import { COMPANY } from "@/lib/email/company";
import {
  formatProposalDate,
  safePackageSnapshot,
  safeQuoteSnapshot,
  totalTravellersForBooking,
} from "./proposalData";
import {
  CONTENT_WIDTH,
  MARGIN,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  PdfDoc,
} from "./pdf/layout";
import { drawImageCover, loadProposalImage } from "./pdf/images";
import {
  C,
  FOOTER_TOP,
  bullets,
  drawBrandMark,
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
      eyebrow: "Personalised trip brochure",
      reference: booking.quotation_number,
    });
    drawDocFooter(current, pageIndex, "Brochure");
  };
}

function drawCoverMeta(
  doc: PdfDoc,
  rows: Array<[string, string]>,
  top: number
) {
  const height = 118;
  doc.roundedRect(MARGIN, top, CONTENT_WIDTH, height, C.white, 14, 0.98);
  doc.strokeRect(MARGIN, top, CONTENT_WIDTH, height, C.gold, 1);
  const colWidth = (CONTENT_WIDTH - 40) / 3;
  rows.forEach(([label, value], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = MARGIN + 16 + col * (colWidth + 12);
    const y = top + 18 + row * 52;
    labelValue(doc, label, value, x, y, colWidth, {
      dark: true,
      valueSize: 9.5,
      valueLines: 2,
    });
  });
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
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, C.primary);
  const coverImage = availableImages[0] || null;

  if (coverImage) {
    drawImageCover(doc, coverImage, 0, 0, PAGE_WIDTH, PAGE_HEIGHT, 0.92);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, C.primary, 0.34);
    doc.rect(0, 430, PAGE_WIDTH, 412, C.primary, 0.72);
  } else {
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, C.primary);
  }

  drawBrandMark(doc, { y: 22, dark: true });
  doc.textAt("PRIVATE JOURNEY  /  PERSONALISED PROPOSAL", { x: MARGIN, y: 36, width: CONTENT_WIDTH, align: "right", size: 6.4, bold: true, color: C.gold, charSpacing: 0.8 });
  doc.textAt(`CURATED FOR  ${booking.contact_name.toUpperCase()}`, { x: MARGIN, y: 470, size: 7, bold: true, color: C.gold, charSpacing: 1.15 });

  const titleStartY = 500;
  const coverTitle = doc.wrap(snapshot.title, CONTENT_WIDTH - 30, 30, false, "serif");
  let coverY = titleStartY;
  for (const line of coverTitle.slice(0, 3)) {
    doc.textAt(line, { x: MARGIN, y: coverY, size: 30, family: "serif", color: C.white });
    coverY += 34;
  }
  if (snapshot.tagline) {
    coverY += 6;
    for (const line of doc.wrap(snapshot.tagline, CONTENT_WIDTH - 40, 10).slice(0, 3)) {
      doc.textAt(line, { x: MARGIN, y: coverY, size: 9.5, color: C.white });
      coverY += 15;
    }
  }

  const metaTop = Math.min(Math.max(coverY + 22, 650), PAGE_HEIGHT - 170);
  drawCoverMeta(
    doc,
    [
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
    metaTop
  );

  doc.textAt(`${COMPANY.phoneLabel}  /  ${COMPANY.email}  /  ${COMPANY.website}`, { x: MARGIN, y: PAGE_HEIGHT - 25, size: 6.5, color: C.white });

  // ── Journey overview ───────────────────────────────────────────────────
  doc.addPage();
  sectionHeading(doc, "Your journey", "A thoughtfully planned holiday");

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
      doc.roundedRect(x, y, detailWidth, 52, C.sand, 9);
      doc.roundedRect(x, y, 3, 52, offset === 0 ? C.gold : C.accent, 2);
      labelValue(doc, label, value, x + 14, y + 12, detailWidth - 28, { valueSize: 9 });
    });
    doc.y += 64;
  }

  if (snapshot.highlights?.length) {
    doc.y += 4;
    sectionHeading(doc, "Signature moments", "Highlights of your route");
    const chipGap = 8;
    let chipX = MARGIN;
    let chipY = doc.y;
    for (const highlight of snapshot.highlights) {
      const text = highlight.length > 48 ? `${highlight.slice(0, 46)}…` : highlight;
      const width = Math.min(CONTENT_WIDTH, doc.measure(text, 7.5, true) + 22);
      if (chipX + width > MARGIN + CONTENT_WIDTH) {
        chipX = MARGIN;
        chipY += 28;
      }
      doc.ensure(chipY - doc.y + 28);
      doc.rect(chipX, chipY, width, 22, C.primary);
      doc.textAt(text, {
        x: chipX + 11,
        y: chipY + 6.5,
        size: 7.5,
        bold: true,
        color: C.white,
      });
      chipX += width + chipGap;
    }
    doc.y = chipY + 36;
  }

  doc.rule(doc.y, C.border);
  doc.y += 14;
  doc.textAt(`CURATED FOR  ${booking.contact_name.toUpperCase()}  /  ${totalTravellers} GUESTS`, {
    y: doc.y,
    size: 6.8,
    bold: true,
    color: C.goldDark,
    charSpacing: 0.75,
  });

  // ── Itinerary ──────────────────────────────────────────────────────────
  if (itinerary.length) {
    doc.addPage();
    sectionHeading(
      doc,
      "Day by day",
      "Your proposed itinerary",
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
        totalDays: itinerary.length,
        image: availableImages.length ? availableImages[index % availableImages.length] : undefined,
      });
    });
  }

  // ── Pricing ────────────────────────────────────────────────────────────
  doc.y += 6;
  sectionHeading(doc, "Transparent pricing", "Your indicative quotation", "All amounts in INR");

  doc.roundedRect(MARGIN, doc.y, CONTENT_WIDTH, 28, C.primary, 8);
  doc.textAt("DESCRIPTION", {
    x: MARGIN + 12,
    y: doc.y + 10,
    size: 6.4,
    bold: true,
    color: C.gold,
  });
  doc.textAt("CALCULATION", {
    x: 320,
    y: doc.y + 10,
    width: 120,
    align: "right",
    size: 6.4,
    bold: true,
    color: C.gold,
  });
  doc.textAt("AMOUNT", {
    x: MARGIN,
    y: doc.y + 10,
    width: CONTENT_WIDTH - 12,
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
        x: MARGIN + 12,
        y: doc.y + 9,
        width: 250,
        size: 8.3,
        color: C.foreground,
      });
      doc.textAt(`${item.quantity} × ${formatMoney(item.unitPrice)}`, {
        x: 320,
        y: doc.y + 9,
        width: 120,
        align: "right",
        size: 7.5,
        color: C.muted,
      });
      doc.textAt(formatMoney(item.amount), {
        x: MARGIN,
        y: doc.y + 9,
        width: CONTENT_WIDTH - 12,
        align: "right",
        size: 8.5,
        bold: true,
        color: C.primary,
      });
      doc.y += 28;
    });
  }

  doc.ensure(110);
  doc.y += 8;
  doc.roundedRect(MARGIN, doc.y, CONTENT_WIDTH, 96, C.primary, 12);
  doc.roundedRect(MARGIN, doc.y, 4, 96, C.gold, 2);
  doc.textAt("TOTAL PACKAGE ESTIMATE", {
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
    `Indicative quotation valid for ${quote.validityDays} days. Final price confirmed after hotel, transport and departure availability verification.`,
    {
      x: MARGIN + 18,
      y: doc.y + 68,
      width: 280,
      size: 6.8,
      color: C.light,
    }
  );
  labelValue(
    doc,
    `${quote.depositPercent}% booking advance`,
    formatMoney(quote.depositAmount),
    MARGIN + 330,
    doc.y + 22,
    100,
    { dark: true, valueSize: 13 }
  );
  labelValue(
    doc,
    "Balance due",
    formatMoney(quote.balanceAmount),
    MARGIN + 440,
    doc.y + 22,
    80,
    { dark: true, valueSize: 13 }
  );
  doc.y += 112;

  // ── Inclusions / exclusions ────────────────────────────────────────────
  if (snapshot.inclusions?.length || snapshot.exclusions?.length) {
    sectionHeading(doc, "The fine print upfront", "Included and not included");
    splitLists(
      doc,
      "Inclusions",
      snapshot.inclusions?.length ? snapshot.inclusions : ["Confirmed with your consultant"],
      "Exclusions",
      snapshot.exclusions?.length ? snapshot.exclusions : ["Anything not listed as included"]
    );
  }

  if (booking.special_requirements) {
    doc.ensure(105);
    sectionHeading(doc, "Your preferences", "Special requests noted");
    doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 8, C.gold);
    doc.y += 16;
    doc.paragraph(booking.special_requirements, {
      x: MARGIN + 4,
      maxWidth: CONTENT_WIDTH - 8,
      size: 8.6,
      lineHeight: 13.5,
      color: C.foreground,
      spaceAfter: 14,
    });
  }

  // ── Next steps ─────────────────────────────────────────────────────────
  sectionHeading(doc, "Next steps", "Ready when you are");
  bullets(doc, [
    "Review this proposal and share any changes to dates, hotels, room configuration or pace.",
    "Your travel consultant will verify live availability and issue the final confirmation.",
    `A ${quote.depositPercent}% advance secures the confirmed services; the remaining payment schedule will be shared before booking.`,
    "Cancellation and amendment charges depend on the final suppliers selected and will be disclosed before payment.",
  ]);

  doc.ensure(96);
  doc.y += 10;
  const closingTop = doc.y;
  doc.roundedRect(MARGIN, closingTop, CONTENT_WIDTH, 84, C.primary, 12);
  doc.roundedRect(MARGIN, closingTop, 4, 84, C.gold, 2);
  doc.textAt("LET'S MAKE THIS JOURNEY YOURS", {
    x: MARGIN + 18,
    y: closingTop + 16,
    size: 7.5,
    bold: true,
    color: C.gold,
    charSpacing: 0.85,
  });
  doc.textAt("Speak with your Bandhan Tours travel designer", {
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

  repaintContinuationChrome(doc, {
    eyebrow: "Personalised trip brochure",
    reference: booking.quotation_number,
    label: "Brochure",
  });
  return doc.save();
}
