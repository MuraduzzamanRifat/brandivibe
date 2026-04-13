import { chromium } from "playwright";
import path from "path";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
await page.waitForTimeout(4000);

const sections = [
  { y: 0, name: "hero" },
  { y: 1400, name: "manifesto" },
  { y: 2600, name: "work" },
  { y: 4400, name: "services" },
  { y: 6000, name: "process" },
  { y: 7400, name: "contact" },
];

for (const s of sections) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s.y);
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.resolve(`public/work/_mj-${s.name}.jpg`),
    type: "jpeg",
    quality: 90,
  });
  console.log(`saved ${s.name}`);
}

await browser.close();
