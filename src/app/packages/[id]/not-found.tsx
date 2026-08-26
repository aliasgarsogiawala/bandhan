import Link from "next/link";
import PageShell from "@/components/ui/PageShell";

export default function PackageNotFound() {
  return (
    <PageShell
      tone="sand"
      offsetTop
      mainClassName="flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      <span className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
        404 — Off the Map
      </span>
      <h1 className="max-w-xl font-heading text-3xl font-extrabold leading-tight text-primary sm:text-4xl">
        This itinerary hasn&apos;t been charted yet
      </h1>
      <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-foreground-muted sm:text-base">
        The package you&apos;re looking for doesn&apos;t exist or may have been
        retired. Our current journeys are all listed on the packages page.
      </p>
      <Link
        href="/packages"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-primary-light"
      >
        Browse All Packages
      </Link>
    </PageShell>
  );
}
