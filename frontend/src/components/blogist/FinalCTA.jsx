import React from "react";
import { motion } from "framer-motion";

export const FinalCTA = ({ onSignUp, onSignIn }) => {
  return (
    <section
      data-testid="final-cta-section"
      style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "180px 8vw 120px" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6 }}
        className="font-mono"
        style={{ fontSize: 11, letterSpacing: "0.32em", color: "rgba(255,255,255,0.35)", marginBottom: 56 }}
      >
        — THE LAST PAGE
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="font-display"
        style={{ fontSize: "clamp(44px, 6.4vw, 104px)", lineHeight: 1.02, letterSpacing: "-0.025em", color: "#fff", fontWeight: 600, maxWidth: "16ch" }}
      >
        Your ideas deserve{" "}
        <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.55)" }}>
          your words.
        </span>
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.25 }}
        style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", marginTop: 64, gap: 20 }}
      >
        <button
          data-testid="final-cta-create" onClick={onSignUp}
          className="pill-cta font-body"
          style={{ background: "#ffffff", color: "#080808", padding: "18px 34px", borderRadius: 999, fontSize: 15, fontWeight: 500, border: "none", cursor: "pointer" }}
        >
          Create your account →
        </button>
        <button
          data-testid="final-cta-signin" onClick={onSignIn}
          className="pill-cta font-body"
          style={{ background: "transparent", color: "rgba(255,255,255,0.85)", padding: "18px 30px", borderRadius: 999, fontSize: 15, fontWeight: 400, border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer" }}
        >
          Sign in
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }}
        className="font-body"
        style={{ fontStyle: "italic", marginTop: 80, fontSize: 14, color: "rgba(255,255,255,0.42)", maxWidth: "44ch" }}
      >
        Informed by AI, written by you. Never the other way around.
      </motion.div>
    </section>
  );
};

export default FinalCTA;