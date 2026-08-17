// The five build tiers. Copy is final and fact-checked — verbatim.
// Every figure is gated by SHOW_PRICING; nothing here renders raw.

export type StationId = "found" | "landed" | "captured" | "bought";

export interface Tier {
  id: string;
  name: string;
  price: string;
  pricePrefix?: string;
  priceNote: string;
  system: string;
  audience: string; // who it's for + timeline, rendered as the card's italic line
  /** Who this is for and why now — fit language, never an outcome claim. */
  pitch: string;
  /** The twelve-payment option, ~11% premium. Rendered beneath the one-time. */
  monthlyPrice?: number;
  /** Needs no website at all — the objection this tier exists to remove. */
  noBuildRequired?: boolean;
  badge?: string;
  /** The long "what this is" paragraph, /packages only. */
  summary?: string;
  idealFor?: string[];
  turnaroundTime?: string;
  ctaLabel?: string;
  /** A shipped project that shows the shape of this tier. */
  exampleSlug?: string;
  popular?: boolean;
  stations: StationId[]; // stations lit solid on the mini-passage diagram
  deliverables: string[];
}

export const tiers: Tier[] = [
  {
    id: "buoy",
    name: "Buoy",
    price: "$1,200",
    monthlyPrice: 115,
    priceNote: "one-time",
    system: "The Google presence",
    noBuildRequired: true,
    badge: "No website required",
    audience:
      "The agent who will never buy a website — and there are more of them than you think.",
    pitch: "Your Google presence built properly and nothing more.",
    summary:
      "A buoy floats and marks a position. It says something is here, and nothing else. This is your Google presence built properly and nothing more: no site, no development, just the thing that decides whether you appear at all.",
    idealFor: [
      "You already have a brokerage page and have no intention of replacing it",
      "You have never opened your Google Business Profile, or do not have one",
      "You want the highest-leverage thing fixed first, and only that",
    ],
    // FOUND alone: the diagram shows "no website" rather than saying it.
    stations: ["found"],
    deliverables: [
      "Google Business Profile claimed, verified, and categorised correctly",
      "Named the way Google's rules actually require — not the way that gets you suspended",
      "Services, photo set, hours logic and Q&A seeded",
      "Review request system installed and running",
      "Your existing brokerage page linked correctly so it stops competing with you",
      "30-minute handoff call, recorded",
    ],
    turnaroundTime: "Three to five days",
    ctaLabel: "Start here",
    exampleSlug: "ron-heymann-agent-page",
  },
  {
    id: "daymark",
    name: "Daymark",
    price: "$2,400",
    monthlyPrice: 225,
    priceNote: "one-time",
    system: "The single-agent system",
    audience: "For the agent who has nothing of their own yet. About one week.",
    pitch:
      "For the agent who owns nothing yet. One week, and the whole route exists in your name.",
    stations: ["found", "landed", "captured"],
    deliverables: [
      "Google Business Profile claimed, verified, and categorised correctly",
      "Custom single page on your own domain — not a template with your headshot in it",
      "Lead form wired into your BoldTrail through the Lead Dropbox parser",
      "Review request system installed and running",
      "Analytics and Search Console, in your accounts",
      "Full SEO: metadata, Open Graph, schema.org, sitemap",
      "Free hosting on Netlify, in your account",
    ],
  },
  {
    id: "beacon",
    name: "Beacon",
    price: "$5,400",
    monthlyPrice: 500,
    priceNote: "one-time",
    system: "The working agent's system",
    audience: "An agent or team that has outgrown one page and one channel. Two to three weeks.",
    pitch:
      "The working default: more entry points from search, the ground you farm, a phone you can attribute.",
    popular: true,
    stations: ["found", "landed", "captured"],
    deliverables: [
      "Everything in Daymark",
      "Multi-page architecture — each page a separate entry point from search",
      "Three area pages for the communities you actually farm",
      "Profile built out: services, photo set, Q&A, hours logic",
      "Post-closing review automation, not just a link you remember to send",
      "Call tracking, so the phone is attributable",
      "Lead routing tested end to end, in writing, before launch",
    ],
  },
  {
    id: "light-station",
    name: "Light Station",
    price: "$9,800",
    monthlyPrice: 900,
    pricePrefix: "from",
    priceNote: "one-time",
    system: "The full acquisition system",
    audience: "A top producer or brokerage that needs a system, not a site. Three to six weeks.",
    pitch:
      "Search, listings, and paid channels as one system — with the ad compliance handled.",
    stations: ["found", "landed", "captured", "bought"],
    deliverables: [
      "Everything in Beacon",
      "Property search and up to ten area pages, each prerendered to static HTML",
      "Local Services Ads qualification handled — licence, insurance, verified profile",
      "Google Ads account built, structured, and compliant with housing-ad rules",
      "Listing page templates that generate per property",
      "Quarterly strategy call for the first year",
    ],
  },
  {
    id: "flagship",
    name: "Flagship",
    price: "$18,000",
    monthlyPrice: 1650,
    pricePrefix: "from",
    priceNote: "one-time",
    system: "The custom market platform",
    audience: "Whoever decides to own the map of their market. Six to ten weeks.",
    pitch:
      "Own the map of your market. The site you're reading is the demonstration.",
    stations: ["found", "landed", "captured", "bought"],
    deliverables: [
      "Everything in Light Station",
      "Your whole market as a living 3D map — terrain, imagery, buildings",
      "Named areas and communities, each descendable and linkable",
      "Plain-English property search wired to your feed",
      "Multi-agent lead routing and roster pages",
      "Live local data — tide, weather, light — as instruments in the page",
    ],
  },
];

export const packagesLede =
  "One fee, or twelve monthly payments. You own it outright either way, from launch — the code, the domain, the profile, the ad account, the data.";

export const payOptions = {
  title: "Two ways to pay, one outcome",
  body: "Every build can be paid once or across twelve months. Ownership transfers at launch either way — the site, the domain, the profile and every account are in your name from day one. The monthly option costs about 11% more, which is the honest price of time, not a penalty.",
};

export const priceIncrease = {
  body: "These are the prices through December 31. On January 1 they rise:",
  rows: [
    { name: "Buoy", price: "$1,600" },
    { name: "Daymark", price: "$3,200" },
    { name: "Beacon", price: "$6,900" },
    { name: "Light Station", price: "$12,500" },
    { name: "Flagship", price: "$24,000" },
  ],
};

export interface ComparisonRow {
  question: string;
  them: string;
  us: string;
}

export const comparisonTitle = "What you are actually being sold elsewhere";

export const comparisonRows: ComparisonRow[] = [
  {
    question: "Who owns the site?",
    them: "The platform. Cancel and it goes dark.",
    us: "You do. Code, domain, hosting account, all in your name.",
  },
  {
    question: "Who owns the Google profile?",
    them: "Usually nobody manages it, or an agency holds the login.",
    us: "You do. It is claimed in your name and you keep the access.",
  },
  {
    question: "Who owns the ad account?",
    them: "The agency, with their card on it and their markup on your spend.",
    us: "You do. Your card, your data, your history if we ever part ways.",
  },
  {
    question: "What does a closed deal cost?",
    them: "Portals take a share of the commission on every deal they originate — published rates reach 40% on seller connections.",
    us: "Nothing. You already paid for the build, once.",
  },
  {
    question: "What happens if you change brokerages?",
    them: "The brokerage site and CRM seat go away with the job.",
    us: "Everything comes with you, because none of it was ever mine.",
  },
  {
    question: "What are you locked into?",
    them: "Six to twelve month contracts, cancellation fees, auto-renewal.",
    us: "No contract. The build is bought outright; the monthly stops whenever you say.",
  },
];
