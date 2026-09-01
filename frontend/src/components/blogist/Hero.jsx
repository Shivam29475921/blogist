import React from "react";
import { motion } from "framer-motion";

export const Hero = ({ onSignUp, onSignIn }) => {
  return (
    <section
      data-testid="hero-section"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 8vw 120px",
        minHeight: "calc(100vh - 130px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay: 0.1 }}
        className="font-mono"
        style={{ fontSize: 12, letterSpacing: "0.32em", color: "rgba(255,255,255,0.42)", marginBottom: 56 }}
      >
        — A PLATFORM FOR ORIGINAL THOUGHT
      </motion.div>

      <div
        className="font-display"
        style={{ maxWidth: "min(1200px, 92vw)", lineHeight: 0.96, letterSpacing: "-0.02em" }}
      >
        <motion.div
          data-testid="hero-headline"
          initial={{ y: 120, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.0 }}
          style={{ fontSize: "clamp(44px, 6.4vw, 96px)", fontWeight: 700, color: "#fff" }}
        >
          AI gave everyone a voice.
        </motion.div>
        <motion.div
          initial={{ y: 120, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{ fontSize: "clamp(44px, 6.4vw, 96px)", fontWeight: 500, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}
        >
          And now nobody has one.
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="font-body"
        style={{ marginTop: 56, maxWidth: 560, fontSize: 18, lineHeight: 1.55, color: "rgba(255,255,255,0.7)" }}
      >
        Blogist is where you take it back. Informed by AI, written by you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        style={{ display: "flex", flexWrap: "wrap", alignItems: "center", marginTop: 48, gap: 20 }}
      >
        <button
          data-testid="hero-cta-start"
          onClick={onSignUp}
          className="pill-cta font-body"
          style={{ background: "#ffffff", color: "#080808", padding: "16px 30px", borderRadius: 999, fontSize: 15, fontWeight: 500, letterSpacing: "0.01em", border: "none", cursor: "pointer" }}
        >
          Start writing →
        </button>
        <button
          data-testid="hero-cta-community"
          onClick={onSignIn}
          className="pill-cta font-body"
          style={{ background: "transparent", color: "rgba(255,255,255,0.85)", padding: "16px 26px", borderRadius: 999, fontSize: 15, fontWeight: 400, letterSpacing: "0.01em", border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer" }}
        >
          Read the community
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="font-mono"
        style={{ position: "absolute", bottom: 36, left: "8vw", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.28)" }}
      >
        BLOGIST / VOL.I — EST. MMXXVI
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="font-mono"
        style={{ position: "absolute", bottom: 36, right: "8vw", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.28)" }}
      >
        SCROLL ↓
      </motion.div>
    </section>
  );
};

export default Hero;