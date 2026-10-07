"use client";

import React, { useMemo } from "react";
import PackageDetailClient from "./PackageDetailClient";
import type { TourPackage } from "@/data/mockData";
import { getFullPackageForPackage } from "@/data/packageDetails";
import { useCollection } from "@/lib/admin/store";
import NotFoundView from "@/components/notFound/NotFoundView";

export default function PackageRouteClient({ id }: { id: string }) {
  const { items, ready } = useCollection<TourPackage>("packages");
  const pkg = useMemo(() => items.find((item) => item.id === id && item.status !== "draft"), [items, id]);
  const related = useMemo(() => items.filter((item) => item.id !== id && item.status !== "draft").slice(0, 3), [items, id]);

  if (!pkg) {
    // Packages added in the admin only exist in the live data, so wait for it
    // before declaring this one missing.
    if (!ready) return <main className="min-h-screen bg-sand" aria-busy="true" />;
    return (
      <NotFoundView
        title="This itinerary hasn't been charted yet."
        description="This package may have been retired or isn't published yet. All our current journeys are on the packages page."
        primaryHref="/packages"
        primaryLabel="Browse all packages"
      />
    );
  }

  return <PackageDetailClient pkg={getFullPackageForPackage(pkg)} relatedPackages={related} />;
}
