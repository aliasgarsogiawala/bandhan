import React from "react";

/**
 * Editorial SVG decorations for the home page.
 * Presentational only — all hidden from assistive tech via aria-hidden.
 */

type SvgProps = React.SVGProps<SVGSVGElement>;

/** Fine eyebrow rule used next to section labels */
export function EyebrowRule({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 32 2" aria-hidden="true" className={className} {...props}>
      <line x1="0" y1="1" x2="32" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Ornamental compass mark — a quiet watermark for section corners */
export function CompassMark({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className} {...props}>
      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.45" />
      {[...Array(24)].map((_, i) => (
        <line
          key={i}
          x1="60"
          y1="4"
          x2="60"
          y2={i % 6 === 0 ? "14" : "9"}
          stroke="currentColor"
          strokeWidth={i % 6 === 0 ? "1.2" : "0.6"}
          opacity="0.5"
          transform={`rotate(${i * 15} 60 60)`}
        />
      ))}
      <path d="M60 18 L68 60 L60 53 L52 60 Z" fill="currentColor" opacity="0.75" />
      <path d="M60 102 L52 60 L60 67 L68 60 Z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

/** Soft topographic / contour pattern for section backgrounds */
export function ContourPattern({ className = "", ...props }: SvgProps) {
  return (
    <svg aria-hidden="true" className={className} {...props}>
      <defs>
        <pattern id="contour-home" width="90" height="90" patternUnits="userSpaceOnUse">
          <path d="M0 70 Q 22 48 45 70 T 90 70" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" />
          <path d="M0 48 Q 22 26 45 48 T 90 48" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <path d="M0 26 Q 22 4 45 26 T 90 26" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
          <path d="M0 4 Q 22 -18 45 4 T 90 4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#contour-home)" />
    </svg>
  );
}

/** A thin, drawn underline accent for headlines */
export function HeadlineAccent({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 200 14" aria-hidden="true" className={className} {...props}>
      <path
        d="M2 9 C 50 2, 110 2, 150 5 C 178 7, 192 8, 198 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Small ornamental corner flourish for cards */
export function CornerMark({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} {...props}>
      <path
        d="M2 2 C 24 2, 46 6, 46 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="2" cy="2" r="1.6" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** A simple wave divider to transition between section colors */
export function WaveTransition({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" className={className} {...props}>
      <path d="M0,48 C 240,80 480,16 720,40 C 960,64 1200,88 1440,48 L1440,80 L0,80 Z" fill="currentColor" />
    </svg>
  );
}
