import { PackCard } from "./PackCard";

const CALLOUTS = [
  {
    label: "CATEGORY",
    note: "set once — decides which searches you can appear in at all",
  },
  {
    label: "REVIEW COUNT + RECENCY",
    note: "the heavily-weighted signal still in your hands; recency counts",
  },
  {
    label: "HOURS",
    note: "kept accurate — the rules require you reachable during them",
  },
] as const;

// A faithful, clearly-fictional local-pack result with the levers labeled.
// Realtors have stared at this UI a thousand times without knowing which
// parts move.
export function PackMock() {
  return (
    <div className="grid items-center gap-6 md:grid-cols-2">
      <div className="relative mx-auto w-full max-w-80">
        <div className="mono-label mb-2">The local pack · position 1</div>
        <PackCard />
        <div className="mono mt-2 text-[0.625rem] text-(--muted)">
          J. Cooper is a fictional demo agent — the layout is Google&rsquo;s, the levers are
          real.
        </div>
      </div>
      <ul className="space-y-4">
        {CALLOUTS.map((c, i) => (
          <li
            key={c.label}
            className="flex gap-3"
            data-reveal
            data-scrub={(["a", "b", "c"] as const)[i % 3]}
          >
            <span
              aria-hidden="true"
              className="mt-1.5 h-px w-6 shrink-0 bg-(--signal) opacity-70"
            />
            <div>
              <div className="mono text-[0.6875rem] tracking-widest text-(--signal)">
                {c.label}
              </div>
              <div className="mt-0.5 text-sm text-(--muted)">{c.note}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
