import Image from "next/image";

/**

 * App Store + Google Play download badges.
 *
 * Store targets live here so shipping iOS is a one-line change. Android is
 * live on Play under the `com.bluai.app` package; iOS has an App Store Connect
 * record (ascAppId 6771983891) but no public listing yet, so its badge renders
 * as a non-interactive "Próximamente" chip rather than a dead `href="#"` —
 * a link that goes nowhere is worse than an honest unavailable state, and
 * Apple's reviewers do open the marketing URL.
 *
 * When the listing goes live, set APP_STORE_URL to the constant below it.

 */
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.bluai.app";
const APP_STORE_URL: string | null = null;
// const APP_STORE_URL = "https://apps.apple.com/mx/app/bluai/id6771983891";

const badgeImg = "transition-transform hover:-translate-y-0.5";
const badgeSize = "w-[92px] sm:w-[121px] lg:w-[130px]";

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
      {showApple &&
        (APP_STORE_URL ? (
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Descargar Bluai en el App Store"
            className={badgeImg}
          >
            <Image
              src="/assets/store/appstore.png"
              alt="Descargar en el App Store"
              width={121}
              height={40}
              className={badgeSize}
              style={{ height: "auto" }}
            />
          </a>
        ) : (
          /* Not published yet: dimmed, unclickable, and labelled so the state
             is legible to screen readers as well as sighted users. */
          <span
            role="img"
            aria-label="Bluai llegará pronto al App Store"
            title="Próximamente en App Store"
            className="relative inline-block cursor-default opacity-45 grayscale"
          >
            <Image
              src="/assets/store/appstore.png"
              alt=""
              width={121}
              height={40}
              className={badgeSize}
              style={{ height: "auto" }}
              aria-hidden
            />
            <span className="pointer-events-none absolute inset-x-0 -bottom-4 text-center text-[9px] font-semibold uppercase tracking-wide text-white/70">
              Próximamente
            </span>
          </span>
        ))}

      {showGoogle && (

        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Descargar Bluai en Google Play"
          className={badgeImg}
        >
          <Image
            src="/assets/store/googleplay.png"
            alt="Disponible en Google Play"
            width={120}
            height={40}
            className={badgeSize}
            style={{ height: "auto" }}
          />
        </a>

      )}
    </div>
  );
}
