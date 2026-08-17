// The fit quiz — a shop assistant, not a scoring theater. Four questions,
// a deterministic mapping to one build tier + one Watch plan, and a
// plain-English summary that prefills the contact form (editable there).

import { tiers, type Tier } from "./offer";
import { watchPlans, type WatchPlan } from "./watch";

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: "have" | "work" | "focus" | "listing";
  prompt: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "have",
    prompt: "What do you have today?",
    options: [
      { id: "nothing", label: "Nothing of my own" },
      { id: "brokerage", label: "A brokerage page" },
      { id: "site", label: "A site I own" },
      { id: "ads", label: "A site, and ads running" },
    ],
  },
  {
    id: "work",
    prompt: "How do you work?",
    options: [
      { id: "solo", label: "Solo agent" },
      { id: "team", label: "A team" },
      { id: "producer", label: "Top producer" },
      { id: "market", label: "I want the whole market" },
    ],
  },
  {
    id: "focus",
    prompt: "What matters most right now?",
    options: [
      { id: "found", label: "Getting found on Google" },
      { id: "site", label: "A site of my own" },
      { id: "leads", label: "Leads landing in BoldTrail" },
      { id: "scale", label: "All of it, at scale" },
    ],
  },
  {
    id: "listing",
    prompt: "How often do you list?",
    options: [
      { id: "rarely", label: "Rarely — mostly buyers" },
      { id: "months", label: "Most months" },
      { id: "weekly", label: "Weekly, sometimes more" },
    ],
  },
];

export type QuizAnswers = Partial<Record<QuizQuestion["id"], string>>;

export interface Recommendation {
  tier: Tier;
  plan: WatchPlan;
  summary: string;
}

const byId = <T extends { id: string }>(list: T[], id: string) =>
  list.find((x) => x.id === id)!;

export function recommend(a: QuizAnswers): Recommendation {
  let tierId = "daymark";
  if (a.work === "market" || a.focus === "scale") tierId = "flagship";
  else if (a.work === "producer" || a.have === "ads") tierId = "light-station";
  else if (a.work === "team" || a.have === "site") tierId = "beacon";
  // Keeping the brokerage page and only wanting to be found: that's the Buoy.
  else if (a.have === "brokerage" && a.focus === "found") tierId = "buoy";

  let planId = "harbor-watch";
  if (a.listing === "rarely") planId = "keeper";
  else if (a.listing === "weekly") planId = "full-watch";

  const label = (q: QuizQuestion["id"]) =>
    quizQuestions
      .find((x) => x.id === q)!
      .options.find((o) => o.id === a[q])?.label.toLowerCase();

  const tier = byId(tiers, tierId);
  const plan = byId(watchPlans, planId);
  const summary =
    `Today I have ${label("have") ?? "—"}. I work as a ${label("work") ?? "—"}, ` +
    `what matters most is ${label("focus") ?? "—"}, and I list ${label("listing") ?? "—"}. ` +
    `The fit quiz pointed me at ${tier.name} with the ${plan.name} plan.`;

  return { tier, plan, summary };
}
