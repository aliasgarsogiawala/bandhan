import { neon } from "@neondatabase/serverless";
import { featuredPackages } from "../src/data/mockData";

const ids = new Set([
  "swiss-paris-highlights",
  "best-of-austria",
  "classic-italy",
  "london-edinburgh-bliss",
  "paris-swiss-delights",
  "splendid-germany",
  "turkish-wonders",
  "south-african-delights",
  "japan-autumn-delights",
  "scandinavia-northern-lights",
  "best-of-georgia",
  "best-of-europe-2027",
  "azerbaijan-highlights",
  "almaty-bliss",
]);

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const sql = neon(url);
  const packages = featuredPackages.filter((pkg) => ids.has(pkg.id));
  console.log(`Upserting ${packages.length} packages...`);

  for (const pkg of packages) {
    const payload = JSON.stringify(pkg);
    await sql`
      INSERT INTO site_content (collection_key, item_id, data, sort_order)
      VALUES (
        'packages',
        ${pkg.id},
        ${payload}::jsonb,
        COALESCE((SELECT MAX(sort_order) + 1 FROM site_content WHERE collection_key = 'packages'), 0)
      )
      ON CONFLICT (collection_key, item_id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
    console.log(`✓ ${pkg.id} — ${pkg.title} (${pkg.price})`);
  }

  const idList = [...ids];
  const verify = await sql`
    SELECT item_id, data->>'title' AS title, data->>'price' AS price, data->>'brochureUrl' AS brochure
    FROM site_content
    WHERE collection_key = 'packages' AND item_id = ANY(${idList})
    ORDER BY item_id
  `;
  console.log("\nVerified in DB:");
  for (const row of verify) {
    console.log(`  ${row.item_id}: ${row.title} | ${row.price} | ${row.brochure}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
