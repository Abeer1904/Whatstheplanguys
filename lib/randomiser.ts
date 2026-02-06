import { Entry, Itinerary } from "./types";
import { shuffle, generateId } from "./utils";

export function buildItinerary(
  city: string,
  entries: Entry[],
  mode: Itinerary["mode"],
  vibe: Itinerary["vibe"],
  budget: Itinerary["budget"]
): Itinerary {
  const pool = entries.filter((e) => e.city === city);

  if (pool.length === 0) {
    throw new Error(`No entries found for city: ${city}`);
  }

  const times =
    mode === "night"
      ? ["6:30 pm", "8:30 pm", "10:30 pm"]
      : ["10:00 am", "1:00 pm", "4:30 pm", "7:30 pm"];

  const chosen = shuffle(pool).slice(0, times.length);
  const chosenTimes = times.slice(0, chosen.length);

  return {
    id: generateId(),
    city,
    mode,
    vibe,
    budget,
    createdAt: Date.now(),
    stops: chosen.map((entry, i) => ({
      time: chosenTimes[i] || "",
      entry,
      rationale: "Curated randomness — trust the chaos.",
    })),
  };
}
