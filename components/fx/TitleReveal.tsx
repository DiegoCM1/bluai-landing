"use client";

import { ElementType } from "react";
import { useInView } from "@/lib/useInView";

/**
 * Dynamic title reveal: splits the heading into words and floats each one up
 * (fade + slide) with a small stagger when it scrolls into view. Replaces the
 * old SVG stroke/contour effect with something livelier and lighter. The text
 * ends as a normal solid heading (color comes from `className`).
 */
export default function TitleReveal({
  text,
  as: Tag = "h2",
  className = "",
  stagger = 70,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  /** Delay between words, in ms. */
  stagger?: number;
}) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.3 });
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        // The separating space is a sibling text node, not part of the
        // inline-block span: a space trailing *inside* an inline-block gets
        // trimmed by the browser (same rule as end-of-line whitespace),
        // which collapsed every word gap to zero.
        <span key={`${word}-${i}`}>
          <span
            aria-hidden
            className="inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            style={{
              transitionDelay: `${i * stagger}ms`,
              transform: inView ? "none" : "translateY(0.6em)",
              opacity: inView ? 1 : 0,
            }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
