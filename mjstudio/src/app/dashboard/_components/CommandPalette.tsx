"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Global command palette — Cmd+K / Ctrl+K.
 *
 * Searches across:
 * - CRM contacts (fetched from /api/crm/contacts)
 * - Dashboard tabs
 * - Quick actions (new contact, run brain, run sources, etc)
 *
 * Keyboard:
 *   ↑↓  — move selection
 *   ⏎   — activate
 *   esc — close
 *
 * Usage: <CommandPalette onNavigate={setTab} onAction={runAction} />
 */

export type PaletteContact = {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
};

type Item =
  | { kind: "contact"; id: string; title: string; sub: string; icon: string; contact: PaletteContact }
  | { kind: "tab"; id: string; title: string; sub: string; icon: string; tab: string }
  | { kind: "action"; id: string; title: string; sub: string; icon: string; action: string };

const TAB_ITEMS: Omit<Extract<Item, { kind: "tab" }>, "kind">[] = [
  { id: "t-plans", title: "Plans", sub: "Today's article + content calendar", icon: "◆", tab: "plans" },
  { id: "t-crm", title: "CRM", sub: "Contacts, templates, compose", icon: "✎", tab: "crm" },
  { id: "t-outreach", title: "Outreach", sub: "Autonomous cold sequence", icon: "→", tab: "outreach" },
  { id: "t-leads", title: "Maps Leads", sub: "Google Maps scrape results", icon: "◎", tab: "leads" },
  { id: "t-queue", title: "FB Queue", sub: "Facebook posts awaiting approval", icon: "▣", tab: "queue" },
  { id: "t-journal", title: "Journal", sub: "Published articles", icon: "§", tab: "journal" },
  { id: "t-scoreboard", title: "Scoreboard", sub: "30-day metrics + learning", icon: "∴", tab: "scoreboard" },
];

const ACTION_ITEMS: Omit<Extract<Item, { kind: "action" }>, "kind">[] = [
  { id: "a-new-contact", title: "New contact", sub: "Create a CRM contact manually", icon: "＋", action: "new-contact" },
  { id: "a-run-brain", title: "Run brain now", sub: "Trigger daily plan + execute + score", icon: "▶", action: "run-brain" },
  { id: "a-run-sources", title: "Run sources", sub: "Scrape TechCrunch for fresh prospects", icon: "↻", action: "run-sources" },
  { id: "a-sync-crm", title: "Sync CRM from sources", sub: "Pull gmaps + prospects into CRM", icon: "⇅", action: "sync-crm" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onSelectContact: (contactId: string) => void;
  onAction: (action: string) => void;
};

export function CommandPalette({ open, onClose, onNavigate, onSelectContact, onAction }: Props) {
  const [query, setQuery] = useState("");
  const [contacts, setContacts] = useState<PaletteContact[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Fetch contacts on first open
  useEffect(() => {
    if (!open) return;
    fetch("/api/crm/contacts", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setContacts(j.contacts ?? []))
      .catch(() => {});
    setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  // Reset when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
    }
  }, [open]);

  // Build items list
  const items = useMemo<Item[]>(() => {
    const q = query.trim().toLowerCase();

    const contactItems: Item[] = contacts
      .filter((c) => {
        if (!q) return false;
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company ?? "").toLowerCase().includes(q)
        );
      })
      .slice(0, 8)
      .map((c) => ({
        kind: "contact" as const,
        id: `c-${c.id}`,
        title: c.name,
        sub: `${c.email}${c.company ? ` · ${c.company}` : ""} · ${c.status}`,
        icon: "◉",
        contact: c,
      }));

    const tabItems: Item[] = TAB_ITEMS.filter((t) =>
      !q || t.title.toLowerCase().includes(q) || t.sub.toLowerCase().includes(q)
    ).map((t) => ({ kind: "tab" as const, ...t }));

    const actionItems: Item[] = ACTION_ITEMS.filter((a) =>
      !q || a.title.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q)
    ).map((a) => ({ kind: "action" as const, ...a }));

    return [...contactItems, ...tabItems, ...actionItems];
  }, [query, contacts]);

  const activate = useCallback(
    (item: Item) => {
      if (item.kind === "contact") {
        onNavigate("crm");
        onSelectContact(item.contact.id);
      } else if (item.kind === "tab") {
        onNavigate(item.tab);
      } else if (item.kind === "action") {
        onAction(item.action);
      }
      onClose();
    },
    [onNavigate, onSelectContact, onAction, onClose]
  );

  // Keyboard handling
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(items.length - 1, i + 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = items[activeIdx];
        if (item) activate(item);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, items, activeIdx, activate, onClose]);

  // Reset active index when items change
  useEffect(() => {
    setActiveIdx(0);
  }, [items.length]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;

  // Group items by kind for section labels
  const groups: Array<{ label: string; items: Item[] }> = [];
  const byKind: Record<string, Item[]> = {};
  for (const it of items) {
    byKind[it.kind] = byKind[it.kind] ?? [];
    byKind[it.kind].push(it);
  }
  if (byKind.contact?.length) groups.push({ label: "Contacts", items: byKind.contact });
  if (byKind.tab?.length) groups.push({ label: "Jump to", items: byKind.tab });
  if (byKind.action?.length) groups.push({ label: "Actions", items: byKind.action });

  let globalIdx = 0;

  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          className="palette-input"
          placeholder="Search contacts, jump to tabs, run actions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="palette-list" ref={listRef}>
          {groups.length === 0 ? (
            <div className="palette-empty">No matches. Try a different query.</div>
          ) : (
            groups.map((g) => (
              <div key={g.label}>
                <div className="palette-section-label">{g.label}</div>
                {g.items.map((item) => {
                  const idx = globalIdx++;
                  return (
                    <div
                      key={item.id}
                      data-idx={idx}
                      className={`palette-item ${idx === activeIdx ? "is-active" : ""}`}
                      onClick={() => activate(item)}
                      onMouseEnter={() => setActiveIdx(idx)}
                    >
                      <div className="palette-icon">{item.icon}</div>
                      <div className="palette-main">
                        <div className="palette-title">{item.title}</div>
                        <div className="palette-sub">{item.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="palette-footer">
          <span><span className="kbd">↑</span> <span className="kbd">↓</span> move</span>
          <span><span className="kbd">↵</span> open</span>
          <span><span className="kbd">esc</span> close</span>
        </div>
      </div>
    </div>
  );
}
