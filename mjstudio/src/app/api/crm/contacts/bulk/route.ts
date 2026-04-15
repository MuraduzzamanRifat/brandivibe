import { NextResponse } from "next/server";
import { upsertCrmContactsBulk, logActivity, EMAIL_RE } from "@/lib/brain-storage";

/**
 * POST /api/crm/contacts/bulk
 * Body: { rows: Array<{ name, email, company?, website?, location?, notes? }> }
 *
 * Bulk-import contacts. Routes through upsertCrmContactsBulk for a single
 * loadBrain + saveBrain pass — at N=1000 this is ~2 file writes instead of
 * 2000, and ~1 GitHub push instead of 1000.
 */

export const dynamic = "force-dynamic";

type RawRow = {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  location?: string;
  notes?: string;
};

const MAX_ROWS = 1000;

export async function POST(req: Request) {
  let body: { rows?: RawRow[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const rows = Array.isArray(body.rows) ? body.rows.slice(0, MAX_ROWS) : [];
  if (rows.length === 0) {
    return NextResponse.json({ error: "rows array required" }, { status: 400 });
  }

  const seenEmails = new Set<string>();
  const valid: Array<{
    name: string;
    email: string;
    company?: string;
    website?: string;
    location?: string;
    notes?: string;
    source: "manual";
  }> = [];
  let invalid = 0;

  for (const row of rows) {
    const name = (row.name ?? "").trim();
    const email = (row.email ?? "").trim().toLowerCase();
    if (!name || !EMAIL_RE.test(email)) {
      invalid++;
      continue;
    }
    if (seenEmails.has(email)) continue;
    seenEmails.add(email);
    valid.push({
      name: name.slice(0, 200),
      email,
      company: row.company?.trim().slice(0, 200) || undefined,
      website: row.website?.trim().slice(0, 300) || undefined,
      location: row.location?.trim().slice(0, 300) || undefined,
      notes: row.notes?.trim().slice(0, 1000) || undefined,
      source: "manual",
    });
  }

  const { added, updated } = await upsertCrmContactsBulk(valid);

  await logActivity({
    type: "crm-contact-added",
    description: `Bulk import: ${rows.length} rows → +${added} new, ${updated} updated, ${invalid} invalid`,
  });

  return NextResponse.json({
    ok: true,
    received: rows.length,
    added,
    updated,
    invalid,
  });
}
