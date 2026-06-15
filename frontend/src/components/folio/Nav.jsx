import React from "react";
import { motion } from "framer-motion";

export const Nav = ({ onSignIn, onSignUp, onReplay }) => {
  return (
    <motion.nav
      data-testid="site-nav"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 8vw",
        background: "linear-gradient(180deg, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.78) 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          className="font-display"
          style={{ fontSize: 22, color: "#fff", letterSpacing: "-0.01em", fontWeight: 600 }}
        >
          Folio
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", paddingTop: 4 }}
        >
          ·THE·OBSERVER·
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <a href="#manifesto" className="font-mono"
          style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
          MANIFESTO
        </a>
        <a href="#how" className="font-mono"
          style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
          HOW IT WORKS
        </a>
        <a href="#stack" className="font-mono"
          style={{ fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
          UNDER THE HOOD
        </a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={onReplay}
          className="font-mono"
          style={{ background: "transparent", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.12)", padding: "8px 12px", borderRadius: 999, cursor: "pointer", fontSize: 10, letterSpacing: "0.22em" }}
        >
          ↺ REPLAY
        </button>
        <button
          onClick={onSignIn}
          className="font-body"
          style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", fontSize: 13 }}
        >
          Sign in
        </button>
        <button
          onClick={onSignUp}
          className="pill-cta font-body"
          style={{ background: "#fff", color: "#080808", border: "none", padding: "10px 18px", borderRadius: 999, cursor: "pointer", fontSize: 13, fontWeight: 500 }}
        >
          Start writing
        </button>
      </div>
    </motion.nav>
  );
};

export default Nav;