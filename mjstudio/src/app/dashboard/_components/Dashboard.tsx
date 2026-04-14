"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import type {
  Prospect,
  Draft,
  Activity,
  Article,
  GmapsLead,
  CrmContact,
  CrmEmail,
} from "@/lib/brain-storage";
import { ProspectList } from "./ProspectList";
import { DraftPanel } from "./DraftPanel";
import { BrainPanel } from "./BrainPanel";

type BrainPayload = {
  prospects: Prospect[];
  drafts: Draft[];
  articles?: Article[];
  gmapsLeads?: GmapsLead[];
  crmContacts?: CrmContact[];
  crmEmails?: CrmEmail[];
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
    const contacts = data.crmContacts ?? [];
    const emails = data.crmEmails ?? [];
    const leads = data.gmapsLeads ?? [];

    const sentActivityCount = activities.filter(
      (a) => a.type === "email-sent" || a.type === "crm-email-sent"
    ).length;

    return {
      totalLeads: p.length + leads.length + contacts.length,
      tierA: p.filter((x) => x.icpTier === "A").length,
      emailsSent: emails.filter((e) => e.status === "sent").length + sentActivityCount,
      replies: contacts.filter((c) => c.status === "replied").length,
      bookings: contacts.filter((c) => c.status === "booked" || c.status === "closed-won").length,
      tokens: activities.reduce((sum, a) => sum + (a.tokens ?? 0), 0),
    };
  }, [data, activities]);

  const systemActive = useMemo(() => {
    if (!activities || activities.length === 0) return false;
    const latest = activities[0];
    const ageMs = Date.now() - new Date(latest.timestamp).getTime();
    return ageMs < 24 * 60 * 60 * 1000;
  }, [activities]);

  return (
    <main className="min-h-screen px-6 md:px-10 py-16 md:py-20">
      <header className="mx-auto max-w-[1600px] mb-12">
        <div className="flex items-start justify-between mb-10 gap-8 flex-wrap">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="eyebrow">Brandivibe · Internal</div>
              <span className={systemActive ? "system-status" : "system-status system-status-idle"}>
                {systemActive ? "System active" : "System idle"}
              </span>
            </div>
            <h1 className="display text-5xl md:text-6xl lg:text-7xl">
              Sales brain <span className="serif text-[var(--brain-accent)]">console</span>
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--brain-muted)] max-w-xl">
              Centralized control where the AI brain plans, executes, and
              learns from sales activities. Decision-making, task execution,
              and system feedback &mdash; not a chart dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/" className="btn btn-ghost">
              ← Home
            </Link>
            <button
              type="button"
              onClick={runSource}
              className="btn btn-ghost"
              disabled={sourcing}
            >
              {sourcing ? "Sourcing…" : "Run sources"}
            </button>
            <button
              type="button"
              onClick={fetchBrain}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              {isLoading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Total leads" value={stats.totalLeads} />
            <StatCard label="Tier A qualified" value={stats.tierA} accent="A" />
            <StatCard label="Emails sent" value={stats.emailsSent} />
            <StatCard label="Replies" value={stats.replies} />
            <StatCard label="Bookings" value={stats.bookings} />
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

      <footer className="mx-auto max-w-[1600px] mt-20">
        <div className="divider mb-6" />
        <div className="flex items-center justify-between flex-wrap gap-3 mono text-[10px] uppercase tracking-[0.28em] text-[var(--brain-muted)]">
          <span>Brandivibe · Sales brain</span>
          <span className="serif normal-case tracking-normal text-[13px] text-[var(--brain-muted)]">
            Grounded on <span className="text-[var(--brain-accent)]">/marketing</span> · powered by GPT-4o &amp; DALL-E 3
          </span>
        </div>
      </footer>
    </main>
  );
}

function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="panel p-8 md:p-10">
        <div className="eyebrow mb-4">Activity feed</div>
        <div className="text-[15px] text-[var(--brain-muted)]">
          No activity yet. Click <span className="text-white/80">Run sources</span> to fetch real prospects from TechCrunch.
        </div>
      </div>
    );
  }
  const colorFor = (t: Activity["type"]) => {
    switch (t) {
      case "prospect-added":
      case "article-published":
      case "insight-learned":
        return "var(--brain-success)";
      case "draft-generated":
      case "plan-generated":
      case "fb-published":
        return "var(--brain-accent)";
      case "fb-queued":
      case "metrics-pulled":
        return "var(--brain-accent-2)";
      case "error":
        return "var(--brain-danger)";
      default:
        return "var(--brain-muted)";
    }
  };
  return (
    <div className="panel p-8 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <div className="eyebrow">Activity feed · real execution log</div>
        <div className="mono text-[10px] text-[var(--brain-muted)]">{activities.length} events</div>
      </div>
      <ul className="space-y-3 max-h-[440px] overflow-y-auto pr-2">
        {activities.map((a) => (
          <li key={a.id} className="flex gap-4 text-sm group">
            <span
              className="mt-[7px] inline-block w-[6px] h-[6px] rounded-full shrink-0 pulse"
              style={{ background: colorFor(a.type), boxShadow: `0 0 12px ${colorFor(a.type)}` }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[var(--brain-ink)] text-[14px] leading-snug truncate group-hover:whitespace-normal">
                {a.description}
              </div>
              <div className="mono text-[10px] text-[var(--brain-muted)] mt-1 tracking-wider">
                {new Date(a.timestamp).toLocaleString()}
                {a.model && <> · {a.model}</>}
                {a.tokens ? <> · {a.tokens.toLocaleString()} tok</> : null}
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
    <div className="panel-2 p-5 md:p-6">
      <div className="mono text-[9px] uppercase tracking-[0.28em] text-[var(--brain-muted)]">
        {label}
      </div>
      <div className={`mt-3 stat-value ${accent === "A" ? "text-[#86e5ff]" : ""}`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}
