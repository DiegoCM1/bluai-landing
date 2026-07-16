import Reveal from "@/components/fx/Reveal";
import Parallax from "@/components/fx/Parallax";
import BasicVideoPlayer from "@/components/ui/BasicVideoPlayer";

/**
 * "The reality we can't ignore" — a light editorial block pairing a heading
 * and paragraph with the looping "data" motion graphic shown alongside the
 * impact figures.
 */
export default function Reality() {
  return (
    <section className="bg-mist py-20 text-navy-950">
      <div className="shell grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold uppercase leading-tight text-brand sm:text-4xl">
            La realidad que no
            <br className="hidden sm:block" /> podemos ignorar
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-950/75">
            Cada año, huracanes más intensos ponen en riesgo a millones de personas. Además de
            un desastre natural, hablamos de ciudades enteras, hogares, familias, infraestructura
            y la economía nacional afectada. El tiempo de reacción, la información adecuada y el
            nivel de preparación pueden marcar la diferencia entre estar a salvo o no.
          </p>
        </Reveal>

        <Reveal delay={120} from="right">
          <Parallax speed={26} className="relative">
            <div
              className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-accent-cyan/30 blur-2xl"
              aria-hidden
            />
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
              <BasicVideoPlayer
                className="h-full w-full"
                src="/assets/video/data.mp4"
                autoPlay
                muted
              />
            </div>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
