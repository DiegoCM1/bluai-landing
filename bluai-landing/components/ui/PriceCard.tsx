import { type Plan } from "@/lib/content";
import GlassCard from "./GlassCard";
import CharReveal from "@/components/fx/CharReveal";

/** Small check mark used in the feature lists. */
function Check() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="currentColor" opacity="0.18" />
      <path
        d="M7 12.5l3 3 7-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small radio indicator shown in the price option boxes. */
function Radio({ color }: { color: string }) {
  return (
    <span className="absolute right-2 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/40">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
    </span>
  );
}

/** Pricing options (monthly / annual) shown inside paid plans — dark boxes. */
function PriceToggle({ plan }: { plan: Plan }) {
  return (
    <div className="mt-auto grid grid-cols-2 gap-2.5 text-left">
      <div className="relative rounded-xl bg-gradient-to-br from-[#2a3da0] via-[#16235e] to-[#0a1130] px-3 py-2.5 ring-1 ring-white/10">
        <Radio color="#ffffff" />
        <p className="text-sm font-bold text-white">{plan.price}</p>
        <p className="text-[10px] text-white/55">{plan.priceNote}</p>
      </div>
      <div className="relative rounded-xl bg-gradient-to-br from-[#2a3da0] via-[#16235e] to-[#0a1130] px-3 py-2.5 ring-1 ring-white/10">
        {plan.altBadge && (
          <span className="absolute -top-2 left-2 rounded-full bg-accent-purple px-1.5 py-0.5 text-[8px] font-bold text-white">
            {plan.altBadge}
          </span>
        )}
        <Radio color="#9200ff" />
        <p className="text-sm font-bold text-white">{plan.altPrice}</p>
        <p className="text-[10px] text-white/55">{plan.altNote}</p>
      </div>
    </div>
  );
}

/**
 * Membership plan card plus its standalone call-to-action button.
 */
export default function PriceCard({ plan }: { plan: Plan }) {
  return (
    <div className="flex h-full flex-col gap-4">
      {/* No fixed highlight: on hover the card lifts and a spinning gradient
          glow border appears (only the hovered one reacts, so two never
          animate at once). The glow lives on this wrapper because GlassCard
          clips its own overflow. */}
      <div className="price-glow relative flex-1 transition-transform duration-300 hover:-translate-y-2">
        <GlassCard className="flex h-full flex-col p-6">
          <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-white/60">
          Incluye:
        </p>
        <ul className="mt-2 mb-5 space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex min-w-0 gap-2 text-[12px] leading-snug text-white/85">
              <Check />
              <CharReveal as="span" text={feature} stagger={0.008} className="min-w-0 break-words" />
            </li>
          ))}
        </ul>

        {plan.altPrice ? (
          <PriceToggle plan={plan} />
        ) : (
          <div className="mt-auto rounded-xl bg-gradient-to-br from-[#2a3da0] via-[#16235e] to-[#0a1130] px-3 py-2.5 ring-1 ring-white/10">
            <p className="text-sm font-bold text-white">{plan.price}</p>
            <p className="text-[10px] text-white/55">{plan.priceNote}</p>
          </div>
        )}
        </GlassCard>
      </div>

      <a
        href="#"
        className="cta-live block rounded-full bg-gradient-to-r from-brand via-brand-indigo to-brand py-3 text-center text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.03]"
      >
        {plan.cta}
      </a>
    </div>
  );
}
