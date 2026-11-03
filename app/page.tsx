"use client";

import { useState, useEffect, useRef } from "react";
import KenkuViewer from "./components/KenkuViewer";
import CinematicStorySection from "./components/CinematicStorySection";
import FloriaDiscoverySection from "./components/FloriaDiscoverySection";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [activeModal, setActiveModal] = useState<"explore" | "creatures" | null>(null);

  // Spotlight Reveal state with smooth lerping
  const [isHovering, setIsHovering] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: -1000, y: -1000 });
  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Smooth cursor-following movement with easing / lerp (linear interpolation)
  useEffect(() => {
    let active = true;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateLoop = () => {
      if (!active) return;
      if (currentPos.current.x !== -1000) {
        currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.15);
        currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.15);

        setSpotlightPos({
          x: Math.round(currentPos.current.x * 10) / 10,
          y: Math.round(currentPos.current.y * 10) / 10,
        });
      }
      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    // Global listener to hide reveal when cursor leaves window
    const handleWindowMouseLeave = () => {
      setIsHovering(false);
    };
    document.addEventListener("mouseleave", handleWindowMouseLeave);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      document.removeEventListener("mouseleave", handleWindowMouseLeave);
    };
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    targetPos.current = { x, y };

    if (!isHovering) {
      if (currentPos.current.x === -1000) {
        currentPos.current = { x, y };
        setSpotlightPos({ x, y });
      }
      setIsHovering(true);
    }
  };

  const handleHeroMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetPos.current = { x, y };
    currentPos.current = { x, y };
    setSpotlightPos({ x, y });
    setIsHovering(true);
  };

  const handleHeroMouseLeave = () => {
    setIsHovering(false);
  };

  // Ambient sound generator using Web Audio API
  const toggleAudio = () => {
    if (!audioActive) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(110, ctx.currentTime);

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(164.81, ctx.currentTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
        gainNodeRef.current = gainNode;
        setAudioActive(true);
      } catch (e) {
        console.error("Audio error:", e);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.8
        );
        setTimeout(() => {
          audioCtxRef.current?.close();
          setAudioActive(false);
        }, 800);
      } else {
        setAudioActive(false);
      }
    }
  };

  return (
    <div className="relative w-full bg-[#000000] text-white selection:bg-white selection:text-black">
      {/* ─────────────────────────────────────────────────────────────
          1. EXISTING FLORIA HERO SECTION (Preserved & Locked to 100vh)
          ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={handleHeroMouseEnter}
        onMouseLeave={handleHeroMouseLeave}
        className="relative h-screen w-full bg-[#000000] text-white flex flex-col justify-between overflow-hidden shrink-0"
      >
      {/* ─────────────────────────────────────────────────────────────
          1. BASE HERO IMAGE (BG_IMAGE_1)
          ───────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src="/BG_IMAGE_1.png"
          alt="Floria Realm - Base"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft edge gradients so header and footer have pristine legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CURSOR-FOLLOWING REVEAL IMAGE (BG_IMAGE_2)
          - Radius: 260px
          - Soft feathered glowing edge via radial-gradient mask
          - Completely invisible outside the spotlight
          - Above existing hero background, below UI elements
          - Smooth easing lerp
          ───────────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovering ? 1 : 0,
          WebkitMaskImage: `radial-gradient(circle 260px at ${spotlightPos.x}px ${spotlightPos.y}px, black 0%, black 140px, transparent 260px)`,
          maskImage: `radial-gradient(circle 260px at ${spotlightPos.x}px ${spotlightPos.y}px, black 0%, black 140px, transparent 260px)`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        <img
          src="/BG_IMAGE_2.png"
          alt="Floria Realm - Reveal"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Soft glowing feathered spotlight edge accent */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovering ? 0.75 : 0,
          background: `radial-gradient(circle 260px at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 235, 190, 0.08) 0%, rgba(180, 215, 255, 0.05) 55%, transparent 260px)`,
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          3. TOP NAVIGATION (z-20: Always above reveal layer)
          ───────────────────────────────────────────────────────────── */}
      <header className="relative z-20 w-full px-6 sm:px-10 md:px-14 lg:px-20 pt-6 md:pt-8 pb-4 flex items-center justify-between">
        {/* Left: Brand Identity in Frosted Capsule */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/70 border border-white/20 backdrop-blur-md shadow-2xl">
          <a
            href="/"
            className="group flex items-center gap-2.5 text-white tracking-[0.25em] font-semibold text-xs sm:text-sm uppercase transition-opacity hover:opacity-85"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white group-hover:scale-125 transition-transform" />
            <span className="font-serif">FLORIA</span>
          </a>
          <span className="hidden sm:inline-block text-[10px] tracking-[0.25em] text-neutral-300 font-mono border-l border-white/25 pl-3 uppercase">
            EDITION 01
          </span>
        </div>

        {/* Center: Editorial Navigation Links in Frosted Capsule */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-9 px-7 py-2.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md shadow-2xl">
          {[
            { label: "WORLD", href: "#world" },
            { label: "CREATURES", href: "#creatures" },
            { label: "LORE", href: "#lore" },
            { label: "CHRONICLES", href: "#chronicles" },
            { label: "ARCHIVE", href: "#archive" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                setActiveModal(item.label === "CREATURES" ? "creatures" : "explore");
              }}
              className="group relative text-[11px] tracking-[0.25em] text-white hover:text-neutral-200 uppercase transition-colors py-0.5 font-mono font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Audio toggle & Menu */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleAudio}
            type="button"
            aria-label="Toggle ambient atmospheric audio"
            className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/25 hover:border-white/60 text-[10px] tracking-[0.2em] font-mono uppercase text-white transition-all bg-black/70 backdrop-blur-md cursor-pointer shadow-2xl"
          >
            <span className="flex items-end gap-[2px] h-3">
              <span
                className={`w-[2px] bg-white rounded-full transition-all duration-300 ${
                  audioActive ? "h-3 animate-pulse" : "h-1 opacity-50"
                }`}
              />
              <span
                className={`w-[2px] bg-white rounded-full transition-all duration-300 ${
                  audioActive ? "h-2 animate-bounce" : "h-1 opacity-50"
                }`}
              />
              <span
                className={`w-[2px] bg-white rounded-full transition-all duration-300 ${
                  audioActive ? "h-3.5 animate-pulse" : "h-1 opacity-50"
                }`}
              />
            </span>
            <span className="hidden sm:inline">SOUND [{audioActive ? "ON" : "OFF"}]</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Open navigation menu"
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-full bg-black/70 border border-white/25 text-white transition-colors cursor-pointer shadow-xl backdrop-blur-md"
          >
            <span
              className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-[2px]" : "-translate-y-1"
              }`}
            />
            <span
              className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-[1px]" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col justify-between px-8 py-12 md:hidden">
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-[0.25em] font-serif uppercase">FLORIA</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs tracking-widest uppercase font-mono text-neutral-400 hover:text-white"
            >
              [ CLOSE ]
            </button>
          </div>
          <nav className="flex flex-col gap-6 my-auto">
            {["WORLD", "CREATURES", "LORE", "CHRONICLES", "ARCHIVE"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  setActiveModal(item === "CREATURES" ? "creatures" : "explore");
                }}
                className="text-2xl font-serif tracking-[0.2em] text-neutral-300 hover:text-white transition-colors uppercase"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="text-[10px] tracking-[0.25em] font-mono text-neutral-500 uppercase border-t border-white/10 pt-4">
            FLORIA REALM ARCHIVES © 2026
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. DOMINANT HERO ELEMENT: OVERSIZED "FLORIA" (z-10)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 select-none my-auto py-12 sm:py-16 md:py-20 pointer-events-none">
        {/* Editorial Sub-Eyebrow in Frosted Badge for High Visibility */}
        <div className="mb-4 sm:mb-6 md:mb-8 flex items-center gap-3 -translate-x-[5vw] sm:-translate-x-[7vw] md:-translate-x-[9vw] lg:-translate-x-[12vw] xl:-translate-x-[14vw]">
          <span className="w-6 sm:w-10 h-[1px] bg-white/40" />
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/75 border border-white/25 backdrop-blur-md shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.35em] text-white font-mono font-medium uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
              THE UNCHARTED REALM
            </span>
          </div>
          <span className="w-6 sm:w-10 h-[1px] bg-white/40" />
        </div>

        {/* The Monumental Hero Headline with 3D Kenku Model on its right */}
        <div className="relative flex items-center justify-center w-full max-w-[100vw]">
          <h1
            className="font-monumental text-[15vw] sm:text-[14vw] md:text-[13vw] lg:text-[11.5vw] xl:text-[10.5vw] font-bold leading-none tracking-[0.14em] sm:tracking-[0.16em] md:tracking-[0.18em] text-white drop-shadow-[0_12px_45px_rgba(0,0,0,0.95)] transition-transform duration-700 select-none -translate-x-[5vw] sm:-translate-x-[7vw] md:-translate-x-[9vw] lg:-translate-x-[12vw] xl:-translate-x-[14vw]"
            style={{
              paddingLeft: "0.18em",
            }}
          >
            FLORIA
          </h1>

          {/* 3D Kenku Model on the right side of FLORIA text - full body, clear horizontal gap */}
          <div className="absolute right-[2vw] sm:right-[3vw] md:right-[4vw] lg:right-[6vw] xl:right-[8vw] top-1/2 -translate-y-1/2 z-20 pointer-events-auto w-[200px] h-[300px] sm:w-[260px] sm:h-[380px] md:w-[330px] md:h-[460px] lg:w-[400px] lg:h-[540px] xl:w-[460px] xl:h-[600px] flex items-center justify-center">
            <KenkuViewer />
          </div>
        </div>

        {/* Minimal editorial coordinate tag in Frosted Badge */}
        <div className="mt-4 sm:mt-6 flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/75 border border-white/20 backdrop-blur-md shadow-2xl text-[9px] sm:text-[10px] tracking-[0.3em] font-mono text-neutral-200 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] -translate-x-[5vw] sm:-translate-x-[7vw] md:-translate-x-[9vw] lg:-translate-x-[12vw] xl:-translate-x-[14vw]">
          <span>LAT 45° 12′ N</span>
          <span>•</span>
          <span>LON 9° 18′ E</span>
          <span>•</span>
          <span>DIMENSION 0.0</span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BOTTOM TEXT AREA & CTA PLACEMENT (z-20: Above reveal layer)
          ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full px-6 sm:px-10 md:px-14 lg:px-20 pb-10 sm:pb-12 md:pb-14 pt-8 border-t border-white/[0.12] bg-gradient-to-t from-black via-black/80 to-transparent backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16">
          {/* Left Column: Supporting Text and Description */}
          <div className="max-w-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full border border-white/50 flex items-center justify-center">
                <span className="w-0.5 h-0.5 rounded-full bg-white" />
              </span>
              <span className="text-[10px] tracking-[0.25em] font-mono text-neutral-300 uppercase">
                PROLOGUE
              </span>
            </div>

            {/* Supporting Text */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide text-white font-editorial-serif leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Enter a world where creatures come alive
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-light leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              An immersive world of curious creatures, magical places, and stories waiting to be discovered.
            </p>
          </div>

          {/* Right Column: CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 shrink-0">
            {/* Primary CTA */}
            <button
              onClick={() => setActiveModal("explore")}
              type="button"
              className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-white text-black font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-[0.98] cursor-pointer shadow-xl"
            >
              <span>Explore Floria</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => setActiveModal("creatures")}
              type="button"
              className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full border border-white/30 hover:border-white bg-black/60 text-white font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 hover:bg-white/15 active:scale-[0.98] cursor-pointer backdrop-blur-md shadow-xl"
            >
              <span>Meet the Creatures</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Micro footer note */}
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[9px] tracking-[0.25em] font-mono text-neutral-400 uppercase gap-2">
          <span>© 2026 FLORIA. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-4">
            <span
              onClick={() => setActiveModal("explore")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              CHRONICLES
            </span>
            <span>/</span>
            <span
              onClick={() => setActiveModal("creatures")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              BESTIARY
            </span>
            <span>/</span>
            <span className="hover:text-white transition-colors cursor-pointer">
              COORDINATES
            </span>
          </div>
        </div>
      </footer>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. CINEMATIC SCROLL-DRIVEN STORYTELLING SECTION
          ───────────────────────────────────────────────────────────── */}
      <CinematicStorySection />

      {/* ─────────────────────────────────────────────────────────────
          3. FLORIA DISCOVERY ARCHIVE & MONUMENTAL FOOTER
          ───────────────────────────────────────────────────────────── */}
      <FloriaDiscoverySection onOpenModal={setActiveModal} />

      {/* ─────────────────────────────────────────────────────────────
          6. INTERACTIVE MODAL / EXPLORER DRAWER (z-50)
          ───────────────────────────────────────────────────────────── */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#090909] border border-white/15 rounded-2xl p-6 sm:p-8 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white text-xs font-mono tracking-widest uppercase cursor-pointer"
              aria-label="Close modal"
            >
              [ ESC / CLOSE ]
            </button>

            {activeModal === "explore" ? (
              <div className="flex flex-col gap-4">
                <span className="text-[10px] tracking-[0.3em] font-mono text-neutral-400 uppercase">
                  EXPEDITION // ARCHIVE
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif tracking-wide text-white">
                  The World of Floria
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Deep beyond the charted horizons lies Floria—a sanctuary shaped by whispering
                  winds, clay-sculpted peaks, and luminescent flora. Move your cursor across the realm
                  to unveil its nocturnal spirit.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="p-3.5 rounded-lg border border-white/10 bg-white/[0.02]">
                    <span className="block text-[9px] font-mono text-neutral-400 tracking-widest uppercase">
                      ZONE 01
                    </span>
                    <span className="text-sm font-serif text-white">The Sunlit Stream</span>
                  </div>
                  <div className="p-3.5 rounded-lg border border-white/10 bg-white/[0.02]">
                    <span className="block text-[9px] font-mono text-neutral-400 tracking-widest uppercase">
                      ZONE 02
                    </span>
                    <span className="text-sm font-serif text-white">The Lantern Grove</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <span className="text-[10px] tracking-[0.3em] font-mono text-neutral-400 uppercase">
                  BESTIARY // CODEX
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif tracking-wide text-white">
                  The Curious Creatures
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  Quiet wanderers navigating the river of dreams, keepers of twilight lanterns, and
                  sculpted guardians hidden among the blossom peaks.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                    <div>
                      <h4 className="text-sm font-serif text-white">The River Voyager</h4>
                      <p className="text-xs text-neutral-400">Paddler of the crimson boat through sacred valleys</p>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">TIER I</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                    <div>
                      <h4 className="text-sm font-serif text-white">The Blossom Spirit</h4>
                      <p className="text-xs text-neutral-400">Awakens nocturnal lanterns across the canopy</p>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">TIER S</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono text-neutral-400">
              <span>INTERACTIVE REALM ACTIVE</span>
              <button
                onClick={() => setActiveModal(null)}
                className="text-white hover:underline cursor-pointer"
              >
                RETURN TO REALM →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
