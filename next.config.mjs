/** @type {import('next').NextConfig} */
// Set STATIC_EXPORT=1 to produce a fully static `out/` build (for drag-and-drop
// hosting like Netlify Drop). In that mode geolocation falls back to the
// client-side geo-IP service since the /api/region route can't run.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  ...(isStaticExport ? { output: "export", images: { unoptimized: true } } : {}),
};

export default nextConfig;
