import { Link } from "react-router-dom";
import { keepItLit } from "../lib/watch";
import { SHOW_PRICING } from "../lib/brand";

/**
 * The build→monthly bridge, rendered at every buying decision point so the
 * Watch is part of the purchase, never a footnote. Amber — it's the thing
 * that keeps value flowing.
 */
export function KeepItLit({ to = "#the-watch" }: { to?: string }) {
  const figure = SHOW_PRICING ? `${keepItLit.price}${keepItLit.per}` : "a monthly you can stop";
  const text = (
    <>
      {keepItLit.pre} {figure}
      {keepItLit.post} →
    </>
  );
  const className = "link-draw mono inline-block text-sm text-(--lead)";
  return to.startsWith("#") ? (
    <a href={to} className={className}>
      {text}
    </a>
  ) : (
    <Link to={to} className={className}>
      {text}
    </Link>
  );
}
