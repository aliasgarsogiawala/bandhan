import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The PDF renderer reads its fonts, the brand logo and any locally-hosted
  // artwork from disk at runtime. Every one of those paths is built with
  // `process.cwd()`, so the tracer cannot see them statically and the files
  // have to be listed by hand or they simply are not in the deployed bundle.
  //
  // `public/pdf-assets` matters as much as the fonts: `PdfDoc.create()` swallows
  // a missing logo with `.catch(() => null)` and quietly falls back to setting
  // the company name as text, so an untraced logo does not fail the build or
  // the request — the brochures just come out unbranded in production while
  // still looking correct locally.
  outputFileTracingIncludes: {
    "/api/**": ["src/lib/documents/pdf/fonts/**", "public/pdf-assets/**"],
  },
  images: {
    // AVIF first: roughly 20–30% smaller than WebP at the same visual quality,
    // which is what lets us serve genuinely high-resolution artwork without a
    // weight penalty. Next falls back to WebP, then the original.
    formats: ["image/avif", "image/webp"],
    // 3840 covers 2x rendering of a full-bleed hero on a 1920px display; the
    // default list stops at 3840 too but omits the intermediate steps that keep
    // mid-size cards from over-fetching.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    // Next 16 rejects any `quality` prop not listed here. 90 is the tier used
    // for hero and gallery artwork; 82 is the default for cards.
    qualities: [50, 75, 82, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
