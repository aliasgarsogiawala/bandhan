"use client";

import { useSyncExternalStore } from "react";
import { seedForCollection } from "@/lib/content/seeds";
import type { CollectionKey, Enquiry, WithId } from "./types";

const listeners = new Map<CollectionKey, Set<() => void>>();
const snapshots = new Map<CollectionKey, WithId[]>();
const readyCollections = new Set<CollectionKey>();
const inFlight = new Map<CollectionKey, Promise<void>>();

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
  const request = fetch(`/api/content/${key}`, { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error(await readError(response, "Could not load content."));
      const data = (await response.json()) as { items?: WithId[] };
      snapshots.set(key, data.items || []);
      readyCollections.add(key);
      emit(key);
    })
    .catch((error) => {
      // Public pages keep their bundled catalogue if the database is down.
      // Admin mutations still surface the actual error to the editor.
      console.error(`refresh ${key} error:`, error);
      readyCollections.add(key);
      emit(key);
    })
    .finally(() => inFlight.delete(key));
  inFlight.set(key, request);
  return request;
}

function subscribe(key: CollectionKey, callback: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(callback);
  if (!readyCollections.has(key)) void refreshCollection(key);
  return () => listeners.get(key)?.delete(callback);
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
  inFlight.delete(key);
  await refreshCollection(key);
  return response.json();
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
  const items = useSyncExternalStore<T[]>(
    (callback) => subscribe(key, callback),
    () => getSnapshot<T>(key),
    () => seedForCollection<T>(key)
  );
  return { items, ready: readyCollections.has(key) };
}
