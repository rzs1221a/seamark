import { useEffect } from "react";
import SunCalc from "suncalc";

/**
 * The living light: real solar geometry for the coast the site stands on.
 * Stamped onto <html data-sky> every minute; CSS applies a luminance-neutral
 * hue cast over the map plate. State, not motion — reduced-motion visitors
 * get the same sky, and the cast is too faint to move any text below 4.5:1.
 */
const OBSERVER = { lat: 30.6129, lng: -81.4623 }; // Fernandina Beach

export type SkyPhase = "night" | "dawn" | "morning" | "midday" | "golden" | "dusk";

export function skyPhase(date = new Date()): SkyPhase {
  const sun = SunCalc.getPosition(date, OBSERVER.lat, OBSERVER.lng);
  const altDeg = (sun.altitude * 180) / Math.PI;
  const rising = (() => {
    const soon = SunCalc.getPosition(
      new Date(date.getTime() + 10 * 60 * 1000),
      OBSERVER.lat,
      OBSERVER.lng,
    );
    return soon.altitude > sun.altitude;
  })();

  if (altDeg < -6) return "night";
  if (altDeg < 4) return rising ? "dawn" : "dusk";
  if (altDeg < 12) return "golden";
  if (altDeg < 35) return "morning";
  return "midday";
}

export function useSkylight() {
  useEffect(() => {
    const stamp = () => {
      document.documentElement.dataset.sky = skyPhase();
    };
    stamp();
    const timer = window.setInterval(stamp, 60_000);
    return () => window.clearInterval(timer);
  }, []);
}
