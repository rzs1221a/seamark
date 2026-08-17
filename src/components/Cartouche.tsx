import { Fragment } from "react";

// A chart's title block — the cartouche where a real chart declares its datum
// and authority. Renders **bold** spans from the data module.
export function Cartouche({ label, text }: { label: string; text: string }) {
  const parts = text.split("**");
  return (
    <div className="cartouche p-8 sm:p-10">
      <div className="mono-label text-(--signal)!">{label}</div>
      <p className="mt-4 text-lg leading-relaxed text-(--ink) sm:text-xl">
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-semibold text-(--signal)">
              {part}
            </strong>
          ) : (
            <Fragment key={i}>{part}</Fragment>
          ),
        )}
      </p>
    </div>
  );
}
