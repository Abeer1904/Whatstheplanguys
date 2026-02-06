"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Send,
  Plus,
  Sparkles,
  Trash2,
  Lock,
  Unlock,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  ExternalLink,
  Utensils,
  Wine,
  Calendar,
  Compass,
  Sun,
  Moon,
  Shuffle,
  Copy,
  IndianRupee,
  Users,
  Wallet,
  User,
  Zap,
  PiggyBank,
  Globe,
  PlusCircle,
} from "lucide-react";

/* ─────────────────  TYPES  ───────────────── */
type LaneKey = "food" | "drinks" | "events" | "activities";
type Vibe = "chill" | "social" | "adventurous" | "romantic" | "solo";
type Mode = "day" | "night";
type WhenPreset = "tonight" | "tomorrow" | "weekend" | "custom";

interface Entry {
  id: string;
  name: string;
  lane: LaneKey;
  city: string;
  neighborhood?: string;
  price?: string;
  estimatedCost?: number; // in rupees
  tags?: string[];
  notes?: string;
  link?: string;
  addedBy?: string; // who suggested this
  createdAt: number;
}

interface BudgetConfig {
  totalBudget: number;
  perPersonBudget: number;
  numPeople: number;
}

interface LaneConfig {
  key: LaneKey;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  color: string;
  emptyHint: string;
}

/* ─────────────────  CONSTANTS  ───────────────── */
const DEFAULT_CITIES = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Jaipur",
];

const LANES: LaneConfig[] = [
  { key: "food", label: "Food", emoji: "🍽️", icon: <Utensils className="w-5 h-5" />, color: "from-orange-500 to-red-500", emptyHint: "Add restaurants, cafes, street food spots" },
  { key: "drinks", label: "Drinks", emoji: "🍸", icon: <Wine className="w-5 h-5" />, color: "from-purple-500 to-pink-500", emptyHint: "Add bars, cafes, chai spots" },
  { key: "events", label: "Events", emoji: "🎭", icon: <Calendar className="w-5 h-5" />, color: "from-blue-500 to-cyan-500", emptyHint: "Add concerts, theatre, exhibitions" },
  { key: "activities", label: "Activities", emoji: "🎯", icon: <Compass className="w-5 h-5" />, color: "from-green-500 to-teal-500", emptyHint: "Add walks, museums, experiences" },
];

const VIBES: { key: Vibe; label: string; emoji: string }[] = [
  { key: "chill", label: "Chill", emoji: "😌" },
  { key: "social", label: "Social", emoji: "🎉" },
  { key: "adventurous", label: "Adventure", emoji: "🚀" },
  { key: "romantic", label: "Romantic", emoji: "💕" },
  { key: "solo", label: "Solo", emoji: "🎧" },
];

const WHEN_PRESETS: { key: WhenPreset; label: string }[] = [
  { key: "tonight", label: "Tonight" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "weekend", label: "This Weekend" },
  { key: "custom", label: "Pick Date" },
];

const MAX_SWAPS_AFTER_LOCK = 2;
const STORAGE_KEY = "whatstheplan_entries";
const BUDGET_KEY = "whatstheplan_budget";
const USER_KEY = "whatstheplan_username";
const CITIES_KEY = "whatstheplan_cities";

/* ─────────────────  SEED DATA  ───────────────── */
const SEED_ENTRIES: Entry[] = [
  // Delhi - Food
  { id: "seed_d_f1", name: "Karim's", lane: "food", city: "Delhi", neighborhood: "Jama Masjid", price: "$$", tags: ["mughlai", "iconic", "group"], link: "https://maps.google.com/?q=Karims+Delhi", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30 },
  { id: "seed_d_f2", name: "Bukhara", lane: "food", city: "Delhi", neighborhood: "Chanakyapuri", price: "$$$$", tags: ["fine dining", "iconic", "dates"], link: "https://maps.google.com/?q=Bukhara+ITC+Maurya", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 29 },
  { id: "seed_d_f3", name: "Paranthe Wali Gali", lane: "food", city: "Delhi", neighborhood: "Chandni Chowk", price: "$", tags: ["street food", "breakfast", "walking"], link: "https://maps.google.com/?q=Paranthe+Wali+Gali", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 28 },
  // Delhi - Drinks
  { id: "seed_d_d1", name: "Hauz Khas Social", lane: "drinks", city: "Delhi", neighborhood: "Hauz Khas", price: "$$", tags: ["rooftop", "trendy", "friends", "sunset"], link: "https://maps.google.com/?q=Hauz+Khas+Social", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 27 },
  { id: "seed_d_d2", name: "PCO", lane: "drinks", city: "Delhi", neighborhood: "Vasant Vihar", price: "$$$", tags: ["speakeasy", "cocktails", "dates"], link: "https://maps.google.com/?q=PCO+Delhi", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 26 },
  { id: "seed_d_d3", name: "Indian Coffee House", lane: "drinks", city: "Delhi", neighborhood: "Connaught Place", price: "$", tags: ["retro", "reading", "solo"], link: "https://maps.google.com/?q=Indian+Coffee+House+Delhi", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25 },
  // Delhi - Events
  { id: "seed_d_e1", name: "Kingdom of Dreams", lane: "events", city: "Delhi", neighborhood: "Gurgaon", price: "$$$", tags: ["theatre", "bollywood", "group"], link: "https://maps.google.com/?q=Kingdom+of+Dreams", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 24 },
  // Delhi - Activities
  { id: "seed_d_a1", name: "India Gate Walk", lane: "activities", city: "Delhi", neighborhood: "Central Delhi", price: "Free", tags: ["outdoor", "iconic", "sunset", "walking"], link: "https://maps.google.com/?q=India+Gate", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 23 },
  { id: "seed_d_a2", name: "Humayun's Tomb", lane: "activities", city: "Delhi", neighborhood: "Nizamuddin", price: "$", tags: ["heritage", "mughal", "green", "slow"], link: "https://maps.google.com/?q=Humayuns+Tomb", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22 },
  { id: "seed_d_a3", name: "Lodhi Garden Walk", lane: "activities", city: "Delhi", neighborhood: "Lodhi", price: "Free", tags: ["outdoor", "green", "morning", "walk"], link: "https://maps.google.com/?q=Lodhi+Garden", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 21 },

  // Mumbai - Food
  { id: "seed_m_f1", name: "Britannia & Co.", lane: "food", city: "Mumbai", neighborhood: "Fort", price: "$$", tags: ["parsi", "iconic", "slow"], link: "https://maps.google.com/?q=Britannia+Mumbai", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20 },
  { id: "seed_m_f2", name: "Trishna", lane: "food", city: "Mumbai", neighborhood: "Fort", price: "$$$", tags: ["seafood", "iconic", "dates"], link: "https://maps.google.com/?q=Trishna+Mumbai", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 19 },
  { id: "seed_m_f3", name: "Bademiya", lane: "food", city: "Mumbai", neighborhood: "Colaba", price: "$", tags: ["street food", "late night", "group"], link: "https://maps.google.com/?q=Bademiya+Colaba", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18 },
  // Mumbai - Drinks
  { id: "seed_m_d1", name: "Colaba Social", lane: "drinks", city: "Mumbai", neighborhood: "Colaba", price: "$$", tags: ["trendy", "cocktails", "friends"], link: "https://maps.google.com/?q=Colaba+Social", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 17 },
  { id: "seed_m_d2", name: "Aer", lane: "drinks", city: "Mumbai", neighborhood: "Worli", price: "$$$$", tags: ["rooftop", "views", "sunset", "dates"], link: "https://maps.google.com/?q=Aer+Four+Seasons+Mumbai", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 16 },
  { id: "seed_m_d3", name: "Prithvi Cafe", lane: "drinks", city: "Mumbai", neighborhood: "Juhu", price: "$", tags: ["artsy", "chill", "reading"], link: "https://maps.google.com/?q=Prithvi+Cafe", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15 },
  // Mumbai - Activities
  { id: "seed_m_a1", name: "Marine Drive Stroll", lane: "activities", city: "Mumbai", neighborhood: "Marine Drive", price: "Free", tags: ["outdoor", "sunset", "walk", "views"], link: "https://maps.google.com/?q=Marine+Drive", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14 },
  { id: "seed_m_a2", name: "Gateway of India", lane: "activities", city: "Mumbai", neighborhood: "Colaba", price: "Free", tags: ["iconic", "heritage", "walking"], link: "https://maps.google.com/?q=Gateway+of+India", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 13 },

  // Bengaluru - Food
  { id: "seed_b_f1", name: "MTR", lane: "food", city: "Bengaluru", neighborhood: "Lalbagh", price: "$", tags: ["south indian", "iconic", "breakfast"], link: "https://maps.google.com/?q=MTR+Bengaluru", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12 },
  { id: "seed_b_f2", name: "Vidyarthi Bhavan", lane: "food", city: "Bengaluru", neighborhood: "Basavanagudi", price: "$", tags: ["dosa", "iconic", "slow"], link: "https://maps.google.com/?q=Vidyarthi+Bhavan", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 11 },
  { id: "seed_b_f3", name: "Karavalli", lane: "food", city: "Bengaluru", neighborhood: "Residency Road", price: "$$$$", tags: ["coastal", "fine dining", "dates"], link: "https://maps.google.com/?q=Karavalli+Bengaluru", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10 },
  // Bengaluru - Drinks
  { id: "seed_b_d1", name: "Toit", lane: "drinks", city: "Bengaluru", neighborhood: "Indiranagar", price: "$$", tags: ["brewery", "iconic", "friends", "group"], link: "https://maps.google.com/?q=Toit+Bengaluru", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9 },
  { id: "seed_b_d2", name: "Third Wave Coffee", lane: "drinks", city: "Bengaluru", neighborhood: "Indiranagar", price: "$$", tags: ["coffee", "specialty", "reading", "solo"], link: "https://maps.google.com/?q=Third+Wave+Coffee+Indiranagar", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8 },
  // Bengaluru - Activities
  { id: "seed_b_a1", name: "Cubbon Park Walk", lane: "activities", city: "Bengaluru", neighborhood: "Central", price: "Free", tags: ["outdoor", "morning", "green", "walk"], link: "https://maps.google.com/?q=Cubbon+Park", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7 },

  // Jaipur - Food
  { id: "seed_j_f1", name: "LMB", lane: "food", city: "Jaipur", neighborhood: "Johari Bazaar", price: "$$", tags: ["rajasthani", "iconic", "group"], link: "https://maps.google.com/?q=LMB+Jaipur", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6 },
  { id: "seed_j_f2", name: "1135 AD", lane: "food", city: "Jaipur", neighborhood: "Amber Fort", price: "$$$$", tags: ["fine dining", "heritage", "dates", "views"], link: "https://maps.google.com/?q=1135+AD+Jaipur", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5 },
  // Jaipur - Drinks
  { id: "seed_j_d1", name: "Bar Palladio", lane: "drinks", city: "Jaipur", neighborhood: "Narain Niwas", price: "$$$", tags: ["aesthetic", "cocktails", "dates", "sunset"], link: "https://maps.google.com/?q=Bar+Palladio", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4 },
  { id: "seed_j_d2", name: "Tapri Central", lane: "drinks", city: "Jaipur", neighborhood: "C-Scheme", price: "$", tags: ["chai", "rooftop", "chill", "friends"], link: "https://maps.google.com/?q=Tapri+Central+Jaipur", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3 },
  // Jaipur - Activities
  { id: "seed_j_a1", name: "Amber Fort", lane: "activities", city: "Jaipur", neighborhood: "Amer", price: "$$", tags: ["heritage", "must-visit", "walking", "trail"], link: "https://maps.google.com/?q=Amber+Fort", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2 },
  { id: "seed_j_a2", name: "Hawa Mahal", lane: "activities", city: "Jaipur", neighborhood: "Pink City", price: "$", tags: ["iconic", "photography", "museum"], link: "https://maps.google.com/?q=Hawa+Mahal", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1 },
];

/* ─────────────────  HELPERS  ───────────────── */
function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [...SEED_ENTRIES];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENTRIES));
    return [...SEED_ENTRIES];
  }
  return JSON.parse(data);
}

function saveEntries(entries: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function loadBudget(): BudgetConfig {
  if (typeof window === "undefined") return { totalBudget: 10000, perPersonBudget: 2500, numPeople: 4 };
  const data = localStorage.getItem(BUDGET_KEY);
  if (!data) return { totalBudget: 10000, perPersonBudget: 2500, numPeople: 4 };
  return JSON.parse(data);
}

function saveBudget(budget: BudgetConfig) {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
}

function loadUsername(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(USER_KEY) || "";
}

function saveUsername(name: string) {
  localStorage.setItem(USER_KEY, name);
}

function priceToEstimate(price?: string): number {
  if (!price) return 500;
  const dollarCount = (price.match(/\$/g) || []).length;
  // Rough per-person estimate in rupees
  if (dollarCount === 1) return 300;
  if (dollarCount === 2) return 800;
  if (dollarCount === 3) return 1500;
  if (dollarCount >= 4) return 3000;
  return 500;
}

function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function loadCities(): string[] {
  if (typeof window === "undefined") return [...DEFAULT_CITIES];
  const data = localStorage.getItem(CITIES_KEY);
  if (!data) {
    localStorage.setItem(CITIES_KEY, JSON.stringify(DEFAULT_CITIES));
    return [...DEFAULT_CITIES];
  }
  return JSON.parse(data);
}

function saveCities(cities: string[]) {
  localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
}

function scoreEntry(entry: Entry, vibe: Vibe, mode: Mode): number {
  let score = Math.random() * 10; // Base randomness
  const tags = new Set((entry.tags || []).map((t) => t.toLowerCase()));

  // Mode scoring
  if (mode === "night") {
    if (entry.lane === "drinks") score += 3;
    if (tags.has("sunset") || tags.has("rooftop") || tags.has("late night")) score += 2;
  } else {
    if (entry.lane === "activities") score += 2;
    if (tags.has("morning") || tags.has("outdoor") || tags.has("heritage")) score += 2;
  }

  // Vibe scoring
  if (vibe === "chill") {
    if (tags.has("slow") || tags.has("green") || tags.has("chill")) score += 3;
    if (entry.lane === "activities" && tags.has("outdoor")) score += 2;
  }
  if (vibe === "social") {
    if (tags.has("friends") || tags.has("group") || tags.has("trendy")) score += 3;
    if (entry.lane === "drinks") score += 2;
  }
  if (vibe === "adventurous") {
    if (tags.has("walking") || tags.has("trail") || tags.has("street food")) score += 3;
    if (entry.lane === "activities") score += 2;
  }
  if (vibe === "romantic") {
    if (tags.has("dates") || tags.has("sunset") || tags.has("views")) score += 3;
    if (tags.has("fine dining") || tags.has("aesthetic")) score += 2;
  }
  if (vibe === "solo") {
    if (tags.has("reading") || tags.has("museum") || tags.has("walk") || tags.has("solo")) score += 3;
    if (entry.lane === "drinks" && tags.has("chill")) score += 2;
  }

  // Iconic bonus
  if (tags.has("iconic")) score += 1;

  return score;
}

function resolveWhenLabel(whenPreset: WhenPreset, whenDate: string): string {
  if (whenPreset === "tonight") return "Tonight";
  if (whenPreset === "tomorrow") return "Tomorrow";
  if (whenPreset === "weekend") return "This Weekend";
  if (whenPreset === "custom" && whenDate) {
    return new Date(whenDate).toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" });
  }
  return "Soon";
}

function planToText(
  city: string,
  selectedLanes: LaneKey[],
  lockedByLane: Record<LaneKey, Entry | null>,
  whenLabel: string,
  vibe: Vibe
): string {
  const lines: string[] = [];
  lines.push(`📍 Whats the Plan Guys? — ${city}`);
  lines.push(`📅 ${whenLabel} • ${VIBES.find(v => v.key === vibe)?.emoji} ${vibe}`);
  lines.push("");

  selectedLanes.forEach((laneKey) => {
    const lane = LANES.find((l) => l.key === laneKey);
    const entry = lockedByLane[laneKey];
    if (lane && entry) {
      lines.push(`${lane.emoji} ${lane.label}: ${entry.name}`);
      if (entry.neighborhood) lines.push(`   📌 ${entry.neighborhood}`);
      if (entry.link) lines.push(`   🔗 ${entry.link}`);
      lines.push("");
    }
  });

  lines.push("Have a good one. Re-roll anytime ✨");
  return lines.join("\n");
}

/* ─────────────────  COMPONENTS  ───────────────── */

function LaneCard({
  lane,
  entries,
  currentIdx,
  isLocked,
  swapCount,
  isFinalised,
  onPrev,
  onNext,
  onToggleLock,
}: {
  lane: LaneConfig;
  entries: Entry[];
  currentIdx: number;
  isLocked: boolean;
  swapCount: number;
  isFinalised: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleLock: () => void;
}) {
  const [dragX, setDragX] = useState(0);
  const currentEntry = entries[currentIdx] || null;
  const changesLeft = MAX_SWAPS_AFTER_LOCK - swapCount;
  const isHardLocked = isLocked && changesLeft <= 0;
  const canSwipe = !isFinalised && !isHardLocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <motion.div
        drag={canSwipe ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDrag={(_, info) => setDragX(info.offset.x)}
        onDragEnd={(_, info) => {
          if (isFinalised) return;
          if (isHardLocked) return;

          const dx = info.offset.x;
          const threshold = 55;
          if (dx < -threshold) onNext();
          if (dx > threshold) onPrev();
          setDragX(0);
        }}
        style={{ x: canSwipe ? dragX : 0 }}
        className={`relative ${canSwipe ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        <Card
          className={`
            backdrop-blur-xl border-2 transition-all duration-300 rounded-2xl overflow-hidden
            ${isLocked 
              ? isHardLocked 
                ? "bg-gray-100/90 border-gray-400 shadow-gray-300" 
                : "bg-purple-100/80 border-purple-400 shadow-purple-200"
              : "bg-white/80 border-white/50"
            }
            ${isFinalised ? "opacity-90" : ""}
            shadow-lg hover:shadow-xl
          `}
        >
          {/* Lane Header */}
          <div className={`bg-gradient-to-r ${lane.color} p-3 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lane.emoji}</span>
                <span className="font-bold text-lg">{lane.label}</span>
              </div>
              {isLocked && (
                <Badge 
                  variant="secondary" 
                  className={`${isHardLocked ? "bg-gray-700" : "bg-white/20"} text-white`}
                >
                  {isHardLocked ? "🔒 Final" : `${changesLeft} swaps left`}
                </Badge>
              )}
            </div>
          </div>

          <CardContent className="p-4">
            {currentEntry ? (
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-gray-800">
                  {currentEntry.name}
                </h3>
                {currentEntry.neighborhood && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {currentEntry.neighborhood}
                  </p>
                )}
                {currentEntry.price && (
                  <span className="inline-block text-sm bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                    {currentEntry.price}
                  </span>
                )}
                {currentEntry.tags && currentEntry.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {currentEntry.tags.slice(0, 4).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-purple-100 text-purple-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {currentEntry.link && !isFinalised && (
                  <a
                    href={currentEntry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View on map
                  </a>
                )}

                {/* Navigation & Lock */}
                {!isFinalised && entries.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        className="rounded-2xl flex-1"
                        onClick={onPrev}
                        disabled={isHardLocked}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Prev
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-2xl flex-1"
                        onClick={onNext}
                        disabled={isHardLocked}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant={isLocked ? "default" : "outline"}
                        className={`w-full rounded-xl ${isLocked ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                        onClick={onToggleLock}
                        disabled={isHardLocked && isLocked}
                      >
                        {!isLocked ? (
                          <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Lock This Pick
                          </>
                        ) : isHardLocked ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Locked (Final)
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Swap ({changesLeft} left)
                          </>
                        )}
                      </Button>
                    </div>

                    {isLocked && !isHardLocked && (
                      <p className="text-xs text-gray-500 text-center mt-1">
                        Locked: <span className="font-medium">{currentEntry.name}</span> • {changesLeft} changes left
                      </p>
                    )}
                    {!isLocked && (
                      <p className="text-xs text-gray-400 text-center mt-1">
                        {entries.length > 1 ? `${currentIdx + 1} of ${entries.length} • Swipe or tap` : "Only 1 option"}
                      </p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-400 font-medium">No picks yet</p>
                <p className="text-sm text-gray-400 mt-1">{lane.emptyHint}</p>
                <p className="text-xs text-gray-400 mt-3">Go to My Spots → Add some ideas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function AddEntryForm({
  onAdd,
  onClose,
  defaultCity,
  cities,
}: {
  onAdd: (entry: Omit<Entry, "id" | "createdAt">) => void;
  onClose: () => void;
  defaultCity: string;
  cities: string[];
}) {
  const [name, setName] = useState("");
  const [lane, setLane] = useState<LaneKey>("food");
  const [city, setCity] = useState<string>(defaultCity);
  const [neighborhood, setNeighborhood] = useState("");
  const [price, setPrice] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [notes, setNotes] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      lane,
      city,
      neighborhood: neighborhood.trim() || undefined,
      price: price.trim() || undefined,
      tags: tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notes: notes.trim() || undefined,
      link: link.trim() || undefined,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Add New Spot
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Restaurant name, bar, activity..."
                className="rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Lane</Label>
                <select
                  value={lane}
                  onChange={(e) => setLane(e.target.value as LaneKey)}
                  className="w-full h-10 rounded-xl border border-input bg-background px-3"
                >
                  {LANES.map((l) => (
                    <option key={l.key} value={l.key}>
                      {l.emoji} {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input
                  id="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Indiranagar, Colaba..."
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="$, $$, $$$..."
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="rooftop, dates, friends, iconic..."
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link (Google Maps, Zomato, etc.)</Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Best on weekends, book ahead..."
                className="rounded-xl resize-none"
                rows={2}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl h-12"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Spot
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* Quick Add - Simple form for friends to quickly add spots */
function QuickAddForm({
  onAdd,
  onClose,
  defaultCity,
  defaultLane,
  username,
}: {
  onAdd: (entry: Omit<Entry, "id" | "createdAt">) => void;
  onClose: () => void;
  defaultCity: string;
  defaultLane: LaneKey;
  username: string;
}) {
  const [name, setName] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      lane: defaultLane,
      city: defaultCity,
      estimatedCost: estimatedCost ? parseInt(estimatedCost) : undefined,
      link: link.trim() || undefined,
      addedBy: username || "Anonymous",
    });
    setName("");
    setEstimatedCost("");
    setLink("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-purple-700">
          <Zap className="w-4 h-4" />
          <span className="font-semibold text-sm">Quick Add</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Place name..."
          className="rounded-xl"
          autoFocus
        />
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="Est. cost pp"
              className="rounded-xl pl-9"
            />
          </div>
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Link (optional)"
            className="rounded-xl flex-1"
          />
        </div>
        <Button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to {LANES.find(l => l.key === defaultLane)?.label}
        </Button>
      </form>
    </motion.div>
  );
}

/* Budget Tracker Component */
function BudgetTracker({
  budget,
  onBudgetChange,
  lockedByLane,
  selectedLanes,
}: {
  budget: BudgetConfig;
  onBudgetChange: (budget: BudgetConfig) => void;
  lockedByLane: Record<LaneKey, Entry | null>;
  selectedLanes: LaneKey[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.totalBudget.toString());
  const [tempPeople, setTempPeople] = useState(budget.numPeople.toString());

  // Calculate estimated total from locked entries
  const estimatedTotal = useMemo(() => {
    return selectedLanes.reduce((sum, laneKey) => {
      const entry = lockedByLane[laneKey];
      if (entry) {
        return sum + (entry.estimatedCost || priceToEstimate(entry.price));
      }
      return sum;
    }, 0);
  }, [lockedByLane, selectedLanes]);

  const totalForGroup = estimatedTotal * budget.numPeople;
  const isOverBudget = totalForGroup > budget.totalBudget;
  const percentUsed = Math.min((totalForGroup / budget.totalBudget) * 100, 100);

  const handleSave = () => {
    const newBudget = parseInt(tempBudget) || 10000;
    const newPeople = parseInt(tempPeople) || 1;
    onBudgetChange({
      totalBudget: newBudget,
      numPeople: newPeople,
      perPersonBudget: Math.round(newBudget / newPeople),
    });
    setIsEditing(false);
  };

  return (
    <Card className="bg-white/20 backdrop-blur-xl border-white/30 rounded-2xl overflow-hidden">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-white">
            <PiggyBank className="w-4 h-4" />
            <span className="font-semibold text-sm">Budget</span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-white/70 hover:text-white"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-white/70">Total Budget</label>
                <div className="relative">
                  <IndianRupee className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/50" />
                  <Input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    className="h-8 rounded-lg bg-white/20 border-white/30 text-white pl-7 text-sm"
                  />
                </div>
              </div>
              <div className="w-20">
                <label className="text-xs text-white/70">People</label>
                <div className="relative">
                  <Users className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/50" />
                  <Input
                    type="number"
                    value={tempPeople}
                    onChange={(e) => setTempPeople(e.target.value)}
                    className="h-8 rounded-lg bg-white/20 border-white/30 text-white pl-7 text-sm"
                    min="1"
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={handleSave}
              className="w-full h-8 text-sm bg-white/20 hover:bg-white/30 text-white rounded-lg"
            >
              Save
            </Button>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="relative h-3 bg-white/20 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentUsed}%` }}
                className={`absolute inset-y-0 left-0 rounded-full ${
                  isOverBudget
                    ? "bg-gradient-to-r from-red-400 to-red-500"
                    : "bg-gradient-to-r from-green-400 to-emerald-500"
                }`}
              />
            </div>

            <div className="flex justify-between text-xs">
              <div className="text-white/90">
                <span className={isOverBudget ? "text-red-300 font-semibold" : "text-green-300 font-semibold"}>
                  {formatRupees(totalForGroup)}
                </span>
                <span className="text-white/60"> / {formatRupees(budget.totalBudget)}</span>
              </div>
              <div className="flex items-center gap-1 text-white/70">
                <Users className="w-3 h-3" />
                <span>{budget.numPeople}</span>
              </div>
            </div>

            <div className="mt-2 text-xs text-white/60">
              ~{formatRupees(estimatedTotal)}/person • {formatRupees(budget.perPersonBudget)} budgeted
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

/* Username Prompt - shown once to identify who's adding spots */
function UsernamePrompt({
  onSave,
}: {
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl">Who's planning?</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            So your friends know who added what
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) onSave(name.trim());
            }}
            className="space-y-4"
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name..."
              className="rounded-xl text-center text-lg h-12"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl h-12"
            >
              Let's Go! 🎉
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* Add City Form */
function AddCityForm({
  onAdd,
  onClose,
  existingCities,
}: {
  onAdd: (city: string) => void;
  onClose: () => void;
  existingCities: string[];
}) {
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cityName.trim();
    if (!trimmed) return;
    
    // Check if city already exists (case-insensitive)
    if (existingCities.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setError("This city already exists!");
      return;
    }
    
    onAdd(trimmed);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl">Add a City</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Planning a trip somewhere new?
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                value={cityName}
                onChange={(e) => {
                  setCityName(e.target.value);
                  setError("");
                }}
                placeholder="City name..."
                className="rounded-xl text-center text-lg h-12"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm text-center mt-2">{error}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!cityName.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl h-12"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add City
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FinalisedView({
  city,
  selectedLanes,
  lockedByLane,
  whenLabel,
  vibe,
  onEdit,
  onShare,
  onCopy,
}: {
  city: string;
  selectedLanes: LaneKey[];
  lockedByLane: Record<LaneKey, Entry | null>;
  whenLabel: string;
  vibe: Vibe;
  onEdit: () => void;
  onShare: () => void;
  onCopy: () => void;
}) {
  const vibeConfig = VIBES.find(v => v.key === vibe);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <Card className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            Your {city} Plan
          </h2>
          <p className="text-purple-100 text-sm mt-1">
            {whenLabel} • {vibeConfig?.emoji} {vibeConfig?.label}
          </p>
        </div>
        <CardContent className="p-4 space-y-4">
          {selectedLanes.map((laneKey) => {
            const lane = LANES.find((l) => l.key === laneKey);
            const entry = lockedByLane[laneKey];
            if (!lane || !entry) return null;

            return (
              <div key={laneKey} className="border rounded-xl p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{lane.emoji}</span>
                      <span className="font-semibold text-gray-600">{lane.label}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">{entry.name}</h3>
                    {entry.neighborhood && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {entry.neighborhood}
                      </p>
                    )}
                  </div>
                  {entry.link && (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 text-white px-3 py-2 rounded-xl text-sm flex items-center gap-1 hover:bg-purple-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={onEdit}
          variant="outline"
          className="flex-1 rounded-2xl h-12 bg-white/80"
        >
          Edit Plan
        </Button>
        <Button
          onClick={onCopy}
          variant="outline"
          className="rounded-2xl h-12 bg-white/80"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          onClick={onShare}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl h-12"
        >
          <Send className="w-5 h-5 mr-2" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}

/* ─────────────────  MAIN APP  ───────────────── */
export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [cities, setCities] = useState<string[]>(DEFAULT_CITIES);
  const [selectedCity, setSelectedCity] = useState<string>(DEFAULT_CITIES[0] || "Delhi");
  const [mode, setMode] = useState<Mode>("night");
  const [vibe, setVibe] = useState<Vibe>("social");
  const [whenPreset, setWhenPreset] = useState<WhenPreset>("tonight");
  const [whenDate, setWhenDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedLanes, setSelectedLanes] = useState<LaneKey[]>(["food", "drinks"]);
  const [laneIdx, setLaneIdx] = useState<Record<LaneKey, number>>({ food: 0, drinks: 0, events: 0, activities: 0 });
  const [lockedByLane, setLockedByLane] = useState<Record<LaneKey, Entry | null>>({ food: null, drinks: null, events: null, activities: null });
  const [swapCount, setSwapCount] = useState<Record<LaneKey, number>>({ food: 0, drinks: 0, events: 0, activities: 0 });
  const [isFinalised, setIsFinalised] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddCityForm, setShowAddCityForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"plan" | "spots" | "budget">("plan");
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Budget & User state
  const [budget, setBudget] = useState<BudgetConfig>({ totalBudget: 10000, perPersonBudget: 2500, numPeople: 4 });
  const [username, setUsername] = useState<string>("");
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const [quickAddLane, setQuickAddLane] = useState<LaneKey | null>(null);

  // Load entries, budget, username, cities
  useEffect(() => {
    setEntries(loadEntries());
    setBudget(loadBudget());
    const savedCities = loadCities();
    setCities(savedCities);
    setSelectedCity(savedCities[0] || "Delhi");
    const savedUsername = loadUsername();
    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      setShowUsernamePrompt(true);
    }
    setIsLoaded(true);
  }, []);

  // Get entries for each lane in selected city, sorted by score
  const entriesByLane = useMemo(() => {
    const result: Record<LaneKey, Entry[]> = { food: [], drinks: [], events: [], activities: [] };
    entries
      .filter((e) => e.city === selectedCity)
      .forEach((e) => {
        result[e.lane].push(e);
      });
    // Sort each lane by score
    (Object.keys(result) as LaneKey[]).forEach((laneKey) => {
      result[laneKey].sort((a, b) => scoreEntry(b, vibe, mode) - scoreEntry(a, vibe, mode));
    });
    return result;
  }, [entries, selectedCity, vibe, mode]);

  // Reset when city/mode/vibe changes
  useEffect(() => {
    if (isLoaded) {
      setLaneIdx({ food: 0, drinks: 0, events: 0, activities: 0 });
      setLockedByLane({ food: null, drinks: null, events: null, activities: null });
      setSwapCount({ food: 0, drinks: 0, events: 0, activities: 0 });
      setIsFinalised(false);
    }
  }, [selectedCity, mode, vibe, isLoaded]);

  const toggleLaneSelection = (laneKey: LaneKey) => {
    if (isFinalised) return;
    setSelectedLanes((prev) => {
      if (prev.includes(laneKey)) {
        if (prev.length <= 2) return prev; // Minimum 2 lanes
        return prev.filter((l) => l !== laneKey);
      } else {
        if (prev.length >= 4) return prev; // Maximum 4 lanes
        return [...prev, laneKey];
      }
    });
  };

  const bumpLane = (laneKey: LaneKey, dir: 1 | -1) => {
    const laneEntries = entriesByLane[laneKey];
    if (laneEntries.length === 0) return;

    const changesLeft = MAX_SWAPS_AFTER_LOCK - swapCount[laneKey];
    const isHardLocked = !!lockedByLane[laneKey] && changesLeft <= 0;
    if (isHardLocked) return;

    // If locked, increment swap count
    if (lockedByLane[laneKey]) {
      setSwapCount((prev) => ({ ...prev, [laneKey]: prev[laneKey] + 1 }));
    }

    const currentIdx = laneIdx[laneKey];
    const newIdx = currentIdx + dir;
    const wrapped = ((newIdx % laneEntries.length) + laneEntries.length) % laneEntries.length;
    
    setLaneIdx((prev) => ({ ...prev, [laneKey]: wrapped }));

    // Update locked entry if locked
    if (lockedByLane[laneKey]) {
      setLockedByLane((prev) => ({ ...prev, [laneKey]: laneEntries[wrapped] ?? null }));
    }
  };

  const toggleLock = (laneKey: LaneKey) => {
    const laneEntries = entriesByLane[laneKey];
    if (laneEntries.length === 0) return;

    const changesLeft = MAX_SWAPS_AFTER_LOCK - swapCount[laneKey];
    const isHardLocked = !!lockedByLane[laneKey] && changesLeft <= 0;
    
    if (isHardLocked) return;

    if (lockedByLane[laneKey]) {
      // Unlock
      setLockedByLane((prev) => ({ ...prev, [laneKey]: null }));
      setSwapCount((prev) => ({ ...prev, [laneKey]: 0 }));
    } else {
      // Lock current selection
      const currentEntry = laneEntries[laneIdx[laneKey]] ?? null;
      setLockedByLane((prev) => ({ ...prev, [laneKey]: currentEntry }));
    }
  };

  const canFinalise = selectedLanes.every((laneKey) => lockedByLane[laneKey] !== null);

  const handleFinalise = () => {
    if (canFinalise) {
      setIsFinalised(true);
    }
  };

  const handleReroll = () => {
    setLaneIdx({ food: 0, drinks: 0, events: 0, activities: 0 });
    setLockedByLane({ food: null, drinks: null, events: null, activities: null });
    setSwapCount({ food: 0, drinks: 0, events: 0, activities: 0 });
    setIsFinalised(false);
  };

  const whenLabel = resolveWhenLabel(whenPreset, whenDate);

  const handleShare = async () => {
    const text = planToText(selectedCity, selectedLanes, lockedByLane, whenLabel, vibe);
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        await navigator.clipboard.writeText(text);
        alert("Plan copied to clipboard!");
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Plan copied to clipboard!");
    }
  };

  const handleCopy = async () => {
    const text = planToText(selectedCity, selectedLanes, lockedByLane, whenLabel, vibe);
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const handleAddEntry = (newEntry: Omit<Entry, "id" | "createdAt">) => {
    const entry: Entry = {
      ...newEntry,
      addedBy: newEntry.addedBy || username || "Anonymous",
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      createdAt: Date.now(),
    };
    const updated = [...entries, entry];
    setEntries(updated);
    saveEntries(updated);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
  };

  const handleBudgetChange = (newBudget: BudgetConfig) => {
    setBudget(newBudget);
    saveBudget(newBudget);
  };

  const handleUsernameSet = (name: string) => {
    setUsername(name);
    saveUsername(name);
    setShowUsernamePrompt(false);
  };

  const handleAddCity = (cityName: string) => {
    const updated = [...cities, cityName];
    setCities(updated);
    saveCities(updated);
    setSelectedCity(cityName); // Auto-select the new city
  };

  const handleDeleteCity = (cityName: string) => {
    // Don't allow deleting if it's the only city
    if (cities.length <= 1) return;
    // Don't allow deleting default cities? Or allow it - user's choice
    const updated = cities.filter(c => c !== cityName);
    setCities(updated);
    saveCities(updated);
    // If deleted city was selected, switch to first available
    if (selectedCity === cityName) {
      setSelectedCity(updated[0] || "Delhi");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6 min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-2xl font-bold text-white mb-1">
            ✈️ Whats the Plan Guys?
          </h1>
          <p className="text-purple-200 text-sm">
            Pick your vibe, swipe to explore, lock your picks
          </p>
        </motion.header>

        {/* City Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={isFinalised}
              className="flex-1 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white text-lg px-4 appearance-none disabled:opacity-50"
            >
              {cities.map((city) => (
                <option key={city} value={city} className="text-gray-800">
                  📍 {city}
                </option>
              ))}
            </select>
            <Button
              onClick={() => setShowAddCityForm(true)}
              disabled={isFinalised}
              className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 disabled:opacity-50"
              title="Add a new city"
            >
              <PlusCircle className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "plan" | "spots" | "budget")}
          className="mb-4"
        >
          <TabsList className="w-full bg-white/20 backdrop-blur-xl rounded-2xl h-11 p-1">
            <TabsTrigger
              value="plan"
              className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 text-white text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Plan
            </TabsTrigger>
            <TabsTrigger
              value="spots"
              className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 text-white text-xs sm:text-sm"
            >
              <MapPin className="w-4 h-4 mr-1" />
              Spots
            </TabsTrigger>
            <TabsTrigger
              value="budget"
              className="flex-1 rounded-xl data-[state=active]:bg-white data-[state=active]:text-purple-700 text-white text-xs sm:text-sm"
            >
              <Wallet className="w-4 h-4 mr-1" />
              Budget
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="mt-4">
            {isFinalised ? (
              <FinalisedView
                city={selectedCity}
                selectedLanes={selectedLanes}
                lockedByLane={lockedByLane}
                whenLabel={whenLabel}
                vibe={vibe}
                onEdit={() => setIsFinalised(false)}
                onShare={handleShare}
                onCopy={handleCopy}
              />
            ) : (
              <>
                {/* Budget Summary (compact) */}
                <BudgetTracker
                  budget={budget}
                  onBudgetChange={handleBudgetChange}
                  lockedByLane={lockedByLane}
                  selectedLanes={selectedLanes}
                />

                <div className="h-3" />

                {/* Mode & Vibe Selectors */}
                <Card className="bg-white/20 backdrop-blur-xl border-white/30 rounded-2xl mb-3">
                  <CardContent className="p-3 space-y-3">
                    {/* Mode Toggle */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setMode("day")}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          mode === "day"
                            ? "bg-yellow-400 text-yellow-900"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        Day
                      </button>
                      <button
                        onClick={() => setMode("night")}
                        className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          mode === "night"
                            ? "bg-indigo-600 text-white"
                            : "bg-white/20 text-white hover:bg-white/30"
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        Night
                      </button>
                    </div>

                    {/* Vibe Selector */}
                    <div>
                      <p className="text-white/70 text-xs text-center mb-2">What's the vibe?</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {VIBES.map((v) => (
                          <button
                            key={v.key}
                            onClick={() => setVibe(v.key)}
                            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                              vibe === v.key
                                ? "bg-white text-purple-700 shadow-lg"
                                : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                          >
                            {v.emoji} {v.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* When Selector */}
                    <div>
                      <p className="text-white/70 text-xs text-center mb-2">When?</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {WHEN_PRESETS.map((w) => (
                          <button
                            key={w.key}
                            onClick={() => setWhenPreset(w.key)}
                            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                              whenPreset === w.key
                                ? "bg-white text-purple-700 shadow-lg"
                                : "bg-white/20 text-white hover:bg-white/30"
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                      {whenPreset === "custom" && (
                        <input
                          type="date"
                          value={whenDate}
                          onChange={(e) => setWhenDate(e.target.value)}
                          className="mt-2 w-full h-10 rounded-xl bg-white/20 border border-white/30 text-white px-3"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Lane Selector */}
                <Card className="bg-white/20 backdrop-blur-xl border-white/30 rounded-2xl mb-3">
                  <CardContent className="p-3">
                    <p className="text-white text-sm mb-2 text-center">Select 2-4 lanes:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {LANES.map((lane) => (
                        <button
                          key={lane.key}
                          onClick={() => toggleLaneSelection(lane.key)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedLanes.includes(lane.key)
                              ? "bg-white text-purple-700 shadow-lg"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                        >
                          {lane.emoji} {lane.label}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Lane Cards */}
                <div className="space-y-3 mb-4">
                  <AnimatePresence mode="popLayout">
                    {selectedLanes.map((laneKey) => {
                      const lane = LANES.find((l) => l.key === laneKey)!;
                      return (
                        <LaneCard
                          key={laneKey}
                          lane={lane}
                          entries={entriesByLane[laneKey]}
                          currentIdx={laneIdx[laneKey]}
                          isLocked={!!lockedByLane[laneKey]}
                          swapCount={swapCount[laneKey]}
                          isFinalised={isFinalised}
                          onPrev={() => bumpLane(laneKey, -1)}
                          onNext={() => bumpLane(laneKey, 1)}
                          onToggleLock={() => toggleLock(laneKey)}
                        />
                      );
                    })}
                  </AnimatePresence>
                </div>

                <p className="text-xs text-purple-200 text-center mb-3">
                  Swipe each lane to explore • Lock your favorites
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleReroll}
                    variant="outline"
                    className="flex-1 rounded-2xl h-12 bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Re-roll
                  </Button>
                  <Button
                    onClick={handleFinalise}
                    disabled={!canFinalise}
                    className="flex-1 bg-white text-purple-700 hover:bg-white/90 rounded-2xl h-12 font-bold disabled:opacity-50"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    {canFinalise ? "Finalise" : `Lock ${selectedLanes.length} lanes`}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="spots" className="mt-4">
            <Card className="bg-white/80 backdrop-blur-xl border-white/50 rounded-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-800">
                    {selectedCity} Spots
                  </CardTitle>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <Separator className="mx-6" />
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {LANES.map((lane) => {
                    const laneEntries = entriesByLane[lane.key];
                    return (
                      <div key={lane.key}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{lane.emoji}</span>
                          <span className="font-medium text-gray-700">{lane.label}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {laneEntries.length}
                          </Badge>
                        </div>
                        {laneEntries.length === 0 ? (
                          <p className="text-sm text-gray-400 pl-8">No entries yet</p>
                        ) : (
                          <div className="space-y-2 pl-8">
                            {laneEntries.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-800 truncate">{entry.name}</span>
                                    {entry.estimatedCost && (
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                        {formatRupees(entry.estimatedCost)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                    {entry.neighborhood && <span>{entry.neighborhood}</span>}
                                    {entry.addedBy && (
                                      <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {entry.addedBy}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="mt-4">
            <div className="space-y-4">
              {/* Budget Overview Card */}
              <Card className="bg-white/90 backdrop-blur-xl rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-purple-600" />
                    Trip Budget
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-xl p-4">
                      <p className="text-xs text-purple-600 font-medium">Total Budget</p>
                      <div className="flex items-center gap-1 mt-1">
                        <IndianRupee className="w-4 h-4 text-purple-700" />
                        <Input
                          type="number"
                          value={budget.totalBudget}
                          onChange={(e) => handleBudgetChange({
                            ...budget,
                            totalBudget: parseInt(e.target.value) || 0,
                            perPersonBudget: Math.round((parseInt(e.target.value) || 0) / budget.numPeople)
                          })}
                          className="border-0 bg-transparent p-0 h-8 text-xl font-bold text-purple-700 focus-visible:ring-0"
                        />
                      </div>
                    </div>
                    <div className="bg-pink-50 rounded-xl p-4">
                      <p className="text-xs text-pink-600 font-medium">People</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-4 h-4 text-pink-700" />
                        <Input
                          type="number"
                          min="1"
                          value={budget.numPeople}
                          onChange={(e) => handleBudgetChange({
                            ...budget,
                            numPeople: parseInt(e.target.value) || 1,
                            perPersonBudget: Math.round(budget.totalBudget / (parseInt(e.target.value) || 1))
                          })}
                          className="border-0 bg-transparent p-0 h-8 text-xl font-bold text-pink-700 focus-visible:ring-0 w-16"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Per person budget</span>
                      <span className="font-bold text-gray-800">{formatRupees(budget.perPersonBudget)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estimated Costs by Lane */}
              <Card className="bg-white/90 backdrop-blur-xl rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Locked Picks Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedLanes.map((laneKey) => {
                      const lane = LANES.find((l) => l.key === laneKey);
                      const entry = lockedByLane[laneKey];
                      const cost = entry ? (entry.estimatedCost || priceToEstimate(entry.price)) : 0;

                      return (
                        <div key={laneKey} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{lane?.emoji}</span>
                            <div>
                              <p className="font-medium text-sm text-gray-800">
                                {entry?.name || "Not locked"}
                              </p>
                              {entry?.addedBy && (
                                <p className="text-xs text-gray-500">Added by {entry.addedBy}</p>
                              )}
                            </div>
                          </div>
                          <span className={`font-semibold ${entry ? "text-gray-800" : "text-gray-400"}`}>
                            {entry ? formatRupees(cost) : "—"}
                          </span>
                        </div>
                      );
                    })}

                    <Separator />

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold text-gray-800">Total per person</span>
                      <span className="font-bold text-lg text-purple-700">
                        {formatRupees(
                          selectedLanes.reduce((sum, laneKey) => {
                            const entry = lockedByLane[laneKey];
                            return sum + (entry ? (entry.estimatedCost || priceToEstimate(entry.price)) : 0);
                          }, 0)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total for {budget.numPeople} people</span>
                      <span className="font-semibold text-gray-800">
                        {formatRupees(
                          selectedLanes.reduce((sum, laneKey) => {
                            const entry = lockedByLane[laneKey];
                            return sum + (entry ? (entry.estimatedCost || priceToEstimate(entry.price)) : 0);
                          }, 0) * budget.numPeople
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Add Section */}
              <Card className="bg-white/90 backdrop-blur-xl rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Quick Add a Spot
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Found something? Add it quick!
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {LANES.map((lane) => (
                      <Button
                        key={lane.key}
                        variant="outline"
                        onClick={() => setQuickAddLane(lane.key)}
                        className="rounded-xl h-auto py-3 flex-col gap-1"
                      >
                        <span className="text-xl">{lane.emoji}</span>
                        <span className="text-xs">{lane.label}</span>
                      </Button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {quickAddLane && (
                      <div className="mt-4">
                        <QuickAddForm
                          onAdd={(entry) => {
                            handleAddEntry(entry);
                            setQuickAddLane(null);
                          }}
                          onClose={() => setQuickAddLane(null)}
                          defaultCity={selectedCity}
                          defaultLane={quickAddLane}
                          username={username}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* User Info */}
              <div className="flex items-center justify-between bg-white/20 backdrop-blur-xl rounded-2xl p-3">
                <div className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Adding as: <strong>{username}</strong></span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUsernamePrompt(true)}
                  className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg text-xs"
                >
                  Change
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Username Prompt Modal */}
      <AnimatePresence>
        {showUsernamePrompt && (
          <UsernamePrompt onSave={handleUsernameSet} />
        )}
      </AnimatePresence>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {showAddForm && (
          <AddEntryForm
            onAdd={handleAddEntry}
            onClose={() => setShowAddForm(false)}
            defaultCity={selectedCity}
            cities={cities}
          />
        )}
      </AnimatePresence>

      {/* Add City Modal */}
      <AnimatePresence>
        {showAddCityForm && (
          <AddCityForm
            onAdd={handleAddCity}
            onClose={() => setShowAddCityForm(false)}
            existingCities={cities}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
