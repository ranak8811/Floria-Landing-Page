"use client";

import { useEffect, useRef, useState } from "react";

// Declarations for global Three.js loaded from CDN
declare global {
  interface Window {
    THREE?: any;
  }
}

export default function KenkuViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let animId: number | null = null;
    let renderer: any = null;
    let scene: any = null;
    let camera: any = null;
    let modelPivot: any = null;

    // Mouse tracking for gaze/head following
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1 based on window
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.targetX = x;
      mouse.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Script loader helper
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });
    };

    const initThree = async () => {
      try {
        // Ensure THREE and GLTFLoader are loaded
        if (!window.THREE) {
          await loadScript(
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
          );
        }
        if (!window.THREE.GLTFLoader) {
          await loadScript(
            "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"
          );
        }

        if (!isMounted || !canvasRef.current || !containerRef.current) return;

        const THREE = window.THREE;
        const width = containerRef.current.clientWidth || 900;
        const height = containerRef.current.clientHeight || 1100;

        // Scene
        scene = new THREE.Scene();

        // Camera: framed so Kenku is 2 times smaller with full body cleanly visible
        camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
        camera.position.set(0, 0.0, 3.2);
        camera.lookAt(0, 0.0, 0);

        // Renderer with transparent background
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
        if (THREE.ACESFilmicToneMapping) {
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.35;
        }

        // Atmospheric Editorial Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        // Key Light (warm, soft front-left key light)
        const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.6);
        keyLight.position.set(2.5, 4, 3.5);
        scene.add(keyLight);

        // Moonlit Rim Light (cool blue rim light on character edges, feathers, staff)
        const rimLight = new THREE.DirectionalLight(0x88ccff, 3.8);
        rimLight.position.set(-3.5, 2.5, -2.5);
        scene.add(rimLight);

        // Warm bounce light from cherry blossom / river below
        const bounceLight = new THREE.DirectionalLight(0xffaa88, 1.4);
        bounceLight.position.set(0, -2, 2.5);
        scene.add(bounceLight);

        // Overhead light for beak and feathered cowl highlights
        const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
        topLight.position.set(0, 5, 1);
        scene.add(topLight);

        // Load the Kenku GLB Model
        const loader = new THREE.GLTFLoader();
        loader.load(
          "/3d-model/Kenku.glb",
          (gltf: any) => {
            if (!isMounted) return;

            const model = gltf.scene;

            // Compute bounding box to center model accurately at (0, 0, 0)
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());

            // Pivot container for fluid rotation & gaze tracking
            modelPivot = new THREE.Group();
            model.position.set(-center.x, -center.y, -center.z);
            modelPivot.add(model);

            // Scale Kenku to 2 times smaller
            modelPivot.scale.set(0.7, 0.7, 0.7);
            modelPivot.position.set(0, 0, 0);

            // Initial 3/4 turn towards left (facing towards the FLORIA text)
            modelPivot.rotation.y = -0.32;

            scene.add(modelPivot);
            setLoading(false);
          },
          undefined,
          (err: any) => {
            console.error("Error loading Kenku.glb:", err);
            if (isMounted) {
              setError("Failed to load 3D model");
              setLoading(false);
            }
          }
        );

        // Resize handler with auto-framing
        const handleResize = () => {
          if (!containerRef.current || !renderer || !camera) return;
          const w = containerRef.current.clientWidth;
          const h = containerRef.current.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };

        window.addEventListener("resize", handleResize);

        // Animation Loop with fluid whole-body and head/gaze following
        const clock = new THREE.Clock();
        let curRotY = -0.32;
        let curRotX = 0;
        let curRotZ = 0;

        const animate = () => {
          animId = requestAnimationFrame(animate);

          // Smooth lerp towards cursor gaze
          // target rotation: horizontal gaze (yaw), vertical tilt (pitch), subtle head roll
          const targetY = -0.32 + mouse.targetX * 0.55;
          const targetX = -mouse.targetY * 0.35;
          const targetZ = -mouse.targetX * 0.06;

          curRotY += (targetY - curRotY) * 0.08;
          curRotX += (targetX - curRotX) * 0.08;
          curRotZ += (targetZ - curRotZ) * 0.08;

          const elapsedTime = clock.getElapsedTime();
          // Organic idle breathing motion
          const idleBreath = Math.sin(elapsedTime * 1.8) * 0.02;
          const idleTilt = Math.cos(elapsedTime * 1.3) * 0.012;

          if (modelPivot) {
            modelPivot.rotation.y = curRotY;
            modelPivot.rotation.x = curRotX + idleBreath * 0.25;
            modelPivot.rotation.z = curRotZ + idleTilt;
            modelPivot.position.y = idleBreath;
          }

          renderer.render(scene, camera);
        };

        animate();

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (err: any) {
        console.error("Three init failed:", err);
        if (isMounted) {
          setError(err.message || "Three.js failed");
          setLoading(false);
        }
      }
    };

    initThree();

    return () => {
      isMounted = false;
      window.removeEventListener("mousemove", handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none"
    >
      {/* Loading state indicator */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/50 text-[10px] tracking-[0.25em] font-mono uppercase">
          <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
          <span>AWAKENING KENKU...</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
