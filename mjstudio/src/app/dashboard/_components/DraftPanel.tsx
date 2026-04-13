"use client";

import type { Prospect, Draft } from "@/lib/brain-storage";

type Variant = "funding" | "launch" | "hire" | "brand-weakness";

type Props = {
  prospect: Prospect;
  drafts: Draft[];
  drafting: boolean;
  onDraft: (variant: Variant) => void;
};

export function DraftPanel({ prospect, drafts, drafting, onDraft }: Props) {
  return (
    <div className="space-y-6">
      {/* prospect detail */}
      <div className="panel p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-2">
              — Prospect
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {prospect.company}
            </h2>
            <div className="mono text-xs text-[var(--brain-muted)] mt-1">
              {prospect.domain}
            </div>
          </div>
          <span className={`chip tier-${prospect.icpTier} mono`}>
            Tier {prospect.icpTier} · Score {prospect.icpScore}
          </span>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <Field label="Founder">
            {prospect.founder} · {prospect.role}
          </Field>
          <Field label="Email">
            <a
              href={`mailto:${prospect.email}`}
              className="text-[var(--brain-accent)] hover:underline mono text-xs"
            >
              {prospect.email}
            </a>
          </Field>
          <Field label="Industry · Stage">
            {prospect.industry} · {prospect.stage}
          </Field>
          <Field label="Recent funding">
            {prospect.recentFunding
              ? `${prospect.recentFunding.amount} ${prospect.recentFunding.round} · ${prospect.recentFunding.date}`
              : "—"}
          </Field>
          <Field label="Best-fit demo">
            <a
              href={`/${prospect.bestFitDemo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--brain-accent-2)] hover:underline mono text-xs"
            >
              /{prospect.bestFitDemo} →
            </a>
          </Field>
          <Field label="Estimated budget">{prospect.estimatedBudget}</Field>
        </dl>

        <div className="mt-6 panel-2 p-4">
          <div className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-2">
            Trigger signal
          </div>
          <p className="text-sm leading-relaxed">{prospect.trigger}</p>
        </div>

        <div className="mt-4 panel-2 p-4">
          <div className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-2">
            Brand weakness (our angle)
          </div>
          <p className="text-sm leading-relaxed">{prospect.brandWeakness}</p>
        </div>
      </div>

      {/* draft controls */}
      <div className="panel p-6">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-4">
          — Draft email
        </div>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { key: "funding", label: "Funding trigger" },
              { key: "launch", label: "Launch trigger" },
              { key: "brand-weakness", label: "Brand weakness" },
              { key: "hire", label: "Team hire" },
            ] as { key: Variant; label: string }[]
          ).map((v) => (
            <button
              key={v.key}
              onClick={() => onDraft(v.key)}
              disabled={drafting}
              className="btn btn-primary"
            >
              {drafting ? "Drafting…" : v.label}
            </button>
          ))}
        </div>
        <div className="mt-3 mono text-[10px] uppercase tracking-[0.2em] text-[var(--brain-muted)]">
          GPT-4o · grounded on /marketing/*.md · ~1500 tokens per draft
        </div>
      </div>

      {/* drafts list */}
      {drafts.length > 0 && (
        <div className="panel p-6">
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-5">
            Drafts · {drafts.length}
          </div>
          <ul className="space-y-6">
            {drafts
              .slice()
              .reverse()
              .map((d) => (
                <li key={d.id} className="panel-2 p-5">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-base">{d.subject}</div>
                      <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--brain-muted)] mt-1">
                        {d.variant} · {d.persona} · {d.model}
                        {d.tokensUsed ? ` · ${d.tokensUsed} tokens` : ""}
                      </div>
                    </div>
                    <span className="chip">
                      {d.approved ? "approved" : "draft"}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--brain-fg)] font-[var(--font-geist-sans)]">
                    {d.body}
                  </pre>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
