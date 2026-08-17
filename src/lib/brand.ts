export const brand = {
  name: "Seamark Studio",
  short: "Seamark",
  tagline: "Get found on Google. Get the lead into your hands.",
  positioning:
    "Google presence, a site on your own domain, and every lead wired into your BoldTrail — built once, owned outright, in your name.",
  domain: "seamark.studio",
  origin: "https://seamark.studio",
  email: "zander@seamark.studio",
  phone: "+19045488222",
  phoneDisplay: "(904) 548-8222",
  location: "Amelia Island, Florida",
} as const;

// false renders every figure as "Let's talk" — gate ALL prices through this.
export const SHOW_PRICING = true;

export const disclaimer =
  "Seamark is an independent studio — not affiliated with, endorsed by, or acting on behalf of Berkshire Hathaway HomeServices. Zillow figures are from Zillow's own published pricing pages as of 2026 and apply only to transactions originating from a Zillow connection. Market figures are NEFAR data as of the date shown. Illustrative arithmetic is not a projection of your results.";

export const ownershipContract = {
  label: "THE OWNERSHIP CONTRACT · DATUM: YOUR NAME",
  // Bold segments are marked with **…** and rendered by the cartouche component.
  text: "The domain is registered in **your** name. The Google Business Profile is **yours**. The ad account is **yours**, with your card on it. The site is **yours**, code included. The lead data is **yours**. If you leave the brokerage tomorrow, every piece of it goes with you — because none of it was ever mine.",
};

export const serviceTypes = [
  "Local search optimization",
  "Google Business Profile management",
  "Website design and development",
  "Search engine marketing",
  "Lead generation",
];
