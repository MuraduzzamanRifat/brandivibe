"use client";

import { useCallback, useEffect, useState } from "react";
import type { Article, FbPost, Plan, LearningEntry } from "@/lib/brain-storage";

type QueueResponse = { fbQueue: FbPost[]; plans: Plan[]; learning: LearningEntry[] };

type Metrics = {
  window: string;
  tokens: number;
  articles: number;
  fbPublished: number;
  fbQueued: number;
  plansExecuted: number;
  plansTotal: number;
  avgSeo: number;
  totalPageviews: number;
  totalReach: number;
  totalClicks: number;
  insights: number;
  learning: LearningEntry[];
};

type Tab = "plans" | "queue" | "journal" | "scoreboard" | "outreach" | "leads";

type GmapsLead = {
  id: string;
  name: string;
  email: string;
  website: string;
  location: string;
  altEmails?: string[];
  query: string;
  scrapedAt: string;
};

type OutreachData = {
  queue: Array<{
    id: string;
    prospectId: string;
    to: string;
    subject: string;
    body: string;
    touch: number;
    status: string;
    sendAt: string;
    sentAt?: string;
    failReason?: string;
  }>;
  stats: {
    byStatus: { queued: number; sent: number; failed: number; suppressed: number };
    researched: number;
    inSequence: number;
    unsubscribed: number;
    dayIndex: number;
    alreadyToday: number;
    sendingSince?: string;
  };
  prospects: Array<{
    id: string;
    company: string;
    domain: string;
    icpTier: string;
    email: string;
    emailConfidence?: number;
    stage?: number;
    lastOutcome?: string;
    nextSendAt?: string;
    unsubscribed?: boolean;
    researchConfidence?: number;
  }>;
};

export function BrainPanel({ articles }: { articles: Article[] }) {
  const [tab, setTab] = useState<Tab>("plans");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [fbQueue, setFbQueue] = useState<FbPost[]>([]);
  const [learning, setLearning] = useState<LearningEntry[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [outreach, setOutreach] = useState<OutreachData | null>(null);
  const [gmapsLeads, setGmapsLeads] = useState<GmapsLead[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [qRes, mRes, oRes, lRes] = await Promise.all([
        fetch("/api/brain/queue", { cache: "no-store" }),
        fetch("/api/brain/metrics", { cache: "no-store" }),
        fetch("/api/brain/outreach", { cache: "no-store" }),
        fetch("/api/leads", { cache: "no-store" }),
      ]);
      if (qRes.ok) {
        const q = (await qRes.json()) as QueueResponse;
        setPlans(q.plans);
        setFbQueue(q.fbQueue);
        setLearning(q.learning);
      }
      if (mRes.ok) setMetrics((await mRes.json()) as Metrics);
      if (oRes.ok) setOutreach((await oRes.json()) as OutreachData);
      if (lRes.ok) {
        const l = (await lRes.json()) as { leads: GmapsLead[] };
        setGmapsLeads(l.leads ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "load failed");
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function runBrain() {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/brain/run-daily", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "run failed");
    } finally {
      setRunning(false);
    }
  }

  async function queueAction(id: string, action: "approve" | "reject") {
    try {
      await fetch("/api/brain/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "queue action failed");
    }
  }

  async function rate(kind: "article" | "fbPost" | "plan", id: string, vote: "up" | "down") {
    try {
      await fetch("/api/brain/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id, vote }),
      });
      await fetchAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "rate failed");
    }
  }

  const todayPlan = plans[0];

  return (
    <div className="mt-10 panel p-8 md:p-10">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-6">
        <div className="flex-1 min-w-[280px]">
          <div className="eyebrow mb-4">Autonomous brain</div>
          <h2 className="display text-2xl md:text-3xl">
            Daily plan, <span className="serif text-[var(--brain-accent)]">execute</span>, learn
          </h2>
        </div>
        <button onClick={runBrain} className="btn btn-primary" disabled={running}>
          {running ? "Running brain…" : "Run brain now"}
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-8">
        {(["plans", "outreach", "leads", "queue", "journal", "scoreboard"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn ${tab === t ? "btn-primary" : "btn-ghost"}`}
          >
            {t === "plans"
              ? "Plans"
              : t === "outreach"
              ? `Outreach (${outreach?.stats.inSequence ?? 0})`
              : t === "leads"
              ? `Maps Leads (${gmapsLeads.length})`
              : t === "queue"
              ? `FB Queue (${fbQueue.filter((p) => p.status === "queued").length})`
              : t === "journal"
              ? `Journal (${articles.length})`
              : "Scoreboard"}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 text-sm text-[var(--brain-danger)]">{error}</div>
      )}

      {tab === "plans" && (
        <div>
          {!todayPlan ? (
            <div className="text-sm text-[var(--brain-muted)]">
              No plan yet. Click &quot;Run brain now&quot; to generate today&apos;s plan, article, and FB queue.
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-2">
                  Today&apos;s article ({todayPlan.date})
                </div>
                <h3 className="text-xl font-semibold mb-2">{todayPlan.article.title}</h3>
                <p className="text-sm text-[var(--brain-muted)] mb-3">{todayPlan.article.excerpt}</p>
                <div className="text-xs text-[var(--brain-muted)] mb-3">
                  primary: <b className="text-white">{todayPlan.article.primaryKeyword}</b> ·{" "}
                  {todayPlan.article.secondaryKeywords?.join(", ")}
                </div>
                <details className="text-sm">
                  <summary className="cursor-pointer text-[var(--brain-muted)]">Outline</summary>
                  <ul className="mt-2 pl-5 list-disc text-sm text-[var(--brain-muted)] space-y-1">
                    {todayPlan.article.outline?.map((o: string, i: number) => <li key={i}>{o}</li>)}
                  </ul>
                </details>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => rate("plan", todayPlan.id, "up")} className="btn btn-ghost">👍</button>
                  <button onClick={() => rate("plan", todayPlan.id, "down")} className="btn btn-ghost">👎</button>
                </div>
              </div>

              <div>
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-2">
                  FB posts ({todayPlan.fbPosts?.length ?? 0})
                </div>
                <ul className="space-y-3">
                  {todayPlan.fbPosts?.map((p, i: number) => (
                    <li key={i} className="text-sm border-l-2 border-white/10 pl-3">
                      {p.body}
                      <div className="text-[10px] text-[var(--brain-muted)] mt-1">
                        {p.hashtags?.join(" ")}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-2">
                  Lead-gen actions
                </div>
                <ul className="space-y-3">
                  {todayPlan.leadGen?.map((a, i: number) => (
                    <li key={i} className="text-sm border-l-2 border-white/10 pl-3">
                      <div className="mono text-[10px] text-[var(--brain-muted)]">{a.kind} → {a.target}</div>
                      <div className="whitespace-pre-wrap">{a.script}</div>
                      <div className="text-[10px] text-[var(--brain-muted)] mt-1 italic">Why: {a.rationale}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "queue" && (
        <div>
          {fbQueue.length === 0 ? (
            <div className="text-sm text-[var(--brain-muted)]">Queue empty.</div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fbQueue.map((p) => (
                <li key={p.id} className="border border-white/10 rounded-2xl p-4">
                  <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)] mb-2">
                    {p.status} · {new Date(p.createdAt).toLocaleString()}
                  </div>
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="w-full rounded mb-3 border border-white/5" />
                  )}
                  <div className="text-sm whitespace-pre-wrap mb-3">{p.body}</div>
                  <div className="flex gap-2 flex-wrap">
                    {p.status === "queued" && (
                      <>
                        <button onClick={() => queueAction(p.id, "approve")} className="btn btn-primary">Approve</button>
                        <button onClick={() => queueAction(p.id, "reject")} className="btn btn-ghost">Reject</button>
                      </>
                    )}
                    <button onClick={() => rate("fbPost", p.id, "up")} className="btn btn-ghost">👍</button>
                    <button onClick={() => rate("fbPost", p.id, "down")} className="btn btn-ghost">👎</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "journal" && (
        <div>
          {articles.length === 0 ? (
            <div className="text-sm text-[var(--brain-muted)]">No articles published yet.</div>
          ) : (
            <ul className="space-y-3">
              {articles.map((a) => (
                <li key={a.id} className="border border-white/10 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <a href={`/journal/${a.slug}`} target="_blank" rel="noopener" className="font-semibold hover:text-[#84e1ff]">
                        {a.title}
                      </a>
                      <div className="text-xs text-[var(--brain-muted)] mt-1">
                        SEO {a.seoScore}/100 · {a.wordCount} words ·{" "}
                        {a.metrics ? `${a.metrics.pageviews} views` : "no traffic data"}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => rate("article", a.id, "up")} className="btn btn-ghost">👍</button>
                      <button onClick={() => rate("article", a.id, "down")} className="btn btn-ghost">👎</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "outreach" && outreach && (
        <div>
          <div className="eyebrow mb-5">Autonomous outbound</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Stat label="Researched" value={outreach.stats.researched} />
            <Stat label="In sequence" value={outreach.stats.inSequence} />
            <Stat label="Queued" value={outreach.stats.byStatus.queued} />
            <Stat label="Sent (all-time)" value={outreach.stats.byStatus.sent} />
            <Stat
              label="Warmup day"
              value={outreach.stats.dayIndex || "—"}
            />
            <Stat label="Sent today" value={outreach.stats.alreadyToday} />
            <Stat label="Failed" value={outreach.stats.byStatus.failed} />
            <Stat label="Unsubscribed" value={outreach.stats.unsubscribed} />
          </div>

          <div className="eyebrow mb-4">In-sequence prospects</div>
          {outreach.prospects.length === 0 ? (
            <div className="text-sm text-[var(--brain-muted)] mb-8">
              No prospects in sequence yet. Run &quot;Run sources&quot; to scrape from TechCrunch,
              then &quot;Run brain now&quot; to research, draft, and queue emails.
            </div>
          ) : (
            <ul className="space-y-2 mb-10 max-h-[360px] overflow-y-auto pr-2">
              {outreach.prospects.map((p) => (
                <li key={p.id} className="panel-2 p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`tier-${p.icpTier}`}>{p.icpTier}</span>
                      <span className="font-semibold">{p.company}</span>
                      <span className="mono text-[10px] text-[var(--brain-muted)]">
                        {p.domain}
                      </span>
                    </div>
                    <div className="mono text-[10px] text-[var(--brain-muted)]">
                      {p.email} · conf {p.emailConfidence ?? 0} · stage {p.stage ?? 0}/4
                      {p.lastOutcome && ` · ${p.lastOutcome}`}
                      {p.unsubscribed && " · UNSUBSCRIBED"}
                    </div>
                  </div>
                  <div className="mono text-[10px] text-[var(--brain-muted)] text-right shrink-0">
                    {p.nextSendAt ? `next: ${new Date(p.nextSendAt).toLocaleDateString()}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="eyebrow mb-4">Recent outbound queue · {outreach.queue.length} items</div>
          {outreach.queue.length === 0 ? (
            <div className="text-sm text-[var(--brain-muted)]">
              Outbound queue empty. Brain will fill it after research + sequence ticks run.
            </div>
          ) : (
            <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {outreach.queue.map((e) => (
                <li key={e.id} className="panel-2 p-4">
                  <div className="flex items-center justify-between mb-2 gap-4">
                    <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--brain-muted)]">
                      touch {e.touch} · {e.status}
                      {e.sendAt && ` · scheduled ${new Date(e.sendAt).toLocaleString()}`}
                    </div>
                    <div className="mono text-[10px] text-[var(--brain-muted)]">{e.to}</div>
                  </div>
                  <div className="font-semibold mb-2">{e.subject}</div>
                  <details>
                    <summary className="cursor-pointer text-[var(--brain-muted)] text-sm">
                      Preview body
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap text-[12px] text-[var(--brain-muted)] font-sans">
                      {e.body}
                    </pre>
                  </details>
                  {e.failReason && (
                    <div className="mt-2 text-[11px] text-[var(--brain-danger)]">
                      Failed: {e.failReason}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "leads" && (
        <div>
          <div className="eyebrow mb-5">Google Maps · scraped via Brandivibe extension</div>

          {gmapsLeads.length === 0 ? (
            <div className="panel-2 p-8">
              <div className="text-[15px] text-[var(--brain-muted)] mb-4">
                No leads scraped yet. Install the Chrome extension from{" "}
                <code className="text-[var(--brain-accent)]">chrome-extension/</code> in the repo, then scrape any Google Maps search to populate this list.
              </div>
              <div className="mono text-[10px] uppercase tracking-[0.25em] text-[var(--brain-muted)]">
                Quick install
              </div>
              <ol className="mt-2 text-sm text-[var(--brain-muted)] space-y-1.5 pl-5 list-decimal">
                <li>Open <code>chrome://extensions</code></li>
                <li>Toggle Developer mode on (top right)</li>
                <li>Click &quot;Load unpacked&quot; → select the <code>chrome-extension/</code> folder</li>
                <li>Right-click the extension icon → Inspect popup → console → run{" "}
                  <code className="block mt-1 text-[10px]">chrome.storage.local.set(&#123; ingestSecret: &quot;YOUR_BRAIN_CRON_SECRET&quot; &#125;)</code>
                </li>
                <li>Search Google Maps, click the extension icon, hit &quot;Scrape this page&quot;</li>
              </ol>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <Stat label="Leads w/ email" value={gmapsLeads.length} />
                <Stat
                  label="Unique domains"
                  value={
                    new Set(
                      gmapsLeads.map((l) => {
                        try {
                          return new URL(l.website).hostname.replace(/^www\./, "");
                        } catch {
                          return l.website;
                        }
                      })
                    ).size
                  }
                />
                <Stat
                  label="Unique queries"
                  value={new Set(gmapsLeads.map((l) => l.query)).size}
                />
              </div>

              <ul className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {gmapsLeads.map((l) => (
                  <li key={l.id} className="panel-2 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[var(--brain-ink)] mb-1">
                          {l.name}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <a
                            href={`mailto:${l.email}`}
                            className="text-[var(--brain-accent)] text-[13px]"
                          >
                            {l.email}
                          </a>
                          <a
                            href={l.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mono text-[10px] text-[var(--brain-muted)] truncate max-w-[300px] hover:text-[var(--brain-accent)]"
                          >
                            {l.website.replace(/^https?:\/\/(www\.)?/, "")}
                          </a>
                        </div>
                        {l.location && (
                          <div className="text-[11px] text-[var(--brain-muted)] mt-1">
                            {l.location}
                          </div>
                        )}
                        {l.altEmails && l.altEmails.length > 0 && (
                          <div className="mono text-[10px] text-[var(--brain-muted)] mt-1">
                            +{l.altEmails.length} alt email{l.altEmails.length === 1 ? "" : "s"}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0 mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)]">
                        {l.query}
                        <br />
                        {new Date(l.scrapedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {tab === "scoreboard" && metrics && (
        <div>
          <div className="eyebrow mb-5">Last 30 days</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Stat label="Articles" value={metrics.articles} />
            <Stat label="FB published" value={metrics.fbPublished} />
            <Stat label="Plans executed" value={`${metrics.plansExecuted}/${metrics.plansTotal}`} />
            <Stat label="Avg SEO" value={metrics.avgSeo} />
            <Stat label="Pageviews" value={metrics.totalPageviews} />
            <Stat label="FB reach" value={metrics.totalReach} />
            <Stat label="FB clicks" value={metrics.totalClicks} />
            <Stat label="Tokens spent" value={metrics.tokens} />
          </div>
          <div className="eyebrow mb-4">Learning insights · {metrics.learning.length}</div>
          {learning.length === 0 ? (
            <div className="text-sm text-[var(--brain-muted)]">No insights yet. Need 24h + metrics to learn.</div>
          ) : (
            <ul className="space-y-2">
              {learning.map((l) => (
                <li key={l.id} className="text-sm border-l-2 border-[#84e1ff]/40 pl-3">
                  <div>{l.insight}</div>
                  <div className="text-[10px] text-[var(--brain-muted)]">{l.date} · signal: {l.signal}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel-2 p-5">
      <div className="mono text-[9px] uppercase tracking-[0.28em] text-[var(--brain-muted)]">{label}</div>
      <div className="mt-3 stat-value">{typeof value === "number" ? value.toLocaleString() : value}</div>
    </div>
  );
}
