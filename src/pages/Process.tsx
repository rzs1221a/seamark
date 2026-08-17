import { useRef } from "react";
import { Link } from "react-router-dom";
import { processHeader, processSteps } from "../lib/process";
import { useReveals } from "../lib/useReveal";

export function Process() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveals(rootRef);
  return (
    <div ref={rootRef} className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="mono-label">Process</div>
      <h1 className="mt-3 text-3xl sm:text-4xl">{processHeader}</h1>
      <ol className="mt-12 space-y-0">
        {processSteps.map((step, i) => (
          <li key={step} data-reveal className="relative flex gap-5 pb-10 last:pb-0">
            {i < processSteps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-8 left-3.75 h-full w-px bg-(--hairline)"
              />
            )}
            <span className="mono z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-(--signal)/50 bg-(--bg) text-xs text-(--signal)">
              {i + 1}
            </span>
            <span className="pt-1 text-lg">{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-14">
        <Link to="/contact" className="btn-cta" data-cta="process" data-magnetic>
          Start the conversation
        </Link>
      </div>
    </div>
  );
}
