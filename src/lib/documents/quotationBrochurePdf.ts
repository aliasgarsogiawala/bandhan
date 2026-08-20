import type { PDFImage } from "pdf-lib";
import type { Booking } from "@/lib/bookings/types";
import { formatMoney } from "@/lib/bookings/pricing";
import { BRAND, COMPANY } from "@/lib/email/company";
import {
  bookedByLabel,
  formatProposalDate,
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
};

const FOOTER_TOP = PAGE_HEIGHT - 54;

async function loadImage(doc: PdfDoc, url?: string): Promise<PDFImage | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    const type = response.headers.get("content-type") || "";
    if (type.includes("png")) return await doc.doc.embedPng(bytes);
    return await doc.doc.embedJpg(bytes);
  } catch {
    return null;
  }
}

function footer(doc: PdfDoc, pageIndex: number) {
  doc.rect(0, FOOTER_TOP, PAGE_WIDTH, PAGE_HEIGHT - FOOTER_TOP, C.primary);
  doc.textAt(COMPANY.name, {
    x: MARGIN,
    y: FOOTER_TOP + 12,
    size: 8,
    bold: true,
    color: C.white,
  });
  doc.textAt(`${COMPANY.phoneLabel}  |  ${COMPANY.email}  |  ${COMPANY.website}`, {
    x: MARGIN,
    y: FOOTER_TOP + 27,
    size: 7,
    color: C.gold,
  });
  doc.textAt(`Page ${pageIndex + 1}`, {
    x: MARGIN,
    y: FOOTER_TOP + 12,
    width: CONTENT_WIDTH,
    align: "right",
    size: 7,
    color: C.light,
  });
}

function header(doc: PdfDoc, booking: Booking) {
  doc.rect(0, 0, PAGE_WIDTH, 52, C.primary);
  doc.rect(0, 52, PAGE_WIDTH, 3, C.gold);
  doc.textAt(COMPANY.name, {
    x: MARGIN,
    y: 16,
    size: 13,
    bold: true,
    color: C.white,
  });
  doc.textAt("TRIP PROPOSAL & QUOTATION", {
    x: MARGIN,
    y: 15,
    width: CONTENT_WIDTH,
    align: "right",
    size: 8,
    bold: true,
    color: C.gold,
    charSpacing: 0.8,
  });
  doc.textAt(booking.quotation_number, {
    x: MARGIN,
    y: 30,
    width: CONTENT_WIDTH,
    align: "right",
    size: 8,
    bold: true,
    color: C.white,
  });
  doc.y = 76;
}

function section(doc: PdfDoc, eyebrow: string, title: string) {
  doc.ensure(38);
  doc.textAt(eyebrow.toUpperCase(), {
    y: doc.y,
    size: 6.5,
    bold: true,
    color: C.accent,
    charSpacing: 1,
  });
  doc.y += 12;
  doc.textAt(title, { y: doc.y, size: 15, bold: true, color: C.primary });
  doc.y += 23;
  doc.rule(doc.y, C.border);
  doc.y += 12;
}

function bullets(doc: PdfDoc, values: string[]) {
  for (const value of values) {
    const lines = doc.wrap(value, CONTENT_WIDTH - 16, 8.5);
    doc.ensure(lines.length * 13 + 6);
    doc.textAt("•", { x: MARGIN, y: doc.y, size: 9, color: C.accent });
    for (const line of lines) {
      doc.textAt(line, { x: MARGIN + 14, y: doc.y, size: 8.5, color: C.foreground });
      doc.y += 13;
    }
    doc.y += 4;
  }
}

function labelValue(doc: PdfDoc, label: string, value: string, x: number, y: number, width: number) {
  doc.textAt(label.toUpperCase(), {
    x,
    y,
    width,
    size: 6.5,
    bold: true,
    color: C.light,
    charSpacing: 0.5,
  });
  doc.textAt(value || "To be confirmed", {
    x,
    y: y + 12,
    width,
    size: 9,
    bold: true,
    color: C.primary,
  });
}

function coverLabelValue(
  doc: PdfDoc,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number
) {
  doc.textAt(label.toUpperCase(), {
    x,
    y,
    width,
    size: 6.5,
    bold: true,
    color: C.gold,
    charSpacing: 0.5,
  });
  doc.textAt(value || "To be confirmed", {
    x,
    y: y + 12,
    width,
    size: 9,
    bold: true,
    color: C.white,
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
  const mix = travellerMix(booking);
  const names = travellerNames(booking);
  const totalTravellers = totalTravellersForBooking(booking);
  const doc = await PdfDoc.create();
  doc.contentBottom = FOOTER_TOP - 16;

  // Cover page
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, C.primary);
  const coverImage = await loadImage(doc, snapshot.heroImage);
  if (coverImage) {
    const targetWidth = PAGE_WIDTH;
    const targetHeight = 330;
    const scale = Math.max(targetWidth / coverImage.width, targetHeight / coverImage.height);
    const width = coverImage.width * scale;
    const height = coverImage.height * scale;
    doc.page.drawImage(coverImage, {
      x: (PAGE_WIDTH - width) / 2,
      y: PAGE_HEIGHT - targetHeight,
      width,
      height,
      opacity: 0.78,
    });
    doc.rect(0, 270, PAGE_WIDTH, 90, C.primary, 0.72);
  } else {
    doc.rect(0, 0, PAGE_WIDTH, 320, C.primaryLight);
    doc.rect(0, 314, PAGE_WIDTH, 6, C.gold);
  }

  doc.textAt("PERSONALISED TRAVEL PROPOSAL", {
    x: MARGIN,
    y: 365,
    size: 8,
    bold: true,
    color: C.gold,
    charSpacing: 1.4,
  });
  const coverTitle = doc.wrap(snapshot.title, CONTENT_WIDTH, 27, true);
  let coverY = 387;
  for (const line of coverTitle.slice(0, 3)) {
    doc.textAt(line, { x: MARGIN, y: coverY, size: 27, bold: true, color: C.white });
    coverY += 35;
  }
  if (snapshot.tagline) {
    coverY += 4;
    for (const line of doc.wrap(snapshot.tagline, CONTENT_WIDTH - 50, 10).slice(0, 3)) {
      doc.textAt(line, { x: MARGIN, y: coverY, size: 10, color: C.light });
      coverY += 16;
    }
  }

  const boxTop = Math.max(555, coverY + 24);
  doc.rect(MARGIN, boxTop, CONTENT_WIDTH, 108, C.white, 0.08);
  doc.strokeRect(MARGIN, boxTop, CONTENT_WIDTH, 108, C.gold, 0.8);
  const colWidth = (CONTENT_WIDTH - 36) / 3;
  coverLabelValue(doc, "Prepared for", booking.contact_name, MARGIN + 14, boxTop + 18, colWidth);
  coverLabelValue(doc, "Travel date", formatProposalDate(booking.travel_date), MARGIN + 14 + colWidth + 10, boxTop + 18, colWidth);
  coverLabelValue(doc, "Travellers", String(totalTravellers), MARGIN + 14 + (colWidth + 10) * 2, boxTop + 18, colWidth);
  // On a trip arranged by someone else, the quotation cell also credits the
  // booker so the traveller knows who this proposal came from.
  coverLabelValue(
    doc,
    booking.booker_name ? "Trip ref · booked by" : "Trip reference",
    booking.booker_name
      ? `${booking.booking_code} · ${booking.booker_name}`
      : booking.booking_code,
    MARGIN + 14,
    boxTop + 61,
    colWidth
  );
  coverLabelValue(doc, "Duration", snapshot.duration || booking.duration_label || "Custom", MARGIN + 14 + colWidth + 10, boxTop + 61, colWidth);
  coverLabelValue(doc, "Indicative total", formatMoney(quote.total), MARGIN + 14 + (colWidth + 10) * 2, boxTop + 61, colWidth);

  doc.textAt(COMPANY.name, {
    x: MARGIN,
    y: PAGE_HEIGHT - 54,
    size: 12,
    bold: true,
    color: C.white,
  });
  doc.textAt(COMPANY.tagline.toUpperCase(), {
    x: MARGIN,
    y: PAGE_HEIGHT - 37,
    size: 7,
    bold: true,
    color: C.gold,
    charSpacing: 1,
  });
  doc.textAt(`${COMPANY.phoneLabel}  |  ${COMPANY.email}`, {
    x: MARGIN,
    y: PAGE_HEIGHT - 50,
    width: CONTENT_WIDTH,
    align: "right",
    size: 7.5,
    color: C.light,
  });

  // All continuation pages share document chrome.
  doc.onNewPage = (current, pageIndex) => {
    header(current, booking);
    footer(current, pageIndex);
  };
  doc.addPage();

  section(doc, "Your journey", "A thoughtfully planned holiday");
  if (snapshot.overview) {
    doc.paragraph(snapshot.overview, {
      size: 9,
      lineHeight: 14,
      color: C.foreground,
      spaceAfter: 18,
    });
  } else {
    doc.paragraph(
      `This proposal has been prepared around your preferred dates, travelling party and requirements for ${snapshot.destination}. Your travel consultant will verify final hotel and transport availability before confirmation.`,
      { size: 9, lineHeight: 14, color: C.foreground, spaceAfter: 18 }
    );
  }

  const details: Array<[string, string]> = [
    ["Destination", snapshot.destination],
    ["Starts from", booking.departure_city || snapshot.startingPoint || "To be confirmed"],
    ["Best time", snapshot.bestTime || "Year-round"],
    ["Group size", snapshot.groupSize || `${totalTravellers} guests`],
  ];
  const detailWidth = (CONTENT_WIDTH - 18) / 2;
  for (let index = 0; index < details.length; index += 2) {
    doc.ensure(55);
    const y = doc.y;
    labelValue(doc, details[index][0], details[index][1], MARGIN, y, detailWidth);
    if (details[index + 1]) {
      labelValue(
        doc,
        details[index + 1][0],
        details[index + 1][1],
        MARGIN + detailWidth + 18,
        y,
        detailWidth
      );
    }
    doc.y += 48;
  }

  doc.y += 8;
  doc.ensure(215);
  section(doc, "Designed for your party", "Travellers, names and rooms");
  const mixGap = 7;
  const mixWidth = (CONTENT_WIDTH - mixGap * 3) / 4;
  mix.forEach((item, index) => {
    const x = MARGIN + index * (mixWidth + mixGap);
    doc.rect(x, doc.y, mixWidth, 55, item.count ? C.primary : C.sand);
    doc.textAt(String(item.count), {
      x: x + 10,
      y: doc.y + 9,
      size: 17,
      bold: true,
      color: item.count ? C.gold : C.light,
    });
    doc.textAt(item.shortLabel.toUpperCase(), {
      x: x + 10,
      y: doc.y + 33,
      width: mixWidth - 18,
      size: 6,
      bold: true,
      color: item.count ? C.white : C.muted,
      charSpacing: 0.3,
    });
    doc.textAt(item.note, {
      x: x + 10,
      y: doc.y + 44,
      width: mixWidth - 18,
      size: 5.6,
      color: item.count ? C.light : C.muted,
    });
  });
  doc.y += 65;

  doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 34, C.sand);
  doc.textAt("ROOM PLAN", {
    x: MARGIN + 12,
    y: doc.y + 10,
    size: 6.3,
    bold: true,
    color: C.accent,
    charSpacing: 0.7,
  });
  doc.textAt(roomSummary(booking), {
    x: MARGIN + 88,
    y: doc.y + 9,
    width: CONTENT_WIDTH - 100,
    size: 8.3,
    bold: true,
    color: C.primary,
  });
  doc.y += 45;

  const partyWidth = (CONTENT_WIDTH - 10) / 2;
  doc.rect(MARGIN, doc.y, partyWidth, 47, C.primary);
  coverLabelValue(doc, "Lead traveller", booking.contact_name, MARGIN + 12, doc.y + 9, partyWidth - 24);
  doc.rect(MARGIN + partyWidth + 10, doc.y, partyWidth, 47, C.primaryLight);
  coverLabelValue(doc, "Booked by", bookedByLabel(booking), MARGIN + partyWidth + 22, doc.y + 9, partyWidth - 24);
  doc.y += 58;

  if (names.names.length) {
    doc.textAt("TRAVELLER NAMES", {
      y: doc.y,
      size: 6.3,
      bold: true,
      color: C.accent,
      charSpacing: 0.75,
    });
    doc.y += 14;
    for (const [index, name] of names.names.entries()) {
      doc.ensure(23);
      doc.textAt(`${String(index + 1).padStart(2, "0")}  ${name}`, {
        y: doc.y,
        width: CONTENT_WIDTH,
        size: 8,
        bold: true,
        color: C.primary,
      });
      doc.y += 16;
      doc.rule(doc.y, C.border);
      doc.y += 6;
    }
  }
  if (names.pendingCount) {
    doc.textAt(`${names.pendingCount} additional traveller name${names.pendingCount === 1 ? "" : "s"} can be added before ticketing.`, {
      y: doc.y,
      size: 7.2,
      color: C.muted,
    });
    doc.y += 20;
  }

  if (snapshot.highlights?.length) {
    doc.y += 8;
    section(doc, "Signature moments", "Highlights of your route");
    bullets(doc, snapshot.highlights);
  }

  if (snapshot.itinerary?.length) {
    doc.y += 10;
    section(doc, "Day by day", "Your proposed itinerary");
    for (const item of snapshot.itinerary) {
      const descriptionLines = doc.wrap(item.description || "", CONTENT_WIDTH - 74, 8.2);
      const height = 43 + descriptionLines.length * 12 + (item.meals || item.stay ? 19 : 0);
      doc.ensure(height + 12);
      const top = doc.y;
      doc.rect(MARGIN, top, 48, 48, C.primary);
      doc.textAt(String(item.day).padStart(2, "0"), {
        x: MARGIN,
        y: top + 12,
        width: 48,
        align: "center",
        size: 15,
        bold: true,
        color: C.gold,
      });
      doc.textAt(`DAY ${item.day}`, {
        x: MARGIN + 62,
        y: top,
        size: 6.5,
        bold: true,
        color: C.accent,
        charSpacing: 0.8,
      });
      doc.textAt(item.title, {
        x: MARGIN + 62,
        y: top + 12,
        width: CONTENT_WIDTH - 62,
        size: 10,
        bold: true,
        color: C.primary,
      });
      let textY = top + 30;
      for (const line of descriptionLines) {
        doc.textAt(line, {
          x: MARGIN + 62,
          y: textY,
          width: CONTENT_WIDTH - 62,
          size: 8.2,
          color: C.muted,
        });
        textY += 12;
      }
      const meta = [
        item.meals ? `Meals: ${item.meals}` : "",
        item.stay ? `Overnight: ${item.stay}` : "",
      ]
        .filter(Boolean)
        .join("   |   ");
      if (meta) {
        doc.textAt(meta, {
          x: MARGIN + 62,
          y: textY + 2,
          size: 7.5,
          bold: true,
          color: C.primary,
        });
      }
      doc.y = top + height;
      doc.rule(doc.y, C.border);
      doc.y += 12;
    }
  }

  doc.y += 8;
  section(doc, "Transparent pricing", "Your indicative quotation");
  for (const item of quote.lineItems) {
    doc.ensure(27);
    doc.textAt(item.label, { y: doc.y + 4, size: 8.5, color: C.foreground });
    doc.textAt(`${item.quantity} x ${formatMoney(item.unitPrice)}`, {
      y: doc.y + 4,
      width: CONTENT_WIDTH - 100,
      align: "right",
      size: 7.5,
      color: C.muted,
    });
    doc.textAt(formatMoney(item.amount), {
      y: doc.y + 4,
      width: CONTENT_WIDTH,
      align: "right",
      size: 8.5,
      bold: true,
      color: C.primary,
    });
    doc.y += 22;
    doc.rule(doc.y, C.border);
    doc.y += 4;
  }
  doc.ensure(104);
  doc.rect(MARGIN, doc.y + 4, CONTENT_WIDTH, 92, C.sand);
  const priceTop = doc.y + 18;
  doc.textAt("TOTAL PACKAGE ESTIMATE", {
    x: MARGIN + 15,
    y: priceTop,
    size: 8,
    bold: true,
    color: C.muted,
  });
  doc.textAt(formatMoney(quote.total), {
    x: MARGIN + 15,
    y: priceTop + 15,
    size: 20,
    bold: true,
    color: C.primary,
  });
  doc.textAt(`${quote.depositPercent}% booking advance`, {
    x: MARGIN + 260,
    y: priceTop,
    size: 8,
    color: C.muted,
  });
  doc.textAt(formatMoney(quote.depositAmount), {
    x: MARGIN + 260,
    y: priceTop + 15,
    size: 14,
    bold: true,
    color: C.accent,
  });
  doc.textAt(
    `Indicative quotation valid for ${quote.validityDays} days. Final price is confirmed after hotel, transport and departure availability verification.`,
    { x: MARGIN + 15, y: priceTop + 51, width: CONTENT_WIDTH - 30, size: 7, color: C.muted }
  );
  doc.y += 112;

  if (snapshot.inclusions?.length || snapshot.exclusions?.length) {
    section(doc, "The fine print upfront", "Included and not included");
    if (snapshot.inclusions?.length) {
      doc.textAt("INCLUSIONS", { y: doc.y, size: 7, bold: true, color: C.accent, charSpacing: 0.8 });
      doc.y += 15;
      bullets(doc, snapshot.inclusions);
      doc.y += 8;
    }
    if (snapshot.exclusions?.length) {
      doc.textAt("EXCLUSIONS", { y: doc.y, size: 7, bold: true, color: C.accent, charSpacing: 0.8 });
      doc.y += 15;
      bullets(doc, snapshot.exclusions);
    }
  }

  if (booking.special_requirements) {
    doc.y += 10;
    section(doc, "Your preferences", "Special requests noted");
    doc.paragraph(booking.special_requirements, {
      size: 8.5,
      lineHeight: 13,
      color: C.foreground,
      spaceAfter: 12,
    });
  }

  doc.y += 10;
  doc.ensure(155);
  section(doc, "Next steps", "Ready when you are");
  bullets(doc, [
    "Review this proposal and share any changes to dates, hotels, room configuration or pace.",
    "Your travel consultant will verify live availability and issue the final confirmation.",
    `A ${quote.depositPercent}% advance secures the confirmed services; the remaining payment schedule will be shared before booking.`,
    "Cancellation and amendment charges depend on the final suppliers selected and will be disclosed before payment.",
  ]);

  doc.y += 18;
  doc.ensure(92);
  const closingTop = doc.y;
  doc.rect(MARGIN, closingTop, CONTENT_WIDTH, 78, C.primary);
  doc.rect(MARGIN, closingTop, 4, 78, C.gold);
  doc.textAt("LET'S MAKE THIS JOURNEY YOURS", {
    x: MARGIN + 18,
    y: closingTop + 15,
    size: 8,
    bold: true,
    color: C.gold,
    charSpacing: 0.8,
  });
  doc.textAt("Speak with your Bandhan Tours travel designer", {
    x: MARGIN + 18,
    y: closingTop + 31,
    size: 12,
    bold: true,
    color: C.white,
  });
  doc.textAt(`${COMPANY.phoneLabel}  |  ${COMPANY.email}`, {
    x: MARGIN + 18,
    y: closingTop + 51,
    size: 8,
    color: C.light,
  });

  return doc.save();
}
