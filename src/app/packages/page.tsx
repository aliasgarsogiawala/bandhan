import { Suspense } from "react";
import type { Metadata } from "next";
import PackagesPageClient from "@/components/packages/PackagesPageClient";

export const metadata: Metadata = {
  title: "Tour Packages | Bandhan Tours",
  description:
    "Browse hand-crafted domestic and international holiday packages — Himalayan escapes, backwater cruises, desert safaris, and island getaways.",
};

export default function PackagesPage() {
  return (
    <Suspense>
      <PackagesPageClient />
    </Suspense>
  );
}
