import { SHOW_PRICING } from "../lib/brand";

// Every price on the site renders through this component, so flipping
// SHOW_PRICING to false replaces every figure with "Let's talk".
export function Price({
  value,
  prefix,
  note,
  per,
  tone = "signal",
}: {
  value: string;
  prefix?: string;
  note?: string;
  per?: string;
  tone?: "signal" | "lead";
}) {
  if (!SHOW_PRICING) {
    return <span className="mono text-xl text-(--signal)">Let&rsquo;s talk</span>;
  }
  return (
    <span className="inline-flex items-baseline gap-1.5">
      {prefix && <span className="mono text-xs text-(--muted)">{prefix}</span>}
      <span
        className={`mono text-2xl font-medium ${tone === "lead" ? "text-(--lead)" : "text-(--signal)"}`}
      >
        {value}
      </span>
      {per && <span className="mono text-sm text-(--muted)">{per}</span>}
      {note && <span className="mono text-xs text-(--muted)">{note}</span>}
    </span>
  );
}
