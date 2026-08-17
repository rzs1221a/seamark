import { useEffect } from "react";
import { flyToKey } from "./cameraFrames";

/**
 * Binds scroll position to the camera: whichever `[data-frame]` section is the
 * dominant thing on screen flies the coast to its beat. One observer per page,
 * declarative targets, and the flight queue in cameraFrames keeps a fast
 * scroll from stacking flights.
 */
export function useSectionCamera(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>("[data-frame]"));
    if (sections.length === 0) return;

    const ratios = new Map<HTMLElement, number>();
    let active: string | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target as HTMLElement, entry.intersectionRatio);
        }
        let winner: HTMLElement | null = null;
        let best = 0;
        for (const [el, ratio] of ratios) {
          if (ratio > best) {
            best = ratio;
            winner = el;
          }
        }
        const key = winner?.dataset.frame ?? null;
        if (key && key !== active && best > 0.12) {
          active = key;
          flyToKey(key);
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8] },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [rootRef]);
}
