// Captures a looping webm video + still JPG for every demo sub-route on
// the Brandivibe dev server (localhost:3000). Output goes to mjstudio/public/work/.
//
// Usage: (from mjstudio/) `node scripts/screenshot.mjs`

import { chromium } from "playwright";
import { mkdir, readdir, rename, rm } from "fs/promises";
import path from "path";

const targets = [
  { url: "http://localhost:3000/helix", slug: "helix", recordMs: 6500, preWait: 4000 },
  { url: "http://localhost:3000/neuron", slug: "neuron", recordMs: 6500, preWait: 4000 },
  { url: "http://localhost:3000/axiom", slug: "axiom", recordMs: 6500, preWait: 4000 },
  { url: "http://localhost:3000/pulse", slug: "pulse", recordMs: 6500, preWait: 4000 },
  { url: "http://localhost:3000/aurora", slug: "aurora", recordMs: 6500, preWait: 4000 },
  { url: "http://localhost:3000/orbit", slug: "orbit", recordMs: 6500, preWait: 4000 },
  { url: "http://localhost:3000/monolith", slug: "monolith", recordMs: 6500, preWait: 4000 },
  { url: "http://localhost:3000/atrium", slug: "atrium", recordMs: 6500, preWait: 4000 },
];

async function captureVideoAndStill(browser, t) {
  const videoDir = path.resolve("public/work/_tmp");
  await mkdir(videoDir, { recursive: true });

  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: { width: 1600, height: 1000 } },
  });
  const page = await ctx.newPage();

  console.log(`\n→ ${t.url}`);
  try {
    await page.goto(t.url, { waitUntil: "networkidle", timeout: 25000 });
  } catch {
    await page.goto(t.url, { waitUntil: "load", timeout: 25000 });
  }

  await page.waitForTimeout(t.preWait);

  const stillPath = path.resolve(`public/work/${t.slug}.jpg`);
  await page.screenshot({
    path: stillPath,
    type: "jpeg",
    quality: 92,
    fullPage: false,
  });
  console.log(`  saved still → ${stillPath}`);

  await page.waitForTimeout(t.recordMs);

  await ctx.close();

  const files = await readdir(videoDir);
  const webm = files.find((f) => f.endsWith(".webm"));
  if (webm) {
    const target = path.resolve(`public/work/${t.slug}.webm`);
    await rename(path.join(videoDir, webm), target);
    console.log(`  saved video → ${target}`);
  } else {
    console.log("  WARNING: no .webm produced");
  }
}

async function main() {
  await mkdir("public/work", { recursive: true }).catch(() => {});
  const browser = await chromium.launch();

  for (const t of targets) {
    try {
      await captureVideoAndStill(browser, t);
    } catch (e) {
      console.error(`  failed: ${e.message}`);
    }
  }

  await browser.close();

  await rm(path.resolve("public/work/_tmp"), { recursive: true, force: true }).catch(() => {});
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
