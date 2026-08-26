import type { FullPackage } from "@/data/packageDetails";
import { COMPANY } from "@/lib/email/company";
import { CONTENT_WIDTH, MARGIN, PAGE_HEIGHT, PAGE_WIDTH, PdfDoc } from "./pdf/layout";
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

/**
 * The catalogue brochure for a published trip.
 *
 * This is the document anyone can download from a package page — it describes
 * the journey itself and quotes the published starting price. It deliberately
 * carries no traveller name, no party size and no quotation figures: a
 * *personalised* brochure is produced only once someone plans a trip through
 * the booking engine, where those details actually exist. See
 * `quotationBrochurePdf.ts` for that one.
 */

const EYEBROW = "Trip brochure";

function slug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export function packageBrochureFileName(pkg: FullPackage): string {
  return `Bandhan-Tours-${slug(pkg.title) || "Trip"}-Brochure.pdf`;
}

function attachChrome(doc: PdfDoc, pkg: FullPackage) {
  doc.contentBottom = FOOTER_TOP - 18;
  doc.onNewPage = (current, pageIndex) => {
    drawDocHeader(current, { eyebrow: EYEBROW, reference: pkg.title });
    drawDocFooter(current, pageIndex, "Brochure");
  };
}

function drawCoverMeta(doc: PdfDoc, rows: Array<[string, string]>, top: number) {
  const height = 118;
  doc.roundedRect(MARGIN, top, CONTENT_WIDTH, height, C.white, 14, 0.98);
  doc.strokeRect(MARGIN, top, CONTENT_WIDTH, height, C.gold, 1);
  const colWidth = (CONTENT_WIDTH - 40) / 3;
  rows.forEach(([label, value], index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    labelValue(doc, label, value, MARGIN + 16 + col * (colWidth + 12), top + 18 + row * 52, colWidth, {
      dark: true,
      valueSize: 9.5,
      valueLines: 2,
    });
  });
}

export async function renderPackageBrochurePdf(pkg: FullPackage): Promise<Uint8Array> {
  const doc = await PdfDoc.create();
  attachChrome(doc, pkg);

  const itinerary = pkg.itinerary || [];
  // Gallery tiles padded in to close the web grid are stand-ins for artwork
  // this trip doesn't have yet — a brochure should not present them as its own.
  const realGallery = (pkg.gallery || []).filter((item) => !item.placeholder);
  const gallery = realGallery.length ? realGallery : pkg.gallery || [];
  const imageSources = [
    ...new Set(
      [pkg.heroImage, ...gallery.map((item) => item.image)].filter(
        (value): value is string => Boolean(value)
      )
    ),
  ];
  const loaded = await Promise.all(imageSources.map((source) => loadProposalImage(doc, source)));
  const images = loaded.filter((image): image is NonNullable<typeof image> => Boolean(image));

  // ── Cover ──────────────────────────────────────────────────────────────
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, C.primary);
  if (images[0]) {
    drawImageCover(doc, images[0], 0, 0, PAGE_WIDTH, PAGE_HEIGHT, 0.92);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, C.primary, 0.34);
    doc.rect(0, 430, PAGE_WIDTH, 412, C.primary, 0.72);
  }

  drawBrandMark(doc, { y: 22, dark: true });
  doc.textAt(`${(pkg.category || "Journey").toUpperCase()}  /  TRIP BROCHURE`, {
    x: MARGIN,
    y: 36,
    width: CONTENT_WIDTH,
    align: "right",
    size: 6.4,
    bold: true,
    color: C.gold,
    charSpacing: 0.8,
  });

  const titleLines = doc.wrap(pkg.title, CONTENT_WIDTH - 30, 30, false, "serif");
  let coverY = 500;
  for (const line of titleLines.slice(0, 3)) {
    doc.textAt(line, { x: MARGIN, y: coverY, size: 30, family: "serif", color: C.white });
    coverY += 34;
  }
  if (pkg.tagline) {
    coverY += 6;
    for (const line of doc.wrap(pkg.tagline, CONTENT_WIDTH - 40, 10).slice(0, 3)) {
      doc.textAt(line, { x: MARGIN, y: coverY, size: 9.5, color: C.white });
      coverY += 15;
    }
  }

  drawCoverMeta(
    doc,
    [
      ["Duration", pkg.duration || "To be confirmed"],
      ["Starting from", `${pkg.price} per person`],
      ["Best time", pkg.bestTime || "Year-round"],
      ["Starts from", pkg.startingPoint || "To be confirmed"],
      ["Group size", pkg.groupSize || "2+ guests"],
      ["Category", pkg.category || "Journey"],
    ],
    Math.min(Math.max(coverY + 22, 650), PAGE_HEIGHT - 170)
  );

  doc.textAt(`${COMPANY.phoneLabel}  /  ${COMPANY.email}  /  ${COMPANY.website}`, {
    x: MARGIN,
    y: PAGE_HEIGHT - 25,
    size: 6.5,
    color: C.white,
  });

  // ── The journey ────────────────────────────────────────────────────────
  doc.addPage();
  sectionHeading(doc, "The journey", "A thoughtfully planned holiday");
  doc.paragraph(
    pkg.overview ||
      pkg.tagline ||
      `${pkg.title} is planned end to end by the Bandhan Tours team. Talk to a travel designer to shape the dates, hotels and pace around you.`,
    { size: 9.2, lineHeight: 14.5, color: C.foreground, spaceAfter: 18 }
  );

  const galleryImages = images.slice(0, 2);
  if (galleryImages.length) {
    const gap = 10;
    const imageWidth = (CONTENT_WIDTH - gap) / 2;
    galleryImages.forEach((image, index) => {
      const x = MARGIN + index * (imageWidth + gap);
      drawImageCover(doc, image, x, doc.y, imageWidth, 168);
      doc.rect(x, doc.y + 148, imageWidth, 20, C.primary, 0.72);
      doc.textAt(gallery[index]?.caption || pkg.title, {
        x: x + 9,
        y: doc.y + 154,
        width: imageWidth - 18,
        size: 6.4,
        color: C.white,
      });
    });
    doc.y += 186;
  }

  if (pkg.highlights?.length) {
    sectionHeading(doc, "Signature moments", "Highlights of the route");
    let chipX = MARGIN;
    let chipY = doc.y;
    for (const highlight of pkg.highlights) {
      const text = highlight.length > 48 ? `${highlight.slice(0, 46)}…` : highlight;
      const width = Math.min(CONTENT_WIDTH, doc.measure(text, 7.5, true) + 22);
      if (chipX + width > MARGIN + CONTENT_WIDTH) {
        chipX = MARGIN;
        chipY += 28;
      }
      doc.ensure(chipY - doc.y + 28);
      doc.rect(chipX, chipY, width, 22, C.primary);
      doc.textAt(text, { x: chipX + 11, y: chipY + 6.5, size: 7.5, bold: true, color: C.white });
      chipX += width + 8;
    }
    doc.y = chipY + 36;
  }

  // ── Itinerary ──────────────────────────────────────────────────────────
  if (itinerary.length) {
    doc.addPage();
    sectionHeading(
      doc,
      "Day by day",
      "The itinerary",
      `${itinerary.length} day${itinerary.length === 1 ? "" : "s"}`
    );

    const uniqueStays = [
      ...new Set(itinerary.map((day) => (day.stay || "").trim()).filter((stay) => stay && stay !== "—")),
    ];
    if (uniqueStays.length) {
      doc.rect(MARGIN, doc.y, CONTENT_WIDTH, 34, C.primary);
      doc.textAt("ROUTE", { x: MARGIN + 12, y: doc.y + 12, size: 6.2, bold: true, color: C.gold, charSpacing: 0.8 });
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
        image: images.length ? images[index % images.length] : undefined,
      });
    });
  }

  // ── Price ──────────────────────────────────────────────────────────────
  // The published starting rate only — a costed quotation needs dates, party
  // size and room plan, which arrive with a booking.
  doc.ensure(112);
  doc.y += 6;
  sectionHeading(doc, "Pricing", "What this trip costs", "All amounts in INR");
  const priceTop = doc.y;
  doc.roundedRect(MARGIN, priceTop, CONTENT_WIDTH, 92, C.primary, 12);
  doc.roundedRect(MARGIN, priceTop, 4, 92, C.gold, 2);
  labelValue(doc, "Starting from", `${pkg.price} per person`, MARGIN + 20, priceTop + 20, 220, {
    dark: true,
    valueSize: 15,
  });
  labelValue(doc, "Duration", pkg.duration || "To be confirmed", MARGIN + 260, priceTop + 20, 130, {
    dark: true,
    valueSize: 11,
  });
  labelValue(doc, "Basis", "Twin sharing", MARGIN + 400, priceTop + 20, 110, {
    dark: true,
    valueSize: 11,
  });
  // `textAt` aligns within `width` but does not wrap, so break the disclaimer
  // into lines ourselves or it runs off the edge of the band.
  const disclaimer =
    "Indicative published rate. Your final price depends on travel dates, hotel category, room configuration and party size, and is confirmed by your travel consultant before any payment.";
  let disclaimerY = priceTop + 60;
  for (const line of doc.wrap(disclaimer, CONTENT_WIDTH - 40, 6.8).slice(0, 2)) {
    doc.textAt(line, { x: MARGIN + 20, y: disclaimerY, width: CONTENT_WIDTH - 40, size: 6.8, color: C.light });
    disclaimerY += 10;
  }
  doc.y = priceTop + 106;

  // ── Inclusions / exclusions ────────────────────────────────────────────
  if (pkg.inclusions?.length || pkg.exclusions?.length) {
    sectionHeading(doc, "The fine print upfront", "Included and not included");
    splitLists(
      doc,
      "Inclusions",
      pkg.inclusions?.length ? pkg.inclusions : ["Confirmed with your consultant"],
      "Exclusions",
      pkg.exclusions?.length ? pkg.exclusions : ["Anything not listed as included"]
    );
  }

  // ── Next steps ─────────────────────────────────────────────────────────
  sectionHeading(doc, "Next steps", "Ready when you are");
  bullets(doc, [
    "Tell us your preferred travel dates and how many are travelling.",
    "We shape the hotels, room plan and pace around you — every day here can be adjusted.",
    "You receive a costed quotation and a personalised brochure made out in your name.",
    "Your consultant verifies live availability before any payment is requested.",
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

  repaintContinuationChrome(doc, { eyebrow: EYEBROW, reference: pkg.title, label: "Brochure" });
  return doc.save();
}
