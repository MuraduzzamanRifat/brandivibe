import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

const videoRequests = [];
page.on("request", (req) => {
  const url = req.url();
  if (url.includes("/stock/") || url.includes("/work/") && url.endsWith(".webm")) {
    videoRequests.push({
      at: Date.now(),
      type: url.includes("/stock/") ? "stock" : "work",
      file: url.split("/").slice(-1)[0],
    });
  }
});

console.log("--- Loading homepage ---");
const t0 = Date.now();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 });
console.log(`Initial load complete in ${Date.now() - t0}ms`);
console.log(`Videos loaded on initial page: ${videoRequests.length}`);
videoRequests.forEach(v => console.log(`  - ${v.type}/${v.file}`));

console.log("\n--- Scrolling through page ---");
const scrollSteps = [0, 1500, 3000, 4500, 6000, 7500, 9000];
for (const y of scrollSteps) {
  await page.evaluate((y) => window.scrollTo({ top: y }), y);
  await page.waitForTimeout(1200);
  console.log(`at y=${y}: ${videoRequests.length} videos loaded total`);
}

console.log(`\nFinal: ${videoRequests.length} videos requested over entire scroll`);
console.log("All videos requested:");
videoRequests.forEach(v => console.log(`  - ${v.file}`));

await browser.close();
