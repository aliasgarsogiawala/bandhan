import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The PDF renderer reads its embedded fonts from disk at runtime, so the
  // .ttf files must be traced into the server bundle for routes that use them.
  outputFileTracingIncludes: {
    "/api/**": ["src/lib/documents/pdf/fonts/**"],
  },
  images: {
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
