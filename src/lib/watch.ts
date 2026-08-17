// The three monthly plans + the Channel. Copy is final — verbatim.

export interface WatchPlan {
  id: string;
  name: string;
  price: string;
  per: string;
  tagline: string;
  /** Who this plan is for, one line. */
  audience?: string;
  /** Who this plan fits and why — mechanism language, never an outcome claim. */
  pitch: string;
  /** What the month actually looks like — the long story, spec-sheet depth. */
  detail: string;
  badge?: { text: string; tone: "lead" };
  /** False means it works with no website at all — two of three plans do. */
  buildRequired: boolean;
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
    audience: "The agent who owns nothing yet.",
    pitch:
      "The entry point: the one lever Google still lets you move, and it needs nothing built first.",
    detail:
      "What the month looks like: when a closing happens, the review request goes out on a sequence rather than a sticky note — and keeps going, because a steady trickle beats a burst. When a review arrives, it gets an answer within a day, written in your voice, not a template's. Once a month your profile is audited — hours, photos, Q&A, services — because a profile that drifts out of date is a profile Google trusts less. It ends in a one-page report you can read at a stoplight.",
    buildRequired: false,
    badge: { text: "No website required", tone: "lead" },
    blurb:
      "Reviews requested, answered, and kept arriving. Among the signals Google weighs most in local results, reviews are the only one you can still move this month — and recency counts, so a steady trickle beats a burst every time.",
    includes: [
      { text: "Post-closing review request sequence, automated" },
      { text: "Every review answered within a day, in your voice — up to five a month" },
      { text: "Profile hours, photos and Q&A kept current" },
      { text: "One-page monthly report" },
    ],
  },
  {
    id: "harbor-watch",
    name: "Harbor Watch",
    price: "$249",
    per: "/mo",
    tagline: "Your whole Google presence",
    audience: "Any agent, with or without a site from me.",
    pitch:
      "Your entire local presence managed, whether or not the website underneath it is mine.",
    detail:
      "A harbor watch is the duty stood at anchor — nobody is sailing anywhere, but someone is still awake, checking the cable and the weather. Your entire local presence managed, whether or not the website underneath it is mine.",
    buildRequired: false,
    popular: true,
    badge: { text: "No website required", tone: "lead" },
    includes: [
      { text: "Everything in Keeper" },
      { text: "Unlimited review responses" },
      { text: "Full profile management — posts, offers, new listing updates" },
      { text: "Competitor position tracking in the local pack for your farm areas" },
      {
        text: "Quarterly profile audit against Google's current guidelines, with suspension-risk review",
      },
      { text: "Real monthly report — calls, direction requests, profile views, and their sources" },
    ],
  },
  {
    id: "full-watch",
    name: "Full Watch",
    price: "$499",
    per: "/mo",
    tagline: "Your presence and your site",
    audience: "Anyone running a Seamark build.",
    pitch:
      "Everything in Harbor Watch, plus the site itself kept current as you list.",
    detail:
      "The site stays alive: listings become real pages while the sign is still wet, a market update ships every month, and once a quarter we sit down on the site itself — what's working, what's stale, what the next season needs.",
    buildRequired: true,
    includes: [
      { text: "Everything in Harbor Watch" },
      {
        text: "A test lead pushed through your form into BoldTrail every month, and shown to you",
        emphasis: true,
      },
      { text: "Search Console monitoring: indexation and ranking movement" },
      { text: "New listing pages built as you list" },
      { text: "One market update page per month" },
      { text: "Quarterly site work — new sections, new area pages, design updates" },
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
