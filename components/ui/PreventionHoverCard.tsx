import { ACCENT, type Prevention } from "@/lib/content";

/**
 * Desktop prevention card (adapted from the supah "card hover" pen): the image
 * shows in full colour at rest with only the title; on hover the image darkens
 * and zooms, and the description + button rise/fade in. A light bottom gradient
 * keeps the resting title legible; the strong darkening only appears on hover.
 */
export default function PreventionHoverCard({ item }: { item: Prevention }) {
  const color = ACCENT[item.accent];

  return (
    <article className="group relative flex h-[440px] items-end overflow-hidden rounded-2xl rounded-br-[2.5rem] text-left text-white shadow-xl">
      {/* Image — full colour at rest (slightly boosted), zooms on hover */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)] [filter:saturate(1.1)] group-hover:scale-105"
        style={{ backgroundImage: `url(${item.image})` }}
        aria-hidden
      />
      {/* Light gradient only behind the resting title (keeps it readable) */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy-950/80 to-transparent"
        aria-hidden
      />
      {/* Full darkening that fades in on hover */}
      <div
        className="absolute inset-0 bg-navy-950/0 transition-colors duration-500 group-hover:bg-navy-950/60"
        aria-hidden
      />

      {/* Content: title always shown; copy + button rise/fade in on hover */}
      <div className="relative z-10 w-full translate-y-[calc(100%-4.75rem)] px-5 pb-6 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0">
        <h3 className="text-lg font-extrabold leading-tight drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
          {item.label} <span style={{ color }}>{item.emphasis}</span>
        </h3>
        <p className="mt-3 whitespace-pre-line text-[12.5px] font-medium leading-snug text-white/90 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100">
          {item.body}
        </p>
        <span
          className="mt-3 inline-block text-sm font-bold underline underline-offset-4 opacity-0 transition-opacity delay-100 duration-700 group-hover:opacity-100"
          style={{ color }}
        >
          Saber más
        </span>
      </div>
    </article>
  );
}
