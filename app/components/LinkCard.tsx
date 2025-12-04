"use client";

import { motion, type Variants } from "framer-motion";
import {
  AtSign,
  BriefcaseBusiness,
  Globe2,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";
import type { LinkItem } from "../types/linkType";

type Props = {
  item: LinkItem;
  index: number;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.06 * i,
    },
  }),
};

function getIcon(icon: LinkItem["icon"]) {
  const iconProps = { size: 20, strokeWidth: 1.8 };

  switch (icon) {
    case "portfolio":
      return <Globe2 {...iconProps} />;
    case "instagram":
      return <Instagram {...iconProps} />;
    case "github":
      return <Github {...iconProps} />;
    case "linkedin":
      return <Linkedin {...iconProps} />;
    case "email":
      return <AtSign {...iconProps} />;
    default:
      return <BriefcaseBusiness {...iconProps} />;
  }
}

export function LinkCard({ item, index }: Props) {
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-4 py-3 transition-transform transition-colors sm:px-5 sm:py-4"
      style={{
        boxShadow: "0 18px 45px rgba(0,0,0,0.85), 0 0 0 1px rgba(17,24,39,0.65)",
      }}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      custom={index}
      whileHover={{
        y: -3,
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow highlight on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0">
        <div className="absolute -left-10 top-0 h-28 w-28 rounded-full blur-[24px] bg-[color:var(--glow-primary)]" />
      </div>

      <div className="relative flex items-center gap-3 z-10">
        {/* Neutral VisionOS-style icon chip (rounded square) */}
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden flex-shrink-0">
          {/* Outer subtle gradient halo */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(24,24,27,0.45)] opacity-90 group-hover:opacity-100 transition-opacity" />
          {/* Inner glass layer (reduced blur to keep icon/text crisp) */}
          <div className="absolute inset-[1px] rounded-lg bg-[rgba(10,10,11,0.9)] backdrop-blur-sm ring-1 ring-[rgba(107,114,128,0.6)] group-hover:ring-[rgba(96,165,250,0.9)] transition-colors" />
          {/* Icon (force no filter so it's always crisp) */}
          <span className="relative text-[rgba(248,250,252,0.96)] group-hover:text-[rgba(243,244,246,1)] transition-colors" style={{ filter: "none" }}>
            {getIcon(item.icon)}
          </span>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[color:var(--vp-text-strong)]">
              {item.title}
            </h3>
            {item.badge ? (
              <span className="rounded-full bg-[rgba(249,250,251,0.08)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[rgba(243,244,246,1)] whitespace-nowrap">
                {item.badge}
              </span>
            ) : null}
          </div>
          {item.description ? (
            <p className="text-xs text-[color:var(--vp-text-soft)]">
              {item.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--vp-text-soft)] group-hover:text-[color:var(--accent-soft)]">
        <span>Open</span>
        <span className="text-[rgba(148,163,184,0.9)] group-hover:text-[rgba(243,244,246,1)]">
          ↗
        </span>
      </div>
    </motion.a>
  );
}
