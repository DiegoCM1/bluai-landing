import Image from "next/image";

/**
 * App Store + Google Play download badges.
 * Pass `only` to render a single device-appropriate badge (used in the mobile
 * navbar). Links are placeholders pending the real store URLs.
 */
export default function AppBadges({
  className = "",
  only,
}: {
  className?: string;
  only?: "ios" | "android";
}) {
  const showApple = only !== "android";
  const showGoogle = only !== "ios";

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {showApple && (
        <a
          href="#"
          aria-label="Descargar en App Store"
          className="transition-transform hover:-translate-y-0.5"
        >
          <Image
            src="/assets/store/appstore.png"
            alt="Download on the App Store"
            width={121}
            height={40}
            className="w-[92px] sm:w-[121px] lg:w-[130px]"
            style={{ height: "auto" }}
          />
        </a>
      )}
      {showGoogle && (
        <a
          href="#"
          aria-label="Disponible en Google Play"
          className="transition-transform hover:-translate-y-0.5"
        >
          <Image
            src="/assets/store/googleplay.png"
            alt="Get it on Google Play"
            width={120}
            height={40}
            className="w-[91px] sm:w-[120px] lg:w-[129px]"
            style={{ height: "auto" }}
          />
        </a>
      )}
    </div>
  );
}
