/**
 * Hosts whose images go through the Next.js image optimizer. Shared by
 * `next.config.ts` (as `images.remotePatterns`) and `SiteImage`, so the two can
 * never disagree.
 *
 * Images on any other host — e.g. a link the team pasted into the admin Image
 * Manager — are still shown, but loaded straight from their own server rather
 * than optimized, because `next/image` refuses unlisted hosts outright.
 */
export const OPTIMIZED_IMAGE_HOSTS = ["images.unsplash.com", "utfs.io", "*.ufs.sh"] as const;

function hostMatches(hostname: string, pattern: string): boolean {
  if (pattern.startsWith("*.")) {
    const suffix = pattern.slice(1); // ".ufs.sh"
    return hostname.endsWith(suffix) && hostname.length > suffix.length;
  }
  return hostname === pattern;
}

/** True for local paths and https URLs on an optimized host. */
export function canOptimizeImage(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      OPTIMIZED_IMAGE_HOSTS.some((pattern) => hostMatches(url.hostname, pattern))
    );
  } catch {
    return false;
  }
}
