"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  CrmContact,
  CrmEmail,
  EmailTemplate,
  CrmContactStatus,
} from "@/lib/brain-storage";

/**
 * CRM Panel — unified contact datastore + manual email composer with fully
 * editable templates. Sits inside the dashboard under the "CRM" tab.
 *
 * Architecture:
 * - Left column: contact list with filter + sync button
 * - Middle column: selected contact detail + compose pane
 * - Right column: send history for the selected contact
 * - Modal: template editor (create / edit / delete)
 *
 * Every template merge slot is applied client-side on "Load template", but
 * the user can freely edit every character of the subject and body in the
 * compose pane before hitting Send. Nothing is locked.
 */

type ContactWithMeta = CrmContact & { sentCount: number };

type Filter = "all" | CrmContactStatus;

export function CrmPanel() {
  const [contacts, setContacts] = useState<ContactWithMeta[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<CrmEmail[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQ, setSearchQ] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sending, setSending] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successFlash, setSuccessFlash] = useState<string | null>(null);
  const [editingTpl, setEditingTpl] = useState<EmailTemplate | null>(null);
  const [newContactOpen, setNewContactOpen] = useState(false);

  // ─────────── Loaders ───────────

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/contacts", { cache: "no-store" });
      const json = await res.json();
      setContacts(json.contacts ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "load failed");
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/templates", { cache: "no-store" });
      const json = await res.json();
      setTemplates(json.templates ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "templates load failed");
    }
  }, []);

  const fetchHistory = useCallback(async (contactId: string) => {
    try {
      const res = await fetch(`/api/crm/contacts/${contactId}`, { cache: "no-store" });
      const json = await res.json();
      setHistory(json.emails ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "history load failed");
    }
  }, []);

  useEffect(() => {
    fetchContacts();
    fetchTemplates();
  }, [fetchContacts, fetchTemplates]);

  useEffect(() => {
    if (selectedId) fetchHistory(selectedId);
    else setHistory([]);
  }, [selectedId, fetchHistory]);

  // ─────────── Actions ───────────

  async function syncFromSources() {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/contacts?sync=1", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "sync failed");
      setSuccessFlash(`+${json.added ?? 0} contacts imported`);
      await fetchContacts();
      setTimeout(() => setSuccessFlash(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function sendEmail() {
    if (!selectedId) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedId,
          subject: composeSubject,
          body: composeBody,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "send failed");
      setSuccessFlash("Sent — logged to history");
      setComposeSubject("");
      setComposeBody("");
      await Promise.all([fetchContacts(), fetchHistory(selectedId)]);
      setTimeout(() => setSuccessFlash(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "send failed");
    } finally {
      setSending(false);
    }
  }

  async function saveTemplate(tpl: Partial<EmailTemplate>) {
    try {
      const method = tpl.id ? "PATCH" : "POST";
      const url = tpl.id ? `/api/crm/templates/${tpl.id}` : "/api/crm/templates";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tpl),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "save failed");
      await fetchTemplates();
      setEditingTpl(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "save failed");
    }
  }

  async function deleteTemplate(id: string) {
    if (!confirm("Delete this template?")) return;
    try {
      await fetch(`/api/crm/templates/${id}`, { method: "DELETE" });
      await fetchTemplates();
    } catch (e) {
      setError(e instanceof Error ? e.message : "delete failed");
    }
  }

  async function patchContact(id: string, patch: Partial<CrmContact>) {
    try {
      await fetch(`/api/crm/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      await fetchContacts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "update failed");
    }
  }

  async function createManualContact(payload: {
    name: string;
    email: string;
    company?: string;
    website?: string;
    location?: string;
    notes?: string;
  }) {
    try {
      const res = await fetch("/api/crm/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "create failed");
      await fetchContacts();
      setSelectedId(json.contact.id);
      setNewContactOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "create failed");
    }
  }

  // ─────────── Template merge ───────────

  const selected = useMemo(
    () => contacts.find((c) => c.id === selectedId) ?? null,
    [contacts, selectedId]
  );

  function mergeSlots(text: string, contact: CrmContact | null): string {
    if (!contact) return text;
    const vars: Record<string, string> = {
      firstName: contact.name.split(" ")[0] || "there",
      name: contact.name,
      company: contact.company || contact.website?.replace(/^https?:\/\/(www\.)?/, "").split(".")[0] || "",
      website: contact.website || "",
      domain: (contact.website || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, ""),
      location: contact.location || "",
      observation: contact.observation || "[observation — customize me]",
      email: contact.email,
      calendly: "https://brandivibe.com/contact",
    };
    return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
  }

  function loadTemplate(tpl: EmailTemplate) {
    setComposeSubject(mergeSlots(tpl.subject, selected));
    setComposeBody(mergeSlots(tpl.body, selected));
  }

  // ─────────── Filtering ───────────

  const filtered = useMemo(() => {
    let out = contacts;
    if (filter !== "all") out = out.filter((c) => c.status === filter);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      out = out.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company ?? "").toLowerCase().includes(q) ||
          (c.website ?? "").toLowerCase().includes(q)
      );
    }
    return out;
  }, [contacts, filter, searchQ]);

  // ─────────── Render ───────────

  return (
    <div className="mt-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="eyebrow mb-2">CRM &middot; manual outreach</div>
          <h2 className="display text-2xl md:text-3xl">
            Contacts, templates, <span className="serif text-[var(--brain-accent)]">send</span>
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setNewContactOpen(true)}
          >
            + New contact
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={syncFromSources}
            disabled={syncing}
          >
            {syncing ? "Syncing…" : "Sync from sources"}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              setEditingTpl({
                id: "",
                name: "",
                category: "custom",
                subject: "",
                body: "",
                isSystem: false,
                createdAt: "",
                updatedAt: "",
              })
            }
          >
            + Template
          </button>
        </div>
      </div>

      {error && <div className="mb-4 text-sm text-[var(--brain-danger)]">{error}</div>}
      {successFlash && (
        <div className="mb-4 text-sm text-[var(--brain-success)]">{successFlash}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_260px] gap-4">
        {/* ─── Contact list ─── */}
        <aside className="panel-2 p-4 max-h-[760px] overflow-y-auto">
          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search name, email, company"
            className="w-full mb-3 text-sm"
          />
          <div className="flex gap-1.5 flex-wrap mb-3">
            {(["all", "new", "contacted", "replied", "booked"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`chip ${filter === f ? "tier-A" : ""}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)] mb-2">
            {filtered.length} of {contacts.length}
          </div>
          <ul className="space-y-1.5">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                    selectedId === c.id
                      ? "bg-[var(--brain-accent)]/10 border-[var(--brain-accent)]/50"
                      : "border-[var(--brain-border)] hover:border-[var(--brain-border-strong)]"
                  }`}
                >
                  <div className="text-[13px] font-semibold text-[var(--brain-ink)] truncate">
                    {c.name}
                  </div>
                  <div className="mono text-[10px] text-[var(--brain-muted)] truncate">
                    {c.email}
                  </div>
                  <div className="flex items-center gap-2 mt-1 mono text-[9px] text-[var(--brain-muted)]">
                    <span className="uppercase tracking-wider">{c.status}</span>
                    {c.sentCount > 0 && (
                      <span className="text-[var(--brain-accent)]">
                        {c.sentCount} sent
                      </span>
                    )}
                    <span className="opacity-60">·</span>
                    <span className="opacity-60">{c.source}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ─── Compose pane ─── */}
        <section className="panel-2 p-6">
          {!selected ? (
            <div className="text-sm text-[var(--brain-muted)] py-16 text-center">
              Select a contact from the left to start composing.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="min-w-0">
                  <div className="text-xl font-semibold">{selected.name}</div>
                  <div className="mono text-[11px] text-[var(--brain-muted)]">
                    {selected.email}
                    {selected.company && <> &middot; {selected.company}</>}
                  </div>
                  {selected.website && (
                    <a
                      href={selected.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono text-[11px] text-[var(--brain-accent)] hover:underline"
                    >
                      {selected.website.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  )}
                  {selected.location && (
                    <div className="text-[11px] text-[var(--brain-muted)] mt-0.5">
                      {selected.location}
                    </div>
                  )}
                </div>
                <select
                  value={selected.status}
                  onChange={(e) =>
                    patchContact(selected.id, {
                      status: e.target.value as CrmContactStatus,
                    })
                  }
                  className="text-xs bg-transparent border border-[var(--brain-border)] rounded-lg px-3 py-2"
                >
                  {(
                    [
                      "new",
                      "contacted",
                      "replied",
                      "booked",
                      "closed-won",
                      "closed-lost",
                      "unsubscribed",
                    ] as CrmContactStatus[]
                  ).map((s) => (
                    <option key={s} value={s} className="bg-black">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {selected.observation && (
                <div className="mb-5 p-3 rounded-xl border border-[var(--brain-accent)]/20 bg-[var(--brain-accent)]/5">
                  <div className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-accent)] mb-1">
                    Deep-research observation
                  </div>
                  <div className="text-sm text-[var(--brain-ink)]">
                    {selected.observation}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-2">
                  Load a template (subject + body auto-merge with contact data)
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {templates.map((t) => (
                    <div key={t.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => loadTemplate(t)}
                        className="btn btn-ghost text-[11px] py-1.5 px-3"
                        title={`Load "${t.name}"`}
                      >
                        {t.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTpl(t)}
                        className="text-[10px] text-[var(--brain-muted)] hover:text-[var(--brain-accent)] px-1"
                        title="Edit template"
                      >
                        ✎
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
                  Subject (fully editable)
                </label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Type your subject line here"
                  className="w-full"
                />
              </div>
              <div className="mb-4">
                <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
                  Body (fully editable)
                </label>
                <textarea
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  rows={14}
                  placeholder="Load a template above or write from scratch"
                  className="w-full font-[Georgia,serif] text-[14px] leading-[1.6] resize-y min-h-[320px]"
                />
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="mono text-[10px] text-[var(--brain-muted)]">
                  Sends from{" "}
                  <span className="text-[var(--brain-accent)]">
                    hello@send.brandivibe.site
                  </span>{" "}
                  via Resend
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={sending || !composeSubject.trim() || !composeBody.trim()}
                  onClick={sendEmail}
                >
                  {sending ? "Sending…" : `Send to ${selected.name.split(" ")[0] || selected.email}`}
                </button>
              </div>

              <div className="mt-5">
                <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
                  Notes
                </label>
                <textarea
                  value={selected.notes ?? ""}
                  onChange={(e) => patchContact(selected.id, { notes: e.target.value })}
                  rows={2}
                  placeholder="Private notes visible only to you"
                  className="w-full text-[12px]"
                />
              </div>
            </>
          )}
        </section>

        {/* ─── History column ─── */}
        <aside className="panel-2 p-4 max-h-[760px] overflow-y-auto">
          <div className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-3">
            Send history
          </div>
          {history.length === 0 ? (
            <div className="text-xs text-[var(--brain-muted)]">
              {selected ? "No emails sent to this contact yet." : "Select a contact."}
            </div>
          ) : (
            <ul className="space-y-3">
              {history.map((e) => (
                <li key={e.id} className="border-l-2 border-[var(--brain-accent)]/30 pl-3">
                  <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)]">
                    {e.status} &middot; {e.sentAt ? new Date(e.sentAt).toLocaleString() : new Date(e.createdAt).toLocaleString()}
                  </div>
                  <div className="text-[12px] font-semibold text-[var(--brain-ink)] mt-0.5">
                    {e.subject}
                  </div>
                  <details className="mt-1">
                    <summary className="cursor-pointer text-[10px] text-[var(--brain-muted)]">
                      preview body
                    </summary>
                    <pre className="mt-1 whitespace-pre-wrap text-[10px] text-[var(--brain-muted)] font-sans">
                      {e.body.slice(0, 400)}
                      {e.body.length > 400 ? "…" : ""}
                    </pre>
                  </details>
                  {e.failReason && (
                    <div className="mt-1 text-[10px] text-[var(--brain-danger)]">
                      {e.failReason}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {/* ─── Template editor modal ─── */}
      {editingTpl && (
        <TemplateEditorModal
          template={editingTpl}
          onSave={saveTemplate}
          onDelete={editingTpl.id ? () => deleteTemplate(editingTpl.id) : undefined}
          onClose={() => setEditingTpl(null)}
        />
      )}

      {/* ─── New contact modal ─── */}
      {newContactOpen && (
        <NewContactModal
          onSave={createManualContact}
          onClose={() => setNewContactOpen(false)}
        />
      )}
    </div>
  );
}

// ─────────── Template editor modal ───────────

function TemplateEditorModal({
  template,
  onSave,
  onDelete,
  onClose,
}: {
  template: EmailTemplate;
  onSave: (tpl: Partial<EmailTemplate>) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(template.name);
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [category, setCategory] = useState<EmailTemplate["category"]>(template.category);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="panel max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="eyebrow mb-2">
              {template.id ? "Edit template" : "New template"}
            </div>
            <h3 className="display text-2xl">Fully editable</h3>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
              Template name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Post-audit loom offer"
              className="w-full"
            />
          </div>

          <div>
            <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EmailTemplate["category"])}
              className="text-sm bg-transparent border border-[var(--brain-border)] rounded-lg px-3 py-2"
            >
              {(["cold", "followup", "loom", "breakup", "audit", "custom"] as const).map((c) => (
                <option key={c} value={c} className="bg-black">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Use {{slots}} for merge fields"
              className="w-full"
            />
          </div>

          <div>
            <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              className="w-full font-[Georgia,serif] text-[14px] leading-[1.6]"
            />
            <div className="mt-2 mono text-[10px] text-[var(--brain-muted)]">
              Available slots: <span className="text-[var(--brain-accent)]">{"{{firstName}}"}</span>{" "}
              <span className="text-[var(--brain-accent)]">{"{{name}}"}</span>{" "}
              <span className="text-[var(--brain-accent)]">{"{{company}}"}</span>{" "}
              <span className="text-[var(--brain-accent)]">{"{{domain}}"}</span>{" "}
              <span className="text-[var(--brain-accent)]">{"{{website}}"}</span>{" "}
              <span className="text-[var(--brain-accent)]">{"{{location}}"}</span>{" "}
              <span className="text-[var(--brain-accent)]">{"{{observation}}"}</span>{" "}
              <span className="text-[var(--brain-accent)]">{"{{calendly}}"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--brain-border)]">
            {onDelete ? (
              <button type="button" onClick={onDelete} className="text-xs text-[var(--brain-danger)] hover:underline">
                Delete template
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                onSave({
                  id: template.id || undefined,
                  name,
                  subject,
                  body,
                  category,
                })
              }
            >
              Save template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────── New contact modal ───────────

function NewContactModal({
  onSave,
  onClose,
}: {
  onSave: (payload: {
    name: string;
    email: string;
    company?: string;
    website?: string;
    location?: string;
    notes?: string;
  }) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="panel max-w-lg w-full p-8" onClick={(e) => e.stopPropagation()}>
        <div className="eyebrow mb-2">Add contact manually</div>
        <h3 className="display text-2xl mb-6">New lead</h3>

        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name *"
            className="w-full"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email *"
            className="w-full"
          />
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company (optional)"
            className="w-full"
          />
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Website (optional)"
            className="w-full"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (optional)"
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[var(--brain-border)]">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!name.trim() || !email.trim()}
            onClick={() =>
              onSave({
                name: name.trim(),
                email: email.trim(),
                company: company.trim() || undefined,
                website: website.trim() || undefined,
                location: location.trim() || undefined,
              })
            }
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
