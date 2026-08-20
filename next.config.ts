import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The PDF renderer reads its embedded fonts from disk at runtime, so the
  // .ttf files must be traced into the server bundle for routes that use them.
  outputFileTracingIncludes: {
    "/api/**": ["src/lib/documents/pdf/fonts/**"],
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
