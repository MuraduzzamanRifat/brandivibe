import { getAllServices, getIndustries, pillars } from "@/lib/content";

// llms.txt (llmstxt.org) — a curated, plain-markdown map of the site for AI
// assistants (ChatGPT, Claude, Perplexity, Gemini). Generated from Payload so
// it never goes stale; revalidates hourly.
export const revalidate = 3600;

const BASE = "https://brandivibe.com";

export async function GET() {
  const [services, industries] = await Promise.all([getAllServices(), getIndustries()]);

  const lines: string[] = [
    "# Brandivibe",
    "",
    "> Brandivibe is a digital agency founded by Muraduzzaman. We design and build websites (including cinematic WebGL/3D experiences), custom software, and AI-powered content and automation systems — plus the digital marketing to get them found. Clear fixed pricing agreed before work starts; most projects go live in about 6 weeks.",
    "",
    `- [Services overview](${BASE}/services): everything we do, organized by pillar`,
    `- [Case studies](${BASE}/case-studies): selected work`,
    `- [Journal](${BASE}/journal): essays on web design, SEO, and AI content`,
    `- [Glossary](${BASE}/glossary): plain-English definitions of digital terms`,
    `- [About](${BASE}/about): who we are`,
    `- [Contact](${BASE}/contact): start a project (email hello@brandivibe.com)`,
    "",
  ];

  for (const pillar of pillars) {
    const inPillar = services.filter((s) => s.pillar === pillar.title);
    if (inPillar.length === 0) continue;
    lines.push(`## ${pillar.title}`, "");
    lines.push(`> ${pillar.blurb}`, "");
    for (const s of inPillar) {
      lines.push(`- [${s.title}](${BASE}/services/${s.slug}): ${s.summary}`);
    }
    lines.push("");
  }

  if (industries.length > 0) {
    lines.push("## Industries", "");
    lines.push(
      "> Every service above is also shaped for specific industries — pages live at /services/<service>/<industry>.",
      ""
    );
    for (const i of industries) {
      lines.push(`- [${i.name}](${BASE}/industries#${i.slug})`);
    }
    lines.push("");
  }

  lines.push(
    "## Optional",
    "",
    `- [Sitemap](${BASE}/sitemap.xml): full URL inventory`,
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
