import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const AI_URL = "http://localhost:8004";

const SAMPLE_TEXT = `I've been thinking about this for a while, and honestly, I don't think most people realize how much the way we consume information has changed. Back in 2015, if you wanted to know something, you'd read three different articles and form your own take. Now? You prompt a machine, skim the output, and hit publish. I'm guilty of it too. The thing is — the facts might be right. But the thought never happened. And that gap between information and thought is where everything interesting used to live.`;

export default function WritingAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async (content) => {
    if (!content.trim() || content.trim().length < 50) {
      setError("Paste at least 50 characters to analyze.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.post(`${AI_URL}/api/ai/analyze-writing/`, { content });
      setResult(res.data);
    } catch (e) {
      setError("Analysis failed. Make sure the AI service is running.");
    } finally {
      setLoading(false);
    }
  };

  const useSample = () => {
    setText(SAMPLE_TEXT);
    analyze(SAMPLE_TEXT);
  };

  return (
    <section style={s.section}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={s.inner}
      >
        {/* Label */}
        <div style={s.eyebrow}>— TRY IT LIVE</div>

        <h2 style={s.title}>
          Can you tell the difference?{" "}
          <span style={s.titleAccent}>Neither can most readers.</span>
        </h2>

        <p style={s.subtitle}>
          Folio's writing analyzer measures burstiness, vocabulary diversity,
          hedge phrases, and personal voice markers — the statistical fingerprints
          that separate human thought from AI output. Paste anything below.
        </p>

        {/* Input area */}
        <div style={s.inputWrap}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste any text here — a blog post, an article, something you wrote, something an AI wrote..."
            style={s.textarea}
            rows={6}
          />
          <div style={s.inputFooter}>
            <button onClick={useSample} style={s.sampleBtn}>
              Use sample text →
            </button>
            <button
              onClick={() => analyze(text)}
              disabled={loading}
              style={loading ? { ...s.analyzeBtn, opacity: 0.5 } : s.analyzeBtn}
            >
              {loading ? "Analyzing..." : "Analyze writing"}
            </button>
          </div>
        </div>

        {error && <p style={s.error}>{error}</p>}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={s.results}
          >
            {/* Score row */}
            <div style={s.scoreRow}>
              <div style={s.scoreBlock}>
                <span style={s.scoreNum}>{result.human_percent}%</span>
                <span style={s.scoreLabel}>Human</span>
              </div>
              <div style={s.scoreDivider} />
              <div style={s.scoreBlock}>
                <span style={{ ...s.scoreNum, color: "rgba(255,255,255,0.3)" }}>
                  {result.ai_percent}%
                </span>
                <span style={s.scoreLabel}>AI Pattern</span>
              </div>
              <div style={s.verdictWrap}>
                <span style={{
                  ...s.verdict,
                  backgroundColor:
                    result.verdict_color === "green" ? "rgba(74,222,128,0.15)" :
                    result.verdict_color === "yellow" ? "rgba(250,204,21,0.15)" :
                    result.verdict_color === "orange" ? "rgba(251,146,60,0.15)" :
                    "rgba(248,113,113,0.15)",
                  color:
                    result.verdict_color === "green" ? "#4ade80" :
                    result.verdict_color === "yellow" ? "#facc15" :
                    result.verdict_color === "orange" ? "#fb923c" :
                    "#f87171",
                  border: `1px solid ${
                    result.verdict_color === "green" ? "rgba(74,222,128,0.25)" :
                    result.verdict_color === "yellow" ? "rgba(250,204,21,0.25)" :
                    result.verdict_color === "orange" ? "rgba(251,146,60,0.25)" :
                    "rgba(248,113,113,0.25)"
                  }`,
                }}>
                  {result.verdict}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={s.barTrack}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.human_percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={s.barFill}
              />
            </div>

            {/* Metrics */}
            <div style={s.metrics}>
              {Object.values(result.metrics).map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  style={s.metric}
                >
                  <div style={s.metricHeader}>
                    <span style={s.metricLabel}>{metric.label}</span>
                    <span style={s.metricScore}>{Math.round(metric.score * 100)}%</span>
                  </div>
                  <div style={s.metricTrack}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.score * 100}%` }}
                      transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: "easeOut" }}
                      style={{
                        ...s.metricFill,
                        backgroundColor:
                          metric.score > 0.6 ? "#4ade80" :
                          metric.score > 0.4 ? "#facc15" : "#f87171",
                      }}
                    />
                  </div>
                  <span style={s.metricDesc}>{metric.description}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats + disclaimer */}
            <div style={s.footer}>
              <span style={s.stat}>{result.word_count} words</span>
              <span style={s.stat}>{result.sentence_count} sentences</span>
              <span style={{ ...s.stat, marginLeft: "auto", fontStyle: "italic" }}>
                Statistical analysis only — not a definitive AI detector.
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

const s = {
  section: {
    padding: "140px 8vw",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  inner: {
    maxWidth: 820,
    margin: "0 auto",
  },
  eyebrow: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: "0.32em",
    color: "rgba(255,255,255,0.25)",
    marginBottom: 48,
  },
  title: {
    fontFamily: "Lora, serif",
    fontSize: "clamp(28px, 3.5vw, 52px)",
    fontWeight: 600,
    color: "#fff",
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    marginBottom: 20,
  },
  titleAccent: {
    fontStyle: "italic",
    color: "rgba(255,255,255,0.4)",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.35)",
    lineHeight: 1.75,
    maxWidth: 580,
    marginBottom: 48,
    fontWeight: 300,
  },
  inputWrap: {
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  textarea: {
    width: "100%",
    padding: "20px 24px",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "none",
    outline: "none",
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 1.75,
    fontFamily: "DM Sans, sans-serif",
    resize: "vertical",
    boxSizing: "border-box",
  },
  inputFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  sampleBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "monospace",
    letterSpacing: "0.05em",
    padding: 0,
  },
  analyzeBtn: {
    backgroundColor: "#fff",
    color: "#080808",
    border: "none",
    borderRadius: 999,
    padding: "9px 22px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "DM Sans, sans-serif",
  },
  error: {
    fontSize: 12,
    color: "#f87171",
    fontFamily: "monospace",
    marginBottom: 16,
  },
  results: {
    marginTop: 32,
    padding: "28px 32px",
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 4,
  },
  scoreRow: {
    display: "flex",
    alignItems: "center",
    gap: 24,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  scoreBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  scoreNum: {
    fontFamily: "Lora, serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.25)",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontFamily: "monospace",
  },
  scoreDivider: {
    width: 1,
    height: 44,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  verdictWrap: { marginLeft: "auto" },
  verdict: {
    fontSize: 11,
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: 999,
    fontFamily: "monospace",
    letterSpacing: "0.08em",
  },
  barTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 2,
    marginBottom: 28,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#4ade80",
    borderRadius: 2,
  },
  metrics: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginBottom: 20,
  },
  metric: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  metricHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    fontWeight: 500,
  },
  metricScore: {
    fontSize: 11,
    color: "rgba(255,255,255,0.2)",
    fontFamily: "monospace",
  },
  metricTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 2,
    overflow: "hidden",
  },
  metricFill: {
    height: "100%",
    borderRadius: 2,
  },
  metricDesc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.2)",
  },
  footer: {
    display: "flex",
    gap: 16,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    alignItems: "center",
    flexWrap: "wrap",
  },
  stat: {
    fontSize: 11,
    color: "rgba(255,255,255,0.2)",
    fontFamily: "monospace",
  },
}