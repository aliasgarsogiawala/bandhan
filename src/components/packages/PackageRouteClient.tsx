"use client";

import React, { useMemo } from "react";
import PackageDetailClient from "./PackageDetailClient";
import type { TourPackage } from "@/data/mockData";
import { getFullPackageForPackage } from "@/data/packageDetails";
import { useCollection } from "@/lib/admin/store";

export default function PackageRouteClient({ id }: { id: string }) {
  const { items } = useCollection<TourPackage>("packages");
  const pkg = useMemo(() => items.find((item) => item.id === id), [items, id]);
  const related = useMemo(() => items.filter((item) => item.id !== id).slice(0, 3), [items, id]);

  if (!pkg) {
    return <main className="min-h-screen flex items-center justify-center bg-sand"><div className="text-center"><p className="text-sm font-bold uppercase tracking-widest text-accent">404</p><h1 className="mt-2 text-3xl font-heading font-extrabold text-primary">Package not found</h1><p className="mt-3 text-sm text-foreground-muted">This itinerary may have been removed or is not published yet.</p></div></main>;
  }

  return <PackageDetailClient pkg={getFullPackageForPackage(pkg)} relatedPackages={related} />;
}
