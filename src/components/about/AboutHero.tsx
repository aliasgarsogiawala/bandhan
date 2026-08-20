"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export default function AboutHero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = Math.min(window.scrollY, 720);
      if (imageRef.current) imageRef.current.style.transform = `translate3d(0, ${travel * 0.18}px, 0) scale(1.08)`;
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${travel * 0.08}px, 0)`;
        contentRef.current.style.opacity = String(Math.max(0.35, 1 - travel / 900));
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
    <header className="relative flex min-h-[680px] items-end overflow-hidden bg-primary pt-36">
      <div ref={imageRef} className="absolute -inset-y-12 inset-x-0 will-change-transform">
        <Image src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=90&w=3200" alt="Travellers driving through a mountain landscape" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-ink-deep/65" />
      <div className="absolute inset-0 bg-transparent" />
      <Container className="relative pb-20 sm:pb-24">
        <div ref={contentRef} className="max-w-4xl will-change-transform">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">About Bandhan Tours</span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            See places. Meet faces. Together.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Since 2013, Bandhan Tours has planned safe, personal, and memorable
            journeys across India and around the world.
          </p>
        </div>
      </Container>
      <div className="absolute bottom-0 left-0 h-px w-full bg-gold/45" aria-hidden="true" />
    </header>
  );
}
