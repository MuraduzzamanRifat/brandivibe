/**
 * Fingerprint web tech from a raw HTML page. Pattern-based, zero dependencies.
 * Returns an array of lowercase stack identifiers the LLM can reason over.
 */

type Rule = { tech: string; pattern: RegExp };

const RULES: Rule[] = [
  // CMS
  { tech: "wordpress", pattern: /\/wp-content\/|wp-includes|wp-json/i },
  { tech: "elementor", pattern: /elementor(-|\/|\.js|\.css)/i },
  { tech: "divi", pattern: /\/et-(core|builder)/i },
  { tech: "wix", pattern: /static\.wixstatic\.com|_wix/i },
  { tech: "squarespace", pattern: /squarespace(-cdn|\.com\/universal)/i },
  { tech: "webflow", pattern: /webflow\.(com|io)|wf-form|w-container/i },
  { tech: "shopify", pattern: /cdn\.shopify\.com|shopify\.com\/s\//i },
  { tech: "ghost", pattern: /ghost\.io|content=\"Ghost\s/i },
  { tech: "framer", pattern: /framerusercontent|framer\.app/i },
  { tech: "notion", pattern: /notion\.so|notion-static/i },

  // Frameworks
  { tech: "next.js", pattern: /__NEXT_DATA__|\/_next\/static/i },
  { tech: "nuxt", pattern: /__NUXT__|\/_nuxt\//i },
  { tech: "gatsby", pattern: /\/___gatsby|gatsby-chunk-mapping/i },
  { tech: "astro", pattern: /astro-island|astro\.config/i },
  { tech: "remix", pattern: /__remixContext|remix\.run/i },
  { tech: "sveltekit", pattern: /__sveltekit|svelte-kit/i },
  { tech: "react", pattern: /react-dom|data-reactroot|__reactContainer/i },
  { tech: "vue", pattern: /data-v-[a-f0-9]{8}|vue\.js|__VUE/i },

  // UI / style
  { tech: "tailwind", pattern: /(?:class=\"[^\"]*\b(?:px|py|mx|my|flex|grid)-\d)|cdn\.tailwindcss/i },
  { tech: "chakra", pattern: /chakra-ui/i },
  { tech: "material-ui", pattern: /mui-style|MuiButtonBase/i },
  { tech: "bootstrap", pattern: /bootstrap(?:\.min)?\.css|\bclass=\"[^\"]*\bcontainer-fluid/i },

  // Animation
  { tech: "framer-motion", pattern: /framer-motion|motion\.[a-z]+/i },
  { tech: "gsap", pattern: /gsap(?:\.min)?\.js|TweenMax|TweenLite/i },
  { tech: "three.js", pattern: /three(?:\.min)?\.js|THREE\./i },
  { tech: "r3f", pattern: /@react-three\/fiber|react-three-fiber/i },
  { tech: "lottie", pattern: /lottie(?:\.min)?\.js|lottiefiles/i },

  // Analytics / ops
  { tech: "google-analytics", pattern: /googletagmanager\.com\/gtag|www\.google-analytics\.com\/analytics/i },
  { tech: "gtm", pattern: /GTM-[A-Z0-9]+/ },
  { tech: "plausible", pattern: /plausible\.io\/js/i },
  { tech: "posthog", pattern: /posthog\.com\/static/i },
  { tech: "mixpanel", pattern: /mixpanel\.com|cdn\.mxpnl/i },
  { tech: "segment", pattern: /cdn\.segment\.com/i },
  { tech: "hotjar", pattern: /static\.hotjar/i },

  // Forms / auth
  { tech: "hubspot", pattern: /hs-scripts\.com|hubspot/i },
  { tech: "typeform", pattern: /typeform\.com\/embed/i },
  { tech: "calendly", pattern: /calendly\.com\/embed/i },
  { tech: "mailchimp", pattern: /mailchimp\.com|list-manage\.com/i },
  { tech: "convertkit", pattern: /convertkit\.com/i },
  { tech: "clerk", pattern: /clerk\.dev|clerk\.com/i },
  { tech: "auth0", pattern: /auth0\.com\/js/i },

  // Infra signals
  { tech: "vercel", pattern: /x-vercel|vercel-deployment|vercel\.app/i },
  { tech: "netlify", pattern: /netlify\.app|netlifycms|\.netlify\//i },
  { tech: "cloudflare", pattern: /__cf_bm|cdn-cgi\/|cf-ray/i },

  // Fonts
  { tech: "google-fonts", pattern: /fonts\.googleapis|fonts\.gstatic/i },
  { tech: "typekit", pattern: /use\.typekit|adobe\.typekit/i },
];

export function detectTechStack(html: string): string[] {
  const found = new Set<string>();
  for (const { tech, pattern } of RULES) {
    if (pattern.test(html)) found.add(tech);
  }
  // Collapse redundant signals — if r3f present, react is implied
  if (found.has("r3f")) found.add("react");
  if (found.has("next.js")) found.add("react");
  return Array.from(found);
}
