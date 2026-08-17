import { Link } from "react-router-dom";
import { Price } from "./Price";
import type { WatchPlan } from "../lib/watch";

/**
 * A Watch plan at full spec-sheet depth — the same treatment the build tiers
 * get. Left: identity, price tag, pitch, its own door. Right: what's
 * included and what the month actually looks like.
 */
export function PlanRow({ plan, index }: { plan: WatchPlan; index: number }) {
  const flipped = index % 2 === 1;
  return (
    <article id={`plan-${plan.id}`} className="seam-top scroll-mt-24 py-14 first:pt-0 first:before:hidden">
      <div className="grid items-start gap-8 md:grid-cols-[1fr_1.2fr] md:gap-14">
        <div className={flipped ? "md:order-2" : ""} data-reveal data-scrub="a">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl tracking-tight">{plan.name}</h3>
            {plan.popular && <span className="chip">Most popular</span>}
            {plan.badge && <span className="chip chip-lead">{plan.badge.text}</span>}
          </div>
          <div className="mono-label mt-1.5">{plan.tagline}</div>
          <div className="mt-4">
            <Price value={plan.price} per={plan.per} tag />
          </div>
          <p className="mt-4 leading-relaxed">{plan.pitch}</p>
          {plan.blurb && (
            <p className="mt-3 text-sm leading-relaxed text-(--muted)">{plan.blurb}</p>
          )}
          <div className="mt-6">
            <Link to={`/contact?rec=${plan.id}`} className="btn-quiet" data-magnetic>
              Put {plan.name} on watch →
            </Link>
          </div>
        </div>
        <div className={flipped ? "md:order-1" : ""} data-reveal data-scrub="b">
          <div className="mono-label mb-3">Everything in {plan.name}</div>
          <ul className="grid gap-x-8 gap-y-2.5 text-sm leading-relaxed sm:grid-cols-2">
            {plan.includes.map((item) => (
              <li key={item.text} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-(--signal)"
                />
                <span
                  className={
                    item.emphasis
                      ? "font-semibold text-(--ink)"
                      : item.text.startsWith("Everything in")
                        ? "text-(--signal)"
                        : "text-(--ink)"
                  }
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
          <div className="mono-label mt-6 mb-2">The month, in practice</div>
          <p className="text-sm leading-relaxed text-(--muted)">{plan.detail}</p>
        </div>
      </div>
    </article>
  );
}
