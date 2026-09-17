// Prints / returns an RMS envelope (dBFS, 20 ms hops) of an audio file using ffmpeg raw PCM.
import { execFileSync } from "node:child_process";
export const envelope = (file, hop = 0.02, from = 0, to = null) => {
  const args = ["-v", "error", "-ss", String(from), ...(to ? ["-to", String(to)] : []), "-i", file, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"];
  const buf = execFileSync("ffmpeg", args, { maxBuffer: 1 << 30 });
  const n = Math.round(16000 * hop), out = [];
  for (let i = 0; i + n <= buf.length / 2; i += n) {
    let s = 0;
    for (let k = 0; k < n; k++) { const v = buf.readInt16LE((i + k) * 2) / 32768; s += v * v; }
    out.push({ t: from + (i / 16000), db: 10 * Math.log10(s / n + 1e-12) });
  }
  return out;
};
if (process.argv[1]?.endsWith("envelope.mjs")) {
  const [file, a, b] = process.argv.slice(2);
  console.log(envelope(file, 0.05, +a, +b).map((p) => `${p.t.toFixed(2)}:${Math.round(p.db)}`).join(" "));
}
