import { NextResponse } from "next/server";
import { loadActivities } from "@/lib/brain-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const activities = await loadActivities(100);
  return NextResponse.json({ activities });
}
