/**
 * Programmatic SEO content builder.
 *
 * Combines a Service record (from data/services.ts) with an Industry record
 * (from data/industries.ts) to produce a unique landing page payload at
 * /services/[slug]/[industry]. The output is the content the page component
 * renders — meta, hero, body, FAQ, schema.
 *
 * Goal: each of the 5×8 = 40 generated URLs has substantive industry-
 * specific content (not just keyword swaps), so Google and AI search
 * treat each as a real answer to the long-tail query, not thin content.
 */

import type { Service } from "@/data/services";
import type { Industry } from "@/data/industries";

const SITE = "https://brandivibe.com";

export type ServiceIndustryFaqPair = {
  q: string;
  a: string;
};

export type ServiceIndustryPayload = {
  service: Service;
  industry: Industry;
  hook: string;
  tagline: string;
  intro: string[];
  industryFraming: string;
  combinedPainPoints: string[];
  faqPairs: ServiceIndustryFaqPair[];
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  serviceSchema: Record<string, unknown>;
  faqSchema: Record<string, unknown>;
  breadcrumbSchema: Record<string, unknown>;
};

/**
 * Build the full payload for a /services/[slug]/[industry] page.
 *
 * The page is the entire surface — title, meta, JSON-LD, body — so this
 * function is the single source of truth. The page component is a thin
 * renderer over the payload.
 */
export function buildServiceIndustryPayload(
  service: Service,
  industry: Industry
): ServiceIndustryPayload {
  // Hook: industry-aware variant of service.hook. Keeps the persuasive
  // edge from the service hook but anchors the visitor with their
  // industry context immediately.
  const hook = `${service.hook.replace(/\.$/, "")} — for ${industry.pluralName}.`;

  // Tagline: combines service tagline with industry framing.
  const tagline = `${service.tagline.replace(/\.$/, "")} — engineered for ${industry.pluralName}.`;

  // Intro: 2 paragraphs combining industry intro + service-specific
  // framing for this industry. Both come from the data files, so each
  // industry × service combo has a unique intro pair.
  const industryFraming =
    industry.serviceFraming[service.slug] ??
    `${service.title} for ${industry.pluralName}: built around the conversion priorities and operational realities of ${industry.shortLabel}.`;

  const intro = [
    industry.intro,
    `That's why we shape our ${service.title} work around ${industry.pluralName} specifically. ${industryFraming}`,
  ];

  // Combined pain points: lead with industry-specific pains (which the
  // visitor recognizes as their own), then layer on service-specific
  // pains. Capped at 5 to stay scannable.
  const combinedPainPoints = [
    ...industry.painPoints.slice(0, 3),
    ...service.whenYouNeedThis.slice(0, 2),
  ].slice(0, 5);

  // FAQ: industry-specific Q/A pairs from the industry data + a
  // service-specific Q/A derived from the service. Each combo's FAQ is
  // unique because it contains industry questions, service framing, and
  // a generic "how long" answer rooted in the service process.
  const faqPairs: ServiceIndustryFaqPair[] = [
    {
      // Phrased independently of `industryFraming` — that sentence already
      // appears verbatim in intro[1], and repeating it word-for-word on the
      // same page reads as broken templating (to people and to Google).
      q: `Why do ${industry.pluralName} need ${service.title} specifically?`,
      a: `Because a generic ${service.title} approach ignores how ${industry.pluralName} actually evaluate and buy — the conversion moment that matters here is ${industry.conversionFrame.charAt(0).toLowerCase()}${industry.conversionFrame.slice(1)}. We scope the engagement around that from day one, rather than adapting a one-size-fits-all playbook afterwards.`,
    },
    ...industry.industryFaqs,
    {
      q: `How long does a ${service.title} engagement take for a ${industry.name} brand?`,
      a: `Six weeks, fixed. ${service.process[0].label}: ${service.process[0].title.toLowerCase()}. ${service.process[1].label}: ${service.process[1].title.toLowerCase()}. The strategy, messaging, and execution are built around how ${industry.pluralName} buy.`,
    },
    {
      q: `What's included in Brandivibe's ${service.title} for ${industry.pluralName}?`,
      a: `Each engagement covers ${service.capabilities
        .slice(0, 3)
        .map((c) => c.title)
        .join(", ")}, plus ${service.deliverables.length}+ concrete deliverables you own outright — all framed for the buyer journey of ${industry.pluralName}.`,
    },
  ];

  // Meta title: long-tail commercial-intent format. Keep within ~60 chars:
  // the brand suffix is dropped when the keyword phrase alone already fills
  // the SERP title width (the keyword matters more than the brand there).
  const baseTitle = `${service.title} for ${industry.pluralName}`;
  const metaTitle = baseTitle.length <= 47 ? `${baseTitle} · Brandivibe` : baseTitle;

  // Meta description: industry-specific outcome + service capability.
  // Always a COMPLETE sentence — never truncated mid-thought (a hanging
  // ellipsis in SERPs reads as broken templating).
  // Never lowercase service.title here — it mangles acronyms in SERPs
  // ("Custom seo services…", "Custom crm systems…"). The tagline gives each
  // service a distinct sentence, so combos don't read as one template.
  // The tagline is the same across all 8 industry variants of a service, so a
  // description built from it alone reads as boilerplate. Anchor the tail to the
  // industry's own conversion goal (authored per-industry, so each of the 8
  // variants differs) — falling back to shorter forms to stay under 160 chars.
  const frame = industry.conversionFrame.charAt(0).toLowerCase() + industry.conversionFrame.slice(1);
  const withFrame = `${baseTitle} — built around what actually converts a ${industry.name} buyer: ${frame}.`;
  const candidate = `${baseTitle}: ${service.tagline}`;
  const metaDescription =
    withFrame.length <= 160
      ? withFrame
      : candidate.length <= 160
        ? candidate
        : `${baseTitle} — shaped around how ${industry.name} buyers decide. Fixed pricing, delivered in about six weeks.`;

  const canonical = `/services/${service.slug}/${industry.slug}`;

  // Service schema: tells AI search this page is a Service offering
  // tailored to a specific industry.
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}${canonical}`,
    name: `${service.title} for ${industry.pluralName}`,
    description: metaDescription,
    provider: {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Brandivibe",
      url: SITE,
    },
    serviceType: service.title,
    audience: {
      "@type": "BusinessAudience",
      audienceType: industry.shortLabel,
      name: industry.pluralName,
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} capabilities for ${industry.pluralName}`,
      itemListElement: service.capabilities.map((cap, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: cap.title,
          description: cap.body,
        },
      })),
    },
  };

  // FAQPage schema: high-impact for AI extraction. Each industry × service
  // combo's FAQ is unique because the questions reference the specific
  // industry by name.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqPairs.map((pair) => ({
      "@type": "Question",
      name: pair.q,
      acceptedAnswer: { "@type": "Answer", text: pair.a },
    })),
  };

  // Breadcrumb schema: helps Google render the breadcrumb in SERPs and
  // signals the canonical hierarchy for crawlers.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Brandivibe",
        item: SITE,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `${SITE}/services/${service.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `For ${industry.pluralName}`,
        item: `${SITE}${canonical}`,
      },
    ],
  };

  return {
    service,
    industry,
    hook,
    tagline,
    intro,
    industryFraming,
    combinedPainPoints,
    faqPairs,
    metaTitle,
    metaDescription,
    canonical,
    serviceSchema,
    faqSchema,
    breadcrumbSchema,
  };
}
