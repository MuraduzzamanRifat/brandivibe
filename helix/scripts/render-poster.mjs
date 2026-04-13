import { chromium } from "playwright";
import path from "path";
import { mkdir } from "fs/promises";

async function main() {
  await mkdir("public/posters", { recursive: true }).catch(() => {});

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 1600 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  const file = "file:///" + path.resolve("scripts/poster.html").replace(/\\/g, "/");
  await page.goto(file, { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(1500);

  const out = path.resolve("public/posters/helix-certificate.png");
  await page.screenshot({ path: out, type: "png", fullPage: false });
  console.log("saved →", out);

  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
