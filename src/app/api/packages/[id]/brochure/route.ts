import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { listPublicContent } from "@/lib/content/db";
import { featuredPackages, type Destination, type TourPackage } from "@/data/mockData";
import {
  getFullPackageForDestination,
  getFullPackageForPackage,
  type FullPackage,
} from "@/data/packageDetails";
import {
  packageBrochureFileName,
  renderPackageBrochurePdf,
} from "@/lib/documents/packageBrochurePdf";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Resolves a published trip the same way the package page does: the shared
 * content database is the source of truth when it is configured, with the
 * bundled catalogue as the fallback for local development. Destination guides
 * render through the same detail model, so they get a brochure too.
 */
async function findTrip(id: string): Promise<FullPackage | null> {
  if (isDbConfigured()) {
    try {
      const packages = await listPublicContent<TourPackage>("packages");
      const match = packages.find((item) => item.id === id);
      if (match) return getFullPackageForPackage(match);

      const destinationId = id.startsWith("destination-") ? id.slice("destination-".length) : null;
      if (destinationId) {
        const destinations = await listPublicContent<Destination>("destinations");
        const destination = destinations.find((item) => item.id === destinationId);
        if (destination) return getFullPackageForDestination(destination);
      }
    } catch (error) {
      // A database hiccup shouldn't cost the visitor their brochure when the
      // bundled catalogue can still answer.
      console.error("package brochure lookup failed:", error);
    }
  }

  const bundled = featuredPackages.find((item) => item.id === id && item.status !== "draft");
  return bundled ? getFullPackageForPackage(bundled) : null;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const pkg = await findTrip(id);
  if (!pkg) {
    return NextResponse.json({ ok: false, error: "Trip not found." }, { status: 404 });
  }

  const pdf = await renderPackageBrochurePdf(pkg);
  const download = new URL(request.url).searchParams.get("download") === "1";
  return new NextResponse(pdf as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${packageBrochureFileName(pkg)}"`,
      "Content-Length": String(pdf.byteLength),
      // The catalogue changes rarely and the brochure carries nothing personal.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
