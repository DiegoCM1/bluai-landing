"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/useInView";

interface CountUpProps {
  /** Final value the counter eases towards. */
  end: number;
  /** Starting value (defaults to 0). */
  start?: number;
  /** Animation length in milliseconds. */
  duration?: number;
  /** Static text rendered before the number (e.g. "+" or "$"). */
  prefix?: string;
  /** Static text rendered after the number (e.g. "B"). */
  suffix?: string;
  /** Group thousands using the es-MX locale (off by default to match artwork). */
  group?: boolean;
  className?: string;
}

// easeOutExpo — fast start, gentle settle.
const ease = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Animated number that counts up from `start` to `end` the first time it
 * scrolls into view. Honors prefers-reduced-motion by snapping to the final
 * value instantly.
 */
export default function CountUp({
  end,
  start = 0,
  duration = 1800,
  prefix = "",
  suffix = "",
  group = false,
  className,
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [value, setValue] = useState(start);
  const frame = useRef<number>();

  useEffect(() => {
    if (!inView) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(end);
      return;
    }

    let startTime: number | null = null;
    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(start + (end - start) * ease(progress));
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [inView, start, end, duration]);

  const rounded = Math.round(value);
  const text = group ? rounded.toLocaleString("es-MX") : String(rounded);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
