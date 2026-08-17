import { useState, type FormEvent } from "react";
import { captureDemoLabel } from "../lib/pillars";

interface Parsed {
  time: string;
  name: string;
  email: string;
  phone: string;
  deal: string;
}

// A real form beside a terminal pane. Submitting renders the parsed
// `Add Contact` payload client-side — nothing is emailed anywhere.
export function CaptureDemo() {
  const [parsed, setParsed] = useState<Parsed | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    setParsed({
      time: new Date().toLocaleTimeString([], { hour12: false }),
      name: name || "—",
      email: String(data.get("email") || "").trim() || "—",
      phone: String(data.get("phone") || "").trim() || "—",
      deal: `${String(data.get("intent") || "Sell")} · ${String(data.get("zip") || "").trim() || "32034"}`,
    });
  }

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-(--hairline-faint) px-5 py-3">
        <span className="mono text-[0.6875rem] text-(--lead)">{captureDemoLabel}</span>
      </div>
      <div className="grid md:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-3 p-5" aria-label="Capture demo form">
          <div>
            <label htmlFor="demo-name" className="mono-label">
              Name
            </label>
            <input id="demo-name" name="name" className="field mt-1" placeholder="M. Carter" />
          </div>
          <div>
            <label htmlFor="demo-email" className="mono-label">
              Email
            </label>
            <input
              id="demo-email"
              name="email"
              type="email"
              className="field mt-1"
              placeholder="m.carter@example.com"
            />
          </div>
          <div>
            <label htmlFor="demo-phone" className="mono-label">
              Phone
            </label>
            <input id="demo-phone" name="phone" className="field mt-1" placeholder="(904) 555-0100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="demo-intent" className="mono-label">
                Intent
              </label>
              <select id="demo-intent" name="intent" className="field mt-1">
                <option>Sell</option>
                <option>Buy</option>
              </select>
            </div>
            <div>
              <label htmlFor="demo-zip" className="mono-label">
                ZIP
              </label>
              <input id="demo-zip" name="zip" className="field mt-1" placeholder="32034" />
            </div>
          </div>
          <button type="submit" className="btn-cta w-full justify-center text-sm">
            Send the test lead
          </button>
        </form>

        <div className="border-t border-(--hairline-faint) bg-(--bg)/60 p-5 md:border-t-0 md:border-l">
          <div className="flex items-center justify-between">
            <span className="mono text-[0.6875rem] text-(--lead)">YOUR CRM</span>
            <span className="mono text-[0.6875rem] text-(--muted)">BoldTrail — Lead Dropbox</span>
          </div>
          <div className="terminal mt-4" aria-live="polite">
            {parsed ? (
              <>
                <div className="text-(--muted)">──── parsed {parsed.time} ────</div>
                <div>
                  <span className="t-key">SUBJ </span>
                  <span className="t-val">Add Contact</span>
                </div>
                <div>
                  <span className="t-key">name </span>
                  <span className="t-val">{parsed.name}</span>
                </div>
                <div>
                  <span className="t-key">email </span>
                  <span className="t-val">{parsed.email}</span>
                </div>
                <div>
                  <span className="t-key">phone </span>
                  <span className="t-val">{parsed.phone}</span>
                </div>
                <div>
                  <span className="t-key">deal </span>
                  <span className="t-val">{parsed.deal}</span>
                </div>
                <div className="t-row mt-2">{parsed.name} — NEW LEAD</div>
                <div className="mt-2 text-(--muted)">
                  On a client build this lands in your BoldTrail, not on a screen.
                </div>
              </>
            ) : (
              <>
                <div className="text-(--muted)">── waiting for a submission ──</div>
                <div className="mt-1 text-(--muted)">
                  Fill the form and send it. The parse renders here, timestamped, fields split —
                  the same shape BoldTrail&rsquo;s Lead Dropbox receives.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
