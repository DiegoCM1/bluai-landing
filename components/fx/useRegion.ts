"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_REGION,
  REGIONS,
  detectRegion,
  type Region,
  type RegionKey,
} from "@/lib/region";

/**
 * Resolves the visitor's region from their IP once on mount.
 * Returns the default region immediately and updates when detection resolves,
 * so the hero renders without waiting on the network.
 */
export function useRegion(): { region: Region; key: RegionKey; ready: boolean } {
  const [key, setKey] = useState<RegionKey>(DEFAULT_REGION);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    detectRegion(controller.signal).then((detected) => {
      setKey(detected);
      setReady(true);
    });
    return () => controller.abort();
  }, []);

  return { region: REGIONS[key], key, ready };
}
