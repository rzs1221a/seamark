import { useRef } from "react";
import { faq } from "../lib/faq";
import { useReveals } from "../lib/useReveal";

export function Questions() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveals(rootRef);
  return (
    <div ref={rootRef} className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="mono-label">Questions</div>
      <h1 className="mt-3 text-3xl sm:text-4xl">Answered straight.</h1>
      <div className="mt-10 space-y-3">
        {faq.map((entry) => (
          <details key={entry.question} data-reveal className="faq-item panel-plain">
            <summary className="flex items-center justify-between gap-4 p-5 font-medium">
              {entry.question}
              <span className="indicator mono text-(--signal)" aria-hidden="true" />
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-(--muted)">{entry.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
