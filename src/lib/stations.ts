// The route, in three lines. Mechanism only — what each station is and what
// gets built for it. Depth lives on /capabilities and /packages.

export interface Station {
  id: "found" | "landed" | "captured";
  label: string;
  title: string;
  line: string;
}

export const stations: Station[] = [
  {
    id: "found",
    label: "FOUND",
    title: "Get found",
    line: "A Google Business Profile in your name, categorised correctly, with reviews arriving and answered. It follows you if you change brokerages.",
  },
  {
    id: "landed",
    label: "LANDED",
    title: "Land them somewhere you own",
    line: "A fast site on your own domain — real static pages, not a template on a platform that goes dark when you cancel.",
  },
  {
    id: "captured",
    label: "CAPTURED",
    title: "Capture into BoldTrail",
    line: "Every form wired through the Lead Dropbox parser into the CRM you already open. Tested end to end before launch.",
  },
];

export const routeBandHeading = "Three stations, one route.";
