import { chromium } from "playwright";
import path from "path";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 20000 }).catch(() => {});
await page.waitForTimeout(4000);
await page.screenshot({
  path: path.resolve("public/work/_mj-hero.jpg"),
  type: "jpeg",
  quality: 92,
});
console.log("saved");

// also scroll to manifesto section
await page.evaluate(() => window.scrollTo({ top: 1000, behavior: "instant" }));
await page.waitForTimeout(1500);
await page.screenshot({
  path: path.resolve("public/work/_mj-manifesto.jpg"),
  type: "jpeg",
  quality: 92,
});
console.log("saved manifesto");

await browser.close();
