"use client";

import { ReactNode, useRef, useState } from "react";

/**
 * Lightweight swipeable carousel for mobile, built on native CSS scroll-snap
 * (no dependencies). Each slide snaps to center and peeks the next one to hint
 * that the track is swipeable, and dots below show how many slides there are
 * and which one is centered. Used where stacked cards "don't look good" on
 * phones (membership plans).
 *
 * The track bleeds into the shell's horizontal padding (-mx-5 / px-5) so the
 * first and last slides can still center. The generous vertical padding
 * (negated back with margins) keeps the lifted card and its blurred glow halo
 * inside the scroll container — a scroll box clips BOTH axes, so a short
 * padding shows the halo cut off with a straight edge.
 */
export default function Carousel({
  items,
  slideClass = "w-[82%] min-w-0",
}: {
  items: ReactNode[];
  /** Width/sizing utilities for each slide (controls how much the next peeks). */
  slideClass?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // The active slide is the one whose center is closest to the viewport
  // center of the track.
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  };

  const goTo = (i: number) => {
    const track = trackRef.current;
    const slide = track?.children[i] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="-mx-5 -mb-6 -mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-12 pt-14 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-roledescription="carrusel"
      >
        {items.map((item, i) => (
          <div key={i} className={`shrink-0 snap-center ${slideClass}`}>
            {item}
          </div>
        ))}
      </div>

      {/* Slide dots: how many cards there are and which one is centered */}
      {items.length > 1 && (
        <div className="mt-1 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a la tarjeta ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
