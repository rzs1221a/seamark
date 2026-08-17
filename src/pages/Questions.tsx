import { useRef } from "react";
import { faq } from "../lib/faq";
import { FaqList } from "../components/FaqList";
import { useReveals } from "../lib/useReveal";

export function Questions() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveals(rootRef);
  return (
    <div ref={rootRef} className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="mono-label">Questions</div>
      <h1 className="mt-3 text-3xl sm:text-4xl">Answered straight.</h1>
      <div className="mt-10">
        <FaqList entries={faq} />
      </div>
    </div>
  );
}
