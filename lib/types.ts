export type Category =
  | "restaurant"
  | "experience"
  | "thing_to_do"
  | "historical_site"
  | "bar_cafe"
  | "outdoors"
  | "budget"
  | "wildcard";

export type Price = "$" | "$$" | "$$$" | "free";

export type Entry = {
  id: string;
  city: string;
  title: string;
  category: Category;
  neighborhood?: string;
  area?: string;
  price?: Price;
  tags: string[];
  notes?: string;
  link?: string;
  createdAt: number;
};

export type ItineraryStop = {
  time: string;
  entry: Entry;
  rationale: string;
};

export type Itinerary = {
  id: string;
  city: string;
  mode: "day" | "night";
  vibe: "chill" | "social" | "adventurous" | "romantic" | "solo";
  budget: "low" | "medium" | "high";
  stops: ItineraryStop[];
  createdAt: number;
};

export type CityData = {
  name: string;
  country?: string;
  entries: Entry[];
};
