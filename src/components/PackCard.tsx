// The J. Cooper local-pack card — a clearly fictional demo agent, used by the
// Passage hero and the annotated mock on /capabilities.

export function PackCard({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`scene-card ${compact ? "p-2.5" : "p-4"}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="tag">YOUR PROFILE</span>
        <span className="mono text-[0.5625rem] text-(--muted)">Ad-free result · #1</span>
      </div>
      <div className={`mt-1.5 font-semibold ${compact ? "text-sm" : "text-base"}`}>
        J. Cooper
      </div>
      <div
        className={`mono flex flex-wrap items-center gap-x-1.5 ${compact ? "text-[0.625rem]" : "text-xs"}`}
      >
        {/* Google's own star gold, fixed — the mock must read as Google. */}
        <span style={{ color: "#fbbf24" }} data-annot="reviews">
          ★★★★★ 4.9 (87)
        </span>
        <span className="text-(--muted)">·</span>
        <span className="text-(--muted)" data-annot="category">
          Real estate agent
        </span>
      </div>
      <div
        className={`mono flex flex-wrap items-center gap-x-1.5 ${compact ? "text-[0.625rem]" : "text-xs"}`}
      >
        <span className="text-(--signal)" data-annot="hours">
          Open now
        </span>
        <span className="text-(--muted)">·</span>
        <span className="text-(--muted)">jcooper.realtor</span>
      </div>
    </div>
  );
}
