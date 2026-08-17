import { useRef } from "react";
import { RadarScope } from "../components/RadarScope";
import { Price } from "../components/Price";
import { PlanRow } from "../components/PlanRow";
import { SHOW_PRICING } from "../lib/brand";
import { watchHeader, watchLede, watchPlans, noContractLine, channel } from "../lib/watch";
import { useReveals } from "../lib/useReveal";

function SailVsPower() {
  return (
    <svg viewBox="0 0 320 80" className="w-full max-w-80" role="img" aria-label="Two vessels: one under sail with no meter running, one under power with a wake and a running meter">
      {/* under sail */}
      <g>
        <path d="M 40 52 L 80 52 L 72 60 L 48 60 Z" fill="none" stroke="var(--signal)" strokeWidth="1.25" />
        <line x1="60" y1="52" x2="60" y2="20" stroke="var(--signal)" strokeWidth="1.25" />
        <path d="M 60 22 C 74 30 76 42 62 50 Z" fill="rgba(240,244,246,0.2)" stroke="var(--signal)" strokeWidth="1" />
        <text x="60" y="74" textAnchor="middle" fontSize="8" fill="var(--muted)" style={{ fontFamily: "var(--font-mono)" }}>
          UNDER SAIL · NO METER
        </text>
      </g>
      {/* under power */}
      <g>
        <path d="M 210 52 L 250 52 L 242 60 L 218 60 Z" fill="none" stroke="var(--lead)" strokeWidth="1.25" />
        <rect x="222" y="42" width="14" height="10" fill="none" stroke="var(--lead)" strokeWidth="1" />
        <path d="M 206 56 C 198 54 192 58 184 56 M 202 60 C 196 58 190 62 184 60" fill="none" stroke="rgba(185,106,153,0.6)" strokeWidth="1" />
        <text x="230" y="74" textAnchor="middle" fontSize="8" fill="var(--muted)" style={{ fontFamily: "var(--font-mono)" }}>
          UNDER POWER · METER RUNS
        </text>
      </g>
    </svg>
  );
}

export function Watch() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveals(rootRef);
  return (
    <div ref={rootRef} className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="mono-label">The Watch · monthly</div>
          <h1 className="mt-3 text-3xl sm:text-4xl">{watchHeader}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-(--muted)">{watchLede}</p>
        </div>
        {/* the scope is the service, drawn */}
        <RadarScope />
      </div>

      {/* the shelf, then each plan at full depth */}
      <div className="mt-10 grid gap-3 sm:grid-cols-3" data-reveal>
        {watchPlans.map((plan) => (
          <a key={plan.id} href={`#plan-${plan.id}`} className="shelf-tile">
            <span className="flex items-baseline justify-between gap-2">
              <span className="font-semibold tracking-tight">{plan.name}</span>
              <Price value={plan.price} per={plan.per} />
            </span>
            <span className="mono-label mt-1.5 block">{plan.tagline}</span>
          </a>
        ))}
      </div>

      <div className="mt-6">
        {watchPlans.map((plan, i) => (
          <PlanRow key={plan.id} plan={plan} index={i} />
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-(--muted)">
        {noContractLine}
      </p>

      {/* The Channel — the engine panel */}
      <section aria-label="The Channel" data-reveal className="panel mt-16 border-(--lead)/25 p-7 sm:p-9">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <div className="mono-label text-(--lead)!">Fuel gauge · runs only while you run it</div>
            <h2 className="mt-2 text-2xl tracking-tight">{channel.name}</h2>
          </div>
          <div className="mono text-right text-sm text-(--muted)">
            <Price value={channel.management} per={channel.managementPer} />
            <div className="mt-1">
              {SHOW_PRICING ? channel.floor : "spend floor applies — let's talk"}
            </div>
          </div>
        </div>
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="max-w-2xl leading-relaxed text-(--ink)">{channel.copy}</p>
            <p className="mono mt-5 max-w-2xl text-[0.8125rem] leading-relaxed text-(--muted)">
              {channel.arithmetic}
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-(--muted) italic">
              {channel.aside}
            </p>
          </div>
          <SailVsPower />
        </div>
      </section>
    </div>
  );
}
