"use client";

import { useEffect, useState, useMemo } from "react";
import type { Prospect, Draft } from "@/lib/brain-storage";
import { ProspectList } from "./ProspectList";
import { DraftPanel } from "./DraftPanel";

type BrainPayload = {
  prospects: Prospect[];
  drafts: Draft[];
  seeded?: number;
};

export function Dashboard() {
  const [data, setData] = useState<BrainPayload | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [drafting, setDrafting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => data?.prospects.find((p) => p.id === selectedId) ?? null,
    [data, selectedId]
  );
  const selectedDrafts = useMemo(
    () =>
      data?.drafts.filter((d) => d.prospectId === selectedId) ?? [],
    [data, selectedId]
  );

  async function fetchBrain() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai-brain/prospects", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as BrainPayload;
      setData(json);
      if (!selectedId && json.prospects.length > 0) {
        setSelectedId(json.prospects[0].id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load brain");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBrain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function draftEmail(
    prospectId: string,
    variant: "funding" | "launch" | "hire" | "brand-weakness" = "funding"
  ) {
    setDrafting(prospectId);
    setError(null);
    try {
      const res = await fetch("/api/ai-brain/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectId, variant }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }
      await fetchBrain();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Draft failed");
    } finally {
      setDrafting(null);
    }
  }

  const stats = useMemo(() => {
    if (!data) return null;
    const p = data.prospects;
    return {
      total: p.length,
      tierA: p.filter((x) => x.icpTier === "A").length,
      drafted: p.filter((x) => x.status === "drafted").length,
      sent: p.filter((x) => x.status === "sent" || x.status === "replied").length,
      drafts: data.drafts.length,
    };
  }, [data]);

  return (
    <main className="min-h-screen px-6 md:px-10 py-10">
      <header className="mx-auto max-w-[1600px] mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--brain-muted)] mb-2">
              — Brandivibe · Internal
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              AI Sales Brain
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="btn btn-ghost">
              ← Brandivibe home
            </a>
            <button
              onClick={fetchBrain}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              {isLoading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatCard label="Total prospects" value={stats.total} />
            <StatCard label="Tier A" value={stats.tierA} accent="A" />
            <StatCard label="Drafted" value={stats.drafted} />
            <StatCard label="Sent / replied" value={stats.sent} />
            <StatCard label="Drafts (all)" value={stats.drafts} />
          </div>
        )}

        {error && (
          <div className="mt-6 panel p-4 border-[var(--brain-danger)]/30">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--brain-danger)] mb-1">
              Error
            </div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        {data?.seeded && (
          <div className="mt-6 panel p-4 border-[var(--brain-accent)]/30">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--brain-accent)] mb-1">
              Seeded
            </div>
            <div className="text-sm text-[var(--brain-muted)]">
              First run detected. Seeded the brain with {data.seeded} fictional
              Tier-A prospects. You can draft cold emails against them
              immediately. Replace with real prospects later.
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-[1600px] grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
        <aside>
          <ProspectList
            prospects={data?.prospects ?? []}
            selectedId={selectedId}
            onSelect={setSelectedId}
            drafting={drafting}
          />
        </aside>
        <section>
          {selected ? (
            <DraftPanel
              prospect={selected}
              drafts={selectedDrafts}
              drafting={drafting === selected.id}
              onDraft={(variant) => draftEmail(selected.id, variant)}
            />
          ) : (
            <div className="panel p-10 text-center text-[var(--brain-muted)]">
              Select a prospect from the left to view details and draft an
              email.
            </div>
          )}
        </section>
      </div>

      <footer className="mx-auto max-w-[1600px] mt-16 pt-6 border-t border-[var(--brain-border)]">
        <div className="flex items-center justify-between mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)]">
          <span>Brandivibe · AI Sales Brain · v0.1</span>
          <span>GPT-4o · Grounded on /marketing</span>
        </div>
      </footer>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "A";
}) {
  return (
    <div className="panel p-5">
      <div className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)]">
        {label}
      </div>
      <div
        className={`mt-2 text-3xl font-semibold tabular-nums ${
          accent === "A" ? "tier-A" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
