import React from "react";

// A single broadsheet newspaper page used in the intro animation.
// All visuals are CSS — no images, no emojis.
export const Newspaper = ({ headline, kicker, date = "VOL. I · NO. 01" }) => {
  return (
    <div
      data-testid="newspaper-page"
      className="blogist-paper paper-texture grain shadow-2xl"
      style={{
        width: 360,
        height: 460,
        padding: "18px 20px",
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(40,28,16,0.08)",
      }}
    >
      {/* Masthead */}
      <div className="flex items-end justify-between border-b border-[#1a1612]/40 pb-2">
        <span
          className="font-mono"
          style={{ fontSize: 9, letterSpacing: "0.18em", opacity: 0.75 }}
        >
          {date}
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 9, letterSpacing: "0.18em", opacity: 0.75 }}
        >
          PRICE — ONE THOUGHT
        </span>
      </div>

      <h1
        className="font-news text-center mt-2 mb-1"
        style={{
          fontSize: 28,
          lineHeight: 1,
          letterSpacing: "0.02em",
          fontWeight: 900,
        }}
      >
        THE BLOGIST OBSERVER
      </h1>

      <div className="flex items-center justify-center gap-3 border-b border-t border-[#1a1612]/40 py-1">
        <span
          className="font-mono"
          style={{ fontSize: 8, letterSpacing: "0.25em" }}
        >
          EST. MMXXVI
        </span>
        <span style={{ fontSize: 8, opacity: 0.5 }}>✦</span>
        <span
          className="font-mono italic"
          style={{ fontSize: 8, letterSpacing: "0.15em" }}
        >
          ORIGINAL · THOUGHT · DAILY
        </span>
      </div>

      {/* Kicker */}
      {kicker && (
        <div
          className="font-mono text-center mt-3"
          style={{ fontSize: 9, letterSpacing: "0.22em", opacity: 0.7 }}
        >
          {kicker}
        </div>
      )}

      {/* Headline */}
      <h2
        className="font-news text-center px-1 mt-2"
        style={{
          fontSize: 26,
          lineHeight: 1.05,
          fontWeight: 700,
          letterSpacing: "-0.01em",
        }}
      >
        {headline}
      </h2>

      <div
        className="text-center mt-1 italic"
        style={{ fontSize: 10, opacity: 0.7 }}
      >
        — a column on the disappearance of the human sentence —
      </div>

      {/* Three columns of fake body copy */}
      <div
        className="mt-3 grid grid-cols-3 gap-2"
        style={{ fontSize: 7.2, lineHeight: 1.45, textAlign: "justify" }}
      >
        <p>
          By the spring of last year the feed had begun to speak in a single,
          tireless voice. It was helpful. It was punctual. It was, above all
          else, indistinguishable from itself. Editors noticed first, then the
          readers, then no one at all.
        </p>
        <p>
          A small group of writers, working in the back of a print shop on
          Lispenard Street, kept refusing the offer. They wrote slowly. They
          wrote badly, at first. They wrote anyway. Their drafts were folded
          into envelopes and posted to the office without comment.
        </p>
        <p>
          The machine, asked to summarise the situation, produced six hundred
          competent words and not one of them was true. The writers, asked the
          same question, produced a sentence that made the reader sit down.
          The difference, our correspondent reports, was the sitting down.
        </p>
      </div>

      {/* Rule + tiny footer */}
      <div className="mt-3 border-t border-[#1a1612]/40 pt-1 flex justify-between">
        <span
          className="font-mono"
          style={{ fontSize: 7.5, letterSpacing: "0.2em", opacity: 0.65 }}
        >
          CONTINUED · PAGE TWO
        </span>
        <span
          className="font-mono italic"
          style={{ fontSize: 7.5, letterSpacing: "0.18em", opacity: 0.65 }}
        >
          blogist · observer
        </span>
      </div>
    </div>
  );
};

export default Newspaper;
