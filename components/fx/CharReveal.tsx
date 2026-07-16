"use client";

import { CSSProperties, ElementType } from "react";
import { useInView } from "@/lib/useInView";

interface CharRevealProps {
  text: string;
  /** Element to render as (defaults to a paragraph). */
  as?: ElementType;
  className?: string;
  /** Delay between characters, in seconds. */
  stagger?: number;
  /** Delay before the first character starts, in seconds (for staggering
      multiple reveals that enter the viewport together). */
  baseDelay?: number;
  /** Substrings of `text` to colorize. */
  highlights?: string[];
  /** Color applied to highlighted substrings. */
  highlightColor?: string;
}

/**
 * Reveals text one character at a time when it scrolls into view — the
 * type-on effect from the reference pen. Implemented with a pure CSS
 * keyframe (staggered via per-char `animation-delay`) so it is robust to
 * React re-renders (only the delay/color are inline; opacity is owned by CSS)
 * and ends fully visible. Honors prefers-reduced-motion (text shows at once).
 */
export default function CharReveal({
  text,
  as: Tag = "p",
  className = "",
  stagger = 0.012,
  baseDelay = 0,
  highlights,
  highlightColor,
}: CharRevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.25 });

  // Character indices that fall inside a highlighted substring.
  const highlighted = new Set<number>();
  if (highlights && highlightColor) {
    for (const phrase of highlights) {
      let from = text.indexOf(phrase);
      while (from !== -1) {
        for (let i = from; i < from + phrase.length; i++) highlighted.add(i);
        from = text.indexOf(phrase, from + phrase.length);
      }
    }
  }

  let charIndex = 0;
  return (
    <Tag ref={ref} className={`char-reveal ${inView ? "is-in" : ""} ${className}`} aria-label={text}>
      {text.split("").map((char, i) => {
        if (char === " ") return " ";
        const delay = baseDelay + charIndex * stagger;
        charIndex += 1;
        const style: CSSProperties = { animationDelay: `${delay}s` };
        if (highlighted.has(i)) style.color = highlightColor;
        return (
          <span key={i} data-char aria-hidden style={style}>
            {char}
          </span>
        );
      })}
    </Tag>
  );
}
