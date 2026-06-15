import React from "react";
import { motion } from "framer-motion";

export const PullQuote = () => {
  return (
    <section
      data-testid="pull-quote-section"
      style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "180px 6vw" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
        className="font-display"
        style={{ textAlign: "center", fontSize: "clamp(56px, 9vw, 168px)", lineHeight: 1.02, letterSpacing: "-0.035em", color: "rgba(255,255,255,0.08)", fontWeight: 700, fontStyle: "italic", maxWidth: "18ch" }}
      >
        The AI is a library.
        <br />
        You are the author.
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="font-mono"
        style={{ position: "absolute", bottom: 60, right: "8vw", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.18)" }}
      >
        — A NOTE TO THE READER
      </motion.div>
    </section>
  );
};

export default PullQuote;