"use client";

import { links } from "@/app/data/links";
import { LinkCard } from "./LinkCard";

export function LinkGrid() {
  return (
    <section className="mt-4 space-y-3 pb-5 sm:pb-8">
      {links.map((link, index) => (
        <LinkCard key={link.id} item={link} index={index} />
      ))}
    </section>
  );
}
