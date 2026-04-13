/**
 * GitHub as database adapter.
 *
 * Koyeb containers are ephemeral — the local brain.json vanishes on every
 * redeploy. We keep the authoritative copy in the GitHub repo at
 * `mjstudio/data/brain.json` (and write generated journal MDX + images there
 * too). Reads use the Contents API with SHA-tracked optimistic concurrency
 * so concurrent writers don't clobber each other.
 *
 * Env vars (all optional — if missing, adapter is a no-op):
 *   GITHUB_REPO         owner/name, e.g. "MuraduzzamanRifat/brandivibe"
 *   GITHUB_TOKEN        PAT with contents:write
 *   GITHUB_BRANCH       default "main"
 *   GITHUB_BRAIN_PATH   default "mjstudio/data/brain.json"
 */

const API = "https://api.github.com";

export function isGithubStorageEnabled(): boolean {
  return Boolean(process.env.GITHUB_REPO && process.env.GITHUB_TOKEN);
}

function cfg() {
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (!repo || !token) throw new Error("GITHUB_REPO and GITHUB_TOKEN must be set");
  return {
    repo,
    token,
    branch: process.env.GITHUB_BRANCH || "main",
    brainPath: process.env.GITHUB_BRAIN_PATH || "mjstudio/data/brain.json",
  };
}

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Brandivibe-Brain/1.0",
  };
}

type FileGetResult = {
  content: string;
  sha: string;
} | null;

export async function getFile(path: string): Promise<FileGetResult> {
  const { repo, token, branch } = cfg();
  const url = `${API}/repos/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`;
  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFile ${path} ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { content: string; encoding: string; sha: string };
  const content = json.encoding === "base64"
    ? Buffer.from(json.content, "base64").toString("utf8")
    : json.content;
  return { content, sha: json.sha };
}

export async function getRawFile(path: string): Promise<string | null> {
  const file = await getFile(path);
  return file?.content ?? null;
}

export async function putFile(
  path: string,
  content: string | Buffer,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  const { repo, token, branch } = cfg();
  const url = `${API}/repos/${repo}/contents/${encodeURIComponent(path)}`;
  const base64 = Buffer.isBuffer(content)
    ? content.toString("base64")
    : Buffer.from(content, "utf8").toString("base64");
  const body: Record<string, unknown> = {
    message,
    content: base64,
    branch,
  };
  if (sha) body.sha = sha;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub putFile ${path} ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { content: { sha: string } };
  return { sha: json.content.sha };
}

export async function pullBrainJson(): Promise<{ data: unknown; sha: string } | null> {
  const { brainPath } = cfg();
  const file = await getFile(brainPath);
  if (!file) return null;
  try {
    return { data: JSON.parse(file.content), sha: file.sha };
  } catch {
    return null;
  }
}

export async function pushBrainJson(data: unknown, sha: string | undefined): Promise<string> {
  const { brainPath } = cfg();
  const pretty = JSON.stringify(data, null, 2);
  const res = await putFile(brainPath, pretty, "brain: update state", sha);
  return res.sha;
}

export async function commitArticle(slug: string, mdx: string, imagePng: Buffer): Promise<void> {
  const mdxPath = `mjstudio/content/journal/${slug}.mdx`;
  const imgPath = `mjstudio/public/journal/${slug}-hero.png`;
  const existingMdx = await getFile(mdxPath);
  const existingImg = await getFile(imgPath);
  await putFile(mdxPath, mdx, `journal: publish ${slug}`, existingMdx?.sha);
  await putFile(imgPath, imagePng, `journal: hero image for ${slug}`, existingImg?.sha);
}
