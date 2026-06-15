import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STACK = [
  "React + Vite", "Django REST", "PostgreSQL",
  "Docker Compose", "Groq AI", "JWT Auth", "Kubernetes",
];

const SERVICES = [
  { name: "auth", port: "8001", status: "READY" },
  { name: "posts", port: "8002", status: "READY" },
  { name: "comments", port: "8003", status: "READY" },
  { name: "ai", port: "8004", status: "READY" },
  { name: "postgres", port: "5432", status: "READY" },
];

export const TechStack = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1100);
    return () => clearInterval(i);
  }, []);

  return (
    <section data-testid="tech-stack-section" style={{ position: "relative", padding: "140px 8vw" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 80 }}>

        {/* Left column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.6 }}
            className="font-mono"
            style={{ fontSize: 11, letterSpacing: "0.32em", color: "rgba(255,255,255,0.35)", marginBottom: 40 }}
          >
            — UNDER THE HOOD
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.7 }}
            className="font-display"
            style={{ fontSize: "clamp(34px, 3.6vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#fff", fontWeight: 600, marginBottom: 36 }}
          >
            Built like a newsroom.
            <br />
            <span style={{ color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>
              Wired like a server room.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
            className="font-body"
            style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.6)", maxWidth: "40ch", marginBottom: 48 }}
          >
            Five small services, one quiet rule — the human writes the sentence. Everything else is plumbing.
          </motion.p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {STACK.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="font-mono"
                style={{ fontSize: 12, letterSpacing: "0.08em", padding: "8px 14px", color: "rgba(255,255,255,0.78)", borderBottom: "1px solid rgba(255,255,255,0.18)" }}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right column — terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }} transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div
            data-testid="terminal-box"
            className="font-mono"
            style={{ background: "#0c0c0c", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: 28, fontSize: 13, lineHeight: 1.85, color: "rgba(255,255,255,0.85)", boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.02)" }}
          >
            {/* Terminal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 9, height: 9, borderRadius: 999, background: "rgba(255,255,255,0.18)", display: "inline-block" }} />
                <span style={{ width: 9, height: 9, borderRadius: 999, background: "rgba(255,255,255,0.32)", display: "inline-block" }} />
                <span style={{ width: 9, height: 9, borderRadius: 999, background: "rgba(255,255,255,0.55)", display: "inline-block" }} />
              </div>
              <span style={{ fontSize: 10, letterSpacing: "0.25em", color: "rgba(255,255,255,0.38)" }}>folio · docker compose · up</span>
              <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.28)" }}>~/folio</span>
            </div>

            <div style={{ color: "rgba(255,255,255,0.45)" }}>
              <span style={{ color: "rgba(255,255,255,0.85)" }}>$</span> docker compose up
            </div>
            <div style={{ height: 12 }} />

            {SERVICES.map((srv, i) => {
              const visible = tick >= i;
              return (
                <div key={srv.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", opacity: visible ? 1 : 0.15, transition: "opacity 0.5s ease" }}>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>
                    <span style={{ color: "rgba(255,255,255,0.85)" }}>folio_{srv.name}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}> ::{srv.port} </span>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>────────</span>
                  </span>
                  <span style={{ letterSpacing: "0.2em", fontSize: 11, color: visible ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)" }}>
                    [{visible ? srv.status : "WAITING"}]
                  </span>
                </div>
              );
            })}

            <div style={{ height: 16 }} />
            <div style={{ color: "rgba(255,255,255,0.45)" }}>
              <span style={{ color: "rgba(255,255,255,0.85)" }}>$</span> folio --status
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)" }}>
              all services healthy. queue: 0. authors online:{" "}
              <span style={{ color: "rgba(255,255,255,0.95)" }}>{1247 + (tick % 9)}</span>.
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)" }}>
              ai mode: <span style={{ color: "rgba(255,255,255,0.95)" }}>research-only</span> (no generation, no autocomplete).
            </div>
            <div style={{ marginTop: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.85)" }}>$</span>{" "}
              <span className="cursor-blink" style={{ marginLeft: 2 }}>▌</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;