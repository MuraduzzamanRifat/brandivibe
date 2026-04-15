"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  CrmContact,
  CrmEmail,
  EmailTemplate,
  CrmContactStatus,
} from "@/lib/brain-storage";
import { EMAIL_RE } from "@/lib/validators";

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

type CrmPanelProps = {
  /** Parent-controlled contact ID. When this changes, CrmPanel selects it. */
  externalSelectedId?: string | null;
  /** Parent trigger for the "new contact" modal (driven by command palette) */
  externalNewContactToken?: number;
};

export function CrmPanel({ externalSelectedId, externalNewContactToken }: CrmPanelProps = {}) {
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
  const [bulkOpen, setBulkOpen] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  // React to external contact selection from the command palette
  useEffect(() => {
    if (externalSelectedId) setSelectedId(externalSelectedId);
  }, [externalSelectedId]);

  // React to external "new contact" trigger from the command palette
  useEffect(() => {
    if (externalNewContactToken && externalNewContactToken > 0) setNewContactOpen(true);
  }, [externalNewContactToken]);

  // Keyboard: Escape exits focus mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusMode) {
        e.preventDefault();
        setFocusMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusMode]);

  // ─────────── Loaders ───────────

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/contacts", { cache: "no-store" });
      const json = await res.json();
      setContacts(json.contacts ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "load failed");
    } finally {
      setLoadingContacts(false);
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

  async function bulkImport(rows: Array<Record<string, string>>) {
    try {
      const res = await fetch("/api/crm/contacts/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "import failed");
      setSuccessFlash(
        `+${json.added} new · ${json.updated} updated · ${json.invalid} invalid`
      );
      await fetchContacts();
      setBulkOpen(false);
      setTimeout(() => setSuccessFlash(null), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "import failed");
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
            onClick={() => setBulkOpen(true)}
          >
            ⇪ Bulk import
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

      <div
        className={
          focusMode
            ? "grid grid-cols-1 gap-4"
            : "grid grid-cols-1 lg:grid-cols-[300px_1fr_260px] gap-4"
        }
      >
        {/* ─── Contact list ─── */}
        {!focusMode && <aside className="panel-2 p-4 max-h-[760px] overflow-y-auto">
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
          {loadingContacts ? (
            <ul className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="p-3 rounded-xl border border-[var(--brain-border)]">
                  <div className="skeleton skeleton-line-lg" style={{ width: "70%" }} />
                  <div className="skeleton skeleton-line" style={{ width: "90%" }} />
                  <div className="skeleton skeleton-line" style={{ width: "40%" }} />
                </li>
              ))}
            </ul>
          ) : contacts.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-3xl mb-3 opacity-30">◉</div>
              <div className="text-[13px] text-[var(--brain-muted)] mb-3">
                No contacts yet.
              </div>
              <button
                type="button"
                onClick={syncFromSources}
                className="btn btn-ghost text-[11px] py-1.5 px-3"
              >
                Sync from sources
              </button>
            </div>
          ) : (
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
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="text-[13px] font-semibold text-[var(--brain-ink)] truncate flex-1 min-w-0">
                        {c.name}
                      </div>
                      <span className={`status-pill status-${c.status}`}>{c.status}</span>
                    </div>
                    <div className="mono text-[10px] text-[var(--brain-muted)] truncate mb-1">
                      {c.email}
                    </div>
                    <div className="flex items-center gap-2 mono text-[9px] text-[var(--brain-muted)]">
                      {c.sentCount > 0 && (
                        <span className="text-[var(--brain-accent)]">
                          {c.sentCount} sent
                        </span>
                      )}
                      <span className="opacity-60">{c.source}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>}

        {/* ─── Compose pane ─── */}
        <section className="panel-2 p-6">
          {!selected ? (
            <div className="text-sm text-[var(--brain-muted)] py-16 text-center">
              Select a contact from the left to start composing.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="text-xl font-semibold">{selected.name}</div>
                    <span className={`status-pill status-${selected.status}`}>
                      {selected.status}
                    </span>
                  </div>
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
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setFocusMode((f) => !f)}
                    className="btn btn-ghost text-[11px] py-1.5 px-3"
                    title="Toggle focus mode (Esc to exit)"
                  >
                    {focusMode ? "Exit focus" : "Focus ⌃"}
                  </button>
                  <select
                    aria-label="Contact status"
                    value={selected.status}
                    onChange={(e) =>
                      patchContact(selected.id, {
                        status: e.target.value as CrmContactStatus,
                      })
                    }
                    className="text-xs px-3 py-2"
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
        {!focusMode && <aside className="panel-2 p-4 max-h-[760px] overflow-y-auto">
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
        </aside>}
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

      {/* ─── Bulk import modal ─── */}
      {bulkOpen && (
        <BulkImportModal
          onImport={bulkImport}
          onBulkUploadComplete={(msg) => {
            setSuccessFlash(msg);
            setBulkOpen(false);
            setTimeout(() => setSuccessFlash(null), 6000);
          }}
          onClose={() => setBulkOpen(false)}
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
              aria-label="Template category"
              value={category}
              onChange={(e) => setCategory(e.target.value as EmailTemplate["category"])}
              className="text-sm px-3 py-2"
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
              aria-label="Template body"
              placeholder="Hi {{firstName}}, ..."
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

// ─────────── Bulk import modal ───────────

const BULK_HEADERS = ["name", "email", "company", "website", "location", "notes"] as const;
type BulkRow = Record<(typeof BULK_HEADERS)[number], string>;

/**
 * Parse pasted CSV/TSV. Rules:
 * - Auto-detect tab vs comma based on the first non-empty line
 * - First line is treated as a header IF it contains "email" (case-insensitive)
 *   and at least one other known column. Otherwise we assume positional order:
 *   name, email, company, website, location, notes
 * - Quoted CSV fields supported (basic — handles "a, b" but not escaped quotes)
 * - Empty lines skipped
 */
function parseBulk(text: string): { rows: BulkRow[]; warnings: string[] } {
  const warnings: string[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return { rows: [], warnings };

  const sep = lines[0].includes("\t") ? "\t" : ",";

  function splitLine(line: string): string[] {
    if (sep === "\t") return line.split("\t").map((c) => c.trim());
    // Basic CSV split that respects double-quoted fields
    const out: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQ = !inQ;
        continue;
      }
      if (ch === "," && !inQ) {
        out.push(cur.trim());
        cur = "";
        continue;
      }
      cur += ch;
    }
    out.push(cur.trim());
    return out;
  }

  const firstCells = splitLine(lines[0]).map((c) => c.toLowerCase());
  const looksLikeHeader =
    firstCells.includes("email") &&
    firstCells.some((c) => c !== "email" && (BULK_HEADERS as readonly string[]).includes(c));

  let header: string[];
  let dataLines: string[];
  if (looksLikeHeader) {
    header = firstCells;
    dataLines = lines.slice(1);
  } else {
    header = [...BULK_HEADERS];
    dataLines = lines;
  }

  const colIdx: Partial<Record<(typeof BULK_HEADERS)[number], number>> = {};
  for (const key of BULK_HEADERS) {
    const idx = header.indexOf(key);
    if (idx !== -1) colIdx[key] = idx;
  }

  if (colIdx.email === undefined) {
    // Fall back to positional even though we thought it was a header
    BULK_HEADERS.forEach((k, i) => {
      colIdx[k] = i;
    });
  }

  const rows: BulkRow[] = [];
  for (const line of dataLines) {
    const cells = splitLine(line);
    const row: BulkRow = {
      name: "",
      email: "",
      company: "",
      website: "",
      location: "",
      notes: "",
    };
    for (const key of BULK_HEADERS) {
      const i = colIdx[key];
      if (i !== undefined && cells[i] !== undefined) row[key] = cells[i];
    }
    rows.push(row);
  }

  const withEmail = rows.filter((r) => r.email.includes("@")).length;
  if (withEmail < rows.length) {
    warnings.push(`${rows.length - withEmail} row(s) missing a valid email — will be dropped`);
  }

  return { rows, warnings };
}

/**
 * Cheap sniff of a dropped file: reads the first 64KB as text and checks
 * whether most lines are JUST an email. Bulk mode kicks in for files larger
 * than 1 MB OR with an extrapolated row count > 5000, because those are too
 * big to route through the brain.json CRM store regardless of shape.
 */
async function sniffFile(
  file: File
): Promise<{ mode: "crm" | "bulk"; estimatedRows: number; emailOnly: boolean }> {
  const head = await file.slice(0, 64 * 1024).text();
  const lines = head.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const emailOnlyCount = lines.filter((l) => EMAIL_RE.test(l)).length;
  const looksEmailOnly = lines.length > 0 && emailOnlyCount / lines.length > 0.8;

  // If the whole file fits in the 64KB sample, no extrapolation needed.
  const fullyRead = file.size <= head.length;
  const avgLineBytes = head.length / Math.max(1, lines.length);
  const rawEstimate = fullyRead
    ? lines.length
    : Math.floor(file.size / Math.max(1, avgLineBytes));
  // Clamp so extrapolation can never be LESS than what we already observed.
  const estimatedRows = Math.max(rawEstimate, lines.length);

  const mode: "crm" | "bulk" =
    looksEmailOnly && (file.size > 1024 * 1024 || estimatedRows > 5000) ? "bulk" : "crm";

  return { mode, estimatedRows, emailOnly: looksEmailOnly };
}

type BlastStatusPeek = {
  config: { totalRows: number; sentCount: number; filename?: string } | null;
};

function BulkImportModal({
  onImport,
  onBulkUploadComplete,
  onClose,
}: {
  onImport: (rows: BulkRow[]) => Promise<void>;
  onBulkUploadComplete: (msg: string) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState("");
  const [importing, setImporting] = useState(false);

  // Bulk-mode state — set when the dropped file is a huge email-only list
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkInfo, setBulkInfo] = useState<{ mode: "crm" | "bulk"; estimatedRows: number } | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [existingBlast, setExistingBlast] = useState<BlastStatusPeek["config"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch current blast status once so we can warn if the upload overwrites
  useEffect(() => {
    fetch("/api/blast/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: BlastStatusPeek) => setExistingBlast(j.config))
      .catch(() => {});
  }, []);

  const parsed = useMemo(() => parseBulk(text), [text]);
  const validRows = useMemo(
    () => parsed.rows.filter((r) => r.name.trim() && r.email.includes("@")),
    [parsed.rows]
  );

  async function onFile(file: File) {
    setError(null);
    // Sniff the file first — if it looks like a big email-only list, flip
    // into bulk mode and skip the in-browser parse (15MB textarea is painful)
    const info = await sniffFile(file);
    if (info.mode === "bulk") {
      setBulkFile(file);
      setBulkInfo(info);
      setText(""); // clear CRM-path state
      return;
    }
    // Small CRM-sized file — read it into the textarea for the existing flow
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result ?? ""));
    };
    reader.readAsText(file);
    setBulkFile(null);
    setBulkInfo(null);
  }

  async function submit() {
    if (validRows.length === 0) return;
    setImporting(true);
    try {
      await onImport(validRows);
    } finally {
      setImporting(false);
    }
  }

  async function submitBulk() {
    if (!bulkFile) return;
    if (
      existingBlast &&
      existingBlast.totalRows > 0 &&
      !confirm(
        `You already have an active blast campaign (${existingBlast.totalRows.toLocaleString()} emails, ${existingBlast.sentCount.toLocaleString()} sent). Uploading this file will REPLACE it and reset progress. Continue?`
      )
    ) {
      return;
    }
    setBulkUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", bulkFile);
      // Default cap + warmup on — user can tune in the Blast tab after upload
      fd.append("dailyCap", "500");
      fd.append("warmupEnabled", "true");
      const res = await fetch("/api/blast/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "upload failed");
      onBulkUploadComplete(
        `${json.config.totalRows.toLocaleString()} emails loaded into the Blast campaign. Pick a template in the Blast tab to start sending.`
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
    } finally {
      setBulkUploading(false);
    }
  }

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
            <div className="eyebrow mb-2">Bulk import</div>
            <h3 className="display text-2xl">Paste rows or drop a CSV</h3>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Close
          </button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg border border-[var(--brain-danger)]/30 bg-[var(--brain-danger)]/5 text-sm text-[var(--brain-danger)]">
              {error}
            </div>
          )}

          {/* ─── BULK BRANCH: big email-only list → blast ─── */}
          {bulkFile && bulkInfo ? (
            <>
              <div className="p-4 rounded-lg border border-[var(--brain-accent)]/30 bg-[var(--brain-accent)]/5">
                <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-accent)] mb-2">
                  Bulk list detected
                </div>
                <div className="text-sm text-[var(--brain-ink)] leading-relaxed">
                  <strong>{bulkFile.name}</strong>
                  <br />
                  <span className="mono text-[11px] text-[var(--brain-muted)]">
                    ~{bulkInfo.estimatedRows.toLocaleString()} rows · {(bulkFile.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <div className="mono text-[10px] text-[var(--brain-muted)] mt-3 leading-relaxed">
                  Lists this size don&apos;t fit in CRM contacts (they would blow up the
                  GitHub-synced brain.json). They&apos;ll be routed to your Blast campaign
                  instead — daily drip sending with warmup ramp, per-email tracking, and
                  the same Resend sender. After upload, go to the Blast tab to pick a
                  template and the campaign starts on the next tick.
                </div>
              </div>

              {existingBlast && existingBlast.totalRows > 0 && (
                <div className="p-3 rounded-lg border border-[#f59e0b]/30 bg-[#f59e0b]/5 text-xs text-[var(--brain-ink)]">
                  ⚠ An active blast already exists (
                  <strong>{existingBlast.totalRows.toLocaleString()}</strong> emails,{" "}
                  <strong>{existingBlast.sentCount.toLocaleString()}</strong> sent
                  {existingBlast.filename ? ` · ${existingBlast.filename}` : ""}).
                  Uploading will replace it and reset progress.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--brain-border)]">
                <button
                  type="button"
                  onClick={() => {
                    setBulkFile(null);
                    setBulkInfo(null);
                  }}
                  className="btn btn-ghost"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={bulkUploading}
                  onClick={submitBulk}
                >
                  {bulkUploading
                    ? "Uploading…"
                    : `Upload ${bulkInfo.estimatedRows.toLocaleString()} to Blast`}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ─── CRM BRANCH: small full-detail contacts ─── */}
              <div className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--brain-muted)] leading-relaxed">
                Format:{" "}
                <span className="text-[var(--brain-accent)]">name, email, company, website, location, notes</span>
                <br />
                Tab- or comma-separated. First row can be a header. One contact per line.
                <br />
                <span className="text-[var(--brain-accent)]">
                  Drop a huge email-only file and it routes to Blast automatically.
                </span>
              </div>

              <div>
                <label className="mono text-[9px] uppercase tracking-[0.25em] text-[var(--brain-muted)] mb-1 block">
                  Paste rows
                </label>
                <textarea
                  aria-label="Bulk paste"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={12}
                  placeholder={`name,email,company,website,location\nJane Doe,jane@acme.com,Acme,acme.com,Berlin\nJohn Smith,john@beta.io,Beta,beta.io,NYC`}
                  className="w-full font-[ui-monospace,monospace] text-[12px] leading-[1.55]"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="btn btn-ghost cursor-pointer" htmlFor="bulk-file">
                  ⬆ Upload file
                </label>
                <input
                  id="bulk-file"
                  type="file"
                  accept=".csv,.tsv,.txt,text/csv,text/plain"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void onFile(f);
                  }}
                />
                <span className="mono text-[10px] text-[var(--brain-muted)]">
                  {parsed.rows.length} parsed ·{" "}
                  <span className="text-[var(--brain-accent)]">{validRows.length} valid</span>
                  {parsed.warnings.length > 0 && (
                    <span className="text-[var(--brain-danger)]"> · {parsed.warnings[0]}</span>
                  )}
                </span>
              </div>

              {validRows.length > 0 && (
                <div className="border border-[var(--brain-border)] rounded-lg overflow-hidden">
                  <div className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--brain-muted)] px-3 py-2 border-b border-[var(--brain-border)] bg-white/[0.02]">
                    Preview · first 5
                  </div>
                  <div className="divide-y divide-[var(--brain-border)]">
                    {validRows.slice(0, 5).map((r, i) => (
                      <div key={i} className="px-3 py-2 text-xs flex items-baseline gap-3">
                        <strong className="text-[var(--brain-ink)] truncate max-w-[140px]">{r.name}</strong>
                        <span className="text-[var(--brain-accent)] truncate max-w-[200px]">{r.email}</span>
                        <span className="text-[var(--brain-muted)] truncate">{r.company || r.website}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--brain-border)]">
                <button type="button" onClick={onClose} className="btn btn-ghost">
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={validRows.length === 0 || importing}
                  onClick={submit}
                >
                  {importing
                    ? "Importing…"
                    : `Import ${validRows.length} contact${validRows.length === 1 ? "" : "s"}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
