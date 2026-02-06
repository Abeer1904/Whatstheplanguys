"use client";

interface ControlsProps {
  cities: string[];
  selectedCity: string;
  selectedMode: "day" | "night";
  selectedVibe: "chill" | "social" | "adventurous" | "romantic" | "solo";
  selectedBudget: "low" | "medium" | "high";
  onCityChange: (city: string) => void;
  onModeChange: (mode: "day" | "night") => void;
  onVibeChange: (
    vibe: "chill" | "social" | "adventurous" | "romantic" | "solo"
  ) => void;
  onBudgetChange: (budget: "low" | "medium" | "high") => void;
  onGenerate: () => void;
  entriesCount: number;
  isLoading?: boolean;
}

export default function Controls({
  cities,
  selectedCity,
  selectedMode,
  selectedVibe,
  selectedBudget,
  onCityChange,
  onModeChange,
  onVibeChange,
  onBudgetChange,
  onGenerate,
  entriesCount,
  isLoading,
}: ControlsProps) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: "20px" }}>🎯 Create Your Itinerary</h2>

      <div className="input-group vertical">
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            📍 Select City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">Choose a city...</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            ⏰ Time of Day
          </label>
          <div className="input-group">
            <button
              className={`btn btn-small ${
                selectedMode === "day" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => onModeChange("day")}
            >
              🌅 Day
            </button>
            <button
              className={`btn btn-small ${
                selectedMode === "night" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => onModeChange("night")}
            >
              🌙 Night
            </button>
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            😊 Vibe
          </label>
          <div className="input-group">
            {(["chill", "social", "adventurous", "romantic", "solo"] as const).map(
              (vibe) => (
                <button
                  key={vibe}
                  className={`btn btn-small ${
                    selectedVibe === vibe ? "btn-primary" : "btn-secondary"
                  }`}
                  onClick={() => onVibeChange(vibe)}
                >
                  {vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>
            💰 Budget
          </label>
          <div className="input-group">
            {(["low", "medium", "high"] as const).map((budget) => (
              <button
                key={budget}
                className={`btn btn-small ${
                  selectedBudget === budget ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => onBudgetChange(budget)}
              >
                {budget === "low" && "$"}
                {budget === "medium" && "$$"}
                {budget === "high" && "$$$"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={onGenerate}
        disabled={!selectedCity || entriesCount === 0 || isLoading}
        style={{ width: "100%", justifyContent: "center", marginTop: "20px" }}
      >
        {isLoading ? "⏳ Generating..." : "✨ Generate Itinerary"}
      </button>

      {entriesCount > 0 && (
        <p className="text-muted" style={{ marginTop: "10px", textAlign: "center" }}>
          {entriesCount} activities available in {selectedCity || "selected city"}
        </p>
      )}
    </div>
  );
}
