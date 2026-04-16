import OpenAI from "openai";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (client) return client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to mjstudio/.env.local."
    );
  }
  client = new OpenAI({
    apiKey: key,
    timeout: 45_000, // 45 s — tight enough to recover within Koyeb's 300 s maxDuration
    maxRetries: 2,   // retry transient 5xx / network errors automatically
  });
  return client;
}

export const MODELS = {
  /** Fast + cheap — used for classification, short drafts, scoring */
  FAST: "gpt-4o-mini" as const,
  /** Higher quality — used for long email drafts, research synthesis */
  QUALITY: "gpt-4o" as const,
} as const;
