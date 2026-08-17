// The route, explained — the three stations that decide whether a stranger
// becomes a client. Mechanism copy only: what the station is, where the lead
// is usually lost, what gets built for it. No numbers that aren't already in
// facts.ts; no outcome claims.

export interface Station {
  id: "found" | "landed" | "captured";
  label: string;
  title: string;
  /** Where most agents lose the lead at this station. */
  problem: string;
  /** What Seamark builds for it. */
  build: string;
}

export const stations: Station[] = [
  {
    id: "found",
    label: "FOUND",
    title: "Get found where the search actually happens",
    problem:
      "When someone types “sell my house” into Google, the local pack decides who exists. Your category is set once, your distance from the searcher cannot be changed at all — which leaves reviews as the one heavily-weighted signal still in your hands, and recency counts. Most agents either have no profile of their own, or one the brokerage controls, or one set up wrong enough to risk suspension.",
    build:
      "Your own Google Business Profile — claimed, verified, categorised correctly, titled the way the rules actually require, and registered to you. A review engine that keeps a steady trickle arriving and answered, because a steady trickle beats a burst every time. It follows you if you ever change brokerages.",
  },
  {
    id: "landed",
    label: "LANDED",
    title: "Land them on a page you own",
    problem:
      "Most searches now end without a click, and AI answers have absorbed the neighbourhood-guide traffic. What still reaches a person is local and high-intent — someone ready to act. Send that person to a brokerage template and they land on a page that looks like every other agent's, on a domain that goes away with the job.",
    build:
      "A fast site on your own domain — real static HTML per route, so crawlers and AI agents read finished pages instead of an empty script shell. Area pages for the communities you actually farm, each a separate entry point from search. The code, the domain, and the hosting account are all in your name.",
  },
  {
    id: "captured",
    label: "CAPTURED",
    title: "Capture into the CRM you already open",
    problem:
      "The most expensive lead is the one that arrived and never landed anywhere — a form that emails a mailbox nobody checks, a second inbox that gets forgotten by Thursday. Capture fails quietly, and nobody notices until the closing that didn't happen.",
    build:
      "Every form wired through BoldTrail's own Lead Dropbox parser into the account your brokerage already gives you — name, intent, and source split into fields. The path is tested end to end, in writing, before launch; on a Watch plan a synthetic lead is pushed through it every month and shown to you.",
  },
];

export const routeBandHeading =
  "Three stations decide whether a stranger becomes your client.";

export const routeBandLede =
  "This is the mechanism, not a metaphor. Each station below is a real piece of infrastructure, built once, in your name.";
