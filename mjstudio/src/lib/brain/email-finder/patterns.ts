/**
 * Generate candidate email addresses from (firstName, lastName, domain).
 * Ranked by prior probability — the most common formats first.
 *
 * We return the raw list with weights; the caller combines this with MX
 * check, disposable check, and known-format database to pick a winner.
 */

export type Candidate = {
  email: string;
  score: number; // prior probability 0-100
  reason: string;
};

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function generateEmailPatterns(
  firstName: string,
  lastName: string,
  domain: string
): Candidate[] {
  const f = slug(firstName);
  const l = slug(lastName);
  if (!f || !domain) return [];

  const d = domain.toLowerCase().replace(/^www\./, "");

  const out: Candidate[] = [];
  const push = (local: string, score: number, reason: string) => {
    if (!local) return;
    out.push({ email: `${local}@${d}`, score, reason });
  };

  if (l) {
    push(`${f}.${l}`, 35, "first.last — most common B2B format");
    push(`${f}${l}`, 18, "firstlast — common in tech");
    push(`${f[0]}${l}`, 12, "flast — common when last name is long");
    push(`${f}_${l}`, 6, "first_last — older format");
    push(`${l}.${f}`, 4, "last.first — rare, some EU companies");
    push(`${f[0]}.${l}`, 5, "f.last — some enterprises");
    push(`${f}-${l}`, 3, "first-last — rare");
    push(l, 2, "lastname only — uncommon");
  }
  push(f, 15, "firstname only — founders + small teams");

  // Role-based fallbacks (already filtered to likely-human, not noreply)
  push("hello", 5, "hello@ — common role for founder-run shops");
  push("founder", 3, "founder@ — sometimes works at seed stage");

  // Normalize + dedupe
  const seen = new Set<string>();
  return out.filter((c) => {
    if (seen.has(c.email)) return false;
    seen.add(c.email);
    return true;
  });
}
