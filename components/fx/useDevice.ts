"use client";

import { useEffect, useState } from "react";

export type Device = "ios" | "android" | "other";

/**
 * Detects the visitor's mobile platform from the user agent so the UI can
 * surface the right app-store badge. Resolves on the client after mount
 * (returns "other" during SSR / before detection).
 */
export function useDevice(): Device {
  const [device, setDevice] = useState<Device>("other");

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isIPadOS =
      /Macintosh/.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1;
    if (/android/i.test(ua)) {
      setDevice("android");
    } else if (/iphone|ipad|ipod/i.test(ua) || isIPadOS) {
      setDevice("ios");
    } else {
      setDevice("other");
    }
  }, []);

  return device;
}
