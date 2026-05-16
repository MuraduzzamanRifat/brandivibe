import Link from "next/link";
import { loadBrain } from "@/lib/brain-storage";

// Static read-only dashboard. The old admin app was a client UI hitting
// /api/* on Koyeb — gone now. This renders brain.json at BUILD time into a
// read-only operational snapshot. It refreshes whenever the brain commits
// brain.json (that commit triggers deploy-static). No server, no /api, no
// mutations — "run brain" / "approve" now live in the GitHub Actions tab.
export const dynamic = "force-static";

const SITE = "https://brandivibe.com";
const ACTIONS_URL = "https://github.com/MuraduzzamanRifat/brandivibe/actions";

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function Tile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/45">{sub}</div>}
    </div>
  );
}

export default async function DashboardPage() {
  const brain = await loadBrain();

  const prospects = brain.prospects ?? [];
  const articles = (brain.articles ?? [])
    .slice()
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const plans = (brain.plans ?? [])
    .slice()
    .sort((a, b) => (b.date > a.date ? 1 : -1));
  const learning = (brain.learning ?? [])
    .slice()
    .sort((a, b) => (b.date > a.date ? 1 : -1));
  const activities = (brain.activities ?? [])
    .slice()
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  const fbQueue = brain.fbQueue ?? [];
  const senders = brain.senderAccounts ?? [];
  const outbound = brain.outboundQueue ?? [];
  const twitter = brain.twitterIntent ?? [];
  const linkedin = brain.linkedinDrafts ?? [];
  const experiments = brain.experiments ?? [];

  const byStatus = prospects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const today = new Date().toISOString().slice(0, 10);
  const sentToday = senders.reduce(
    (n, s) => n + ((s.sentByDay ?? {})[today] ?? 0),
    0
  );
  const poolCap = senders
    .filter((s) => s.enabled && !s.circuitBreakerTrippedAt)
    .reduce((n, s) => n + (s.dailyCap ?? 0), 0);

  const avgSeo = articles.length
    ? Math.round(articles.reduce((n, a) => n + (a.seoScore ?? 0), 0) / articles.length)
    : 0;

  const fbQueued = fbQueue.filter((f) => f.status === "queued").length;

  return (
    <main className="min-h-screen text-white px-6 md:px-10 py-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#84e1ff] mb-2">
            Brandivibe · Brain operations
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Dashboard <span className="text-white/35 text-lg font-normal">· read-only</span>
          </h1>
          <p className="text-white/45 text-sm mt-2 max-w-2xl">
            Static snapshot from <code className="text-white/60">brain.json</code>, rebuilt
            whenever the brain commits state. No live controls here — trigger
            runs and approvals from the{" "}
            <a href={ACTIONS_URL} className="text-[#84e1ff] hover:underline">
              GitHub Actions tab
            </a>
            .
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
            Snapshot built
          </div>
          <div className="text-sm text-white/70 mt-1">
            {new Date().toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        <Tile label="Articles" value={articles.length} sub={`avg SEO ${avgSeo}/100`} />
        <Tile label="Prospects" value={prospects.length} sub={`${Object.keys(byStatus).length} stages`} />
        <Tile label="Outbound queue" value={outbound.length} />
        <Tile label="Sent today" value={sentToday} sub={`pool cap ${poolCap}`} />
        <Tile label="FB queue" value={fbQueued} sub={`${fbQueue.length} total`} />
        <Tile label="Plans" value={plans.length} />
        <Tile label="Learning" value={learning.length} sub="insights" />
        <Tile label="Experiments" value={experiments.length} />
        <Tile label="Twitter intent" value={twitter.length} />
        <Tile label="LinkedIn drafts" value={linkedin.length} />
        <Tile
          label="Senders"
          value={senders.filter((s) => s.enabled).length}
          sub={`${senders.length} total`}
        />
        <Tile label="Activity" value={activities.length} sub="logged events" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
            — Pipeline by stage
          </h2>
          <div className="rounded-xl border border-white/10 divide-y divide-white/5">
            {Object.entries(byStatus).length === 0 && (
              <div className="p-4 text-white/40 text-sm">No prospects yet.</div>
            )}
            {Object.entries(byStatus).map(([status, n]) => (
              <div key={status} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm capitalize">{status}</span>
                <span className="font-mono tabular-nums text-white/70">{n}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
            — Sender pool
          </h2>
          <div className="rounded-xl border border-white/10 divide-y divide-white/5">
            {senders.length === 0 && (
              <div className="p-4 text-white/40 text-sm">No senders configured.</div>
            )}
            {senders.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <span className="font-mono text-white/80">{s.id}</span>
                  <span className="text-white/40 ml-2">{s.domain}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono tabular-nums text-white/55">
                    {(s.sentByDay ?? {})[today] ?? 0}/{s.dailyCap}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider ${
                      s.circuitBreakerTrippedAt
                        ? "text-red-400"
                        : s.enabled
                          ? "text-emerald-400"
                          : "text-white/30"
                    }`}
                  >
                    {s.circuitBreakerTrippedAt ? "tripped" : s.enabled ? "live" : "off"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
            — Recent articles
          </h2>
          <div className="rounded-xl border border-white/10 divide-y divide-white/5">
            {articles.length === 0 && (
              <div className="p-4 text-white/40 text-sm">
                No articles yet — run the daily brain task.
              </div>
            )}
            {articles.slice(0, 10).map((a) => (
              <Link
                key={a.id}
                href={`/journal/${a.slug}`}
                className="block px-4 py-3 hover:bg-white/[0.02]"
              >
                <div className="text-sm text-white/85 line-clamp-1">{a.title}</div>
                <div className="text-xs text-white/40 mt-1 font-mono">
                  SEO {a.seoScore}/100 · {a.wordCount}w · {fmtDate(a.publishedAt)}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
            — Learning insights
          </h2>
          <div className="rounded-xl border border-white/10 divide-y divide-white/5">
            {learning.length === 0 && (
              <div className="p-4 text-white/40 text-sm">No insights yet.</div>
            )}
            {learning.slice(0, 8).map((l) => (
              <div key={l.id} className="px-4 py-3">
                <div className="text-sm text-white/80">{l.insight}</div>
                <div className="text-xs text-white/40 mt-1 font-mono">
                  {l.signal} · {l.date}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
          — Activity log (latest 40)
        </h2>
        <div className="rounded-xl border border-white/10 divide-y divide-white/5">
          {activities.length === 0 && (
            <div className="p-4 text-white/40 text-sm">No activity logged yet.</div>
          )}
          {activities.slice(0, 40).map((a) => (
            <div key={a.id} className="flex items-start gap-4 px-4 py-2.5 text-sm">
              <span className="font-mono text-[10px] text-white/35 w-28 shrink-0 mt-0.5">
                {fmtDate(a.timestamp)}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-wider w-36 shrink-0 mt-0.5 ${
                  a.type === "error" ? "text-red-400" : "text-[#84e1ff]/70"
                }`}
              >
                {a.type}
              </span>
              <span className="text-white/70 flex-1">{a.description}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 pt-6 border-t border-white/10 text-white/35 text-xs flex flex-wrap items-center justify-between gap-3">
        <span>Read-only · regenerates on every brain.json commit · {SITE}</span>
        <a href={ACTIONS_URL} className="text-[#84e1ff] hover:underline">
          Trigger / inspect runs in GitHub Actions →
        </a>
      </footer>
    </main>
  );
}
