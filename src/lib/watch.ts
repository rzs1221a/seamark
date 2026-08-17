// The three monthly plans + the Channel. Copy is final — verbatim.

export interface WatchPlan {
  id: string;
  name: string;
  price: string;
  per: string;
  tagline: string;
  /** Who this plan fits and why — mechanism language, never an outcome claim. */
  pitch: string;
  /** What the month actually looks like — the long story, spec-sheet depth. */
  detail: string;
  badge?: { text: string; tone: "lead" };
  popular?: boolean;
  blurb?: string;
  includes: Array<{ text: string; emphasis?: boolean }>;
}

export const watchHeader = "Someone awake while you sleep.";

export const watchLede =
  "The build is bought once and it is yours — that does not change, and none of this rents you back anything you already own. What follows is the work that only exists monthly: reviews arriving and being answered, your profile staying accurate, and your lead path tested rather than assumed.";

export const radarBlips = [
  "review arrived → answered",
  "hours drifted → corrected",
  "form test → passed",
  "ranking moved → logged",
];

export const watchPlans: WatchPlan[] = [
  {
    id: "keeper",
    name: "Keeper",
    price: "$99",
    per: "/mo",
    tagline: "The review engine",
    pitch:
      "The no-build entry point. If you own nothing yet, this is the one monthly that moves the lever Google still lets you move — and it needs nothing built first.",
    detail:
      "What the month looks like: when a closing happens, the review request goes out on a sequence rather than a sticky note — and keeps going, because a steady trickle beats a burst. When a review arrives, it gets an answer within a day, written in your voice, not a template's. Once a month your profile is audited — hours, photos, Q&A, services — because a profile that drifts out of date is a profile Google trusts less. It ends in a one-page report you can read at a stoplight.",
    badge: { text: "No build required", tone: "lead" },
    blurb:
      "Reviews requested, answered, and kept arriving. Among the signals Google weighs most in local results, reviews are the only one you can still move this month — and recency counts, so a steady trickle beats a burst every time.",
    includes: [
      { text: "Post-closing review request sequence, automated" },
      { text: "Every review answered within a day, in your voice" },
      { text: "Profile hours, photos and Q&A kept current" },
      { text: "One-page monthly report" },
    ],
  },
  {
    id: "watch",
    name: "Watch",
    price: "$249",
    per: "/mo",
    tagline: "Profile, capture, and reporting",
    pitch:
      "The default. Your profile managed like an asset, your capture path tested with a real synthetic lead every month rather than assumed, and a report that tells you where the calls actually came from.",
    detail:
      "Everything in Keeper, plus the profile worked as a channel: posts, offers, and new listings published as they happen, content updated as your inventory changes, Search Console watched so an indexing problem is caught the week it appears instead of the quarter it costs you. And the part nobody else does: once a month a test lead is pushed through your live form all the way into BoldTrail, and the result is shown to you — because a capture path that isn't tested fails silently, and the most expensive lead is the one that arrived and never landed anywhere. The monthly report reads like an instrument panel: calls, direction requests, form fills, and where each one came from.",
    popular: true,
    includes: [
      { text: "Everything in Keeper" },
      { text: "Full profile management — posts, offers, new listings" },
      {
        text: "A test lead pushed through your form into BoldTrail every month, and shown to you",
        emphasis: true,
      },
      { text: "Search Console monitoring" },
      { text: "Content updates as listings change" },
      { text: "Real monthly report — calls, direction requests, form fills, and their sources" },
    ],
  },
  {
    id: "watch-full",
    name: "Watch, Full",
    price: "$499",
    per: "/mo",
    tagline: "The site kept current",
    pitch:
      "For the agent who lists. Every new listing becomes a page while the sign is still wet, the market page stays current, and the site keeps earning its place in search instead of going stale.",
    detail:
      "Everything in Watch, plus the site itself kept alive: when you take a listing, it becomes a real page on your own domain — not just an MLS entry — while the sign is still wet. Once a month a market update page ships, so the site always has something recent to say about your ground. Once a quarter we sit down on the site itself: what's working, what's stale, what the next season needs. And when something has to move fast — a price change, a sold banner, a new headshot — it jumps the queue.",
    includes: [
      { text: "Everything in Watch" },
      { text: "New listing pages built as you list" },
      { text: "One market update page per month" },
      { text: "Quarterly site work" },
      { text: "Priority turnaround" },
    ],
  },
];

export const noContractLine =
  "No contract on any of them. Cancel in a month and you keep the site, the domain, the profile, and every lead that ever came through it.";

export const channel = {
  name: "The Channel",
  management: "$600",
  managementPer: "/mo management",
  floor: "minimum $2,000/mo ad spend, paid by you directly to Google, in your own account",
  copy: "Google Ads and Local Services Ads, built and managed in your own account, on your own card. Quoted only above $2,000 a month in spend — below that the numbers don't work, and I will show you why rather than take the fee.",
  arithmetic:
    "For context: search ads for residential real estate agents ran about $157.59 per lead at roughly a 1.29% conversion rate in the year to March 2026 (LocaliQ, 894 campaigns), so a $1,000 budget buys about six leads before anyone manages it. That is why there is a floor, and why this is the last thing I would sell you rather than the first.",
  aside:
    "Organic is sailing — free to run, weather-dependent. Ads are the engine — fuel by the hour, goes where you point it, and the moment you cut it you're back under sail.",
};
