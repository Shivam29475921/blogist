import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Visual-only auth modal. The brief explicitly says: no backend, just a landing.
// Keeping the surface consistent with the editorial aesthetic.
export const AuthDialog = ({ open, mode = "signup", onClose, onSwitchMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="auth-dialog"
          className="fixed inset-0 z-[120] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            onClick={onClose}
            className="absolute inset-0"
            style={{
              background: "rgba(8,8,8,0.72)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
            data-testid="auth-dialog-overlay"
          />

          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative"
            style={{
              width: "min(440px, 92vw)",
              background: "#0c0c0c",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "44px 38px 36px",
              color: "#fff",
            }}
          >
            <div
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.32em",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 28,
              }}
            >
              — {isSignup ? "JOIN BLOGIST" : "RETURN TO BLOGIST"}
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: 32,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {isSignup ? "Create your account." : "Welcome back."}
            </h3>
            <p
              className="font-body"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.55)",
                marginBottom: 28,
                fontStyle: "italic",
              }}
            >
              {isSignup
                ? "No autocomplete. No suggestions. Just your sentences."
                : "The page is still yours. Pick up where you left it."}
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 18 }}>
                <label className="flex flex-col" style={{ gap: 8 }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    EMAIL
                  </span>
                  <input
                    data-testid="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      background: "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                      padding: "10px 0",
                      color: "#fff",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 15,
                      outline: "none",
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                    placeholder="you@yourwords.com"
                  />
                </label>
                <label className="flex flex-col" style={{ gap: 8 }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    PASSWORD
                  </span>
                  <input
                    data-testid="auth-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      background: "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                      padding: "10px 0",
                      color: "#fff",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: 15,
                      outline: "none",
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                    placeholder="something only you know"
                  />
                </label>

                <button
                  data-testid="auth-submit"
                  type="submit"
                  className="pill-cta font-body"
                  style={{
                    marginTop: 18,
                    background: "#fff",
                    color: "#080808",
                    padding: "14px 22px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {isSignup ? "Open the page →" : "Continue writing →"}
                </button>
              </form>
            ) : (
              <div
                data-testid="auth-success"
                className="font-body"
                style={{
                  padding: "28px 0 8px",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.5,
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: 12,
                  }}
                >
                  — DRAFT 001 · BLANK PAGE READY
                </div>
                Your seat at the desk is reserved. The full editor is in the
                works — for now, your words are kept exactly where they belong:
                with you.
              </div>
            )}

            <div
              className="flex items-center justify-between"
              style={{ marginTop: 28 }}
            >
              <button
                data-testid="auth-switch"
                onClick={() => {
                  setSubmitted(false);
                  onSwitchMode && onSwitchMode(isSignup ? "signin" : "signup");
                }}
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color: "rgba(255,255,255,0.55)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {isSignup ? "ALREADY HERE? SIGN IN" : "NEW? CREATE ACCOUNT"}
              </button>
              <button
                data-testid="auth-close"
                onClick={onClose}
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.25em",
                  color: "rgba(255,255,255,0.4)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                CLOSE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthDialog;
