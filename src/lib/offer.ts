// The four build tiers. Copy is final and fact-checked — verbatim.

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
  popular?: boolean;
  stations: StationId[]; // stations lit solid on the mini-passage diagram
  deliverables: string[];
}

export const tiers: Tier[] = [
  {
    id: "daymark",
    name: "Daymark",
    price: "$2,400",
    priceNote: "one-time",
    system: "The single-agent system",
    audience: "For the agent who has nothing of their own yet. About one week.",
    pitch:
      "The right first build when you own nothing yet: one week of work, and every station of the route exists — in your name, with nothing to cancel afterward because there is no subscription on it.",
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
    priceNote: "one-time",
    system: "The working agent's system",
    audience: "An agent or team that has outgrown one page and one channel. Two to three weeks.",
    pitch:
      "The working agent's default: the same route, built deeper — separate entry points from search, area pages for the ground you actually farm, a phone you can attribute, and the capture path proven in writing before launch.",
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
    pricePrefix: "from",
    priceNote: "one-time",
    system: "The full acquisition system",
    audience: "A top producer or brokerage that needs a system, not a site. Three to six weeks.",
    pitch:
      "For the producer ready to run search, listings, and paid channels as one system — with the housing-ad compliance and Local Services qualification handled instead of discovered the hard way.",
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
    pricePrefix: "from",
    priceNote: "one-time",
    system: "The custom market platform",
    audience: "Whoever decides to own the map of their market. Six to ten weeks.",
    pitch:
      "For whoever decides to own the map of their market — the site you are reading is the demonstration, pointed at this coast instead of yours.",
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
  "One fee, agreed in writing before anything starts. After launch you own it: the code, the domain, the profile, the ad account, the data.";

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
