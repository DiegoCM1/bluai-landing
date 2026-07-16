/**
 * Geographic region model.
 *
 * Mexico is grouped into four regions (matching the client's reference map).
 * The visitor's region is detected from their IP on load and drives which
 * city scene (calm + hurricane) is shown in the hero. If detection fails or
 * the visitor is outside Mexico, DEFAULT_REGION is used.
 */

export type RegionKey = "noroeste" | "noreste" | "sur" | "yucatan";

export interface Region {
  key: RegionKey;
  /** Human-readable region label (from the map legend). */
  label: string;
  /** Representative city for the scene. */
  city: string;
  /** Calm background image. */
  normal: string;
  /** Hurricane background image. */
  huracan: string;
}

export const REGIONS: Record<RegionKey, Region> = {
  noroeste: {
    key: "noroeste",
    label: "Noroeste y Occidente",
    city: "Los Cabos",
    normal: "/assets/regions/loscabos.jpg",
    huracan: "/assets/regions/loscabos-huracan.jpg",
  },
  noreste: {
    key: "noreste",
    label: "Noreste, Centro y Este",
    city: "Veracruz",
    normal: "/assets/regions/veracruz.jpg",
    huracan: "/assets/regions/veracruz-huracan.jpg",
  },
  sur: {
    key: "sur",
    label: "Sur (Pacífico)",
    city: "Acapulco",
    normal: "/assets/regions/acapulco.jpg",
    huracan: "/assets/regions/acapulco-huracan.jpg",
  },
  yucatan: {
    key: "yucatan",
    label: "Península de Yucatán",
    city: "Playa del Carmen",
    normal: "/assets/regions/playadelcarmen.jpg",
    huracan: "/assets/regions/playadelcarmen-huracan.jpg",
  },
};

/** Region shown when the visitor can't be located (or is outside Mexico). */
export const DEFAULT_REGION: RegionKey = "noreste";

/**
 * Diagonal city pairing requested by the client: every scene is shown together
 * with its geographic opposite (sunset ↔ sunrise), so the site reads as "Bluai
 * covers all of Mexico, from dusk to dawn".
 *   Acapulco (sur, sunset) ↔ Veracruz (noreste, sunrise)
 *   Playa del Carmen (yucatan, sunrise) ↔ Los Cabos (noroeste, sunset)
 */
export const OPPOSITE_REGION: Record<RegionKey, RegionKey> = {
  sur: "noreste",
  noreste: "sur",
  yucatan: "noroeste",
  noroeste: "yucatan",
};

/** ISO 3166-2:MX state code → region. */
const CODE_TO_REGION: Record<string, RegionKey> = {
  // Noroeste / Occidente (blue)
  BCN: "noroeste",
  BCS: "noroeste",
  SON: "noroeste",
  SIN: "noroeste",
  CHH: "noroeste",
  DUR: "noroeste",
  ZAC: "noroeste",
  NAY: "noroeste",
  JAL: "noroeste",
  COL: "noroeste",
  AGU: "noroeste",
  MIC: "noroeste",
  // Noreste, Centro y Este (red)
  COA: "noreste",
  NLE: "noreste",
  TAM: "noreste",
  SLP: "noreste",
  GUA: "noreste",
  QUE: "noreste",
  HID: "noreste",
  CMX: "noreste",
  DIF: "noreste",
  MEX: "noreste",
  MOR: "noreste",
  TLA: "noreste",
  PUE: "noreste",
  VER: "noreste",
  TAB: "noreste",
  // Sur Pacífico (green)
  GRO: "sur",
  OAX: "sur",
  CHP: "sur",
  // Península de Yucatán (purple)
  YUC: "yucatan",
  ROO: "yucatan",
  CAM: "yucatan",
};

/** Normalized Spanish state name → region (fallback when no code is given). */
const NAME_TO_REGION: Record<string, RegionKey> = {
  "baja california": "noroeste",
  "baja california sur": "noroeste",
  sonora: "noroeste",
  sinaloa: "noroeste",
  chihuahua: "noroeste",
  durango: "noroeste",
  zacatecas: "noroeste",
  nayarit: "noroeste",
  jalisco: "noroeste",
  colima: "noroeste",
  aguascalientes: "noroeste",
  michoacan: "noroeste",
  "michoacan de ocampo": "noroeste",
  coahuila: "noreste",
  "coahuila de zaragoza": "noreste",
  "nuevo leon": "noreste",
  tamaulipas: "noreste",
  "san luis potosi": "noreste",
  guanajuato: "noreste",
  queretaro: "noreste",
  hidalgo: "noreste",
  "ciudad de mexico": "noreste",
  "distrito federal": "noreste",
  mexico: "noreste",
  "estado de mexico": "noreste",
  morelos: "noreste",
  tlaxcala: "noreste",
  puebla: "noreste",
  veracruz: "noreste",
  "veracruz de ignacio de la llave": "noreste",
  tabasco: "noreste",
  guerrero: "sur",
  oaxaca: "sur",
  chiapas: "sur",
  yucatan: "yucatan",
  "quintana roo": "yucatan",
  campeche: "yucatan",
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

/** Resolve a region from a state code and/or name. */
export function regionFromState(code?: string, name?: string): RegionKey | null {
  if (code) {
    const c = code.replace(/^MX-/i, "").toUpperCase();
    if (CODE_TO_REGION[c]) return CODE_TO_REGION[c];
  }
  if (name) {
    const region = NAME_TO_REGION[normalize(name)];
    if (region) return region;
  }
  return null;
}

/**
 * Keyless, HTTPS, CORS-enabled geo-IP service used as the browser-side
 * fallback (works without signup). Swap for another provider if needed —
 * `regionFromState` accepts the state code and/or name returned by most
 * services. (Note: many geo-IP APIs block CORS on their free tier; this one
 * allows browser calls.)
 */
const GEO_API = "https://get.geojs.io/v1/ip/geo.json";

/**
 * Production path: ask our own `/api/region` route, which reads the CDN's
 * geo headers (CloudFront / Vercel / Cloudflare). No third party, no limits.
 * Returns null when running statically or when the header isn't present.
 */
async function fromApiRoute(signal?: AbortSignal): Promise<RegionKey | null> {
  try {
    const res = await fetch("/api/region", { signal });
    if (!res.ok) return null;
    const { region } = (await res.json()) as { region: RegionKey | null };
    return region;
  } catch {
    return null;
  }
}

/** Fallback path: keyless geo-IP service called from the browser. */
async function fromIpService(signal?: AbortSignal): Promise<RegionKey | null> {
  try {
    const res = await fetch(GEO_API, { signal });
    if (!res.ok) return null;
    const data: {
      success?: boolean;
      country_code?: string;
      region?: string;
      region_code?: string;
    } = await res.json();
    if (data.success === false) return null;
    if (data.country_code && data.country_code.toUpperCase() !== "MX") return null;
    return regionFromState(data.region_code, data.region);
  } catch {
    return null;
  }
}

/**
 * Detect the visitor's region: CDN geo headers first (via /api/region), then
 * a keyless geo-IP service, then the default region.
 */
export async function detectRegion(signal?: AbortSignal): Promise<RegionKey> {
  return (
    (await fromApiRoute(signal)) ??
    (await fromIpService(signal)) ??
    DEFAULT_REGION
  );
}
