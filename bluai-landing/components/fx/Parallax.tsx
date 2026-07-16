"use client";

import { ReactNode, useEffect, useRef } from "react";

interface ParallaxProps {
  children: ReactNode;
  /** How far it drifts relative to scroll (px per viewport of travel). */
  speed?: number;
  className?: string;
}

/**
 * Subtle scroll parallax: translates its content vertically based on where it
 * sits in the viewport, giving sections a sense of depth. Disabled for
 * reduced-motion users.
 */
export default function Parallax({ children, speed = 28, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let y = 0; // current translate, subtracted from the measured rect so the
    // element's own transform never feeds back into the next measurement
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const baseTop = rect.top - y;
      // -1 (entering from bottom) .. 1 (leaving at top), clamped for safety
      const progress = Math.max(
        -1,
        Math.min(1, (baseTop + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2))
      );
      y = -progress * speed;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
