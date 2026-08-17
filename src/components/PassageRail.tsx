import { useEffect, useState } from "react";

/**
 * The passage plan of the page itself: a fixed rail of station dots down the
 * right edge of the homepage, lighting as each band crosses the viewport.
 * The page reads as a route; the rail is its chart. Wide screens only.
 */
const SECTIONS = [
  { frame: "/", label: "Passage" },
  { frame: "home-route", label: "Route" },
  { frame: "home-proof", label: "Proof" },
  { frame: "home-build", label: "Build" },
  { frame: "home-watch", label: "Watch" },
  { frame: "home-costs", label: "Costs" },
  { frame: "home-process", label: "Process" },
  { frame: "home-questions", label: "Answers" },
  { frame: "home-contract", label: "Contract" },
];

export function PassageRail() {
  const [active, setActive] = useState<string>("/");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = SECTIONS.map((s) =>
      document.querySelector<HTMLElement>(`[data-frame="${s.frame}"]`),
    ).filter((el): el is HTMLElement => Boolean(el));
    const ratios = new Map<HTMLElement, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target as HTMLElement, entry.intersectionRatio);
        let best: HTMLElement | null = null;
        let bestRatio = 0;
        for (const [el, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = el;
          }
        }
        if (best?.dataset.frame) setActive(best.dataset.frame);
      },
      { threshold: [0, 0.25, 0.5, 0.75] },
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Page sections" className="passage-rail" data-reveal-exempt>
      {SECTIONS.map((s) => (
        <button
          key={s.frame}
          type="button"
          className={`rail-stop ${active === s.frame ? "is-active" : ""}`}
          onClick={() =>
            document
              .querySelector(`[data-frame="${s.frame}"]`)
              ?.scrollIntoView({ block: "start" })
          }
        >
          <span className="rail-label mono">{s.label}</span>
          <span className="rail-dot" aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
