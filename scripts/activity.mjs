// Scans a review render (grey background) for empty or motionless stretches.
import { execFileSync } from "node:child_process";
const file = process.argv[2];
const W = 160, H = 90, FPS = 6;
const buf = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-vf", `fps=${FPS},scale=${W}:${H}`, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], { maxBuffer: 1 << 30 });
const n = buf.length / (W * H * 3);
const bg = [0x3b, 0x44, 0x47];
let prev = null;
const rows = [];
for (let f = 0; f < n; f++) {
  const off = f * W * H * 3;
  let cover = 0, motion = 0;
  for (let p = 0; p < W * H; p++) {
    const i = off + p * 3;
    const d = Math.abs(buf[i] - bg[0]) + Math.abs(buf[i + 1] - bg[1]) + Math.abs(buf[i + 2] - bg[2]);
    if (d > 30) cover++;
    if (prev) motion += Math.abs(buf[i] - buf[prev + p * 3]) + Math.abs(buf[i + 1] - buf[prev + p * 3 + 1]);
  }
  rows.push({ t: f / FPS, cover: cover / (W * H), motion: prev ? motion / (W * H * 2) : 0 });
  prev = off;
}
// report seconds with low coverage or low motion (1 s windows)
const bad = [];
for (let s = 0; s < n / FPS; s++) {
  const w = rows.filter((r) => r.t >= s && r.t < s + 1);
  const cov = Math.max(...w.map((r) => r.cover));
  const mot = w.reduce((a, r) => a + r.motion, 0) / w.length;
  if (cov < 0.04 || mot < 0.6) bad.push(`${s}s cover ${(cov * 100).toFixed(1)}% motion ${mot.toFixed(2)}`);
}
console.log(bad.length ? bad.join("\n") : "no empty or static seconds");
