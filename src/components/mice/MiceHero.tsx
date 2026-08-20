import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";

const assurances = [
  "Dedicated programme manager",
  "Itemised, GST-compliant costing",
  "On-site delivery team",
];

const pillars = ["Meetings", "Incentives", "Conferences", "Exhibitions"];

export default function MiceHero() {
  return (
    <header className="relative bg-[#f5f5f2] pt-24 sm:pt-28">
      <div className="absolute inset-x-0 top-0 h-24 bg-primary sm:h-28" aria-hidden="true" />
      <Container className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Corporate travel · Meetings &amp; events
            </p>
            <h1 className="mt-5 max-w-2xl font-heading text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-primary sm:text-5xl lg:text-[3.65rem]">
              Corporate meetings and events, managed end to end.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-foreground-muted sm:text-lg">
              Bandhan Tours brings travel, accommodation, event production and
              delegate operations under one accountable programme team—across
              India and international destinations.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#enquiry"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-dark"
              >
                Request a proposal
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-primary/25 bg-white px-6 py-3 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
              >
                Speak with the corporate desk
              </Link>
            </div>

            <ul className="mt-9 space-y-3 border-t border-primary/15 pt-7">
              {assurances.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-primary/80">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={11} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary shadow-premium lg:aspect-[5/4]">
              <Image
                src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=90&w=2400"
                alt="Delegates attending a professionally managed corporate conference"
                fill
                preload
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 border-t border-white/20 bg-primary/85 px-5 py-4 text-white backdrop-blur-sm sm:px-6">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
                  One coordinated programme
                </p>
                <p className="mt-1 text-sm text-white/80">
                  Planning · Travel · Hospitality · Production · On-site operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-y border-primary/10 bg-white">
        <Container>
          <ul className="grid grid-cols-2 sm:grid-cols-4">
            {pillars.map((pillar, index) => (
              <li
                key={pillar}
                className={`flex min-h-20 items-center gap-3 px-2 py-4 sm:px-5 ${index % 2 ? "border-l border-primary/10" : ""} ${index > 1 ? "border-t border-primary/10 sm:border-t-0" : ""} ${index === 2 ? "sm:border-l" : ""}`}
              >
                <span className="font-heading text-lg font-bold text-accent" aria-hidden="true">
                  {pillar[0]}
                </span>
                <span className="text-sm font-semibold text-primary">{pillar}</span>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </header>
  );
}
