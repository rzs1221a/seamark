import { Link } from "react-router-dom";
import { MiniPassage } from "../components/MiniPassage";
import { Price } from "../components/Price";
import { tiers, packagesLede, comparisonTitle, comparisonRows } from "../lib/offer";
import { watchHeader } from "../lib/watch";

export function Packages() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mono-label">The Build</div>
      <h1 className="mt-3 max-w-2xl text-3xl sm:text-4xl">
        One fee. After launch, you own all of it.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-(--muted)">{packagesLede}</p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {tiers.map((tier) => (
          <article
            key={tier.id}
            className={`panel relative flex flex-col p-6 sm:p-7 ${
              tier.popular ? "border-(--signal)/50" : ""
            }`}
          >
            {tier.popular && (
              <span className="chip absolute -top-3 left-6 bg-(--bg)">Most popular</span>
            )}
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight">{tier.name}</h2>
              <Price value={tier.price} prefix={tier.pricePrefix} note={tier.priceNote} />
            </div>
            <div className="mono-label mt-1">{tier.system}</div>
            <p className="mt-3 text-sm text-(--muted) italic">{tier.audience}</p>

            {/* the diagram is the tier comparison */}
            <div className="mt-5 max-w-72">
              <MiniPassage lit={tier.stations} />
            </div>

            <ul className="mt-5 space-y-2.5 text-sm leading-relaxed">
              {tier.deliverables.map((d) => (
                <li key={d} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-(--signal)" />
                  <span className={d.startsWith("Everything in") ? "text-(--signal)" : "text-(--ink)"}>
                    {d}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section aria-label={comparisonTitle} className="mt-20">
        <h2 className="text-2xl sm:text-3xl">{comparisonTitle}</h2>
        <div className="panel-plain mt-6 overflow-x-auto">
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
                  <td className="p-4 align-top leading-relaxed text-(--muted)">{row.them}</td>
                  <td className="p-4 align-top leading-relaxed">{row.us}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Link
        to="/watch"
        className="panel mt-16 flex flex-col gap-4 p-8 transition-colors hover:border-(--signal)/50 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="mono-label">After the build · The Watch</div>
          <div className="mt-2 text-xl font-semibold tracking-tight">{watchHeader}</div>
          <p className="mt-2 max-w-xl text-sm text-(--muted)">
            The work that only exists monthly — reviews answered, the profile kept accurate, the
            lead path tested rather than assumed.
          </p>
        </div>
        <span className="btn-quiet shrink-0">See the plans →</span>
      </Link>
    </div>
  );
}
