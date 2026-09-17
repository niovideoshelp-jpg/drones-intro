// Renders review stills: node scripts/stills.mjs 12.8 20.5 ...  (seconds) -> out/stills/t012.80.png + out/stills/sheet.png
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const times = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
const scale = Number(process.env.SCALE ?? 0.5);
const id = process.env.COMP ?? "DronesIntro-preview";
const outDir = path.resolve("out/stills");
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
const composition = await selectComposition({ serveUrl, id, inputProps: {} });
const files = [];
for (const s of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
  const output = path.join(outDir, `t${s.toFixed(2).padStart(6, "0")}.png`);
  const t0 = Date.now();
  await renderStill({ serveUrl, composition, frame, output, scale, inputProps: {}, imageFormat: "png" });
  console.log(`${s}s frame ${frame} (${Date.now() - t0} ms)`);
  files.push(output);
}
if (files.length > 1) {
  execFileSync("node", ["scripts/sheet.mjs", ...files], { stdio: "inherit" });
}
