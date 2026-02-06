"use client";

import { Itinerary } from "@/lib/types";
import { formatDate, getCategoryEmoji, getPriceEmoji } from "@/lib/utils";

interface ItineraryCardProps {
  itinerary: Itinerary;
  onDelete: (id: string) => void;
}

export default function ItineraryCard({ itinerary, onDelete }: ItineraryCardProps) {
  const modeEmoji = itinerary.mode === "day" ? "🌅" : "🌙";
  const vibeEmoji = {
    chill: "😎",
    social: "🤝",
    adventurous: "🚀",
    romantic: "💕",
    solo: "🎒",
  }[itinerary.vibe];
  const budgetEmoji = {
    low: "💵",
    medium: "💰",
    high: "💸",
  }[itinerary.budget];

  return (
    <div className="card" style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          marginBottom: "15px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "8px" }}>
            📍 {itinerary.city}
          </h3>
          <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
            <span className="badge badge-primary">{modeEmoji} {itinerary.mode}</span>
            <span className="badge badge-primary">{vibeEmoji} {itinerary.vibe}</span>
            <span className="badge badge-primary">{budgetEmoji} {itinerary.budget}</span>
          </div>
          <p className="text-muted">Created: {formatDate(itinerary.createdAt)}</p>
        </div>
        <button
          className="btn btn-secondary btn-small"
          onClick={() => onDelete(itinerary.id)}
        >
          🗑️ Delete
        </button>
      </div>

      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "15px" }}>
        <ol style={{ marginLeft: "20px" }}>
          {itinerary.stops.map((stop, index) => (
            <li key={index} style={{ marginBottom: "15px", lineHeight: "1.6" }}>
              <div style={{ marginBottom: "5px" }}>
                <strong style={{ fontSize: "1.1rem" }}>
                  {stop.time} - {stop.entry.title}
                </strong>
              </div>
              <div style={{ marginBottom: "5px", color: "var(--text-secondary)" }}>
                {getCategoryEmoji(stop.entry.category)} {stop.entry.category.replace(/_/g, " ")}
                {stop.entry.neighborhood && ` • ${stop.entry.neighborhood}`}
                {stop.entry.price && ` • ${getPriceEmoji(stop.entry.price)}`}
              </div>
              <div style={{ fontSize: "0.95rem", fontStyle: "italic", color: "#888" }}>
                💡 {stop.rationale}
              </div>
              {stop.entry.tags.length > 0 && (
                <div style={{ marginTop: "5px" }}>
                  {stop.entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge"
                      style={{ fontSize: "0.8rem" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
