import React from "react";

/**
 * Layout primitives that used to drive sequenced scroll reveals.
 *
 * The motion is gone by design — sections now paint as solid, finished blocks
 * rather than assembling themselves as you scroll. The components remain as
 * plain elements so the existing markup keeps its semantic grouping (and its
 * `as` choices: ul/li, article, section) without every call site changing.
 */

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
  return <Tag className={className}>{children}</Tag>;
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
  return <Tag className={className}>{children}</Tag>;
}

export function FadeIn({ children, className = "", as = "div" }: StaggerProps & { y?: number }) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}

export default Stagger;
