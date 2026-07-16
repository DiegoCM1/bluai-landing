import { ACCENT, type Feature } from "@/lib/content";
import CharReveal from "@/components/fx/CharReveal";
import Reveal from "@/components/fx/Reveal";

/**
 * Hero feature card matching the delivered design: a chevroned title sitting
 * *outside* the card, and the designed panel rebuilt in CSS — a blue→dark
 * gradient with rounded corners and a glowing accent bar peeking from the
 * bottom edge. Drawing the frame in CSS (instead of stretching the artwork
 * bitmap) keeps every card's shape identical regardless of how much text it
 * holds. The whole card fades/slides in on a staggered delay and its title
 * and body then type on character by character.
 */
export default function FeatureCard({
  feature,
  className = "",
  delay = 0,
  fill = false,
}: {
  feature: Feature;
  className?: string;
  /** Entrance offset (seconds) so cards reveal one after another. */
  delay?: number;
  /** Stretch the panel to the container height so stacked cards match. */
  fill?: boolean;
}) {
  const color = ACCENT[feature.accent];

  return (
    <Reveal className={`${className} ${fill ? "h-full" : ""}`} delay={Math.round(delay * 1000)} scale>
      <div className={fill ? "flex h-full flex-col" : undefined}>
        <h3 className="mb-3 flex items-start gap-1.5 text-[26px] font-extrabold leading-tight text-white">
          <span style={{ color }} aria-hidden>
            ›
          </span>
          {/* "\n" in the title forces the reference line break on desktop only;
              on mobile the segments flow inline as a single line. */}
          <span>
            {feature.title.split("\n").map((segment, s) => (
              <CharReveal
                key={s}
                as="span"
                text={segment}
                stagger={0.03}
                baseDelay={delay + s * 0.12}
                className="lg:block"
              />
            ))}
          </span>
        </h3>

        {/* Panel + accent bar, matching the delivered card artwork
            (public/assets/cards/*.webp): a horizontal bright-blue→near-black
            gradient panel, a dark backdrop offset to the bottom-right, and a
            full-width white→accent bar peeking out below the panel. Rebuilt in
            CSS so the shape stays crisp at any card height. */}
        {/* pb (not a margin on the panel) reserves the strip where the bar
            peeks out — a margin would collapse and hide the bar behind the panel. */}
        <div className={`relative pb-3.5 transition-transform duration-300 hover:-translate-y-1.5 ${fill ? "flex-1" : ""}`}>
          {/* Accent bar peeking below the panel (no dark backdrop card — the
              client's final design drops it): a single hue running from fully
              transparent on the left to full intensity on the right, starting
              at the panel's left edge and ending in a rounded pill just short
              of its right edge. */}
          <span
            className="absolute bottom-0 left-0 right-[6%] h-5 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${color}00 0%, ${color} 100%)`,
              boxShadow: "0 10px 24px rgba(4, 8, 28, 0.4)",
            }}
            aria-hidden
          />
          <div
            className={`relative rounded-xl px-6 pb-6 pt-5 shadow-[0_18px_40px_rgba(4,8,28,0.45)] ${
              fill ? "h-full" : ""
            }`}
            style={{
              background: "linear-gradient(90deg, #3d5ffd 0%, #26398c 52%, #0a0e27 100%)",
            }}
          >
            {/* Blank line in the copy ("\n\n") splits the body into paragraphs,
                mirroring the reference cards. */}
            {feature.body.split("\n\n").map((paragraph, p) => (
              <CharReveal
                key={p}
                as="p"
                text={paragraph}
                baseDelay={delay + 0.12 + p * 0.1}
                highlights={feature.highlights}
                highlightColor={color}
                className={`text-[12px] leading-relaxed text-white/85 ${p > 0 ? "mt-3" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
