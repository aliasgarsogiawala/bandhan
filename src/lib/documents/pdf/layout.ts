import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, type PDFImage, type RGB } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

/**
 * Small layout toolkit over pdf-lib: page/cursor management, word wrapping,
 * and the drawing primitives our documents need (bands, rules, tables, chips).
 *
 * pdf-lib gives us a drawing surface but no flow layout, so this wraps it in a
 * top-down cursor model: callers append blocks and the doc breaks pages itself.
 */

/** A4 in PostScript points. */
export const PAGE_WIDTH = 595.28;
export const PAGE_HEIGHT = 841.89;
export const MARGIN = 40;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const FONT_DIR = path.join(process.cwd(), "src", "lib", "documents", "pdf", "fonts");

/**
 * DejaVu Sans covers the Indian Rupee sign (₹) and extended Latin, which the
 * PDF standard fonts (WinAnsi-only Helvetica) do not. Fonts are embedded
 * subsetted, so the output PDF only carries the glyphs actually used.
 */
let fontBytesCache: { regular: Uint8Array; bold: Uint8Array } | null = null;

async function loadFontBytes() {
  if (!fontBytesCache) {
    const [regular, bold] = await Promise.all([
      fs.readFile(path.join(FONT_DIR, "DejaVuSans.ttf")),
      fs.readFile(path.join(FONT_DIR, "DejaVuSans-Bold.ttf")),
    ]);
    fontBytesCache = { regular: new Uint8Array(regular), bold: new Uint8Array(bold) };
  }
  return fontBytesCache;
}

/** Converts a `#rrggbb` string into pdf-lib's 0–1 RGB. */
export function hex(value: string): RGB {
  const clean = value.replace("#", "");
  const int = parseInt(clean, 16);
  return rgb(((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255);
}

/** Strips control characters that would corrupt the content stream. */
function clean(text: string): string {
  return String(text ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\u00A0/g, " ");
}

export interface TextOptions {
  x?: number;
  y?: number;
  size?: number;
  bold?: boolean;
  /** Editorial headings use a restrained serif; body copy stays in DejaVu Sans. */
  family?: "sans" | "serif";
  color?: RGB;
  /** Extra tracking between characters, for uppercase labels. */
  charSpacing?: number;
  align?: "left" | "right" | "center";
  /** Right edge used by `right`/`center` alignment. Defaults to content width. */
  width?: number;
}

export class PdfDoc {
  readonly doc: PDFDocument;
  readonly regular: PDFFont;
  readonly bold: PDFFont;
  readonly serif: PDFFont;
  readonly serifBold: PDFFont;
  readonly brandLogo: PDFImage | null;
  page: PDFPage;
  /** Cursor, measured from the top of the page downwards. */
  y = MARGIN;
  /** Lowest y the flowing content may occupy (kept clear for the footer). */
  contentBottom = PAGE_HEIGHT - MARGIN;
  /** Invoked after every page break so documents can repaint their chrome. */
  onNewPage: ((doc: PdfDoc, pageIndex: number) => void) | null = null;

  private constructor(
    doc: PDFDocument,
    regular: PDFFont,
    bold: PDFFont,
    serif: PDFFont,
    serifBold: PDFFont,
    brandLogo: PDFImage | null
  ) {
    this.doc = doc;
    this.regular = regular;
    this.bold = bold;
    this.serif = serif;
    this.serifBold = serifBold;
    this.brandLogo = brandLogo;
    this.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  }

  static async create(): Promise<PdfDoc> {
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);
    const bytes = await loadFontBytes();
    const [regular, bold, serif, serifBold, logoBytes] = await Promise.all([
      doc.embedFont(bytes.regular, { subset: true }),
      doc.embedFont(bytes.bold, { subset: true }),
      doc.embedFont(StandardFonts.TimesRoman),
      doc.embedFont(StandardFonts.TimesRomanBold),
      fs.readFile(path.join(process.cwd(), "public", "pdf-assets", "bandhan-logo.png")).catch(() => null),
    ]);
    const brandLogo = logoBytes ? await doc.embedPng(new Uint8Array(logoBytes)) : null;
    return new PdfDoc(doc, regular, bold, serif, serifBold, brandLogo);
  }

  font(bold?: boolean, family: "sans" | "serif" = "sans"): PDFFont {
    if (family === "serif") return bold ? this.serifBold : this.serif;
    return bold ? this.bold : this.regular;
  }

  /** Width of `text` when rendered at `size`. */
  measure(
    text: string,
    size: number,
    bold?: boolean,
    charSpacing = 0,
    family: "sans" | "serif" = "sans"
  ): number {
    const str = clean(text);
    const base = this.font(bold, family).widthOfTextAtSize(str, size);
    return base + (charSpacing ? charSpacing * Math.max(0, str.length - 1) : 0);
  }

  /** Greedy word wrap; also honours explicit newlines. */
  wrap(
    text: string,
    maxWidth: number,
    size: number,
    bold?: boolean,
    family: "sans" | "serif" = "sans"
  ): string[] {
    const lines: string[] = [];
    for (const paragraph of clean(text).split("\n")) {
      const words = paragraph.split(/\s+/).filter(Boolean);
      if (!words.length) {
        lines.push("");
        continue;
      }
      let line = words[0];
      for (const word of words.slice(1)) {
        const candidate = `${line} ${word}`;
        if (this.measure(candidate, size, bold, 0, family) <= maxWidth) {
          line = candidate;
        } else {
          lines.push(line);
          line = word;
        }
      }
      lines.push(line);
    }
    return lines;
  }

  /** Starts a new page and resets the cursor. */
  addPage(): void {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = MARGIN;
    this.onNewPage?.(this, this.doc.getPageCount() - 1);
  }

  /** Breaks the page if `height` more points won't fit below the cursor. */
  ensure(height: number): void {
    if (this.y + height > this.contentBottom) this.addPage();
  }

  /** Draws a single line of text at an absolute position (no cursor change). */
  textAt(text: string, opts: TextOptions = {}): void {
    const {
      x = MARGIN,
      y = this.y,
      size = 10,
      bold = false,
      family = "sans",
      color = rgb(0, 0, 0),
      charSpacing = 0,
      align = "left",
      width = CONTENT_WIDTH,
    } = opts;

    const str = clean(text);
    if (!str) return;

    let startX = x;
    if (align !== "left") {
      const textWidth = this.measure(str, size, bold, charSpacing, family);
      startX = align === "right" ? x + width - textWidth : x + (width - textWidth) / 2;
    }

    // pdf-lib's origin is bottom-left; our cursor is top-down, and `y` is the
    // top of the line box, so shift down by the ascent-ish baseline offset.
    const baseline = PAGE_HEIGHT - y - size * 0.82;

    if (!charSpacing) {
      this.page.drawText(str, { x: startX, y: baseline, size, font: this.font(bold, family), color });
      return;
    }

    let cursorX = startX;
    for (const char of str) {
      this.page.drawText(char, { x: cursorX, y: baseline, size, font: this.font(bold, family), color });
      cursorX += this.font(bold, family).widthOfTextAtSize(char, size) + charSpacing;
    }
  }

  /**
   * Draws wrapped text at the cursor and advances it. Returns the height used.
   */
  paragraph(
    text: string,
    opts: TextOptions & { maxWidth?: number; lineHeight?: number; spaceAfter?: number } = {}
  ): number {
    const {
      size = 10,
      lineHeight = size * 1.5,
      maxWidth = CONTENT_WIDTH,
      spaceAfter = 0,
      x = MARGIN,
    } = opts;

    const lines = this.wrap(text, maxWidth, size, opts.bold, opts.family);
    for (const line of lines) {
      this.ensure(lineHeight);
      this.textAt(line, { ...opts, x, y: this.y, width: maxWidth });
      this.y += lineHeight;
    }
    this.y += spaceAfter;
    return lines.length * lineHeight + spaceAfter;
  }

  rect(x: number, y: number, width: number, height: number, color: RGB, opacity = 1): void {
    this.page.drawRectangle({
      x,
      y: PAGE_HEIGHT - y - height,
      width,
      height,
      color,
      opacity,
    });
  }

  /** Soft card surface; pdf-lib's rectangle primitive keeps output lightweight. */
  roundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: RGB,
    radius = 10,
    opacity = 1
  ): void {
    void radius;
    this.page.drawRectangle({
      x,
      y: PAGE_HEIGHT - y - height,
      width,
      height,
      color,
      opacity,
    });
  }

  strokeRect(x: number, y: number, width: number, height: number, color: RGB, thickness = 0.7): void {
    this.page.drawRectangle({
      x,
      y: PAGE_HEIGHT - y - height,
      width,
      height,
      borderColor: color,
      borderWidth: thickness,
    });
  }

  /** Horizontal rule at absolute `y`. */
  rule(y: number, color: RGB, x = MARGIN, width = CONTENT_WIDTH, thickness = 0.7): void {
    this.rect(x, y, width, thickness, color);
  }

  async save(): Promise<Uint8Array> {
    return this.doc.save();
  }
}
