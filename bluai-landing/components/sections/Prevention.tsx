"use client";

import { PREVENTIONS } from "@/lib/content";
import Reveal from "@/components/fx/Reveal";
import TitleReveal from "@/components/fx/TitleReveal";
import PreventionSlider from "@/components/ui/PreventionSlider";
import PreventionHoverCard from "@/components/ui/PreventionHoverCard";
import { useRegion } from "@/components/fx/useRegion";
import { OPPOSITE_REGION, REGIONS } from "@/lib/region";

/**
 * Prevention section: a split slider (image + copy) with parallax and a
 * sliding text reveal on each step (Proteger Hogar, Colectar Víveres, Ubicar
 * Refugios, Proteger Documentos). The backdrop is the calm scene of the
 * visitor's diagonally-opposite city behind a light wash.
 */
export default function Prevention() {
  const { key } = useRegion();
  const backdrop = REGIONS[OPPOSITE_REGION[key]].normal;

  return (
    <section id="prevencion" className="relative overflow-hidden py-20 text-navy-950">
      {/* Opposite-city calm scene as a subtle photographic backdrop */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdrop})` }}
        aria-hidden
      />
      {/* Softer wash so ~10% more of the city scene's colour shows through
          (client note, NOTAS p29). */}
      <div className="absolute inset-0 -z-10 bg-white/55" aria-hidden />

      <div className="shell">
        <TitleReveal
          text="Cultura de Prevención"
          className="text-center font-display text-4xl font-extrabold text-brand sm:text-5xl"
        />

        {/* Desktop: hover-reveal cards that appear one by one on scroll */}
        <div className="mt-14 hidden grid-cols-4 gap-6 lg:grid">
          {PREVENTIONS.map((item, i) => (
            <Reveal key={item.emphasis} delay={i * 150} scale>
              <PreventionHoverCard item={item} />
            </Reveal>
          ))}
        </div>

        {/* Mobile / tablet: the split slider */}
        <Reveal delay={120} className="mx-auto mt-12 max-w-5xl lg:hidden">
          <PreventionSlider items={PREVENTIONS} />
        </Reveal>
      </div>
    </section>
  );
}
