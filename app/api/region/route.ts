import { NextRequest, NextResponse } from "next/server";
import { regionFromState, type RegionKey } from "@/lib/region";

// Runs per-request so it can read live geo headers. Note: this makes the
// route incompatible with a fully static export (STATIC_EXPORT=1); on static
// hosts, drop this route and rely on the client-side geo-IP fallback.
export const dynamic = "force-dynamic";

/**
 * Resolves the visitor's region from the hosting/CDN geo headers.
 *
 * Works out of the box on platforms that inject viewer-geo headers:
 *   - AWS CloudFront: CloudFront-Viewer-Country / -Country-Region
 *   - Vercel:         x-vercel-ip-country / -country-region(-name)
 *   - Cloudflare:     cf-ipcountry / cf-region-code / cf-region
 *
 * (On CloudFront these headers must be whitelisted in the cache/origin
 * request policy.) When no geo header is present — e.g. local dev or a fully
 * static export — it returns { region: null } and the client falls back to
 * the geo-IP service. No third-party calls are made here.
 */
export function GET(req: NextRequest) {
  const h = req.headers;

  const country = (
    h.get("cloudfront-viewer-country") ||
    h.get("x-vercel-ip-country") ||
    h.get("cf-ipcountry") ||
    h.get("x-country") ||
    ""
  ).toUpperCase();

  const regionCode =
    h.get("cloudfront-viewer-country-region") ||
    h.get("x-vercel-ip-country-region") ||
    h.get("cf-region-code") ||
    h.get("x-region") ||
    undefined;

  // Some providers send the region name (URL-encoded) instead of the code.
  const decode = (value: string | null) => {
    if (!value) return undefined;
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };
  const regionName = decode(
    h.get("x-vercel-ip-country-region-name") || h.get("cf-region"),
  );

  // Outside Mexico (or no country header) → let the client decide / default.
  if (country && country !== "MX") {
    return NextResponse.json({ region: null as RegionKey | null, source: "header" });
  }

  const region = regionFromState(regionCode, regionName);
  return NextResponse.json({
    region,
    source: region ? "header" : "none",
  });
}
