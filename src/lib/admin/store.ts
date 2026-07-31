"use client";

import { useSyncExternalStore } from "react";
import {
  destinations,
  featuredPackages,
  testimonials,
  galleryImages,
  whyChooseUs,
  blogPosts,
} from "@/data/mockData";
import type { CollectionKey, Enquiry, WithId } from "./types";

const PREFIX = "bandhan_admin:";
const SEED_FLAG = `${PREFIX}seeded:v1`;
const PACKAGE_CATALOGUE_FLAG = `${PREFIX}packages:public-catalogue-v1`;

const sampleEnquiries: Enquiry[] = [
  {
    id: "enq-sample-1",
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    phone: "+91 98200 11223",
    destination: "Kashmir",
    travelMonth: "September 2026",
    guests: "2",
    message: "Looking for a romantic 6-day Kashmir package with houseboat stay.",
    source: "enquiry-modal",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "enq-sample-2",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+91 99870 55667",
    destination: "Singapore",
    subject: "Group Tour",
    message: "Corporate group of 12 people for a 5-day Singapore trip in November.",
    source: "contact-page",
    status: "contacted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

// Seed data for every collection, sourced from the existing site content.
const seeds: Record<CollectionKey, WithId[]> = {
  destinations: destinations as unknown as WithId[],
  packages: featuredPackages as unknown as WithId[],
  testimonials: testimonials as unknown as WithId[],
  gallery: galleryImages as unknown as WithId[],
  features: whyChooseUs as unknown as WithId[],
  blog: blogPosts as unknown as WithId[],
  enquiries: sampleEnquiries as unknown as WithId[],
};

const listeners = new Map<CollectionKey, Set<() => void>>();

// Cached snapshots keep object identity stable between writes, which
// useSyncExternalStore requires (a fresh array every read would loop forever).
const snapshots = new Map<CollectionKey, WithId[]>();

function emit(key: CollectionKey) {
  listeners.get(key)?.forEach((cb) => cb());
}

function subscribe(key: CollectionKey, cb: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(cb);
  const onStorage = (event: StorageEvent) => {
    if (event.key === PREFIX + key) {
      snapshots.delete(key);
      cb();
    }
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.get(key)?.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

function ensureSeeded() {
  if (typeof window === "undefined") return;
  // Replace the outdated browser seed once with the catalogue extracted from
  // the supplied package documents.
  if (!localStorage.getItem(PACKAGE_CATALOGUE_FLAG)) {
    localStorage.setItem(PREFIX + "packages", JSON.stringify(seeds.packages));
    snapshots.delete("packages");
    localStorage.setItem(PACKAGE_CATALOGUE_FLAG, "1");
  }
  if (localStorage.getItem(SEED_FLAG)) return;
  (Object.keys(seeds) as CollectionKey[]).forEach((k) => {
    if (!localStorage.getItem(PREFIX + k)) {
      localStorage.setItem(PREFIX + k, JSON.stringify(seeds[k]));
    }
  });
  localStorage.setItem(SEED_FLAG, "1");
}

function genId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function read<T extends WithId = WithId>(key: CollectionKey): T[] {
  if (typeof window === "undefined") return seeds[key] as T[];
  ensureSeeded();
  const raw = localStorage.getItem(PREFIX + key);
  if (!raw) return seeds[key] as T[];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return seeds[key] as T[];
  }
}

function write(key: CollectionKey, items: WithId[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + key, JSON.stringify(items));
  snapshots.set(key, items);
  emit(key);
}

/** Returns a reference-stable snapshot for useSyncExternalStore. */
function getSnapshot<T extends WithId>(key: CollectionKey): T[] {
  if (!snapshots.has(key)) snapshots.set(key, read(key));
  return snapshots.get(key) as T[];
}

export const store = {
  read,
  subscribe,
  add(key: CollectionKey, item: Record<string, unknown> & { id?: string }): WithId {
    const created = { ...item, id: (item.id as string) || genId() } as WithId;
    write(key, [created, ...read(key)]);
    return created;
  },
  update<T extends WithId = WithId>(key: CollectionKey, id: string, patch: Partial<T>) {
    write(
      key,
      read(key).map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  },
  remove(key: CollectionKey, id: string) {
    write(
      key,
      read(key).filter((item) => item.id !== id)
    );
  },
  resetAll() {
    if (typeof window === "undefined") return;
    (Object.keys(seeds) as CollectionKey[]).forEach((k) => write(k, [...seeds[k]]));
  },
};

/**
 * Subscribe a component to a collection. Server render + hydration use the
 * deterministic seed (so markup matches); after hydration the client reads the
 * persisted localStorage data and stays in sync with future edits.
 */
export function useCollection<T extends WithId = WithId>(key: CollectionKey): {
  items: T[];
  ready: boolean;
} {
  const items = useSyncExternalStore<T[]>(
    (cb) => subscribe(key, cb),
    () => getSnapshot<T>(key),
    () => seeds[key] as T[]
  );
  return { items, ready: true };
}
