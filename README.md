# Bluai — Landing page

Marketing landing page for **Bluai**, a hurricane/disaster preparedness app
(AI guidance, family geolocation and official alerts).

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**,
**GSAP** (scroll animations) and **Three.js** (the animated contact backdrop).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Project structure

```
app/                 App Router entry (layout, page, global styles)
components/
  layout/            Header, Footer
  sections/          One file per page section (Hero, Stats, Membership, ...)
  ui/                Reusable pieces (GlassCard, PriceCard, PreventionCard, ...)
  fx/                Animation/effect components (see below)
lib/                 gsap setup, in-view hook, and all site copy (content.ts)
public/assets/       Images (logo, photos, store badges, social icons)
```

### Section order

Header → Hero → Reality → Stats → Membership → Prevention → Video → Contact →
Community CTA → Footer.

### Effects (`components/fx/`)

- **CountUp** — statistics count up when scrolled into view.
- **LiquidGradient** — animated WebGL (Three.js) gradient behind the contact section.
- **LiquidGlass / GlassDefs** — frosted "liquid glass" surfaces used by cards and form fields.
- **MobileParallax** — decorative scroll-driven lines, mounted **only on mobile**.
- **Reveal** — fade-up entrance animation used throughout.

All effects respect `prefers-reduced-motion`.

## Location-based hero

The hero background adapts to the visitor's **geographic region in Mexico**
(4 regions from the reference map → a representative city scene, calm + hurricane):

- 🔵 Noroeste / Occidente → **Los Cabos**
- 🔴 Noreste, Centro y Este → **Veracruz**
- 🟢 Sur (Pacífico) → **Acapulco**
- 🟣 Península de Yucatán → **Playa del Carmen**

Detection (`lib/region.ts` → `detectRegion()`) runs in two tiers:

1. **`/api/region`** (primary) — a route handler that reads the hosting/CDN
   geo headers (AWS CloudFront, Vercel, Cloudflare). No third party, no limits.
   Returns `null` on local dev or a fully static export.
2. **geojs.io** (fallback) — a keyless, HTTPS, CORS-enabled geo-IP service
   called from the browser when the route returns nothing.

If both fail or the visitor is outside Mexico, `DEFAULT_REGION` is used. The
state → region mapping (codes + names) lives in the same file.

> Tier 2 sends the visitor's IP to geojs.io — for a no-third-party setup, deploy
> on a platform that provides viewer-geo headers so tier 1 resolves it. Many
> geo-IP APIs block CORS on their free tier (e.g. ipwho.is); geojs.io allows
> browser calls. On CloudFront, whitelist the `CloudFront-Viewer-Country*`
> headers in the cache/origin-request policy.

On desktop the hero is a **split**: left = calm scene, right = hurricane. Hovering
a side expands it and emphasizes that side's cards (the card title and body reveal
character-by-character via `CharReveal`). The phone (`components/ui/StaticPhone.tsx`)
is static — it shows the Bluai logo, sits flush with the bottom edge of the hero, and
does not animate. The navbar shows a device-appropriate store badge on mobile
(`useDevice`: iOS → App Store, Android → Google Play) and both badges on desktop.

## Editing content

Almost all text and structured data (nav, hero features, stats, plans,
prevention cards, socials, footer links) lives in **`lib/content.ts`** — edit
there rather than in the section components.

## Placeholders to replace

These were intentionally left as placeholders, ready to wire up:

- **Links** (`href="#"`): navigation, social networks, store badges and footer/legal links.
- **Contact form** (`components/sections/Contact.tsx`): currently front-end validation only.
  Connect it to your email service / API where the `TODO` comment is.
- **Newsletter form** (`components/ui/NewsletterForm.tsx`): submit is a no-op.
- **Video** (`components/sections/Video.tsx`): styled player placeholder — swap in the real
  `<video>` source or embed.

> Reminder: keep any API keys / secrets in environment variables, never in the code.

## Theme

Brand colors and fonts are defined in `tailwind.config.ts` and `app/globals.css`
(palette sampled from the source artwork). Fonts: **Poppins** (UI/headings) and
**Anton** (impact numbers), loaded via `next/font`.
