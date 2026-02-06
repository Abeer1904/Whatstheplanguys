import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  // Converts "2:30 pm" to "2:30 PM"
  return timeStr.toUpperCase();
}

export function groupByCity<T extends { city: string }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const city = item.city;
    if (!acc[city]) acc[city] = [];
    acc[city].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function groupByCategory<T extends { category: string }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function getPriceEmoji(price?: string): string {
  switch (price) {
    case "$":
      return "💰";
    case "$$":
      return "💰💰";
    case "$$$":
      return "💰💰💰";
    case "free":
      return "🆓";
    default:
      return "";
  }
}

export function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    restaurant: "🍽️",
    experience: "🎭",
    thing_to_do: "🎯",
    historical_site: "🏛️",
    bar_cafe: "☕",
    outdoors: "🌳",
    budget: "💵",
    wildcard: "🎲",
  };
  return emojiMap[category] || "📍";
}
