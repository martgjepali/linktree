import { Hero } from "./components/Hero";
import { LinkGrid } from "@/app/components/LinkGrid";
import { ThemeToggle } from "./components/ThemeToggle";

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <div className="flex min-h-screen items-center justify-center px-4 py-4 sm:py-14">
      <main className="relative w-full max-w-3xl overflow-hidden glass-panel px-5 py-6 sm:px-10 sm:py-10">
        {/* Soft background glows */}
        <div
          className="glow-orb -left-24 -top-32 h-56 w-56"
          style={{ background: "var(--glow-primary)" }}
        />
        <div
          className="glow-orb -bottom-24 -right-10 h-56 w-56"
          style={{ background: "var(--glow-strong)" }}
        />

        <div className="relative space-y-6 sm:space-y-8">
          <Hero />

          <section className="mt-5 border-t border-[color:var(--border-subtle)] pt-4 sm:mt-8 sm:pt-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[color:var(--vp-text-soft)]">
              Links
            </p>

            <LinkGrid />
          </section>

          <footer className="mt-6 border-t border-border-subtle pt-4 sm:mt-8 sm:pt-6 text-center">
            <p className="text-sm text-(--vp-text-primary) font-medium mb-1.5 sm:mb-2">
              Designed by Mart Gjepali
            </p>
            <span className="text-xs text-(--vp-text-soft)">
              Contact me to create your own linktree
            </span>
          </footer>
        </div>
      </main>
    </div>
    </>
  );
}
