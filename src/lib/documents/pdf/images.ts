import fs from "node:fs/promises";
import path from "node:path";
import type { PDFImage } from "pdf-lib";
import { PAGE_HEIGHT, PdfDoc } from "./layout";

/** Loads snapshot images from either the web or /public, with graceful fallback. */
export async function loadProposalImage(
  doc: PdfDoc,
  source?: string
): Promise<PDFImage | null> {
  if (!source) return null;
  try {
    let bytes: Uint8Array;
    let isPng = /\.png(?:$|\?)/i.test(source);
    if (/^https?:\/\//i.test(source)) {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) return null;
      bytes = new Uint8Array(await response.arrayBuffer());
      isPng = (response.headers.get("content-type") || "").includes("png") || isPng;
    } else {
      const publicPath = source.replace(/^\/+/, "");
      bytes = new Uint8Array(await fs.readFile(path.join(process.cwd(), "public", publicPath)));
    }
    return isPng ? await doc.doc.embedPng(bytes) : await doc.doc.embedJpg(bytes);
  } catch {
    return null;
  }
}

/** Crops a photo to fill a rectangle, mirroring CSS object-fit: cover. */
export function drawImageCover(
  doc: PdfDoc,
  image: PDFImage,
  x: number,
  top: number,
  width: number,
  height: number,
  opacity = 1
) {
  const bottom = PAGE_HEIGHT - top - height;
  const fullPage = x === 0 && top === 0 && width >= 595 && height >= PAGE_HEIGHT - 1;
  const scale = fullPage ? Math.max(width / image.width, height / image.height) : 1;
  const drawWidth = fullPage ? image.width * scale : width;
  const drawHeight = fullPage ? image.height * scale : height;
  doc.page.drawImage(image, {
    x: x + (width - drawWidth) / 2,
    y: bottom + (height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
    opacity,
  });
}
