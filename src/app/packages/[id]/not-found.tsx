import Link from "next/link";

export default function PackageNotFound() {
  return (
    <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-6 text-center">
      <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
        404 — Off the Map
      </span>
      <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-primary max-w-xl leading-tight">
        This itinerary hasn&apos;t been charted yet
      </h1>
      <p className="mt-4 text-foreground-muted font-sans max-w-md text-sm sm:text-base leading-relaxed">
        The package you&apos;re looking for doesn&apos;t exist or may have been
        retired. Our current journeys are all listed on the packages page.
      </p>
      <Link
        href="/packages"
        className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary-light transition-colors duration-300"
      >
        Browse All Packages
      </Link>
    </div>
  );
}
