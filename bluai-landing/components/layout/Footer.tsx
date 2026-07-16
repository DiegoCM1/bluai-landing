import Image from "next/image";
import { FOOTER_NAV } from "@/lib/content";
import NewsletterForm from "@/components/ui/NewsletterForm";

/**
 * Site footer over the textured navy artwork: brand blurb, navigation and
 * legal columns, and a newsletter sign-up for the prevention community.
 */
export default function Footer() {
  return (
    <footer
      className="relative text-white"
      style={{
        backgroundImage: "url('/assets/footer-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-navy-950/40" aria-hidden />

      <div className="shell relative grid grid-cols-1 gap-10 py-14 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Image
            src="/assets/logo-bluai.png"
            alt="Bluai"
            width={150}
            height={32}
            className="w-[150px]"
            style={{ height: "auto" }}
          />
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-white/70">
            Prevención avanzada y acción comunitaria impulsadas por inteligencia artificial e
            información oficial del Gobierno de México para enfrentar la crisis climática.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="mb-4 border-b border-white/20 pb-2 text-sm font-bold uppercase tracking-wide">
            Navegación
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            {FOOTER_NAV.navegacion.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-colors hover:text-accent-cyan">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="mb-4 border-b border-white/20 pb-2 text-sm font-bold uppercase tracking-wide">
            Legal
          </h3>
          <ul className="space-y-2 text-sm text-white/80">
            {FOOTER_NAV.legal.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-colors hover:text-accent-cyan">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="mb-4 border-b border-white/20 pb-2 text-sm font-bold uppercase tracking-wide">
            Únete a la cultura de prevención
          </h3>
          <p className="mb-3 text-xs leading-relaxed text-white/70">
            Recibe contenido exclusivo sobre seguridad familiar que fortalece a nuestra comunidad
            antes, durante y después del paso del Huracán.{" "}
            <span className="font-semibold text-white">Únirme a Bluai</span>
          </p>
          <NewsletterForm />
        </div>
      </div>
    </footer>
  );
}
