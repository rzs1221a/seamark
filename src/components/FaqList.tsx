import { useState } from "react";
import type { FaqEntry } from "../lib/faq";

/**
 * The accordion, smooth: answers collapse via a grid-rows transition (height
 * animation without measuring), the indicator rotates from + to ×. The first
 * answer ships open so prerendered HTML leads with substance; every answer's
 * text is always in the DOM for crawlers. Reduced motion: instant.
 */
export function FaqList({ entries, defaultOpen = 0 }: { entries: FaqEntry[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="space-y-3">
      {entries.map((entry, i) => {
        const isOpen = open === i;
        return (
          <div key={entry.question} data-reveal className="panel-plain overflow-hidden">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium"
            >
              {entry.question}
              <span
                aria-hidden="true"
                className={`faq-indicator mono text-(--signal) ${isOpen ? "is-open" : ""}`}
              >
                +
              </span>
            </button>
            <div className={`faq-body ${isOpen ? "is-open" : ""}`}>
              <div className="faq-body-inner">
                <p className="px-5 pb-5 leading-relaxed text-(--muted)">{entry.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
