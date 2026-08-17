import { radarBlips } from "../lib/watch";

// The /watch fold: a radar scope whose blips are the service log. The sweep
// passes; the blips light; they fade; the sweep returns. Reduced motion gets
// the designed static state — all blips lit, sweep fixed (see styles.css).
export function RadarScope({ compact = false }: { compact?: boolean }) {
  const angles = [40, 130, 215, 300]; // where each blip sits, degrees from 12 o'clock
  const cx = 180;
  const cy = 180;
  const period = 8; // seconds, must match the CSS animation

  return (
    <svg
      viewBox="-115 0 590 360"
      className={`mx-auto w-full ${compact ? "max-w-110" : "max-w-140"}`}
      role="img"
      aria-label={`Radar scope. Each pass of the sweep lights what the Watch catches: ${radarBlips.join("; ")}.`}
    >
      {[168, 126, 84, 42].map((r) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(240,244,246,0.14)"
          strokeWidth="1"
        />
      ))}
      <line x1={cx} y1="12" x2={cx} y2="348" stroke="rgba(240,244,246,0.08)" strokeWidth="1" />
      <line x1="12" y1={cy} x2="348" y2={cy} stroke="rgba(240,244,246,0.08)" strokeWidth="1" />

      {/* sweep: a trailing wedge, rotating about the scope center. The origin
          is in user coordinates (px lengths on SVG elements resolve in the
          user coordinate system), pinning the axis exactly to (cx, cy) — a
          fill-box origin would wobble around the wedge's own bounds. */}
      <g className="radar-sweep" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <path
          d={`M ${cx} ${cy} L ${cx} 12 A 168 168 0 0 0 ${cx - 168 * Math.sin((38 * Math.PI) / 180)} ${cy - 168 * Math.cos((38 * Math.PI) / 180)} Z`}
          fill="url(#sweepFade)"
        />
        <line x1={cx} y1={cy} x2={cx} y2="12" stroke="var(--signal)" strokeWidth="1.5" />
      </g>
      <defs>
        <linearGradient id="sweepFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(240,244,246,0.24)" />
          <stop offset="0.45" stopColor="rgba(240,244,246,0.08)" />
          <stop offset="1" stopColor="rgba(240,244,246,0)" />
        </linearGradient>
      </defs>

      {radarBlips.map((label, i) => {
        const a = ((angles[i] - 90) * Math.PI) / 180;
        const r = 105 + (i % 2) * 38;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        const left = Math.cos(a) < 0;
        return (
          <g
            key={label}
            className="radar-blip"
            style={{ animationDelay: `${(angles[i] / 360) * period}s` }}
          >
            <circle cx={x} cy={y} r="4" fill="var(--signal)" />
            <circle cx={x} cy={y} r="9" fill="none" stroke="rgba(240,244,246,0.4)" strokeWidth="1" />
            <text
              x={left ? x - 14 : x + 14}
              y={y + 3}
              textAnchor={left ? "end" : "start"}
              fontSize="10"
              fill="var(--ink)"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {label}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r="3" fill="var(--signal)" />
    </svg>
  );
}
