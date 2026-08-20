import React from "react";

/** Layout primitives with CSS-powered, progressively enhanced scroll motion. */

type Tag = "div" | "ul" | "ol" | "section";
type ItemTag = "div" | "li" | "article" | "span";

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /** Retained for call-site compatibility; no longer used. */
  delay?: number;
  stagger?: number;
  as?: Tag;
  amount?: number;
}

export function Stagger({ children, className = "", as = "div" }: StaggerProps) {
  const Tag = as;
  return <Tag className={`scroll-stagger ${className}`}>{children}</Tag>;
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  /** Retained for call-site compatibility; no longer used. */
  y?: number;
  as?: ItemTag;
}

export function StaggerItem({ children, className = "", as = "div" }: StaggerItemProps) {
  const Tag = as;
  return <Tag className={`scroll-reveal ${className}`}>{children}</Tag>;
}

export function FadeIn({ children, className = "", as = "div" }: StaggerProps & { y?: number }) {
  const Tag = as;
  return <Tag className={`scroll-reveal ${className}`}>{children}</Tag>;
}

export default Stagger;
