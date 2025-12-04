import { Hero } from "./components/Hero";
import { LinkGrid } from "@/app/components/LinkGrid";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:py-14">
      <main className="relative w-full max-w-3xl overflow-hidden glass-panel px-6 py-8 sm:px-10 sm:py-10">
        {/* Soft background glows */}
        <div
          className="glow-orb -left-24 -top-32 h-56 w-56"
          style={{ background: "var(--glow-primary)" }}
        />
        <div
          className="glow-orb -bottom-24 -right-10 h-56 w-56"
          style={{ background: "var(--glow-strong)" }}
        />

        <div className="relative space-y-8">
          <Hero />

          <section className="mt-6 border-t border-[color:var(--border-subtle)] pt-5 sm:mt-8">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[color:var(--vp-text-soft)]">
              Links
            </p>

            <LinkGrid />
          </section>
        </div>
      </main>
    </div>
  );
}
