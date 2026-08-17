// The route table. Prerender, sitemap, and the client router all read this —
// one list, so they cannot drift.

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
}

export const routeTable: RouteMeta[] = [
  {
    path: "/",
    title: "Seamark Studio — Get found on Google. Get the lead into your hands.",
    description:
      "Google presence, a site on your own domain, and every lead wired into your BoldTrail — built once, owned outright, in your name.",
  },
  {
    path: "/packages",
    title: "The Build — one fee, owned outright · Seamark Studio",
    description:
      "Buoy, Daymark, Beacon, Light Station, Flagship — five builds from $1,200, starting with your Google presence and no website at all. One fee, or twelve monthly payments. Either way you own it at launch: the code, the domain, the profile, the ad account, the data.",
  },
  {
    path: "/watch",
    title: "The Watch — someone awake while you sleep · Seamark Studio",
    description:
      "Reviews answered, your profile kept accurate, and your lead path tested rather than assumed — the work that only exists monthly. From $99 a month, no contract, and two of the three plans need no website at all.",
  },
  {
    path: "/work",
    title: "Work — real sites on this coast · Seamark Studio",
    description:
      "Shipped projects, stated as what each site verifiably does. Deliberately no conversion statistics.",
  },
  {
    path: "/capabilities",
    title: "Capabilities — everything here is running · Seamark Studio",
    description:
      "Not a longer feature list — a different category of thing. Everything below is running, on this page or a site you can visit.",
  },
  {
    path: "/process",
    title: "Process — no surprises · Seamark Studio",
    description:
      "Five steps: a conversation, a fixed quote in writing, the design before any production code, a live preview you can check any time, launch in your own accounts.",
  },
  {
    path: "/questions",
    title: "Questions, answered straight · Seamark Studio",
    description:
      "Ownership, running costs, BoldTrail routing, changing brokerages, and why the ad channel has a floor — answered plainly.",
  },
  {
    path: "/contact",
    title: "Request a pilot · Seamark Studio",
    description:
      "Twenty minutes on the phone. I'll pull up your Google presence while we talk and tell you exactly what's missing, whether or not you ever hire me.",
  },
];
