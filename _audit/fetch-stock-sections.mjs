import { writeFile, mkdir, readFile, appendFile } from "fs/promises";
import path from "path";

const key = (await readFile("C:/Users/Mj/.env", "utf8")).match(/PEXELS_API_KEY=([^\s\r\n]+)/)[1];

async function search(query, { minDuration = 6, orientation = "landscape" } = {}) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=20&orientation=${orientation}&size=medium`;
  const res = await fetch(url, { headers: { Authorization: key } });
  const data = await res.json();
  return data.videos.filter(v => v.duration >= minDuration && v.width >= 1280);
}

function pickHd(video) {
  const files = video.video_files.filter(f => f.file_type === "video/mp4");
  return files.find(f => f.width === 1280 && f.height === 720) || files.find(f => f.quality === "hd") || files[0];
}

async function download(url, outPath) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  return buf.length;
}

const targets = [
  {
    query: "dark smoke abstract slow motion minimal",
    out: "C:/Users/Mj/mj-portfolio/mjstudio/public/stock/manifesto-bg.mp4",
    section: "manifesto",
  },
  {
    query: "abstract particles floating dark cinematic",
    out: "C:/Users/Mj/mj-portfolio/mjstudio/public/stock/services-bg.mp4",
    section: "services",
  },
  {
    query: "abstract flowing lines geometric dark",
    out: "C:/Users/Mj/mj-portfolio/mjstudio/public/stock/process-bg.mp4",
    section: "process",
  },
];

let credits = "";
for (const t of targets) {
  console.log(`\n[${t.section}] "${t.query}"`);
  const results = await search(t.query);
  if (!results.length) {
    console.log("  ! no results, skipping");
    continue;
  }
  const video = results[0];
  const file = pickHd(video);
  console.log(`  → id=${video.id} by ${video.user.name} (${file.width}x${file.height}, ${(file.size/1024/1024).toFixed(1)} MB)`);
  const size = await download(file.link, t.out);
  console.log(`  → saved (${(size/1024/1024).toFixed(1)} MB)`);
  credits += `\n## mjstudio/${path.basename(t.out)}\n- By **${video.user.name}** on Pexels\n- Source: ${video.url}\n`;
}

await appendFile("C:/Users/Mj/mj-portfolio/_audit/stock-credits.md", credits);
console.log("\ndone.");
