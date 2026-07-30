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
