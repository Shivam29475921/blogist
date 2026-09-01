import React from "react";
import { motion } from "framer-motion";

export const Manifesto = () => {
  return (
    <section
      data-testid="manifesto-section"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "160px 8vw",
      }}
    >
      <div style={{ maxWidth: 1100 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6 }}
          className="font-mono"
          style={{ fontSize: 11, letterSpacing: "0.32em", color: "rgba(255,255,255,0.35)", marginBottom: 56 }}
        >
          — MANIFESTO · ZERO ONE
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display"
          style={{ fontSize: "clamp(28px, 3.4vw, 54px)", lineHeight: 1.22, color: "rgba(255,255,255,0.92)", fontStyle: "italic", fontWeight: 500, letterSpacing: "-0.005em" }}
        >
          <span
            aria-hidden
            className="font-display"
            style={{ fontSize: "1.6em", lineHeight: 0, color: "rgba(255,255,255,0.35)", marginRight: 8, verticalAlign: "-0.25em" }}
          >
            "
          </span>
          The internet has too much content and not enough thought. When the
          machine writes for you, the post exists. But the idea never did.
          <span
            aria-hidden
            className="font-display"
            style={{ fontSize: "1.6em", lineHeight: 0, color: "rgba(255,255,255,0.35)", marginLeft: 8, verticalAlign: "-0.55em" }}
          >
            "
          </span>
        </motion.blockquote>
      </div>
    </section>
  );
};

export default Manifesto;