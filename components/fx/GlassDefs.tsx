/**
 * Hidden SVG filter definitions for the "liquid glass" refraction.
 *
 * Rendered once near the root of the page. Elements opt in to the subtle
 * edge distortion with `style={{ filter: "url(#glass-distortion)" }}` on a
 * decorative refraction layer. The frosted blur itself is handled in CSS
 * (`.glass`), so browsers without SVG-filter support still get a clean panel.
 */
export default function GlassDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: "absolute" }}
    >
      <defs>
        <filter
          id="glass-distortion"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="22"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
