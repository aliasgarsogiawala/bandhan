import React from "react";

/**
 * Decorative SVG assets for the destination guide.
 * All purely visual — presentational only, hidden from assistive tech.
 */

type SvgProps = React.SVGProps<SVGSVGElement>;

export function WaveDivider({ className = "", ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M0,64 C240,120 480,0 720,32 C960,64 1200,128 1440,72 L1440,120 L0,120 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Layered misty mountain silhouette used behind the route/timeline */
export function MountainSilhouette({ className = "", ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M0,200 L0,150 L120,70 L210,120 L330,40 L470,130 L600,60 L760,140 L900,80 L1040,150 L1200,90 L1200,200 Z" fill="currentColor" opacity="0.45" />
      <path d="M0,200 L0,170 L160,110 L300,160 L460,100 L640,170 L820,120 L1000,170 L1200,130 L1200,200 Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/** Hand-drawn underline / accent stroke for headings */
export function InkUnderline({ className = "", ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 240 16"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M3 11 C 60 3, 120 3, 160 7 C 195 10, 220 11, 237 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Compass rose — used as a section watermark */
export function Compass({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className} {...props}>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
      {[...Array(24)].map((_, i) => (
        <line
          key={i}
          x1="60"
          y1="6"
          x2="60"
          y2={i % 6 === 0 ? "16" : "11"}
          stroke="currentColor"
          strokeWidth={i % 6 === 0 ? "1.4" : "0.7"}
          opacity="0.55"
          transform={`rotate(${i * 15} 60 60)`}
        />
      ))}
      <path d="M60 18 L70 60 L60 52 L50 60 Z" fill="currentColor" opacity="0.85" />
      <path d="M60 102 L50 60 L60 68 L70 60 Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

/** Sun + rays mark used in the "when to go" section */
export function SunMark({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} {...props}>
      <circle cx="24" cy="24" r="9" fill="currentColor" />
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="24"
          y1="3"
          x2="24"
          y2="9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${i * 30} 24 24)`}
        />
      ))}
    </svg>
  );
}

/** Dotted travel route path with a plane at the end */
export function DottedRoute({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M10 45 C 120 -5, 260 60, 380 25 C 470 0, 540 30, 590 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 12"
        opacity="0.7"
      />
    </svg>
  );
}

/** Leaf flourish for nature/eco themed destinations */
export function LeafSprig({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} {...props}>
      <path d="M32 60 C 32 36, 32 18, 32 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 44 C 18 44, 10 34, 8 22 C 22 22, 32 30, 32 44 Z" fill="currentColor" opacity="0.85" />
      <path d="M32 36 C 46 36, 54 26, 56 14 C 42 14, 32 22, 32 36 Z" fill="currentColor" opacity="0.6" />
      <path d="M32 26 C 22 26, 16 18, 14 10 C 24 10, 32 16, 32 26 Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

/** Subtle repeating topographic / contour pattern */
export function TopoPattern({ className = "", ...props }: SvgProps) {
  return (
    <svg aria-hidden="true" className={className} {...props}>
      <defs>
        <pattern id="topo" width="80" height="80" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
          <path d="M0 60 Q 20 40 40 60 T 80 60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <path d="M0 40 Q 20 20 40 40 T 80 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          <path d="M0 20 Q 20 0 40 20 T 80 20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
  );
}

/** Animated paper plane for the route header */
export function PaperPlane({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...props}>
      <path d="M21 4 3 11l6 2 2 6 4-5 5-4-5-1z" fill="currentColor" />
    </svg>
  );
}

/** Ornate corner flourish for cards */
export function CornerFlourish({ className = "", ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true" className={className} {...props}>
      <path d="M2 2 C 30 2, 58 8, 58 36 C 58 22, 44 14, 26 14 C 14 14, 6 18, 2 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="2" cy="2" r="2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
