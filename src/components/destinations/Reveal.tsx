import React from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Retained for call-site compatibility; no longer used. */
  delay?: number;
}

/**
 * Was an IntersectionObserver scroll-reveal. Neutralised alongside
 * `ScrollReveal` so destination guides paint as finished blocks rather than
 * animating in — see that component for the reasoning.
 */
export const Reveal: React.FC<RevealProps> = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export default Reveal;
