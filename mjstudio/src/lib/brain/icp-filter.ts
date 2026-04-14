/**
 * Pre-flight ICP filter. Rejects obvious mega-cap targets before they hit
 * the scraper / GPT-4o pipeline. Saves API spend AND avoids embarrassing
 * audits like "Vercel should add a Contact Sales button."
 *
 * This is intentionally a hardcoded blocklist — no API calls, no fancy
 * heuristics. The list is the top ~150 brands that solo studios should
 * never pitch and that audit emails would look idiotic going to.
 */

const MEGA_BRANDS = new Set([
  // Big tech
  "google.com", "alphabet.com", "youtube.com", "gmail.com",
  "apple.com", "icloud.com",
  "microsoft.com", "azure.com", "office.com", "outlook.com", "linkedin.com", "github.com", "openai.com",
  "meta.com", "facebook.com", "instagram.com", "whatsapp.com", "threads.net",
  "amazon.com", "aws.amazon.com", "twitch.tv", "audible.com",
  "netflix.com", "hulu.com", "disney.com", "disneyplus.com",
  "tesla.com", "spacex.com",
  "x.com", "twitter.com",
  "tiktok.com", "bytedance.com",
  "salesforce.com", "slack.com",
  "oracle.com", "ibm.com", "intel.com", "amd.com", "nvidia.com", "samsung.com",
  "adobe.com",
  "uber.com", "lyft.com", "doordash.com",
  "airbnb.com",
  "spotify.com",
  "paypal.com", "stripe.com", "square.com", "block.xyz", "venmo.com",
  "shopify.com",
  "zoom.us", "dropbox.com", "box.com",
  "atlassian.com", "trello.com", "jira.com",
  "asana.com", "monday.com", "clickup.com",
  "notion.so", "figma.com", "canva.com", "miro.com", "loom.com",
  "linear.app", "vercel.com", "netlify.com", "cloudflare.com",
  "hubspot.com", "mailchimp.com", "intercom.com", "zendesk.com",
  "twilio.com", "sendgrid.com", "resend.com",
  "datadoghq.com", "datadog.com", "sentry.io", "newrelic.com",
  "snowflake.com", "databricks.com", "mongodb.com", "postgresql.org", "redis.io", "supabase.com",
  "auth0.com", "okta.com", "clerk.dev", "clerk.com",
  "discord.com", "telegram.org", "signal.org",
  "reddit.com", "quora.com", "wikipedia.org",
  "openai.com", "anthropic.com", "huggingface.co",
  "coinbase.com", "binance.com", "kraken.com",
  "wise.com", "revolut.com", "cash.app",
  "tencent.com", "wechat.com", "alibaba.com", "baidu.com",
  "yahoo.com", "bing.com", "duckduckgo.com",
  // Famous design / agency brands you'd embarrass yourself pitching
  "basement.studio", "vercel.studio", "studiofreight.com",
  "active-theory.com", "activetheory.net", "tendril.studio", "exo.cat",
  // Big news / publishing
  "nytimes.com", "wsj.com", "ft.com", "bbc.com", "cnn.com", "bloomberg.com",
  "techcrunch.com", "theverge.com", "wired.com", "arstechnica.com",
  // Education
  "harvard.edu", "stanford.edu", "mit.edu",
]);

export type IcpFilterResult =
  | { ok: true }
  | { ok: false; reason: "mega-brand" | "invalid-domain"; message: string };

export function checkIcpFilter(domain: string): IcpFilterResult {
  const d = domain.toLowerCase().replace(/^www\./, "").trim();
  if (!d || !d.includes(".")) {
    return { ok: false, reason: "invalid-domain", message: "Not a valid domain." };
  }
  if (MEGA_BRANDS.has(d)) {
    return {
      ok: false,
      reason: "mega-brand",
      message: `${d} is out of Brandivibe's ICP — Brandivibe targets Seed–Series B founder companies in the $35–90K rebuild range, not enterprise mega-brands. Try your own startup or a Seed–Series B portfolio company instead.`,
    };
  }
  // Subdomain protection — "blog.vercel.com" etc
  for (const brand of MEGA_BRANDS) {
    if (d.endsWith(`.${brand}`)) {
      return {
        ok: false,
        reason: "mega-brand",
        message: `${d} appears to be a subdomain of ${brand}, which is out of ICP for Brandivibe.`,
      };
    }
  }
  return { ok: true };
}
