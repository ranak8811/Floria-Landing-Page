"use client";

import { useEffect, useRef, useState } from "react";

function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

function smoothEase(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function CinematicStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const isTransitioning = useRef(false);
  const holdCompletionUntil = useRef(0);

  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1440,
    height: typeof window !== "undefined" ? window.innerHeight : 900,
  });

  // Track viewport dimensions on mount & resize
  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Liquid-smooth 60fps/120fps physics lerp loop (no CSS transition conflicts)
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0001) {
        // 0.085 exponential damping for buttery liquid gliding
        currentProgress.current += diff * 0.085;
        setProgress(clamp(currentProgress.current, 0, 1));
      } else if (currentProgress.current !== targetProgress.current) {
        currentProgress.current = targetProgress.current;
        setProgress(targetProgress.current);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Fluid wheel & touch interaction:
  // - Directly advances/retracts targetProgress with proportional velocity
  // - No abrupt minimum step clamps (eliminates chunky jumping on trackpad & mousewheel)
  // - Zero up/down page movement while expanding/contracting
  // - When 16:9 full image completes, subsequent scroll moves down to #discovery
  // - When back at 9:16 portrait, subsequent scroll moves up to #hero
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let touchStartY = 0;

    const isSectionActive = () => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isSectionActive()) return;

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 28; // Normalize line scrolling

      // Scrolling DOWN
      if (delta > 0) {
        if (targetProgress.current < 0.999) {
          e.preventDefault();
          // Proportional fluid delta (silky on both trackpad & mousewheel)
          const velocity = Math.min(0.06, delta * 0.00055);
          targetProgress.current = clamp(targetProgress.current + velocity, 0, 1);
          holdCompletionUntil.current = Date.now() + 300;
          return;
        }

        // Full 16:9 picture reached
        if (Date.now() < holdCompletionUntil.current) {
          e.preventDefault();
          return;
        }

        // Smoothly glide down to discovery section
        if (!isTransitioning.current) {
          isTransitioning.current = true;
          document.getElementById("discovery")?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            isTransitioning.current = false;
          }, 900);
        }
        return;
      }

      // Scrolling UP
      if (delta < 0) {
        if (targetProgress.current > 0.001) {
          e.preventDefault();
          const velocity = Math.min(0.06, Math.abs(delta) * 0.00055);
          targetProgress.current = clamp(targetProgress.current - velocity, 0, 1);
          return;
        }

        // Back at 9:16 portrait; smoothly glide up to hero
        if (!isTransitioning.current) {
          isTransitioning.current = true;
          document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            isTransitioning.current = false;
          }, 900);
        }
        return;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSectionActive()) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;

      if (deltaY > 0) {
        // Swiping up (moving down)
        if (targetProgress.current < 0.999) {
          e.preventDefault();
          const velocity = Math.min(0.05, deltaY * 0.0016);
          targetProgress.current = clamp(targetProgress.current + velocity, 0, 1);
          touchStartY = currentY;
          holdCompletionUntil.current = Date.now() + 300;
          return;
        }

        if (Date.now() < holdCompletionUntil.current) {
          e.preventDefault();
          return;
        }

        if (!isTransitioning.current) {
          isTransitioning.current = true;
          document.getElementById("discovery")?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            isTransitioning.current = false;
          }, 900);
        }
        return;
      }

      if (deltaY < 0) {
        // Swiping down (moving up)
        if (targetProgress.current > 0.001) {
          e.preventDefault();
          const velocity = Math.min(0.05, Math.abs(deltaY) * 0.0016);
          targetProgress.current = clamp(targetProgress.current - velocity, 0, 1);
          touchStartY = currentY;
          return;
        }

        if (!isTransitioning.current) {
          isTransitioning.current = true;
          document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            isTransitioning.current = false;
          }, 900);
        }
        return;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const eased = smoothEase(progress);

  // 1. Initial 9:16 vertical portrait dimensions
  const isMobile = viewport.width < 640;
  const isTablet = viewport.width >= 640 && viewport.width < 1024;
  const initialW = isMobile ? 220 : isTablet ? 260 : 300;
  const initialH = initialW * (16 / 9); // Exact vertical 9:16 portrait

  // 2. Target 16:9 landscape dimensions (city.png is natively 16:9 ratio: 1672 x 941)
  let targetW = viewport.width;
  let targetH = viewport.width * (9 / 16);

  if (targetH > viewport.height && viewport.width >= 1024) {
    targetH = viewport.height;
    targetW = viewport.height * (16 / 9);
  }

  // Subpixel continuous dimensions (no Math.round quantization jitter)
  const currentW = initialW + (targetW - initialW) * eased;
  const currentH = initialH + (targetH - initialH) * eased;
  const currentRadius = Math.max(0, 20 * (1 - eased * 1.3));
  const currentBorderAlpha = Math.max(0, 0.25 * (1 - eased * 1.5));

  // Asymmetric editorial text exits (fades and moves out smoothly)
  const op1 = mapRange(progress, 0.03, 0.30, 1, 0);
  const tx1 = -mapRange(progress, 0.03, 0.30, 0, 80);
  const ty1 = -mapRange(progress, 0.03, 0.30, 0, 60);
  const rot1 = -3 - mapRange(progress, 0.03, 0.30, 0, 5);

  const op2 = mapRange(progress, 0.05, 0.34, 1, 0);
  const tx2 = mapRange(progress, 0.05, 0.34, 0, 85);
  const ty2 = -mapRange(progress, 0.05, 0.34, 0, 55);
  const rot2 = 2.5 + mapRange(progress, 0.05, 0.34, 0, 4);

  const op3 = mapRange(progress, 0.07, 0.38, 1, 0);
  const tx3 = -mapRange(progress, 0.07, 0.38, 0, 95);
  const rot3 = 1.8 - mapRange(progress, 0.07, 0.38, 0, 4);

  const op4 = mapRange(progress, 0.09, 0.42, 1, 0);
  const tx4 = mapRange(progress, 0.09, 0.42, 0, 95);
  const rot4 = -2.2 - mapRange(progress, 0.09, 0.42, 0, 4);

  const op5 = mapRange(progress, 0.11, 0.46, 1, 0);
  const tx5 = -mapRange(progress, 0.11, 0.46, 0, 75);
  const ty5 = mapRange(progress, 0.11, 0.46, 0, 60);
  const rot5 = -1.5 - mapRange(progress, 0.11, 0.46, 0, 3);

  const op6 = mapRange(progress, 0.13, 0.48, 1, 0);
  const tx6 = mapRange(progress, 0.13, 0.48, 0, 80);
  const ty6 = mapRange(progress, 0.13, 0.48, 0, 65);
  const rot6 = 3 + mapRange(progress, 0.13, 0.48, 0, 5);

  const opPrompt = mapRange(progress, 0.0, 0.12, 1, 0);
  const finalIndicatorOp = mapRange(progress, 0.88, 1.0, 0, 1);

  return (
    <section
      id="cinematic"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#000000] text-white overflow-hidden flex items-center justify-center shrink-0"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Subtle mysterious deep ambient light */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: 1 - eased * 0.85,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 230, 190, 0.05) 0%, rgba(0, 0, 0, 0.85) 65%, #000000 100%)",
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          ASYMMETRIC EDITORIAL TEXT ELEMENTS (Organized Chaos)
          ───────────────────────────────────────────────────────────── */}

      {/* 1. Top-Left: Chapter Kicker & Title */}
      <div
        className="absolute top-[8%] left-[4%] sm:left-[8%] lg:left-[11%] z-20 pointer-events-auto will-change-transform"
        style={{
          opacity: op1,
          transform: `translate3d(${tx1.toFixed(1)}px, ${ty1.toFixed(1)}px, 0) rotate(${rot1.toFixed(2)}deg)`,
          pointerEvents: op1 < 0.1 ? "none" : "auto",
        }}
      >
        <div className="flex flex-col items-start gap-2">
          <span className="px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/20 text-[10px] tracking-[0.3em] font-mono text-amber-200/90 uppercase backdrop-blur-md shadow-lg">
            PROLOGUE II // UNCHARTED CITADEL
          </span>
          <h3 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl text-white font-light tracking-wide drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            The Sunlit Citadel
          </h3>
          <span className="text-[10px] tracking-[0.25em] font-mono text-neutral-400">
            [ GRID: 38° 24′ N // 27° 08′ E ]
          </span>
        </div>
      </div>

      {/* 2. Top-Right: Curator Codex Monologue */}
      <div
        className="absolute top-[10%] right-[4%] sm:right-[7%] lg:right-[10%] z-20 pointer-events-auto will-change-transform"
        style={{
          opacity: op2,
          transform: `translate3d(${tx2.toFixed(1)}px, ${ty2.toFixed(1)}px, 0) rotate(${rot2.toFixed(2)}deg)`,
          pointerEvents: op2 < 0.1 ? "none" : "auto",
        }}
      >
        <div className="max-w-[240px] sm:max-w-[280px] p-4 sm:p-5 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md shadow-2xl text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse" />
            <span className="text-[9px] tracking-[0.3em] font-mono text-neutral-400 uppercase">
              CODEX • ENTRY 404
            </span>
          </div>
          <p className="font-editorial-serif italic text-sm sm:text-base text-neutral-200 font-light leading-relaxed">
            “Where terracotta eaves kiss the mountain breeze, and ancient minarets overlook cobblestone avenues of endless curiosity.”
          </p>
        </div>
      </div>

      {/* 3. Left-Center: Geographic Metrics Badge */}
      <div
        className="absolute top-[48%] -translate-y-1/2 left-[3%] sm:left-[5%] lg:left-[8%] z-20 pointer-events-auto will-change-transform"
        style={{
          opacity: op3,
          transform: `translate3d(${tx3.toFixed(1)}px, 0, 0) rotate(${rot3.toFixed(2)}deg)`,
          pointerEvents: op3 < 0.1 ? "none" : "auto",
        }}
      >
        <div className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-black/70 backdrop-blur-md shadow-2xl text-left">
          <span className="text-[9px] tracking-[0.3em] font-mono text-neutral-400 uppercase block mb-2">
            SECTOR METRICS
          </span>
          <div className="space-y-1.5 font-mono text-[10px] sm:text-[11px] text-neutral-300">
            <div>
              ELEVATION: <span className="text-white font-medium">420M SEA LEVEL</span>
            </div>
            <div>
              BASIN: <span className="text-white font-medium">THE GOLDEN HARBOR</span>
            </div>
            <div>
              CLIMATE: <span className="text-amber-200 font-medium">ETERNAL DAWN</span>
            </div>
            <div>
              STATUS: <span className="text-emerald-300 font-medium">UNLOCKED REALM</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Right-Center: Monumental Numeral & Narrative Hook */}
      <div
        className="absolute top-[48%] -translate-y-1/2 right-[3%] sm:right-[5%] lg:right-[8%] z-20 pointer-events-auto will-change-transform"
        style={{
          opacity: op4,
          transform: `translate3d(${tx4.toFixed(1)}px, 0, 0) rotate(${rot4.toFixed(2)}deg)`,
          pointerEvents: op4 < 0.1 ? "none" : "auto",
        }}
      >
        <div className="relative text-left max-w-[240px] p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
          <span className="font-monumental text-5xl sm:text-6xl text-white/15 select-none block leading-none">
            02
          </span>
          <h4 className="text-xs font-mono tracking-[0.25em] text-amber-200/90 uppercase mt-2 mb-1">
            THE CITADEL AWAKENS
          </h4>
          <p className="text-xs text-neutral-300 font-light leading-relaxed">
            Beyond the river curves lies a sanctuary sculpted in clay and sunlight, sheltering wanderers from uncharted tides.
          </p>
        </div>
      </div>

      {/* 5. Bottom-Left: Discovery Tag */}
      <div
        className="absolute bottom-[10%] left-[4%] sm:left-[7%] lg:left-[10%] z-20 pointer-events-auto will-change-transform"
        style={{
          opacity: op5,
          transform: `translate3d(${tx5.toFixed(1)}px, ${ty5.toFixed(1)}px, 0) rotate(${rot5.toFixed(2)}deg)`,
          pointerEvents: op5 < 0.1 ? "none" : "auto",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-white/20 bg-black/75 backdrop-blur-md shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.25em] font-mono text-white uppercase">
            DISCOVERY // MEDITERRANEAN GROVE
          </span>
        </div>
      </div>

      {/* 6. Bottom-Right: Exhibition Stamp */}
      <div
        className="absolute bottom-[8%] right-[4%] sm:right-[7%] lg:right-[10%] z-20 pointer-events-auto will-change-transform"
        style={{
          opacity: op6,
          transform: `translate3d(${tx6.toFixed(1)}px, ${ty6.toFixed(1)}px, 0) rotate(${rot6.toFixed(2)}deg)`,
          pointerEvents: op6 < 0.1 ? "none" : "auto",
        }}
      >
        <div className="p-4 sm:p-5 rounded-2xl border border-white/15 bg-black/75 backdrop-blur-md shadow-2xl text-right">
          <span className="text-[9px] tracking-[0.3em] font-mono text-neutral-400 uppercase block mb-1">
            DIGITAL ART EXHIBIT
          </span>
          <span className="font-editorial-serif text-base sm:text-lg text-white tracking-wide block">
            The Living Metropolis
          </span>
          <span className="text-[10px] tracking-widest font-mono text-neutral-400 uppercase block mt-1">
            FLORIA ARCHIVES 2026
          </span>
        </div>
      </div>

      {/* 7. Initial Scroll Guide Prompt */}
      <div
        className="absolute bottom-[4%] left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-300 flex flex-col items-center gap-1 text-neutral-400 font-mono text-[10px] tracking-[0.3em] uppercase"
        style={{
          opacity: opPrompt,
        }}
      >
        <span className="animate-pulse">SCROLL TO EXPAND DISCOVERY</span>
        <span className="text-xs animate-bounce">↓</span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          THE HERO STORYTELLING IMAGE (@public/city.png)
          - Starts at vertical 9:16 portrait ratio in center
          - Scales with silky-smooth hardware acceleration (no CSS transition conflicts)
          - Subpixel precision avoids rounding quantization jitter
          ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 overflow-hidden flex items-center justify-center will-change-[width,height,border-radius] shadow-2xl"
        style={{
          width: `${currentW.toFixed(1)}px`,
          height: `${currentH.toFixed(1)}px`,
          borderRadius: `${currentRadius.toFixed(1)}px`,
          border:
            currentBorderAlpha > 0.01
              ? `1px solid rgba(255, 255, 255, ${currentBorderAlpha.toFixed(3)})`
              : "none",
          boxShadow:
            eased > 0.85
              ? "none"
              : `0 0 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 235, 190, ${(0.1 * (1 - eased)).toFixed(3)})`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/city.png"
          alt="The Sunlit Citadel of Floria (16:9 Full View)"
          className="w-full h-full object-cover object-[50%_45%] select-none will-change-transform pointer-events-none"
          style={{
            transform: `scale(${(1 + eased * 0.02).toFixed(4)})`,
          }}
        />

        {/* Soft edge vignette when portrait, completely clear at full 16:9 */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: 1 - eased,
            background:
              "radial-gradient(circle at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.45) 100%)",
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          16:9 COMPLETION BADGE & NAVIGATION HINT
          ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center flex flex-col items-center gap-1.5 transition-all duration-500"
        style={{
          opacity: finalIndicatorOp,
          transform: `translate3d(-50%, ${mapRange(progress, 0.88, 1.0, 15, 0).toFixed(1)}px, 0)`,
        }}
      >
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md shadow-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] font-mono text-amber-200/90 uppercase">
            16:9 PANORAMA UNVEILED • SCROLL DOWN TO EXPLORE REALM
          </span>
        </div>
      </div>

    </section>
  );
}
