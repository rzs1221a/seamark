import { useRef } from "react";
import { Link } from "react-router-dom";
import { MiniPassage } from "../components/MiniPassage";
import { Price } from "../components/Price";
import {
  tiers,
  packagesLede,
  payOptions,
  priceIncrease,
  comparisonTitle,
  comparisonRows,
} from "../lib/offer";
import { watchHeader } from "../lib/watch";
import { SHOW_PRICING } from "../lib/brand";
import { useReveals } from "../lib/useReveal";

export function Packages() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveals(rootRef);
  return (
    <div ref={rootRef} className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mono-label">The Build</div>
      <h1 className="mt-3 max-w-2xl text-3xl sm:text-4xl">
        One fee, or twelve. You own it either way.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-(--muted)">{packagesLede}</p>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <article
            key={tier.id}
            id={`tier-${tier.id}`}
            data-reveal
            data-flick
            data-scrub={(["a", "b", "c"] as const)[i % 3]}
            className={`panel relative flex scroll-mt-24 flex-col p-6 ${
              tier.popular ? "border-(--signal)/50" : ""
            }`}
          >
            {tier.popular && (
              <span className="chip chip-accent absolute -top-3 left-6 bg-(--bg)">
                Most popular
              </span>
            )}
            {tier.badge && (
              <span className="chip chip-lead absolute -top-3 left-6 bg-(--bg)">{tier.badge}</span>
            )}

            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight">{tier.name}</h2>
              <Price
                value={tier.price}
                prefix={tier.pricePrefix}
                note={tier.priceNote}
                monthly={tier.monthlyPrice}
                tag
              />
            </div>
            <div className="mono-label mt-1">{tier.system}</div>
            <p className="mt-3 text-sm text-(--muted) italic">{tier.audience}</p>
            <p className="mt-3 text-sm leading-relaxed">{tier.summary ?? tier.pitch}</p>

            <div className="mt-5 max-w-72">
              <MiniPassage lit={tier.stations} />
            </div>

            {tier.idealFor && (
              <>
                <div className="mono-label mt-6">Right if</div>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-(--muted)">
                  {tier.idealFor.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-(--lead)"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mono-label mt-6">What you get</div>
            <ul className="mt-2 space-y-2.5 text-sm leading-relaxed">
              {tier.deliverables.map((d) => (
                <li key={d} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-(--signal)"
                  />
                  <span
                    className={d.startsWith("Everything in") ? "text-(--signal)" : "text-(--ink)"}
                  >
                    {d}
                  </span>
                </li>
              ))}
            </ul>

            {tier.turnaroundTime && (
              <p className="mono mt-5 text-[0.6875rem] text-(--muted)">
                Turnaround · {tier.turnaroundTime}
              </p>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
              <Link to={`/contact?rec=${tier.id}`} className="btn-quiet" data-magnetic>
                {tier.ctaLabel ?? `Start with ${tier.name}`} →
              </Link>
              {tier.exampleSlug && (
                <Link
                  to={`/work#${tier.exampleSlug}`}
                  className="link-draw mono text-sm text-(--muted)"
                >
                  See an example
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Two ways to pay */}
      <section aria-label={payOptions.title} className="panel mt-8 p-6 sm:p-8" data-reveal>
        <h2 className="text-xl tracking-tight">{payOptions.title}</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-(--muted)">{payOptions.body}</p>
      </section>

      {/* The published increase — figures, so it lives behind the price gate. */}
      {SHOW_PRICING && (
      <section
        aria-label="Prices through December 31"
        className="panel-plain mt-5 p-6 sm:p-8"
        data-reveal
      >
        <p className="leading-relaxed">{priceIncrease.body}</p>
        <ul className="mono mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {priceIncrease.rows.map((row) => (
            <li key={row.name} className="text-(--muted)">
              {row.name} <span className="text-(--ink)">{row.price}</span>
            </li>
          ))}
        </ul>
      </section>
      )}

      <section aria-label={comparisonTitle} className="mt-20">
        <h2 className="text-2xl sm:text-3xl" data-reveal>
          {comparisonTitle}
        </h2>
        <div className="panel-plain mt-6 overflow-x-auto" data-reveal>
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-(--hairline-faint)">
                <th className="mono-label p-4 font-normal">The question</th>
                <th className="mono-label p-4 font-normal text-(--lead)!">Elsewhere</th>
                <th className="mono-label p-4 font-normal text-(--signal)!">Here</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.question} className="border-b border-(--hairline-faint) last:border-0">
                  <td className="p-4 align-top font-medium">{row.question}</td>
                  <td className="p-4 align-top leading-relaxed text-(--muted)">
                    <span className="strike">{row.them}</span>
                  </td>
                  <td className="p-4 align-top leading-relaxed">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Link
        to="/watch"
        data-reveal
        className="panel mt-16 flex flex-col gap-4 p-8 transition-colors hover:border-(--signal)/50 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="mono-label">After the build · The Watch</div>
          <div className="mt-2 text-xl font-semibold tracking-tight">{watchHeader}</div>
          <p className="mt-2 max-w-xl text-sm text-(--muted)">
            Reviews answered, the profile kept accurate, the lead path tested. Two of the three
            plans need no website at all.
          </p>
        </div>
        <span className="btn-quiet shrink-0">See the plans →</span>
      </Link>
    </div>
  );
}
