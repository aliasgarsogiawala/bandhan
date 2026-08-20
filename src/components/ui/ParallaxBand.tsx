import React from "react";
import Image from "next/image";

interface ParallaxBandProps {
  /** Full-bleed artwork that stays put while the content scrolls over it. */
  image: string;
  /** Empty string marks the image as decorative, which it is here. */
  alt?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Flat overlay strength over the artwork, 0–100. Deliberately a single solid
   * tint rather than a gradient, so contrast is uniform wherever the copy lands.
   */
  overlay?: 40 | 50 | 55 | 60 | 65 | 70 | 75;
  /** Load eagerly when the band sits near the top of a page. */
  priority?: boolean;
  id?: string;
}

const OVERLAY: Record<number, string> = {
  40: "bg-ink-deep/40",
  50: "bg-ink-deep/50",
  55: "bg-ink-deep/55",
  60: "bg-ink-deep/60",
  65: "bg-ink-deep/65",
  70: "bg-ink-deep/70",
  75: "bg-ink-deep/75",
};

/**
 * A section whose photograph is pinned to the viewport while its content
 * scrolls across — the band reads as a window cut through the page.
 *
 * The pinning uses `position: fixed` on the image with `clip-path: inset(0)` on
 * the wrapper. That clip establishes a containing block for fixed descendants,
 * which confines the image to this section. It is deliberately *not*
 * `background-attachment: fixed`: that property is ignored on iOS Safari, which
 * silently degrades the effect to a normal scrolling background on a large
 * share of this site's traffic.
 *
 * `will-change` is omitted on purpose — promoting a full-viewport image to its
 * own layer on every band costs more than it buys here.
 */
export const ParallaxBand: React.FC<ParallaxBandProps> = ({
  image,
  alt = "",
  children,
  className = "",
  overlay = 60,
  priority = false,
  id,
}) => (
  <section
    id={id}
    className={`relative isolate [clip-path:inset(0)] ${className}`}
  >
    {/* Pinned artwork. h-screen keeps it filling the viewport at any scroll
        position; the clip above stops it bleeding into neighbouring sections. */}
    <div className="pointer-events-none fixed inset-0 z-0 h-screen w-full">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="100vw"
        quality={90}
        priority={priority}
        className="object-cover object-center"
      />
      <div className={`absolute inset-0 ${OVERLAY[overlay]}`} />
    </div>
    <div className="relative z-10">{children}</div>
  </section>
);

export default ParallaxBand;
