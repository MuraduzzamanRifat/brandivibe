import { NextResponse } from "next/server";
import { listGmapsLeads } from "@/lib/brain-storage";

/**
 * GET /api/leads — returns the most recent Google Maps leads scraped via the
 * Brandivibe Chrome extension. Used by the dashboard Maps Leads tab.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "500", 10), 2000);
  const leads = await listGmapsLeads(limit);
  return NextResponse.json({
    count: leads.length,
    leads,
  });
}
