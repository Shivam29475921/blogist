import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Research with AI",
    body: "Open the panel. Read facts, sources, and context. The AI hands you the library — it never hands you the sentence.",
  },
  {
    n: "02",
    title: "Write it yourself",
    body: "No autofill. No suggestions hovering at the end of your line. The cursor blinks. The page is yours.",
  },
  {
    n: "03",
    title: "Publish something real",
    body: "People follow you because they want to read you. Not a model trained on a million others. You.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      data-testid="how-it-works-section"
      style={{ position: "relative", padding: "140px 8vw" }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 96, gap: 24 }}>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7 }}
          className="font-display"
          style={{ fontSize: "clamp(36px, 4.2vw, 72px)", color: "#fff", lineHeight: 1, letterSpacing: "-0.02em", fontWeight: 600, maxWidth: "12ch" }}
        >
          How it works.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-mono"
          style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", paddingBottom: 12 }}
        >
          — THREE STEPS, ONE AUTHOR
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 64 }}>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            data-testid={`step-${s.n}`}
          >
            <div className="font-mono" style={{ fontSize: 13, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 36 }}>
              {s.n}
            </div>
            <h3 className="font-display" style={{ fontSize: "clamp(26px, 2.4vw, 38px)", lineHeight: 1.05, color: "#fff", letterSpacing: "-0.01em", fontWeight: 600, marginBottom: 24 }}>
              {s.title}
            </h3>
            <p className="font-body" style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.6)", maxWidth: "36ch" }}>
              {s.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;