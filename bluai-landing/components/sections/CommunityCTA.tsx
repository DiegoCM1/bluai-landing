import SocialLinks from "@/components/ui/SocialLinks";
import Reveal from "@/components/fx/Reveal";
import Parallax from "@/components/fx/Parallax";

/**
 * Community band sitting between Prevention and the Video section. Its photo
 * backdrop drifts on scroll (parallax) for a sense of depth.
 */
export default function CommunityCTA() {
  return (
    <section className="relative overflow-hidden py-12">
      {/* Parallax photo backdrop (oversized so the drift never reveals edges) */}
      <Parallax speed={40} className="absolute inset-x-0 -bottom-24 -top-24 -z-10">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/community-band.jpg')" }}
        />
      </Parallax>

      <div className="shell relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold uppercase leading-tight text-white sm:text-3xl">
            ¿Quieres aprender más
            <br className="hidden sm:block" /> sobre prevención?
          </h2>
          <p className="mt-2 text-base font-medium text-white/90">
            Únete a nuestra comunidad y prepárate cada día.
          </p>
        </Reveal>

        <Reveal delay={120} className="flex flex-col items-start gap-3 md:items-center">
          <SocialLinks />
          <p className="text-sm font-medium text-white/90">Nuestras redes sociales</p>
        </Reveal>
      </div>
    </section>
  );
}
