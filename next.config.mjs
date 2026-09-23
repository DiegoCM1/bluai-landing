/** @type {import('next').NextConfig} */
// Set STATIC_EXPORT=1 to produce a fully static `out/` build (for drag-and-drop
// hosting like Netlify Drop). In that mode geolocation falls back to the
// client-side geo-IP service since the /api/region route can't run.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  ...(isStaticExport ? { output: "export", images: { unoptimized: true } } : {}),

  // `/privacy` was the privacy-policy route on the previous site; it was dropped
  // in 46b3ebe when this site replaced it, and the policy now lives at
  // /aviso-de-privacidad. Anything still pointing at the old path — App Store
  // Connect's Privacy Policy URL, a shipped app build, TestFlight metadata,
  // inbound links — would otherwise hit a 404, which is an App Store rejection.
  // Permanent (308) so the store record and crawlers pick up the new location.
  //
  // Not emitted for STATIC_EXPORT=1: `output: "export"` has no server to redirect
  // with, so the rule would be silently dropped. On a static host, configure the
  // same redirect at the CDN instead.
  ...(isStaticExport
    ? {}
    : {
        async redirects() {
          return [
            { source: "/privacy", destination: "/aviso-de-privacidad", permanent: true },
          ];
        },
      }),
};

export default nextConfig;
