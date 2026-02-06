"use client";

import { Entry } from "@/lib/types";
import { groupByCity, getCategoryEmoji, getPriceEmoji } from "@/lib/utils";

interface BrowseEntriesProps {
  entries: Entry[];
  onDeleteEntry: (id: string) => void;
}

export default function BrowseEntries({
  entries,
  onDeleteEntry,
}: BrowseEntriesProps) {
  const groupedEntries = groupByCity(entries);
  const cities = Object.keys(groupedEntries).sort();

  if (cities.length === 0) {
    return (
      <div className="card">
        <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          📭 No entries yet. Add one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: "20px" }}>📋 Browse Activities</h2>
      {cities.map((city) => (
        <div key={city} style={{ marginBottom: "25px" }}>
          <h3
            style={{
              color: "var(--primary)",
              marginBottom: "10px",
              borderBottom: "2px solid var(--primary)",
              paddingBottom: "8px",
            }}
          >
            📍 {city}
          </h3>
          <ul style={{ listStyle: "none" }}>
            {(groupedEntries[city] || []).map((entry) => (
              <li
                key={entry.id}
                style={{
                  padding: "12px",
                  marginBottom: "10px",
                  background: "var(--bg-light)",
                  borderRadius: "6px",
                  borderLeft: "4px solid var(--primary)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: "1.05rem" }}>
                      {getCategoryEmoji(entry.category)} {entry.title}
                    </strong>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                      {entry.category.replace(/_/g, " ")}
                      {entry.neighborhood && ` • ${entry.neighborhood}`}
                      {entry.price && ` • ${getPriceEmoji(entry.price)}`}
                    </div>
                    {entry.tags.length > 0 && (
                      <div style={{ marginTop: "6px" }}>
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="badge"
                            style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="btn btn-secondary btn-small"
                  >
                    🗑️
                  </button>
                </div>
                {entry.notes && (
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic", marginTop: "8px" }}>
                    📝 {entry.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
