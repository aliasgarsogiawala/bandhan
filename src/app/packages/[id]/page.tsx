import type { Metadata } from "next";
import PackageRouteClient from "@/components/packages/PackageRouteClient";
import {
  getAllPackageIds,
  getFullPackage,
} from "@/data/packageDetails";

interface PackagePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllPackageIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { id } = await params;
  const pkg = getFullPackage(id);
  if (!pkg) {
    return { title: "Package Not Found | Bandhan Tours" };
  }
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
  return <PackageRouteClient id={id} />;
}
