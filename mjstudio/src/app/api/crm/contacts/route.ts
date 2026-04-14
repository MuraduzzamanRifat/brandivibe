import { NextResponse } from "next/server";
import {
  listCrmContacts,
  upsertCrmContact,
  syncCrmContactsFromSources,
  listCrmEmailsForContact,
  logActivity,
} from "@/lib/brain-storage";

/**
 * GET  /api/crm/contacts            — list all contacts + each contact's email history count
 * POST /api/crm/contacts            — create a manual contact
 * POST /api/crm/contacts?sync=1     — pull gmaps leads + prospects into the CRM (dedupes by email)
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const contacts = await listCrmContacts();
  // Attach email count per contact so the UI can render badges without another request
  const enriched = await Promise.all(
    contacts.map(async (c) => ({
      ...c,
      sentCount: (await listCrmEmailsForContact(c.id)).filter((e) => e.status === "sent").length,
    }))
  );
  return NextResponse.json({ contacts: enriched });
}

export async function POST(req: Request) {
  const url = new URL(req.url);

  if (url.searchParams.get("sync") === "1") {
    const result = await syncCrmContactsFromSources();
    await logActivity({
      type: "crm-contact-added",
      description: `CRM sync from sources: +${result.added} new contacts (${result.skipped} already present)`,
    });
    return NextResponse.json({ ok: true, ...result });
  }

  let body: {
    name?: string;
    email?: string;
    company?: string;
    website?: string;
    location?: string;
    notes?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  }

  const contact = await upsertCrmContact({
    name: body.name.trim(),
    email: body.email.trim(),
    company: body.company?.trim(),
    website: body.website?.trim(),
    location: body.location?.trim(),
    notes: body.notes?.trim(),
    source: "manual",
  });

  await logActivity({
    type: "crm-contact-added",
    description: `Manual CRM contact added: ${contact.name} <${contact.email}>`,
  });

  return NextResponse.json({ ok: true, contact });
}
