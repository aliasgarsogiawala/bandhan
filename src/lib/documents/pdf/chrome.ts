import { BRAND, COMPANY } from "@/lib/email/company";
import { drawImageCover, loadProposalImage } from "./images";
import {
  CONTENT_WIDTH,
  MARGIN,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  PdfDoc,
  hex,
  type TextOptions,
} from "./layout";

/** Shared brand palette for every customer-facing PDF. */
export const C = {
  primary: hex(BRAND.primary),
  primaryLight: hex(BRAND.primaryLight),
  accent: hex(BRAND.accent),
  accentDark: hex(BRAND.accentDark),
  gold: hex(BRAND.gold),
  goldDark: hex(BRAND.goldDark),
  sand: hex(BRAND.sand),
  sandBg: hex(BRAND.sandBg),
  muted: hex(BRAND.muted),
  light: hex(BRAND.light),
  border: hex(BRAND.border),
  white: hex(BRAND.white),
  foreground: hex(BRAND.foreground),
  green: hex("#13795B"),
  greenLight: hex("#EAF7F2"),
};

export const FOOTER_HEIGHT = 50;
export const FOOTER_TOP = PAGE_HEIGHT - FOOTER_HEIGHT;
export const HEADER_HEIGHT = 54;

/** Compact brand lockup for covers and continuation pages. */
export function drawBrandMark(
  doc: PdfDoc,
  options: { x?: number; y?: number; dark?: boolean; width?: number } = {}
) {
  const x = options.x ?? MARGIN;
  const y = options.y ?? 14;
  const dark = options.dark ?? false;
  const width = options.width ?? (dark ? 104 : 86);
  const height = width * (212 / 584);

  if (doc.brandLogo) {
    if (!dark) doc.rect(x - 6, y - 3, width + 12, height + 6, C.primary);
    doc.page.drawImage(doc.brandLogo, {
      x,
      y: PAGE_HEIGHT - y - height,
      width,
      height,
    });
    return;
  }

  doc.textAt(COMPANY.name, {
    x,
    y: y + 4,
    size: 12,
    bold: true,
    color: dark ? C.white : C.primary,
    family: "serif",
  });
}

/** Quiet editorial masthead used on continuation pages. */
export function drawDocHeader(
  doc: PdfDoc,
  options: { eyebrow: string; reference: string }
) {
  doc.rect(0, 0, PAGE_WIDTH, HEADER_HEIGHT, C.white);
  doc.rule(HEADER_HEIGHT - 1, C.border, MARGIN, CONTENT_WIDTH, 0.7);
  drawBrandMark(doc, { y: 11 });
  doc.textAt(options.eyebrow.toUpperCase(), {
    x: MARGIN,
    y: 14,
    width: CONTENT_WIDTH,
    align: "right",
    size: 7,
    bold: true,
    color: C.goldDark,
    charSpacing: 0.85,
  });
  doc.textAt(options.reference, {
    x: MARGIN,
    y: 30,
    width: CONTENT_WIDTH,
    align: "right",
    size: 8,
    bold: true,
    color: C.muted,
  });
  doc.y = HEADER_HEIGHT + 22;
}

/** Minimal footer; the content, not a heavy colour band, closes each page. */
export function drawDocFooter(doc: PdfDoc, pageIndex: number, label?: string) {
  doc.rect(0, FOOTER_TOP, PAGE_WIDTH, FOOTER_HEIGHT, C.white);
  doc.rule(FOOTER_TOP, C.border, MARGIN, CONTENT_WIDTH, 0.7);
  drawBrandMark(doc, { y: FOOTER_TOP + 7, width: 60 });
  doc.textAt(`${COMPANY.phoneLabel}  ·  ${COMPANY.email}  ·  ${COMPANY.website}`, {
    x: MARGIN + 80,
    y: FOOTER_TOP + 17,
    size: 5.8,
    color: C.muted,
  });
  doc.textAt(label ? `${label}  ·  ${pageIndex + 1}` : `Page ${pageIndex + 1}`, {
    x: MARGIN,
    y: FOOTER_TOP + 14,
    width: CONTENT_WIDTH,
    align: "right",
    size: 7,
    bold: true,
    color: C.goldDark,
  });
}

/** Repaints continuation chrome last so later photo/content streams cannot obscure it. */
export function repaintContinuationChrome(
  doc: PdfDoc,
  options: { eyebrow: string; reference: string; label: string; startPage?: number }
) {
  const originalPage = doc.page;
  const originalY = doc.y;
  doc.doc.getPages().forEach((page, pageIndex) => {
    if (pageIndex < (options.startPage ?? 1)) return;
    doc.page = page;
    drawDocHeader(doc, { eyebrow: options.eyebrow, reference: options.reference });
    drawDocFooter(doc, pageIndex, options.label);
  });
  doc.page = originalPage;
  doc.y = originalY;
}

/** Section eyebrow + title with optional right-side note. */
export function sectionHeading(
  doc: PdfDoc,
  eyebrow: string,
  title: string,
  note?: string
) {
  doc.ensure(note ? 52 : 44);
  doc.textAt(eyebrow.toUpperCase(), {
    y: doc.y,
    size: 6.5,
    bold: true,
    color: C.goldDark,
    charSpacing: 1.05,
  });
  doc.y += 13;
  doc.textAt(title, { y: doc.y, size: 18, bold: false, family: "serif", color: C.primary });
  if (note) {
    doc.textAt(note, {
      y: doc.y + 3,
      width: CONTENT_WIDTH,
      align: "right",
      size: 7.5,
      color: C.muted,
    });
  }
  doc.y += 25;
  doc.rule(doc.y, C.border, MARGIN, CONTENT_WIDTH, 0.6);
  doc.y += 14;
}

/** Soft pill / chip used for meals, overnight, status tags. */
export function drawChip(
  doc: PdfDoc,
  label: string,
  x: number,
  y: number,
  options?: { bg?: ReturnType<typeof hex>; fg?: ReturnType<typeof hex>; maxWidth?: number }
) {
  const bg = options?.bg ?? C.sand;
  const fg = options?.fg ?? C.primary;
  const maxWidth = options?.maxWidth ?? 180;
  const padX = 9;
  const size = 7;
  const text = label.length > 42 ? `${label.slice(0, 40)}…` : label;
  const textWidth = Math.min(maxWidth - padX * 2, doc.measure(text, size, true));
  const width = textWidth + padX * 2;
  const height = 18;
  doc.rect(x, y, width, height, bg);
  doc.textAt(text, {
    x: x + padX,
    y: y + 5,
    size,
    bold: true,
    color: fg,
  });
  return { width, height };
}

/** Label above a bold value — used in meta grids. */
export function labelValue(
  doc: PdfDoc,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  options?: { dark?: boolean; valueSize?: number; valueLines?: number }
) {
  const dark = options?.dark ?? false;
  const valueSize = options?.valueSize ?? 9;
  doc.textAt(label.toUpperCase(), {
    x,
    y,
    width,
    size: 6.2,
    bold: true,
    color: dark ? C.gold : C.muted,
    charSpacing: 0.55,
  });
  const lines = doc.wrap(value || "To be confirmed", width, valueSize, true);
  lines.slice(0, options?.valueLines ?? 2).forEach((line, index) => {
    doc.textAt(line, {
      x,
      y: y + 13 + index * (valueSize + 2.5),
      width,
      size: valueSize,
      bold: true,
      color: dark ? C.white : C.primary,
    });
  });
}

/** Accent bullet list with comfortable spacing. */
export function bullets(
  doc: PdfDoc,
  values: string[],
  options?: { size?: number; gap?: number }
) {
  const size = options?.size ?? 8.4;
  const gap = options?.gap ?? 5;
  for (const value of values) {
    const lines = doc.wrap(value, CONTENT_WIDTH - 18, size);
    doc.ensure(lines.length * (size + 3.5) + gap);
    doc.rect(MARGIN + 1, doc.y + 3, 4, 4, C.accent);
    for (const line of lines) {
      doc.textAt(line, {
        x: MARGIN + 16,
        y: doc.y,
        size,
        color: C.foreground,
      });
      doc.y += size + 3.5;
    }
    doc.y += gap;
  }
}

/** Two-column inclusion / exclusion blocks. */
export function splitLists(
  doc: PdfDoc,
  leftTitle: string,
  leftItems: string[],
  rightTitle: string,
  rightItems: string[]
) {
  const colGap = 14;
  const colWidth = (CONTENT_WIDTH - colGap) / 2;
  const rowHeight = (items: string[]) => {
    let h = 28;
    for (const item of items) {
      h += doc.wrap(item, colWidth - 22, 7.8).length * 11 + 6;
    }
    return Math.max(h, 56);
  };
  const height = Math.max(rowHeight(leftItems), rowHeight(rightItems));
  doc.ensure(height + 8);

  const paintColumn = (
    title: string,
    items: string[],
    x: number,
    accent: ReturnType<typeof hex>
  ) => {
    doc.rect(x, doc.y, colWidth, height, C.sand);
    doc.rect(x, doc.y, 3.5, height, accent);
    doc.textAt(title.toUpperCase(), {
      x: x + 14,
      y: doc.y + 12,
      size: 6.5,
      bold: true,
      color: accent,
      charSpacing: 0.8,
    });
    let textY = doc.y + 30;
    for (const item of items) {
      const lines = doc.wrap(item, colWidth - 28, 7.8);
      doc.rect(x + 14, textY + 2.5, 3.5, 3.5, accent);
      for (const line of lines) {
        doc.textAt(line, {
          x: x + 24,
          y: textY,
          width: colWidth - 34,
          size: 7.8,
          color: C.foreground,
        });
        textY += 11;
      }
      textY += 6;
    }
  };

  paintColumn(leftTitle, leftItems, MARGIN, C.green);
  paintColumn(rightTitle, rightItems, MARGIN + colWidth + colGap, C.accent);
  doc.y += height + 12;
}

/**
 * One day of an itinerary: numbered badge, timeline spine, title, description,
 * meal/overnight chips and an optional photograph. Shared by the personalised
 * booking brochure and the package brochure so both read identically.
 */
export function drawItineraryDay(
  doc: PdfDoc,
  item: {
    day: number;
    title: string;
    description: string;
    meals?: string;
    stay?: string;
  },
  options: {
    isLast: boolean;
    totalDays: number;
    image?: Awaited<ReturnType<typeof loadProposalImage>>;
  }
) {
  const dayLabel = `DAY ${item.day}`;
  const imageWidth = options.image ? 116 : 0;
  const textWidth = CONTENT_WIDTH - 64 - (imageWidth ? imageWidth + 18 : 0);
  const titleLines = doc.wrap(item.title, textWidth, 12, false, "serif").slice(0, 2);
  const description = (item.description || "").trim();
  const descLines = description
    ? doc.wrap(description, textWidth, 8.2).slice(0, 5)
    : [];
  const meals = (item.meals || "").trim();
  const stay = (item.stay || "").trim();
  const showMeals = meals && meals !== "—" && meals.toLowerCase() !== "none";
  const showStay = stay && stay !== "—";
  const chipRow = showMeals || showStay;

  const textHeight = 22 + titleLines.length * 15 + (descLines.length ? 7 + descLines.length * 11.5 : 4) + (chipRow ? 27 : 10);
  const cardHeight = Math.max(options.image ? 104 : 0, textHeight);

  doc.ensure(cardHeight + 18);

  const top = doc.y;
  const badgeSize = 40;
  const cardX = MARGIN + 58;
  const cardW = CONTENT_WIDTH - 58;

  // Timeline spine
  if (!options.isLast) {
    doc.rect(MARGIN + 19.5, top + badgeSize, 1, cardHeight - badgeSize + 16, C.border);
  }

  // Day badge
  doc.strokeRect(MARGIN, top, badgeSize, badgeSize, C.goldDark, 0.8);
  doc.textAt(String(item.day).padStart(2, "0"), {
    x: MARGIN,
    y: top + 12,
    width: badgeSize,
    align: "center",
    size: 15,
    family: "serif",
    color: C.primary,
  });

  doc.rule(top, C.border, cardX, cardW, 0.6);

  doc.textAt(dayLabel, {
    x: cardX + 14,
    y: top + 10,
    size: 6.5,
    bold: true,
    color: C.goldDark,
    charSpacing: 0.9,
  });
  doc.textAt(`${item.day} / ${options.totalDays}`, {
    x: cardX + 14,
    y: top + 10,
    width: cardW - 28,
    align: "right",
    size: 6.5,
    bold: true,
    color: C.muted,
  });

  let textY = top + 24;
  for (const line of titleLines) {
    doc.textAt(line, {
      x: cardX,
      y: textY,
      width: textWidth,
      size: 12,
      family: "serif",
      color: C.primary,
    });
    textY += 14;
  }

  if (descLines.length) {
    textY += 4;
    for (const line of descLines) {
      doc.textAt(line, {
        x: cardX,
        y: textY,
        width: textWidth,
        size: 8.2,
        color: C.muted,
      });
      textY += 12;
    }
  }

  if (chipRow) {
    textY += 8;
    let chipX = cardX;
    if (showMeals) {
      const chip = drawChip(doc, `Meals · ${meals}`, chipX, textY, {
        bg: C.sand,
        fg: C.primary,
        maxWidth: cardW / 2 - 20,
      });
      chipX += chip.width + 8;
    }
    if (showStay) {
      drawChip(doc, `Overnight · ${stay}`, chipX, textY, {
        bg: C.sand,
        fg: C.goldDark,
        maxWidth: cardW / 2 - 20,
      });
    }
  }

  if (options.image) {
    drawImageCover(doc, options.image, MARGIN + CONTENT_WIDTH - imageWidth, top + 8, imageWidth, 88);
  }

  doc.y = top + cardHeight + 14;
}

export type { TextOptions };
