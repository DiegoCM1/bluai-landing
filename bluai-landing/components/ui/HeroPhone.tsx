import Image from "next/image";

/**
 * Phone-in-hand mockup whose on-screen app view swaps depending on which hero
 * card is hovered. The client delivered one full hand+phone composite per
 * card with identical framing (only the screen content differs), so instead
 * of overlaying screenshots on a screen rectangle, every composite is stacked
 * and toggled by opacity. All variants load eagerly and the toggle has no
 * transition, so the swap is instant and reads as the phone changing screen —
 * never as an image being replaced.
 */

// One composite per hero card, plus the resting home screen (Bluai splash).
export const PHONE_SCREENS = {
  home: "/assets/phone/home.webp",
  mantente: "/assets/phone/mantente-a-salvo.webp",
  ia: "/assets/phone/ia-empatica.webp",
  notificaciones: "/assets/phone/notificaciones-geo.webp",
  proteccion: "/assets/phone/proteccion-familiar.webp",
  escudo: "/assets/phone/escudo-digital.webp",
} as const;

const VARIANTS = Object.values(PHONE_SCREENS);

export default function HeroPhone({
  active,
  className = "",
}: {
  active?: string;
  className?: string;
}) {
  // When no card is active the phone rests on its home (splash) screen.
  const current = active ?? PHONE_SCREENS.home;

  return (
    <div className={`relative ${className}`}>
      {/* Glow behind the device */}
      <div
        className="absolute inset-x-6 bottom-6 top-10 -z-10 rounded-[2.5rem] blur-2xl"
        style={{ background: "radial-gradient(closest-side, #3900ff, transparent)" }}
        aria-hidden
      />

      {/* Stacked composites: the first keeps the layout height, the rest sit
          on top; only the active one is visible. */}
      {VARIANTS.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={
            src === current
              ? "Aplicación Bluai en un teléfono sostenido en la mano"
              : ""
          }
          aria-hidden={src !== current}
          width={900}
          height={1343}
          priority
          className={`h-auto w-full drop-shadow-2xl ${
            i === 0 ? "relative" : "absolute inset-0"
          } ${src === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
