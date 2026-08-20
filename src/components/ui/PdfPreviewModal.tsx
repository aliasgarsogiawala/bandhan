"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, ExternalLink, X } from "lucide-react";

interface PdfPreviewModalProps {
  isOpen: boolean;
  title: string;
  url: string;
  downloadUrl: string;
  onClose: () => void;
}

export default function PdfPreviewModal({
  isOpen,
  title,
  url,
  downloadUrl,
  onClose,
}: PdfPreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-preview-title"
      className="fixed inset-0 z-[120] flex flex-col bg-ink-deep/95 p-3 sm:p-6"
    >
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[8px] border border-white/15 bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-primary/10 bg-primary px-4 py-3 text-white sm:px-5">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold">Exact download preview</p>
            <h2 id="pdf-preview-title" className="truncate font-heading text-base font-bold sm:text-lg">{title}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a href={url} target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-[5px] border border-white/20 px-3 py-2 text-xs font-bold hover:border-gold hover:text-gold sm:inline-flex">
              <ExternalLink size={14} /> Open
            </a>
            <a href={downloadUrl} className="inline-flex items-center gap-2 rounded-[5px] bg-gold px-3 py-2 text-xs font-bold text-primary hover:bg-gold-light">
              <Download size={14} /> Download
            </a>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close PDF preview" className="flex h-9 w-9 items-center justify-center rounded-[5px] border border-white/20 hover:border-gold hover:text-gold">
              <X size={17} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 bg-sand-bg p-2 sm:p-3">
          <iframe
            src={`${url}#toolbar=1&navpanes=0&view=FitH`}
            title={`${title} PDF preview`}
            className="h-full min-h-[70vh] w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
