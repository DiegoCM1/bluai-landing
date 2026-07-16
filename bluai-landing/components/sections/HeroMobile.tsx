"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FEATURES } from "@/lib/content";
import { useRegion } from "@/components/fx/useRegion";
import FeatureCard from "@/components/ui/FeatureCard";

/**
 * Mobile hero: a TAP + SWIPE carousel (no scroll-jacking / no GSAP pin — those
 * caused width mismatches and horizontal overflow on real phones). Tapping
 * advances through the 5 feature cards (1 → 5) and a horizontal swipe moves
 * forward/back; as you advance, the calm "Ciudad Bella" background is
 * progressively revealed top→bottom, fully uncovered on the last card. Dots
 * show the 5 steps. Card swaps use the approved sticky-cards
 * "fade & scale" overlap (from the reference GSAP scroll pen) re-timed to the
 * tap: the outgoing card shrinks and fades underneath the incoming one.
 *
 * The headline sits on solid navy above the city band (mirroring the desktop
 * framing) so the title stays readable — the photo starts below it instead of
 * running behind the text.
 */
export default function HeroMobile() {
  const { region } = useRegion();
  const n = FEATURES.length;
  // `leaving` is the card exiting the stage; kept mounted just long enough to
  // animate out. Both indices live in one state so rapid taps can't act on a
  // stale index.
  const [cards, setCards] = useState<{ index: number; leaving: number | null }>({
    index: 0,
    leaving: null,
  });
  const { index, leaving } = cards;

  // 0 on the first card (hurricane fully shown) → 1 on the last (calm fully
  // revealed). Drives a top→bottom wipe of the hurricane overlay.
  const progress = n > 1 ? index / (n - 1) : 1;
  const goTo = (next: number | ((i: number) => number)) =>
    setCards((c) => {
      const target = typeof next === "function" ? next(c.index) : next;
      return target === c.index ? c : { index: target, leaving: c.index };
    });
  const advance = () => goTo((i) => (i + 1) % n);

  // Horizontal swipe: left = next, right = previous. A recognized swipe sets a
  // flag so the click that some browsers still fire afterwards doesn't advance
  // a second step.
  const touchStartX = useRef<number | null>(null);
  const swiped = useRef(false);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) < 48) return; // short movement: let the tap handle it
    swiped.current = true;
    goTo((i) => (dx < 0 ? (i + 1) % n : (i - 1 + n) % n));
  };
  const onTap = () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    advance();
  };

  return (
    <div className="relative overflow-hidden lg:hidden">
      {/* Headline on solid navy — the city photo starts below it, so the
          title never competes with a bright sky (client note, NOTAS s44). */}
      <div className="px-5 pb-6 pt-8">
        <h1 className="text-center text-4xl font-extrabold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-5xl">
          <span
            className="text-gradient"
            style={{ backgroundImage: "linear-gradient(90deg, #9200ff, #3167ff)" }}
          >
            Protegerlos
          </span>{" "}
          <span className="text-white">depende de ti</span>
        </h1>
      </div>

      {/* City band behind the carousel only */}
      <div className="relative">
        {/* Background: calm city base + hurricane overlay that recedes top→bottom */}
        <div className="absolute inset-0" aria-hidden>
          <Image src={region.normal} alt="" fill priority sizes="100vw" className="object-cover" />
          {/* Wipe timed to the card swap (same duration/easing as the
              hero-card-enter/leave animations) so the city is uncovered while
              the card moves. */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(${(progress * 100).toFixed(1)}% 0 0 0)`,
              transition: "clip-path 0.45s ease",
            }}
          >
            <Image
              src={region.huracan}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-navy-950/25" />
          {/* Fade the band into the surrounding navy at both edges */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #06091f 0%, rgba(6,9,31,0.05) 22%, transparent 55%, rgba(6,9,31,0.55) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 px-5 pb-9 pt-4">
          {/* Tap the card (or swipe) to move through the benefits */}
          <button
          type="button"
          onClick={onTap}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-label="Siguiente beneficio"
          className="mt-4 block w-full text-left outline-none"
        >
          <div className="relative mx-auto grid max-w-sm [grid-template-areas:'stack']">
            {/* Invisible copies of every card reserve the tallest card's
                height, so the stage — and the city image behind it — keeps a
                constant size no matter which card is showing. */}
            {FEATURES.map((f) => (
              <div key={f.title} className="invisible [grid-area:stack]" aria-hidden>
                <FeatureCard feature={f} />
              </div>
            ))}
            {leaving !== null && (
              <div
                key={`leaving-${leaving}`}
                className="hero-card-leave pointer-events-none [grid-area:stack]"
                onAnimationEnd={() => setCards((c) => ({ ...c, leaving: null }))}
                aria-hidden
              >
                <FeatureCard feature={FEATURES[leaving]} fill />
              </div>
            )}
            <div key={index} className="hero-card-enter relative z-10 [grid-area:stack]">
              <FeatureCard feature={FEATURES[index]} fill />
            </div>
          </div>
        </button>

        <p className="mt-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/75">
          Toca o desliza para avanzar
        </p>

          {/* Step dots (5) */}
          <div className="mt-3 flex justify-center gap-2">
            {FEATURES.map((f, i) => (
              <button
                key={f.title}
                type="button"
                aria-label={`Ir al beneficio ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
