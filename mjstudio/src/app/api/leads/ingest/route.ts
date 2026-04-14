import { NextResponse } from "next/server";
import { ingestGmapsLeads, logActivity, type GmapsLead } from "@/lib/brain-storage";
import { scrapeWebsite } from "@/lib/brain/scraper/website";

/**
 * POST /api/leads/ingest
 * Header: x-leads-secret: <BRAIN_CRON_SECRET>
 * Body:   { query: string, leads: Array<{ name, website, location? }> }
 *
 * Receives raw Maps leads from the Brandivibe Chrome extension. For each
 * lead, scrapes the business website using the existing Phase 4 scraper
 * to extract emails from the live HTML (homepage + /about + /team +
 * /pricing + /contact). Drops any lead where no email is found. Saves
 * only the enriched, email-bearing leads to brain.gmapsLeads.
 *
 * Email is mandatory — leads without one are not stored.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-leads-secret",
  "Access-Control-Max-Age": "86400",
};

const MAX_BATCH = 50;
const PARALLEL = 6;

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function authorized(req: Request): boolean {
  const secret = process.env.BRAIN_CRON_SECRET;
  if (!secret) return true; // dev mode
  return req.headers.get("x-leads-secret") === secret;
}

type RawLead = {
  name?: string;
  website?: string;
  location?: string;
};

type IngestBody = {
  query?: string;
  leads?: RawLead[];
};

/**
 * Run an array of async tasks with bounded parallelism.
 * Promise.all in chunks — simple and reliable.
 */
async function batched<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const slice = items.slice(i, i + limit);
    const results = await Promise.all(slice.map(fn));
    out.push(...results);
  }
  return out;
}

async function enrichLead(
  raw: RawLead,
  query: string
): Promise<GmapsLead | null> {
  const name = (raw.name ?? "").trim();
  const website = (raw.website ?? "").trim();
  const location = (raw.location ?? "").trim();

  if (!name || !website) return null;

  // Scrape the business website using the existing Phase 4 scraper
  let scraped;
  try {
    scraped = await scrapeWebsite(website);
  } catch {
    return null;
  }
  if (!scraped) return null;

  const emails = scraped.foundEmails ?? [];
  if (emails.length === 0) return null;

  return {
    id: `gm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name.slice(0, 200),
    email: emails[0],
    website: website.slice(0, 300),
    location: location.slice(0, 300),
    altEmails: emails.slice(1, 5),
    query: query.slice(0, 200),
    scrapedAt: new Date().toISOString(),
    source: "gmaps-extension",
  };
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  let body: IngestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid JSON" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const query = (body.query ?? "").trim();
  const rawLeads = Array.isArray(body.leads) ? body.leads : [];
  if (rawLeads.length === 0) {
    return NextResponse.json(
      { error: "leads array required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const limited = rawLeads.slice(0, MAX_BATCH);

  // Enrich every lead in bounded parallelism
  const enrichedNullable = await batched(limited, PARALLEL, (l) =>
    enrichLead(l, query)
  );
  const enriched = enrichedNullable.filter((l): l is GmapsLead => l !== null);

  const noWebsite = limited.filter((l) => !l.website?.trim()).length;
  const noEmail = limited.length - noWebsite - enriched.length;

  const result = await ingestGmapsLeads(enriched);

  await logActivity({
    type: "gmaps-leads-ingested",
    description: `Maps "${query.slice(0, 60)}": ${limited.length} sourced → ${enriched.length} with email → +${result.added} new (${result.deduped} dedup, ${noEmail} dropped no-email, ${noWebsite} dropped no-website)`,
    source: "gmaps-extension",
  });

  return NextResponse.json(
    {
      ok: true,
      sourced: limited.length,
      enriched: enriched.length,
      added: result.added,
      deduped: result.deduped,
      droppedNoWebsite: noWebsite,
      droppedNoEmail: noEmail,
      query,
    },
    { headers: CORS_HEADERS }
  );
}
