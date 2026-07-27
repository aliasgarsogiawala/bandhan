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

  // The plane is a desktop-only flourish — skip it entirely on phones/tablets so
  // it never animates or overlays touch content. Gated on the same 1024px
  // breakpoint the rest of the site uses for its `lg:` layout switch.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const wrap = wrapRef.current;
    const plane = planeRef.current;
    const path = pathRef.current;
    const trail = trailRef.current;
    const maskPath = maskPathRef.current;
    if (!wrap || !plane || !path || !trail || !maskPath) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let total = 0;
    let current = 0;
    let currentOpacity = 0.12;
    let raf = 0;

    // Keep the flight on the viewport perimeter so it frames content instead
    // of crossing through cards, buttons, or reading areas.
    const buildPath = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const d = [
        `M ${-0.1 * w} ${0.14 * h}`,
        `C ${0.18 * w} ${0.05 * h} ${0.58 * w} ${0.07 * h} ${0.82 * w} ${0.15 * h}`,
        `C ${1.01 * w} ${0.21 * h} ${1.03 * w} ${0.34 * h} ${0.96 * w} ${0.44 * h}`,
        `C ${0.9 * w} ${0.54 * h} ${0.91 * w} ${0.67 * h} ${0.98 * w} ${0.76 * h}`,
        `C ${1.04 * w} ${0.84 * h} ${0.9 * w} ${0.93 * h} ${0.7 * w} ${0.95 * h}`,
        `C ${0.4 * w} ${0.99 * h} ${0.12 * w} ${0.91 * h} ${-0.12 * w} ${0.82 * h}`,
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
      const safeZone = document.querySelector<HTMLElement>("[data-plane-safe-zone]");
      const safeRect = safeZone?.getBoundingClientRect();
      const isSafeZoneVisible = Boolean(
        safeRect && safeRect.top < window.innerHeight && safeRect.bottom > 0
      );
      const targetOpacity = isSafeZoneVisible ? 0.012 : 0.12;
      currentOpacity += (targetOpacity - currentOpacity) * 0.08;

      wrap.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
      wrap.style.opacity = String(currentOpacity);
      if (spinnerRef.current) {
        spinnerRef.current.style.pointerEvents = isSafeZoneVisible ? "none" : "auto";
      }
      plane.style.transform = `translate(-50%, -50%) rotate(${angle + ICON_ROTATION_OFFSET}deg)`;
      trail.style.opacity = isSafeZoneVisible ? "0.035" : "0.55";
      maskPath.setAttribute("stroke-dashoffset", String(total - current));

      raf = requestAnimationFrame(tick);
    };

    buildPath();
    window.addEventListener("resize", buildPath);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", buildPath);
    };
  }, [isDesktop]);

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

  if (!isDesktop) return null;

  return (
    <>
      {/* Full-screen SVG: hidden math path + visible dotted trail revealed via mask */}
      <svg
        className="pointer-events-none fixed inset-0 z-20 h-full w-full overflow-visible"
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
          strokeOpacity="0.12"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.1 16"
          mask="url(#planeTrailMask)"
        />
      </svg>

      <div
        ref={wrapRef}
        className="pointer-events-none fixed left-0 top-0 z-20 opacity-0 will-change-transform"
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
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent fill-accent/15 drop-shadow-lg"
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
