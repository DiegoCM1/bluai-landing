import { PLANS } from "@/lib/content";
import PriceCard from "@/components/ui/PriceCard";
import Reveal from "@/components/fx/Reveal";
import Carousel from "@/components/ui/Carousel";
import Parallax from "@/components/fx/Parallax";

/**
 * Membership / pricing section: four glass plan cards over the brand "swirl"
 * background artwork.
 */
export default function Membership() {
  return (
    <section id="membresias" className="relative overflow-hidden bg-navy-950 py-20">
      {/* Parallax swirl backdrop */}
      <Parallax speed={50} className="absolute inset-x-0 -bottom-28 -top-28 z-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/membership-bg.svg')" }}
        />
      </Parallax>

      <div className="shell relative z-10">
        <Reveal className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            <span className="text-accent-orange">Protege</span>{" "}
            <span className="text-white">lo que más quieres</span>
          </h2>
          <p className="mt-2 text-lg font-semibold text-white/85">Elige el plan ideal para ti</p>
        </Reveal>

        {/* Mobile: swipeable carousel (stacked cards "don't look good") */}
        <div className="mt-12 sm:hidden">
          <Carousel items={PLANS.map((plan) => <PriceCard key={plan.name} plan={plan} />)} />
        </div>

        {/* sm and up: grid */}
        <div className="mt-12 hidden grid-cols-2 gap-6 sm:grid xl:grid-cols-4">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 90} className="h-full" scale>
              <PriceCard plan={plan} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
