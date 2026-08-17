import { Link } from "react-router-dom";
import { liveWork, proofStripLine, type WorkItem } from "../lib/work";

export function BeaconDot({ item, size = 7 }: { item: WorkItem; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className={`beacon-dot ${item.light.anim ?? ""}`}
      style={{ width: size, height: size }}
    />
  );
}

function WorkCard({ item }: { item: WorkItem }) {
  return (
    <Link to={`/work#${item.slug}`} className="group block h-full">
      <div className="panel-plain flex h-full flex-col overflow-hidden transition-colors group-hover:border-(--hairline)">
        {item.desktop && (
          <div className="relative aspect-[16/10] overflow-hidden border-b border-(--hairline-faint)">
            <img
              src={item.desktop}
              alt={`${item.name} — ${item.kind}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              style={{ transitionTimingFunction: "var(--ease-out-quart, ease-out)" }}
            />
          </div>
        )}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="mono-label">{item.kind}</span>
            <span className="mono flex items-center gap-2 text-[0.625rem] text-(--signal)">
              <BeaconDot item={item} />
              {item.light.characteristic}
            </span>
          </div>
          <div className="mt-2 font-semibold tracking-tight">{item.name}</div>
          <p className="mt-2 text-sm leading-relaxed text-(--muted)">{item.summary}</p>
        </div>
      </div>
    </Link>
  );
}

// Band 1 of the homepage — the shipped work, each mark blinking its own real
// light characteristic.
export function ProofStrip({ limit }: { limit?: number } = {}) {
  if (liveWork.length === 0) return null;
  const items = limit ? liveWork.slice(0, limit) : liveWork;
  return (
    <section aria-label="Shipped work">
      <div className="flex flex-wrap items-baseline justify-between gap-4" data-reveal>
        <h2 className="text-2xl tracking-tight">{proofStripLine}</h2>
        {limit && limit < liveWork.length && (
          <Link to="/work" className="link-draw mono text-sm text-(--signal)">
            All {liveWork.length} →
          </Link>
        )}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.slug} data-reveal data-scrub={(["a", "b", "c"] as const)[i % 3]}>
            <WorkCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
