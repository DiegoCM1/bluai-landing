"use client";

import { ElementType, ReactNode } from "react";
import { useInView } from "@/lib/useInView";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** Element to render (defaults to a div). */
  as?: ElementType;
  className?: string;
  /** Direction the content travels in from. Defaults to "bottom". */
  from?: "bottom" | "left" | "right";
  /** Also scale up slightly on entrance (fade + scale "pop"). */
  scale?: boolean;
}

// Resting (out-of-view) offset per entrance direction.
const OFFSET: Record<NonNullable<RevealProps["from"]>, string> = {
  bottom: "translate-y-7",
  left: "-translate-x-12",
  right: "translate-x-12",
};

/**
 * Fades and slides its children into place the first time they enter the
 * viewport. Used to orchestrate the section-by-section entrance animations.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  from = "bottom",
  scale = false,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <Tag
      ref={ref}
      className={`${className} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        inView
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : `${OFFSET[from]} ${scale ? "scale-95" : ""} opacity-0`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
