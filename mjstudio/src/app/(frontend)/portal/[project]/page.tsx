import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileDown, CheckCircle2, Circle, Clock } from "lucide-react";
import { getPortalUser } from "@/lib/portal/auth";
import { getProjectBundle } from "@/lib/portal/data";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalLogin } from "@/components/portal/PortalLogin";
import { MessageComposer } from "@/components/portal/MessageComposer";
import { ApprovalDecision } from "@/components/portal/ApprovalDecision";

export const metadata: Metadata = { title: "Project · Portal", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Doc = Record<string, unknown>;
const S = (v: unknown) => String(v ?? "");
const fmt = (iso: unknown) => {
  const s = S(iso);
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
};
const money = (n: unknown, ccy: unknown) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: S(ccy) || "USD" }).format(Number(n) || 0);

export default async function ProjectPage({ params }: { params: Promise<{ project: string }> }) {
  const { project: projectId } = await params;
  const user = await getPortalUser();
  if (!user) return <PortalLogin />;

  const b = await getProjectBundle(projectId, { id: user.id });
  if (!b.project) notFound(); // not theirs, or doesn't exist — same 404 either way

  const p = b.project;
  const percent = Number(p.completionPercent ?? 0) || b.derivedPercent;

  return (
    <>
      <PortalHeader name={user.name} />
      <main className="mx-auto max-w-[1000px] px-5 pb-28 pt-8 sm:px-8">
        <Link href="/portal" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>

        {/* ---- header ---- */}
        <div className="mt-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{S(p.name)}</h1>
          {p.summary ? <p className="mt-3 max-w-[60ch] text-foreground/70 leading-relaxed">{S(p.summary)}</p> : null}
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-6 text-sm">
                <span className="font-medium text-foreground">Progress</span>
                <span className="font-mono text-foreground/70">{percent}%</span>
              </div>
              <div className="h-2.5 w-[220px] overflow-hidden rounded-full bg-[rgba(42,35,31,0.10)]">
                <div className="h-full rounded-full bg-primary-strong" style={{ width: `${percent}%` }} />
              </div>
            </div>
            <Stat label="Status" value={statusLabel(S(p.status))} />
            {p.targetDate ? <Stat label="Target" value={fmt(p.targetDate)} /> : null}
          </div>
        </div>

        {/* ---- timeline / milestones ---- */}
        {b.milestones.length > 0 && (
          <Section title="Timeline">
            <ol className="relative space-y-5 border-l border-border pl-6">
              {b.milestones.map((m: Doc) => (
                <li key={S(m.id)} className="relative">
                  <span className="absolute -left-[31px] top-1">{milestoneIcon(S(m.status))}</span>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">{S(m.title)}</h3>
                    <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
                      {milestoneLabel(S(m.status))}
                      {m.dueDate ? ` · ${fmt(m.dueDate)}` : ""}
                    </span>
                  </div>
                  {m.description ? <p className="mt-1 text-[0.95rem] text-foreground/70">{S(m.description)}</p> : null}
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* ---- tasks ---- */}
        {b.tasks.length > 0 && (
          <Section title="Tasks">
            <ul className="space-y-2.5">
              {b.tasks.map((t: Doc) => (
                <li key={S(t.id)} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                  {S(t.status) === "done" ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-strong" />
                  ) : S(t.status) === "in-progress" ? (
                    <Clock className="h-5 w-5 shrink-0 text-amber" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted" />
                  )}
                  <span className={S(t.status) === "done" ? "text-foreground/55 line-through" : "text-foreground/85"}>
                    {S(t.title)}
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ---- approvals ---- */}
        {b.approvals.length > 0 && (
          <Section title="Approvals">
            <div className="space-y-4">
              {b.approvals.map((a: Doc) => (
                <div key={S(a.id)} className="card-soft p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">{S(a.title)}</h3>
                    <span className={`font-mono text-xs uppercase tracking-[0.12em] ${decisionColor(S(a.decision))}`}>
                      {decisionLabel(S(a.decision))}
                    </span>
                  </div>
                  {a.description ? <p className="mt-1.5 text-[0.95rem] text-foreground/70">{S(a.description)}</p> : null}
                  {fileLink(a.item)}
                  {S(a.decision) === "pending" ? (
                    <ApprovalDecision approvalId={S(a.id)} />
                  ) : a.clientComment ? (
                    <p className="mt-2 text-sm text-muted">Your note: {S(a.clientComment)}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ---- files ---- */}
        {b.files.length > 0 && (
          <Section title="Files">
            <ul className="grid gap-3 sm:grid-cols-2">
              {b.files.map((f: Doc) => (
                <li key={S(f.id)}>
                  <a
                    href={S(f.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="card-soft lift flex items-center gap-3 p-4"
                  >
                    <FileDown className="h-5 w-5 shrink-0 text-primary-strong" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{S(f.title) || S(f.filename)}</span>
                      <span className="block text-xs uppercase tracking-[0.12em] text-muted">{S(f.category)}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* ---- invoices ---- */}
        {b.invoices.length > 0 && (
          <Section title="Invoices">
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-border text-muted">
                  <tr>
                    <th className="p-4 font-mono text-xs uppercase tracking-[0.12em]">Invoice</th>
                    <th className="p-4 font-mono text-xs uppercase tracking-[0.12em]">Due</th>
                    <th className="p-4 font-mono text-xs uppercase tracking-[0.12em]">Total</th>
                    <th className="p-4 font-mono text-xs uppercase tracking-[0.12em]">Status</th>
                    <th className="p-4" />
                  </tr>
                </thead>
                <tbody>
                  {b.invoices.map((inv: Doc) => (
                    <tr key={S(inv.id)} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium text-foreground">{S(inv.number)}</td>
                      <td className="p-4 text-foreground/70">{fmt(inv.dueDate)}</td>
                      <td className="p-4 tabular-nums text-foreground">{money(inv.total, inv.currency)}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${invoiceColor(S(inv.status))}`}>
                          {invoiceLabel(S(inv.status))}
                        </span>
                      </td>
                      <td className="p-4">
                        {inv.paymentLink && S(inv.status) !== "paid" ? (
                          <a href={S(inv.paymentLink)} target="_blank" rel="noreferrer" className="font-medium text-primary-strong hover:text-primary-deep">
                            Pay →
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ---- messages ---- */}
        <Section title="Messages">
          <div className="space-y-3">
            {b.messages.length === 0 ? (
              <p className="text-foreground/60">No messages yet. Say hello — the team will see it.</p>
            ) : (
              b.messages.map((msg: Doc) => {
                const sender = msg.sender as Doc | undefined;
                const mine = sender && S(sender.id) === user.id;
                return (
                  <div key={S(msg.id)} className={`max-w-[80%] rounded-2xl px-4 py-3 ${mine ? "ml-auto bg-primary-soft" : "bg-surface-2 border border-border"}`}>
                    <p className="text-foreground/85 leading-relaxed">{S(msg.body)}</p>
                    <p className="mt-1.5 text-xs text-muted">
                      {sender ? S(sender.name) : "Someone"} · {fmt(msg.createdAt)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          <MessageComposer projectId={projectId} />
        </Section>
      </main>
    </>
  );
}

// ---- small server helpers --------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{label}</div>
      <div className="mt-0.5 font-medium text-foreground">{value}</div>
    </div>
  );
}

function fileLink(item: unknown) {
  if (!item || typeof item !== "object") return null;
  const f = item as Doc;
  if (!f.url) return null;
  return (
    <a href={S(f.url)} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary-strong hover:text-primary-deep">
      <FileDown className="h-4 w-4" /> {S(f.title) || S(f.filename) || "View file"}
    </a>
  );
}

const statusLabel = (s: string) =>
  ({ discovery: "Discovery", design: "Design", development: "In development", review: "In review", launched: "Launched", "on-hold": "On hold", complete: "Complete" }[s] ?? s);
const milestoneLabel = (s: string) => ({ upcoming: "Upcoming", "in-progress": "In progress", done: "Done", blocked: "Blocked" }[s] ?? s);
const milestoneIcon = (s: string) =>
  s === "done" ? (
    <CheckCircle2 className="h-5 w-5 text-primary-strong" />
  ) : s === "in-progress" ? (
    <Clock className="h-5 w-5 text-amber" />
  ) : (
    <Circle className="h-5 w-5 text-muted" />
  );
const decisionLabel = (s: string) => ({ pending: "Awaiting you", approved: "Approved", changes: "Changes requested" }[s] ?? s);
const decisionColor = (s: string) => (s === "approved" ? "text-primary-strong" : s === "changes" ? "text-amber" : "text-muted");
const invoiceLabel = (s: string) => ({ draft: "Draft", sent: "Sent", paid: "Paid", overdue: "Overdue", void: "Void" }[s] ?? s);
const invoiceColor = (s: string) =>
  s === "paid" ? "bg-primary-soft text-primary-strong" : s === "overdue" ? "bg-[#fdecea] text-[#c0392b]" : "bg-surface-2 text-foreground/70";
