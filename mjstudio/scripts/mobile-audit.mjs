// Capture mobile (375px) screenshots of every route to find layout breakage.
// Saves to public/work/_mobile-{slug}.jpg.

import { chromium } from "playwright";
import path from "path";

const routes = [
  { path: "/", slug: "home" },
  { path: "/helix", slug: "helix" },
  { path: "/neuron", slug: "neuron" },
  { path: "/axiom", slug: "axiom" },
  { path: "/pulse", slug: "pulse" },
  { path: "/aurora", slug: "aurora" },
  { path: "/orbit", slug: "orbit" },
  { path: "/monolith", slug: "monolith" },
  { path: "/atrium", slug: "atrium" },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 375, height: 812 }, // iPhone X
  deviceScaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
});
const page = await ctx.newPage();

const issues = [];

for (const r of routes) {
  const url = `http://localhost:3000${r.path}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);

  // Check for horizontal scroll
  const xOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
  );

  // Screenshot hero view
  const out = path.resolve(`public/work/_mobile-${r.slug}.jpg`);
  await page.screenshot({
    path: out,
    type: "jpeg",
    quality: 88,
    fullPage: false,
  });

  if (xOverflow) {
    issues.push(`${r.path}: HORIZONTAL OVERFLOW detected`);
  }

  console.log(`  captured ${r.slug}${xOverflow ? " ⚠️" : ""}`);
}

if (issues.length) {
  console.log("\n=== ISSUES ===");
  issues.forEach((i) => console.log(`  ${i}`));
} else {
  console.log("\nNo horizontal overflow detected on any route.");
}

await browser.close();
