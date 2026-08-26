/**
 * Stand-in photography for catalogue entries that haven't had their own
 * artwork uploaded yet.
 *
 * Two rules make these safe to use in a server-rendered app:
 *
 *   1. Selection is **deterministic** — derived from a seed string (usually the
 *      record id), never from `Math.random()` or the clock. The server and the
 *      client therefore pick the same picture and hydration stays quiet.
 *   2. Selection is **spread** — consecutive slots for one seed walk the pool
 *      with a co-prime stride, so a padded gallery never repeats a frame until
 *      the pool is exhausted.
 *
 * Replace the pool with real photography and every fallback updates at once.
 */

const POOL = [
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1502085671122-2d218cd434e6?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=85&w=1800",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1800",
] as const;

/** Co-prime with the pool length, so stepping by it visits every frame. */
const STRIDE = 5;

const CAPTIONS = [
  "On the road",
  "Views along the way",
  "Local colour",
  "A quiet moment",
  "Where the route leads",
  "Golden hour",
] as const;

/** FNV-1a — small, stable, and identical on server and client. */
function hash(seed: string): number {
  let value = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    value ^= seed.charCodeAt(i);
    value = Math.imul(value, 0x01000193);
  }
  return value >>> 0;
}

/** A stable stand-in photograph for `seed`. `index` walks the pool. */
export function placeholderImage(seed: string, index = 0): string {
  return POOL[(hash(seed) + index * STRIDE) % POOL.length];
}

/** A stable stand-in caption, so padded gallery tiles aren't all "Untitled". */
export function placeholderCaption(seed: string, index = 0): string {
  return CAPTIONS[(hash(seed) + index) % CAPTIONS.length];
}

export interface GallerySlide {
  image: string;
  caption: string;
  /**
   * Set on tiles this module invented. The web gallery is happy to show them —
   * they exist to close its grid — but documents that speak for the trip (the
   * brochure) should prefer the real photography and ignore these.
   */
  placeholder?: boolean;
}

/**
 * Pads a gallery out to `size` tiles with stand-in photography.
 *
 * The detail-page grid lays the first tile out 2×2 in a 3-column track, so a
 * gallery needs a multiple of three to close cleanly — anything else leaves a
 * hole in the bottom-right. Six is the default: two full rows.
 */
export function padGallery(
  gallery: GallerySlide[] | undefined,
  seed: string,
  size = 6
): GallerySlide[] {
  const slides = (gallery ?? []).filter((slide) => Boolean(slide?.image));
  if (slides.length >= size) return slides;

  const used = new Set(slides.map((slide) => slide.image));
  const padded = [...slides];
  // Bounded by the pool: once every frame is used the gallery stops growing
  // rather than repeating itself.
  for (let index = 0; padded.length < size && index < POOL.length; index += 1) {
    const image = placeholderImage(seed, index);
    if (used.has(image)) continue;
    used.add(image);
    padded.push({ image, caption: placeholderCaption(seed, padded.length), placeholder: true });
  }
  return padded;
}
