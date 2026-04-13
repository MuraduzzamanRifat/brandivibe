import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";

const key = (await readFile("C:/Users/Mj/.env", "utf8")).match(/PEXELS_API_KEY=([^\s\r\n]+)/)[1];

async function searchVideo(query, { minDuration = 8 } = {}) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=20&orientation=landscape&size=medium`;
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

const query = "dark minimal abstract slow motion texture";
console.log(`Searching: "${query}"`);
const results = await searchVideo(query);
console.log(`Found ${results.length} candidates`);
const video = results[0];
const file = pickHd(video);
console.log(`Picked id=${video.id} by ${video.user.name} (${file.width}x${file.height}, ${(file.size/1024/1024).toFixed(1)} MB)`);

const out = "C:/Users/Mj/mj-portfolio/mjstudio/public/stock/studio-bg.mp4";
const size = await download(file.link, out);
console.log(`Saved ${out} (${(size/1024/1024).toFixed(1)} MB)`);

// append credit
const creditsPath = "C:/Users/Mj/mj-portfolio/_audit/stock-credits.md";
const existing = await readFile(creditsPath, "utf8").catch(() => "");
await writeFile(creditsPath, existing + `\n## mjstudio/studio-bg.mp4\n- Video by **${video.user.name}** on Pexels\n- Source: ${video.url}\n- Resolution: ${file.width}x${file.height}\n- Duration: ${video.duration}s\n`);
