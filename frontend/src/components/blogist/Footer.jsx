import React from "react";

export const Footer = () => {
  return (
    <footer
      data-testid="site-footer"
      style={{ position: "relative", padding: "40px 8vw", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div className="font-display" style={{ fontSize: 20, color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}>
          Blogist<span style={{ color: "rgba(255,255,255,0.3)" }}> · the observer</span>
        </div>
        <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(255,255,255,0.28)" }}>
          BUILT BY NISHA PARASHAR · MMXXVI
        </div>
      </div>
    </footer>
  );
};

export default Footer;