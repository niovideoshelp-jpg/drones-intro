// node scripts/sheet.mjs out/stills/a.png out/stills/b.png ... -> out/stills/sheet.png
import { execFileSync } from "node:child_process";
const files = process.argv.slice(2);
const cols = Math.min(3, files.length), w = 480, h = 270;
const inputs = files.flatMap((f) => ["-i", f]);
const lab = (f) => f.match(/t(\d+\.\d+)/)?.[1] ?? "";
const pads = files.map((f, i) => `[${i}]scale=${w}:${h}[v${i}]`).join(";");
const layout = files.map((_, i) => `${(i % cols) * w}_${Math.floor(i / cols) * h}`).join("|");
execFileSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", `${pads};${files.map((_, i) => `[v${i}]`).join("")}xstack=inputs=${files.length}:layout=${layout}:fill=black`, "out/stills/sheet.png"]);
console.log("out/stills/sheet.png");
