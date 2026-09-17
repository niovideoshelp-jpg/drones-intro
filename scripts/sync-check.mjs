// Verifies that every SFX cue's loudest moment in sfx.wav lands on its scheduled time (isolated cues only).
import fs from "node:fs";
import { envelope } from "./envelope.mjs";
const cues = JSON.parse(fs.readFileSync("src/data/sfx-cues.json", "utf8"));
const env = envelope("public/audio/sfx.wav", 0.01);
let worst = 0, n = 0;
const rows = [];
for (const c of cues) {
  if (cues.some((o) => o !== c && Math.abs(o.time - c.time) < 0.6)) continue; // overlapping cues are ambiguous
  const win = env.filter((p) => p.t > c.time - 0.35 && p.t < c.time + 0.35);
  const pk = win.reduce((b, x) => (x.db > b.db ? x : b));
  const d = pk.t - c.time;
  worst = Math.max(worst, Math.abs(d));
  n++;
  if (Math.abs(d) > 0.07) rows.push(`${c.name} @${c.time} peak ${pk.t.toFixed(2)} (${d.toFixed(2)})`);
}
console.log(`checked ${n} isolated cues, worst offset ${worst.toFixed(2)} s`);
console.log(rows.join("\n"));
