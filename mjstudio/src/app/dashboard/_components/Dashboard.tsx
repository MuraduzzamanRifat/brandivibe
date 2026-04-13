"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import type { Prospect, Draft, Activity, Article } from "@/lib/brain-storage";
import { ProspectList } from "./ProspectList";
import { DraftPanel } from "./DraftPanel";
import { BrainPanel } from "./BrainPanel";

type BrainPayload = {
  prospects: Prospect[];
  drafts: Draft[];
  articles?: Article[];
  seeded?: number;
};

type SourceSummary = {
  sourced: number;
  alreadyKnown: number;
  extracted: number;
  skipped: number;
  errors: number;
  tokens: number;
};

export function Dashboard() {
  const [data, setData] = useState<BrainPayload | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [drafting, setDrafting] = useState<string | null>(null);
  const [sourcing, setSourcing] = useState(false);
  const [lastSource, setLastSource] = useState<SourceSummary | null>(null);
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

  const fetchBrain = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pRes, aRes] = await Promise.all([
        fetch("/api/dashboard/prospects", { cache: "no-store" }),
        fetch("/api/dashboard/activities", { cache: "no-store" }),
      ]);
      if (!pRes.ok) throw new Error(`prospects HTTP ${pRes.status}`);
      const json = (await pRes.json()) as BrainPayload;
      setData(json);
      if (aRes.ok) {
        const aJson = (await aRes.json()) as { activities: Activity[] };
        setActivities(aJson.activities ?? []);
      }
      setSelectedId((prev) => prev ?? json.prospects[0]?.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load brain");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrain();
  }, [fetchBrain]);

  async function runSource() {
    setSourcing(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/source", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setLastSource(json.summary as SourceSummary);
      await fetchBrain();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Source run failed");
    } finally {
      setSourcing(false);
    }
  }

  async function draftEmail(
    prospectId: string,
    variant: "funding" | "launch" | "hire" | "brand-weakness" = "funding"
  ) {
    setDrafting(prospectId);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/draft", {
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
    const real = p.filter((x) => x.source && x.source !== "seed").length;
    return {
      total: p.length,
      real,
      tierA: p.filter((x) => x.icpTier === "A").length,
      drafted: p.filter((x) => x.status === "drafted").length,
      drafts: data.drafts.length,
      tokens: activities.reduce((sum, a) => sum + (a.tokens ?? 0), 0),
    };
  }, [data, activities]);

  return (
    <main className="min-h-screen px-6 md:px-10 py-10">
      <header className="mx-auto max-w-[1600px] mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--brain-muted)] mb-2">
              — Brandivibe · Internal
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="btn btn-ghost">
              ← Brandivibe home
            </a>
            <button
              onClick={runSource}
              className="btn btn-ghost"
              disabled={sourcing}
            >
              {sourcing ? "Sourcing…" : "Run sources"}
            </button>
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
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <StatCard label="Total prospects" value={stats.total} />
            <StatCard label="Real (scraped)" value={stats.real} />
            <StatCard label="Tier A" value={stats.tierA} accent="A" />
            <StatCard label="Drafted" value={stats.drafted} />
            <StatCard label="Drafts (all)" value={stats.drafts} />
            <StatCard label="Tokens spent" value={stats.tokens} />
          </div>
        )}

        {lastSource && (
          <div className="mt-6 panel p-4">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--brain-muted)] mb-2">
              Last source run
            </div>
            <div className="text-sm text-[var(--brain-muted)]">
              Fetched <b className="text-white">{lastSource.sourced}</b> trigger articles · added{" "}
              <b className="text-white">{lastSource.extracted}</b> new prospects · skipped{" "}
              <b className="text-white">{lastSource.skipped}</b> off-ICP ·{" "}
              <b className="text-white">{lastSource.alreadyKnown}</b> already known ·{" "}
              <b className="text-white">{lastSource.tokens}</b> tokens
              {lastSource.errors > 0 && (
                <> · <span className="text-[var(--brain-danger)]">{lastSource.errors} errors</span></>
              )}
            </div>
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

      <div className="mx-auto max-w-[1600px]">
        <BrainPanel articles={data?.articles ?? []} />
      </div>

      <div className="mx-auto max-w-[1600px] mt-8">
        <ActivityFeed activities={activities} />
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

function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="panel p-6">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-3">
          Activity feed
        </div>
        <div className="text-sm text-[var(--brain-muted)]">
          No activity yet. Click &quot;Run sources&quot; to fetch real prospects from TechCrunch.
        </div>
      </div>
    );
  }
  const colorFor = (t: Activity["type"]) => {
    switch (t) {
      case "prospect-added": return "var(--brain-accent)";
      case "draft-generated": return "#84e1ff";
      case "error": return "var(--brain-danger)";
      case "prospect-skipped": return "var(--brain-muted)";
      default: return "var(--brain-muted)";
    }
  };
  return (
    <div className="panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)]">
          Activity feed · real AI execution log
        </div>
        <div className="mono text-[10px] text-[var(--brain-muted)]">{activities.length} events</div>
      </div>
      <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        {activities.map((a) => (
          <li key={a.id} className="flex gap-3 text-sm">
            <span
              className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: colorFor(a.type) }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[var(--brain-fg)] truncate">{a.description}</div>
              <div className="mono text-[10px] text-[var(--brain-muted)] mt-0.5">
                {new Date(a.timestamp).toLocaleString()}
                {a.model && <> · {a.model}</>}
                {a.tokens ? <> · {a.tokens} tokens</> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
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
