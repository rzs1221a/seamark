// Footer watermark. Chart furniture — never above 8% opacity, never animated.
export function CompassRose({ className }: { className?: string }) {
  const points = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="8" fill="none" stroke="currentColor" strokeWidth="0.75" />
      {points.map((deg) => {
        const main = deg % 90 === 0;
        const mid = deg % 45 === 0;
        const len = main ? 88 : mid ? 70 : 50;
        const rad = ((deg - 90) * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={100 + 10 * Math.cos(rad)}
            y1={100 + 10 * Math.sin(rad)}
            x2={100 + len * Math.cos(rad)}
            y2={100 + len * Math.sin(rad)}
            stroke="currentColor"
            strokeWidth={main ? 1.25 : 0.5}
          />
        );
      })}
      <text x="100" y="14" textAnchor="middle" fontSize="11" fill="currentColor">
        N
      </text>
    </svg>
  );
}
