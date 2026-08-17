# seamark.studio

The storefront for **Seamark Studio** — lead-generation systems for real estate
agents, sold as something the agent owns outright. The site demonstrates the
route it sells: FOUND (a Google Business Profile the agent owns) → LANDED (a
fast site on the agent's own domain) → CAPTURED (every lead wired into
BoldTrail).

Two rules govern everything here:

1. **The chart, not the brochure.** The visual language is a working nautical
   chart; every chart element is information, never decoration.
2. **The honesty contract.** Every external number on the site comes from
   `src/lib/facts.ts`, with its source and as-of date. The build enforces this
   (see *Quality gates*).

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4. No component library, no
animation library — the Passage hero is hand-rolled SVG + `requestAnimationFrame`.
Runtime dependencies are React and react-router only. Hosting target is Netlify
(the contact form uses Netlify Forms).

```
npm install
npm run dev      # local dev server
npm run build    # vite build + prerender (static HTML per route, sitemap, robots)
npm run verify   # build + Playwright quality gates (screenshots in verify-output/)
```

Node 20+. `npm run verify` uses Playwright's Chromium; if no downloaded browser
is present it falls back to `/opt/pw-browsers/chromium`.

## Where things live

All content is typed data under `src/lib/` — route components render from these
modules and contain no prose of their own:

| File | Owns |
|---|---|
| `brand.ts` | name, tagline, contact, origin, `SHOW_PRICING` flag, disclaimer, ownership contract |
| `offer.ts` | the four build tiers + comparison table |
| `watch.ts` | the three monthly plans + the Channel + radar blips |
| `facts.ts` | every external number, each `{ value, label, source, sourceUrl, asOf }` |
| `work.ts` | shipped projects — `TODO(zander)` entries are excluded from production until filled in |
| `faq.ts`, `process.ts`, `pillars.ts` | questions, process steps, capability entries |
| `routes.ts` | the route table — prerender, sitemap, and meta all read this one list |

Flipping `SHOW_PRICING` to `false` renders every price as "Let's talk"
(everything goes through `src/components/Price.tsx`) and the prerender asserts
no price string appears in output.

## Prerendering

`scripts/prerender.mjs` runs through `tsx` after `vite build`, imports the same
TS modules the app renders from, and stamps out one static HTML file per route
with real content in the body, per-route title/description/canonical/OG/JSON-LD,
plus `sitemap.xml` and `robots.txt` from the same route table. The client
hydrates the prerendered markup.

## Quality gates — the build fails, it does not warn

`prerender.mjs` throws on: empty/duplicate titles or descriptions, an
implausibly empty body, any price rendered while `SHOW_PRICING` is false,
`"% more leads"` / `"+40% leads"` anywhere, or `"guarantee"` outside the FAQ
route. The facts rule is enforced by construction: stat components take their
values *from* `facts.ts`; no external claim is written as a literal in JSX.

`scripts/verify.mjs` (Playwright against the built output) asserts:

- **Reduced motion** at 1440×900: every route fully visible, and the hero shows
  the *completed* passage — a designed static state, not a kill switch.
- **Keyboard**: every primary-nav destination and the contact CTA reachable by Tab.
- **Viewports** 390/768/1024/1440: no horizontal overflow, hero legible,
  screenshots saved to `verify-output/`.
- **Budgets**: total JS < 200KB gzipped, no image over 200KB, CLS < 0.05 on `/`
  (LCP is reported; the Passage renders after first paint and the hero copy is
  in the prerendered HTML, which is what protects LCP).
- **Links & sitemap**: every internal link resolves; the sitemap contains
  exactly the prerendered routes.

## Motion doctrine

One performer per viewport. Every animation must show the visitor something
(the beam sweep is *how being found works*; the radar blips are *the service
log*). `prefers-reduced-motion` always gets the completed diagram, everything
lit — verified per route.

## Open TODOs

`work.ts` ships with five `TODO(zander)` placeholder entries (The Aerial,
Heymann Williams Coastal, Sold on Amelia Island, Ron Heymann, this storefront).
They render an "awaiting real screenshots and verified claims" state in dev and
are excluded from production builds until filled in with verifiable claims.
