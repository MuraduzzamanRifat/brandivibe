"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { marked } from "marked";

/**
 * Manual article publisher for the static site.
 *
 * The site is a static export (no backend), so publishing = committing two
 * files to the repo, which auto-triggers the GitHub Pages deploy:
 *   - src/data/articles.json    → article metadata (drives generateStaticParams + SEO)
 *   - content/journal/<slug>.mdx → frontmatter + Markdown body (the rendered article)
 *
 * Auth is a GitHub token the owner pastes once (kept in localStorage only,
 * never committed). Both files go in ONE commit via the Git Data API, with
 * optimistic-concurrency retry so concurrent edits never clobber each other.
 */

const REPO = "MuraduzzamanRifat/brandivibe";
const BRANCH = "main";
const API = "https://api.github.com";
const ARTICLES_PATH = "mjstudio/src/data/articles.json";
const journalPath = (slug: string) => `mjstudio/content/journal/${slug}.mdx`;
const TOKEN_KEY = "bv_admin_gh_token";

type ArticleMeta = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  heroImage: string;
  seoScore: number;
  wordCount: number;
  publishedAt: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// JSON.stringify produces a valid YAML double-quoted scalar (YAML ⊇ JSON).
const y = (s: string) => JSON.stringify(s ?? "");

function buildFrontmatter(m: Omit<ArticleMeta, "id" | "seoScore" | "wordCount">) {
  const kw =
    m.secondaryKeywords.length === 0
      ? "secondaryKeywords: []"
      : ["secondaryKeywords:", ...m.secondaryKeywords.map((k) => `  - ${y(k)}`)].join("\n");
  return [
    "---",
    `title: ${y(m.title)}`,
    `slug: ${y(m.slug)}`,
    `excerpt: ${y(m.excerpt)}`,
    `primaryKeyword: ${y(m.primaryKeyword)}`,
    kw,
    `heroImage: ${y(m.heroImage)}`,
    `publishedAt: ${y(m.publishedAt)}`,
    "---",
    "",
  ].join("\n");
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [tokenValid, setTokenValid] = useState<null | boolean>(null);
  const [user, setUser] = useState<string>("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [body, setBody] = useState("");

  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err" | "info"; msg: string; href?: string }>({
    kind: "idle",
    msg: "",
  });
  const [articles, setArticles] = useState<ArticleMeta[] | null>(null);

  // Load saved token + default the publish date (client-only — guards SSR).
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY) || "";
    if (t) setToken(t);
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setPublishedAt(now.toISOString().slice(0, 16));
  }, []);

  // Auto-slug from title until the user edits the slug manually.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  // Live Markdown preview.
  useEffect(() => {
    let alive = true;
    Promise.resolve(marked.parse(body || "*Nothing to preview yet.*", { gfm: true, breaks: false })).then((h) => {
      if (alive) setPreview(typeof h === "string" ? h : String(h));
    });
    return () => {
      alive = false;
    };
  }, [body]);

  const gh = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const res = await fetch(`${API}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(init.headers || {}),
        },
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`GitHub ${res.status}: ${t.slice(0, 240)}`);
      }
      return res;
    },
    [token]
  );

  const fetchArticlesJson = useCallback(async (): Promise<ArticleMeta[]> => {
    const res = await gh(`/repos/${REPO}/contents/${ARTICLES_PATH}?ref=${BRANCH}`, {
      headers: { Accept: "application/vnd.github.raw" },
    });
    const parsed = JSON.parse(await res.text());
    return Array.isArray(parsed) ? parsed : [];
  }, [gh]);

  const loadArticles = useCallback(async () => {
    try {
      setArticles(await fetchArticlesJson());
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Failed to load articles" });
    }
  }, [fetchArticlesJson]);

  // Validate token + load article list whenever the token changes.
  useEffect(() => {
    if (!token) {
      setTokenValid(null);
      setArticles(null);
      return;
    }
    let alive = true;
    (async () => {
      try {
        const me = await (await gh(`/user`)).json();
        if (!alive) return;
        setUser(me.login);
        setTokenValid(true);
        loadArticles();
      } catch {
        if (alive) setTokenValid(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token, gh, loadArticles]);

  function saveToken() {
    const t = tokenInput.trim();
    if (!t) return;
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setTokenInput("");
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser("");
    setTokenValid(null);
  }

  // Commit a set of file writes/deletes as ONE commit, retrying if the ref
  // moved under us (the automated brain may push concurrently).
  const commitFiles = useCallback(
    async (files: Array<{ path: string; content?: string; del?: boolean }>, message: string) => {
      for (let attempt = 0; attempt < 4; attempt++) {
        const ref = await (await gh(`/repos/${REPO}/git/ref/heads/${BRANCH}`)).json();
        const baseSha = ref.object.sha as string;
        const baseCommit = await (await gh(`/repos/${REPO}/git/commits/${baseSha}`)).json();
        const baseTree = baseCommit.tree.sha as string;

        const tree: Array<Record<string, unknown>> = [];
        for (const f of files) {
          if (f.del) {
            tree.push({ path: f.path, mode: "100644", type: "blob", sha: null });
          } else {
            const blob = await (
              await gh(`/repos/${REPO}/git/blobs`, {
                method: "POST",
                body: JSON.stringify({ content: f.content, encoding: "utf-8" }),
              })
            ).json();
            tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
          }
        }

        const newTree = await (
          await gh(`/repos/${REPO}/git/trees`, {
            method: "POST",
            body: JSON.stringify({ base_tree: baseTree, tree }),
          })
        ).json();

        const commit = await (
          await gh(`/repos/${REPO}/git/commits`, {
            method: "POST",
            body: JSON.stringify({ message, tree: newTree.sha, parents: [baseSha] }),
          })
        ).json();

        const upd = await fetch(`${API}/repos/${REPO}/git/refs/heads/${BRANCH}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          body: JSON.stringify({ sha: commit.sha, force: false }),
        });
        if (upd.ok) return commit.sha as string;
        if (upd.status === 422) continue; // ref moved — rebuild on latest and retry
        throw new Error(`GitHub ${upd.status}: ${(await upd.text()).slice(0, 200)}`);
      }
      throw new Error("Could not update branch after several retries (repo kept changing).");
    },
    [gh, token]
  );

  async function publish() {
    setStatus({ kind: "idle", msg: "" });
    const t = title.trim();
    const s = slugify(slug);
    if (!t) return setStatus({ kind: "err", msg: "Title is required." });
    if (!s) return setStatus({ kind: "err", msg: "Slug is required." });
    if (!body.trim()) return setStatus({ kind: "err", msg: "Body is required." });

    setBusy(true);
    try {
      const list = await fetchArticlesJson();
      if (list.some((a) => a.slug === s)) {
        setBusy(false);
        return setStatus({ kind: "err", msg: `An article with slug "${s}" already exists.` });
      }

      const secondary = secondaryKeywords
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      const isoDate = publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString();
      const wordCount = body.trim().split(/\s+/).filter(Boolean).length;

      const meta: ArticleMeta = {
        id: `art_${Date.now()}`,
        slug: s,
        title: t,
        excerpt: excerpt.trim(),
        primaryKeyword: primaryKeyword.trim(),
        secondaryKeywords: secondary,
        heroImage: heroImage.trim(),
        seoScore: 80,
        wordCount,
        publishedAt: isoDate,
      };
      list.unshift(meta);

      const frontmatter = buildFrontmatter({
        title: t,
        slug: s,
        excerpt: excerpt.trim(),
        primaryKeyword: primaryKeyword.trim(),
        secondaryKeywords: secondary,
        heroImage: heroImage.trim(),
        publishedAt: isoDate,
      });
      const mdx = `${frontmatter}\n${body.trim()}\n`;

      const sha = await commitFiles(
        [
          { path: ARTICLES_PATH, content: JSON.stringify(list, null, 2) + "\n" },
          { path: journalPath(s), content: mdx },
        ],
        `Publish article: ${t}`
      );

      setStatus({
        kind: "ok",
        msg: `Published! Deploy is building — live in ~3 min at /journal/${s}/`,
        href: `https://github.com/${REPO}/commit/${sha}`,
      });
      // reset the composer, keep the date
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      setExcerpt("");
      setPrimaryKeyword("");
      setSecondaryKeywords("");
      setHeroImage("");
      setBody("");
      loadArticles();
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Publish failed." });
    } finally {
      setBusy(false);
    }
  }

  async function deleteArticle(a: ArticleMeta) {
    if (!confirm(`Delete "${a.title}"? This removes it from the site on the next deploy.`)) return;
    setBusy(true);
    setStatus({ kind: "idle", msg: "" });
    try {
      const list = (await fetchArticlesJson()).filter((x) => x.slug !== a.slug);
      const sha = await commitFiles(
        [
          { path: ARTICLES_PATH, content: JSON.stringify(list, null, 2) + "\n" },
          { path: journalPath(a.slug), del: true },
        ],
        `Delete article: ${a.title}`
      );
      setStatus({ kind: "ok", msg: `Deleted "${a.title}".`, href: `https://github.com/${REPO}/commit/${sha}` });
      loadArticles();
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Delete failed." });
    } finally {
      setBusy(false);
    }
  }

  const wordCount = useMemo(() => body.trim().split(/\s+/).filter(Boolean).length, [body]);

  const inputCls =
    "w-full bg-white/[0.03] border border-white/15 rounded-lg px-3 py-2 text-sm outline-none focus-visible:border-[#84e1ff] transition-colors placeholder:text-white/30";
  const labelCls = "block font-mono text-[11px] uppercase tracking-[0.15em] text-white/50 mb-1.5";

  // ---- Token gate ----
  if (!token || tokenValid === false) {
    return (
      <main className="min-h-screen bg-[#08080a] text-white flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff] mb-3">— Brandivibe Admin</div>
          <h1 className="text-3xl font-semibold tracking-tight mb-4">Connect GitHub</h1>
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            Publishing commits to your repo, so paste a GitHub token with{" "}
            <span className="text-white/80">Contents: Read &amp; write</span> on{" "}
            <span className="font-mono text-white/80">{REPO}</span>. It&apos;s stored only in this browser
            (localStorage) and never committed.
          </p>
          <label className={labelCls}>GitHub token</label>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveToken()}
            placeholder="github_pat_… or ghp_…"
            className={inputCls}
            autoComplete="off"
          />
          {tokenValid === false && (
            <p className="text-red-400 text-xs mt-2">That token didn&apos;t authenticate. Check scope/expiry.</p>
          )}
          <button
            onClick={saveToken}
            className="mt-4 w-full px-5 py-2.5 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors"
          >
            Connect
          </button>
          <div className="mt-6 text-xs text-white/40 leading-relaxed">
            <a
              href="https://github.com/settings/tokens?type=beta"
              target="_blank"
              rel="noreferrer"
              className="text-[#84e1ff] hover:underline"
            >
              Create a fine-grained token →
            </a>{" "}
            (Repository access → only <span className="font-mono">brandivibe</span>; Permissions → Contents:
            Read and write).
          </div>
        </div>
      </main>
    );
  }

  // ---- Editor ----
  return (
    <main className="min-h-screen bg-[#08080a] text-white px-6 md:px-10 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#84e1ff]">— Brandivibe Admin</div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">Publish an article</h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/45">
            {user && (
              <span>
                Signed in as <span className="text-white/70 font-mono">{user}</span>
              </span>
            )}
            <button onClick={clearToken} className="px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/5">
              Disconnect
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Composer */}
          <section className="space-y-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="The headline" />
            </div>
            <div>
              <label className={labelCls}>Slug *</label>
              <input
                className={`${inputCls} font-mono`}
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                placeholder="auto-from-title"
              />
              <p className="text-[11px] text-white/35 mt-1">/journal/{slug || "…"}/</p>
            </div>
            <div>
              <label className={labelCls}>Excerpt</label>
              <textarea className={`${inputCls} resize-none`} rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="1–2 sentence summary (meta description)" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Primary keyword</label>
                <input className={inputCls} value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} placeholder="main target phrase" />
              </div>
              <div>
                <label className={labelCls}>Published</label>
                <input type="datetime-local" className={inputCls} value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Secondary keywords (comma-separated)</label>
              <input className={inputCls} value={secondaryKeywords} onChange={(e) => setSecondaryKeywords(e.target.value)} placeholder="keyword one, keyword two" />
            </div>
            <div>
              <label className={labelCls}>Hero image URL</label>
              <input className={inputCls} value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="https://…  (optional)" />
            </div>
            <div>
              <label className={labelCls}>
                Body — Markdown <span className="text-white/30 normal-case">({wordCount} words)</span>
              </label>
              <textarea
                className={`${inputCls} font-mono leading-relaxed`}
                rows={18}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={"## Section heading\n\nWrite the article in **Markdown**…\n\n- bullet\n- bullet"}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={publish}
                disabled={busy}
                className="px-7 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {busy ? "Publishing…" : "Publish article"}
              </button>
              {status.msg && (
                <span
                  className={`text-sm ${
                    status.kind === "ok" ? "text-green-400" : status.kind === "err" ? "text-red-400" : "text-white/60"
                  }`}
                >
                  {status.msg}{" "}
                  {status.href && (
                    <a href={status.href} target="_blank" rel="noreferrer" className="underline">
                      view commit
                    </a>
                  )}
                </span>
              )}
            </div>
          </section>

          {/* Live preview */}
          <section className="lg:sticky lg:top-10 self-start">
            <label className={labelCls}>Live preview</label>
            <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-6 md:p-8 max-h-[80vh] overflow-y-auto">
              {heroImage.trim() && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroImage} alt="" className="w-full rounded-lg mb-6 border border-white/10" />
              )}
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">{title || "Untitled"}</h2>
              {excerpt && <p className="text-white/55 mb-6">{excerpt}</p>}
              <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-[#84e1ff]" dangerouslySetInnerHTML={{ __html: preview }} />
            </div>
          </section>
        </div>

        {/* Existing articles */}
        <section className="mt-14 border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
              Published articles {articles ? `(${articles.length})` : ""}
            </h2>
            <button onClick={loadArticles} className="text-xs text-white/45 hover:text-white">
              Refresh
            </button>
          </div>
          {articles === null ? (
            <p className="text-white/40 text-sm">Loading…</p>
          ) : articles.length === 0 ? (
            <p className="text-white/40 text-sm">No articles yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {articles.map((a) => (
                <li key={a.slug} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <a href={`/journal/${a.slug}/`} className="text-sm text-white/85 hover:text-white truncate block">
                      {a.title}
                    </a>
                    <div className="font-mono text-[11px] text-white/35">
                      /{a.slug} · {new Date(a.publishedAt).toLocaleDateString()} · {a.wordCount} words
                    </div>
                  </div>
                  <button
                    onClick={() => deleteArticle(a)}
                    disabled={busy}
                    className="shrink-0 text-xs text-red-400/80 hover:text-red-400 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
