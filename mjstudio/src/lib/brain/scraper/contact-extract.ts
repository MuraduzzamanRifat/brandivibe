/**
 * Regex-based contact extraction from raw HTML text. Pulls:
 *   - Emails matching the target domain OR common role addresses (hello@,
 *     contact@, team@, founder@, press@, info@) on adjacent domains
 *   - Social profile URLs (Twitter/X, LinkedIn, GitHub)
 *
 * Filters out junk: image filenames, cache-busted URLs, encoded entities.
 */

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

// Obvious non-human / transactional / vendor emails we never want to message
const BLOCK_LIST = [
  /@sentry\.io$/i,
  /@wixpress\.com$/i,
  /@intercom/i,
  /@segment/i,
  /@googlegroups/i,
  /noreply/i,
  /no-reply/i,
  /donotreply/i,
  /postmaster/i,
  /abuse@/i,
  /webmaster@/i,
  /mailer-daemon/i,
  /bounce/i,
  /\.png$/i,
  /\.jpg$/i,
  /\.svg$/i,
  /\.gif$/i,
  /example\.com$/i,
  /domain\.com$/i,
  /yoursite\.com$/i,
];

export function extractContacts(
  html: string,
  targetDomain: string
): {
  emails: string[];
  socials: { twitter?: string; linkedin?: string; github?: string };
} {
  const emails = new Set<string>();

  const matches = html.match(EMAIL_RE) ?? [];
  for (const raw of matches) {
    const e = raw.toLowerCase().trim();
    if (BLOCK_LIST.some((r) => r.test(e))) continue;
    // Prefer emails on the target domain, but keep role addresses on any domain
    const onTarget = e.endsWith(`@${targetDomain}`);
    const isRole = /^(hello|contact|team|founder|press|info|sales|hi|mail|support|help|go)@/i.test(e);
    if (onTarget || isRole) emails.add(e);
  }

  const twitterMatch =
    html.match(/twitter\.com\/([a-zA-Z0-9_]{1,15})(?!\/status)/i) ||
    html.match(/x\.com\/([a-zA-Z0-9_]{1,15})(?!\/status)/i);
  const linkedinMatch = html.match(/linkedin\.com\/(?:company|in)\/([a-zA-Z0-9\-_]+)/i);
  const githubMatch = html.match(/github\.com\/([a-zA-Z0-9\-_]+)(?:\/[a-zA-Z0-9\-_]+)?/i);

  return {
    emails: Array.from(emails).slice(0, 10),
    socials: {
      twitter: twitterMatch ? `https://twitter.com/${twitterMatch[1]}` : undefined,
      linkedin: linkedinMatch ? `https://linkedin.com/${linkedinMatch[0].split("linkedin.com/")[1]}` : undefined,
      github: githubMatch ? `https://github.com/${githubMatch[1]}` : undefined,
    },
  };
}
