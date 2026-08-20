import React from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Retained for call-site compatibility; no longer used. */
  delay?: number;
}

/** Progressive CSS reveal: content remains visible when the feature is unsupported. */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = "" }) => (
  <div className={`scroll-reveal ${className}`}>{children}</div>
);

export default ScrollReveal;
