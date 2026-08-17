import { workItems, liveWork } from "../lib/work";
import { isDev } from "../lib/env";

// The least theatrical page on the site — deliberately. The claims section is
// where the showmanship stops.
export function Work() {
  const items = isDev ? workItems : liveWork;
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="mono-label">Work</div>
      <h1 className="mt-3 text-3xl sm:text-4xl">Real sites, on this coast.</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-(--muted)">
        Each project is stated as what the site verifiably does. Deliberately no conversion
        statistics: inventing one would be the lie that discredits every true claim beside it.
      </p>

      {items.length === 0 ? (
        <div className="panel-plain mt-10 p-8">
          <p className="mono text-sm leading-relaxed text-(--muted)">
            Project write-ups are being verified against their source repositories before they
            are published here. In the meantime, the site you are reading is built exactly the
            way client sites are — prerendered static HTML, owned outright. View source.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {items.map((item) => (
            <article key={item.slug} id={item.slug} className="panel-plain p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-semibold tracking-tight">{item.name}</h2>
                <span className="mono-label">{item.kind}</span>
              </div>
              {item.todo ? (
                <p className="mono mt-4 text-[0.8125rem] leading-relaxed text-(--lead)">
                  TODO(zander) — awaiting real screenshots and verified claims. This entry is
                  excluded from the production build until it is filled in.
                </p>
              ) : (
                <>
                  <p className="mt-3 text-sm text-(--muted)">{item.client}</p>
                  <p className="mt-3 leading-relaxed">{item.outcome}</p>
                  <p className="mt-3 text-sm leading-relaxed text-(--muted)">{item.summary}</p>
                  {item.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm">
                      {item.highlights.map((h) => (
                        <li key={h} className="flex gap-2.5">
                          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-(--signal)" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.stack.length > 0 && (
                    <p className="mono mt-4 text-[0.6875rem] text-(--muted)">
                      {item.stack.join(" · ")}
                    </p>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mono mt-4 inline-block text-sm text-(--signal) hover:underline"
                    >
                      {item.url} ↗
                    </a>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
