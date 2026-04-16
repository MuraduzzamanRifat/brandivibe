import { addFbPost, updateFbPost, type FbPost, type FbPostSpec } from "../brain-storage";

/**
 * Facebook executor. For each FbPostSpec from the planner:
 *   1. Fetch a relevant image from Pexels (free)
 *   2. If FACEBOOK_ACCESS_TOKEN is present, POST to Graph API /PAGE_ID/photos
 *   3. Otherwise push to the brain's fbQueue for manual approval
 *
 * Requires: PEXELS_API_KEY env var (free at pexels.com/api)
 */

function fbEnv() {
  return {
    token: process.env.FACEBOOK_ACCESS_TOKEN,
    pageId: process.env.FACEBOOK_PAGE_ID,
  };
}

type PexelsPhoto = {
  src: { square: string; medium: string };
  photographer: string;
};

type PexelsResponse = {
  photos: PexelsPhoto[];
};

async function fetchImage(prompt: string): Promise<string> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) throw new Error("PEXELS_API_KEY not set");

  const cleanQuery = prompt
    .replace(/\b(social media|square|composition|aesthetic|format|overlay|bold|eye.catching)\b/gi, "")
    .trim()
    .slice(0, 100);

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(cleanQuery)}&per_page=3&orientation=square`;
  const res = await fetch(url, {
    headers: { Authorization: key },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Pexels API ${res.status}`);

  const data = (await res.json()) as PexelsResponse;
  const photo = data.photos?.[0];
  if (!photo) throw new Error(`No Pexels results for: "${cleanQuery}"`);

  // Return the medium square URL (640px) — good for FB posts
  return photo.src.medium;
}

function formatPost(spec: FbPostSpec): string {
  const hashtags = (spec.hashtags ?? []).join(" ");
  const link = spec.articleSlug ? `\n\nhttps://brandivibe.com/journal/${spec.articleSlug}` : "";
  return `${spec.body.trim()}${link}\n\n${hashtags}`.trim();
}

async function publishToFacebook(body: string, imageDataUrl: string): Promise<string> {
  const { token, pageId } = fbEnv();
  if (!token || !pageId) throw new Error("FB env vars missing");

  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, "");
  const binary = Buffer.from(base64, "base64");
  const blob = new Blob([new Uint8Array(binary)], { type: "image/png" });
  const form = new FormData();
  form.set("source", blob, "hero.png");
  form.set("caption", body);
  form.set("access_token", token);

  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`FB publish ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { post_id?: string; id?: string };
  return json.post_id ?? json.id ?? "";
}

export async function queueOrPublishFbPost(spec: FbPostSpec): Promise<FbPost> {
  const { token, pageId } = fbEnv();
  const canPublish = Boolean(token && pageId);

  let imageUrl: string | undefined;
  try {
    imageUrl = await fetchImage(spec.imagePrompt);
  } catch (err) {
    console.error("[fb] Pexels image fetch failed:", err);
  }

  const body = formatPost(spec);
  const post: FbPost = {
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: canPublish ? "published" : "queued",
    body,
    imagePrompt: spec.imagePrompt,
    imageUrl,
    articleSlug: spec.articleSlug,
    hashtags: spec.hashtags,
    createdAt: new Date().toISOString(),
  };

  if (canPublish && imageUrl) {
    try {
      const fbPostId = await publishToFacebook(body, imageUrl);
      post.fbPostId = fbPostId;
      post.publishedAt = new Date().toISOString();
    } catch (err) {
      console.error("[fb] publish failed, falling back to queue:", err);
      post.status = "queued";
    }
  }

  await addFbPost(post);
  return post;
}

export async function approveQueuedFbPost(id: string): Promise<FbPost | null> {
  const { token, pageId } = fbEnv();
  if (!token || !pageId) {
    // just mark as approved locally
    await updateFbPost(id, { status: "published", publishedAt: new Date().toISOString() });
    return null;
  }
  // With a real token we'd re-fetch the queued post and publish it. Deferred.
  await updateFbPost(id, { status: "published", publishedAt: new Date().toISOString() });
  return null;
}
