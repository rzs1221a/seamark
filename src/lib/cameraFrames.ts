/**
 * The ground follows the argument.
 *
 * One persistent camera sits behind every page. Each route — and on the
 * homepage, each section — declares a frame, and as the reader moves the coast
 * beneath the page flies there. Read about the harbor and you are looking at
 * the harbor.
 *
 * Every coordinate is real: the work beacons come from the portfolio data
 * (USGS-checked for Crane Island), the lighthouse is the actual Amelia Island
 * Light, and the hero's passage runs the real approach — through the
 * St. Marys entrance and down the Amelia River to the Fernandina marina.
 * A map that flies to the wrong place is worse than one that does not fly.
 */

export interface CameraFrame {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

/** Real places the scene is built from. */
export const AMELIA_LIGHTHOUSE: [number, number] = [-81.4421, 30.6733];
export const FERNANDINA_MARINA: [number, number] = [-81.4655, 30.6697];

/** Frames keyed by route path, plus homepage section beats. */
export const FRAMES: Record<string, CameraFrame> = {
  // The hero: looking out to sea from over the island. The open Atlantic and
  // the St. Marys entrance sit at the top of the frame; the course descends
  // toward the Fernandina marina at the bottom, with the real Amelia Island
  // Light between them, sweeping the water.
  "/": { center: [-81.4405, 30.6835], zoom: 12.7, pitch: 55, bearing: 62 },

  "/packages": { center: [-81.455, 30.61], zoom: 11.8, pitch: 52, bearing: -24 },
  // The Watch: the north end over Fort Clinch — the station that keeps watch.
  "/watch": { center: [-81.454, 30.702], zoom: 13.2, pitch: 58, bearing: -30 },
  // Work: pulled out so all seven beacons read separately. Pitch held down —
  // tilt compresses distance toward the horizon and stacks the northern marks.
  "/work": { center: [-81.458, 30.628], zoom: 11.1, pitch: 40, bearing: -14 },
  "/capabilities": { center: [-81.44, 30.65], zoom: 12.4, pitch: 58, bearing: 8 },
  // Process: downtown Fernandina — the densest built fabric on the island.
  "/process": { center: [-81.4637, 30.6697], zoom: 13.6, pitch: 55, bearing: -28 },
  "/questions": { center: [-81.49, 30.63], zoom: 12.0, pitch: 46, bearing: 30 },
  // Contact: the harbor. "Request a pilot" — this is where the pilot boards.
  "/contact": { center: [-81.4655, 30.6705], zoom: 13.8, pitch: 56, bearing: 20 },

  // Homepage section beats.
  "home-proof": { center: [-81.458, 30.628], zoom: 11.1, pitch: 40, bearing: -14 },
  // The cost band pulls out to the whole working corridor — the frame in which
  // value flowing away reads as a market, not a street.
  "home-costs": { center: [-81.5, 30.45], zoom: 9.6, pitch: 45, bearing: -10 },
  // The contract settles over the island's southern tip — the studio's own mark.
  "home-contract": { center: [-81.438, 30.535], zoom: 13.0, pitch: 55, bearing: 18 },
};

/**
 * Where the arrival begins: out over the Atlantic, flat — the way you would
 * actually approach this coast. The opening descends from here.
 */
export const APPROACH: CameraFrame = {
  center: [-81.36, 30.62],
  zoom: 10.4,
  pitch: 12,
  bearing: 24,
};

/** What LiveMap hands us. Kept minimal so the map stays swappable. */
export interface CameraController {
  flyTo(frame: CameraFrame, durationMs: number): void;
  isFlying(): boolean;
}

let controller: CameraController | null = null;

/** Held so a navigation that lands before the map is ready is not lost. */
let pendingFrame: CameraFrame | null = null;

/** Called by LiveMap once the map is ready (and with null on teardown). */
export function registerCamera(next: CameraController | null) {
  controller = next;
  if (controller && pendingFrame) controller.flyTo(pendingFrame, 1800);
}

/**
 * Fly to a frame. A fast scroll past four sections must not queue four
 * flights: only the most recent target is ever flown to, and if one is already
 * in the air the next is cut short so the camera keeps up with the reader
 * instead of trailing several seconds behind them.
 */
export function flyToFrame(frame: CameraFrame, slow = false) {
  pendingFrame = frame;
  if (!controller) return;
  const duration = controller.isFlying() ? 1600 : slow ? 3400 : 2800;
  controller.flyTo(frame, duration);
}

/** The route-driven path — the shell calls this on every navigation. */
export function flyToRoute(pathname: string) {
  const frame = FRAMES[pathname];
  if (frame) flyToFrame(frame);
}

/** The section-driven path — the homepage observer calls this. */
export function flyToKey(key: string) {
  const frame = FRAMES[key];
  if (frame) flyToFrame(frame, true);
}

/* ── Raw map access for the Passage overlay ─────────────────────────────── */

/**
 * The hero draws its course in lng/lat and projects through the live camera
 * each frame, so the passage stays glued to the real water while the idle
 * orbit breathes. It needs the raw map for `project()`; everything else goes
 * through the controller seam above.
 */
export interface ProjectingMap {
  project(lnglat: [number, number]): { x: number; y: number };
  getZoom(): number;
  easeTo(opts: {
    zoom?: number;
    duration?: number;
    easing?: (t: number) => number;
  }): unknown;
  on(event: string, cb: () => void): unknown;
  off(event: string, cb: () => void): unknown;
}

let mapInstance: ProjectingMap | null = null;
const mapReadyListeners = new Set<() => void>();

export function registerMapInstance(map: ProjectingMap | null) {
  mapInstance = map;
  if (map) for (const cb of mapReadyListeners) cb();
}

export function getMapInstance(): ProjectingMap | null {
  return mapInstance;
}

/** Fires immediately if the map is already up. */
export function onMapReady(cb: () => void): () => void {
  if (mapInstance) cb();
  mapReadyListeners.add(cb);
  return () => mapReadyListeners.delete(cb);
}

/** Marks a hero-owned camera move so the orbit yields to it. */
export function markFlying(durationMs: number) {
  heroFlyingUntil = performance.now() + durationMs;
}
export function heroFlying() {
  return performance.now() < heroFlyingUntil;
}
let heroFlyingUntil = 0;
