"use client";

import React from "react";
import PackageDetailClient from "@/components/packages/PackageDetailClient";
import { getFullPackageForPackage } from "@/data/packageDetails";
import type { TourPackage } from "@/data/mockData";

export default function TourPackagePreview({ draft, onClose }: { draft: TourPackage; onClose: () => void }) {
  const preview = getFullPackageForPackage({
    ...draft,
    id: draft.id || "preview-tour",
    image: draft.image || draft.heroImage || "/logo.svg",
    heroImage: draft.heroImage || draft.image || "/logo.svg",
    title: draft.title || "Untitled tour package",
    duration: draft.duration || "Duration to be confirmed",
    price: draft.price || "Enquire",
    highlights: draft.highlights?.length ? draft.highlights : ["A thoughtfully planned journey", "Local experiences", "Flexible travel support"],
  });

  return <div className="fixed inset-0 z-[70] overflow-y-auto bg-primary/70 p-3 backdrop-blur-sm sm:p-6"><div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-sand shadow-2xl"><div className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-8"><div><span className="text-[10px] font-bold uppercase tracking-widest text-accent">Unsaved preview</span><p className="mt-1 text-sm font-semibold text-primary">This is how the tour will appear on the public itinerary page.</p></div><button type="button" onClick={onClose} className="rounded-full border border-primary/15 px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white">Back to editor</button></div><PackageDetailClient pkg={preview} relatedPackages={[]} /></div></div>;
}
