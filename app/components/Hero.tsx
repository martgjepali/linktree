"use client";

import { motion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";

const HeroScene = dynamic(
  () => import("./HeroScene").then((mod) => mod.HeroScene),
  { ssr: false }
);

const container: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function Hero() {
  return (
    <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      {/* Left: text */}
      <motion.section
        className="relative z-10 space-y-4"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
          Software Developer
        </p>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Mart Gjepali
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-[color:var(--color-muted)] sm:text-base">
            Software developer with over five years of experience crafting
            modern, intuitive digital experiences — where engineering meets
            aesthetic precision.
          </p>
        </div>

        <p className="text-xs text-[color:var(--color-muted)]">
          Designing and building interfaces, systems, and ideas that feel
          simple, focused, and a little bit futuristic.
        </p>
      </motion.section>

      {/* Right: 3D glass panel */}
      <div className="relative h-[220px] sm:h-[260px] lg:h-[320px] xl:h-[360px] mt-6 lg:mt-0">
        {/* Halo behind cube for Vision Pro feel */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-[999px] bg-[rgba(255,255,255,0.07)] blur-[90px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative h-full"
        >
          <HeroScene />
        </motion.div>
      </div>
    </div>
  );
}
