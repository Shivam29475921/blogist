import React from "react";

export const TickerStrip = () => {
  const items = [
    "LATEST",
    "1,247 AUTHORS WRITING NOW",
    "NO AUTOCOMPLETE",
    "NO AI GENERATION",
    "YOUR WORDS · YOUR VOICE",
    "ISSUE №0001",
    "TRANSMITTED LIVE FROM THE DESK",
    "BLOGIST · THE OBSERVER",
    "READ LONGER · POST LESS",
    "THE SENTENCE IS THE PRODUCT",
  ];

  return (
    <div
      data-testid="ticker-strip"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#0c0c0c",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="marquee-track font-mono"
        style={{
          display: "flex",
          flexShrink: 0,
          whiteSpace: "nowrap",
          padding: "11px 0",
          fontSize: 11,
          letterSpacing: "0.32em",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {[...Array(2)].flatMap((_, k) =>
          items.map((t, i) => (
            <span key={`${k}-${i}`} style={{ paddingInline: 30 }}>
              <span style={{ opacity: 0.35, marginRight: 30 }}>✦</span>
              {t}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default TickerStrip;