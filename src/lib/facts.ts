// Every external number on the site lives here, with its source and as-of
// date. No other external statistic may appear anywhere in rendered output.
// Forbidden everywhere, no exceptions: lead-to-close rates, LSA cost-per-lead,
// "+X% more leads," invented testimonials or review counts presented as real,
// and any competitor's unpublished pricing.

export interface Fact {
  value: string;
  label: string;
  source: string;
  sourceUrl: string;
  asOf: string;
}

export const facts = {
  zillowPreferredSellerFee: {
    value: "40%",
    label:
      "of gross commission on a seller lead Zillow hands you through Preferred — every market. Buyer-side runs 15–40%.",
    source: "Zillow Preferred pricing, 2026 · applies to Zillow-originated connections",
    sourceUrl: "https://www.zillow.com/preferred/pricing/",
    asOf: "2026",
  },
  nassauFeeArithmetic: {
    value: "~$5,500",
    label:
      "what that fee costs on one median Nassau County sale — on every one of them, for as long as you use it.",
    source: "$504,500 median, June 2026 (NEFAR) × 2.75%",
    sourceUrl: "https://www.nefar.com/",
    asOf: "June 2026",
  },
  premierAgentCostPerConnection: {
    value: "$223 / $139",
    label:
      "Zillow's own published average cost per connection on Premier Agent — major metro, then everywhere else.",
    source: "zillow.com/premier-agent, 2026",
    sourceUrl: "https://www.zillow.com/premier-agent/",
    asOf: "2026",
  },
  nassauMedianSalePrice: {
    value: "$504,500",
    label: "Nassau County FL median single-family sale price, June 2026.",
    source: "NEFAR, released July 10, 2026",
    sourceUrl: "https://www.nefar.com/",
    asOf: "June 2026",
  },
  localiqCostPerLead: {
    value: "$157.59",
    label:
      "average search-ad cost per lead, Residential Real Estate Agent subcategory, 894 US campaigns.",
    source: "LocaliQ real estate benchmarks, published July 2, 2026",
    sourceUrl: "https://localiq.com/blog/search-advertising-benchmarks-real-estate/",
    asOf: "April 2025–March 2026",
  },
  localiqConversionRate: {
    value: "1.29%",
    label:
      "average search-ad conversion rate, Residential Real Estate Agent subcategory, 894 US campaigns.",
    source: "LocaliQ real estate benchmarks, published July 2, 2026",
    sourceUrl: "https://localiq.com/blog/search-advertising-benchmarks-real-estate/",
    asOf: "April 2025–March 2026",
  },
  // Never print a percentage for review weight.
  reviewSignals: {
    value: "top 12",
    label:
      "review rating, volume, and recency each rank among the top 12 individual local ranking factors.",
    source: "Whitespark 2026 Local Search Ranking Factors",
    sourceUrl: "https://whitespark.ca/local-search-ranking-factors/",
    asOf: "2026",
  },
  gbpPractitionerRules: {
    value: "one profile per practitioner",
    label:
      "agents qualify for their own Business Profile; reachable at the verified address during stated hours; profile title is the practitioner's name only.",
    source: "Google Business Profile Help, answers 3038177 / 13763036",
    sourceUrl: "https://support.google.com/business/answer/3038177",
    asOf: "2026",
  },
} as const satisfies Record<string, Fact>;

// Band 2 of the homepage — what the old route costs. Amber figures.
export const homeStatFacts: Fact[] = [
  facts.zillowPreferredSellerFee,
  facts.nassauFeeArithmetic,
  facts.premierAgentCostPerConnection,
];
