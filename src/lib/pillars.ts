// Capability entries for /capabilities. Copy is final — verbatim.

export interface Pillar {
  id: string;
  title: string;
  body: string;
  matters: string;
  proof: string;
}

export const capabilitiesLede =
  "Not a longer feature list — a different category of thing. Everything below is running, on this page or a site you can visit.";

export const captureDemoLabel =
  "Demo — this pane is the same parser your BoldTrail runs; on a client build it lands in your CRM, not on a screen.";

export const pillars: Pillar[] = [
  {
    id: "profile",
    title: "The profile that decides whether you appear",
    body: "Google's guidelines allow you your own Business Profile, separate from the brokerage's — agents qualify as individual practitioners. Claimed in your name, categorised correctly, titled the way the rules actually require, and kept accurate: hours, services, photos, and answered reviews.",
    matters:
      "Your category is set once and your proximity to the searcher cannot be changed at all, which leaves reviews as the one heavily-weighted signal still in your hands — and recency counts, so it has to keep going. Set up wrong it gets suspended; set up right it is yours, and it follows you if you change brokerages. Anyone selling this as weekly posts is selling the weakest lever in the box.",
    proof:
      "The annotated result below — the parts of the pack that are levers, labeled.",
  },
  {
    id: "pages",
    title: "Pages that actually rank",
    body: "Real static HTML per route, prerendered. Every page on this site exists as a finished HTML file before any script runs — the crawler and the visitor read the same copy.",
    matters:
      "Most searches now end without a click, and AI answers have absorbed the neighbourhood-guide traffic. What still reaches a person is local and high-intent — someone searching for a realtor, or a specific place, ready to act. Those land on pages like these.",
    proof: "This page. View source — the copy is in the HTML before any script runs.",
  },
  {
    id: "boldtrail",
    title: "Leads into BoldTrail, properly",
    body: "Every form is wired through BoldTrail's own Lead Dropbox parser into the account your brokerage already gives you — name, intent, and source split into fields, not an email you forward by hand.",
    matters:
      "You do not change how you work. The site feeds the CRM you already open, instead of becoming a second inbox you forget.",
    proof: "The demo at the top of this page runs the same parse, on screen.",
  },
  {
    id: "tested",
    title: "The capture path, tested rather than assumed",
    body: "A synthetic lead is pushed through the live form into BoldTrail every month, and the result is shown to you — timestamped, in the report.",
    matters: "The most expensive lead is the one that arrived and never landed anywhere.",
    proof: "On Watch plans, the month's test is part of the report you receive.",
  },
  {
    id: "editable",
    title: "You edit it yourself",
    body: "Log in, change photos, bio, or listings — live in a minute.",
    matters:
      "A site you cannot touch goes stale, and a request queue is a tax on every small change. Yours ships with an editor login, not a retainer.",
    proof: "Every client build ships with the login, and a walkthrough of it.",
  },
];
