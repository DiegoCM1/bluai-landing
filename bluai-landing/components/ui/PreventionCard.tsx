"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ACCENT, type Prevention } from "@/lib/content";
import { useInView } from "@/lib/useInView";

/**
 * Prevention card.
 *
 * Desktop: cross-fades between the photo and the info overlay on hover.
 * Touch / mobile: there is no hover, so the card auto-reveals its info as it
 * scrolls into view (and a tap can still toggle it).
 */
export default function PreventionCard({ item }: { item: Prevention }) {
  const [open, setOpen] = useState(false);
  const [touch, setTouch] = useState(false);
  const color = ACCENT[item.accent];
  const radius = "rounded-2xl rounded-br-[2.5rem]";

  // Re-fires both ways so cards reveal and hide again as they pass through.
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.6, once: false });

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  // On touch devices, drive the reveal from scroll position.
  useEffect(() => {
    if (touch) setOpen(inView);
  }, [touch, inView]);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        aria-label={
          open
            ? `${item.label} ${item.emphasis} — volver a la imagen`
            : `${item.label} ${item.emphasis} — ver consejos`
        }
        onClick={() => touch && setOpen((v) => !v)}
        onMouseEnter={() => !touch && setOpen(true)}
        onMouseLeave={() => !touch && setOpen(false)}
        className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2"
      >
        {/* aspect box on a div (Safari mis-sizes aspect-ratio on <button>) */}
        <div ref={ref} className="relative aspect-[2/3] w-full">
        {/* Front — photo */}
        <div
          className={`absolute inset-0 overflow-hidden ${radius} transition-opacity duration-500 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={item.image}
            alt={`${item.label} ${item.emphasis}`}
            fill
            sizes="(max-width: 768px) 80vw, 22vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {touch && (
            <span
              className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full shadow-lg ring-2 ring-white/30"
              style={{ background: color }}
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="prevention-arrow-hint h-5 w-5 fill-none stroke-white"
                strokeWidth="2.4"
              >
                <path d="M5 12h12M13 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>

        {/* Back — tinted photo + description */}
        <div
          className={`absolute inset-0 flex flex-col justify-end overflow-hidden p-5 ${radius} transition-opacity duration-500 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={item.imageActive}
            alt=""
            fill
            sizes="(max-width: 768px) 80vw, 22vw"
            className="object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-navy-950/35" aria-hidden />
          <div className="relative">
            <p className="text-[13px] font-semibold leading-snug text-white">{item.body}</p>
            {!touch && (
              <span
                className="mt-3 inline-block text-sm font-bold underline underline-offset-4"
                style={{ color }}
              >
                Saber más
              </span>
            )}
          </div>

          {touch && (
            <span
              className="relative mt-4 inline-flex w-fit items-center gap-1 self-end"
              style={{ color }}
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.4">
                <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>
        </div>
      </button>

      <p className="mt-4 text-lg font-semibold" style={{ color }}>
        {item.label} <span className="font-extrabold">{item.emphasis}</span> ›
      </p>
    </div>
  );
}
