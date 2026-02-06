import { Entry, Itinerary } from "./types";
import { SEED_ENTRIES } from "@/data/seed";

const ITINERARIES_KEY = "wtp_itineraries_v1";
const ENTRIES_KEY = "wtp_entries_v1";

export function loadEntries(): Entry[] {
  if (typeof window === "undefined") return SEED_ENTRIES;

  const raw = localStorage.getItem(ENTRIES_KEY);
  if (!raw) return SEED_ENTRIES;

  return [...SEED_ENTRIES, ...JSON.parse(raw)];
}

export function saveEntries(entries: Entry[]): void {
  if (typeof window === "undefined") return;
  // Only save custom entries (filter out seed entries)
  const customEntries = entries.filter((e) => !e.id.startsWith("seed_"));
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(customEntries));
}

export function loadItineraries(): Itinerary[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ITINERARIES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveItineraries(itineraries: Itinerary[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ITINERARIES_KEY, JSON.stringify(itineraries));
}
