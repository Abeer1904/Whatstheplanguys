"use client";

export default function Header() {
  return (
    <header
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        color: "white",
        padding: "30px 20px",
        textAlign: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", fontWeight: "bold" }}>
        whatstheplaguys
      </h1>
      <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
        Random plans. Zero overthinking.
      </p>
    </header>
  );
}
