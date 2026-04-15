"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlastConfig, EmailTemplate } from "@/lib/brain-storage";

type Rates = {
  deliveryRate: number;
  bounceRate: number;
  openRate: number;
  clickRate: number;
  complaintRate: number;
  unsubscribeRate: number;
};

type RecentEvent = {
  kind: "delivered" | "bounced" | "complained" | "opened" | "clicked" | "unsubscribed";
  email: string;
  at: string;
};

type StatusResponse = {
  config: BlastConfig | null;
  today: string;
  sentToday: number;
  effectiveCap: number;
  warmupDay: number;
  remainingToday: number;
  remainingTotal: number;
  rates: Rates | null;
  recent: RecentEvent[];
};

export function BlastPanel() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [uploading, setUploading] = useState(false);
  const [ticking, setTicking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [dailyCap, setDailyCap] = useState(500);
  const [pickedTemplateId, setPickedTemplateId] = useState<string>("");
  const [warmupEnabled, setWarmupEnabled] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  // Guard against clobbering in-progress edits when fetchStatus refetches
  // after a mutation — without this, typing a new cap then clicking Pause
  // would snap the input back to the old server value.
  const initialized = useRef(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/blast/status", { cache: "no-store" });
      const json = (await res.json()) as StatusResponse;
      setStatus(json);
      if (json.config && !initialized.current) {
        setDailyCap(json.config.dailyCap);
        if (json.config.templateId) setPickedTemplateId(json.config.templateId);
        setWarmupEnabled(json.config.warmupEnabled !== false);
        initialized.current = true;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "status fetch failed");
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/templates", { cache: "no-store" });
      const json = await res.json();
      setTemplates(json.templates ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "templates fetch failed");
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchTemplates();
  }, [fetchStatus, fetchTemplates]);

  function flashMsg(msg: string, ms = 3500) {
    setFlash(msg);
    setTimeout(() => setFlash(null), ms);
  }

  async function uploadFile() {
    const f = fileRef.current?.files?.[0];
    if (!f) {
      setError("pick a file first");
      return;
    }
    if (!pickedTemplateId) {
      setError("pick a template first");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("dailyCap", String(dailyCap));
      fd.append("templateId", pickedTemplateId);
      fd.append("warmupEnabled", warmupEnabled ? "true" : "false");
      const res = await fetch("/api/blast/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "upload failed");
      flashMsg(`Loaded ${json.config.totalRows.toLocaleString()} valid emails`);
      await fetchStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function runTick() {
    setTicking(true);
    setError(null);
    try {
      const res = await fetch("/api/blast/tick", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "tick failed");
      const s = json.summary;
      if (s.ran) {
        flashMsg(`Tick complete: ${s.sent} sent, ${s.failed} failed`);
      } else {
        flashMsg(`Tick skipped: ${s.reason}`);
      }
      await fetchStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "tick failed");
    } finally {
      setTicking(false);
    }
  }

  async function control(action: string, extra: Record<string, unknown> = {}) {
    try {
      const res = await fetch("/api/blast/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "control failed");
      await fetchStatus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "control failed");
    }
  }

  const cfg = status?.config;
  const progress =
    cfg && cfg.totalRows > 0
      ? Math.round((cfg.sentCount / cfg.totalRows) * 1000) / 10
      : 0;
  const daysRemaining =
    cfg && cfg.dailyCap > 0
      ? Math.ceil(Math.max(0, cfg.totalRows - cfg.sentCount) / cfg.dailyCap)
      : 0;

  return (
    <div className="mt-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="eyebrow mb-2">Blast &middot; cold-email drip</div>
          <h2 className="display text-2xl md:text-3xl">
            500 a day, <span className="serif text-[var(--brain-accent)]">on autopilot</span>
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {cfg?.status === "running" && (
            <button type="button" className="btn btn-ghost" onClick={() => control("pause")}>
              ⏸ Pause
            </button>
          )}
          {cfg?.status === "paused" && (
            <button type="button" className="btn btn-ghost" onClick={() => control("resume")}>
              ▶ Resume
            </button>
          )}
          {cfg && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (confirm("Reset the campaign? The list and progress will be cleared.")) {
                  control("reset");
                }
              }}
            >
              ✕ Reset
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={runTick}
            disabled={ticking || !cfg?.active}
          >
            {ticking ? "Sending…" : "▶ Run tick now"}
          </button>
        </div>
      </div>

      {flash && (
        <div className="mb-4 p-3 rounded-lg border border-[var(--brain-success)]/30 bg-[var(--brain-success)]/5 text-sm text-[var(--brain-success)]">
          {flash}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-lg border border-[var(--brain-danger)]/30 bg-[var(--brain-danger)]/5 text-sm text-[var(--brain-danger)]">
          {error}
        </div>
      )}

      {/* ─── Active campaign view ─── */}
      {cfg ? (
        <>
        {/* Circuit breaker banner */}
        {cfg.circuitBreakerTrippedAt && cfg.status === "paused" && (
          <div className="mb-6 p-4 rounded-lg border border-[var(--brain-danger)]/40 bg-[var(--brain-danger)]/10">
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-danger)] mb-1">
              ⚠ Circuit breaker tripped
            </div>
            <div className="text-sm text-[var(--brain-ink)]">
              Campaign auto-paused: {cfg.circuitBreakerReason ?? "unsafe send metrics"}
            </div>
            <div className="mono text-[10px] text-[var(--brain-muted)] mt-2">
              Review your list source before resuming. Clicking Resume acknowledges you&apos;ve cleaned the list.
            </div>
          </div>
        )}

        {/* Metrics strip — open / click / bounce / complaint / unsubscribe */}
        {status?.rates && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <RateCard
              label="Delivered"
              pct={status.rates.deliveryRate}
              count={cfg.metrics?.delivered ?? 0}
              tone="ok"
            />
            <RateCard
              label="Open rate"
              pct={status.rates.openRate}
              count={cfg.metrics?.uniqueOpened ?? 0}
              tone="accent"
            />
            <RateCard
              label="Click rate"
              pct={status.rates.clickRate}
              count={cfg.metrics?.uniqueClicked ?? 0}
              tone="accent"
            />
            <RateCard
              label="Bounce rate"
              pct={status.rates.bounceRate}
              count={cfg.metrics?.bounced ?? 0}
              tone="warn"
            />
            <RateCard
              label="Complaints"
              pct={status.rates.complaintRate}
              count={cfg.metrics?.complained ?? 0}
              tone="danger"
            />
            <RateCard
              label="Unsubscribes"
              pct={status.rates.unsubscribeRate}
              count={cfg.metrics?.unsubscribed ?? 0}
              tone="muted"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stats card */}
          <div className="panel p-6">
            <div className="eyebrow mb-4">Campaign · {cfg.status}</div>
            <div className="flex items-baseline gap-3 mb-4">
              <div className="display text-4xl">{cfg.sentCount.toLocaleString()}</div>
              <div className="mono text-xs text-[var(--brain-muted)]">
                of {cfg.totalRows.toLocaleString()} sent ({progress}%)
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden mb-6">
              <div
                className="h-full bg-[var(--brain-accent)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)]">
                  Sent today
                </div>
                <div className="serif italic text-2xl">
                  {status?.sentToday ?? 0}
                  <span className="mono text-xs text-[var(--brain-muted)] ml-1">
                    / {status?.effectiveCap ?? cfg.dailyCap}
                  </span>
                </div>
                {cfg.warmupEnabled && status && status.warmupDay > 0 && (
                  <div className="mono text-[10px] text-[var(--brain-accent)] mt-1">
                    warmup day {status.warmupDay} · target {cfg.dailyCap}
                  </div>
                )}
              </div>
              <div>
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)]">
                  Days remaining
                </div>
                <div className="serif italic text-2xl">{daysRemaining.toLocaleString()}</div>
              </div>
              <div>
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)]">
                  List file
                </div>
                <div className="text-xs truncate">{cfg.filename ?? "—"}</div>
              </div>
              <div>
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)]">
                  Last tick
                </div>
                <div className="text-xs">
                  {cfg.lastTickAt
                    ? new Date(cfg.lastTickAt).toLocaleString()
                    : "never"}
                </div>
              </div>
            </div>
          </div>

          {/* Settings card */}
          <div className="panel p-6">
            <div className="eyebrow mb-4">Settings</div>
            <div className="space-y-4">
              <div>
                <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
                  Daily cap
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    aria-label="Daily cap"
                    value={dailyCap}
                    onChange={(e) => setDailyCap(Number(e.target.value) || 0)}
                    min={1}
                    max={10000}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => control("set-cap", { dailyCap })}
                    disabled={dailyCap === cfg.dailyCap}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div>
                <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
                  Template
                </label>
                <div className="flex gap-2">
                  <select
                    aria-label="Blast template"
                    value={pickedTemplateId}
                    onChange={(e) => setPickedTemplateId(e.target.value)}
                    className="flex-1"
                  >
                    <option value="" className="bg-black">
                      — pick a template —
                    </option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id} className="bg-black">
                        {t.name} · {t.category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => control("set-template", { templateId: pickedTemplateId })}
                    disabled={!pickedTemplateId || pickedTemplateId === cfg.templateId}
                  >
                    Save
                  </button>
                </div>
                <div className="mt-2 mono text-[10px] text-[var(--brain-muted)]">
                  Available slots:{" "}
                  <span className="text-[var(--brain-accent)]">{"{{email}}"}</span>{" "}
                  <span className="text-[var(--brain-accent)]">{"{{domain}}"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--brain-border)]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    aria-label="Warmup ramp"
                    checked={cfg.warmupEnabled === true}
                    onChange={(e) =>
                      control("toggle-warmup", { warmupEnabled: e.target.checked })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-[var(--brain-ink)]">
                      Auto-ramp warmup
                    </div>
                    <div className="mono text-[10px] text-[var(--brain-muted)] mt-1 leading-relaxed">
                      Start at 25/day, +25 every day until {cfg.dailyCap}/day. Protects
                      the sender domain during the first 3 weeks. Recommended for new
                      sender domains.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Recent events feed */}
        {status?.recent && status.recent.length > 0 && (
          <div className="panel p-6 mt-6">
            <div className="eyebrow mb-4">Recent activity</div>
            <ul className="divide-y divide-[var(--brain-border)]">
              {status.recent.map((ev, i) => (
                <li key={i} className="py-2 flex items-center gap-3 text-sm">
                  <EventBadge kind={ev.kind} />
                  <span className="text-[var(--brain-ink)] truncate flex-1">{ev.email}</span>
                  <span className="mono text-[10px] text-[var(--brain-muted)] whitespace-nowrap">
                    {new Date(ev.at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        </>
      ) : (
        // ─── Upload flow ───
        <div className="panel p-8">
          <div className="eyebrow mb-3">No campaign yet</div>
          <h3 className="display text-xl mb-6">Upload your email list to start</h3>

          <div className="space-y-5">
            <div>
              <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-2 block">
                List file (.txt or .csv · one email per line)
              </label>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.csv,.tsv,text/plain,text/csv"
                aria-label="Blast list file"
                className="block w-full text-sm text-[var(--brain-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-[var(--brain-border)] file:bg-white/[0.04] file:text-[var(--brain-ink)] file:cursor-pointer hover:file:bg-white/[0.08]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
                  Daily cap
                </label>
                <input
                  type="number"
                  aria-label="Daily cap"
                  value={dailyCap}
                  onChange={(e) => setDailyCap(Number(e.target.value) || 0)}
                  min={1}
                  max={10000}
                  className="w-full"
                />
              </div>
              <div>
                <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
                  Template
                </label>
                <select
                  aria-label="Blast template"
                  value={pickedTemplateId}
                  onChange={(e) => setPickedTemplateId(e.target.value)}
                  className="w-full"
                >
                  <option value="" className="bg-black">
                    — pick a template —
                  </option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id} className="bg-black">
                      {t.name} · {t.category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-[var(--brain-border)] bg-white/[0.02]">
              <input
                type="checkbox"
                aria-label="Auto-ramp warmup"
                checked={warmupEnabled}
                onChange={(e) => setWarmupEnabled(e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="text-sm text-[var(--brain-ink)]">
                  Auto-ramp warmup <span className="text-[var(--brain-accent)]">(recommended)</span>
                </div>
                <div className="mono text-[10px] text-[var(--brain-muted)] mt-1 leading-relaxed">
                  Send 25 on day 1, 50 on day 2, ramping to your target cap over ~3 weeks.
                  Prevents the sender domain from being spam-flagged during first sends.
                </div>
              </div>
            </label>

            <div className="mono text-[10px] text-[var(--brain-muted)] leading-relaxed">
              The list is deduped + cleaned on upload. Invalid lines are dropped.
              Sender:{" "}
              <span className="text-[var(--brain-accent)]">hello@send.brandivibe.site</span>.
              Sends auto-paced 5 at a time with 1.5s spacing. Unsubscribe link is auto-appended.
              The circuit breaker auto-pauses the campaign if bounce rate exceeds 8% or
              complaint rate exceeds 0.5% once you&apos;ve sent at least 200 emails.
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={uploadFile}
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "Upload + start campaign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────── Rate card ───────────

function RateCard({
  label,
  pct,
  count,
  tone,
}: {
  label: string;
  pct: number;
  count: number;
  tone: "ok" | "accent" | "warn" | "danger" | "muted";
}) {
  const color =
    tone === "accent"
      ? "var(--brain-accent)"
      : tone === "ok"
      ? "var(--brain-success)"
      : tone === "warn"
      ? "#f59e0b"
      : tone === "danger"
      ? "var(--brain-danger)"
      : "var(--brain-muted)";

  return (
    <div className="panel p-4">
      <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)] mb-1">
        {label}
      </div>
      <div className="serif italic text-2xl leading-none" style={{ color }}>
        {pct}%
      </div>
      <div className="mono text-[10px] text-[var(--brain-muted)] mt-1">
        {count.toLocaleString()}
      </div>
    </div>
  );
}

// ─────────── Event badge ───────────

function EventBadge({ kind }: { kind: RecentEvent["kind"] }) {
  const styles: Record<RecentEvent["kind"], { bg: string; fg: string; label: string }> = {
    delivered: { bg: "rgba(74,222,128,0.15)", fg: "var(--brain-success)", label: "DELIVERED" },
    opened: { bg: "rgba(134,229,255,0.15)", fg: "var(--brain-accent)", label: "OPENED" },
    clicked: { bg: "rgba(167,139,250,0.18)", fg: "#a78bfa", label: "CLICKED" },
    bounced: { bg: "rgba(245,158,11,0.18)", fg: "#f59e0b", label: "BOUNCED" },
    complained: { bg: "rgba(248,113,113,0.18)", fg: "var(--brain-danger)", label: "SPAM" },
    unsubscribed: { bg: "rgba(237,237,240,0.08)", fg: "var(--brain-muted)", label: "UNSUB" },
  };
  const s = styles[kind];
  return (
    <span
      className="mono text-[9px] tracking-[0.15em] px-2 py-1 rounded-full whitespace-nowrap"
      style={{ background: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}
