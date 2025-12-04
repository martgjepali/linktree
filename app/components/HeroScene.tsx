"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { GlassPanel } from "./FloatingOrb";

export function HeroScene() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) =>
      setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isReducedMotion || !containerRef.current) return;

      const bounds = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
      const y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;

      // ignore when cursor is outside the hero block
      if (x < -1 || x > 1 || y < -1 || y > 1) return;

      setMousePosition({ x, y });
    },
    [isReducedMotion]
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    node.addEventListener("mousemove", handleMouseMove);
    return () => node.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent", pointerEvents: "none" }} // visually alive, but non-interactive
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[3, 3, 4]} intensity={0.35} />

          <Float
            speed={isReducedMotion ? 0 : 0.7}
            rotationIntensity={isReducedMotion ? 0 : 0.03}
            floatIntensity={isReducedMotion ? 0 : 0.1}
          >
            <GlassPanel
              mousePosition={isReducedMotion ? { x: 0, y: 0 } : mousePosition}
            />
          </Float>

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
