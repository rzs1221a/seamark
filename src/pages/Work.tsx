import { useRef } from "react";
import { liveWork, provenanceLine } from "../lib/work";
import { BeaconDot } from "../components/ProofStrip";
import { useReveals } from "../lib/useReveal";

// The least theatrical page on the site — deliberately. The claims section is
// where the showmanship stops. Each entry states its provenance.
export function Work() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveals(rootRef);
  return (
    <div ref={rootRef} className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mono-label">Work</div>
      <h1 className="mt-3 text-3xl sm:text-4xl">Real sites, on this coast.</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-(--muted)">
        Each project is stated as what the site verifiably does, and says how it was
        verified. Deliberately no conversion statistics: inventing one would be the lie that
        discredits every true claim beside it.
      </p>

      <div className="mt-10 space-y-6">
        {liveWork.map((item) => (
          <article
            key={item.slug}
            id={item.slug}
            data-reveal
            className="panel-plain scroll-mt-24 overflow-hidden"
          >
            {item.desktop && (
              <div className="relative aspect-[21/9] overflow-hidden border-b border-(--hairline-faint)">
                <img
                  src={item.desktop}
                  alt={`${item.name} — ${item.kind}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight">
                  <BeaconDot item={item} size={8} />
                  {item.name}
                </h2>
                <span className="mono-label">{item.kind}</span>
              </div>
              <p className="mono mt-1.5 text-[0.6875rem] text-(--muted)">
                {item.light.characteristic} · {item.client}
              </p>
              <p className="mt-4 leading-relaxed">{item.outcome}</p>
              <p className="mt-3 text-sm leading-relaxed text-(--muted)">{item.detail}</p>
              {item.highlights.length > 0 && (
                <ul className="mt-5 space-y-2 text-sm">
                  {item.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-(--signal)"
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="mono text-[0.6875rem] text-(--muted)">
                  {item.stack.join(" · ")} · {provenanceLine[item.verified]}
                </p>
                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link-draw mono text-sm text-(--signal)"
                  >
                    {item.liveUrl.replace("https://", "")} ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
