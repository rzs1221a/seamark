// The portfolio. Every claim in this file is verifiable, and each entry says
// how. Two provenance classes, rendered on the page so the reader knows which
// is which:
//
//   "session"         — verified in this working session directly against the
//                       project's source repository.
//   "prior-portfolio" — carried from the studio's previous storefront, whose
//                       portfolio data was itself audited against the source
//                       repositories (line counts from real files, proofs
//                       naming the implementing file).
//
// Nothing here is aspirational. Deliberately no conversion statistics:
// inventing "+40% leads" would be the one lie that discredits every true claim
// beside it.

export type Provenance = "session" | "prior-portfolio";

export interface WorkItem {
  slug: string;
  name: string;
  /** What kind of site this is, in the buyer's language. */
  kind: string;
  /** Who it was built for. Factual. */
  client: string;
  /** Stated as what the site verifiably does — never a conversion statistic. */
  outcome: string;
  /** One honest sentence about what it DOES, not how it looks. */
  summary: string;
  /** The longer story. */
  detail: string;
  highlights: string[];
  stack: string[];
  /** Where the beacon sits on the chart. Real coordinates. */
  coord: [lng: number, lat: number];
  /**
   * The mark's light characteristic, in real aids-to-navigation notation —
   * every lighted seamark identifies itself by a distinct rhythm. `anim` names
   * the CSS keyframe class; null means a fixed light (F), burning steady.
   */
  light: { characteristic: string; anim: string | null };
  desktop?: string;
  mobile?: string;
  liveUrl?: string;
  verified: Provenance;
}

export const workItems: WorkItem[] = [
  {
    slug: "the-aerial",
    name: "The Aerial",
    kind: "Flagship market platform",
    client: "Seamark Studio — in-house flagship",
    outcome:
      "One interface covering seventy named areas across four regions, where a buyer explores by flying rather than by filtering a list.",
    summary:
      "The entire coast from Camden County, Georgia to St. Augustine as a living 3D map — no homepage, no nav, no scroll feed. You open it and you are above the real county.",
    detail:
      "Seventy named areas and landmarks, seventeen descendable communities, four regions. Real terrain with satellite imagery draped over it, OpenStreetMap building extrusions rising county-wide, and Google photorealistic 3D tiles fading in past zoom 15 so you descend toward an actual rooftop. The search field reads plain English — “oceanfront under 2m”, “4 bed with a dock in st marys” — and resolves it against the same fields a RESO feed carries. The dateline reports the real hour, light, tide, wind, and moon.",
    highlights: [
      "Photorealistic 3D tiles with automatic hysteresis at the zoom boundary",
      "Plain-English search parsed to structured MLS criteria, entirely on-device",
      "Live NOAA tide gauge + National Weather Service conditions",
      "Sun, moon, and golden-hour computed per address with SunCalc",
      "Separate desktop and mobile profiles shipped from one codebase",
    ],
    stack: ["Next 15", "React 19", "deck.gl", "MapLibre GL", "TypeScript"],
    coord: [-81.447, 30.572],
    light: { characteristic: "Fl(2) 10s", anim: "sig-fl2-10s" },
    desktop: "/work/the-aerial/desktop.webp",
    mobile: "/work/the-aerial/mobile.webp",
    liveUrl: "https://theaerial.netlify.app",
    verified: "prior-portfolio",
  },
  {
    slug: "heymann-williams-coastal",
    name: "Heymann Williams",
    kind: "Brokerage concept build",
    client:
      "Concept for Berkshire Hathaway HomeServices Heymann Williams Realty — a working demonstration of their next site, not the brokerage's current one",
    outcome:
      "Twenty-six neighborhood pages shipped as real static HTML — each one a separate entry point from search — on a twenty-route site carrying the full 58-agent roster.",
    summary:
      "A full brokerage build: one persistent cinematic map flown per route and per scroll section, twenty-six prerendered neighborhood pages, and the complete agent roster.",
    detail:
      "The largest build here. A single persistent MapLibre camera sits behind every page and flies between authored frames as you navigate and as community stories scroll. Twenty-six neighborhood routes are stamped out as real static HTML at build time — each with Place, FAQ, and breadcrumb structured data — so crawlers and AI agents read complete written pages instead of an empty React root. A hand-built motion engine measures real frame times and quietly steps the glass and motion budget down on slower machines. Google photorealistic 3D tiles attach past the zoom threshold, and the 58-agent roster ships through a build-time WebP pipeline at three sizes.",
    highlights: [
      "26 neighborhood pages prerendered to static HTML with per-page structured data",
      "One persistent map camera, flown per-route and per-scroll-section",
      "A frame-budgeted motion engine that degrades itself from measured FPS",
      "Server-side MLS proxy wired behind a feature flag, keys never in the client",
      "Full reduced-motion and keyboard accessibility pass",
    ],
    stack: ["Vite", "React 19", "TypeScript", "Tailwind v4", "MapLibre GL", "deck.gl"],
    coord: [-81.453, 30.636],
    light: { characteristic: "Fl 6s", anim: "sig-fl-6s" },
    desktop: "/work/heymann-williams-coastal/desktop.webp",
    mobile: "/work/heymann-williams-coastal/mobile.webp",
    verified: "session",
  },
  {
    slug: "sold-on-amelia-island",
    name: "Sold on Amelia Island",
    kind: "Two-agent team site",
    client: "A two-agent team on Amelia Island",
    outcome:
      "Two guided lead funnels delivering validated submissions into BoldTrail, with the agents publishing their own content changes in about a minute.",
    summary:
      "A team site with guided buyer and seller flows, live lead delivery into BoldTrail, and a built-in editor so the agents change their own content without calling anyone.",
    detail:
      "Two separate multi-step lead funnels — the seller flow walks address to property details to timeline to contact; the buyer flow runs a guided questionnaire that ends in live MLS search links. Both submit through a Netlify Function that validates with Zod and ingests into BoldTrail through the Lead Dropbox email parser. The agents log into /admin and edit their hero photos, bios, featured property, neighborhood tiles, and testimonials themselves; changes are live in about a minute.",
    highlights: [
      "Separate guided buyer and seller funnels, each routed to the right agent",
      "Validated lead ingestion into BoldTrail via Netlify Functions",
      "Git-backed CMS — the agents edit the site themselves, no redeploy request",
      "Contact details edit once and update the footer and every lead screen",
      "Mortgage calculator, live listing links, full schema.org markup",
    ],
    stack: ["Static HTML", "Netlify Functions", "Decap CMS", "Zod"],
    coord: [-81.4637, 30.6697],
    light: { characteristic: "Iso 4s", anim: "sig-iso-4s" },
    desktop: "/work/sold-on-amelia-island/desktop.webp",
    mobile: "/work/sold-on-amelia-island/mobile.webp",
    verified: "prior-portfolio",
  },
  {
    slug: "crane-island-bhhs",
    name: "Crane Island",
    kind: "Community microsite",
    client: "Heymann Williams — Crane Island",
    outcome:
      "One community owned completely: metadata, schema, and content built for a single high-value search intent instead of competing county-wide, deployed on the brokerage's own subdomain.",
    summary:
      "A single-community authority page built to own the search results for one high-value niche — deep-water waterfront on Amelia Island.",
    detail:
      "The play a lot of agents miss: instead of competing for “Amelia Island real estate” against every brokerage in the county, own one community completely. Full geo-targeted metadata, canonical tagging, Open Graph, and analytics, with architectural guidelines, lifestyle detail, and signature inventory in one long authoritative scroll. Verified coordinates — Crane Island sits at 30.6125, −81.4773 per the USGS Geographic Names Information System, which corrected a pin that had been a quarter mile off.",
    highlights: [
      "Geo-targeted metadata and schema built for one specific search intent",
      "Coordinates verified against USGS GNIS, not guessed",
      "Loads fast enough to win the mobile ranking signal",
      "Deployed on the brokerage's own subdomain",
    ],
    stack: ["Static HTML", "Tailwind", "Schema.org"],
    coord: [-81.4773, 30.6125],
    light: { characteristic: "Oc 8s", anim: "sig-oc-8s" },
    desktop: "/work/crane-island-bhhs/desktop.webp",
    mobile: "/work/crane-island-bhhs/mobile.webp",
    liveUrl: "https://craneisland.heymannwilliams.com",
    verified: "prior-portfolio",
  },
  {
    slug: "ron-heymann-agent-page",
    name: "Ron Heymann",
    kind: "Individual agent page",
    client: "Ron Heymann, individual agent",
    outcome:
      "BoldTrail property-alert traffic resolves on the agent's own domain instead of dead-ending — the difference between an email campaign that works and one that quietly leaks.",
    summary:
      "A single-agent page that catches BoldTrail's property-alert email traffic instead of letting it 404 on the wrong domain.",
    detail:
      "The entry-level build, and a good demonstration that small does not mean careless. Beyond the page itself, it proxies BoldTrail's /details, /search, and /property paths through to the platform-served host — so when a property-alert email goes out and the recipient taps a listing, it resolves on the agent's own domain rather than dead-ending. That single piece of routing is the difference between an email campaign that works and one that quietly leaks its traffic.",
    highlights: [
      "BoldTrail property-alert links resolve on the agent's own domain",
      "Built to load fast on a phone in a parking lot",
      "Deploys free on Netlify with no build step",
    ],
    stack: ["Static HTML", "Tailwind", "Netlify redirects"],
    coord: [-81.4545, 30.7047],
    light: { characteristic: "LFl 8s", anim: "sig-lfl-8s" },
    desktop: "/work/ron-heymann-agent-page/desktop.webp",
    mobile: "/work/ron-heymann-agent-page/mobile.webp",
    verified: "prior-portfolio",
  },
  {
    slug: "the-living-chart",
    name: "The Living Chart",
    kind: "Studio storefront, first edition",
    client: "Seamark Studio — the previous seamark.studio",
    outcome:
      "Thirty-eight routes prerendered from one imported route table, with the honesty contract enforced by the build itself — it fails if anything claims shipped work without a named proof.",
    summary:
      "The studio's previous storefront: a live chart of this coast where every shipped site is a lit beacon blinking its own real light characteristic, and the tide reading is NOAA, fetched when you arrived.",
    detail:
      "The first edition of the site you are reading. One persistent MapLibre camera served as the page's spine — idle orbit, quartic-eased flights between authored frames, and a flight queue so a fast scroll never stacked animations. The tide line was a live NOAA gauge (Fernandina Beach station 8720030, cosine-interpolated between predictions), conditions came from the National Weather Service, and the night sky drew 1,627 real stars — with a build check asserting Polaris sat at the observer's latitude, an invariant a wrong projection cannot fake. Its verifier measured text contrast at live camera positions, and its perf budget failed the build if the map engine leaked onto map-free routes.",
    highlights: [
      "A persistent map camera with idle orbit, eased flights, and flight queueing",
      "Live NOAA tide + NWS conditions through key-free Netlify Functions",
      "1,627 real stars, with Polaris asserted at the observer's latitude",
      "38 routes prerendered from the same modules the app renders",
      "Contrast verified at 4.5:1 at live camera positions, per route",
    ],
    stack: ["Vite", "React 19", "TypeScript", "Tailwind v4", "MapLibre GL", "SunCalc"],
    // The studio's own mark, charted just seaward of its successor below so
    // the two lights read separately at the overview zoom.
    coord: [-81.427, 30.522],
    light: { characteristic: "Fl(3) 15s", anim: "sig-fl3-15s" },
    desktop: "/work/the-living-chart/desktop.webp",
    mobile: "/work/the-living-chart/mobile.webp",
    verified: "session",
  },
  {
    slug: "seamark-studio",
    name: "This Storefront",
    kind: "The site you are on",
    client: "Seamark Studio — in-house",
    outcome:
      "Every route stamped to static HTML from the same typed modules the page renders, with a build that fails — not warns — on an invented statistic, a broken link, or a hero that isn't legible with motion off.",
    summary:
      "The storefront you are reading: the Passage plays over the real coast, every number on the site carries its source, and the quality gates that protect client builds run against this one first.",
    detail:
      "The recursive entry — the case study you are standing in. The hero is a hand-rolled SVG demonstration of one lead's journey, drawn over the same living chart the client sites use. Every external figure lives in one facts module with its source and as-of date, and the prerenderer refuses to build if a forbidden claim appears in rendered output. The verify suite drives the built site in a real browser: reduced-motion states, keyboard reachability, four viewports, link integrity, and hard performance budgets.",
    highlights: [
      "Eight routes prerendered with per-route metadata and structured data",
      "The honesty contract enforced by build-failing assertions",
      "A designed reduced-motion state for every animated scene",
      "Playwright verification: viewports, keyboard, links, budgets, CLS",
    ],
    stack: ["Vite", "React 19", "TypeScript", "Tailwind v4", "MapLibre GL"],
    coord: [-81.438, 30.53],
    light: { characteristic: "F", anim: null },
    desktop: "/work/seamark-studio/desktop.webp",
    mobile: "/work/seamark-studio/mobile.webp",
    liveUrl: "https://seamark.studio",
    verified: "session",
  },
];

/** All entries are filled and provenance-marked; nothing is excluded. */
export const liveWork: WorkItem[] = workItems;

export const proofStripLine = "Real sites, on this coast.";

export const provenanceLine: Record<Provenance, string> = {
  session: "verified against the source repository",
  "prior-portfolio": "as audited in the studio's prior portfolio",
};
