import { useEffect } from "react";

/**
 * The scrubbed film, tier 1: one IntersectionObserver per page root observes
 * every [data-reveal] inside it and adds .is-revealed once — and never removes
 * it. A page that keeps re-animating as you scroll back up is a carousel, not
 * a film.
 *
 * The pre-reveal offset lives only inside prefers-reduced-motion:
 * no-preference (styles.css), so with motion off — or without
 * IntersectionObserver at all — the base state is the final state and nothing
 * is ever hidden. Where scroll-driven animations are supported, CSS takes
 * over entirely and this class is inert.
 */
export function useReveals(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (targets.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      for (const el of targets) el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [rootRef]);
}
