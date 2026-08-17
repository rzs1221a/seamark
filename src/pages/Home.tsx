import { useRef } from "react";
import { Link } from "react-router-dom";
import { PassageHero } from "../components/PassageHero";
import { ProofStrip } from "../components/ProofStrip";
import { StatTiles } from "../components/StatTiles";
import { Cartouche } from "../components/Cartouche";
import { MiniPassage } from "../components/MiniPassage";
import { RadarScope } from "../components/RadarScope";
import { PackCard } from "../components/PackCard";
import { Price } from "../components/Price";
import { FaqList } from "../components/FaqList";
import { PassageRail } from "../components/PassageRail";
import { homeStatFacts } from "../lib/facts";
import { brand, ownershipContract } from "../lib/brand";
import { stations, routeBandHeading, routeBandLede, type Station } from "../lib/stations";
import { tiers, packagesLede, comparisonRows, comparisonTitle } from "../lib/offer";
import { watchHeader, watchPlans, noContractLine, channel } from "../lib/watch";
import { FitQuiz } from "../components/FitQuiz";
import { PlanRow } from "../components/PlanRow";
import { processHeader, processSteps } from "../lib/process";
import { faq } from "../lib/faq";
import { useSectionCamera } from "../lib/useSectionCamera";
import { useReveals } from "../lib/useReveal";

/* ── station visuals: the instruments, at rest ─────────────────────────── */

function SiteMiniature() {
  return (
    <div className="scene-card w-full max-w-72 p-4">
      <div className="flex items-center justify-between">
        <span className="tag">YOUR SITE</span>
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-(--muted)/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--muted)/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--muted)/40" />
        </span>
      </div>
      <div className="mt-3 h-2 w-3/5 rounded bg-(--signal)/60" aria-hidden="true" />
      <div className="mt-1.5 h-1.5 w-2/5 rounded bg-(--muted)/30" aria-hidden="true" />
      <div className="mt-4 space-y-2" aria-hidden="true">
        {[86, 64, 76].map((w, i) => (
          <div key={i} className="form-bar">
            <span style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
      <div className="mono mt-3 text-[0.625rem] text-(--muted)">
        your-name.com · code, domain, hosting — yours
      </div>
    </div>
  );
}

function TerminalMiniature() {
  return (
    <div className="scene-card w-full max-w-72 p-4">
      <div className="flex items-center justify-between border-b border-(--hairline-faint) pb-2">
        <span className="tag tag-lead">YOUR CRM</span>
        <span className="mono text-[0.5625rem] text-(--muted)">BoldTrail — Lead Dropbox</span>
      </div>
      <div className="terminal mt-2">
        <div>
          <span className="t-key">SUBJ </span>
          <span className="t-val">Add Contact</span>
        </div>
        <div>
          <span className="t-key">name </span>
          <span className="t-val">M. Carter</span>
        </div>
        <div>
          <span className="t-key">deal </span>
          <span className="t-val">Sell · 32034</span>
        </div>
        <div className="t-row mt-1.5">M. Carter — NEW LEAD</div>
      </div>
    </div>
  );
}

function StationRow({ station, index }: { station: Station; index: number }) {
  const visual =
    station.id === "found" ? (
      <div className="w-full max-w-72">
        <PackCard />
      </div>
    ) : station.id === "landed" ? (
      <SiteMiniature />
    ) : (
      <TerminalMiniature />
    );
  const flipped = index % 2 === 1;
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
      <div className={flipped ? "md:order-2" : ""} data-reveal data-scrub="a">
        <span className={`station-chip lit`}>
          <span className="dot" aria-hidden="true" />
          {station.label}
        </span>
        <h3 className="mt-4 text-2xl tracking-tight">{station.title}</h3>
        <p className="mt-4 leading-relaxed text-(--muted)">{station.problem}</p>
        <div className="mt-5">
          <div className="mono-label">What gets built</div>
          <p className="mt-2 leading-relaxed">{station.build}</p>
        </div>
      </div>
      <div
        className={`flex justify-center ${flipped ? "md:order-1 md:justify-start" : "md:justify-end"}`}
        data-reveal
        data-scrub="b"
      >
        {visual}
      </div>
    </div>
  );
}

/* ── the Build, in depth ───────────────────────────────────────────────── */

function TierRow({ index }: { index: number }) {
  const tier = tiers[index];
  const flipped = index % 2 === 1;
  return (
    <article id={`tier-${tier.id}`} className="seam-top scroll-mt-24 py-14 first:pt-0 first:before:hidden">
      <div className="grid items-start gap-8 md:grid-cols-[1fr_1.2fr] md:gap-14">
        <div className={flipped ? "md:order-2" : ""} data-reveal data-scrub="a">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl tracking-tight">{tier.name}</h3>
            {tier.popular && <span className="chip">Most popular</span>}
          </div>
          <div className="mono-label mt-1.5">{tier.system}</div>
          <div className="mt-4">
            <Price value={tier.price} prefix={tier.pricePrefix} note={tier.priceNote} tag />
          </div>
          <p className="mt-3 text-sm text-(--muted) italic">{tier.audience}</p>
          <div className="mt-5 max-w-72">
            <MiniPassage lit={tier.stations} />
          </div>
          <p className="mt-5 leading-relaxed">{tier.pitch}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to={`/contact?rec=${tier.id}`} className="btn-quiet" data-magnetic>
              Start with {tier.name} →
            </Link>
            <Link to="/packages" className="link-draw mono text-sm text-(--muted)">
              The full build sheet
            </Link>
          </div>
        </div>
        <div className={flipped ? "md:order-1" : ""} data-reveal data-scrub="b">
          <div className="mono-label mb-3">Everything in {tier.name}</div>
          <ul className="grid gap-x-8 gap-y-2.5 text-sm leading-relaxed sm:grid-cols-2">
            {tier.deliverables.map((d) => (
              <li key={d} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-(--signal)"
                />
                <span className={d.startsWith("Everything in") ? "text-(--signal)" : "text-(--ink)"}>
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function ComparisonCompact() {
  return (
    <div className="panel-plain mt-14 p-6 sm:p-8" data-reveal>
      <div className="mono-label">{comparisonTitle}</div>
      <div className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-2">
        {comparisonRows.map((row) => (
          <div key={row.question}>
            <div className="font-medium">{row.question}</div>
            <div className="mt-1 text-sm leading-relaxed text-(--muted)">
              <span className="strike">{row.them}</span>
            </div>
            <div className="mt-1 text-sm leading-relaxed text-(--signal)">{row.us}</div>
          </div>
        ))}
      </div>
      <Link to="/packages" className="link-draw mono mt-6 inline-block text-sm text-(--signal)">
        The full comparison →
      </Link>
    </div>
  );
}

/* ── the shelf: browse the products, then read the spec sheets ─────────── */

function Shelf({
  items,
  anchor,
}: {
  items: Array<{ id: string; name: string; price: React.ReactNode; line: string }>;
  anchor: string;
}) {
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
      {items.map((item) => (
        <a key={item.id} href={`#${anchor}-${item.id}`} className="shelf-tile">
          <span className="flex items-baseline justify-between gap-2">
            <span className="font-semibold tracking-tight">{item.name}</span>
            {item.price}
          </span>
          <span className="mono-label mt-1.5 block">{item.line}</span>
        </a>
      ))}
    </div>
  );
}

/* ── the Watch, at full depth ──────────────────────────────────────────── */

function WatchShowcase() {
  return (
    <>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div data-reveal>
          <div className="mono-label">04 · The Watch — the keeping · monthly · no contract</div>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">{watchHeader}</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-(--muted)">
            The build is bought once and it is yours. What only exists monthly is the
            keeping: reviews arriving and answered, the profile accurate, the capture path
            tested rather than assumed. That is the Watch — three sizes of it, each below
            at full depth.
          </p>
        </div>
        <div data-reveal data-scrub="b">
          <RadarScope compact />
        </div>
      </div>

      <Shelf
        anchor="plan"
        items={watchPlans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          price: <Price value={plan.price} per={plan.per} />,
          line: plan.tagline,
        }))}
      />

      <div className="mt-6">
        {watchPlans.map((plan, i) => (
          <PlanRow key={plan.id} plan={plan} index={i} />
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed" data-reveal>
        {noContractLine}
      </p>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-(--muted)" data-reveal>
        Running ads too?{" "}
        <Link to="/watch" className="link-draw text-(--signal)">
          The Channel
        </Link>{" "}
        — {channel.copy.split(". ")[0]}.
      </p>
    </>
  );
}

/* ── the page ──────────────────────────────────────────────────────────── */

// The homepage is the whole passage now: mechanism, proof, price, the wound,
// the keeping, the process, the answers, the contract — one continuous scroll,
// the coast flying beneath each band.
export function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  useSectionCamera(rootRef);
  useReveals(rootRef);
  return (
    <div ref={rootRef}>
      <PassageRail />
      <PassageHero />

      {/* Band 2 — the route, explained */}
      <section
        aria-label="The route, explained"
        data-frame="home-route"
        className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
      >
        <div className="max-w-2xl" data-reveal>
          <div className="mono-label">01 · The route</div>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">{routeBandHeading}</h2>
          <p className="mt-4 leading-relaxed text-(--muted)">{routeBandLede}</p>
        </div>
        <div className="mt-14 space-y-20">
          {stations.map((station, i) => (
            <StationRow key={station.id} station={station} index={i} />
          ))}
        </div>
      </section>

      {/* Band 3 — the proof strip */}
      <div data-frame="home-proof" className="seam-top">
        <ProofStrip />
      </div>

      {/* Band 4 — the Build, in depth */}
      <section
        aria-label="The Build"
        id="the-build"
        data-frame="home-build"
        className="seam-top mx-auto max-w-6xl px-4 py-24 sm:px-6"
      >
        <div className="max-w-2xl" data-reveal>
          <div className="mono-label">03 · The Build — bought once</div>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
            One fee. Four sizes. Owned outright.
          </h2>
          <p className="mt-4 leading-relaxed text-(--muted)">{packagesLede}</p>
        </div>

        <Shelf
          anchor="tier"
          items={tiers.map((tier) => ({
            id: tier.id,
            name: tier.name,
            price: <Price value={tier.price} prefix={tier.pricePrefix} />,
            line: tier.system,
          }))}
        />
        <div className="mt-4" data-reveal>
          <FitQuiz />
        </div>

        <div className="mt-6">
          {tiers.map((_, i) => (
            <TierRow key={tiers[i].id} index={i} />
          ))}
        </div>
        <ComparisonCompact />
        <p className="mt-10 text-center" data-reveal>
          <a href="#the-watch" className="link-draw mono text-sm text-(--signal)">
            The build is bought once. What stays monthly lives below →
          </a>
        </p>
      </section>

      {/* Band 5 — the Watch, right where the buying decision happens */}
      <section
        aria-label="The Watch"
        id="the-watch"
        data-frame="home-watch"
        className="seam-top mx-auto max-w-6xl px-4 py-24 sm:px-6"
      >
        <WatchShowcase />
      </section>

      {/* Band 6 — what the old route costs */}
      <section
        aria-label="What the old route costs"
        data-frame="home-costs"
        className="seam-top mx-auto max-w-6xl px-4 py-24 sm:px-6"
      >
        <div className="mono-label" data-reveal>
          05 · The old route
        </div>
        <h2 className="mt-3 text-2xl sm:text-3xl" data-reveal>
          What the old route costs
        </h2>
        <p className="mt-2 max-w-xl text-(--muted)" data-reveal>
          This is the picture of value flowing the wrong way.
        </p>
        <div className="mt-8">
          <StatTiles facts={homeStatFacts} />
        </div>
      </section>

      {/* Band 7 — the process rail */}
      <section
        aria-label="The process"
        data-frame="home-process"
        className="seam-top mx-auto max-w-6xl px-4 py-24 sm:px-6"
      >
        <div className="mono-label" data-reveal>
          06 · The process
        </div>
        <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl" data-reveal>
          {processHeader}.
        </h2>
        <ol className="process-rail mt-12">
          {processSteps.map((step, i) => (
            <li key={step} data-reveal data-scrub={(["a", "b", "c"] as const)[i % 3]}>
              <span className="process-node mono">{i + 1}</span>
              <span className="mt-3 block text-sm leading-snug sm:text-base">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-xl text-sm leading-relaxed text-(--muted)" data-reveal>
          A fixed quote in writing before anything starts; the design before any production
          code; a live preview you can check any time. Nothing is billed by surprise and
          nothing launches outside your own accounts.
        </p>
      </section>

      {/* Band 8 — the top questions */}
      <section
        aria-label="Questions"
        data-frame="home-questions"
        className="seam-top mx-auto max-w-3xl px-4 py-24 sm:px-6"
      >
        <div className="mono-label" data-reveal>
          07 · Questions
        </div>
        <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl" data-reveal>
          Answered straight.
        </h2>
        <div className="mt-8">
          <FaqList entries={faq.slice(0, 4)} />
        </div>
        <Link
          to="/questions"
          className="link-draw mono mt-6 inline-block text-sm text-(--signal)"
          data-reveal
        >
          All the questions →
        </Link>
      </section>

      {/* Band 9 — the ownership contract, then one door */}
      <section
        aria-label="The ownership contract"
        data-frame="home-contract"
        className="seam-top mx-auto max-w-4xl px-4 py-24 sm:px-6"
      >
        <div className="mono-label mb-6" data-reveal>
          08 · The contract
        </div>
        <div data-reveal>
          <Cartouche label={ownershipContract.label} text={ownershipContract.text} />
        </div>
        <div className="mt-10 text-center" data-reveal>
          <Link to="/contact" className="btn-cta" data-cta="home-contract" data-magnetic>
            Twenty minutes, and you&rsquo;ll know
          </Link>
          <p className="mono mt-5 text-sm text-(--muted)">
            Or right now:{" "}
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
