"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { canOptimizeImage, isImagePageLink } from "@/lib/imageHosts";
import { placeholderImage } from "@/lib/placeholderImages";

/**
 * Drop-in replacement for `next/image`. Images on hosts the optimizer doesn't
 * know (links pasted into the admin Image Manager) are rendered `unoptimized`
 * — loaded directly from their host — instead of crashing the page.
 *
 * A link that can't be shown — a photo's web page such as unsplash.com/photos/…,
 * or a file that fails to load — falls back to stand-in travel photography
 * rather than leaving an empty grey box.
 */
export default function SiteImage({ src, alt, unoptimized, onError, ...props }: ImageProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const unusable = (typeof src === "string" && isImagePageLink(src)) || failedSrc === src;
  const shown = unusable ? placeholderImage(typeof src === "string" ? src : alt || "image") : src;
  const remoteUnknown = typeof shown === "string" && !canOptimizeImage(shown);
  return (
    <Image
      src={shown}
      alt={alt}
      unoptimized={unoptimized || remoteUnknown}
      onError={(event) => {
        if (!unusable) setFailedSrc(src);
        onError?.(event);
      }}
      {...props}
    />
  );
}
