import { useEffect, useRef, useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import { brand, disclaimer } from "../lib/brand";
import { CompassRose } from "./CompassRose";
import { LiveMap } from "./LiveMap";
import { flyToRoute } from "../lib/cameraFrames";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/packages", label: "Packages" },
  { to: "/watch", label: "Watch" },
  { to: "/work", label: "Work" },
  { to: "/capabilities", label: "Capabilities" },
  { to: "/contact", label: "Contact" },
];

function Mark() {
  // A lit seamark: fixed, charted, navigable-by.
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <line x1="12" y1="21" x2="12" y2="9" stroke="var(--signal)" strokeWidth="1.5" />
      <path d="M8 21h8" stroke="var(--signal)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="6" r="2.4" fill="var(--signal)" />
      <path
        d="M5.5 6h3M15.5 6h3"
        stroke="var(--signal)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/**
 * Mount the living coast on capable machines only: wide viewports, no
 * data-saver, no 2G. Phones keep the dark plate — cheap, no tile cost, and
 * the vertical Passage diagram carries the story there.
 */
function useMapEligible() {
  const [eligible, setEligible] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 821px)");
    type NetInfo = { saveData?: boolean; effectiveType?: string };
    const conn = (navigator as unknown as { connection?: NetInfo }).connection;
    const slow =
      conn?.saveData === true || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g";
    const decide = () => setEligible(wide.matches && !slow);
    decide();
    wide.addEventListener("change", decide);
    return () => wide.removeEventListener("change", decide);
  }, []);
  return eligible;
}

/** Flies the persistent camera to each route as the URL changes. */
function RouteCamera() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    // The arrival descent already targets the first route's frame.
    if (first.current) {
      first.current = false;
      return;
    }
    flyToRoute(pathname);
  }, [pathname]);
  return null;
}

export function Layout() {
  const mapEligible = useMapEligible();
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {mapEligible && <LiveMap initialPath={pathname} />}
      <RouteCamera />
      <div className="map-veil" aria-hidden="true" data-route={pathname} />
      <header className="sticky top-0 z-40 border-b border-(--hairline-faint) bg-(--bg)/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label={brand.name}>
            <Mark />
            <span className="font-semibold tracking-tight">{brand.short}</span>
            <span className="mono-label mt-0.5 hidden sm:inline">studio</span>
          </Link>
          <nav aria-label="Primary" className="flex flex-wrap items-center justify-end gap-x-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-(--signal)"
                      : "text-(--muted) hover:text-(--ink)"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="relative mt-24 overflow-hidden border-t border-(--hairline-faint) bg-(--land)">
        <CompassRose className="compass-watermark text-(--signal)" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Mark />
              <span className="font-semibold tracking-tight">{brand.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-(--muted)">
              {brand.tagline}
            </p>
            <div className="mono mt-5 space-y-1.5 text-sm">
              <div>
                <a href={`tel:${brand.phone}`} className="text-(--signal) hover:underline">
                  {brand.phoneDisplay}
                </a>
                <span className="text-(--muted)"> · </span>
                <a href={`sms:${brand.phone}`} className="text-(--signal) hover:underline">
                  text
                </a>
              </div>
              <div>
                <a href={`mailto:${brand.email}`} className="text-(--signal) hover:underline">
                  {brand.email}
                </a>
              </div>
              <div className="text-(--muted)">{brand.location}</div>
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[
              ...NAV,
              { to: "/process", label: "Process" },
              { to: "/questions", label: "Questions" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-(--muted) transition-colors hover:text-(--ink)"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div>
            <div className="mono-label">Notices</div>
            <p className="mono mt-3 text-[0.6875rem] leading-relaxed text-(--muted)">
              {disclaimer}
            </p>
            <p className="mono mt-4 text-[0.6875rem] text-(--muted)">
              © {new Date().getFullYear()} {brand.name} · {brand.domain}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
