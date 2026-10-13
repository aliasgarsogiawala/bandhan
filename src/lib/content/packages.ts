import "server-only";
import { cache } from "react";
import { featuredPackages, type TourPackage } from "@/data/mockData";
import { isDbConfigured } from "@/lib/db";
import { listPublicContent } from "./db";

// Metadata and the page share a single live read within the request.
const publishedPackages = cache(async () => isDbConfigured()
  ? listPublicContent<TourPackage>("packages")
  : featuredPackages.filter((pkg) => pkg.status !== "draft"));

export async function getPublishedPackage(id: string) {
  return (await publishedPackages()).find((pkg) => pkg.id === id) ?? null;
}
