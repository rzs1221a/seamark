import type { StationId } from "../lib/offer";

const STATIONS: Array<{ id: StationId; label: string }> = [
  { id: "found", label: "FOUND" },
  { id: "landed", label: "LANDED" },
  { id: "captured", label: "CAPTURED" },
  { id: "bought", label: "BOUGHT" },
];

// The four-station route in miniature. Stations the tier covers are lit solid
// cyan; the rest stay hollow and dashed. The diagram is the tier comparison.
export function MiniPassage({ lit }: { lit: StationId[] }) {
  const xs = [30, 120, 210, 300];
  return (
    <svg
      viewBox="0 0 330 46"
      className="w-full"
      role="img"
      aria-label={`Route coverage: ${STATIONS.filter((s) => lit.includes(s.id))
        .map((s) => s.label)
        .join(", ")}`}
    >
      <line
        x1={xs[0]}
        y1="16"
        x2={xs[3]}
        y2="16"
        stroke="rgba(142,160,170,0.35)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      {STATIONS.map((s, i) => {
        const on = lit.includes(s.id);
        return (
          <g
            key={s.id}
            className={on ? "mp-s" : undefined}
            style={on ? ({ "--i": i } as React.CSSProperties) : undefined}
          >
            {on && i > 0 && lit.includes(STATIONS[i - 1].id) && (
              <line
                x1={xs[i - 1]}
                y1="16"
                x2={xs[i]}
                y2="16"
                stroke="var(--signal)"
                strokeWidth="1.5"
                opacity="0.7"
              />
            )}
            {on ? (
              <>
                <circle cx={xs[i]} cy="16" r="7" fill="rgba(240,244,246,0.15)" />
                <circle cx={xs[i]} cy="16" r="3.5" fill="var(--signal)" />
              </>
            ) : (
              <circle
                cx={xs[i]}
                cy="16"
                r="3.5"
                fill="none"
                stroke="rgba(142,160,170,0.55)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            )}
            <text
              x={xs[i]}
              y="38"
              textAnchor="middle"
              fontSize="8"
              letterSpacing="1.5"
              fill={on ? "var(--signal)" : "rgba(142,160,170,0.55)"}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
