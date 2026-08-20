import React from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Retained for call-site compatibility; no longer used. */
  delay?: number;
}

/**
 * Formerly an IntersectionObserver fade-and-lift wrapper.
 *
 * The reveal is deliberately gone: content now paints immediately. Beyond the
 * design direction, the observer had a real cost — anything below the fold
 * rendered blank until it was scrolled into view, which hurt perceived speed,
 * printed empty sections in screenshots and previews, and left content missing
 * for anything that reads the page without scrolling it.
 *
 * The component is kept (rather than deleted at ~118 call sites) so the section
 * markup still reads as intentional grouping, and so a reveal can be
 * reintroduced in one place if it is ever wanted again.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export default ScrollReveal;
