"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/content";
import AppBadges from "@/components/ui/AppBadges";

/**
 * Sticky top navigation: logo, primary links and store badges.
 * Compacts and deepens its shadow once the page is scrolled.
 * Collapses into a slide-down menu below the medium breakpoint.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 px-3 pt-3 transition-colors duration-300 lg:px-10 lg:pt-3 ${
        scrolled ? "bg-navy-950" : ""
      }`}
    >
      <div className="mx-auto w-full">
        <div
          className={`relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 px-4 backdrop-blur-md transition-all duration-300 sm:px-6 ${
            scrolled ? "py-2 shadow-xl shadow-black/40 backdrop-blur-xl" : "py-3.5 lg:py-[18px]"
          }`}
          style={{
            background:
              "linear-gradient(90deg, rgba(6,9,31,0.92) 0%, rgba(18,38,168,0.92) 35%, rgba(47,82,236,0.92) 60%, rgba(10,26,110,0.92) 100%)",
          }}
        >
          {/* Logo */}
          <a href="#inicio" className="flex items-center" aria-label="Bluai inicio">
            <Image
              src="/assets/logo-bluai.png"
              alt="Bluai"
              width={160}
              height={34}
              priority
              className="w-[120px] sm:w-[130px] lg:w-[160px]"
              style={{ height: "auto" }}
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-display text-[16px] font-semibold text-white/90 transition-colors hover:text-accent-cyan"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop: both badges */}
          <AppBadges className="hidden md:flex" />

          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile: show both store badges (scaled down to fit) */}
            <AppBadges className="gap-1.5" />

            {/* Mobile toggle */}
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
            >
            <span
              className={`h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
            </button>
          </div>
        </div>

        {/* Mobile menu: always mounted so it can ease in/out (fade + slide +
            collapse) instead of popping in. pointer-events are disabled while
            hidden so the invisible box never blocks taps on the hero. */}
        <div
          className={`grid transition-all duration-300 ease-out lg:hidden ${
            open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!open}
        >
          <div className="overflow-hidden">
            <div
              className={`rounded-2xl border border-white/10 bg-navy-900/95 p-4 backdrop-blur-md transition-transform duration-300 ease-out ${
                open ? "pointer-events-auto translate-y-0" : "pointer-events-none -translate-y-3"
              }`}
            >
              <nav className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className="text-base font-semibold text-white/90"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <AppBadges className="mt-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
