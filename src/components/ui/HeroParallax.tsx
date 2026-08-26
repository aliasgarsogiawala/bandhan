"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface HeroParallaxProps {
  src: string;
  alt: string;
  priority?: boolean;
}

/**
 * Backdrop for `PageHero` that drifts at a fraction of the scroll speed.
 * The image is inset beyond the header on both edges so the translation never
 * exposes a gap, and the effect is skipped entirely for reduced-motion users.
 */
export default function HeroParallax({ src, alt, priority = false }: HeroParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = Math.min(window.scrollY, 720);
      if (ref.current) {
        ref.current.style.transform = `translate3d(0, ${travel * 0.16}px, 0) scale(1.08)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="absolute -inset-y-16 inset-x-0 will-change-transform">
      <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover" />
    </div>
  );
}
