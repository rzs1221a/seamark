import { SHOW_PRICING } from "../lib/brand";

// Every price on the site renders through this component, so flipping
// SHOW_PRICING to false replaces every figure with "Let's talk".
function PriceFigure({
  value,
  prefix,
  note,
  per,
  tone = "signal",
  tag = false,
}: {
  value: string;
  prefix?: string;
  note?: string;
  per?: string;
  tone?: "signal" | "lead";
  /** Storefront treatment: render as a bordered mono price tag. */
  tag?: boolean;
}) {
  if (!SHOW_PRICING) {
    return <span className="mono text-xl text-(--signal)">Let&rsquo;s talk</span>;
  }
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${tag ? "price-tag" : ""}`}>
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

/**
 * A price, gated by SHOW_PRICING. With `monthly`, the twelve-payment option
 * prints beneath the one-time figure in muted mono.
 */
export function Price(props: {
  value: string;
  prefix?: string;
  note?: string;
  per?: string;
  tone?: "signal" | "lead";
  tag?: boolean;
  monthly?: number;
}) {
  const { monthly, ...figure } = props;
  if (!SHOW_PRICING) {
    return <span className="mono text-xl text-(--signal)">Let&rsquo;s talk</span>;
  }
  if (!monthly) return <PriceFigure {...figure} />;
  return (
    <span className="inline-flex flex-col items-end gap-1">
      <PriceFigure {...figure} />
      <span className="mono text-[0.6875rem] whitespace-nowrap text-(--muted)">
        or ${monthly}/mo × 12
      </span>
    </span>
  );
}
