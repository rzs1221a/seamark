# seamark.studio

The storefront for **Seamark Studio** — lead-generation systems for real estate
agents, sold as something the agent owns outright. The site demonstrates the
route it sells: FOUND (a Google Business Profile the agent owns) → LANDED (a
fast site on the agent's own domain) → CAPTURED (every lead wired into
BoldTrail) — and it demonstrates it **on the real coast**: one persistent
MapLibre camera sits behind every page, and the hero's Passage is drawn in
lng/lat along the actual approach through the St. Marys entrance to the
Fernandina marina, projected through the live camera every frame.

Four rules govern everything here:

**The palette is semantic and small:** white = what you own · cabernet
(`#b96a99`, BHHS, lifted for contrast) = the lead in motion · gold
(`#d4af37`, BHHS) = emphasis, **at most one gold element per viewport** — the
moment there are two, neither is emphasis · hollow = unbuilt · red = never.

1. **The chart, not the brochure.** The visual language is a living nautical
   chart over real imagery; every animated element is information — the beam
   is how being found works, the beacons blink their true light
   characteristics, the radar blips are the service log.
2. **Say it once, short.** The homepage is an overview — what the route is,
   what it costs, that it's real, and the door. Depth lives on /packages,
   /watch, /work, and /capabilities; nothing is restated across pages.
3. **The honesty contract.** Every external number comes from
   `src/lib/facts.ts` with source and as-of date; every portfolio claim states
   its provenance; the build fails — not warns — on violations.
4. **Navigation is travel.** Route changes fly the camera and bloom the
   arriving page in one continuous move. Nothing cuts; everything settles.

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4 + **MapLibre GL** + SunCalc.
Geist Variable / Geist Mono, self-hosted. Netlify hosting, Netlify Forms.

> **On the dependency rule.** The original build spec mandated zero runtime
> dependencies beyond React and the router, with a 200KB total-JS budget. The
> persistent camera was a deliberate, explicitly approved break of that rule.
> The budgets moved with it, holding the line where it matters: **entry JS
> (everything a route needs before the map ignites) stays under the original
> 200KB gzipped**, the map engine must remain a separate lazily-loaded chunk,
> and the total stays under 360KB gzipped. Phones and data-saver connections
> never load the engine at all — they keep the dark plate and the vertical
> Passage diagram. If WebGL or the tile servers fail, the plate stays and the
> site is complete without it.

```
npm install
npm run dev      # local dev server
npm run build    # vite build + prerender (static HTML per route, sitemap, robots)
npm run verify   # build + Playwright quality gates (screenshots in verify-output/)
```

Node 20+. Verify uses Playwright's Chromium, falling back to
`/opt/pw-browsers/chromium` where no downloaded browser exists.

## Where things live

All content is typed data under `src/lib/` — route components render from these
modules and contain no prose of their own:

| File | Owns |
|---|---|
| `brand.ts` | name, tagline, contact, origin, `SHOW_PRICING`, disclaimer, ownership contract |
| `offer.ts` | the four build tiers + comparison table |
| `watch.ts` | the three monthly plans + the Channel + radar blips |
| `facts.ts` | every external number: `{ value, label, source, sourceUrl, asOf }` |
| `work.ts` | the portfolio — see *Provenance* below |
| `faq.ts`, `process.ts`, `pillars.ts` | questions, process steps, capability entries |
| `routes.ts` | the route table — prerender, sitemap, and meta read this one list |
| `cameraFrames.ts` | authored camera frames per route + homepage beat; the flight engine seam |
| `mapStyle.ts` | the dark-graded Esri imagery + OSM extrusion style (key-free) |
| `sky.ts` | real solar geometry → `html[data-sky]` hue cast |

### Provenance (work.ts)

Every portfolio entry carries `verified: "session" | "prior-portfolio"`,
rendered on the page. "session" means the claims were verified directly
against the project's attached source repository; "prior-portfolio" means they
are carried from the studio's previous storefront, whose portfolio data was
itself audited against the source repos. The prerenderer fails the build if an
entry claims session verification for a repo that was never attached, if a
screenshot is referenced but missing, or if a beacon coordinate or light
characteristic is absent. Deliberately no conversion statistics anywhere.

## The camera

`LiveMap` mounts one map for the life of the session (wide viewports only).
The engine is dynamically imported after first paint so the prerendered text —
the LCP — never waits on it; when tiles arrive, the coast eases up out of the
dark. First load opens far out over the Atlantic and descends into the route's
frame over seven seconds with a long settling tail; an idle orbit (0.4°/s)
keeps the coast breathing between flights. Flights use quartic ease-out and a
queue: only the newest target is ever flown, and a flight already in the air
shortens the next. Under reduced motion the camera **jumps** — the position IS
the destination, so it still arrives, without the flight.

## Motion doctrine

- One performer per viewport; every animation completes "this movement shows
  the visitor that ___".
- Reveals are enter-once (a page that re-animates on scroll-up is a carousel,
  not a film); where `animation-timeline: view()` exists they become
  scroll-driven scrubs on staggered windows.
- Reduced motion is structural: pre-reveal offsets exist only inside
  `prefers-reduced-motion: no-preference`, every animated scene has a designed
  completed state, and the beacon keyframes start and end lit so a frozen
  light never reads as dead.

Deliberately not adopted from the reference builds: deck.gl photorealistic
tiles (weight), light/dark act theming (the chart is dark; the map is the
light), ambient gradient drift and cursor effects (decoration, not
information), startup gates.

## Quality gates — the build fails, it does not warn

`prerender.mjs` throws on: empty/duplicate route meta, an implausibly empty
body, prices rendered while `SHOW_PRICING` is false, forbidden claim strings
("% more leads", "+40% leads", "guarantee" outside the FAQ), and every
portfolio assertion above.

`verify.mjs` (Playwright against the built output) asserts: reduced-motion
visibility with the completed Passage on every route; keyboard reachability of
nav + CTA; no horizontal overflow at 390/768/1024/1440; every internal link
resolving; sitemap exactly matching prerendered routes; **entry JS < 200KB gz,
total < 360KB gz, map chunk lazy, images ≤ 200KB, CLS < 0.05**; and — when the
engine mounts — camera arrival at the home frame, eased under motion,
immediate under reduced motion.
