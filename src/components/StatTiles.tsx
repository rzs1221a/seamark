import type { Fact } from "../lib/facts";

// Competitor-cost tiles: amber figures (value flowing away), mono source lines.
// Values come from facts.ts only — no raw numeric claims in JSX.
export function StatTiles({ facts }: { facts: Fact[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {facts.map((f) => (
        <div key={f.value} className="panel-plain p-6">
          <div className="mono text-3xl font-medium text-(--lead)">{f.value}</div>
          <p className="mt-3 text-sm leading-relaxed text-(--ink)">{f.label}</p>
          <p className="mono mt-4 text-[0.6875rem] leading-relaxed text-(--muted)">
            {f.source}
          </p>
        </div>
      ))}
    </div>
  );
}
