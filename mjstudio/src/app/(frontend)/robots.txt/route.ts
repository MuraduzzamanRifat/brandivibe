export const dynamic = "force-static";

export function GET() {
  const body = [
    // General crawlers
    "User-agent: *",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Allow: /api/media/",
    "Disallow: /api/",
    "",
    // OpenAI / ChatGPT Browse
    "User-agent: GPTBot",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Allow: /api/media/",
    "Disallow: /api/",
    "",
    // Anthropic / Claude
    "User-agent: ClaudeBot",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Allow: /api/media/",
    "Disallow: /api/",
    "",
    "User-agent: anthropic-ai",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Allow: /api/media/",
    "Disallow: /api/",
    "",
    // Perplexity
    "User-agent: PerplexityBot",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Allow: /api/media/",
    "Disallow: /api/",
    "",
    // Google Gemini / Bard
    "User-agent: Google-Extended",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Allow: /api/media/",
    "Disallow: /api/",
    "",
    // Common Crawl (trains most LLMs)
    "User-agent: CCBot",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Allow: /api/media/",
    "Disallow: /api/",
    "",
    // Cohere
    "User-agent: cohere-ai",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /admin",
    "Allow: /api/media/",
    "Disallow: /api/",
    "",
    "Sitemap: https://brandivibe.com/sitemap.xml",
    "",
  ]
    .filter((line) => !line.startsWith("//"))
    .join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
