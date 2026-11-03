"use client";

import { useState } from "react";

interface CreatureItem {
  id: string;
  category: string;
  name: string;
  scientific: string;
  description: string;
  metrics: string;
  image: string;
  aspect: string;
  accentColor: string;
  borderGlow: string;
  colSpan: string;
  tilt: string;
}

const DISCOVERY_ITEMS: CreatureItem[] = [
  {
    id: "stag",
    category: "SPECIMEN // 014 • CELESTIAL FAUNA",
    name: "The Solaris Stag",
    scientific: "Cervus Astralis • Class S",
    description:
      "Grazes upon luminescent lichen in the highland veil. Its crystalline antlers conduct magnetic starlight during the equinox, guiding nocturnal wanderers through the mist.",
    metrics: "ALT. +3,180M // MAG. FLUX: 4.8T",
    image: "/discovery/stag.jpg",
    aspect: "aspect-[3/4]",
    accentColor: "text-amber-300",
    borderGlow: "group-hover:border-amber-300/40 group-hover:shadow-[0_0_50px_rgba(251,191,36,0.15)]",
    colSpan: "lg:col-span-5",
    tilt: "group-hover:-rotate-1",
  },
  {
    id: "moth",
    category: "SPECIMEN // 089 • NOCTURNAL SPECTRE",
    name: "The Lumina Moth",
    scientific: "Noctiluca Vespera • Class A",
    description:
      "Spans two cubits in wing-breadth. Emits a resonant frequency of 432 Hz as it drifts above moss-carved runic ruins, shedding stardust over sacred sanctuaries.",
    metrics: "FREQ. 432 HZ // WINGSPAN: 2.1M",
    image: "/discovery/moth.jpg",
    aspect: "aspect-[16/11]",
    accentColor: "text-violet-300",
    borderGlow: "group-hover:border-violet-300/40 group-hover:shadow-[0_0_50px_rgba(216,180,254,0.15)]",
    colSpan: "lg:col-span-7",
    tilt: "group-hover:rotate-1",
  },
  {
    id: "lotus",
    category: "FLORA // 042 • PRIMORDIAL BOTANY",
    name: "The Abyssal Lotus",
    scientific: "Nelumbo Crystallina • Class EX",
    description:
      "Blooms once every solar cycle on mirrored volcanic lagoons. Liquid starlight collects in its prismatic calyx, radiating restorative warmth through freezing alpine waters.",
    metrics: "DEPTH -14M // RADIATION: ZERO",
    image: "/discovery/lotus.jpg",
    aspect: "aspect-[3/4]",
    accentColor: "text-emerald-300",
    borderGlow: "group-hover:border-emerald-300/40 group-hover:shadow-[0_0_50px_rgba(110,231,183,0.15)]",
    colSpan: "lg:col-span-5",
    tilt: "group-hover:-rotate-1.5",
  },
  {
    id: "whale",
    category: "SANCTUARY BEAST // 002 • STRATOSPHERIC COLOSSUS",
    name: "The Aether Whale",
    scientific: "Balaena Aetheria • Monumental",
    description:
      "Navigates high-altitude thermal tides between jagged clay spires. Its low-frequency acoustic songs resonate through mountain passes, dissolving storm fronts.",
    metrics: "ELEV. +8,848M // SCALE: MONUMENTAL",
    image: "/discovery/whale.jpg",
    aspect: "aspect-[16/10]",
    accentColor: "text-amber-200",
    borderGlow: "group-hover:border-amber-200/40 group-hover:shadow-[0_0_60px_rgba(253,230,138,0.18)]",
    colSpan: "lg:col-span-7",
    tilt: "group-hover:rotate-1",
  },
  {
    id: "fox",
    category: "SPECIMEN // 031 • SACRED SPIRIT",
    name: "The Chime Fox",
    scientific: "Vulpes Silvestris • Class B",
    description:
      "Quiet guardian of overgrown ancient staircases. Leaves a trail of glowing sapphire sparks when startled by night winds, vanishing into dense fern valleys.",
    metrics: "HABITAT: TWILIGHT GROVE // SIGHTINGS: 03",
    image: "/discovery/fox.jpg",
    aspect: "aspect-[4/5]",
    accentColor: "text-sky-300",
    borderGlow: "group-hover:border-sky-300/40 group-hover:shadow-[0_0_50px_rgba(125,211,252,0.15)]",
    colSpan: "lg:col-span-6 lg:col-start-4",
    tilt: "group-hover:-rotate-1",
  },
];

export default function FloriaDiscoverySection({
  onOpenModal,
}: {
  onOpenModal?: (type: "explore" | "creatures") => void;
}) {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section
      id="discovery"
      className="relative w-full bg-[#000000] text-white overflow-hidden py-24 sm:py-36 border-t border-white/[0.08]"
    >
      
      {/* ─────────────────────────────────────────────────────────────
          1. AMBIENT FIELD JOURNAL BACKGROUND WATERMARKS & GRID
          ───────────────────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {/* Subtle radial gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-radial from-amber-500/[0.03] via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-1/3 right-10 w-[600px] h-[600px] bg-radial from-emerald-500/[0.025] via-transparent to-transparent blur-3xl" />

        {/* Oversized floating watermark words for curated field journal feel */}
        <span className="font-editorial-serif absolute top-12 -left-12 text-[14vw] sm:text-[18vw] text-white/[0.018] tracking-widest leading-none">
          ARCHIVE
        </span>
        <span className="font-editorial-serif absolute top-[38%] -right-16 text-[15vw] sm:text-[20vw] text-white/[0.016] tracking-widest leading-none">
          FAUNA
        </span>
        <span className="font-editorial-serif absolute bottom-[22%] -left-10 text-[14vw] sm:text-[18vw] text-white/[0.016] tracking-widest leading-none">
          BOTANICA
        </span>

        {/* Subtle technical field journal crosshairs & grid ticks */}
        <div className="absolute top-24 left-8 text-white/20 font-mono text-[9px] tracking-widest">
          + LAT 38° 24′ N // LONG 27° 08′ E
        </div>
        <div className="absolute top-24 right-8 text-white/20 font-mono text-[9px] tracking-widest">
          SYSTEM: FLORIA // SECTOR 07 +
        </div>
        <div className="hidden lg:block absolute bottom-32 left-12 text-white/15 font-mono text-[9px] tracking-[0.3em]">
          CLASSIFICATION SYSTEM v4.2 • ALL RIGHTS RECORDED
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SECTION HEADER (DISCOVER FLORIA)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 mb-20 sm:mb-28">
        
        {/* Small metadata ledger tag */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
          <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 text-[10px] tracking-[0.35em] font-mono text-amber-200/90 uppercase backdrop-blur-md">
            ANTHOLOGY // UNCHARTED ENTRIES
          </span>
          <span className="hidden sm:inline-block text-[10px] tracking-[0.25em] font-mono text-neutral-500">
            [ 05 VERIFIED PHENOMENA ]
          </span>
        </div>

        {/* Monumental Editorial Headline */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-white/10">
          <div>
            <h2 className="font-editorial-serif text-5xl sm:text-7xl lg:text-8xl text-white font-light tracking-tight leading-[0.95]">
              Discover Floria
            </h2>
            <p className="font-mono text-xs sm:text-sm tracking-[0.2em] text-neutral-400 uppercase mt-3">
              THE CHRONICLES OF UNKNOWN BEASTS & CRYSTAL VALLEYS
            </p>
          </div>

          <p className="max-w-xl text-neutral-300 text-sm sm:text-base font-light leading-relaxed font-sans">
            Beyond the charted horizon lies an untouched sanctuary sculpted by solar winds,
            luminescent flora, and ancient spirits. Each entry below is cataloged from the field
            notes of the first voyagers.
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. ASYMMETRIC EDITORIAL GRID (4-6 Creature/World Cards)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
          
          {DISCOVERY_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveCard(item.id)}
              onMouseLeave={() => setActiveCard(null)}
              className={`${item.colSpan} group relative rounded-2xl bg-[#070707] border border-white/15 p-4 sm:p-6 transition-all duration-700 hover:-translate-y-2 cursor-pointer shadow-2xl ${item.tilt} ${item.borderGlow}`}
              style={{
                marginTop: idx === 1 ? "2.5rem" : idx === 2 ? "-1.5rem" : idx === 4 ? "1rem" : "0",
              }}
              onClick={() => onOpenModal && onOpenModal("creatures")}
            >
              {/* Technical corner indicators */}
              <div className="absolute top-3 left-3 text-[8px] font-mono text-white/30 tracking-widest">
                ┌ REF_{idx + 1}
              </div>
              <div className="absolute top-3 right-3 text-[8px] font-mono text-white/30 tracking-widest">
                LOC.7 ┐
              </div>

              {/* Card Image Container with slight zoom and vignette */}
              <div className={`relative w-full ${item.aspect} overflow-hidden rounded-xl bg-black/80 mb-5`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center select-none transition-transform duration-700 ease-out group-hover:scale-108"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Corner Coordinates Stamp inside image */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-widest text-neutral-300">
                  {item.metrics}
                </div>
              </div>

              {/* Card Metadata & Content */}
              <div className="flex flex-col gap-2">
                <span className={`text-[10px] tracking-[0.28em] font-mono uppercase ${item.accentColor} font-medium`}>
                  {item.category}
                </span>

                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-editorial-serif text-2xl sm:text-3xl text-white font-normal tracking-wide group-hover:text-amber-100 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    VIEW CODEX →
                  </span>
                </div>

                <span className="text-xs font-mono text-neutral-400 italic">
                  {item.scientific}
                </span>

                <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed mt-2 line-clamp-3">
                  {item.description}
                </p>

                {/* Micro interaction reveals on hover */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400 transition-opacity duration-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    STATUS: ACTIVE SPECIMEN
                  </span>
                  <span className="text-white/60 group-hover:text-white transition-colors">
                    ENTRY #0{idx + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. CENTERED STRONG CALL-TO-ACTION (ENTER THE WORLD →)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-32 sm:mt-44 mb-16">
        <div className="inline-flex flex-col items-center gap-4">
          <span className="text-[10px] tracking-[0.4em] font-mono text-neutral-400 uppercase">
            IMMERSIVE EXPEDITION // 2026
          </span>
          <h3 className="font-editorial-serif text-3xl sm:text-5xl lg:text-6xl text-white font-light tracking-tight max-w-2xl">
            Step Beyond the Veil of the Known
          </h3>

          <div className="mt-6">
            <button
              onClick={() => onOpenModal && onOpenModal("explore")}
              type="button"
              className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 rounded-full bg-white text-black font-medium text-xs sm:text-sm tracking-[0.25em] uppercase transition-all duration-500 hover:bg-amber-200 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.25)] hover:shadow-[0_0_70px_rgba(251,191,36,0.45)] cursor-pointer"
            >
              <span>ENTER THE WORLD</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. MONUMENTAL FLORIA FOOTER (Art-Book Finale)
          ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 w-full mt-24 pt-16 sm:pt-24 border-t border-white/10 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          
          {/* Main 4-Column Art-Book Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 pb-16 border-b border-white/10">
            
            {/* Column 1: Expeditions */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-mono text-amber-200/90 uppercase block mb-3">
                // EXPEDITIONS
              </span>
              <ul className="space-y-2.5 font-editorial-serif text-base sm:text-lg text-neutral-300">
                <li>
                  <a
                    href="#hero"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    The Sunlit Citadel
                  </a>
                </li>
                <li>
                  <span
                    onClick={() => onOpenModal && onOpenModal("creatures")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Bestiary Codex
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => onOpenModal && onOpenModal("explore")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Highland Veils
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => onOpenModal && onOpenModal("explore")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Luminous Lagoons
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 2: Archives */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-mono text-amber-200/90 uppercase block mb-3">
                // ARCHIVE LEDGER
              </span>
              <ul className="space-y-2.5 font-editorial-serif text-base sm:text-lg text-neutral-300">
                <li>
                  <span
                    onClick={() => onOpenModal && onOpenModal("creatures")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Sanctuary Beasts
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => onOpenModal && onOpenModal("explore")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Crystalline Botany
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => onOpenModal && onOpenModal("explore")}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Cloud Canyons
                  </span>
                </li>
                <li>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    Acoustic Frequencies
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Sanctuary & Social */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-mono text-amber-200/90 uppercase block mb-3">
                // SANCTUARY NETWORK
              </span>
              <ul className="space-y-2.5 font-editorial-serif text-base sm:text-lg text-neutral-300">
                <li>
                  <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Discord Guild
                  </a>
                </li>
                <li>
                  <a href="https://artstation.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    ArtStation Gallery
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Instagram Chronicles
                  </a>
                </li>
                <li>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Twitter // Dispatch
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Curated Brand Statement */}
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.3em] font-mono text-amber-200/90 uppercase block mb-3">
                // REALM PHILOSOPHY
              </span>
              <p className="font-editorial-serif italic text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
                “Floria is an interactive living archive celebrating digital craftsmanship,
                mythological naturalism, and the wonder of the unexplored.”
              </p>
              <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>SERVER: REALM ONLINE</span>
              </div>
            </div>

          </div>

          {/* Monumental Typographic Showcase: GIGANTIC FLORIA (Full Word Visible & Bold) */}
          <div className="py-12 sm:py-20 select-none flex items-center justify-center w-full overflow-hidden">
            <h1
              className="font-monumental text-[13vw] sm:text-[12vw] md:text-[11vw] lg:text-[9.5vw] font-bold leading-none tracking-[0.12em] sm:tracking-[0.16em] bg-gradient-to-b from-white via-white/85 to-white/30 bg-clip-text text-transparent hover:from-white hover:to-white/60 transition-all duration-700 cursor-default select-none whitespace-nowrap drop-shadow-[0_10px_35px_rgba(255,255,255,0.08)]"
              style={{ paddingLeft: "0.12em" }}
            >
              FLORIA
            </h1>
          </div>

          {/* Micro Footer Bar: Metadata, Coordinates, Copyright */}
          <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] tracking-[0.25em] font-mono text-neutral-400 uppercase">
            <span>© 2026 FLORIA WORLDS LLC. ALL CHRONICLES RESERVED.</span>
            <div className="flex items-center gap-6">
              <span>LAT: 38° 24′ N</span>
              <span>•</span>
              <span>LONG: 27° 08′ E</span>
              <span>•</span>
              <span>ELEV: +420M</span>
            </div>
            <div className="flex items-center gap-4 text-neutral-400">
              <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="hover:text-white transition-colors cursor-pointer">
                BACK TO SUMMIT ↑
              </a>
            </div>
          </div>

        </div>
      </footer>

    </section>
  );
}
