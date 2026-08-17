// Every claim in this file is verifiable against the source repositories.
// Nothing here should be aspirational. Deliberately no conversion statistics:
// inventing "+40% leads" would be the one lie that discredits every true claim
// beside it.

export interface WorkItem {
  slug: string;
  name: string;
  kind: string;
  client: string;
  /** Stated as what the site verifiably does — never a conversion statistic. */
  outcome: string;
  summary: string;
  highlights: string[];
  stack: string[];
  screenshots: string[];
  url?: string;
  /** TODO(zander) entries render a visible "awaiting" state in dev and are
   *  excluded from the production build until filled in. */
  todo?: boolean;
}

const TODO = "TODO(zander)";

export const workItems: WorkItem[] = [
  {
    slug: "the-aerial",
    name: "The Aerial",
    kind: "Flagship 3D market platform",
    client: TODO,
    outcome: TODO,
    summary: TODO,
    highlights: [],
    stack: [],
    screenshots: [],
    todo: true,
  },
  {
    slug: "heymann-williams-coastal",
    name: "Heymann Williams Coastal",
    kind: "Brokerage site",
    client: TODO,
    outcome: TODO,
    summary: TODO,
    highlights: [],
    stack: [],
    screenshots: [],
    todo: true,
  },
  {
    slug: "sold-on-amelia-island",
    name: "Sold on Amelia Island",
    kind: "Community microsite",
    client: TODO,
    outcome: TODO,
    summary: TODO,
    highlights: [],
    stack: [],
    screenshots: [],
    todo: true,
  },
  {
    slug: "ron-heymann",
    name: "Ron Heymann",
    kind: "Agent page",
    client: TODO,
    outcome: TODO,
    summary: TODO,
    highlights: [],
    stack: [],
    screenshots: [],
    todo: true,
  },
  {
    slug: "seamark-studio",
    name: "Seamark Studio",
    kind: "This storefront",
    client: TODO,
    outcome: TODO,
    summary: TODO,
    highlights: [],
    stack: [],
    screenshots: [],
    todo: true,
  },
];

/** Entries fit to show in production — TODO entries excluded until filled in. */
export const liveWork: WorkItem[] = workItems.filter((w) => !w.todo);

export const proofStripLine = "Real sites, on this coast. Click any of them.";
