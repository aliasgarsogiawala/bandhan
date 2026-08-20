const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(
  value: string | undefined,
  options: { assumeHttps?: boolean } = {}
): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(
      options.assumeHttps && !/^https?:\/\//i.test(candidate)
        ? `https://${candidate}`
        : candidate
    );
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

export const siteUrl =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL, { assumeHttps: true }) ||
  normalizeSiteUrl(process.env.VERCEL_URL, { assumeHttps: true }) ||
  DEFAULT_SITE_URL;
