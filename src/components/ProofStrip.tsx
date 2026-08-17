import { Link } from "react-router-dom";
import { workItems, liveWork, proofStripLine, type WorkItem } from "../lib/work";
import { isDev } from "../lib/env";

function WorkCard({ item }: { item: WorkItem }) {
  const body = (
    <div className="panel-plain flex h-full flex-col p-5 transition-colors hover:border-(--hairline)">
      <div className="mono-label">{item.kind}</div>
      <div className="mt-2 font-semibold tracking-tight">{item.name}</div>
      {item.todo ? (
        <div className="mono mt-3 text-[0.6875rem] leading-relaxed text-(--lead)">
          TODO(zander) — awaiting real screenshots and verified claims
        </div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-(--muted)">{item.outcome}</p>
      )}
    </div>
  );
  return item.todo ? body : <Link to={`/work#${item.slug}`}>{body}</Link>;
}

// Band 1 of the homepage. TODO entries show their awaiting state in dev and
// are excluded from production until filled in — the band collapses rather
// than showing unverified work.
export function ProofStrip() {
  const items = isDev ? workItems : liveWork;
  if (items.length === 0) return null;
  return (
    <section aria-label="Shipped work" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-lg text-(--ink)">{proofStripLine}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <WorkCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
