import React from "react";
import { motion } from "framer-motion";

export const NewspaperSpread = () => {
  return (
    <section
      data-testid="spread-section"
      className="paper-texture grain"
      style={{ position: "relative", color: "var(--folio-ink)", padding: "0", marginTop: 40, marginBottom: 40, boxShadow: "0 60px 120px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(40,28,16,0.08)" }}
    >
      {/* Torn top edge */}
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, top: -10, height: 14, background: "var(--folio-paper)", clipPath: "polygon(0 100%, 1.5% 60%, 3% 92%, 5% 55%, 7% 90%, 10% 50%, 13% 95%, 16% 60%, 19% 88%, 22% 52%, 25% 92%, 28% 58%, 31% 90%, 34% 54%, 37% 92%, 40% 60%, 43% 88%, 46% 50%, 49% 92%, 52% 56%, 55% 88%, 58% 60%, 61% 92%, 64% 54%, 67% 90%, 70% 58%, 73% 92%, 76% 50%, 79% 90%, 82% 60%, 85% 88%, 88% 54%, 91% 92%, 94% 58%, 97% 90%, 100% 56%, 100% 100%, 0 100%)" }} />
      {/* Torn bottom edge */}
      <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: -10, height: 14, background: "var(--folio-paper)", clipPath: "polygon(0 0, 1.5% 40%, 3% 8%, 5% 45%, 7% 10%, 10% 50%, 13% 5%, 16% 40%, 19% 12%, 22% 48%, 25% 8%, 28% 42%, 31% 10%, 34% 46%, 37% 8%, 40% 40%, 43% 12%, 46% 50%, 49% 8%, 52% 44%, 55% 12%, 58% 40%, 61% 8%, 64% 46%, 67% 10%, 70% 42%, 73% 8%, 76% 50%, 79% 10%, 82% 40%, 85% 12%, 88% 46%, 91% 8%, 94% 42%, 97% 10%, 100% 44%, 100% 0, 0 0)" }} />

      <div style={{ padding: "120px 6vw 110px" }}>
        {/* Masthead */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "1px solid rgba(26,22,18,0.5)", paddingBottom: 12 }}>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.32em" }}>VOL. I · NO. 0001 · FEB. MMXXVI</span>
          <span className="font-mono" style={{ fontSize: 11, letterSpacing: "0.22em", fontStyle: "italic" }}>an interruption from the publisher</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.8 }}
          className="font-news"
          style={{ textAlign: "center", fontSize: "clamp(72px, 9vw, 168px)", lineHeight: 0.92, letterSpacing: "0.005em", fontWeight: 900, margin: "44px 0 8px" }}
        >
          THE FOLIO OBSERVER
        </motion.h2>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, borderTop: "1px solid rgba(26,22,18,0.5)", borderBottom: "1px solid rgba(26,22,18,0.5)", padding: "8px 0" }}>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.28em" }}>EST. MMXXVI</span>
          <span style={{ opacity: 0.4 }}>✦</span>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.2em", fontStyle: "italic" }}>ORIGINAL THOUGHT · DAILY</span>
          <span style={{ opacity: 0.4 }}>✦</span>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.28em" }}>PRICE — ONE THOUGHT</span>
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8, delay: 0.1 }}
          className="font-news"
          style={{ textAlign: "center", fontSize: "clamp(40px, 5vw, 84px)", lineHeight: 1.02, fontWeight: 700, margin: "56px auto 14px", maxWidth: "22ch", letterSpacing: "-0.005em" }}
        >
          An Open Letter, To Anyone Still Writing.
        </motion.h3>

        <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 16, opacity: 0.7, marginBottom: 64, fontFamily: "Georgia, serif" }}>
          — filed by the desk, on a quiet afternoon, while the feed kept generating itself —
        </div>

        {/* Three columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 56, fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 16, lineHeight: 1.65, textAlign: "justify" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.7 }}>
            <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 16, opacity: 0.7 }}>LEDE · PAGE ONE</div>
            <p style={{ marginBottom: 16 }}>
              <span className="font-news" style={{ fontSize: 56, lineHeight: 0.85, float: "left", marginRight: 10, marginTop: 6, fontWeight: 800 }}>W</span>
              e built a place for people who still want to write the sentence. Not approve it. Not regenerate it. Not nudge it forward with the tab key. Write it.
            </p>
            <p style={{ marginBottom: 16 }}>Folio does not offer a button that finishes your thought. We think your thought is the entire point. The model can fetch you facts, dates, sources, counterexamples. It cannot fetch you the way you feel about them.</p>
            <p>That part is yours. It always was. We just kept the door open.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.7, delay: 0.1 }}>
            <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 16, opacity: 0.7 }}>COLUMN II · ON THE CRAFT</div>
            <p style={{ marginBottom: 16 }}>For two years now the feed has spoken in one voice — confident, clean, helpfully empty. A million posts that could have been written by no one in particular, because they essentially were.</p>
            <p style={{ marginBottom: 16 }}>The internet did not run out of writers. It ran out of patience for the half-formed draft, the sentence that needs another walk around the block. We are bringing the walk back.</p>
            <p>Slowness is not the bug here. It is the product.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.3em", marginBottom: 16, opacity: 0.7 }}>COLUMN III · A REQUEST</div>
            <p style={{ marginBottom: 16 }}>If you write here, write something only you could have written. Not the cleanest version. Not the most shareable. The one that sounded like you in your own head before the rewrite.</p>
            <p style={{ marginBottom: 16 }}>If you read here, read slowly. There will be fewer posts than you are used to, and they will be longer than the algorithm prefers. We made our peace with that. We hope you do too.</p>
            <p style={{ fontStyle: "italic", textAlign: "right", marginTop: 12 }}>— the editors</p>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <div style={{ borderTop: "1px solid rgba(26,22,18,0.5)", marginTop: 80, paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.28em" }}>FILED IN INDIA — TRANSMITTED EVERYWHERE</span>
          <span className="font-news" style={{ fontStyle: "italic", fontSize: 18, fontWeight: 600 }}>informed by AI · written by you</span>
          <span className="font-mono" style={{ fontSize: 10, letterSpacing: "0.28em" }}>CONTINUED — PAGE 002</span>
        </div>
      </div>
    </section>
  );
};

export default NewspaperSpread;