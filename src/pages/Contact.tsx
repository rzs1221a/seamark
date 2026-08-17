import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { brand } from "../lib/brand";
import { noContractLine } from "../lib/watch";
import { tiers } from "../lib/offer";
import { watchPlans } from "../lib/watch";
import { FitQuiz } from "../components/FitQuiz";
import { useReveals } from "../lib/useReveal";

/** `/contact?rec=<tier>[+<plan>]&sum=<text>` → an editable prefill. */
function usePrefill() {
  const [params] = useSearchParams();
  const rec = params.get("rec") ?? "";
  const sum = params.get("sum") ?? "";
  if (sum) return { rec, text: sum };
  if (!rec) return { rec: "", text: "" };
  const names = rec
    .split("+")
    .map(
      (id) => tiers.find((t) => t.id === id)?.name ?? watchPlans.find((p) => p.id === id)?.name,
    )
    .filter(Boolean)
    .join(" with the ");
  return names ? { rec, text: `I'd like to talk about ${names}.` } : { rec: "", text: "" };
}

export function Contact() {
  const rootRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useReveals(rootRef);
  const prefill = usePrefill();

  // Prefill after hydration (prerendered HTML has no params), and only into
  // an empty field — never over something the visitor typed.
  useEffect(() => {
    const el = textareaRef.current;
    if (el && prefill.text && !el.value) el.value = prefill.text;
  }, [prefill.text]);
  return (
    <div ref={rootRef} className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="mono-label">Contact</div>
      <h1 className="mt-3 text-3xl sm:text-4xl">Request a pilot.</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-(--muted)">
        A harbor pilot is the local expert who boards your vessel for the waters they know,
        brings you in, and leaves — and the ship was yours the whole time. That&rsquo;s the
        call: twenty minutes on the phone, I&rsquo;ll pull up your Google presence while we
        talk and tell you exactly what&rsquo;s missing, whether or not you ever hire me.
      </p>

      <div className="mt-10" data-reveal>
        <FitQuiz heading="Not sure what to ask for? Sixty seconds." sheetBase="/packages" />
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_minmax(220px,0.6fr)]">
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="panel space-y-4 p-6 sm:p-8"
          aria-label="Request a pilot"
          data-reveal
        >
          <input type="hidden" name="form-name" value="contact" />
          {prefill.rec && <input type="hidden" name="recommended" value={prefill.rec} />}
          <p className="hidden">
            <label>
              Don&rsquo;t fill this out: <input name="bot-field" />
            </label>
          </p>
          <div>
            <label htmlFor="c-name" className="mono-label">
              Name
            </label>
            <input id="c-name" name="name" required className="field mt-1.5" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="c-email" className="mono-label">
                Email
              </label>
              <input id="c-email" name="email" type="email" required className="field mt-1.5" />
            </div>
            <div>
              <label htmlFor="c-phone" className="mono-label">
                Phone
              </label>
              <input id="c-phone" name="phone" type="tel" className="field mt-1.5" />
            </div>
          </div>
          <div>
            <label htmlFor="c-now" className="mono-label">
              What are you working with now
            </label>
            <textarea
              id="c-now"
              name="working-with-now"
              rows={5}
              ref={textareaRef}
              className="field mt-1.5"
              placeholder="A brokerage page? A profile you've never claimed? Nothing at all is a fine answer."
            />
          </div>
          <button type="submit" className="btn-cta" data-cta="contact-submit" data-magnetic>
            Request the call
          </button>
          <p className="mono pt-2 text-[0.6875rem] leading-relaxed text-(--muted)">
            {noContractLine}
          </p>
        </form>

        <div className="space-y-6" data-reveal>
          <div>
            <div className="mono-label">Direct</div>
            <div className="mono mt-3 space-y-2 text-sm">
              <div>
                <a href={`tel:${brand.phone}`} className="link-draw text-(--signal)">
                  {brand.phoneDisplay}
                </a>
              </div>
              <div>
                <a href={`sms:${brand.phone}`} className="link-draw text-(--signal)">
                  Text the same number
                </a>
              </div>
              <div>
                <a href={`mailto:${brand.email}`} className="link-draw text-(--signal)">
                  {brand.email}
                </a>
              </div>
              <div className="text-(--muted)">{brand.location}</div>
            </div>
          </div>
          <p className="mono text-[0.6875rem] leading-relaxed text-(--muted)">
            The call is the whole ask. No deck, no follow-up sequence — a look at your Google
            presence and a straight read on it.
          </p>
        </div>
      </div>
    </div>
  );
}
