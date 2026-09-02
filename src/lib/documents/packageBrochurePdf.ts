import type { FullPackage } from "@/data/packageDetails";
import { COMPANY } from "@/lib/email/company";
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

const EYEBROW = "Holiday brochure";

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
  drawBrochureCover(doc, {
    image: images[0] || null,
    reference: `${pkg.category || "Journey"}  /  ${pkg.duration || "Tailor-made holiday"}`,
    title: pkg.title,
    tagline: pkg.tagline,
    meta: [
      ["Duration", pkg.duration || "To be confirmed"],
      ["Starting from", `${pkg.price} per person`],
      ["Best time", pkg.bestTime || "Year-round"],
      ["Starts from", pkg.startingPoint || "To be confirmed"],
      ["Group size", pkg.groupSize || "2+ guests"],
      ["Category", pkg.category || "Journey"],
    ],
  });

  // ── The journey ────────────────────────────────────────────────────────
  doc.addPage();
  sectionHeading(doc, "About this trip", pkg.destination || pkg.title);
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
    sectionHeading(doc, "Highlights", "What you will see");
    pkg.highlights.forEach((highlight, index) => {
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
      "Day by day",
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
        image: undefined,
      });
    });
  }

  // ── Price ──────────────────────────────────────────────────────────────
  // The published starting rate only — a costed quotation needs dates, party
  // size and room plan, which arrive with a booking.
  if (itinerary.length) doc.addPage();
  doc.ensure(112);
  doc.y += 6;
  sectionHeading(doc, "From price", "Package price", "All amounts in INR");
  const priceTop = doc.y;
  doc.rect(MARGIN, priceTop, CONTENT_WIDTH, 92, C.primary);
  doc.rect(MARGIN, priceTop, 4, 92, C.gold);
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
    sectionHeading(doc, "Price details", "What is included");
    splitLists(
      doc,
      "Inclusions",
      pkg.inclusions?.length ? pkg.inclusions : ["Confirmed with your consultant"],
      "Exclusions",
      pkg.exclusions?.length ? pkg.exclusions : ["Anything not listed as included"]
    );
  }

  // ── Next steps ─────────────────────────────────────────────────────────
  // Booking instructions close the brochure on a deliberate, image-led page.
  doc.addPage();
  sectionHeading(doc, "Planning your holiday", "How to book");
  bullets(doc, [
    "Tell us your preferred travel dates and how many are travelling.",
    "We confirm the hotel category, room plan, transport and sightseeing for your dates.",
    "You receive a written quotation showing the final services, price and payment schedule.",
    "Your consultant verifies live availability before any payment is requested.",
  ]);

  doc.ensure(96);
  doc.y += 10;
  const closingTop = doc.y;
  doc.rect(MARGIN, closingTop, CONTENT_WIDTH, 84, C.primary);
  doc.rect(MARGIN, closingTop, 4, 84, C.gold);
  doc.textAt("Interested in this trip?", {
    x: MARGIN + 18,
    y: closingTop + 16,
    size: 8,
    bold: true,
    color: C.gold,
  });
  doc.textAt("Call or write to our reservations team", {
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

  if (images[1] || images[0]) {
    const imageTop = closingTop + 104;
    drawImageCover(doc, images[1] || images[0], MARGIN, imageTop, CONTENT_WIDTH, 230);
    doc.rect(MARGIN, imageTop + 204, CONTENT_WIDTH, 26, C.primary, 0.72);
    doc.textAt(gallery[1]?.caption || pkg.title, {
      x: MARGIN + 12,
      y: imageTop + 213,
      width: CONTENT_WIDTH - 24,
      size: 6.5,
      color: C.white,
    });
  }

  repaintContinuationChrome(doc, { eyebrow: EYEBROW, reference: pkg.title, label: "Brochure" });
  return doc.save();
}
