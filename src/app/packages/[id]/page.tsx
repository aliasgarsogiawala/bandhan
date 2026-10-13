import type { Metadata } from "next";
import PackageRouteClient from "@/components/packages/PackageRouteClient";
import { getFullPackageForPackage } from "@/data/packageDetails";
import { getPublishedPackage } from "@/lib/content/packages";
import { notFound } from "next/navigation";

interface PackagePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { id } = await params;
  const live = await getPublishedPackage(id);
  if (!live) {
    return { title: "Package Not Found | Bandhan Tours" };
  }
  const pkg = getFullPackageForPackage(live);
  return {
    title: `${pkg.title} | Bandhan Tours`,
    description: `${pkg.duration} · from ${pkg.price} — ${pkg.tagline}`,
    openGraph: {
      title: pkg.title,
      description: pkg.tagline,
      images: [{ url: pkg.heroImage }],
    },
  };
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { id } = await params;
  const pkg = await getPublishedPackage(id);
  if (!pkg) notFound();
  return <PackageRouteClient id={id} initialPackage={pkg} />;
}
