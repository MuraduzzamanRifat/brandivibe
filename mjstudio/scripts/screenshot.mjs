import { chromium } from "playwright";
import { mkdir, readdir, rename, rm } from "fs/promises";
import path from "path";

const targets = [
  { url: "http://localhost:3001/", slug: "helix", recordMs: 6500, preWait: 4000 },
  { url: "http://localhost:3002/", slug: "neuron", recordMs: 6500, preWait: 4000 },
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

  console.log(`→ ${t.url}`);
  try {
    await page.goto(t.url, { waitUntil: "networkidle", timeout: 20000 });
  } catch {
    await page.goto(t.url, { waitUntil: "load", timeout: 20000 });
  }

  // wait for 3D scene to fully initialize
  await page.waitForTimeout(t.preWait);

  // capture still image while animation is mid-motion
  const stillPath = path.resolve(`public/work/${t.slug}.jpg`);
  await page.screenshot({
    path: stillPath,
    type: "jpeg",
    quality: 92,
    fullPage: false,
  });
  console.log(`  saved still → ${stillPath}`);

  // keep recording for N ms for smooth loop capture
  await page.waitForTimeout(t.recordMs);

  await ctx.close(); // playwright flushes video here

  // find the written video file and rename
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
    await captureVideoAndStill(browser, t);
  }

  await browser.close();

  // cleanup tmp dir
  await rm(path.resolve("public/work/_tmp"), { recursive: true, force: true }).catch(() => {});
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
