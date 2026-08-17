import { useEffect, useRef, useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import { brand, disclaimer } from "../lib/brand";
import { CompassRose } from "./CompassRose";
import { LiveMap } from "./LiveMap";
import { flyToRoute } from "../lib/cameraFrames";
import { useSkylight } from "../lib/sky";
import { useMagnetic } from "../lib/magnetic";

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

/**
 * Navigation is travel: on every route change the camera flies AND the
 * arriving page blooms open — one continuous move, never a cut. The bloom
 * class is forced through a reflow so rapid navigations restart the cycle.
 */
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
    document.body.classList.remove("route-blooming");
    void document.body.offsetWidth;
    document.body.classList.add("route-blooming");
    const timer = window.setTimeout(
      () => document.body.classList.remove("route-blooming"),
      640,
    );
    return () => window.clearTimeout(timer);
  }, [pathname]);
  return null;
}

/**
 * The home veil is tuned for the hero fold, where the Passage plays on nearly
 * clear water. Once the reader scrolls into the bands, the shade deepens so
 * copy always sits on darkness — and lifts again on the way back up.
 */
function useScrolledPastFold() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > window.innerHeight * 0.55);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return scrolled;
}

export function Layout() {
  const mapEligible = useMapEligible();
  const { pathname } = useLocation();
  const scrolled = useScrolledPastFold();
  useSkylight();
  useMagnetic();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {mapEligible && <LiveMap initialPath={pathname} />}
      <RouteCamera />
      <div
        className="map-veil"
        aria-hidden="true"
        data-route={pathname}
        data-scrolled={scrolled ? "true" : "false"}
      />
      <header className="sticky top-0 z-40 border-b border-(--hairline-faint) bg-(--bg)/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label={brand.name}>
            <Mark />
            <span className="font-semibold tracking-tight">{brand.short}</span>
            <span className="mono-label mt-0.5 hidden sm:inline">studio</span>
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-x-2">
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
            {/* The door is always one click away. */}
            <Link
              to="/contact"
              data-cta="nav"
              className="btn-cta hidden px-3.5! py-1.5! text-sm lg:inline-flex"
            >
              Twenty minutes
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* The closer: whoever reads to the bottom of any page gets the door. */}
      <div className="seam-top mx-auto mt-24 w-full max-w-6xl px-4 py-14 text-center sm:px-6">
        <p className="text-lg text-(--ink)">
          Still reading? That&rsquo;s usually the sign.
        </p>
        <div className="mt-5">
          <Link to="/contact" className="btn-cta" data-cta="footer" data-magnetic>
            Twenty minutes, and you&rsquo;ll know
          </Link>
        </div>
        <p className="mono mt-4 text-sm text-(--muted)">
          Or call or text{" "}
          <a href={`tel:${brand.phone}`} className="link-draw text-(--signal)">
            {brand.phoneDisplay}
          </a>
        </p>
      </div>

      <footer className="relative overflow-hidden border-t border-(--hairline-faint) bg-(--land)">
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
                <a href={`tel:${brand.phone}`} className="link-draw text-(--signal)">
                  {brand.phoneDisplay}
                </a>
                <span className="text-(--muted)"> · </span>
                <a href={`sms:${brand.phone}`} className="link-draw text-(--signal)">
                  text
                </a>
              </div>
              <div>
                <a href={`mailto:${brand.email}`} className="link-draw text-(--signal)">
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
