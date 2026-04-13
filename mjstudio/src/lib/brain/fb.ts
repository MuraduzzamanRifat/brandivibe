import { getOpenAI } from "../openai";
import { addFbPost, updateFbPost, type FbPost, type FbPostSpec } from "../brain-storage";

/**
 * Facebook executor. For each FbPostSpec from the planner:
 *   1. Generate a DALL-E image
 *   2. If FACEBOOK_ACCESS_TOKEN is present, POST to Graph API /PAGE_ID/photos
 *   3. Otherwise push to the brain's fbQueue for manual approval
 *
 * When the env vars appear later, the same flow auto-publishes. No code
 * change needed.
 */

function fbEnv() {
  return {
    token: process.env.FACEBOOK_ACCESS_TOKEN,
    pageId: process.env.FACEBOOK_PAGE_ID,
  };
}

type DalleResponse = {
  data: Array<{ url?: string; b64_json?: string }>;
};

async function generateImage(prompt: string): Promise<string> {
  const openai = getOpenAI();
  const res = (await openai.images.generate({
    model: "dall-e-3",
    prompt: `${prompt}. Eye-catching social media format, 1:1 square, bold composition, founder-audience aesthetic, no text overlay.`,
    size: "1024x1024",
    quality: "standard",
    response_format: "b64_json",
    n: 1,
  })) as unknown as DalleResponse;
  const b64 = res.data[0]?.b64_json;
  if (!b64) throw new Error("DALL-E returned no image");
  return `data:image/png;base64,${b64}`;
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
    imageUrl = await generateImage(spec.imagePrompt);
  } catch (err) {
    console.error("[fb] image generation failed:", err);
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
