import "server-only";

import { getSql } from "@/lib/db";
import { seedForCollection } from "./seeds";
import type { CollectionKey, WithId } from "@/lib/admin/types";

const COLLECTIONS: CollectionKey[] = [
  "destinations",
  "packages",
  "testimonials",
  "gallery",
  "features",
  "blog",
  "banners",
  "announcements",
  "enquiries",
];

export function isCollectionKey(value: string): value is CollectionKey {
  return COLLECTIONS.includes(value as CollectionKey);
}

async function ensureSeeded(key: CollectionKey) {
  const seeds = seedForCollection(key);
  if (seeds.length === 0) return;
  const sql = getSql();
  const payload = JSON.stringify(seeds);
  await sql`
    INSERT INTO site_content (collection_key, item_id, data, sort_order)
    SELECT
      ${key},
      item->>'id',
      item,
      (ordinality - 1)::int
    FROM jsonb_array_elements(${payload}::jsonb) WITH ORDINALITY AS seed(item, ordinality)
    ON CONFLICT (collection_key, item_id) DO NOTHING
  `;
}

export async function listContent<T extends WithId = WithId>(key: CollectionKey): Promise<T[]> {
  await ensureSeeded(key);
  const sql = getSql();
  const rows = (await sql`
    SELECT data
    FROM site_content
    WHERE collection_key = ${key}
    ORDER BY sort_order ASC, created_at ASC
  `) as Array<{ data: T }>;
  return rows.map((row) => row.data);
}

export async function listPublicContent<T extends WithId = WithId>(
  key: Exclude<CollectionKey, "enquiries">
): Promise<T[]> {
  const items = await listContent<T>(key);
  return items.filter((item) => {
    const data = item as Record<string, unknown>;
    if (data.status === "draft") return false;
    if (key === "blog" && data.isPublished === false) return false;
    if ((key === "banners" || key === "announcements") && data.isActive === false) return false;
    if (key === "announcements") {
      const now = Date.now();
      const startsAt = typeof data.startsAt === "string" && data.startsAt ? Date.parse(data.startsAt) : null;
      const endsAt = typeof data.endsAt === "string" && data.endsAt ? Date.parse(data.endsAt) : null;
      if (startsAt && startsAt > now) return false;
      if (endsAt && endsAt < now) return false;
    }
    return true;
  });
}

export async function createContentItem<T extends WithId>(
  key: CollectionKey,
  item: T
): Promise<T> {
  await ensureSeeded(key);
  const sql = getSql();
  const payload = JSON.stringify(item);
  const rows = (await sql`
    INSERT INTO site_content (collection_key, item_id, data, sort_order)
    VALUES (
      ${key}, ${item.id}, ${payload}::jsonb,
      COALESCE((SELECT MAX(sort_order) + 1 FROM site_content WHERE collection_key = ${key}), 0)
    )
    ON CONFLICT (collection_key, item_id)
    DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    RETURNING data
  `) as Array<{ data: T }>;
  return rows[0].data;
}

export async function updateContentItem<T extends WithId>(
  key: CollectionKey,
  id: string,
  patch: Partial<T>
): Promise<T | null> {
  await ensureSeeded(key);
  const sql = getSql();
  const patchJson = JSON.stringify(patch);
  const rows = (await sql`
    UPDATE site_content
    SET data = data || ${patchJson}::jsonb || jsonb_build_object('id', item_id), updated_at = now()
    WHERE collection_key = ${key} AND item_id = ${id}
    RETURNING data
  `) as Array<{ data: T }>;
  return rows[0]?.data ?? null;
}

export async function deleteContentItem(key: CollectionKey, id: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    DELETE FROM site_content
    WHERE collection_key = ${key} AND item_id = ${id}
    RETURNING item_id
  `) as Array<{ item_id: string }>;
  return rows.length > 0;
}

export async function listCustomerEnquiries(userId: string) {
  const sql = getSql();
  const rows = (await sql`
    SELECT data
    FROM site_content
    WHERE collection_key = 'enquiries' AND data->>'userId' = ${userId}
    ORDER BY created_at DESC
  `) as Array<{ data: WithId }>;
  return rows.map((row) => row.data);
}
