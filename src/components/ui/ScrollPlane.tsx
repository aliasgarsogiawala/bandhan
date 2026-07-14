"use client";

import React, { useEffect, useRef, useState } from "react";

// The plane icon points 45° up-right by default; this offset aligns it with the path tangent.
const ICON_ROTATION_OFFSET = 45;
const SPARK_COUNT = 10;

export const ScrollPlane: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);

  // Bumping this remounts the spark burst so its animation replays on every click.
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const plane = planeRef.current;
    const path = pathRef.current;
    const trail = trailRef.current;
    const maskPath = maskPathRef.current;
    if (!wrap || !plane || !path || !trail || !maskPath) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let total = 0;
    let current = 0;
    let raf = 0;

    // Flight plan in viewport coordinates: swoop right, bank back left,
    // full loop-de-loop mid-screen, then dive and exit bottom-right.
    const buildPath = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const r = Math.min(w, h) * 0.09;
      const d = [
        `M ${-0.12 * w} ${0.24 * h}`,
        `C ${0.22 * w} ${0.1 * h} ${0.5 * w} ${0.34 * h} ${0.78 * w} ${0.2 * h}`,
        `C ${0.98 * w} ${0.1 * h} ${1.04 * w} ${0.36 * h} ${0.86 * w} ${0.46 * h}`,
        `C ${0.66 * w} ${0.57 * h} ${0.52 * w} ${0.42 * h} ${0.4 * w} ${0.5 * h}`,
        `a ${r} ${r} 0 1 1 0 ${-2 * r}`,
        `a ${r} ${r} 0 1 1 0 ${2 * r}`,
        `C ${0.26 * w} ${0.58 * h} ${0.1 * w} ${0.68 * h} ${0.22 * w} ${0.8 * h}`,
        `C ${0.42 * w} ${0.94 * h} ${0.8 * w} ${0.76 * h} ${1.15 * w} ${0.85 * h}`,
      ].join(" ");
      path.setAttribute("d", d);
      trail.setAttribute("d", d);
      maskPath.setAttribute("d", d);
      total = path.getTotalLength();
      // One dash spanning the whole path; the offset below reveals it up to the plane.
      maskPath.setAttribute("stroke-dasharray", String(total));
    };

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      current += (progress * total - current) * 0.075;

      const pt = path.getPointAtLength(current);
      const ahead = path.getPointAtLength(Math.min(total, current + 2));
      const behind = path.getPointAtLength(Math.max(0, current - 2));
      const angle =
        (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;

      wrap.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
      plane.style.transform = `translate(-50%, -50%) rotate(${angle + ICON_ROTATION_OFFSET}deg)`;
      // Reveal the dotted trail only up to where the plane has flown.
      maskPath.setAttribute("stroke-dashoffset", String(total - current));

      raf = requestAnimationFrame(tick);
    };

    buildPath();
    wrap.style.opacity = "1";
    window.addEventListener("resize", buildPath);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", buildPath);
    };
  }, []);

  const handlePlaneClick = () => {
    const spinner = spinnerRef.current;
    if (spinner) {
      spinner.classList.remove("plane-rolling");
      // Force reflow so the animation restarts even on rapid repeat clicks.
      void spinner.offsetWidth;
      spinner.classList.add("plane-rolling");
    }
    setBurst((b) => b + 1);
  };

  return (
    <>
      {/* Full-screen SVG: hidden math path + visible dotted trail revealed via mask */}
      <svg
        className="fixed inset-0 w-full h-full z-40 pointer-events-none overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="planeTrailMask"
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="-3000"
            y="-3000"
            width="9000"
            height="9000"
          >
            <path
              ref={maskPathRef}
              fill="none"
              stroke="white"
              strokeWidth="60"
              strokeLinecap="round"
            />
          </mask>
        </defs>
        {/* Invisible path used only for position/tangent math */}
        <path ref={pathRef} fill="none" stroke="none" />
        {/* Dotted trail — round caps + tiny dashes make dots */}
        <path
          ref={trailRef}
          className="text-gold"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="0.1 16"
          mask="url(#planeTrailMask)"
        />
      </svg>

      <div
        ref={wrapRef}
        className="fixed top-0 left-0 z-40 pointer-events-none opacity-0 will-change-transform"
        aria-hidden="true"
      >
        <div ref={planeRef} className="will-change-transform">
          <div
            ref={spinnerRef}
            onClick={handlePlaneClick}
            className="relative pointer-events-auto cursor-pointer p-2"
          >
            {/* Spark burst on click */}
            {burst > 0 && (
              <div key={burst} className="absolute inset-0 flex items-center justify-center">
                {Array.from({ length: SPARK_COUNT }).map((_, i) => {
                  const a = (i / SPARK_COUNT) * Math.PI * 2;
                  const dist = 34 + (i % 3) * 8;
                  return (
                    <span
                      key={i}
                      className="plane-spark absolute w-1.5 h-1.5 rounded-full bg-gold"
                      style={
                        {
                          "--sx": `${Math.cos(a) * dist}px`,
                          "--sy": `${Math.sin(a) * dist}px`,
                        } as React.CSSProperties
                      }
                    />
                  );
                })}
              </div>
            )}

            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent fill-accent/25 drop-shadow-lg"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScrollPlane;
