// Finds stretches of a part where no scene window is open — i.e. an empty screen.
// Usage: node scripts/gaps.mjs <words.json> <dur> <dir> [Scene ...]
import fs from "node:fs";
import path from "node:path";

const [wordsFile, durArg, dir] = process.argv.slice(2);
const dur = Number(durArg);
const words = JSON.parse(fs.readFileSync(wordsFile, "utf8"));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, "");
const at = (x, a = 0) => {
  for (const q of words) if (q.s >= a && norm(q.w) === norm(x)) return q.s;
  return NaN;
};
const files = process.argv.slice(5).length ? process.argv.slice(5).map((f) => `${f}.tsx`) : fs.readdirSync(dir).filter((f) => f.endsWith(".tsx"));
const wins = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  const T = {};
  const tm = src.match(/const T = \{[\s\S]*?\n\};/);
  if (tm) for (const m of tm[0].matchAll(/(\w+):\s*at\("([^"]+)"(?:,\s*([\d.]+))?\)/g)) T[m[1]] = at(m[2], m[3] ? +m[3] : 0);
  const ev = (e) => {
    try {
      return Function("T", "DUR", "return " + e.replace(/[A-Z0-9_]*DURATION_S/g, "DUR"))(T, dur);
    } catch {
      return NaN;
    }
  };
  for (const m of src.matchAll(/win\(t,\s*([^,]+),\s*([^,]+),\s*([\d.]+),\s*([\d.]+)\)/g)) {
    const a = ev(m[1].trim());
    const b = ev(m[2].trim());
    if (!Number.isNaN(a) && !Number.isNaN(b) && b > a) wins.push([a, b, f]);
  }
}
wins.sort((x, y) => x[0] - y[0]);
let cursor = 0;
const gaps = [];
for (const [a, b] of wins) {
  if (a > cursor + 0.15) gaps.push([cursor, a]);
  cursor = Math.max(cursor, b);
}
if (cursor < dur - 0.15) gaps.push([cursor, dur]);
console.log(`${wins.length} windows in ${dir}`);
console.log(gaps.length ? gaps.map((g) => `  empty ${g[0].toFixed(2)} → ${g[1].toFixed(2)}`).join("\n") : "  no uncovered stretch");
