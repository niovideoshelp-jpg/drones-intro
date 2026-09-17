// Normalises Magnific SFX into public/audio/sfx/*.wav and measures the audible hit of each file.
// hit = time (s) of the loudest 30 ms window after trimming leading silence. Writes src/data/sfx-meta.json.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const RAW = "public/audio/raw";
const OUT = "public/audio/sfx";
fs.mkdirSync(OUT, { recursive: true });
const meta = {};
const pcm = (file) => execFileSync("ffmpeg", ["-v", "error", "-i", file, "-ac", "1", "-ar", "48000", "-f", "s16le", "-"], { maxBuffer: 1 << 30 });
for (const f of fs.readdirSync(RAW).filter((x) => x.endsWith(".mp3") && x !== "music.mp3")) {
  const name = path.basename(f, ".mp3");
  const buf = pcm(path.join(RAW, f));
  const n = buf.length / 2;
  const hop = 1440; // 30 ms
  const env = [];
  for (let i = 0; i + hop <= n; i += hop) {
    let s = 0;
    for (let k = 0; k < hop; k++) {
      const v = buf.readInt16LE((i + k) * 2) / 32768;
      s += v * v;
    }
    env.push(10 * Math.log10(s / hop + 1e-12));
  }
  const max = Math.max(...env);
  const startIdx = Math.max(0, env.findIndex((d) => d > max - 40) - 1);
  const lead = (startIdx * hop) / 48000;
  const peakIdx = env.indexOf(max);
  const hit = (peakIdx * hop) / 48000 - lead;
  const gain = -18 - max; // loudest 30 ms window -> -18 dBFS RMS
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", lead.toFixed(3), "-i", path.join(RAW, f), "-af", `volume=${gain.toFixed(2)}dB,afade=t=out:st=${Math.max(0, n / 48000 - lead - 0.25).toFixed(3)}:d=0.25`, "-ar", "48000", "-ac", "2", path.join(OUT, `${name}.wav`)]);
  meta[name] = { dur: +(n / 48000 - lead).toFixed(3), hit: +hit.toFixed(3), gainDb: +gain.toFixed(1) };
  console.log(name.padEnd(10), "dur", meta[name].dur, "hit", meta[name].hit, "gain", meta[name].gainDb);
}
fs.writeFileSync("src/data/sfx-meta.json", JSON.stringify(meta, null, 2));
