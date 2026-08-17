import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { PackCard } from "./PackCard";
import {
  FRAMES,
  AMELIA_LIGHTHOUSE,
  FERNANDINA_MARINA,
  getMapInstance,
  onMapReady,
  markFlying,
} from "../lib/cameraFrames";

/**
 * The Passage — a looping ~12s demonstration of one lead's journey:
 * FOUND (the beam finds the vessel) → LANDED (the site, forms filling) →
 * CAPTURED (the payload lands in BoldTrail).
 *
 * Two stagings of one performance:
 *
 * — GeoScene: the course is authored in lng/lat along the REAL approach and
 *   projected through the live camera. It is fully imperative: one rAF loop
 *   writes SVG attributes and transforms directly, React renders the skeleton
 *   exactly once, and there are no SVG filters — softness comes from stacked
 *   gradient strokes. Sixty frames a second cost the main thread almost
 *   nothing.
 *
 * — DrawnScene: the self-contained chart for fallback (no map, no WebGL,
 *   engine still loading). React-driven; it is rarely on screen long.
 *
 * Reduced motion gets the completed scene, vessel docked, everything lit.
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

const BEAM_PERIOD = 6; // seconds per revolution

const TERMINAL_LINES: Array<{ key: string; val: string; at: number }> = [
  { key: "SUBJ", val: "Add Contact", at: 8.7 },
  { key: "name", val: "M. Carter", at: 8.95 },
  { key: "deal", val: "Sell · 32034", at: 9.2 },
];
const ROW_AT = 9.45;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function typed(text: string, t: number, start: number, end: number) {
  return text.slice(0, Math.floor(clamp01((t - start) / (end - start)) * text.length));
}

/** The real approach: open Atlantic → the St. Marys entrance → the river →
 *  the Fernandina Harbor Marina. */
const COURSE_GEO: Array<[number, number]> = [
  [-81.318, 30.692],
  [-81.362, 30.704],
  [-81.402, 30.708],
  [-81.433, 30.7],
  [-81.452, 30.689],
  [-81.4618, 30.6785],
  [-81.4655, 30.6705],
];
const MARINA = FERNANDINA_MARINA;

interface Pt {
  x: number;
  y: number;
}

/** Catmull-Rom through the projected waypoints, emitted as cubic beziers. */
function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

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

/* ── shared instrument cards ─────────────────────────────────────────────── */

function StationChip({ label, lit = true }: { label: string; lit?: boolean }) {
  return (
    <span className={`station-chip ${lit ? "lit" : ""}`}>
      <span className="dot" aria-hidden="true" />
      {label}
    </span>
  );
}

function SiteCardShell({
  fluid = false,
  barRefs,
  bars,
}: {
  fluid?: boolean;
  barRefs?: RefObject<Array<HTMLSpanElement | null>>;
  bars?: [number, number, number];
}) {
  const targets = [86, 64, 76];
  return (
    <div className="scene-card p-3" style={{ width: fluid ? "100%" : "min(225px, 19vw)" }}>
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
        {targets.map((target, i) => (
          <div key={i} className="form-bar">
            <span
              ref={barRefs ? (el) => void (barRefs.current[i] = el) : undefined}
              style={{ width: `${(bars ? bars[i] : 1) * target}%` }}
            />
          </div>
        ))}
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

/* ── the geo scene: imperative, filter-free, sixty smooth frames ────────── */

function GeoScene({ active }: { active: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // svg geometry
  const plotRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const hotRef = useRef<SVGPathElement>(null);
  const beamRef = useRef<SVGGElement>(null);
  const lampRef = useRef<SVGGElement>(null);
  const vesselRef = useRef<SVGGElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const wakeRefs = useRef<Array<SVGCircleElement | null>>([]);
  const captureRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  // instruments
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const searchTextRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const packRef = useRef<HTMLDivElement>(null);
  const siteWrapRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const termWrapRef = useRef<HTMLDivElement>(null);
  const termLineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const termValRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const termRowRef = useRef<HTMLDivElement>(null);
  const chipFoundRef = useRef<HTMLDivElement>(null);
  const chipLandedRef = useRef<HTMLDivElement>(null);
  const chipCapturedRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const root = rootRef.current;
    if (!box || !root) return;

    let raf = 0;
    let start = performance.now();
    let pushed = false;
    let size = { w: box.clientWidth, h: box.clientHeight };

    const ro = new ResizeObserver(() => {
      size = { w: box.clientWidth, h: box.clientHeight };
      if (!active) write(STATIC_T);
    });
    ro.observe(box);

    const setChip = (el: HTMLDivElement | null, lit: boolean, x?: number, y?: number) => {
      if (!el) return;
      if (x !== undefined) el.style.transform = `translate(${x.toFixed(1)}px, ${y!.toFixed(1)}px)`;
      el.firstElementChild?.classList.toggle("lit", lit);
    };

    /** One frame of the performance, written straight to the DOM. */
    const write = (t: number) => {
      const map = getMapInstance();
      const { w, h } = size;
      if (!map || w === 0) return;

      const pts = COURSE_GEO.map((c) => map.project(c));
      const lh = map.project(AMELIA_LIGHTHOUSE);
      const marina = map.project(MARINA);
      const courseD = smoothPath(pts);

      const found = t >= FOUND_T;
      const landed = t >= LANDED_T;
      const captured = t >= COMPLETE_T;
      const travelProg = easeInOut(clamp01((t - TRAVEL_START) / (TRAVEL_END - TRAVEL_START)));

      root.style.opacity = String(t >= FADE_START ? 1 - clamp01((t - FADE_START) / 0.5) : 1);
      root.dataset.passageComplete = captured ? "true" : "false";

      // ——— course ———
      const plot = plotRef.current;
      const glow = glowRef.current;
      const hot = hotRef.current;
      if (plot) plot.setAttribute("d", courseD);
      for (const el of [glow, hot]) {
        if (!el) continue;
        el.setAttribute("d", courseD);
        el.setAttribute("opacity", travelProg > 0 ? (el === hot ? "0.9" : "0.24") : "0");
        if (travelProg < 1) el.setAttribute("stroke-dasharray", `${travelProg} 1`);
        else el.removeAttribute("stroke-dasharray");
      }

      // ——— vessel + wake ———
      let vx = marina.x;
      let vy = marina.y;
      let vang =
        (Math.atan2(marina.y - pts[pts.length - 2].y, marina.x - pts[pts.length - 2].x) * 180) /
        Math.PI;
      const path = hotRef.current;
      if (path && travelProg < 1) {
        try {
          const total = path.getTotalLength();
          const at = Math.max(1, total * travelProg);
          const p = path.getPointAtLength(at);
          const back = path.getPointAtLength(Math.max(0, at - 2));
          vx = p.x;
          vy = p.y;
          vang = (Math.atan2(p.y - back.y, p.x - back.x) * 180) / Math.PI;
          for (let i = 0; i < 5; i++) {
            const dot = wakeRefs.current[i];
            if (!dot) continue;
            const behind = total * (travelProg - (i + 1) * 0.022);
            if (behind <= 0 || travelProg <= 0.02) {
              dot.setAttribute("opacity", "0");
              continue;
            }
            const wp = path.getPointAtLength(behind);
            dot.setAttribute("cx", wp.x.toFixed(1));
            dot.setAttribute("cy", wp.y.toFixed(1));
            dot.setAttribute("opacity", String(0.5 * (1 - (i + 1) / 6)));
          }
        } catch {
          /* path not measurable this frame */
        }
      } else {
        for (const dot of wakeRefs.current) dot?.setAttribute("opacity", "0");
      }
      vesselRef.current?.setAttribute(
        "transform",
        `translate(${vx.toFixed(1)} ${vy.toFixed(1)}) rotate(${vang.toFixed(1)})`,
      );
      ringRef.current?.setAttribute(
        "opacity",
        found && t < TRAVEL_START + 0.6 ? String(0.6 * (1 - (t - FOUND_T) / 1.3)) : "0",
      );

      // ——— the beam, from the real Light ———
      const bearing = (Math.atan2(vy - lh.y, vx - lh.x) * 180) / Math.PI;
      const angle = active ? bearing + ((t - FOUND_T) / BEAM_PERIOD) * 360 : bearing;
      beamRef.current?.setAttribute("transform", `rotate(${angle.toFixed(2)} ${lh.x.toFixed(1)} ${lh.y.toFixed(1)})`);
      beamRef.current?.querySelectorAll("path").forEach((p, i) => {
        const len = Math.max(w, h);
        const half = len * (i === 0 ? 0.1 : 0.05);
        p.setAttribute(
          "d",
          `M ${lh.x.toFixed(1)} ${lh.y.toFixed(1)} L ${(lh.x + len).toFixed(1)} ${(lh.y - half).toFixed(1)} L ${(lh.x + len).toFixed(1)} ${(lh.y + half).toFixed(1)} Z`,
        );
      });
      lampRef.current?.setAttribute("transform", `translate(${lh.x.toFixed(1)} ${lh.y.toFixed(1)})`);

      // ——— capture line + pulse ———
      const termAnchor = { x: w - Math.min(330, w * 0.23), y: h * 0.24 };
      const c1 = { x: marina.x + 80, y: marina.y - 90 };
      const c2 = { x: termAnchor.x - 160, y: termAnchor.y + 120 };
      captureRef.current?.setAttribute(
        "d",
        `M ${marina.x.toFixed(1)} ${marina.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${termAnchor.x.toFixed(1)} ${termAnchor.y.toFixed(1)}`,
      );
      captureRef.current?.setAttribute("stroke", captured ? "var(--lead)" : "rgba(232,237,240,0.45)");
      const pulse = pulseRef.current;
      if (pulse) {
        if (t >= CAPTURE_START && t < PULSE_END) {
          const s = (t - CAPTURE_START) / (PULSE_END - CAPTURE_START);
          const u = 1 - s;
          const px =
            u * u * u * marina.x + 3 * u * u * s * c1.x + 3 * u * s * s * c2.x + s * s * s * termAnchor.x;
          const py =
            u * u * u * marina.y + 3 * u * u * s * c1.y + 3 * u * s * s * c2.y + s * s * s * termAnchor.y;
          pulse.setAttribute("cx", px.toFixed(1));
          pulse.setAttribute("cy", py.toFixed(1));
          pulse.setAttribute("opacity", "1");
        } else {
          pulse.setAttribute("opacity", "0");
        }
      }

      // ——— instruments, clustered with their stations ———
      const search = searchWrapRef.current;
      if (search) {
        const sx = clamp(pts[1].x - 480, 16, w * 0.42);
        const sy = clamp(pts[1].y - 40, 76, h * 0.42);
        search.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
      }
      const st = typed(QUERY, t, TYPE_START, TYPE_END);
      if (searchTextRef.current && searchTextRef.current.textContent !== st) {
        searchTextRef.current.textContent = st;
      }
      if (caretRef.current) {
        caretRef.current.style.display = active && t < TYPE_END + 0.4 ? "inline-block" : "none";
      }
      const pack = packRef.current;
      if (pack) {
        pack.style.opacity = found ? "1" : "0";
        pack.style.transform = found ? "translateY(0)" : "translateY(-8px)";
      }

      const site = siteWrapRef.current;
      if (site) {
        const sx = clamp(marina.x + 30, 16, w - 260);
        const sy = clamp(marina.y - 36, 0, h - 150);
        site.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`;
        site.style.filter = landed ? "drop-shadow(0 0 18px rgba(240,244,246,0.35))" : "none";
      }
      const barT = [clamp01((t - 6.8) / 0.35), clamp01((t - 7.2) / 0.35), clamp01((t - 7.6) / 0.35)];
      const targets = [86, 64, 76];
      barRefs.current.forEach((bar, i) => {
        if (bar) bar.style.width = `${(barT[i] * targets[i]).toFixed(1)}%`;
      });

      const term = termWrapRef.current;
      if (term) {
        term.style.transform = `translate(${clamp(termAnchor.x - 24, 16, w - 320).toFixed(1)}px, ${(
          termAnchor.y - 118
        ).toFixed(1)}px)`;
      }
      TERMINAL_LINES.forEach((line, i) => {
        const el = termLineRefs.current[i];
        const val = termValRefs.current[i];
        if (!el || !val) return;
        const on = t >= line.at;
        el.style.display = on ? "block" : "none";
        const slice = typed(line.val, t, line.at, line.at + 0.2);
        if (val.textContent !== slice) val.textContent = slice;
      });
      if (termRowRef.current) termRowRef.current.style.display = t >= ROW_AT ? "block" : "none";

      setChip(chipFoundRef.current, found, pts[1].x - 96, pts[1].y + 18);
      setChip(chipLandedRef.current, landed, clamp(marina.x - 30, 16, w - 130), marina.y + 34);
      setChip(chipCapturedRef.current, captured, termAnchor.x - 140, termAnchor.y + 30);

      // ——— the camera leans in while the vessel runs ———
      if (active) {
        const inTravel = t >= TRAVEL_START && t < COMPLETE_T;
        const base = FRAMES["/"].zoom;
        if (inTravel && !pushed) {
          pushed = true;
          markFlying(3200);
          map.easeTo({ zoom: base + 0.16, duration: 3200, easing: (p) => 1 - Math.pow(1 - p, 4) });
        } else if (!inTravel && t < TRAVEL_START && pushed) {
          pushed = false;
          markFlying(2400);
          map.easeTo({ zoom: base, duration: 2400, easing: (p) => 1 - Math.pow(1 - p, 4) });
        }
      }
    };

    (root as HTMLDivElement & { __replay?: () => void }).__replay = () => {
      start = performance.now();
    };

    if (active) {
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        write(((now - start) / 1000) % LOOP);
      };
      raf = requestAnimationFrame(tick);
    } else {
      // The completed scene, re-projected whenever the camera settles.
      write(STATIC_T);
      const map = getMapInstance();
      const bump = () => write(STATIC_T);
      map?.on("moveend", bump);
      return () => {
        ro.disconnect();
        map?.off("moveend", bump);
      };
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [active]);

  const replay = () => {
    (rootRef.current as (HTMLDivElement & { __replay?: () => void }) | null)?.__replay?.();
  };

  return (
    <div ref={rootRef} data-passage-complete="true">
      <div ref={boxRef} className="relative h-[78vh] min-h-130">
        <svg width="100%" height="100%" className="absolute inset-0" aria-hidden="true">
          <defs>
            <linearGradient id="geoBeam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(240,244,246,0.3)" />
              <stop offset="1" stopColor="rgba(240,244,246,0)" />
            </linearGradient>
            <linearGradient id="geoBeamSoft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(240,244,246,0.12)" />
              <stop offset="1" stopColor="rgba(240,244,246,0)" />
            </linearGradient>
            <radialGradient id="vesselGlow">
              <stop offset="0" stopColor="rgba(185,106,153,0.5)" />
              <stop offset="1" stopColor="rgba(185,106,153,0)" />
            </radialGradient>
          </defs>

          {/* the beam: two stacked gradient wedges — soft edges, no filters */}
          <g ref={beamRef}>
            <path fill="url(#geoBeamSoft)" />
            <path fill="url(#geoBeam)" />
          </g>

          {/* the Light itself — Fl rhythm, luminance not strobe */}
          <g ref={lampRef}>
            <circle r="4.5" fill="var(--signal)" className="sig-fl-6s beacon-core" />
            <circle r="11" fill="none" stroke="rgba(240,244,246,0.45)" strokeWidth="1" />
            <circle r="20" fill="none" stroke="rgba(240,244,246,0.2)" strokeWidth="1" className="breathe" />
          </g>

          {/* plotted course + traveled amber (double-stroke glow, no filter) */}
          <path ref={plotRef} fill="none" stroke="rgba(232,237,240,0.5)" strokeWidth="1" strokeDasharray="5 7" />
          <path ref={glowRef} fill="none" stroke="var(--lead)" strokeWidth="6" strokeLinecap="round" pathLength={1} />
          <path ref={hotRef} fill="none" stroke="var(--lead)" strokeWidth="1.5" pathLength={1} />

          {/* capture line ashore + pulse */}
          <path ref={captureRef} fill="none" strokeWidth="1" strokeDasharray="4 6" opacity="0.8" />
          <g>
            <circle ref={pulseRef} r="3.5" fill="var(--lead)" opacity="0" />
          </g>

          {/* wake */}
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} ref={(el) => void (wakeRefs.current[i] = el)} r="1.8" fill="var(--lead)" opacity="0" />
          ))}

          {/* the vessel — the lead, underway */}
          <g ref={vesselRef}>
            <circle ref={ringRef} r="15" fill="none" stroke="var(--lead)" strokeWidth="1" opacity="0" />
            <circle r="9" fill="url(#vesselGlow)" />
            <path d="M 9 0 L -7 -5 L -4 0 L -7 5 Z" fill="var(--lead)" />
          </g>
        </svg>

        {/* instruments, each anchored to its station */}
        <div className="pointer-events-none absolute inset-0">
          <div ref={searchWrapRef} className="absolute top-0 left-0 will-change-transform">
            <div style={{ width: "min(300px, 26vw)" }}>
              <div className="scene-card p-3">
                <div className="flex items-center gap-2 rounded-full border border-(--hairline-faint) bg-(--bg)/80 px-3 py-1.5">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-(--muted)" aria-hidden="true">
                    <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
                    <line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="mono truncate text-xs text-(--ink)">
                    <span ref={searchTextRef}>{QUERY}</span>
                    <span ref={caretRef} className="search-caret" style={{ display: "none" }} aria-hidden="true" />
                  </span>
                </div>
              </div>
              <div
                ref={packRef}
                className="mt-2 transition-all duration-500"
                style={{ transitionTimingFunction: "var(--ease-out-quart)" }}
              >
                <PackCard compact />
              </div>
            </div>
          </div>

          <div ref={siteWrapRef} className="absolute top-0 left-0 will-change-transform">
            <SiteCardShell barRefs={barRefs} />
          </div>

          <div ref={termWrapRef} className="absolute top-0 left-0 will-change-transform">
            <div className="scene-card p-3" style={{ width: "min(295px, 25vw)" }}>
              <div className="flex items-center justify-between border-b border-(--hairline-faint) pb-2">
                <span className="tag tag-lead">YOUR CRM</span>
                <span className="mono text-[0.5625rem] text-(--muted)">BoldTrail — Lead Dropbox</span>
              </div>
              <div className="terminal mt-2 min-h-24">
                {TERMINAL_LINES.map((line, i) => (
                  <div key={line.key} ref={(el) => void (termLineRefs.current[i] = el)}>
                    <span className="t-key">{line.key.padEnd(5, " ")}</span>
                    <span className="t-val" ref={(el) => void (termValRefs.current[i] = el)}>
                      {line.val}
                    </span>
                  </div>
                ))}
                <div ref={termRowRef} className="t-row mt-1.5">
                  M. Carter — NEW LEAD
                </div>
              </div>
            </div>
          </div>

          <div ref={chipFoundRef} className="absolute top-0 left-0 will-change-transform">
            <StationChip label="FOUND" />
          </div>
          <div ref={chipLandedRef} className="absolute top-0 left-0 will-change-transform">
            <StationChip label="LANDED" />
          </div>
          <div ref={chipCapturedRef} className="absolute top-0 left-0 will-change-transform">
            <StationChip label="CAPTURED" />
          </div>

          <div className="pointer-events-auto absolute right-[2%] bottom-[4%] flex items-center gap-2">
            <ChartKey />
            <button
              type="button"
              onClick={replay}
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

/* ── the drawn scene: self-contained fallback chart ─────────────────────── */

const LH = { x: 905, y: 160 };
const VESSEL_START = { x: 110, y: 340 };
const BEARING_TO_VESSEL =
  (Math.atan2(VESSEL_START.y - LH.y, VESSEL_START.x - LH.x) * 180) / Math.PI;
const COURSE_D = "M 110 340 C 300 295, 520 385, 690 362 C 780 350, 845 344, 868 352";
const CAPTURE_D = "M 880 348 C 960 320, 1030 220, 1148 138";
const DOCKED = { x: 868, y: 352, angle: 8 };

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

function usePhases(t: number) {
  return {
    searchText: typed(QUERY, t, TYPE_START, TYPE_END),
    found: t >= FOUND_T,
    landed: t >= LANDED_T,
    captured: t >= COMPLETE_T,
    travelProg: easeInOut(clamp01((t - TRAVEL_START) / (TRAVEL_END - TRAVEL_START))),
    bars: [
      clamp01((t - 6.8) / 0.35),
      clamp01((t - 7.2) / 0.35),
      clamp01((t - 7.6) / 0.35),
    ] as [number, number, number],
    pulseProg:
      t >= CAPTURE_START && t < PULSE_END
        ? (t - CAPTURE_START) / (PULSE_END - CAPTURE_START)
        : null,
    fade: t >= FADE_START ? 1 - clamp01((t - FADE_START) / 0.5) : 1,
  };
}

function DrawnScene({ active }: { active: boolean }) {
  const [t, setT] = useState(STATIC_T);
  const startRef = useRef(0);
  const coursePathRef = useRef<SVGPathElement>(null);
  const capturePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!active) {
      setT(STATIC_T);
      return;
    }
    startRef.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      setT(((now - startRef.current) / 1000) % LOOP);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const { searchText, found, landed, captured, travelProg, bars, pulseProg, fade } = usePhases(t);
  const animating = active;
  const beamAngle = animating
    ? BEARING_TO_VESSEL + ((t - FOUND_T) / BEAM_PERIOD) * 360
    : BEARING_TO_VESSEL;

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
      className="relative"
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
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(240,244,246,0.05)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(240,244,246,0.34)" />
              <stop offset="1" stopColor="rgba(240,244,246,0)" />
            </linearGradient>
          </defs>

          <rect width="1200" height="560" fill="url(#chartGrid)" />

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

          <path
            d="M 900 0 C 878 62 866 118 882 178 C 900 248 876 328 890 380 C 902 428 942 468 982 560 L 1200 560 L 1200 0 Z"
            fill="var(--land)"
          />
          <path
            d="M 900 0 C 878 62 866 118 882 178 C 900 248 876 328 890 380 C 902 428 942 468 982 560"
            fill="none"
            stroke="rgba(240,244,246,0.28)"
            strokeWidth="1"
          />

          <g transform={`rotate(${beamAngle} ${LH.x} ${LH.y})`}>
            <path
              d={`M ${LH.x} ${LH.y} L ${LH.x + 920} ${LH.y - 62} L ${LH.x + 920} ${LH.y + 62} Z`}
              fill="url(#beamGrad)"
            />
          </g>

          <g>
            <line x1={LH.x} y1={LH.y + 26} x2={LH.x} y2={LH.y} stroke="var(--signal)" strokeWidth="2.5" />
            <path
              d={`M ${LH.x - 8} ${LH.y + 26} L ${LH.x + 8} ${LH.y + 26}`}
              stroke="var(--signal)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx={LH.x} cy={LH.y - 4} r="4.5" fill="var(--signal)" className="sig-fl-6s beacon-core" />
            <circle cx={LH.x} cy={LH.y - 4} r="10" fill="none" stroke="rgba(240,244,246,0.4)" strokeWidth="1" />
          </g>

          <path
            d={COURSE_D}
            fill="none"
            stroke="rgba(142,160,170,0.4)"
            strokeWidth="1"
            strokeDasharray="5 6"
          />
          <path
            ref={coursePathRef}
            d={COURSE_D}
            fill="none"
            stroke="var(--lead)"
            strokeWidth="1.5"
            opacity={travelProg > 0 ? 0.85 : 0}
            strokeDasharray={travelLen ? `${travelLen.drawn} ${travelLen.total}` : undefined}
          />

          <g stroke="rgba(240,244,246,0.7)" strokeWidth="2" strokeLinecap="round">
            <line x1="870" y1="346" x2="892" y2="338" />
            <line x1="874" y1="356" x2="896" y2="350" />
          </g>

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

          {wake.map((w, i) => (
            <circle key={i} cx={w.x} cy={w.y} r="1.6" fill="var(--lead)" opacity={w.o} />
          ))}

          <g transform={`translate(${vessel.x} ${vessel.y}) rotate(${vessel.angle})`}>
            {found && t < TRAVEL_START + 0.6 && (
              <circle r="14" fill="none" stroke="var(--lead)" strokeWidth="1" opacity="0.6" />
            )}
            <path d="M 8 0 L -6 -4.5 L -3.5 0 L -6 4.5 Z" fill="var(--lead)" />
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-[6%] left-[3%]">
            <div className="scene-card p-3" style={{ width: "min(300px, 26vw)" }}>
              <div className="flex items-center gap-2 rounded-full border border-(--hairline-faint) bg-(--bg)/80 px-3 py-1.5">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-(--muted)" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
                  <line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="mono truncate text-xs text-(--ink)">
                  {searchText}
                  {animating && t < TYPE_END + 0.4 && <span className="search-caret" aria-hidden="true" />}
                </span>
              </div>
            </div>
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
              filter: landed ? "drop-shadow(0 0 18px rgba(240,244,246,0.35))" : "none",
            }}
          >
            <SiteCardShell bars={bars} />
          </div>

          <div className="absolute top-[5%] right-[2%]">
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
          </div>

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
              onClick={() => {
                startRef.current = performance.now();
              }}
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

/* ── the mobile vertical passage ────────────────────────────────────────── */

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
        <div className="scene-card p-3 w-full">
          <div className="flex items-center gap-2 rounded-full border border-(--hairline-faint) bg-(--bg)/80 px-3 py-1.5">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-(--muted)" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="mono truncate text-xs text-(--ink)">{QUERY}</span>
          </div>
        </div>
        <MobileConnector />
        <div className="mb-2">
          <StationChip label="FOUND" />
        </div>
        <PackCard compact />
        <MobileConnector />
        <div className="mb-2">
          <StationChip label="LANDED" />
        </div>
        <SiteCardShell fluid bars={[1, 1, 1]} />
        <MobileConnector />
        <div className="mb-2">
          <StationChip label="CAPTURED" />
        </div>
        <div className="scene-card w-full p-3">
          <div className="flex items-center justify-between border-b border-(--hairline-faint) pb-2">
            <span className="tag tag-lead">YOUR CRM</span>
            <span className="mono text-[0.5625rem] text-(--muted)">BoldTrail — Lead Dropbox</span>
          </div>
          <div className="terminal mt-2">
            {TERMINAL_LINES.map((line) => (
              <div key={line.key}>
                <span className="t-key">{line.key.padEnd(5, " ")}</span>
                <span className="t-val">{line.val}</span>
              </div>
            ))}
            <div className="t-row mt-1.5">M. Carter — NEW LEAD</div>
          </div>
        </div>
        <div className="mt-4">
          <ChartKey />
        </div>
      </div>
    </div>
  );
}

/* ── the hero ───────────────────────────────────────────────────────────── */

function useHeroVisible(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

export function PassageHero() {
  const [geoReady, setGeoReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useMediaFlag("(prefers-reduced-motion: reduce)");
  const wide = useMediaFlag("(min-width: 821px)");
  const visible = useHeroVisible(sectionRef);

  useEffect(() => onMapReady(() => setGeoReady(true)), []);

  const active = !reduced && wide && visible;

  return (
    <section
      ref={sectionRef}
      className="passage-hero"
      data-frame="/"
      aria-label="The passage — how a lead travels from a Google search to your CRM"
    >
      <div className="passage-desktop">
        {geoReady ? <GeoScene active={active} /> : <DrawnScene active={active} />}
      </div>
      <MobileScene />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 md:-mt-36 md:pt-0">
        <div className="hero-claim max-w-2xl">
          <h1 className="text-display">
            <span className="text-(--ink)/70">Get found. Get the lead.</span>{" "}
            <span className="text-(--signal)">Own the whole route.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-(--ink) sm:text-lg">
            This is the passage every client travels — from a search box to your CRM. I build
            all of it, in your name, and it comes with you if you ever leave.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/contact" className="btn-cta" data-cta="hero" data-magnetic>
              Twenty minutes, and you&rsquo;ll know
            </Link>
            <a href="#the-build" className="btn-quiet">
              The Build &amp; the Watch →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
