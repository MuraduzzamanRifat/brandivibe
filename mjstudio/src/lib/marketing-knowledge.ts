import { readFile } from "fs/promises";
import path from "path";

/**
 * Loads every document in the monorepo's /marketing/ folder and concatenates
 * them into a single system-prompt-ready string. The AI brain uses this as
 * grounded context for every lead scoring + email drafting call.
 *
 * Cached in memory after first load so repeated API calls don't re-read disk.
 */

const FILES = [
  "icp.md",
  "positioning.md",
  "messaging.md",
  "battlecards.md",
  "gtm.md",
];

let cached: string | null = null;

export async function loadMarketingKnowledge(): Promise<string> {
  if (cached) return cached;

  // repo root is mjstudio/../ (the monorepo root)
  const root = path.resolve(process.cwd(), "..");

  const parts: string[] = [];
  for (const file of FILES) {
    const fullPath = path.join(root, "marketing", file);
    try {
      const content = await readFile(fullPath, "utf8");
      parts.push(`=== ${file} ===\n\n${content}`);
    } catch {
      // If marketing folder not present (e.g., shallow clone in Koyeb build),
      // skip silently. The AI will still work with a smaller context.
    }
  }

  cached = parts.join("\n\n---\n\n");
  return cached;
}

export function resetMarketingCache() {
  cached = null;
}
