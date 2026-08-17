import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FRAMES,
  APPROACH,
  registerCamera,
  registerMapInstance,
  heroFlying,
} from "../lib/cameraFrames";
import { workItems } from "../lib/work";

/**
 * The living coast. One MapLibre instance mounted once for the life of the
 * session — it must never remount on navigation: the entire effect depends on
 * the camera flying between destinations rather than the plate reloading
 * under you.
 *
 * Real Esri imagery of Amelia Island and the Nassau County coast, dark-graded.
 * Each shipped project carries a beacon at its true coordinate, blinking its
 * authored light characteristic; clicking one navigates to that project.
 *
 * If WebGL is unavailable or tiles never arrive, the dark plate beneath stays
 * and every destination is still reachable from the nav. The map is the best
 * way to feel this site, never the only way to use it.
 *
 * The engine is dynamically imported after first paint, so the prerendered
 * text — the LCP — never waits on it.
 */

/** Degrees of bearing per second while idle. Noticeable only if you wait. */
const ORBIT_SPEED = 0.4;

/** How long the arrival descent takes. */
const ARRIVAL_MS = 7000;

/** Below this zoom, beacon labels collapse into a pile; dots carry on alone. */
const LABEL_MIN_ZOOM = 10.6;

export function LiveMap({ initialPath }: { initialPath: string }) {
  // Two elements: the fixed shell (ours) and the engine container (MapLibre's
  // stylesheet forces `position: relative` on whatever it mounts into, so it
  // gets an inner div and the shell keeps the viewport).
  const shellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  // Markers live for the session and cannot close over `navigate` — they read
  // it through a ref kept current in an effect.
  const navRef = useRef(navigate);
  useEffect(() => {
    navRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let map: import("maplibre-gl").Map | null = null;
    let raf = 0;
    let cancelled = false;
    let flyingUntil = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = async () => {
      try {
        const [{ Map, Marker }, { coastStyle }] = await Promise.all([
          import("maplibre-gl"),
          import("../lib/mapStyle"),
        ]);
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (cancelled) return;

        const home = FRAMES[initialPath] ?? FRAMES["/"];
        // The arrival: open far out over the Atlantic and flat, then descend —
        // the way you would actually approach this coast. Under reduced motion
        // the camera simply starts where it is going.
        const opening = reduced ? home : APPROACH;

        map = new Map({
          container,
          style: coastStyle,
          center: opening.center,
          zoom: opening.zoom,
          pitch: opening.pitch,
          bearing: opening.bearing,
          // The page scrolls; the map is a stage, not a widget.
          interactive: false,
          attributionControl: { compact: true },
          // Capped below native retina: imagery hides the difference and the
          // GPU headroom goes to fluid flights instead of extra pixels.
          pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
          fadeDuration: 140,
        });

        (window as unknown as { __seamarkMap?: unknown }).__seamarkMap = map;

        map.on("load", () => {
          if (cancelled || !map) return;
          setLoaded(true);

          if (!reduced) {
            flyingUntil = performance.now() + ARRIVAL_MS;
            map.easeTo({
              ...home,
              duration: ARRIVAL_MS,
              // A long settling tail, so it lands rather than stops.
              easing: (t) => 1 - Math.pow(1 - t, 4),
            });
          }

          // Beacons: every shipped mark at its real coordinate, lit with its
          // authored characteristic. A null anim is a fixed light (F).
          for (const item of workItems) {
            const el = document.createElement("button");
            el.type = "button";
            el.className = "beacon";
            // The map is a stage, not the only path: pointer users can click a
            // beacon, keyboard users reach every project through the page, so
            // the stage stays out of the tab order.
            el.tabIndex = -1;
            el.setAttribute("aria-label", `${item.name} — open this project`);
            el.title = `${item.name} — ${item.light.characteristic}`;
            const dot = document.createElement("span");
            dot.className = `beacon-dot ${item.light.anim ?? ""}`;
            const name = document.createElement("span");
            name.className = "beacon-name";
            name.textContent = item.name;
            el.append(dot, name);
            el.addEventListener("click", (event) => {
              event.stopPropagation();
              navRef.current(`/work#${item.slug}`);
            });
            new Marker({ element: el, anchor: "center" }).setLngLat(item.coord).addTo(map);
          }

          const syncLabels = () => {
            if (!map || !shellRef.current) return;
            shellRef.current.dataset.labels = map.getZoom() >= LABEL_MIN_ZOOM ? "on" : "off";
          };
          syncLabels();
          map.on("zoom", syncLabels);

          registerCamera({
            flyTo: (frame, durationMs) => {
              if (!map) return;
              // Reduced motion removes the animation, not the navigation: the
              // camera position IS the destination, so it still arrives — it
              // simply arrives without the flight.
              if (reduced) {
                map.jumpTo(frame);
                return;
              }
              flyingUntil = performance.now() + durationMs;
              map.easeTo({
                ...frame,
                duration: durationMs,
                easing: (t) => 1 - Math.pow(1 - t, 4),
              });
            },
            isFlying: () => performance.now() < flyingUntil,
          });
          registerMapInstance(map);

          if (reduced) return;

          // The idle orbit: the coast never quite holds still. Yields to any
          // flight, pauses when the tab is hidden.
          let last = performance.now();
          const tick = (now: number) => {
            raf = requestAnimationFrame(tick);
            const dt = (now - last) / 1000;
            last = now;
            if (document.hidden || !map) return;
            if (now < flyingUntil || heroFlying()) return;
            map.setBearing(map.getBearing() + ORBIT_SPEED * dt);
          };
          raf = requestAnimationFrame(tick);
        });

        map.on("error", () => {});
      } catch {
        /* No map. The plate stays; the site is complete without it. */
      }
    };

    void start();

    return () => {
      cancelled = true;
      registerCamera(null);
      registerMapInstance(null);
      cancelAnimationFrame(raf);
      delete (window as unknown as { __seamarkMap?: unknown }).__seamarkMap;
      map?.remove();
    };
    // initialPath is only the first frame; navigation is handled via flyToRoute.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={shellRef}
      className="live-map"
      aria-hidden="true"
      data-loaded={loaded ? "true" : "false"}
    >
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}
