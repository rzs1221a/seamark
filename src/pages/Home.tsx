import { useRef } from "react";
import { Link } from "react-router-dom";
import { PassageHero } from "../components/PassageHero";
import { ProofStrip } from "../components/ProofStrip";
import { Cartouche } from "../components/Cartouche";
import { Price } from "../components/Price";
import { homeStatFacts } from "../lib/facts";
import { brand, ownershipContract } from "../lib/brand";
import { stations, routeBandHeading } from "../lib/stations";
import { tiers } from "../lib/offer";
import { watchPlans, noContractLine } from "../lib/watch";
import { useSectionCamera } from "../lib/useSectionCamera";
import { useReveals } from "../lib/useReveal";

/** One product, one line, one price. The whole catalogue fits on a screen. */
function OfferLine({
  name,
  price,
  line,
  popular,
}: {
  name: string;
  price: React.ReactNode;
  line: string;
  popular?: boolean;
}) {
  return (
    <li className="offer-line" data-reveal>
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex items-center gap-2.5">
          <span className="font-medium tracking-tight">{name}</span>
          {popular && <span className="chip chip-accent">Most popular</span>}
        </span>
        {price}
      </div>
      <p className="mt-1 text-sm leading-snug text-(--muted)">{line}</p>
    </li>
  );
}

// The homepage: what it is, what it costs, that it's real, and the door.
// Everything deeper lives one click away.
export function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  useSectionCamera(rootRef);
  useReveals(rootRef);
  return (
    <div ref={rootRef}>
      <PassageHero />

      {/* 2 — the route, three lines */}
      <section
        aria-label="The route"
        data-frame="home-route"
        className="mx-auto max-w-5xl px-4 py-24 sm:px-6"
      >
        <h2 className="text-3xl tracking-tight sm:text-4xl" data-reveal>
          {routeBandHeading}
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {stations.map((station, i) => (
            <div key={station.id} data-reveal data-scrub={(["a", "b", "c"] as const)[i]}>
              <span className="station-chip lit">
                <span className="dot" aria-hidden="true" />
                {station.label}
              </span>
              <h3 className="mt-4 text-lg font-medium tracking-tight">{station.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-(--muted)">{station.line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — the offer, whole catalogue on one screen */}
      <section
        aria-label="What it costs"
        data-frame="home-offer"
        className="seam-top mx-auto max-w-5xl px-4 py-24 sm:px-6"
      >
        <div className="grid gap-14 md:grid-cols-2">
          <div>
            <h2 className="text-2xl tracking-tight" data-reveal>
              Built once. Yours.
            </h2>
            <ul className="mt-6 space-y-1">
              {tiers.map((tier) => (
                <OfferLine
                  key={tier.id}
                  name={tier.name}
                  popular={tier.popular}
                  price={<Price value={tier.price} prefix={tier.pricePrefix} />}
                  line={tier.pitch}
                />
              ))}
            </ul>
            <Link to="/packages" className="link-draw mono mt-6 inline-block text-sm text-(--signal)" data-reveal>
              What each build includes →
            </Link>
          </div>

          <div>
            <h2 className="text-2xl tracking-tight" data-reveal>
              Kept lit. Monthly.
            </h2>
            <ul className="mt-6 space-y-1">
              {watchPlans.map((plan) => (
                <OfferLine
                  key={plan.id}
                  name={plan.name}
                  price={<Price value={plan.price} per={plan.per} />}
                  line={plan.pitch}
                />
              ))}
            </ul>
            <p className="mt-4 text-sm text-(--muted)" data-reveal>
              {noContractLine}
            </p>
            <Link to="/watch" className="link-draw mono mt-4 inline-block text-sm text-(--signal)" data-reveal>
              What the Watch does each month →
            </Link>
          </div>
        </div>
      </section>

      {/* 4 — proof, and what the other route costs */}
      <section
        aria-label="Proof"
        data-frame="home-proof"
        className="seam-top mx-auto max-w-6xl px-4 py-24 sm:px-6"
      >
        <ProofStrip limit={3} />
        <div className="mt-20 border-t border-(--hairline-faint) pt-12">
          <h2 className="text-2xl tracking-tight" data-reveal>
            What the other route costs
          </h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-3">
            {homeStatFacts.map((fact, i) => (
              <div key={fact.value} data-reveal data-scrub={(["a", "b", "c"] as const)[i]}>
                <dt
                  className={`mono text-3xl font-medium ${i === 0 ? "text-(--accent)" : "text-(--lead)"}`}
                >
                  {fact.value}
                </dt>
                <dd className="mt-2 text-sm leading-snug text-(--muted)">
                  {fact.label.split(".")[0]}.
                  <span className="mono mt-2 block text-[0.6875rem] opacity-70">{fact.source}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 5 — the close */}
      <section
        aria-label="The ownership contract"
        data-frame="home-contract"
        className="seam-top mx-auto max-w-4xl px-4 py-24 sm:px-6"
      >
        <div data-reveal>
          <Cartouche label={ownershipContract.label} text={ownershipContract.text} />
        </div>
        <div className="mt-10 text-center" data-reveal>
          <Link to="/contact" className="btn-cta" data-cta="home-contract" data-magnetic>
            Twenty minutes, and you&rsquo;ll know
          </Link>
          <p className="mono mt-5 text-sm text-(--muted)">
            <a href={`tel:${brand.phone}`} className="link-draw text-(--signal)">
              {brand.phoneDisplay}
            </a>{" "}
            ·{" "}
            <a href={`sms:${brand.phone}`} className="link-draw text-(--signal)">
              text
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
