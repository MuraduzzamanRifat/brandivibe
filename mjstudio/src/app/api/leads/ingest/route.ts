import { NextResponse } from "next/server";
import { ingestGmapsLeads, logActivity, type GmapsLead } from "@/lib/brain-storage";

/**
 * POST /api/leads/ingest
 * Header: x-leads-secret: <BRAIN_CRON_SECRET>
 * Body:   { query: string, leads: GmapsLead[] }
 *
 * Receives a batch of Google Maps leads from the Brandivibe Chrome
 * extension. Dedupes by place_id (or name+address fallback), saves to
 * brain.gmapsLeads, logs an activity, and returns counts.
 *
 * CORS open to chrome-extension://* origins so the extension can call
 * directly without a proxy.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-leads-secret",
  "Access-Control-Max-Age": "86400",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function authorized(req: Request): boolean {
  const secret = process.env.BRAIN_CRON_SECRET;
  if (!secret) return true; // dev mode
  return req.headers.get("x-leads-secret") === secret;
}

type IngestBody = {
  query?: string;
  leads?: Partial<GmapsLead>[];
};

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

  // Sanitize each lead — only keep known fields, trim strings, drop empties
  const cleaned: GmapsLead[] = rawLeads
    .map((l, i): GmapsLead | null => {
      const name = (l.name ?? "").trim();
      if (!name) return null;
      return {
        id: `gm_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 6)}`,
        placeId: l.placeId?.toString().trim() || undefined,
        name: name.slice(0, 200),
        address: l.address?.toString().trim().slice(0, 300) || undefined,
        phone: l.phone?.toString().trim().slice(0, 50) || undefined,
        website: l.website?.toString().trim().slice(0, 300) || undefined,
        category: l.category?.toString().trim().slice(0, 100) || undefined,
        rating: typeof l.rating === "number" ? l.rating : undefined,
        reviewCount: typeof l.reviewCount === "number" ? l.reviewCount : undefined,
        lat: typeof l.lat === "number" ? l.lat : undefined,
        lng: typeof l.lng === "number" ? l.lng : undefined,
        hours: l.hours?.toString().trim().slice(0, 200) || undefined,
        query: query.slice(0, 200),
        scrapedAt: new Date().toISOString(),
        source: "gmaps-extension",
      };
    })
    .filter((l): l is GmapsLead => l !== null);

  const result = await ingestGmapsLeads(cleaned);

  await logActivity({
    type: "gmaps-leads-ingested",
    description: `Maps scrape "${query.slice(0, 60)}": +${result.added} new leads, ${result.deduped} dedup`,
    source: "gmaps-extension",
  });

  return NextResponse.json(
    { ok: true, ...result, query },
    { headers: CORS_HEADERS }
  );
}
