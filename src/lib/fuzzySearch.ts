import Fuse, { type IFuseOptions } from "fuse.js";

const DEFAULT_OPTIONS: IFuseOptions<unknown> = {
  threshold: 0.38,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/** Fields a traveller's place or trip name can appear in, most telling first. */
export const PACKAGE_SEARCH_KEYS = [
  "title",
  "destination",
  "category",
  "themes",
  "itinerary.stay",
  "startingPoint",
  "tagline",
  "highlights",
  "itinerary.title",
  "overview",
];

/** Lower-case, accents stripped, punctuation turned into word breaks. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Resolves "itinerary.stay" through arrays to every string it reaches. */
function valuesAt(source: unknown, path: string[]): string[] {
  if (source == null) return [];
  if (Array.isArray(source)) return source.flatMap((entry) => valuesAt(entry, path));
  if (!path.length) return typeof source === "string" || typeof source === "number" ? [String(source)] : [];
  if (typeof source !== "object") return [];
  return valuesAt((source as Record<string, unknown>)[path[0]], path.slice(1));
}

/**
 * True when `query` (spaces removed) starts at a word boundary of `words`, so
 * "sri lanka" finds "Srilanka", "kera" finds "Kerala", but "inkans" never
 * finds "Shinkansen" the way a free-floating fuzzy match did.
 */
function startsAtWord(words: string[], query: string): boolean {
  const compact = words.join("");
  let offset = 0;
  for (const word of words) {
    if (compact.startsWith(query, offset)) return true;
    offset += word.length;
  }
  return false;
}

function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[b.length];
}

type IndexedItem = string[][][]; // field -> value -> words

function rank(index: IndexedItem[], tokens: string[]): number[] {
  const whole = tokens.join("");
  const scored: { position: number; score: number }[] = [];
  index.forEach((fields, position) => {
    const weight = (field: number) => fields.length - field;
    let score = 0;
    let wholeMatched = false;
    fields.forEach((values, field) => {
      if (values.some((words) => startsAtWord(words, whole))) {
        wholeMatched = true;
        score += weight(field) * 2;
      }
    });
    let everyToken = tokens.length > 1;
    for (const token of tokens) {
      const field = fields.findIndex((values) => values.some((words) => startsAtWord(words, token)));
      if (field === -1) everyToken = false;
      else score += weight(field);
    }
    if (wholeMatched || everyToken) scored.push({ position, score });
  });
  return scored.sort((a, b) => b.score - a.score || a.position - b.position).map((entry) => entry.position);
}

/** Swaps each misspelt word for the closest real word in the catalogue. */
function correctTokens(index: IndexedItem[], tokens: string[]): string[] | null {
  const vocabulary = new Set<string>();
  for (const fields of index) for (const values of fields) for (const words of values) for (const word of words) vocabulary.add(word);
  let changed = false;
  const corrected = tokens.map((token) => {
    if (token.length < 4 || vocabulary.has(token)) return token;
    const allowed = token.length >= 7 ? 2 : 1;
    let best = token;
    let bestDistance = allowed + 1;
    for (const word of vocabulary) {
      if (Math.abs(word.length - token.length) > allowed) continue;
      const distance = editDistance(token, word);
      if (distance < bestDistance) {
        best = word;
        bestDistance = distance;
      }
    }
    if (best !== token) changed = true;
    return best;
  });
  return changed ? corrected : null;
}

/**
 * Ranked catalogue search. Words must match at word starts (earlier keys rank
 * higher); a misspelt word ("kashmeer", "jappan") is corrected to the nearest
 * real catalogue word only when nothing matches as typed.
 */
export function fuzzySearch<T>(items: T[], query: string, keys: (keyof T | string)[]): T[] {
  const tokens = normalizeSearchText(query).split(" ").filter(Boolean);
  if (!tokens.length) return items;
  const index: IndexedItem[] = items.map((item) =>
    keys.map((key) =>
      valuesAt(item, String(key).split(".")).map((value) => normalizeSearchText(value).split(" ").filter(Boolean))
    )
  );
  let positions = rank(index, tokens);
  if (!positions.length) {
    const corrected = correctTokens(index, tokens);
    if (corrected) positions = rank(index, corrected);
  }
  return positions.map((position) => items[position]);
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
