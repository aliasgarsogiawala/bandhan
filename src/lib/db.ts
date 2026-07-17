import { neon } from "@neondatabase/serverless";

/**
 * Neon (serverless Postgres) client.
 *
 * Uses the HTTP driver, which needs no connection pooling or WebSockets and
 * works cleanly inside Next.js route handlers. The connection string comes from
 * the DATABASE_URL env var — copy it from the Neon dashboard into .env.local.
 */
type NeonSql = ReturnType<typeof neon>;

let cached: NeonSql | null = null;

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql(): NeonSql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local."
    );
  }
  if (!cached) cached = neon(url);
  return cached;
}
