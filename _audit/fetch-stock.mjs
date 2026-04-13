// Fetches free stock videos from Pexels API and saves them into each site's public folder.
// Attribution (required by Pexels): photographer + "Video by ... on Pexels" credit is logged per file.

import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

const ENV_PATH = "C:/Users/Mj/.env";
async function loadKey() {
  const env = await readFile(ENV_PATH, "utf8");
  const m = env.match(/PEXELS_API_KEY=([^\s\r\n]+)/);
  if (!m) throw new Error("PEXELS_API_KEY not found in " + ENV_PATH);
  return m[1];
}

async function searchVideo(key, query, { orientation = "landscape", minDuration = 6 } = {}) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15&orientation=${orientation}`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const data = await res.json();
  const candidates = data.videos.filter(v => v.duration >= minDuration && v.width >= 1280);
  if (!candidates.length) throw new Error("No suitable video for: " + query);
  return candidates[0];
}

function pickHdFile(video) {
  // prefer 1280x720 (good balance of quality and file size)
  const files = video.video_files.filter(f => f.file_type === "video/mp4");
  const hd720 = files.find(f => f.width === 1280 && f.height === 720);
  if (hd720) return hd720;
  const hd = files.find(f => f.quality === "hd" && f.width <= 1920);
  return hd || files[0];
}

async function download(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  return buf.length;
}

const targets = [
  {
    query: "abstract gold particles slow motion",
    outDir: "C:/Users/Mj/mj-portfolio/helix/public/stock",
    filename: "cta-bg.mp4",
    site: "helix",
  },
  {
    query: "blue abstract digital network lines",
    outDir: "C:/Users/Mj/mj-portfolio/neuron/public/stock",
    filename: "cta-bg.mp4",
    site: "neuron",
  },
];

async function main() {
  const key = await loadKey();
  const credits = [];

  for (const t of targets) {
    console.log(`\n[${t.site}] Searching: "${t.query}"`);
    const video = await searchVideo(key, t.query);
    const file = pickHdFile(video);
    const out = path.join(t.outDir, t.filename);
    console.log(`  → picked video id=${video.id} by ${video.user.name} @ ${file.width}x${file.height}`);
    console.log(`  → downloading (~${(file.size / 1024 / 1024).toFixed(1)} MB)...`);
    const size = await download(file.link, out);
    console.log(`  → saved ${out} (${(size / 1024 / 1024).toFixed(1)} MB)`);

    credits.push({
      site: t.site,
      filename: t.filename,
      videoId: video.id,
      photographer: video.user.name,
      photographerUrl: video.user.url,
      pageUrl: video.url,
      resolution: `${file.width}x${file.height}`,
      duration: video.duration,
    });
  }

  // write attribution file
  const attr = [
    "# Pexels Stock Video Attribution",
    "",
    "The following videos are from Pexels (free to use, attribution appreciated).",
    "https://www.pexels.com/license/",
    "",
    ...credits.map(c => [
      `## ${c.site}/${c.filename}`,
      `- Video by **${c.photographer}** on Pexels`,
      `- Photographer: ${c.photographerUrl}`,
      `- Source: ${c.pageUrl}`,
      `- Resolution: ${c.resolution}`,
      `- Duration: ${c.duration}s`,
      "",
    ].join("\n")),
  ].join("\n");
  await writeFile("C:/Users/Mj/mj-portfolio/_audit/stock-credits.md", attr, "utf8");
  console.log("\nAll videos downloaded. Credits saved to _audit/stock-credits.md");
}

main().catch(e => { console.error(e); process.exit(1); });
