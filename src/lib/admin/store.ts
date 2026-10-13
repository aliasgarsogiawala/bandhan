"use client";

import { useCallback, useSyncExternalStore } from "react";
import { seedForCollection } from "@/lib/content/seeds";
import type { CollectionKey, Enquiry, WithId } from "./types";

const listeners = new Map<CollectionKey, Set<() => void>>();
const snapshots = new Map<CollectionKey, WithId[]>();
const readyCollections = new Set<CollectionKey>();
const inFlight = new Map<CollectionKey, Promise<void>>();
const versions = new Map<CollectionKey, number>();
let updatesChannel: BroadcastChannel | null = null;
let watching = false;

function refreshVisibleCollections() {
  if (document.visibilityState === "hidden") return;
  for (const [key, callbacks] of listeners) {
    if (callbacks.size) void refreshCollection(key);
  }
}

function watchChanges() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  window.addEventListener("focus", refreshVisibleCollections);
  document.addEventListener("visibilitychange", refreshVisibleCollections);
  if (typeof BroadcastChannel !== "undefined") {
    updatesChannel = new BroadcastChannel("bandhan-content-updates");
    updatesChannel.onmessage = (event: MessageEvent<{ key?: CollectionKey }>) => {
      const key = event.data?.key;
      if (key && listeners.get(key)?.size) {
        versions.set(key, (versions.get(key) || 0) + 1);
        inFlight.delete(key);
        void refreshCollection(key);
      }
    };
  }
}

function emit(key: CollectionKey) {
  listeners.get(key)?.forEach((callback) => callback());
}

function getSnapshot<T extends WithId>(key: CollectionKey): T[] {
  return (snapshots.get(key) || seedForCollection(key)) as T[];
}

async function readError(response: Response, fallback: string) {
  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error || fallback;
}

export async function refreshCollection(key: CollectionKey): Promise<void> {
  const existing = inFlight.get(key);
  if (existing) return existing;
  const version = versions.get(key) || 0;
  const request = fetch(`/api/content/${key}`, { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error(await readError(response, "Could not load content."));
      const data = (await response.json()) as { items?: WithId[] };
      if ((versions.get(key) || 0) !== version) return;
      snapshots.set(key, data.items || []);
      readyCollections.add(key);
      emit(key);
    })
    .catch((error) => {
      if ((versions.get(key) || 0) !== version) return;
      // Public pages keep their bundled catalogue if the database is down.
      // Admin mutations still surface the actual error to the editor.
      console.error(`refresh ${key} error:`, error);
      // A new array reference makes useSyncExternalStore re-render, so
      // components waiting on `ready` see the load finish.
      if (!snapshots.has(key)) snapshots.set(key, [...seedForCollection(key)]);
      readyCollections.add(key);
      emit(key);
    })
    .finally(() => {
      if (inFlight.get(key) === request) inFlight.delete(key);
    });
  inFlight.set(key, request);
  return request;
}

export function subscribeToCollection(key: CollectionKey, callback: () => void) {
  watchChanges();
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(callback);
  // Revisit a route with fresh content, even if this tab has loaded the collection before.
  void refreshCollection(key);
  return () => {
    listeners.get(key)?.delete(callback);
    if ([...listeners.values()].every((callbacks) => callbacks.size === 0) && watching) {
      window.removeEventListener("focus", refreshVisibleCollections);
      document.removeEventListener("visibilitychange", refreshVisibleCollections);
      updatesChannel?.close();
      updatesChannel = null;
      watching = false;
    }
  };
}

async function mutate(
  key: CollectionKey,
  method: "POST" | "PATCH" | "DELETE",
  body?: Record<string, unknown>,
  id?: string
) {
  const response = await fetch(
    `/api/content/${key}${method === "DELETE" ? `?id=${encodeURIComponent(id || "")}` : ""}`,
    {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    }
  );
  if (!response.ok) throw new Error(await readError(response, "Could not save content."));
  const result = (await response.json()) as { item?: WithId; removed?: boolean };
  // A GET started before this save must never overwrite the saved item afterwards.
  versions.set(key, (versions.get(key) || 0) + 1);
  inFlight.delete(key);
  const current = getSnapshot(key);
  if (result.item) {
    const item = result.item;
    snapshots.set(key, current.some((value) => value.id === item.id)
      ? current.map((value) => value.id === item.id ? item : value)
      : [...current, item]);
  } else if (method === "DELETE" && result.removed) {
    snapshots.set(key, current.filter((item) => item.id !== id));
  }
  readyCollections.add(key);
  emit(key);
  updatesChannel?.postMessage({ key });
  await refreshCollection(key);
  return result;
}

function genId() {
  return crypto.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const store = {
  read<T extends WithId = WithId>(key: CollectionKey): T[] {
    return getSnapshot<T>(key);
  },
  async add(key: CollectionKey, item: Record<string, unknown> & { id?: string }) {
    const created = { ...item, id: item.id || genId() };
    await mutate(key, "POST", created);
    return created as WithId;
  },
  async update<T extends WithId = WithId>(key: CollectionKey, id: string, patch: Partial<T>) {
    await mutate(key, "PATCH", { id, patch: patch as Record<string, unknown> });
  },
  async remove(key: CollectionKey, id: string) {
    await mutate(key, "DELETE", undefined, id);
  },
};

export async function submitEnquiry(input: Omit<Enquiry, "id" | "status" | "createdAt">) {
  const response = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(await readError(response, "Could not submit your enquiry."));
  return response.json();
}

export function useCollection<T extends WithId = WithId>(key: CollectionKey): {
  items: T[];
  ready: boolean;
} {
  const subscribe = useCallback((callback: () => void) => subscribeToCollection(key, callback), [key]);
  const items = useSyncExternalStore<T[]>(
    subscribe,
    () => getSnapshot<T>(key),
    () => seedForCollection<T>(key)
  );
  return { items, ready: readyCollections.has(key) };
}
