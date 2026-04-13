import { chromium } from "playwright";
import path from "path";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
await page.waitForTimeout(6000); // let React hydrate + fonts load

// measure actual heights via getBoundingClientRect (more reliable than scrollHeight with Lenis)
const info = await page.evaluate(() => {
  const services = document.getElementById("services");
  const process = document.getElementById("process");
  const sRect = services?.getBoundingClientRect();
  const pRect = process?.getBoundingClientRect();
  return {
    docHeight: document.documentElement.scrollHeight,
    bodyHeight: document.body.scrollHeight,
    servicesTop: sRect ? sRect.top + window.scrollY : null,
    servicesHeight: sRect?.height ?? null,
    processTop: pRect ? pRect.top + window.scrollY : null,
    processHeight: pRect?.height ?? null,
  };
});
console.log(JSON.stringify(info, null, 2));

const capturePoints = [];
if (info.servicesTop !== null && info.servicesHeight) {
  const sTop = info.servicesTop;
  const sH = info.servicesHeight;
  // capture 4 points inside services (one per panel), offset so each panel is ~centered
  for (let i = 0; i < 4; i++) {
    capturePoints.push({
      name: `services-0${i + 1}`,
      y: Math.round(sTop + (sH * (i + 0.5)) / 4),
    });
  }
}
if (info.processTop !== null && info.processHeight) {
  const pTop = info.processTop;
  const pH = info.processHeight;
  capturePoints.push({ name: "process-01", y: Math.round(pTop + pH * 0.1) });
  capturePoints.push({ name: "process-02", y: Math.round(pTop + pH * 0.4) });
  capturePoints.push({ name: "process-03", y: Math.round(pTop + pH * 0.7) });
  capturePoints.push({ name: "process-04", y: Math.round(pTop + pH * 0.95) });
}

for (const c of capturePoints) {
  await page.evaluate((y) => {
    // direct scroll (Lenis may intercept, but instant should win)
    window.scrollTo(0, y);
    document.documentElement.scrollTop = y;
  }, c.y);
  await page.waitForTimeout(1600);
  await page.screenshot({
    path: path.resolve(`public/work/_mj-${c.name}.jpg`),
    type: "jpeg",
    quality: 88,
  });
  console.log(`saved ${c.name} at y=${c.y}`);
}

await browser.close();
