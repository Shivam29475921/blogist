import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import IntroAnimation from "@/components/folio/IntroAnimation";
import Nav from "@/components/folio/Nav";
import Hero from "@/components/folio/Hero";
import Manifesto from "@/components/folio/Manifesto";
import HowItWorks from "@/components/folio/HowItWorks";
import PullQuote from "@/components/folio/PullQuote";
import TechStack from "@/components/folio/TechStack";
import FinalCTA from "@/components/folio/FinalCTA";
import Footer from "@/components/folio/Footer";
import NewspaperSpread from "@/components/folio/NewspaperSpread";
import TickerStrip from "@/components/folio/TickerStrip";
import PageIndicator from "@/components/folio/PageIndicator";
import WritingAnalyzer from "@/components/folio/WritingAnalyzer";

export default function LandingPage() {
  const [runKey, setRunKey] = useState(0);
  const navigate = useNavigate();

  const openSignUp = () => navigate("/register");
  const openSignIn = () => navigate("/login");

  return (
    <div data-testid="folio-app" style={{ background: "#080808", position: "relative" }}>
      {/* Ambient depth */}
      <div aria-hidden style={{ pointerEvents: "none", position: "absolute", inset: 0, background: "radial-gradient(60% 35% at 18% 12%, rgba(245,240,232,0.045) 0%, rgba(0,0,0,0) 60%),radial-gradient(50% 40% at 92% 42%, rgba(245,240,232,0.04) 0%, rgba(0,0,0,0) 65%),radial-gradient(70% 40% at 22% 78%, rgba(245,240,232,0.035) 0%, rgba(0,0,0,0) 60%)", zIndex: 0 }} />
      {/* Film grain */}
      <div aria-hidden style={{ pointerEvents: "none", position: "fixed", inset: 0, opacity: 0.045, mixBlendMode: "overlay", zIndex: 1, backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }} />

      {/* Scroll-driven intro */}
      <IntroAnimation
        onDone={() => window.scrollTo({ top: window.innerHeight * 3, behavior: "smooth" })}
        runKey={runKey}
      />

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
          <Nav
            onSignIn={openSignIn}
            onSignUp={openSignUp}
            onReplay={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setRunKey((k) => k + 1);
            }}
          />
          <TickerStrip />
        </div>
        <div style={{ height: 110 }} />
        <PageIndicator />

        <div id="hero"><Hero onSignUp={openSignUp} onSignIn={openSignIn} /></div>
        <div id="manifesto"><Manifesto /></div>
        <div id="spread"><NewspaperSpread /></div>
        <div id="how"><HowItWorks /></div>
        <div id="pull"><PullQuote /></div>
        <div id="stack"><TechStack /></div>
        <div id="analyzer"><WritingAnalyzer /></div>
        <div id="cta"><FinalCTA onSignUp={openSignUp} onSignIn={openSignIn} /></div>
        <Footer />
      </div>
    </div>
  );
}