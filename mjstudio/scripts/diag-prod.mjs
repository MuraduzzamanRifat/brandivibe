import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

const errors = [];
const consoleMessages = [];
page.on("pageerror", (err) => errors.push({ type: "pageerror", message: err.message, stack: err.stack?.slice(0, 800) }));
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    consoleMessages.push({ type: msg.type(), text: msg.text().slice(0, 400) });
  }
});
page.on("requestfailed", (req) => consoleMessages.push({ type: "requestfailed", text: req.url() + " — " + req.failure()?.errorText }));

const target = process.argv[2] || "https://brandivibe.com/";
console.log(`--- loading ${target} ---`);
await page.goto(target, { waitUntil: "networkidle", timeout: 30000 }).catch(e => console.log("goto error:", e.message));
await page.waitForTimeout(4000);

console.log("\nPage title:", await page.title());
const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500));
console.log("\nBody text (first 500 chars):\n", bodyText);

console.log("\nPage errors:", errors.length);
errors.forEach((e, i) => console.log(`  [${i}] ${e.message}\n      ${(e.stack || "").slice(0, 300)}`));

console.log("\nConsole errors/warnings:", consoleMessages.length);
consoleMessages.slice(0, 15).forEach((m, i) => console.log(`  [${i}] ${m.type}: ${m.text}`));

await browser.close();
