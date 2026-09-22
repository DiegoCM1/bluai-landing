import Image from "next/image";
import Link from "next/link";

/**
 * App Store placeholder and Android test download.
 * Pass `only` to render a single device-appropriate badge (used in the mobile
 * navbar). The App Store link remains a placeholder.
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
        <Link
          href="/descargar"
          aria-label="Descargar APK de pruebas de Bluai para Android"
          className="flex min-h-10 w-[91px] shrink-0 flex-col justify-center rounded-md border border-white/40 bg-black px-2 text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-cyan sm:w-[120px] lg:w-[129px]"
        >
          <span className="text-[10px] leading-tight">APK de pruebas</span>
          <span className="text-sm font-semibold leading-tight sm:text-base">Android</span>
        </Link>
      )}
    </div>
  );
}
