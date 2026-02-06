"use client";

import { useState } from "react";
import { Entry, Category } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface AddEntryFormProps {
  cities: string[];
  onAddEntry: (entry: Entry) => void;
}

const CATEGORIES: Category[] = [
  "restaurant",
  "experience",
  "thing_to_do",
  "historical_site",
  "bar_cafe",
  "outdoors",
  "budget",
  "wildcard",
];

export default function AddEntryForm({ cities, onAddEntry }: AddEntryFormProps) {
  const [formData, setFormData] = useState({
    city: "",
    title: "",
    category: "" as Category | "",
    neighborhood: "",
    price: "" as "free" | "$" | "$$" | "$$$" | "",
    tags: "",
    notes: "",
    link: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.title || !formData.category) return;

    const newEntry: Entry = {
      id: generateId(),
      city: formData.city,
      title: formData.title,
      category: formData.category as Category,
      neighborhood: formData.neighborhood || undefined,
      price: (formData.price as any) || undefined,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      notes: formData.notes || undefined,
      link: formData.link || undefined,
      createdAt: Date.now(),
    };

    onAddEntry(newEntry);
    setFormData({
      city: "",
      title: "",
      category: "",
      neighborhood: "",
      price: "",
      tags: "",
      notes: "",
      link: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 style={{ marginBottom: "20px" }}>➕ Add New Activity</h2>

      <div className="input-group vertical">
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            City *
          </label>
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            style={{ width: "100%" }}
          >
            <option value="">Select city...</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Activity Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Old Delhi food walk"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as any })
            }
            required
            style={{ width: "100%" }}
          >
            <option value="">Select category...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Neighborhood
          </label>
          <input
            type="text"
            placeholder="e.g., Chandni Chowk"
            value={formData.neighborhood}
            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Price Range
          </label>
          <select
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value as any })}
            style={{ width: "100%" }}
          >
            <option value="">Select price...</option>
            <option value="free">Free</option>
            <option value="$">$ (Budget)</option>
            <option value="$$">$$ (Moderate)</option>
            <option value="$$$">$$$ (Expensive)</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Tags (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g., street-food, heritage, culture"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Notes
          </label>
          <textarea
            placeholder="Additional details about this activity..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            Link
          </label>
          <input
            type="text"
            placeholder="https://example.com"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", marginTop: "20px" }}
      >
        ➕ Add Activity
      </button>
    </form>
  );
}
