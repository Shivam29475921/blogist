import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Newspaper from "./Newspaper";

const PAGES = [
  {
    headline: "Who Is Actually Writing This?",
    kicker: "FRONT PAGE · INVESTIGATIONS",
    enter: { x: "-120vw", y: "-40vh", rotate: -28 },
    rest: { x: "-30vw", y: "-18vh", rotate: -9 },
    exit: { x: "-140vw", y: "-80vh", rotate: -55 },
  },
  {
    headline: "Copy. Paste. Post. Repeat.",
    kicker: "OPINION · THE FEED",
    enter: { x: "120vw", y: "-50vh", rotate: 30 },
    rest: { x: "22vw", y: "-22vh", rotate: 7 },
    exit: { x: "150vw", y: "-90vh", rotate: 60 },
  },
  {
    headline: "AI Slop Floods The Public Feed",
    kicker: "TECHNOLOGY · LONG READ",
    enter: { x: "-130vw", y: "60vh", rotate: 24 },
    rest: { x: "-28vw", y: "14vh", rotate: -5 },
    exit: { x: "-150vw", y: "100vh", rotate: 50 },
  },
  {
    headline: "Where Did All The Voices Go?",
    kicker: "CULTURE · ESSAY",
    enter: { x: "130vw", y: "55vh", rotate: -26 },
    rest: { x: "25vw", y: "18vh", rotate: 8 },
    exit: { x: "150vw", y: "110vh", rotate: -55 },
  },
  {
    headline: "The Death Of The Original Thought",
    kicker: "EDITORIAL · LEADER",
    enter: { x: "0vw", y: "-120vh", rotate: 18 },
    rest: { x: "-4vw", y: "-8vh", rotate: -3 },
    exit: { x: "10vw", y: "-130vh", rotate: 35 },
  },
  {
    headline: "Every Post Now Sounds The Same",
    kicker: "MEDIA · ANALYSIS",
    enter: { x: "0vw", y: "120vh", rotate: -16 },
    rest: { x: "2vw", y: "20vh", rotate: 4 },
    exit: { x: "-10vw", y: "130vh", rotate: -40 },
  },
  {
    headline: "Authors, Or Just Operators?",
    kicker: "BUSINESS · CRAFT",
    enter: { x: "-110vw", y: "10vh", rotate: 22 },
    rest: { x: "-14vw", y: "2vh", rotate: 11 },
    exit: { x: "-130vw", y: "20vh", rotate: 65 },
  },
  {
    headline: "Nobody Is Reading. Everyone Is Posting.",
    kicker: "LETTERS · FROM THE EDITOR",
    enter: { x: "120vw", y: "10vh", rotate: -22 },
    rest: { x: "14vw", y: "0vh", rotate: -10 },
    exit: { x: "150vw", y: "-10vh", rotate: -65 },
  },
];

// Individual scroll-driven newspaper
const ScrollNewspaper = ({ page, sectionRef }) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // 0.0 - 0.3: fly in from enter to rest
  // 0.3 - 0.6: stay at rest
  // 0.6 - 1.0: fly out to exit

  const parseVal = (val) => {
    if (typeof val === "string" && val.includes("vw"))
      return parseFloat(val) * window.innerWidth / 100;
    if (typeof val === "string" && val.includes("vh"))
      return parseFloat(val) * window.innerHeight / 100;
    return parseFloat(val) || 0;
  };

  const xVals = [
    parseVal(page.enter.x),
    parseVal(page.rest.x),
    parseVal(page.rest.x),
    parseVal(page.exit.x),
  ];
  const yVals = [
    parseVal(page.enter.y),
    parseVal(page.rest.y),
    parseVal(page.rest.y),
    parseVal(page.exit.y),
  ];
  const rotateVals = [page.enter.rotate, page.rest.rotate, page.rest.rotate, page.exit.rotate];
  const opacityVals = [0, 1, 1, 0];

  const x = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], xVals);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], yVals);
  const rotate = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], rotateVals);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 0.9], opacityVals);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        x,
        y,
        rotate,
        opacity,
        translateX: "-50%",
        translateY: "-50%",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
        pointerEvents: "none",
      }}
    >
      <Newspaper headline={page.headline} kicker={page.kicker} />
    </motion.div>
  );
};

// Paper roll scroll-driven
const ScrollPaperRoll = ({ sectionRef }) => {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.8, 0.95], [0, 1, 1, 0]);
  const scaleX = useTransform(scrollYProgress, [0.55, 0.7], [0.02, 1]);
  const y = useTransform(scrollYProgress, [0.8, 0.95], [0, -80]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "50%",
        translateY: "-50%",
        height: 132,
        opacity,
        y,
        pointerEvents: "none",
      }}
    >
      {/* Top torn edge */}
      <div style={{ position: "absolute", left: 0, right: 0, top: -6, height: 8, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(60,40,20,0.18) 100%)", clipPath: "polygon(0 100%, 2% 60%, 5% 90%, 8% 50%, 12% 88%, 16% 55%, 20% 92%, 24% 60%, 28% 86%, 32% 52%, 36% 90%, 40% 58%, 44% 88%, 48% 50%, 52% 92%, 56% 56%, 60% 86%, 64% 60%, 68% 88%, 72% 54%, 76% 90%, 80% 58%, 84% 86%, 88% 52%, 92% 88%, 96% 56%, 100% 90%, 100% 100%, 0 100%)" }} />

      <motion.div
        className="folio-paper paper-texture grain"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          scaleX,
          transformOrigin: "center",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(40,28,16,0.1)",
        }}
      >
        <div className="marquee-track" style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap" }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="font-news" style={{ display: "flex", alignItems: "center", fontSize: 64, fontWeight: 800, letterSpacing: "0.02em", paddingRight: 48 }}>
              <span style={{ marginRight: 36 }}>✦</span>
              <span style={{ marginRight: 36 }}>FOLIO</span>
              <span style={{ marginRight: 36 }}>✦</span>
              <span style={{ marginRight: 36 }}>YOUR WORDS</span>
              <span style={{ marginRight: 36 }}>✦</span>
              <span style={{ marginRight: 36 }}>YOUR IDEAS</span>
              <span style={{ marginRight: 36 }}>✦</span>
              <span style={{ marginRight: 36 }}>YOUR VOICE</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom torn edge */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -6, height: 8, background: "linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(60,40,20,0.18) 100%)", clipPath: "polygon(0 0, 2% 40%, 5% 10%, 8% 50%, 12% 12%, 16% 45%, 20% 8%, 24% 40%, 28% 14%, 32% 48%, 36% 10%, 40% 42%, 44% 12%, 48% 50%, 52% 8%, 56% 44%, 60% 14%, 64% 40%, 68% 12%, 72% 46%, 76% 10%, 80% 42%, 84% 14%, 88% 48%, 92% 12%, 96% 44%, 100% 10%, 100% 0, 0 0)" }} />
    </motion.div>
  );
};

export const IntroAnimation = ({ onDone, runKey = 0 }) => {
  const sectionRef = useRef(null);

  return (
    <div
      ref={sectionRef}
      data-testid="intro-animation"
      style={{
        position: "relative",
        height: "300vh", // tall section so scroll has room
        background: "#080808",
      }}
    >
      {/* Sticky container so content stays centered while scrolling */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", perspective: 1400 }}>
        {/* Vignette */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0) 60%)", pointerEvents: "none" }} />

        {PAGES.map((p, i) => (
          <ScrollNewspaper key={i} page={p} sectionRef={sectionRef} />
        ))}

        <ScrollPaperRoll sectionRef={sectionRef} />

        {/* Skip button */}
        <button
          onClick={onDone}
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
            background: "transparent",
            color: "rgba(255,255,255,0.35)",
            border: "1px solid rgba(255,255,255,0.12)",
            padding: "8px 16px",
            borderRadius: 999,
            cursor: "pointer",
            fontSize: 11,
            letterSpacing: "0.2em",
            fontFamily: "monospace",
            zIndex: 10,
          }}
        >
          SKIP →
        </button>
      </div>
    </div>
  );
};

export default IntroAnimation;