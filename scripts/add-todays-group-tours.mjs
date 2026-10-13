import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const BANDHAN_PROJECT = "prj_3CDeN51vXvFC2Hk3oM23zhd6zB2M";

async function main() {
  const args = process.argv.slice(2);
  const date = args[args.indexOf("--date") + 1];
  if (!args.includes("--date") || !/^\d{4}-\d{2}-\d{2}$/.test(date || "")) throw new Error("Supply --date YYYY-MM-DD (India time).");
  const midnight = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(midnight.getTime()) || midnight.toISOString().slice(0, 10) !== date) throw new Error("Invalid calendar date.");
  let projectId = process.env.VERCEL_PROJECT_ID || process.env.BANDHAN_GROUP_PROJECT_ID;
  if (!projectId) {
    projectId = JSON.parse(readFileSync(new URL("../.vercel/project.json", import.meta.url), "utf8")).projectId;
  }
  if (projectId !== BANDHAN_PROJECT) throw new Error("This operation requires the Bandhan Tours project.");
  if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL || "")) throw new Error("Bandhan production database credentials are unavailable.");
  const sql = neon(process.env.DATABASE_URL);
  const start = new Date(`${date}T00:00:00+05:30`).toISOString();
  const end = new Date(Date.parse(start) + 86_400_000).toISOString();
  // Editors may fill in an existing template, so include records saved today as well as newly created ones.
  const today = await sql`
    SELECT item_id, data->>'title' AS title, data->>'status' AS status, data->'travelStyles' AS styles
    FROM site_content
    WHERE collection_key = 'packages'
      AND ((created_at >= ${start}::timestamptz AND created_at < ${end}::timestamptz)
        OR (updated_at >= ${start}::timestamptz AND updated_at < ${end}::timestamptz))
    ORDER BY sort_order
  `;
  console.log(JSON.stringify({ date, matchingPackages: today.length, packages: today }, null, 2));
  if (!args.includes("--apply") || !today.length) return;
  const ids = today.map((row) => row.item_id);
  const changed = await sql`
    UPDATE site_content
    SET data = jsonb_set(data, '{travelStyles}',
      (CASE WHEN jsonb_typeof(data->'travelStyles') = 'array' THEN data->'travelStyles' ELSE '[]'::jsonb END) || '["group"]'::jsonb),
      updated_at = now()
    WHERE collection_key = 'packages' AND item_id = ANY(${ids}::text[])
      AND NOT COALESCE(data->'travelStyles' @> '["group"]'::jsonb, false)
    RETURNING item_id, data->>'title' AS title
  `;
  const verified = await sql`
    SELECT count(*)::int AS total, count(*) FILTER (WHERE data->'travelStyles' @> '["group"]'::jsonb)::int AS grouped
    FROM site_content WHERE collection_key = 'packages' AND item_id = ANY(${ids}::text[])
  `;
  if (verified[0].total !== ids.length || verified[0].grouped !== ids.length) throw new Error("Group membership verification failed.");
  console.log(JSON.stringify({ changed, allGrouped: verified[0].grouped }));
}

main().catch(() => {
  // Driver errors may contain connection credentials.
  console.error("Bandhan group update failed. Check the project, date and database availability.");
  process.exitCode = 1;
});
