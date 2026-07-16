"use client";

import dynamic from "next/dynamic";

/**
 * Client-only, lazily-loaded wrapper around LiquidGradient so the Three.js
 * bundle is fetched on demand (keeps it out of the initial page JS). Usable
 * from Server Components.
 */
const LiquidGradientLazy = dynamic(() => import("./LiquidGradient"), {
  ssr: false,
});

export default LiquidGradientLazy;
