import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import HeroParallax from "@/components/ui/HeroParallax";

export interface Crumb {
  label: string;
  href?: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

interface PageHeroProps {
  /** Small uppercase kicker above the title. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Full-bleed background photograph. Falls back to the flat ink surface. */
  image?: string;
  imageAlt?: string;
  /** Drift the backdrop on scroll. Only worth it on `size="lg"` heroes. */
  parallax?: boolean;
  priority?: boolean;
  align?: "left" | "center";
  /** Vertical weight of the band. `lg` is for a page's marquee hero. */
  size?: "sm" | "md" | "lg";
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  stats?: HeroStat[];
  /** Sits inside the title column, under the copy. */
  children?: React.ReactNode;
  /** Full container width, under the title column — search bars, filter rows. */
  toolbar?: React.ReactNode;
  className?: string;
}

/**
 * The single top band shared by every internal page.
 *
 * The navbar floats over the page rather than occupying flow, so the top
 * padding here is what keeps a page's first line of type clear of it — which
 * is exactly why each page should not invent its own value.
 */
const SIZES = {
  sm: "pt-28 pb-12 sm:pt-32 sm:pb-14",
  md: "pt-32 pb-16 sm:pt-40 sm:pb-20",
  lg: "pt-36 pb-20 sm:pt-44 sm:pb-28",
} as const;

const TITLES = {
  sm: "text-3xl sm:text-4xl lg:text-5xl",
  md: "text-3xl sm:text-5xl lg:text-[3.25rem]",
  lg: "text-4xl sm:text-6xl lg:text-7xl",
} as const;

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  parallax = false,
  priority = false,
  align = "left",
  size = "md",
  breadcrumbs,
  actions,
  stats,
  children,
  toolbar,
  className = "",
}) => {
  const centered = align === "center";

  return (
    <header
      className={`relative isolate overflow-hidden bg-primary ${SIZES[size]} ${className}`}
    >
      {image &&
        (parallax ? (
          <HeroParallax src={image} alt={imageAlt} priority={priority} />
        ) : (
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover object-center"
          />
        ))}

      {/* Two passes: a flat wash for legibility, then a foot-heavy gradient so
          the type sits on the darkest part of the frame. */}
      <div className="absolute inset-0 bg-ink-deep/70" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-ink-deep/25 to-transparent"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-4xl"}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol
                className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-300/80 ${
                  centered ? "justify-center" : ""
                }`}
              >
                {breadcrumbs.map((crumb, index) => (
                  <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                    {index > 0 && (
                      <span aria-hidden="true" className="text-slate-500">
                        /
                      </span>
                    )}
                    {crumb.href ? (
                      <Link href={crumb.href} className="transition hover:text-gold">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-white/90">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {eyebrow && (
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
              {eyebrow}
            </span>
          )}

          <h1
            className={`mt-4 font-heading font-extrabold leading-[1.06] tracking-[-0.02em] text-white ${TITLES[size]}`}
          >
            {title}
          </h1>

          {description && (
            <p
              className={`mt-6 text-base leading-relaxed text-slate-200 sm:text-lg ${
                centered ? "mx-auto max-w-2xl" : "max-w-2xl"
              }`}
            >
              {description}
            </p>
          )}

          {actions && (
            <div
              className={`mt-9 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}
            >
              {actions}
            </div>
          )}

          {children}
        </div>

        {toolbar && <div className="mt-9">{toolbar}</div>}

        {stats && stats.length > 0 && (
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 sm:mt-14 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-primary/70 px-5 py-6 backdrop-blur-sm">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-heading text-2xl font-extrabold text-white sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-xs uppercase tracking-[0.16em] text-slate-300">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Container>

      <div className="absolute bottom-0 left-0 h-px w-full bg-gold/45" aria-hidden="true" />
    </header>
  );
};

export default PageHero;
