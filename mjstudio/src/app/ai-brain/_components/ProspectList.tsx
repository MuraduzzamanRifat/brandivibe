"use client";

import type { Prospect } from "@/lib/brain-storage";

type Props = {
  prospects: Prospect[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  drafting: string | null;
};

export function ProspectList({
  prospects,
  selectedId,
  onSelect,
  drafting,
}: Props) {
  if (!prospects.length) {
    return (
      <div className="panel p-6 text-[var(--brain-muted)] text-sm">
        No prospects loaded yet.
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--brain-border)] flex items-center justify-between">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)]">
          Prospects · {prospects.length}
        </div>
      </div>
      <ul className="divide-y divide-[var(--brain-border)]">
        {prospects.map((p) => {
          const isSelected = p.id === selectedId;
          const isDrafting = drafting === p.id;
          return (
            <li key={p.id}>
              <button
                onClick={() => onSelect(p.id)}
                className={`w-full text-left px-5 py-4 transition-colors ${
                  isSelected
                    ? "bg-[rgba(132,225,255,0.06)]"
                    : "hover:bg-[rgba(255,255,255,0.02)]"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{p.company}</div>
                    <div className="mono text-[10px] uppercase tracking-[0.15em] text-[var(--brain-muted)] mt-0.5 truncate">
                      {p.founder} · {p.role}
                    </div>
                  </div>
                  <span
                    className={`mono text-[10px] uppercase tracking-[0.2em] tier-${p.icpTier}`}
                    aria-label={`ICP tier ${p.icpTier}`}
                  >
                    Tier {p.icpTier}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="chip">{p.industry}</span>
                  <span className="chip">{p.stage}</span>
                  <span className={`chip status-${p.status}`}>
                    {p.status}
                  </span>
                  {isDrafting && (
                    <span className="chip" style={{ color: "var(--brain-accent)" }}>
                      drafting…
                    </span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
