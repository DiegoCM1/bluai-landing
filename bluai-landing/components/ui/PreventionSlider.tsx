"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ACCENT, type Prevention } from "@/lib/content";

/**
 * Prevention slider — a faithful, dependency-free reproduction of the client's
 * reference "split slider with parallax": each slide is split into an image
 * pane (with the step title) and a copy pane (with the description). On the
 * active slide the title and paragraph slide in from the left and the image
 * gently scales (parallax-style). Navigated with arrows, dots, or swipe.
 * Adapted to the Bluai palette and the Square721 / Poppins type system.
 */
export default function PreventionSlider({ items }: { items: Prevention[] }) {
  const [active, setActive] = useState(0);
  const last = items.length - 1;
  const touchX = useRef<number | null>(null);

  const go = (i: number) => setActive(Math.max(0, Math.min(last, i)));

  // Keyboard arrows when the slider is focused.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(active + 1);
    if (e.key === "ArrowLeft") go(active - 1);
  };

  // Basic swipe.
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10 outline-none"
      role="group"
      aria-roledescription="carrusel"
      aria-label="Cultura de prevención"
      tabIndex={0}
      onKeyDown={onKey}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Track */}
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {items.map((item, i) => {
          const color = ACCENT[item.accent];
          const on = i === active;
          return (
            <div
              key={item.emphasis}
              className="flex w-full shrink-0 flex-col sm:flex-row"
              aria-hidden={!on}
            >
              {/* Image pane + title */}
              <div className="relative h-56 shrink-0 overflow-hidden sm:h-auto sm:min-h-[440px] sm:flex-1">
                <Image
                  src={item.image}
                  alt={`${item.label} ${item.emphasis}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className={`object-cover transition-transform duration-[1200ms] ease-out ${
                    on ? "scale-100" : "scale-110"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <h3
                    className={`font-display text-3xl font-extrabold leading-tight text-white drop-shadow-lg transition-all duration-700 sm:text-4xl ${
                      on ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0"
                    }`}
                    style={{ transitionDelay: on ? "120ms" : "0ms" }}
                  >
                    {item.label}{" "}
                    <span style={{ color }}>{item.emphasis}</span>
                  </h3>
                </div>
              </div>

              {/* Copy pane */}
              <div className="relative flex flex-1 items-center bg-navy-900 p-6 sm:p-10">
                <Image
                  src={item.imageActive}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover opacity-20"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-navy-950/70" aria-hidden />
                <p
                  className={`relative max-w-md whitespace-pre-line text-left text-[15px] font-medium leading-relaxed text-white/90 transition-all duration-700 sm:text-base ${
                    on ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
                  }`}
                  style={{ transitionDelay: on ? "320ms" : "0ms" }}
                >
                  {item.body}
                </p>
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-1 w-full origin-left"
                  style={{ background: color, opacity: 0.9 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button
        type="button"
        aria-label="Anterior"
        onClick={() => go(active - 1)}
        disabled={active === 0}
        className="absolute left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60 disabled:opacity-0 sm:flex"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.4">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={() => go(active + 1)}
        disabled={active === last}
        className="absolute right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60 disabled:opacity-0 sm:flex"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.4">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
        {items.map((item, i) => (
          <button
            key={item.emphasis}
            type="button"
            aria-label={`Ir a ${item.label} ${item.emphasis}`}
            aria-current={i === active}
            onClick={() => go(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === active ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
