# FLORIA — The Uncharted Realm

<p align="center">
  <img src="./public/city.png" alt="FLORIA Citadel Banner" width="100%" />
</p>

<p align="center">
  <strong>An interactive digital art exhibition and cinematic storytelling experience.</strong>
  <br />
  <em>Step beyond the horizon into an uncharted world sculpted in clay, sunlight, and crystalline spirits.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=threedotjs" alt="Three.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
</p>

---

## 🌟 Overview

**FLORIA** is a luxury, scroll-driven interactive web experience that merges digital craftsmanship with fantasy naturalism. Designed to feel like a living art book and futuristic scientific field journal, it invites visitors to explore a realm of mythical creatures, ancient citadels, and nocturnal spirits.

Every element—from cursor-responsive 3D character rigs to scroll-linked aspect ratio transforms—is engineered for immersive storytelling and 60fps/120fps fluid responsiveness.

---

## ✨ Key Features

### 🦅 1. Interactive 3D Kenku Companion
- **Real-Time GLTF / Three.js Viewer**: Renders an interactive 3D Kenku bird-spirit character situated alongside the monumental hero typography.
- **Dynamic Head & Eye Gaze Tracking**: The model computes real-time cursor offsets across the viewport, smoothly orienting its head and gaze to follow user movement with natural damping.
- **Lighting & Materials**: Multi-source studio lighting with subtle ambient fill, directional rim highlights, and cast shadows.

### 🔦 2. Cursor-Following Spotlight Reveal
- **Dual-Layer Masking**: Overlays a hidden nocturnal world (`BG_IMAGE_2`) directly atop the sunlit base artwork (`BG_IMAGE_1`).
- **Smooth Lerp Easing**: Employs mathematical linear interpolation to glide a soft-feathered 260px circular spotlight across the hero without lag or snapping.
- **Non-Destructive Compositing**: Uses CSS radial-gradient masks (`mask-image` / `-webkit-mask-image`) with `pointer-events: none` to keep all buttons, navigation items, and text fully accessible.

### 📜 3. Scroll-Driven Aspect-Ratio Storytelling
- **Fluid 9:16 to 16:9 Morph**: A central image begins as a 9:16 vertical portrait surrounded by generous negative space and an editorial "organized chaos" arrangement of notes, coordinates, and codex entries.
- **In-Place Ratio Expansion**: As the user scrolls, the portrait smoothly expands in place until it unveils the complete 16:9 panoramic citadel artwork.
- **Subpixel Hardware Acceleration**: Dimension interpolation, opacity decays, and translation vectors are rendered using continuous subpixel precision and `translate3d` to eliminate visual jitter.

### 🧬 4. Asymmetric Discovery Bestiary
- **Curated Field Journal Aesthetics**: Background watermark typography, astronomical coordinates, and specimen status crosshairs.
- **Asymmetric Grid**: Replaces uniform cards with varied aspect ratios, staggered column spans, and subtle default rotational tilts (`-1.5°` to `+1°`).
- **Interactive Micro-Interactions**: Hovering any specimen triggers smooth 3D lift, subtle rotational shifts, chromatic border glows, and image zoom.
- **Featured Specimens**:
  - *The Solaris Stag* (`Cervus Astralis`)
  - *The Lumina Moth* (`Noctiluca Vespera`)
  - *The Abyssal Lotus* (`Nelumbo Crystallina`)
  - *The Aether Whale* (`Balaena Aetheria`)
  - *The Chime Fox* (`Vulpes Silvestris`)

### 🎵 5. Procedural Web Audio Engine
- **Browser-Native Soundscape**: Synthesizes an ambient harmonic drone in real-time via the Web Audio API without requiring bulky external audio downloads.
- **Exponential Gain Ramping**: Features smooth attack and decay fades when toggling audio on or off to prevent speaker popping.

### 🏛️ 6. Monumental Art-Book Typography & Footer
- **Cinzel & Cormorant Garamond**: Elegant serif pairings with editorial monospace annotations.
- **Monolithic Branding**: Oversized, bold `FLORIA` typography that seamlessly terminates the experience with coordinates and archive links.

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| **[Next.js 16](https://nextjs.org/)** | App Router framework with Turbopack support |
| **[React 19](https://react.dev/)** | Server & Client component architecture |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Modern styling and high-performance utility system |
| **[Three.js](https://threejs.org/)** | Real-time 3D scene rendering & GLTF model handling |
| **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** | Procedural ambient synthesizer |
| **[TypeScript](https://www.typescriptlang.org/)** | Complete static type safety |

---

## 📁 Project Structure

```text
floria/
├── app/
│   ├── components/
│   │   ├── CinematicStorySection.tsx   # Scroll-driven 9:16 to 16:9 image morph
│   │   ├── FloriaDiscoverySection.tsx  # Asymmetric creature archive & footer
│   │   └── KenkuViewer.tsx             # Interactive 3D Three.js model viewer
│   ├── globals.css                     # Global design tokens, fonts & keyframes
│   ├── layout.tsx                      # Root layout, CDN scripts & font imports
│   └── page.tsx                        # Main page, spotlight reveal & hero UI
├── public/
│   ├── 3d-model/
│   │   └── Kenku.glb                   # 3D character mesh & textures
│   ├── discovery/                      # Bestiary creature exhibition imagery
│   ├── BG_IMAGE_1.png                  # Base sunlit hero artwork
│   ├── BG_IMAGE_2.png                  # Hidden nocturnal reveal layer
│   └── city.png                        # 16:9 panoramic storytelling artwork
├── .gitignore                          # Clean repository ignore rules
├── package.json                        # Dependencies and build scripts
└── README.md                           # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.18.0` or higher (Node.js 20+ recommended)
- **npm**, **pnpm**, or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ranak8811/Floria-Landing-Page.git
   cd Floria-Landing-Page
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View in browser:**
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔨 Available Scripts

- `npm run dev` — Launches the Next.js development server with hot-reload.
- `npm run build` — Compiles and optimizes the application for production.
- `npm run start` — Starts the optimized production server.
- `npm run lint` — Runs ESLint checks across the codebase.

---

## 🎨 Design System

- **Primary Canvas**: Pure Black `#000000`
- **Text & Foreground**: Brilliant White `#FFFFFF` with muted translucent steps (`white/60`, `white/20`, `white/10`)
- **Accents**: Amber Gold (`#FBBF24`), Violet Glow (`#D8B4FE`), Emerald Flora (`#6EE7B7`), Sapphire Sparks (`#7DD3FC`)
- **Typography**:
  - `Cinzel` — Monumental serif headings
  - `Cormorant Garamond` — Editorial quotes & codex entries
  - `Plus Jakarta Sans` — Clean geometric UI body copy
  - `Mono / Inconsolata` — Technical metadata stamps & coordinates

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — see the LICENSE file for details.

---

<p align="center">
  Crafted with care for the <strong>FLORIA</strong> world exploration.
</p>
