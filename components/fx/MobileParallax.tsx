"use client";

import { useEffect, useRef, useState } from "react";
// Importing from the central module also registers the ScrollTrigger plugin.
import { gsap } from "@/lib/gsap";

/**
 * Mobile-only decorative background.
 *
 * Reproduces the flowing dashed-line effect from the reference pen: gradient
 * strokes whose dash offset is scrubbed by the scroll position, so the lines
 * appear to draw and travel as the visitor moves down the page. It is fixed,
 * non-interactive and sits behind all content. It is mounted ONLY below the
 * mobile breakpoint (it never renders on desktop) and stays still for users
 * who prefer reduced motion.
 */
const MOBILE_QUERY = "(max-width: 767px)";

// Wavy vertical guide paths drawn inside a 400 x 900 viewBox.
const PATHS = [
  "M 60 -40 C 140 120, -20 260, 90 420 S 180 720, 70 940",
  "M 210 -40 C 120 160, 320 300, 200 470 S 90 760, 230 960",
  "M 340 -40 C 420 140, 250 300, 360 480 S 280 760, 350 960",
];

export default function MobileParallax() {
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef<SVGSVGElement>(null);

  // Decide on the client only, to avoid an SSR/CSR markup mismatch.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile || !rootRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lines = rootRef.current.querySelectorAll<SVGPathElement>("path");
    const ctx = gsap.context(() => {
      lines.forEach((line, i) => {
        const length = line.getTotalLength();
        gsap.set(line, {
          strokeDasharray: `${length * 0.12} ${length * 0.16}`,
          strokeDashoffset: 0,
        });
        gsap.to(line, {
          strokeDashoffset: -length * (0.6 + i * 0.15),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <svg
      ref={rootRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-30 blur-[1px]"
      viewBox="0 0 400 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="mp-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06a8ea" />
          <stop offset="35%" stopColor="#9000fc" />
          <stop offset="70%" stopColor="#fc8400" />
          <stop offset="100%" stopColor="#00e472" />
        </linearGradient>
      </defs>
      {PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="url(#mp-grad)"
          strokeWidth={6}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
