import Reveal from "@/components/fx/Reveal";
import TitleReveal from "@/components/fx/TitleReveal";
import BasicVideoPlayer from "@/components/ui/BasicVideoPlayer";

/**
 * Video highlight section — plays the "hero" promo video.
 */
export default function Video() {
  return (
    <section className="bg-white py-14 text-navy-950">
      <div className="shell">
        <TitleReveal
          text="Saber qué hacer, lo cambia todo"
          className="text-center font-display text-4xl font-extrabold text-brand sm:text-5xl"
        />

        <Reveal delay={120} from="right" className="mx-auto mt-8 max-w-5xl">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10">
            <BasicVideoPlayer
              className="h-full w-full"
              src="/assets/video/hero.mp4"
              autoPlay
              muted
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
