"use client";

import { useEffect, useState } from "react";

export interface RecentSearchEntry {
  id: string;
  label: string;
  destination: string;
  createdAt: string;
}

const STORAGE_KEY = "bandhan_recent_searches";
const UPDATE_EVENT = "bandhan:recent-searches";
const MAX_RECENT_SEARCHES = 6;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function readRecentSearches(): RecentSearchEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentSearchEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecentSearches(items: RecentSearchEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function saveRecentSearch(input: { label: string; destination?: string }) {
  const label = input.label.trim();
  const destination = (input.destination || input.label).trim();
  if (!label || !destination || typeof window === "undefined") return;

  const nextEntry: RecentSearchEntry = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    destination,
    createdAt: new Date().toISOString(),
  };

  const normalizedLabel = normalize(label);
  const normalizedDestination = normalize(destination);
  const deduped = readRecentSearches().filter(
    (item) =>
      normalize(item.label) !== normalizedLabel &&
      normalize(item.destination) !== normalizedDestination
  );

  writeRecentSearches([nextEntry, ...deduped].slice(0, MAX_RECENT_SEARCHES));
}

export function clearRecentSearches() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

export function useRecentSearches() {
  const [items, setItems] = useState<RecentSearchEntry[]>([]);

  useEffect(() => {
    const sync = () => setItems(readRecentSearches());

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(UPDATE_EVENT, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(UPDATE_EVENT, sync);
    };
  }, []);

  return {
    items,
    saveRecentSearch,
    clearRecentSearches,
  };
}
