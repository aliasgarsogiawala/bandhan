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

/**
 * Splits the schema into statements.
 *
 * Comments are stripped first, and only semicolons outside string literals
 * end a statement. Splitting on a bare ";" is not enough: a semicolon inside
 * a comment cuts a statement in half, and a comment sitting above a statement
 * used to make the whole statement look like a comment and be dropped
 * silently — which is how `CREATE EXTENSION pgcrypto` was never being applied.
 */
function splitStatements(source) {
  let sqlText = "";
  let inString = false;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (inString) {
      sqlText += char;
      // '' is an escaped quote inside a string, not the end of one.
      if (char === "'" && source[i + 1] === "'") sqlText += source[++i];
      else if (char === "'") inString = false;
      continue;
    }
    if (char === "'") {
      inString = true;
      sqlText += char;
      continue;
    }
    if (char === "-" && source[i + 1] === "-") {
      while (i < source.length && source[i] !== "\n") i++;
      sqlText += "\n";
      continue;
    }
    sqlText += char;
  }

  const statements = [];
  let current = "";
  inString = false;
  for (let i = 0; i < sqlText.length; i++) {
    const char = sqlText[i];
    if (char === "'") inString = !inString;
    if (char === ";" && !inString) {
      if (current.trim()) statements.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) statements.push(current.trim());
  return statements;
}

const statements = splitStatements(schema);

try {
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log(`\n✓ Database ready — applied ${statements.length} statements.\n`);
} catch (error) {
  console.error("\n✗ Migration failed:", error.message);
  // fetch-based errors (DNS, TLS, connection refused, timeout) hide the real
  // reason in .cause — surface the full chain so it's actually diagnosable.
  let cause = error.cause;
  while (cause) {
    console.error("  caused by:", cause.code || cause.message || cause);
    cause = cause.cause;
  }
  console.error("");
  process.exit(1);
}
