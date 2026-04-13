// Fetch one themed atmospheric video per demo from the Pexels API.
// Requires PEXELS_API_KEY in C:/Users/Mj/.env.

import { writeFile, mkdir, readFile, appendFile } from "fs/promises";
import path from "path";

const key = (await readFile("C:/Users/Mj/.env", "utf8")).match(/PEXELS_API_KEY=([^\s\r\n]+)/)[1];

async function search(query, { minDuration = 6, orientation = "landscape" } = {}) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=20&orientation=${orientation}&size=medium`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Search ${query} -> ${res.status}`);
  const data = await res.json();
  return data.videos.filter((v) => v.duration >= minDuration && v.width >= 1280);
}

function pickHd(video) {
  const files = video.video_files.filter((f) => f.file_type === "video/mp4");
  return (
    files.find((f) => f.width === 1280 && f.height === 720) ||
    files.find((f) => f.quality === "hd") ||
    files[0]
  );
}

async function download(url, outPath) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  return buf.length;
}

// One video per demo. Each one is atmospheric and matches the demo's aesthetic.
// They're placed into mjstudio/public/{demo}/stock/section-bg.mp4 so each demo
// keeps its assets colocated (matching the helix/neuron pattern already used).
const targets = [
  { demo: "helix", query: "abstract gold liquid slow motion luxury" },
  { demo: "neuron", query: "abstract blue dots digital network slow" },
  { demo: "axiom", query: "abstract dark slate navy minimal slow" },
  { demo: "pulse", query: "soft water ripples calm slow motion" },
  { demo: "aurora", query: "golden dust slow motion abstract particles" },
  { demo: "orbit", query: "abstract green digital speed lines dark" },
  { demo: "monolith", query: "concrete texture shadow light architecture" },
  { demo: "atrium", query: "dark gold particles slow abstract elegant" },
];

let credits = "\n\n# Section video attributions (Pexels)\n";
for (const t of targets) {
  console.log(`\n[${t.demo}] "${t.query}"`);
  const results = await search(t.query);
  if (!results.length) {
    console.log("  ! no results, skipping");
    continue;
  }
  const video = results[0];
  const file = pickHd(video);
  const out = `C:/Users/Mj/mj-portfolio/mjstudio/public/${t.demo}/stock/section-bg.mp4`;
  console.log(`  → id=${video.id} by ${video.user.name} (${file.width}x${file.height}, ${(file.size / 1024 / 1024).toFixed(1)} MB)`);
  const size = await download(file.link, out);
  console.log(`  → saved (${(size / 1024 / 1024).toFixed(1)} MB)`);
  credits += `\n## ${t.demo}/stock/section-bg.mp4\n- Video by **${video.user.name}** on Pexels\n- Source: ${video.url}\n`;
}

await appendFile("C:/Users/Mj/mj-portfolio/_audit/stock-credits.md", credits);
console.log("\nall 8 videos fetched + credits appended");
