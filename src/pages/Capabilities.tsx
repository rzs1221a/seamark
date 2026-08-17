import { useRef } from "react";
import { CaptureDemo } from "../components/CaptureDemo";
import { PackMock } from "../components/PackMock";
import { pillars, capabilitiesLede } from "../lib/pillars";
import { useReveals } from "../lib/useReveal";

export function Capabilities() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReveals(rootRef);
  return (
    <div ref={rootRef} className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mono-label">Capabilities</div>
      <h1 className="mt-3 text-3xl sm:text-4xl">Everything here is running.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-(--muted)">{capabilitiesLede}</p>

      {/* lead with the thing the visitor can fire themselves */}
      <div className="mt-10" data-reveal>
        <CaptureDemo />
      </div>

      <div className="mt-14 space-y-12">
        {pillars.map((p, i) => (
          <section
            key={p.id}
            aria-label={p.title}
            data-reveal
            className="seam-top pt-10 first:pt-0 first:before:hidden"
          >
            <div className="mono-label">{String(i + 1).padStart(2, "0")}</div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{p.title}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed">{p.body}</p>
            <div className="mt-4 max-w-2xl">
              <div className="mono-label">Why it matters</div>
              <p className="mt-1.5 leading-relaxed text-(--muted)">{p.matters}</p>
            </div>
            <p className="mono mt-4 text-[0.8125rem] text-(--signal)">Proof · {p.proof}</p>
            {p.id === "profile" && (
              <div className="panel-plain mt-8 p-6 sm:p-8">
                <PackMock />
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
