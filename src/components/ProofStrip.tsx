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
export function ProofStrip() {
  if (liveWork.length === 0) return null;
  return (
    <section aria-label="Shipped work" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-lg text-(--ink)">{proofStripLine}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {liveWork.map((item) => (
          <WorkCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
