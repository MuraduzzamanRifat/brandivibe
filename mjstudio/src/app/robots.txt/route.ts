export const dynamic = "force-static";

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /dashboard",
    "Disallow: /api/",
    "",
    "Sitemap: https://brandivibe.com/sitemap.xml",
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
