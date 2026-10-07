import Link from "next/link";
import Image from "@/components/ui/SiteImage";
import Container from "@/components/ui/Container";
import PageShell from "@/components/ui/PageShell";
import BoardingPass from "./BoardingPass";
import WhereToNext from "./WhereToNext";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=85&w=2400";

const QUICK_LINKS = [
  { href: "/packages", label: "Tour packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/plan-trip", label: "Plan a trip" },
  { href: "/blog", label: "Travel blog" },
  { href: "/contact", label: "Contact us" },
];

/** The "0" of 404, drawn as a compass whose needle can't settle. */
function Compass() {
  return (
    <svg viewBox="0 0 100 100" className="inline-block h-[0.78em] w-[0.78em] align-[-0.02em]" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="7" className="text-gold" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 5.1" className="text-white/40" />
      <text x="50" y="27" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor" className="text-gold">
        N
      </text>
      <g className="notfound-needle" style={{ transformOrigin: "50px 50px" }}>
        <polygon points="50,22 56,50 44,50" fill="#fe4f4f" />
        <polygon points="50,78 56,50 44,50" fill="currentColor" className="text-white/80" />
      </g>
      <circle cx="50" cy="50" r="4.5" fill="currentColor" className="text-ink-deep" stroke="#FED14F" strokeWidth="2" />
    </svg>
  );
}

/** A dashed flight path with a plane looping along it. */
function FlightPath() {
  const path = "M -40 150 C 220 20, 520 40, 760 110 S 1240 190, 1480 40";
  return (
    <svg
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 top-24 h-44 w-full opacity-70 sm:top-28"
      aria-hidden="true"
    >
      <path d={path} fill="none" stroke="#FED14F" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
      <g className="motion-reduce:hidden">
        <path d="M0 -9 L20 0 L0 9 L5 0 Z" fill="#FED14F">
          <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" path={path} />
        </path>
      </g>
    </svg>
  );
}

export default function NotFoundView({
  title = "This page took a detour.",
  description = "The link may be old or mistyped, or the page has moved on to new horizons. Let's get you back on route.",
  primaryHref = "/",
  primaryLabel = "Back to home",
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <PageShell tone="sand">
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-ink-deep pb-20 pt-32 sm:pt-36">
        <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-deep/95 via-ink-deep/75 to-primary/60" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_30%,rgba(254,209,79,0.16),transparent_45%)]" aria-hidden="true" />
        <FlightPath />

        <Container className="relative z-10">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-gold backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                Error 404 · Off the map
              </span>

              <p
                className="mt-6 font-heading text-[clamp(6rem,19vw,12.5rem)] font-extrabold leading-[0.85] tracking-tight text-white"
                aria-hidden="true"
              >
                4<Compass />4
              </p>

              <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-300 lg:mx-0">{description}</p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link
                  href={primaryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(254,79,79,0.8)] transition hover:-translate-y-0.5 hover:bg-accent-dark"
                >
                  {primaryLabel}
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href={primaryHref === "/" ? "/packages" : "/"}
                  className="inline-flex items-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold text-white transition hover:border-white hover:bg-white hover:text-primary"
                >
                  {primaryHref === "/" ? "Browse packages" : "Back to home"}
                </Link>
                <Link href="/contact" className="px-2 py-3.5 text-sm font-semibold text-gold transition hover:text-gold-light">
                  Ask our travel desk
                </Link>
              </div>
            </div>

            <div className="hidden sm:block">
              <BoardingPass />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Popular escapes</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-primary sm:text-4xl">Where to next?</h2>
            </div>
            <Link href="/destinations" className="text-sm font-bold text-primary underline-offset-4 hover:underline">
              See all destinations →
            </Link>
          </div>

          <WhereToNext />

          <nav aria-label="Popular pages" className="mt-12 flex flex-wrap justify-center gap-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-primary/15 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </Container>
      </section>
    </PageShell>
  );
}
