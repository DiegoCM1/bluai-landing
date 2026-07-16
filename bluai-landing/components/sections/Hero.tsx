"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FEATURES } from "@/lib/content";
import { useRegion } from "@/components/fx/useRegion";
import FeatureCard from "@/components/ui/FeatureCard";
import HeroPhone, { PHONE_SCREENS } from "@/components/ui/HeroPhone";
import HeroMobile from "@/components/sections/HeroMobile";
import Reveal from "@/components/fx/Reveal";

/**
 * Hero cards: the app screen shown on the phone when hovered, plus their
 * absolute desktop position (replicating the Figma layout — intentionally a
 * fixed, centered canvas rather than responsive on very wide screens).
 */
const HERO_CARDS: {
  feature: (typeof FEATURES)[number];
  screen: string;
  pos: CSSProperties;
}[] = [
  // Coordinates measured 1:1 from the client's 1512-wide reference canvas.
  // The whole composition was later rigid-shifted 70px up (canvas 1000→930)
  // to fit all five cards in a laptop viewport — inter-element distances are
  // unchanged; percentages below are the original absolute px minus 70, over
  // the 930px canvas.
  { feature: FEATURES[0], screen: PHONE_SCREENS.mantente, pos: { top: "11.6%", left: "15%", width: "262px" } },
  { feature: FEATURES[1], screen: PHONE_SCREENS.ia, pos: { top: "36.9%", left: "6.3%", width: "190px" } },
  { feature: FEATURES[2], screen: PHONE_SCREENS.notificaciones, pos: { top: "71.3%", left: "18.2%", width: "358px" } },
  { feature: FEATURES[3], screen: PHONE_SCREENS.proteccion, pos: { top: "11.4%", left: "70%", width: "262px" } },
  { feature: FEATURES[4], screen: PHONE_SCREENS.escudo, pos: { top: "55.7%", left: "70%", width: "262px" } },
];

/** Reference canvas the layout was measured on, and its base display scale. */
const CANVAS_W = 1512;
const CANVAS_H = 930;
const BASE_SCALE = 0.9;
/** Sticky header strip above the canvas (pt-3 + pill), used by the height fit. */
const HEADER_H = 96;
/** Below this the copy stops being readable — accept partial card visibility. */
const MIN_SCALE = 0.7;

export default function Hero() {
  const { region } = useRegion();
  const [active, setActive] = useState<number | null>(null);
  // The whole 1512px canvas scales as ONE piece on narrower desktops, so the
  // approved composition (phone dead-center, cards clear of the hand) is
  // preserved at every viewport width — % positions with fixed-size cards/
  // phone would drift into each other below 1512px.
  const [scale, setScale] = useState(BASE_SCALE);
  useEffect(() => {
    // Width keeps the composition inside the viewport; the height fit shrinks
    // it further (down to MIN_SCALE) so all five cards land above the fold on
    // laptop screens — the client wants every benefit visible on entry.
    const onResize = () => {
      const byWidth = Math.min(1, window.innerWidth / CANVAS_W) * BASE_SCALE;
      const byHeight = Math.max((window.innerHeight - HEADER_H) / CANVAS_H, MIN_SCALE);
      setScale(Math.min(byWidth, byHeight));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wipeRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef(50); // desired reveal boundary (%)
  const currentRef = useRef(50); // smoothed value

  const activeScreen = active === null ? undefined : HERO_CARDS[active].screen;

  const updateActiveCard = (clientX: number, clientY: number) => {
    const hovered = cardRefs.current.findIndex((el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    });
    setActive(hovered === -1 ? null : hovered);
  };

  // Desktop single-image wipe: both layers share the same framing. The cursor
  // is the divider — LEFT of it shows the calm city, RIGHT shows the same city
  // after the hurricane. The calm image is the base; the hurricane overlay is
  // clipped from the left so only the area right of the boundary is revealed. A
  // rAF lerp smooths the boundary toward the cursor (no fixed-duration lag).
  // (Mobile uses its own pinned scroll sequence — see HeroMobile.)
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      currentRef.current += (targetRef.current - currentRef.current) * 0.18;
      if (wipeRef.current) {
        wipeRef.current.style.clipPath = `inset(0 0 0 ${currentRef.current}%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frac = (e.clientX - rect.left) / rect.width;
    // Boundary follows the cursor (% from the left edge).
    targetRef.current = Math.max(0, Math.min(100, frac * 100));

    if (window.matchMedia("(min-width: 1024px)").matches) {
      updateActiveCard(e.clientX, e.clientY);
    }
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setActive(null);
        targetRef.current = 50;
      }}
      className="relative overflow-hidden bg-navy-950"
    >
      {/* ---------- Desktop background: hurricane / calm wipe ---------- */}
      <div className="absolute inset-x-0 hidden lg:block" style={{ top: "22.6%", height: "47%" }} aria-hidden>
        {/* Calm base */}
        <Image src={region.normal} alt="" fill priority sizes="100vw" className="object-cover" />
        {/* Hurricane overlay, revealed to the right of the cursor boundary */}
        <div ref={wipeRef} className="absolute inset-0" style={{ clipPath: "inset(0 0 0 50%)" }}>
          <Image src={region.huracan} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        {/* Top/bottom fade into the navy + legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #06091f 0%, transparent 10%, transparent 90%, #06091f 100%)",
          }}
        />
        <div className="absolute inset-0 bg-navy-950/10" />
      </div>

      {/* Headline (shared markup) */}
      {/* ---------- Desktop: fixed 1512×1000 canvas measured 1:1 against the
           client reference, scaled uniformly to the viewport (0.9 at full
           width). The outer wrapper reserves the scaled height. ---------- */}
      <div className="relative z-20 mx-auto hidden w-full lg:block" style={{ height: CANVAS_H * scale }}>
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <Reveal
          as="h1"
          className="absolute left-0 top-[1.4%] z-30 w-full text-center text-[54px] font-extrabold tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
        >
          <span
            className="text-gradient mr-3"
            style={{ backgroundImage: "linear-gradient(90deg, #9200ff, #7a1bff)" }}
          >
            Protegerlos
          </span>{" "}
          <span className="font-sans font-bold text-white">depende de ti</span>
        </Reveal>

        {HERO_CARDS.map((card, i) => (
          <div
            key={card.feature.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute z-10 transition-all duration-500"
            style={{
              ...card.pos,
              opacity: active === null || active === i ? 1 : 0.5,
            }}
          >
            <FeatureCard feature={card.feature} delay={i * 0.22} />
          </div>
        ))}

        {/* Phone anchored to the bottom edge, screen swaps with the active card */}
        {/* The composite includes the forearm on the right, so its box center
            sits right of the PHONE. Offsetting +60px puts the PHONE (not the
            hand) at the exact canvas center. */}
        <div className="absolute bottom-0 left-[calc(50%+95px)] w-[540px] -translate-x-1/2">
          <HeroPhone active={activeScreen} />
        </div>
      </div>
      </div>

      {/* ---------- Mobile: tap carousel ---------- */}
      <HeroMobile />
    </section>
  );
}
