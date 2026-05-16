/**
 * Brandivibe API + CRM Worker
 * ───────────────────────────
 * brandivibe.com is a static GitHub Pages site (no server). This Cloudflare
 * Worker, mounted at brandivibe.com/api/* and brandivibe.com/crm*, restores
 * everything dynamic:
 *
 *   PUBLIC
 *   POST /api/contact     — contact form → emails the operator (Resend)
 *   POST /api/audit/run   — audit form  → captures the lead + notifies
 *
 *   CRM (password-gated, operator only — served entirely by this Worker,
 *        nothing sensitive ever touches the public static site)
 *   GET  /crm                       — login page or the CRM app
 *   POST /crm/login                 — password → signed session cookie
 *   POST /crm/logout
 *   GET    /api/crm/contacts        — list (+ sent count)
 *   POST   /api/crm/contacts        — add manual contact
 *   PATCH  /api/crm/contacts/:id    — update status/notes/tags/fields
 *   DELETE /api/crm/contacts/:id
 *   GET    /api/crm/templates       — list
 *   POST   /api/crm/templates       — create
 *   PATCH  /api/crm/templates/:id   — update
 *   DELETE /api/crm/templates/:id
 *   GET    /api/crm/emails?contactId=…   — email history for a contact
 *   POST   /api/crm/send            — send via Resend, log CrmEmail, bump contact
 *
 * Datastore: the SAME mjstudio/data/brain.json the brain reads/writes, via
 * the GitHub Contents API. Every write does GET(sha) → mutate → PUT(sha)
 * with one 409-retry so the brain (GitHub Actions) and the CRM never stomp
 * each other's commits.
 *
 * Secrets (wrangler secret put / dashboard → Settings → Variables):
 *   RESEND_API_KEY      required — Resend API key (forms + CRM send)
 *   BRAIN_GH_PAT        required for CRM — GitHub PAT, contents:write
 *   CRM_PASSWORD        required for CRM — the operator login password
 *   CRM_SESSION_SECRET  required for CRM — random 32+ char string (HMAC key)
 * Optional:
 *   GITHUB_REPO (default MuraduzzamanRifat/brandivibe)
 *   GITHUB_BRANCH (default main)
 *   GITHUB_BRAIN_PATH (default mjstudio/data/brain.json)
 *   NOTIFICATION_EMAIL, RESEND_FROM_EMAIL, RESEND_REPLY_TO
 */

const DEFAULT_NOTIFY = "mjrifat54@gmail.com";
const DEFAULT_FROM = "hello@send.brandivibe.site";
const FROM_NAME = "Muraduzzaman at Brandivibe";
const DEFAULT_REPO = "MuraduzzamanRifat/brandivibe";
const DEFAULT_BRAIN_PATH = "mjstudio/data/brain.json";
const SESSION_TTL = 60 * 60 * 12; // 12h

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(data, status = 200, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...(extraHeaders || {}) },
  });
}
function isValidEmail(e) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(String(e).trim());
}
function htmlEscape(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
function nowIso() {
  return new Date().toISOString();
}

/* ───────────────────────── Resend ───────────────────────── */

async function sendEmail(env, { to, subject, text, html, replyTo, from }) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  const fromEmail = env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const fromHeader = from || `${FROM_NAME} <${fromEmail}>`;
  const reply_to = replyTo || env.RESEND_REPLY_TO || fromEmail;
  let res;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, ...JSON_HEADERS },
      body: JSON.stringify({ from: fromHeader, to: [to], subject, text, html, reply_to }),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    return { ok: false, error: String(err) };
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `Resend ${res.status}: ${body}` };
  }
  const j = await res.json().catch(() => ({}));
  return { ok: true, id: j.id };
}

/* ──────────────── GitHub Contents API datastore ──────────────── */

function ghCfg(env) {
  const repo = env.GITHUB_REPO || DEFAULT_REPO;
  const token = env.BRAIN_GH_PAT;
  if (!token) throw new Error("BRAIN_GH_PAT not set");
  return {
    repo,
    token,
    branch: env.GITHUB_BRANCH || "main",
    path: env.GITHUB_BRAIN_PATH || DEFAULT_BRAIN_PATH,
  };
}

async function ghGetBrain(env) {
  const { repo, token, branch, path } = ghCfg(env);
  const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "brandivibe-crm-worker",
    },
  });
  if (!res.ok) throw new Error(`GitHub GET ${res.status}`);
  const j = await res.json();
  const decoded = decodeURIComponent(
    escape(atob(String(j.content || "").replace(/\n/g, "")))
  );
  return { data: JSON.parse(decoded), sha: j.sha };
}

async function ghPutBrain(env, data, sha, message) {
  const { repo, token, branch, path } = ghCfg(env);
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "brandivibe-crm-worker",
      ...JSON_HEADERS,
    },
    body: JSON.stringify({ message, content, sha, branch }),
  });
  return res;
}

/** GET → mutate(data) → PUT, with one retry if another writer (the brain)
 *  moved the SHA underneath us. Returns the mutate() return value. */
async function mutateBrain(env, message, mutate) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { data, sha } = await ghGetBrain(env);
    data.crmContacts = data.crmContacts ?? [];
    data.emailTemplates = data.emailTemplates ?? [];
    data.crmEmails = data.crmEmails ?? [];
    data.activities = data.activities ?? [];
    const result = await mutate(data);
    const res = await ghPutBrain(env, data, sha, message);
    if (res.ok) return result;
    if (res.status === 409 && attempt === 0) continue; // SHA moved — retry
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub PUT ${res.status}: ${body}`);
  }
}

/* ───────────────────────── Auth ───────────────────────── */

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function makeSession(env) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const payload = `v1.${exp}`;
  const sig = await hmac(env.CRM_SESSION_SECRET, payload);
  return `${payload}.${sig}`;
}

async function verifySession(env, cookieHeader) {
  if (!cookieHeader || !env.CRM_SESSION_SECRET) return false;
  const m = /(?:^|;\s*)bv_crm=([^;]+)/.exec(cookieHeader);
  if (!m) return false;
  const tok = decodeURIComponent(m[1]);
  const parts = tok.split(".");
  if (parts.length !== 3) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expect = await hmac(env.CRM_SESSION_SECRET, payload);
  if (expect !== parts[2]) return false;
  const exp = Number(parts[1]);
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000);
}

function sessionCookie(token) {
  return `bv_crm=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL}`;
}
const CLEAR_COOKIE = "bv_crm=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";

/* ───────────────── Public form handlers ───────────────── */

async function handleContact(req, env) {
  let b;
  try {
    b = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const name = String(b.name ?? "").trim();
  const email = String(b.email ?? "").trim().toLowerCase();
  const company = String(b.company ?? "").trim();
  const message = String(b.message ?? "").trim();
  if (!name) return json({ error: "Name required" }, 400);
  if (!isValidEmail(email)) return json({ error: "Valid email required" }, 400);
  if (!message) return json({ error: "Message required" }, 400);

  const subject = `New inquiry from ${name}${company ? ` — ${company}` : ""}`;
  const text = `New contact form submission — brandivibe.com\n\nName:    ${name}\nEmail:   ${email}\nCompany: ${company || "—"}\n\nMessage:\n${message}\n\n---\nReply directly to respond to ${name}.`;
  const html = `<div style="font-family:sans-serif;background:#0d0d0f;color:#e5e5e5;padding:32px;max-width:600px;margin:0 auto;"><div style="font-family:monospace;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#84e1ff;">— New Brandivibe inquiry</div><h1 style="color:#fff;font-size:22px;">${htmlEscape(name)} wants to talk</h1><p><b>Email:</b> <a href="mailto:${htmlEscape(email)}" style="color:#84e1ff;">${htmlEscape(email)}</a><br/>${company ? `<b>Company:</b> ${htmlEscape(company)}<br/>` : ""}</p><div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:18px;white-space:pre-wrap;">${htmlEscape(message)}</div></div>`;

  const r = await sendEmail(env, {
    to: env.NOTIFICATION_EMAIL || DEFAULT_NOTIFY,
    subject,
    text,
    html,
    replyTo: email,
  });
  if (!r.ok) {
    console.error("[contact] send failed:", r.error);
    return json({ error: "Failed to send" }, 502);
  }
  return json({ ok: true });
}

async function handleAuditRun(req, env) {
  let b;
  try {
    b = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const url = String(b.url ?? "").trim();
  const email = String(b.email ?? "").trim().toLowerCase();
  if (!url) return json({ error: "URL required" }, 400);
  if (!isValidEmail(email)) return json({ error: "Valid email required" }, 400);
  await sendEmail(env, {
    to: env.NOTIFICATION_EMAIL || DEFAULT_NOTIFY,
    subject: `Audit requested — ${url}`,
    text: `Audit request via brandivibe.com\n\nURL:   ${url}\nEmail: ${email}\n\nRun the audit and send the report to ${email}.`,
    html: `<div style="font-family:sans-serif;padding:24px;"><strong>Audit request</strong><br/>URL: ${htmlEscape(url)}<br/>Email: ${htmlEscape(email)}</div>`,
    replyTo: email,
  });
  return json(
    {
      error: `Your audit request was received — we'll email your full report to ${email} shortly. (Instant on-page results are being re-enabled.)`,
    },
    503
  );
}

/* ───────────────────── CRM API ───────────────────── */

async function crmContactsGet(env) {
  const { data } = await ghGetBrain(env);
  const contacts = data.crmContacts ?? [];
  const emails = data.crmEmails ?? [];
  const enriched = contacts.map((c) => ({
    ...c,
    sentCount: emails.filter((e) => e.contactId === c.id && e.status === "sent").length,
  }));
  return json({ contacts: enriched });
}

async function crmContactCreate(env, body) {
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!name || !isValidEmail(email))
    return json({ error: "name and valid email required" }, 400);
  const contact = await mutateBrain(env, `crm: add contact ${name}`, (d) => {
    const existing = d.crmContacts.find(
      (c) => c.email.toLowerCase() === email
    );
    if (existing) return existing;
    const c = {
      id: uid("crm"),
      name,
      email,
      company: String(body.company ?? "").trim() || undefined,
      website: String(body.website ?? "").trim() || undefined,
      location: String(body.location ?? "").trim() || undefined,
      status: "new",
      source: "manual",
      notes: String(body.notes ?? "").trim() || undefined,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    d.crmContacts.push(c);
    d.activities.unshift({
      id: uid("act"),
      type: "crm-contact-added",
      timestamp: nowIso(),
      description: `CRM: added contact ${name} <${email}>`,
    });
    return c;
  });
  return json({ ok: true, contact });
}

const CONTACT_PATCHABLE = [
  "name",
  "email",
  "company",
  "website",
  "location",
  "status",
  "notes",
  "tags",
];

async function crmContactPatch(env, id, body) {
  const updated = await mutateBrain(env, `crm: update contact ${id}`, (d) => {
    const c = d.crmContacts.find((x) => x.id === id);
    if (!c) return null;
    for (const k of CONTACT_PATCHABLE) {
      if (k in body) c[k] = body[k];
    }
    c.updatedAt = nowIso();
    return c;
  });
  if (!updated) return json({ error: "not found" }, 404);
  return json({ ok: true, contact: updated });
}

async function crmContactDelete(env, id) {
  const ok = await mutateBrain(env, `crm: delete contact ${id}`, (d) => {
    const i = d.crmContacts.findIndex((x) => x.id === id);
    if (i < 0) return false;
    d.crmContacts.splice(i, 1);
    return true;
  });
  if (!ok) return json({ error: "not found" }, 404);
  return json({ ok: true });
}

async function crmTemplatesGet(env) {
  const { data } = await ghGetBrain(env);
  return json({ templates: data.emailTemplates ?? [] });
}

async function crmTemplateCreate(env, body) {
  const name = String(body.name ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const tplBody = String(body.body ?? "").trim();
  if (!name || !subject || !tplBody)
    return json({ error: "name, subject, body required" }, 400);
  const tpl = await mutateBrain(env, `crm: add template ${name}`, (d) => {
    const t = {
      id: uid("tpl"),
      name,
      category: body.category || "custom",
      subject,
      body: tplBody,
      isSystem: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    d.emailTemplates.push(t);
    return t;
  });
  return json({ ok: true, template: tpl });
}

async function crmTemplatePatch(env, id, body) {
  const t = await mutateBrain(env, `crm: update template ${id}`, (d) => {
    const x = d.emailTemplates.find((t) => t.id === id);
    if (!x) return null;
    for (const k of ["name", "subject", "body", "category"]) {
      if (k in body) x[k] = body[k];
    }
    x.updatedAt = nowIso();
    return x;
  });
  if (!t) return json({ error: "not found" }, 404);
  return json({ ok: true, template: t });
}

async function crmTemplateDelete(env, id) {
  const ok = await mutateBrain(env, `crm: delete template ${id}`, (d) => {
    const i = d.emailTemplates.findIndex((t) => t.id === id);
    if (i < 0) return false;
    d.emailTemplates.splice(i, 1);
    return true;
  });
  if (!ok) return json({ error: "not found" }, 404);
  return json({ ok: true });
}

async function crmEmailsGet(env, contactId) {
  const { data } = await ghGetBrain(env);
  const emails = (data.crmEmails ?? [])
    .filter((e) => e.contactId === contactId)
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  return json({ emails });
}

async function crmSend(env, body) {
  const contactId = String(body.contactId ?? "");
  const subject = String(body.subject ?? "").trim();
  const emailBody = String(body.body ?? "").trim();
  if (!contactId || !subject || !emailBody)
    return json({ error: "contactId, subject, body required" }, 400);

  const { data } = await ghGetBrain(env);
  const contact = (data.crmContacts ?? []).find((c) => c.id === contactId);
  if (!contact) return json({ error: "contact not found" }, 404);

  const fromEmail = env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const fromHeader = `${FROM_NAME} <${fromEmail}>`;
  const html = `<div style="font-family:sans-serif;line-height:1.6;white-space:pre-wrap;">${htmlEscape(emailBody)}</div>`;
  const sent = await sendEmail(env, {
    to: contact.email,
    subject,
    text: emailBody,
    html,
    from: fromHeader,
  });

  await mutateBrain(env, `crm: send to ${contact.email}`, (d) => {
    const c = d.crmContacts.find((x) => x.id === contactId);
    const rec = {
      id: uid("cem"),
      contactId,
      templateId: body.templateId || undefined,
      from: fromHeader,
      to: contact.email,
      subject,
      body: emailBody,
      status: sent.ok ? "sent" : "failed",
      resendId: sent.ok ? sent.id : undefined,
      failReason: sent.ok ? undefined : sent.error,
      sentAt: sent.ok ? nowIso() : undefined,
      createdAt: nowIso(),
    };
    d.crmEmails.push(rec);
    if (sent.ok && c) {
      c.lastContactedAt = nowIso();
      if (c.status === "new") c.status = "contacted";
      c.updatedAt = nowIso();
    }
    d.activities.unshift({
      id: uid("act"),
      type: "crm-email-sent",
      timestamp: nowIso(),
      description: sent.ok
        ? `CRM: sent "${subject}" to ${contact.email}`
        : `CRM: send FAILED to ${contact.email} — ${sent.error}`,
    });
  });

  if (!sent.ok) return json({ error: sent.error || "send failed" }, 502);
  return json({ ok: true });
}

/* ───────────────── CRM router (auth-gated) ───────────────── */

async function crmApi(req, env, pathname) {
  if (!(await verifySession(env, req.headers.get("Cookie")))) {
    return json({ error: "unauthorized" }, 401);
  }
  const method = req.method;
  const segs = pathname.split("/").filter(Boolean); // ["api","crm",...]
  const res = segs[2];
  const idOrQuery = segs[3];

  let body = {};
  if (method === "POST" || method === "PATCH") {
    body = await req.json().catch(() => ({}));
  }

  if (res === "contacts") {
    if (method === "GET") return crmContactsGet(env);
    if (method === "POST") return crmContactCreate(env, body);
    if (method === "PATCH" && idOrQuery) return crmContactPatch(env, idOrQuery, body);
    if (method === "DELETE" && idOrQuery) return crmContactDelete(env, idOrQuery);
  }
  if (res === "templates") {
    if (method === "GET") return crmTemplatesGet(env);
    if (method === "POST") return crmTemplateCreate(env, body);
    if (method === "PATCH" && idOrQuery) return crmTemplatePatch(env, idOrQuery, body);
    if (method === "DELETE" && idOrQuery) return crmTemplateDelete(env, idOrQuery);
  }
  if (res === "emails" && method === "GET") {
    const cid = new URL(req.url).searchParams.get("contactId") || "";
    return crmEmailsGet(env, cid);
  }
  if (res === "send" && method === "POST") return crmSend(env, body);

  return json({ error: "not found" }, 404);
}

/* ───────────────── CRM UI (served by the Worker) ───────────────── */

function loginPage(error) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/><title>Brandivibe CRM</title><style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:ui-sans-serif,system-ui,sans-serif;background:#08080a;color:#e9e7e2;min-height:100vh;display:grid;place-items:center}
.box{width:360px;padding:40px 32px;border:1px solid rgba(255,255,255,.1);border-radius:18px;background:rgba(255,255,255,.02)}
.k{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#84e1ff;margin-bottom:18px}
h1{font-size:24px;font-weight:600;margin-bottom:24px}
input{width:100%;background:transparent;border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:12px 14px;color:#fff;font-size:15px;margin-bottom:14px;outline:none}
input:focus{border-color:#84e1ff}
button{width:100%;background:#fff;color:#000;border:0;border-radius:999px;padding:13px;font-weight:600;cursor:pointer}
.err{color:#f87171;font-size:13px;margin-bottom:12px}</style></head>
<body><form class="box" method="POST" action="/crm/login">
<div class="k">Brandivibe · CRM</div><h1>Operator login</h1>
${error ? `<div class="err">${htmlEscape(error)}</div>` : ""}
<input type="password" name="password" placeholder="Password" autofocus required/>
<button type="submit">Enter →</button></form></body></html>`;
}

function appPage() {
  // Single-page CRM. All data via authenticated /api/crm/* fetches.
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/><title>Brandivibe CRM</title><style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:ui-sans-serif,system-ui,sans-serif;background:#08080a;color:#e9e7e2}
a{color:#84e1ff}button{cursor:pointer;font:inherit}
header{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid rgba(255,255,255,.08)}
.k{font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#84e1ff}
.tabs{display:flex;gap:8px;padding:16px 24px 0}
.tab{padding:8px 16px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:transparent;color:#e9e7e2;font-size:13px}
.tab.on{background:#fff;color:#000;border-color:#fff}
main{padding:20px 24px;max-width:1200px}
.bar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap}
input,select,textarea{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.14);border-radius:9px;padding:9px 12px;color:#fff;font-size:14px;outline:none}
input:focus,textarea:focus,select:focus{border-color:#84e1ff}
.btn{background:#fff;color:#000;border:0;border-radius:999px;padding:9px 18px;font-weight:600;font-size:13px}
.btn.ghost{background:transparent;color:#e9e7e2;border:1px solid rgba(255,255,255,.18)}
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.4);padding:10px;border-bottom:1px solid rgba(255,255,255,.1)}
td{padding:11px 10px;border-bottom:1px solid rgba(255,255,255,.05)}
tr.row:hover{background:rgba(255,255,255,.02);cursor:pointer}
.pill{font-family:ui-monospace,monospace;font-size:10px;text-transform:uppercase;letter-spacing:.1em;padding:3px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.18)}
.drawer{position:fixed;top:0;right:0;height:100vh;width:480px;max-width:92vw;background:#0d0d10;border-left:1px solid rgba(255,255,255,.12);padding:24px;overflow:auto;transform:translateX(110%);transition:.25s}
.drawer.open{transform:none}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.6);display:none;place-items:center}
.modal.open{display:grid}
.card{background:#0d0d10;border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:24px;width:520px;max-width:92vw;max-height:88vh;overflow:auto}
label{display:block;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.5);margin:12px 0 6px}
.full{width:100%}.row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mut{color:rgba(255,255,255,.45);font-size:13px}.mb{margin-bottom:14px}
.em{border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px;margin-bottom:8px;font-size:13px}
</style></head><body>
<header><div><span class="k">Brandivibe · CRM</span></div>
<div style="display:flex;gap:14px;align-items:center"><a href="/dashboard" style="font-size:12px">Dashboard</a>
<form method="POST" action="/crm/logout" style="margin:0"><button class="tab" type="submit">Logout</button></form></div></header>
<div class="tabs"><button class="tab on" id="tabC" onclick="show('c')">Contacts</button><button class="tab" id="tabT" onclick="show('t')">Templates</button></div>
<main>
<div id="viewC">
 <div class="bar">
  <input id="q" placeholder="Search name / email / company…" oninput="render()" style="flex:1;min-width:200px"/>
  <select id="fs" onchange="render()"><option value="">All statuses</option><option>new</option><option>contacted</option><option>replied</option><option>booked</option><option>closed-won</option><option>closed-lost</option><option>unsubscribed</option></select>
  <button class="btn" onclick="openAdd()">+ Contact</button>
 </div>
 <table><thead><tr><th>Name</th><th>Email</th><th>Company</th><th>Status</th><th>Source</th><th>Sent</th><th>Last contacted</th></tr></thead><tbody id="rows"></tbody></table>
 <p id="cempty" class="mut" style="margin-top:20px;display:none">No contacts yet. Add one, or the brain will sync prospects in.</p>
</div>
<div id="viewT" style="display:none">
 <div class="bar"><button class="btn" onclick="openTpl()">+ Template</button></div>
 <div id="tpls"></div>
</div>
</main>
<div class="drawer" id="dr"></div>
<div class="modal" id="md"><div class="card" id="mdc"></div></div>
<script>
let C=[],T=[];
const $=s=>document.querySelector(s);
async function api(p,o){const r=await fetch(p,Object.assign({headers:{'Content-Type':'application/json'}},o||{}));if(r.status===401){location.href='/crm';return}return r.json()}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function show(t){const c=t==='c';$('#viewC').style.display=c?'':'none';$('#viewT').style.display=c?'none':'';$('#tabC').className='tab'+(c?' on':'');$('#tabT').className='tab'+(c?'':' on');if(!c)renderT()}
async function load(){const a=await api('/api/crm/contacts');C=(a&&a.contacts)||[];const b=await api('/api/crm/templates');T=(b&&b.templates)||[];render()}
function render(){const q=$('#q').value.toLowerCase(),fs=$('#fs').value;const list=C.filter(c=>(!fs||c.status===fs)&&(!q||(c.name+' '+c.email+' '+(c.company||'')).toLowerCase().includes(q)));$('#cempty').style.display=list.length?'none':'';$('#rows').innerHTML=list.map(c=>'<tr class="row" onclick="openC(\\''+c.id+'\\')"><td>'+esc(c.name)+'</td><td>'+esc(c.email)+'</td><td>'+esc(c.company||'—')+'</td><td><span class="pill">'+esc(c.status)+'</span></td><td class="mut">'+esc(c.source)+'</td><td>'+(c.sentCount||0)+'</td><td class="mut">'+(c.lastContactedAt?new Date(c.lastContactedAt).toLocaleDateString():'—')+'</td></tr>').join('')}
function renderT(){$('#tpls').innerHTML=T.map(t=>'<div class="em"><b>'+esc(t.name)+'</b> <span class="mut">· '+esc(t.category)+'</span><div class="mut" style="margin:6px 0">'+esc(t.subject)+'</div><button class="tab" onclick="openTpl(\\''+t.id+'\\')">Edit</button> <button class="tab" onclick="delTpl(\\''+t.id+'\\')">Delete</button></div>').join('')||'<p class="mut">No templates yet.</p>'}
async function openC(id){const c=C.find(x=>x.id===id);const em=await api('/api/crm/emails?contactId='+id);const hist=((em&&em.emails)||[]).map(e=>'<div class="em"><b>'+esc(e.subject)+'</b> <span class="pill">'+esc(e.status)+'</span><div class="mut">'+new Date(e.createdAt).toLocaleString()+'</div></div>').join('')||'<p class="mut">No emails yet.</p>';
$('#dr').innerHTML='<button class="tab" onclick="$(\\'#dr\\').classList.remove(\\'open\\')">✕ Close</button><h2 style="margin:14px 0 4px">'+esc(c.name)+'</h2><div class="mut mb">'+esc(c.email)+(c.company?' · '+esc(c.company):'')+'</div><label>Status</label><select id="dst" class="full">'+['new','contacted','replied','booked','closed-won','closed-lost','unsubscribed'].map(s=>'<option'+(s===c.status?' selected':'')+'>'+s+'</option>').join('')+'</select><label>Notes</label><textarea id="dnotes" class="full" rows="3">'+esc(c.notes||'')+'</textarea><div style="margin:12px 0"><button class="btn" onclick="saveC(\\''+id+'\\')">Save</button> <button class="btn ghost" onclick="openSend(\\''+id+'\\')">Compose →</button> <button class="tab" onclick="delC(\\''+id+'\\')">Delete</button></div><label>Email history</label>'+hist;$('#dr').classList.add('open')}
async function saveC(id){await api('/api/crm/contacts/'+id,{method:'PATCH',body:JSON.stringify({status:$('#dst').value,notes:$('#dnotes').value})});await load();$('#dr').classList.remove('open')}
async function delC(id){if(!confirm('Delete this contact?'))return;await api('/api/crm/contacts/'+id,{method:'DELETE'});await load();$('#dr').classList.remove('open')}
function openAdd(){$('#mdc').innerHTML='<h2 class="mb">New contact</h2><label>Name</label><input id="an" class="full"/><label>Email</label><input id="ae" class="full"/><div class="row2"><div><label>Company</label><input id="ac" class="full"/></div><div><label>Location</label><input id="al" class="full"/></div></div><label>Notes</label><textarea id="ano" class="full" rows="2"></textarea><div style="margin-top:16px"><button class="btn" onclick="addC()">Add</button> <button class="btn ghost" onclick="closeM()">Cancel</button></div>';$('#md').classList.add('open')}
async function addC(){const r=await api('/api/crm/contacts',{method:'POST',body:JSON.stringify({name:$('#an').value,email:$('#ae').value,company:$('#ac').value,location:$('#al').value,notes:$('#ano').value})});if(r&&r.error){alert(r.error);return}closeM();await load()}
function openSend(id){const c=C.find(x=>x.id===id);const opts=T.map(t=>'<option value="'+t.id+'">'+esc(t.name)+'</option>').join('');$('#mdc').innerHTML='<h2 class="mb">Email '+esc(c.name)+'</h2><label>Template (optional)</label><select id="st" class="full" onchange="fillT()"><option value="">— none —</option>'+opts+'</select><label>Subject</label><input id="ssub" class="full"/><label>Body</label><textarea id="sbody" class="full" rows="9"></textarea><div style="margin-top:16px"><button class="btn" onclick="doSend(\\''+id+'\\')">Send</button> <button class="btn ghost" onclick="closeM()">Cancel</button></div>';$('#md').classList.add('open')}
function fillT(){const t=T.find(x=>x.id===$('#st').value);if(t){$('#ssub').value=t.subject;$('#sbody').value=t.body}}
async function doSend(id){const r=await api('/api/crm/send',{method:'POST',body:JSON.stringify({contactId:id,templateId:$('#st').value||undefined,subject:$('#ssub').value,body:$('#sbody').value})});if(r&&r.error){alert(r.error);return}closeM();$('#dr').classList.remove('open');await load();alert('Sent.')}
function openTpl(id){const t=id?T.find(x=>x.id===id):null;$('#mdc').innerHTML='<h2 class="mb">'+(t?'Edit':'New')+' template</h2><label>Name</label><input id="tn" class="full" value="'+esc(t?t.name:'')+'"/><label>Category</label><select id="tcat" class="full">'+['cold','followup','loom','breakup','audit','custom'].map(x=>'<option'+(t&&t.category===x?' selected':'')+'>'+x+'</option>').join('')+'</select><label>Subject</label><input id="tsub" class="full" value="'+esc(t?t.subject:'')+'"/><label>Body</label><textarea id="tbody" class="full" rows="8">'+esc(t?t.body:'')+'</textarea><div style="margin-top:16px"><button class="btn" onclick="saveTpl(\\''+(id||'')+'\\')">Save</button> <button class="btn ghost" onclick="closeM()">Cancel</button></div>';$('#md').classList.add('open')}
async function saveTpl(id){const p={name:$('#tn').value,category:$('#tcat').value,subject:$('#tsub').value,body:$('#tbody').value};const r=id?await api('/api/crm/templates/'+id,{method:'PATCH',body:JSON.stringify(p)}):await api('/api/crm/templates',{method:'POST',body:JSON.stringify(p)});if(r&&r.error){alert(r.error);return}closeM();const b=await api('/api/crm/templates');T=(b&&b.templates)||[];renderT()}
async function delTpl(id){if(!confirm('Delete template?'))return;await api('/api/crm/templates/'+id,{method:'DELETE'});const b=await api('/api/crm/templates');T=(b&&b.templates)||[];renderT()}
function closeM(){$('#md').classList.remove('open')}
$('#md').addEventListener('click',e=>{if(e.target.id==='md')closeM()});
load();
</script></body></html>`;
}

function html(body, status = 200, extraHeaders) {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", ...(extraHeaders || {}) },
  });
}

async function handleCrmUi(req, env, pathname) {
  // login / logout
  if (pathname === "/crm/login" && req.method === "POST") {
    const form = await req.formData().catch(() => null);
    const pw = form ? String(form.get("password") || "") : "";
    if (!env.CRM_PASSWORD || !env.CRM_SESSION_SECRET) {
      return html(loginPage("CRM not configured (set CRM_PASSWORD + CRM_SESSION_SECRET)."), 500);
    }
    if (pw !== env.CRM_PASSWORD) {
      return html(loginPage("Wrong password."), 401);
    }
    const tok = await makeSession(env);
    return new Response(null, {
      status: 302,
      headers: { Location: "/crm", "Set-Cookie": sessionCookie(tok) },
    });
  }
  if (pathname === "/crm/logout" && req.method === "POST") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/crm", "Set-Cookie": CLEAR_COOKIE },
    });
  }
  // app or login
  const authed = await verifySession(env, req.headers.get("Cookie"));
  return html(authed ? appPage() : loginPage(""));
}

/* ───────────────────────── Router ───────────────────────── */

export default {
  async fetch(req, env) {
    const { pathname } = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    try {
      // CRM UI (HTML, served by the Worker — never on the static site)
      if (pathname === "/crm" || pathname === "/crm/login" || pathname === "/crm/logout") {
        return await handleCrmUi(req, env, pathname);
      }
      // CRM API (auth-gated JSON)
      if (pathname.startsWith("/api/crm/")) {
        return await crmApi(req, env, pathname);
      }
      // Public forms
      if (pathname === "/api/contact" && req.method === "POST") {
        return await handleContact(req, env);
      }
      if (pathname === "/api/audit/run" && req.method === "POST") {
        return await handleAuditRun(req, env);
      }
      return json({ error: "Not found" }, 404);
    } catch (err) {
      console.error("[worker] error:", err && err.stack ? err.stack : String(err));
      return json({ error: "Internal error" }, 500);
    }
  },
};
