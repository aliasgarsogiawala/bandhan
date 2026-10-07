import NotFoundView from "@/components/notFound/NotFoundView";

export default function PackageNotFound() {
  return (
    <NotFoundView
      title="This itinerary hasn't been charted yet."
      description="The package you're looking for doesn't exist or may have been retired. All our current journeys are on the packages page."
      primaryHref="/packages"
      primaryLabel="Browse all packages"
    />
  );
}
