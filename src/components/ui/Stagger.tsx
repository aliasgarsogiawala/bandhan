"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Shared motion primitives for editorial, sequenced reveals.
 * Used across the home page so sections animate with one consistent rhythm
 * instead of each section popping in as a single block.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /** delay before the sequence starts, in seconds */
  delay?: number;
  /** time between each child animating in, in seconds */
  stagger?: number;
  /** render as a different element (e.g. ul, div, section) */
  as?: "div" | "ul" | "ol" | "section";
  /** viewport amount that must be visible before triggering */
  amount?: number;
}

export function Stagger({
  children,
  className = "",
  delay = 0,
  stagger = 0.08,
  as = "div",
  amount = 0.2,
}: StaggerProps) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: reduce ? 0 : stagger,
      },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  /** distance to travel up, in px */
  y?: number;
  as?: "div" | "li" | "article" | "span";
}

export function StaggerItem({ children, className = "", y = 24, as = "div" }: StaggerItemProps) {
  const reduce = useReducedMotion();

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag className={className} variants={item}>
      {children}
    </MotionTag>
  );
}

/**
 * A single element that fades + rises into view on scroll.
 * Convenience wrapper for one-off blocks that aren't inside a Stagger.
 */
export function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 24,
  as = "div",
  amount = 0.2,
}: StaggerProps & { y?: number }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as "div"];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

export default Stagger;
