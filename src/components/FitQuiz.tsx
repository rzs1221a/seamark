import { useState } from "react";
import { Link } from "react-router-dom";
import { quizQuestions, recommend, type QuizAnswers } from "../lib/quiz";
import { MiniPassage } from "./MiniPassage";
import { Price } from "./Price";

/**
 * The shop assistant: four questions, one recommendation, and a contact form
 * that arrives already knowing what you told it. Entirely additive — the
 * plain form remains the primary path, and prerendered HTML shows only the
 * closed invitation.
 */
export function FitQuiz({
  heading = "Not sure which? Sixty seconds.",
  sheetBase = "",
}: {
  heading?: string;
  /** Where "read the full sheet" points: "" anchors on-page; "/packages" navigates. */
  sheetBase?: string;
}) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [step, setStep] = useState(0);

  const done = step >= quizQuestions.length;
  const rec = done ? recommend(answers) : null;

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="panel-plain flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:border-(--hairline)"
      >
        <span>
          <span className="mono-label">The fit quiz</span>
          <span className="mt-1 block font-medium">{heading}</span>
        </span>
        <span className="mono text-(--signal)">→</span>
      </button>
    );
  }

  return (
    <div className="panel p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <span className="mono-label">The fit quiz</span>
        <span className="mono flex items-center gap-1.5 text-[0.625rem] text-(--muted)">
          {quizQuestions.map((q, i) => (
            <span
              key={q.id}
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  i < step || done ? "var(--signal)" : i === step ? "var(--lead)" : "var(--tint-4)",
              }}
            />
          ))}
        </span>
      </div>

      {!done ? (
        <div className="mt-5">
          <p className="text-lg font-medium">{quizQuestions[step].prompt}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {quizQuestions[step].options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="quiz-chip"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, [quizQuestions[step].id]: option.id }));
                  setStep((s) => s + 1);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="link-draw mono mt-5 text-[0.6875rem] text-(--muted)"
            >
              ← back
            </button>
          )}
        </div>
      ) : (
        rec && (
          <div className="mt-5">
            <p className="mono-label">The fit</p>
            <div className="mt-3 grid gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xl font-semibold tracking-tight">{rec.tier.name}</span>
                  <Price value={rec.tier.price} prefix={rec.tier.pricePrefix} note={rec.tier.priceNote} tag />
                </div>
                <div className="mt-3 max-w-64">
                  <MiniPassage lit={rec.tier.stations} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-(--muted)">{rec.tier.pitch}</p>
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xl font-semibold tracking-tight">+ {rec.plan.name}</span>
                  <Price value={rec.plan.price} per={rec.plan.per} tag />
                </div>
                <div className="mono-label mt-3">{rec.plan.tagline}</div>
                <p className="mt-3 text-sm leading-relaxed text-(--muted)">{rec.plan.pitch}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to={`/contact?rec=${rec.tier.id}+${rec.plan.id}&sum=${encodeURIComponent(rec.summary)}`}
                className="btn-cta"
                data-magnetic
              >
                Start this conversation
              </Link>
              {sheetBase ? (
                <Link to={sheetBase} className="btn-quiet">
                  Read the full sheet →
                </Link>
              ) : (
                <a href={`#tier-${rec.tier.id}`} className="btn-quiet">
                  Read the full sheet →
                </a>
              )}
              <button
                type="button"
                onClick={reset}
                className="link-draw mono text-[0.6875rem] text-(--muted)"
              >
                start over
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
