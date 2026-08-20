"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

const pillars = [
  { letter: "M", label: "Meetings" },
  { letter: "I", label: "Incentives" },
  { letter: "C", label: "Conferences" },
  { letter: "E", label: "Exhibitions" },
];

export default function MiceHero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = Math.min(window.scrollY, 720);
      if (imageRef.current) {
        imageRef.current.style.transform = `translate3d(0, ${travel * 0.18}px, 0) scale(1.08)`;
      }
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
        <Image
          src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=90&w=3200"
          alt="Delegates seated at a corporate conference"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/40" />

      <Container className="relative pb-16 sm:pb-20">
        <div ref={contentRef} className="max-w-4xl will-change-transform">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
            Corporate &amp; MICE travel
          </span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Business travel that brings people together.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Bandhan Tours plans and runs meetings, incentive trips, conferences
            and exhibition travel across India and abroad — venue to visa,
            arrival to reporting, managed by one accountable team.
          </p>
          <div className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap">
            <a
              href="#enquiry"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white transition hover:bg-accent-dark"
            >
              Request a proposal
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-center text-sm font-bold text-white transition hover:bg-white hover:text-primary"
            >
              Talk to our corporate desk
            </Link>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/15 pt-7 sm:grid-cols-4">
            {pillars.map((pillar) => (
              <li key={pillar.letter} className="flex items-baseline gap-3">
                <span className="font-heading text-2xl font-extrabold text-gold">
                  {pillar.letter}
                </span>
                <span className="text-sm font-semibold tracking-wide text-white/85">
                  {pillar.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div
        className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/70 to-transparent"
        aria-hidden="true"
      />
    </header>
  );
}
