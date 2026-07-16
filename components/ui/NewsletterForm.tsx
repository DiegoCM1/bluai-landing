"use client";

/**
 * Footer newsletter sign-up. Submission is a no-op placeholder until the
 * subscription endpoint is provided.
 */
export default function NewsletterForm() {
  return (
    <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        aria-label="Correo electrónico"
        placeholder="Email"
        className="w-full rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none focus:border-white/60"
      />
      <button
        type="submit"
        aria-label="Suscribirse"
        className="flex h-9 w-10 shrink-0 items-center justify-center rounded-md bg-brand-royal transition-colors hover:bg-brand"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white" aria-hidden>
          <path
            d="M5 12h12M13 7l5 5-5 5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
