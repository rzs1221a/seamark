import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PackCard } from "./PackCard";

/**
 * The Passage — a looping ~12s SVG demonstration of one lead's journey:
 * FOUND (the beam finds the vessel) → LANDED (the site, forms filling) →
 * CAPTURED (the payload lands in BoldTrail).
 *
 * One rAF loop, no libraries. The initial render is the *completed* scene —
 * everything lit, vessel docked — which is exactly the designed static state
 * for prerendered HTML and for prefers-reduced-motion. Animation only starts
 * on the client, after first paint, on wide viewports, when motion is allowed.
 */

const QUERY = "sell my house amelia island";
const LOOP = 12.05; // seconds
const STATIC_T = 9.7; // the completed scene

// timeline stations
const TYPE_START = 0.2;
const TYPE_END = 2.0;
const FOUND_T = 2.9;
const TRAVEL_START = 3.6;
const TRAVEL_END = 6.6;
const LANDED_T = 6.6;
const CAPTURE_START = 8.0;
const PULSE_END = 8.7;
const COMPLETE_T = 9.6;
const FADE_START = 11.55;

// lighthouse + geometry (viewBox 1200 × 560)
const LH = { x: 905, y: 160 };
const VESSEL_START = { x: 110, y: 340 };
const BEARING_TO_VESSEL =
  (Math.atan2(VESSEL_START.y - LH.y, VESSEL_START.x - LH.x) * 180) / Math.PI;
const BEAM_PERIOD = 6; // seconds per revolution
const COURSE_D = "M 110 340 C 300 295, 520 385, 690 362 C 780 350, 845 344, 868 352";
const CAPTURE_D = "M 880 348 C 960 320, 1030 220, 1148 138";
const DOCKED = { x: 868, y: 352, angle: 8 };
const STATIC_BEAM_ANGLE = BEARING_TO_VESSEL; // fixed lit sector across the water

const TERMINAL_LINES: Array<{ key: string; val: string; at: number }> = [
  { key: "SUBJ", val: "Add Contact", at: 8.7 },
  { key: "name", val: "M. Carter", at: 8.95 },
  { key: "deal", val: "Sell · 32034", at: 9.2 },
];
const ROW_AT = 9.45;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function typed(text: string, t: number, start: number, end: number) {
  return text.slice(0, Math.floor(clamp01((t - start) / (end - start)) * text.length));
}

const SOUNDINGS: Array<[number, number, string]> = [
  [180, 150, "18"],
  [320, 90, "22"],
  [90, 470, "15"],
  [420, 250, "12"],
  [560, 140, "17"],
  [640, 460, "9"],
  [310, 420, "11"],
  [740, 250, "7"],
  [520, 500, "14"],
  [820, 470, "5"],
];

function useMediaFlag(query: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setOn(mq.matches);
    const cb = (e: MediaQueryListEvent) => setOn(e.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, [query]);
  return on;
}

function StationChip({ label, lit }: { label: string; lit: boolean }) {
  return (
    <span className={`station-chip ${lit ? "lit" : ""}`}>
      <span className="dot" aria-hidden="true" />
      {label}
    </span>
  );
}

function SearchCard({ text, caret }: { text: string; caret: boolean }) {
  return (
    <div className="scene-card p-3" style={{ width: "min(300px, 26vw)" }}>
      <div className="flex items-center gap-2 rounded-full border border-(--hairline-faint) bg-(--bg)/80 px-3 py-1.5">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-(--muted)" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="mono truncate text-xs text-(--ink)">
          {text}
          {caret && <span className="search-caret" aria-hidden="true" />}
        </span>
      </div>
    </div>
  );
}

function SiteCard({ bars }: { bars: [number, number, number] }) {
  const targets = [86, 64, 76];
  return (
    <div className="scene-card p-3" style={{ width: "min(230px, 20vw)" }}>
      <div className="flex items-center justify-between">
        <span className="tag">YOUR SITE</span>
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-(--muted)/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--muted)/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-(--muted)/40" />
        </span>
      </div>
      <div className="mt-2 h-1.5 w-3/5 rounded bg-(--signal)/60" aria-hidden="true" />
      <div className="mt-1 h-1 w-2/5 rounded bg-(--muted)/30" aria-hidden="true" />
      <div className="mt-3 space-y-1.5" aria-hidden="true">
        {bars.map((p, i) => (
          <div key={i} className="form-bar">
            <span style={{ width: `${p * targets[i]}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function TerminalCard({ t }: { t: number }) {
  return (
    <div className="scene-card p-3" style={{ width: "min(295px, 25vw)" }}>
      <div className="flex items-center justify-between border-b border-(--hairline-faint) pb-2">
        <span className="tag tag-lead">YOUR CRM</span>
        <span className="mono text-[0.5625rem] text-(--muted)">BoldTrail — Lead Dropbox</span>
      </div>
      <div className="terminal mt-2 min-h-24">
        {TERMINAL_LINES.map(
          (line) =>
            t >= line.at && (
              <div key={line.key}>
                <span className="t-key">{line.key.padEnd(5, " ")}</span>
                <span className="t-val">{typed(line.val, t, line.at, line.at + 0.2)}</span>
              </div>
            ),
        )}
        {t >= ROW_AT && <div className="t-row mt-1.5">M. Carter — NEW LEAD</div>}
      </div>
    </div>
  );
}

function ChartKey() {
  return (
    <div className="scene-card flex items-center gap-4 px-3 py-2">
      <span className="mono flex items-center gap-1.5 text-[0.625rem] text-(--muted)">
        <span className="h-2 w-2 bg-(--signal)" aria-hidden="true" /> What you own
      </span>
      <span className="mono flex items-center gap-1.5 text-[0.625rem] text-(--muted)">
        <span className="h-2 w-2 bg-(--lead)" aria-hidden="true" /> The lead, underway
      </span>
    </div>
  );
}

function DesktopScene({
  t,
  animating,
  onReplay,
}: {
  t: number;
  animating: boolean;
  onReplay: () => void;
}) {
  const coursePathRef = useRef<SVGPathElement>(null);
  const capturePathRef = useRef<SVGPathElement>(null);

  const searchText = typed(QUERY, t, TYPE_START, TYPE_END);
  const found = t >= FOUND_T;
  const landed = t >= LANDED_T;
  const captured = t >= COMPLETE_T;
  const travelProg = easeInOut(clamp01((t - TRAVEL_START) / (TRAVEL_END - TRAVEL_START)));
  const bars: [number, number, number] = [
    clamp01((t - 6.8) / 0.35),
    clamp01((t - 7.2) / 0.35),
    clamp01((t - 7.6) / 0.35),
  ];
  const pulseProg = t >= CAPTURE_START && t < PULSE_END ? (t - CAPTURE_START) / (PULSE_END - CAPTURE_START) : null;
  const beamAngle = animating
    ? BEARING_TO_VESSEL + ((t - FOUND_T) / BEAM_PERIOD) * 360
    : STATIC_BEAM_ANGLE;
  const fade = t >= FADE_START ? 1 - clamp01((t - FADE_START) / 0.5) : 1;

  // vessel position along the course (docked when the passage is complete)
  let vessel = DOCKED;
  let travelLen: { drawn: number; total: number } | null = null;
  const path = coursePathRef.current;
  if (animating && path && travelProg < 1) {
    const total = path.getTotalLength();
    const at = Math.max(1, total * travelProg);
    const p = path.getPointAtLength(at);
    const back = path.getPointAtLength(Math.max(0, at - 2));
    vessel = {
      x: p.x,
      y: p.y,
      angle: (Math.atan2(p.y - back.y, p.x - back.x) * 180) / Math.PI,
    };
    travelLen = { drawn: total * travelProg, total };
  }

  let pulse: { x: number; y: number } | null = null;
  const cap = capturePathRef.current;
  if (animating && cap && pulseProg !== null) {
    const p = cap.getPointAtLength(cap.getTotalLength() * pulseProg);
    pulse = { x: p.x, y: p.y };
  }

  const wake: Array<{ x: number; y: number; o: number }> = [];
  if (animating && path && travelProg > 0.02 && travelProg < 1) {
    const total = path.getTotalLength();
    for (let i = 1; i <= 5; i++) {
      const at = total * (travelProg - i * 0.022);
      if (at <= 0) break;
      const p = path.getPointAtLength(at);
      wake.push({ x: p.x, y: p.y, o: 0.55 * (1 - i / 6) });
    }
  }

  return (
    <div
      className="passage-desktop relative"
      style={{ opacity: fade }}
      data-passage-complete={captured ? "true" : "false"}
    >
      <div className="relative mx-auto aspect-[1200/560] max-h-[76vh] w-full max-w-[1400px]">
        <svg
          viewBox="0 0 1200 560"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <pattern id="chartGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(34,211,238,0.05)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(34,211,238,0.34)" />
              <stop offset="1" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
          </defs>

          <rect width="1200" height="560" fill="url(#chartGrid)" />

          {/* depth soundings — chart furniture, ≤8% */}
          {SOUNDINGS.map(([x, y, n]) => (
            <text
              key={`${x}-${y}`}
              x={x}
              y={y}
              fontSize="11"
              fill="rgba(142,160,170,0.5)"
              opacity="0.12"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {n}
            </text>
          ))}

          {/* the shore */}
          <path
            d="M 900 0 C 878 62 866 118 882 178 C 900 248 876 328 890 380 C 902 428 942 468 982 560 L 1200 560 L 1200 0 Z"
            fill="var(--land)"
          />
          <path
            d="M 900 0 C 878 62 866 118 882 178 C 900 248 876 328 890 380 C 902 428 942 468 982 560"
            fill="none"
            stroke="rgba(34,211,238,0.28)"
            strokeWidth="1"
          />

          {/* the beam, under everything that travels */}
          <g transform={`rotate(${beamAngle} ${LH.x} ${LH.y})`}>
            <path
              d={`M ${LH.x} ${LH.y} L ${LH.x + 920} ${LH.y - 62} L ${LH.x + 920} ${LH.y + 62} Z`}
              fill="url(#beamGrad)"
            />
          </g>

          {/* the lighthouse — the agent's beacon */}
          <g>
            <line x1={LH.x} y1={LH.y + 26} x2={LH.x} y2={LH.y} stroke="var(--signal)" strokeWidth="2.5" />
            <path
              d={`M ${LH.x - 8} ${LH.y + 26} L ${LH.x + 8} ${LH.y + 26}`}
              stroke="var(--signal)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx={LH.x} cy={LH.y - 4} r="4.5" fill="var(--signal)" />
            <circle cx={LH.x} cy={LH.y - 4} r="10" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
          </g>

          {/* plotted course — the passage plan */}
          <path
            d={COURSE_D}
            fill="none"
            stroke="rgba(142,160,170,0.4)"
            strokeWidth="1"
            strokeDasharray="5 6"
          />
          {/* traveled portion, drawing in amber behind the vessel */}
          <path
            ref={coursePathRef}
            d={COURSE_D}
            fill="none"
            stroke="var(--lead)"
            strokeWidth="1.5"
            opacity={travelProg > 0 ? 0.85 : 0}
            strokeDasharray={travelLen ? `${travelLen.drawn} ${travelLen.total}` : undefined}
          />

          {/* pier */}
          <g stroke="rgba(34,211,238,0.7)" strokeWidth="2" strokeLinecap="round">
            <line x1="870" y1="346" x2="892" y2="338" />
            <line x1="874" y1="356" x2="896" y2="350" />
          </g>

          {/* capture line ashore */}
          <path
            ref={capturePathRef}
            d={CAPTURE_D}
            fill="none"
            stroke={captured ? "var(--lead)" : "rgba(142,160,170,0.4)"}
            strokeWidth="1"
            strokeDasharray="4 5"
            opacity={captured ? 0.9 : 0.7}
          />
          {pulse && <circle cx={pulse.x} cy={pulse.y} r="3.5" fill="var(--lead)" />}

          {/* wake */}
          {wake.map((w, i) => (
            <circle key={i} cx={w.x} cy={w.y} r="1.6" fill="var(--lead)" opacity={w.o} />
          ))}

          {/* the vessel — the lead, underway */}
          <g transform={`translate(${vessel.x} ${vessel.y}) rotate(${vessel.angle})`}>
            {found && t < TRAVEL_START + 0.6 && (
              <circle r="14" fill="none" stroke="var(--lead)" strokeWidth="1" opacity="0.6" />
            )}
            <path d="M 8 0 L -6 -4.5 L -3.5 0 L -6 4.5 Z" fill="var(--lead)" />
          </g>
        </svg>

        {/* instrument cards over the chart */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[6%] left-[3%]">
            <SearchCard text={searchText} caret={animating && t < TYPE_END + 0.4} />
            <div
              className="mt-2 transition-all duration-500"
              style={{
                opacity: found ? 1 : 0,
                transform: found ? "translateY(0)" : "translateY(-8px)",
              }}
            >
              <div style={{ width: "min(300px, 26vw)" }}>
                <PackCard compact />
              </div>
            </div>
          </div>

          <div
            className="absolute top-[57%] left-[54%] transition-shadow duration-500"
            style={{
              filter: landed ? "drop-shadow(0 0 18px rgba(34,211,238,0.35))" : "none",
            }}
          >
            <SiteCard bars={bars} />
          </div>

          <div className="absolute top-[5%] right-[2%]">
            <TerminalCard t={t} />
          </div>

          {/* station chips along the route */}
          <div className="absolute top-[68%] left-[17%]">
            <StationChip label="FOUND" lit={found} />
          </div>
          <div className="absolute top-[73%] left-[62%]">
            <StationChip label="LANDED" lit={landed} />
          </div>
          <div className="absolute top-[42%] right-[3%]">
            <StationChip label="CAPTURED" lit={captured} />
          </div>

          <div className="pointer-events-auto absolute right-[2%] bottom-[4%] flex items-center gap-2">
            <ChartKey />
            <button
              type="button"
              onClick={onReplay}
              className="scene-card mono px-3 py-2 text-[0.625rem] text-(--muted) transition-colors hover:text-(--signal)"
              aria-label="Replay the passage"
            >
              ↻ REPLAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileConnector() {
  return (
    <div className="flex justify-center py-1" aria-hidden="true">
      <svg viewBox="0 0 8 40" className="h-10 w-2">
        <line
          x1="4"
          y1="0"
          x2="4"
          y2="32"
          stroke="var(--lead)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          opacity="0.8"
        />
        <path d="M 4 40 L 0.5 32 L 7.5 32 Z" fill="var(--lead)" opacity="0.8" />
      </svg>
    </div>
  );
}

/** ≤820px: the passage rotates vertical — the completed diagram, fully lit. */
function MobileScene() {
  return (
    <div className="passage-mobile px-4 pt-6" data-passage-complete="true">
      <div className="mx-auto max-w-90">
        <div className="[&>div]:w-full!">
          <SearchCard text={QUERY} caret={false} />
        </div>
        <MobileConnector />
        <div className="mb-2">
          <StationChip label="FOUND" lit />
        </div>
        <PackCard compact />
        <MobileConnector />
        <div className="mb-2">
          <StationChip label="LANDED" lit />
        </div>
        <div className="[&>div]:w-full!">
          <SiteCard bars={[1, 1, 1]} />
        </div>
        <MobileConnector />
        <div className="mb-2">
          <StationChip label="CAPTURED" lit />
        </div>
        <div className="[&>div]:w-full!">
          <TerminalCard t={STATIC_T} />
        </div>
        <div className="mt-4">
          <ChartKey />
        </div>
      </div>
    </div>
  );
}

export function PassageHero() {
  const [t, setT] = useState(STATIC_T);
  const [animating, setAnimating] = useState(false);
  const startRef = useRef(0);
  const reduced = useMediaFlag("(prefers-reduced-motion: reduce)");
  const wide = useMediaFlag("(min-width: 821px)");

  useEffect(() => {
    if (reduced || !wide) {
      setAnimating(false);
      setT(STATIC_T);
      return;
    }
    setAnimating(true);
    startRef.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      setT(((now - startRef.current) / 1000) % LOOP);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, wide]);

  return (
    <section className="passage-hero" aria-label="The passage — how a lead travels from a Google search to your CRM">
      <DesktopScene
        t={t}
        animating={animating}
        onReplay={() => {
          startRef.current = performance.now();
        }}
      />
      <MobileScene />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 md:-mt-36 md:pt-0">
        <div className="max-w-xl">
          <h1 className="text-4xl leading-tight tracking-tight sm:text-5xl">
            Get found. Get the lead.{" "}
            <span className="text-(--signal)">Own the whole route.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-(--muted) sm:text-lg">
            This is the passage every client travels — from a search box to your CRM. I build
            all of it, in your name, and it comes with you if you ever leave.
          </p>
          <div className="mt-6">
            <Link to="/contact" className="btn-cta" data-cta="hero">
              Twenty minutes, and you&rsquo;ll know
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
