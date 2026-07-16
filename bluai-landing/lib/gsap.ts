"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Central GSAP setup.
 * Plugins are registered exactly once on the client so individual
 * components can simply `import { gsap, ScrollTrigger } from "@/lib/gsap"`.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
