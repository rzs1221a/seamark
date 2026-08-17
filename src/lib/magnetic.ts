import { useEffect } from "react";

/**
 * Magnetic CTAs: one delegated pointermove listener gives every
 * [data-magnetic] element a lean toward the cursor. Fine pointers only,
 * withdrawn under reduced motion, rAF-throttled, and the rect is read once
 * per hover — never per move. Never applied to a glass panel (the transform
 * would make it a backdrop root).
 */
const STRENGTH = 0.24;
const MAX = 9;

export function useMagnetic() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target: HTMLElement | null = null;
    let rect: DOMRect | null = null;
    let raf = 0;
    let lastEvent: PointerEvent | null = null;

    const apply = () => {
      raf = 0;
      if (!target || !rect || !lastEvent) return;
      const dx = lastEvent.clientX - (rect.left + rect.width / 2);
      const dy = lastEvent.clientY - (rect.top + rect.height / 2);
      const x = Math.max(-MAX, Math.min(MAX, dx * STRENGTH));
      const y = Math.max(-MAX, Math.min(MAX, dy * STRENGTH));
      target.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };

    const onMove = (event: PointerEvent) => {
      const el =
        (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (el !== target) {
        if (target) target.style.transform = "";
        target = el;
        rect = el ? el.getBoundingClientRect() : null;
      }
      if (!target) return;
      lastEvent = event;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      if (target) target.style.transform = "";
      target = null;
      rect = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      if (target) target.style.transform = "";
    };
  }, []);
}
