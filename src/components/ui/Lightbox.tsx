"use client";

import React, { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxSlide {
  image: string;
  title?: string;
  caption?: string;
}

interface LightboxProps {
  slides: LightboxSlide[];
  /** Index of the open slide, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Full-screen image viewer.
 *
 * Deliberately has no entrance animation, in line with the rest of the site —
 * it appears immediately rather than fading or scaling in.
 *
 * Navigation wraps at both ends so arrow keys never dead-end, and the whole
 * thing is keyboard-operable: Escape closes, arrows move, and Tab is trapped
 * inside the dialog so focus cannot wander into the page behind it.
 */
export const Lightbox: React.FC<LightboxProps> = ({ slides, index, onClose, onNavigate }) => {
  const isOpen = index !== null && index >= 0 && index < slides.length;
  // Portalling requires the DOM, so hold off until after hydration.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Where focus came from, so it can be handed back on close.
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (index === null || slides.length === 0) return;
      onNavigate((index + delta + slides.length) % slides.length);
    },
    [index, slides.length, onNavigate]
  );

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    // The page behind must not scroll under the viewer. Padding compensates for
    // the scrollbar that hiding overflow removes, so the layout does not jump.
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      restoreFocusRef.current?.focus();
    };
  }, [isOpen, go, onClose]);

  if (!isOpen || !mounted) return null;

  const slide = slides[index];
  const hasMultiple = slides.length > 1;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={slide.title ? `${slide.title} — enlarged view` : "Enlarged image"}
      className="fixed inset-0 z-[80] flex flex-col bg-ink-deep/96"
      // Clicking the backdrop closes; clicks that originate on the figure below
      // stop there, so dragging or selecting inside the image never closes it.
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
          {hasMultiple ? `${index + 1} / ${slides.length}` : ""}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold hover:bg-gold hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X size={20} />
        </button>
      </div>

      <div
        className="flex min-h-0 flex-1 items-center justify-center gap-2 px-3 pb-4 sm:gap-5 sm:px-8"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        {hasMultiple && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold hover:bg-gold hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:flex"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <figure className="flex min-h-0 max-w-5xl flex-1 flex-col items-center">
          <div className="relative h-[62vh] w-full sm:h-[72vh]">
            <Image
              src={slide.image}
              alt={slide.title || ""}
              fill
              sizes="(max-width: 640px) 100vw, 80vw"
              quality={90}
              className="object-contain"
              priority
            />
          </div>
          {(slide.title || slide.caption) && (
            <figcaption className="mt-5 text-center">
              {slide.caption && (
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-gold">
                  {slide.caption}
                </span>
              )}
              {slide.title && (
                <span className="mt-1.5 block font-heading text-lg font-bold text-white sm:text-2xl">
                  {slide.title}
                </span>
              )}
            </figcaption>
          )}
        </figure>

        {hasMultiple && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold hover:bg-gold hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:flex"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {hasMultiple && (
        <div className="flex items-center justify-center gap-3 pb-5 sm:hidden">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next image"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};

export default Lightbox;
