// Applies db/schema.sql to your Neon database.
// Usage: npm run db:migrate   (loads DATABASE_URL from .env.local or the shell)

import { neon } from "@neondatabase/serverless";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// Minimal .env loader so the script works without extra dependencies.
for (const file of [".env.local", ".env"]) {
  const path = join(root, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "\n✗ DATABASE_URL is not set.\n  Add it to .env.local (see .env.example) or export it, then re-run `npm run db:migrate`.\n"
  );
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync(join(root, "db", "schema.sql"), "utf8");
const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s && !s.startsWith("--"));

try {
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`\n✓ Database ready — applied ${statements.length} statements.\n`);
} catch (error) {
  console.error("\n✗ Migration failed:", error.message, "\n");
  process.exit(1);
}
