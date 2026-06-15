import React, { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "THE COVER" },
  { id: "manifesto", label: "MANIFESTO" },
  { id: "spread", label: "FROM THE DESK" },
  { id: "how", label: "HOW IT WORKS" },
  { id: "pull", label: "A NOTE" },
  { id: "stack", label: "UNDER THE HOOD" },
  { id: "cta", label: "LAST PAGE" },
];

export const PageIndicator = () => {
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 200);
      const vhMid = window.innerHeight * 0.45;
      let bestIdx = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= vhMid) bestIdx = i;
      });
      setActive(bestIdx);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      data-testid="page-indicator"
      style={{
        position: "fixed",
        zIndex: 40,
        display: scrolled ? "flex" : "none",
        flexDirection: "column",
        alignItems: "flex-end",
        right: 28,
        top: "50%",
        transform: "translateY(-50%)",
        opacity: scrolled ? 1 : 0,
        transition: "opacity 0.5s ease",
        gap: 14,
      }}
    >
      {SECTIONS.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="font-mono"
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 10,
            letterSpacing: "0.25em",
            color: i === active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.28)",
            textDecoration: "none",
            gap: 12,
            transition: "color 0.3s ease",
          }}
        >
          <span style={{ width: 28, textAlign: "right" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              display: "inline-block",
              width: i === active ? 36 : 14,
              height: 1,
              background: i === active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)",
              transition: "width 0.35s ease, background 0.3s ease",
            }}
          />
          <span style={{ minWidth: 120 }}>{s.label}</span>
        </a>
      ))}
    </div>
  );
};

export default PageIndicator;