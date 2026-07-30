import Fuse, { type IFuseOptions } from "fuse.js";

const DEFAULT_OPTIONS: IFuseOptions<unknown> = {
  threshold: 0.38,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/** Typo-tolerant, ranked search over a list of items by the given keys. */
export function fuzzySearch<T>(items: T[], query: string, keys: (keyof T | string)[]): T[] {
  const trimmed = query.trim();
  if (!trimmed) return items;
  const fuse = new Fuse(items, { ...DEFAULT_OPTIONS, keys: keys as string[] });
  return fuse.search(trimmed).map((result) => result.item);
}

/** Same as fuzzySearch, but keeps Fuse's match score (0 = perfect) so callers
 * can require a confident match before acting on it. */
export function fuzzySearchScored<T>(
  items: T[],
  query: string,
  keys: (keyof T | string)[],
  limit = 5
): { item: T; score: number }[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const fuse = new Fuse(items, { ...DEFAULT_OPTIONS, keys: keys as string[] });
  return fuse
    .search(trimmed, { limit })
    .map((result) => ({ item: result.item, score: result.score ?? 1 }));
}
