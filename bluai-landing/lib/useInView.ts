"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  /** Fraction of the element that must be visible to trigger. */
  threshold?: number;
  /** Fire only the first time the element enters the viewport. */
  once?: boolean;
  /** Root margin passed to the observer (e.g. trigger slightly early). */
  rootMargin?: string;
}

/**
 * Lightweight IntersectionObserver hook.
 * Returns a ref to attach to an element and a boolean that flips to true
 * while the element is inside the viewport.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.25,
  once = true,
  rootMargin = "0px 0px -10% 0px",
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, inView };
}
