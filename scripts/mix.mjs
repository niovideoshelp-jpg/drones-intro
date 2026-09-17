// Builds the soundtrack from the same word timings that drive the picture.
// Outputs public/audio/{voice,music,sfx,mix}.wav (48 kHz stereo, 177.4 s) and src/data/sfx-cues.json.
// Each SFX is scheduled so that its measured loudest moment ("hit") lands on the visual event.
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const DUR = 177.4;
const words = JSON.parse(fs.readFileSync("src/data/words.json", "utf8"));
const meta = JSON.parse(fs.readFileSync("src/data/sfx-meta.json", "utf8"));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, "");
const at = (word, after = 0, n = 1) => {
  let c = 0;
  for (const w of words) if (w.s >= after && norm(w.w) === norm(word) && ++c === n) return w.s;
  throw new Error(`word ${word} after ${after}`);
};

/** [sound, hit time (s), gain dB] */
const cues = [];
const q = (name, time, gain = -8) => cues.push({ name, time: +time.toFixed(3), gain });

/* ---------- intro ---------- */
q("whoosh_a", 0.45, -4);
q("prop", 1.3, -8);
const recon = at("reconnaissance"), playing = at("playing");
q("scan", recon + 0.25, -5);
[560, 800, 1130, 1370].forEach((x) => q("lock", recon + ((x - 470) / 980) * (playing - recon), -10));
q("clank", at("bigger"), -6);
q("pop_a", at("bigger") + 0.05, -9);
q("pop_b", at("bigger", 6), -9);
q("whoosh_a", at("bigger", 6) + 0.3, -7);
q("pop_a", at("major"), -9);
q("whoosh_b", at("major") + 0.35, -9);
q("pop_b", at("military"), -10);
q("whoosh_a", at("One") - 0.2, -5);

/* ---------- Caucasus map ---------- */
q("zoom", 10.6, -3);
const nk = at("Nagorno-Karabakh");
q("ping", nk, -6);
q("typing", nk + 0.35, -12);
q("impact", at("2020") + 0.05, -4);
q("pop_a", at("Armenia"), -9);
q("pop_b", at("Azerbaijan."), -9);
q("zoom", at("During") + 1.5, -4);
q("prop", at("reconnaissance", 20) + 0.5, -9);
q("whoosh_b", at("strike") + 0.35, -9);
const armenian = at("Armenian");
[0, 0.25, 0.5].forEach((d, i) => q(i % 2 ? "pop_b" : "pop_a", armenian + d + 0.15, -12));
q("lock", at("tanks,") + 0.05, -6);
q("lock", at("artillery") + 0.05, -6);
q("lock", at("air") + 0.05, -6);

/* ---------- footage ---------- */
const footage = at("Footage");
q("whoosh_b", footage - 0.15, -7);
q("click", footage, -12);
q("lock", at("spotted"), -4);
q("boom_a", at("destroyed"), 0);
const went = at("went");
q("whoosh_a", went + 0.25, -6);
for (let i = 0; i < 8; i++) q(i % 2 ? "pop_b" : "pop_a", went + i * 0.09 + 0.35, -15);
q("ping", at("world,"), -8);
q("whoosh_b", at("helped") + 0.05, -9);
q("fpv", at("small"), -11);
q("scan", at("completely") + 0.2, -6);
q("typing", at("completely") + 0.9, -13);

/* ---------- Russia / Ukraine ---------- */
q("zoom", 41.5, -3);
q("pop_a", at("Russia"), -9);
q("pop_b", at("Ukraine", 40), -9);
q("swarm", at("scale", 40), -8);
q("fpv", at("drones", 46) + 0.8, -13);
q("prop", at("mission") + 0.2, -13);

/* ---------- missions ---------- */
const lensT = [at("reconnaissance,", 50), at("correcting"), at("strikes"), at("dropping"), at("electronic"), at("long-range")];
lensT.forEach((t, i) => q(i % 2 ? "pop_b" : "pop_a", t, -7));
q("scan", lensT[0] + 0.4, -13);
const art = at("artillery", 53), fire = at("fire,"), strikes = at("strikes");
q("boom_b", lensT[1] + 0.1, -13);
q("boom_b", art + 0.12, -15);
q("click", art + 0.3, -11);
q("boom_b", fire, -12);
q("boom_a", strikes - 0.05, -9);
q("fpv", at("vehicles,", 55) - 0.25, -9);
q("boom_a", at("vehicles,", 55), -6);
const expl = at("explosives,");
q("whoosh_b", expl + 0.25, -13);
q("boom_b", expl + 0.55, -6);
q("jam", at("electronic") + 0.25, -6);
q("whoosh_b", at("warfare,") + 0.9, -13);
q("boom_b", at("warfare,") + 1.35, -15);
q("prop", at("long-range") + 0.7, -13);
q("boom_a", at("infrastructure") + 0.3, -8);
q("boom_a", at("installations.") + 0.1, -8);
q("whoosh_a", at("fast") - 0.1, -4);

/* ---------- lessons ---------- */
q("paper", at("lessons") + 0.1, -8);
q("zoom", 68.0, -4);
const studied = at("studied");
[2, 7, 12].forEach((i) => q("ping", studied + (i / 18) * 1.6 + 1.2, -13));

/* ---------- Iran / Israel ---------- */
q("zoom", 73.2, -5);
q("pop_a", at("Iran"), -9);
q("swarm", at("launching") + 1.3, -6);
q("prop", at("attack") + 0.3, -11);
q("pop_b", at("Israel."), -9);
q("boom_b", at("Israel.") + 0.2, -13);
q("boom_b", at("Israel.") + 0.9, -15);

/* ---------- Shahed ---------- */
const among = at("Among");
q("whoosh_a", among + 0.1, -4);
q("scan", at("models") + 0.25, -6);
q("scan", at("aircraft", 79) + 0.35, -9);
q("impact", at("Shahed"), -6);
q("whoosh_b", at("family,") + 0.1, -11);
q("whoosh_a", at("became") + 0.25, -6);
q("pop_a", at("Russia's"), -9);
q("prop", at("Russia's") + 0.2, -11);
q("prop", at("Ukraine.", 85) - 0.3, -11);
q("pop_b", at("Ukraine.", 85), -9);

/* ---------- radar ---------- */
const exactly = at("exactly");
q("whoosh_a", exactly + 0.4, -6);
q("scan", exactly + 1.0, -9);
q("riser", at("problem"), -6);
const shows = at("shows");
q("ping", shows, -2);
// soft pings each time the sweep crosses the blip (sweep = 120 deg/s)
{
  const importantly = at("importantly,");
  let last = -1;
  for (let t = shows + 0.3; t < importantly + 0.3; t += 1 / 120) {
    const bp = Math.min(1, Math.max(0, (t - shows) / (importantly + 0.6 - shows)));
    const bx = 0.62 - 0.32 * bp, by = -0.5 + 0.24 * bp;
    const bAng = ((Math.atan2(bx, -by) * 180) / Math.PI + 360) % 360;
    const sweep = (t * 120) % 360;
    const d = ((sweep - bAng + 360) % 360);
    if (d < 1.2 && t - last > 1) {
      q("ping", t, -15);
      last = t;
    }
  }
}
q("whoosh_b", at("other") + 0.6, -8);
q("typing", at("commander"), -12);
q("pop_a", at("doesn't") + 0.15, -10);
q("pop_b", at("necessarily") + 0.25, -10);
q("pop_a", at("know") + 0.05, -10);
q("lock", at("incoming") + 0.05, -6);
q("counter", at("cost.") + 0.05, -8);

/* ---------- targets ---------- */
const imp = at("importantly,");
q("whoosh_a", imp + 0.3, -6);
q("prop", imp + 1.0, -13);
q("scan", at("know", 103) + 0.6, -10);
q("pop_a", at("trying") + 0.05, -9);
q("whoosh_b", at("hit.") + 0.1, -8);
for (const [w, after] of [["empty", 0], ["power", 0], ["ammunition", 0], ["airbase,", 0], ["radar", 112]]) {
  const t = at(w, after);
  q("pop_a", t + 0.05, -6);
  q("ping", t + 0.05, -14);
}
q("shield", at("protecting"), -4);
q("whoosh_a", at("He", 115.8) + 0.2, -8);

/* ---------- decision ---------- */
q("pop_b", at("He", 115.8) + 0.25, -7);
const minutes = at("minutes");
q("tick", minutes + 0.33, -8);
q("tick", minutes + 4.33, -12);
q("tick", minutes + 8.33, -18);
q("tick", minutes + 12.33, -20);
q("alarm", at("only", 119), -4);
q("ping", at("seconds."), -8);
q("whoosh_b", at("He", 120.5) + 0.3, -8);
q("pop_a", at("fire", 121), -9);
q("missile", at("missile") + 0.05, -2);
q("counter", at("costs") + 0.05, -8);
q("counter", at("million") + 0.05, -11);
q("boom_a", at("drone.", 125) + 0.1, -4);
q("whoosh_b", at("wait") + 0.1, -8);
q("clank", at("wait") + 0.45, -10);
q("pop_a", at("cheaper") + 0.1, -8);
q("pop_b", at("cheaper") + 0.4, -10);
q("pop_a", at("take"), -9);
q("alarm", at("risk") + 0.1, -9);
q("prop", at("through.", 132) + 0.1, -8);
q("boom_a", at("through.", 132) + 0.6, -4);

/* ---------- the math ---------- */
const looking = at("Looking");
q("whoosh_a", looking + 0.3, -8);
q("pop_b", looking + 0.2, -9);
q("clank", at("numbers", 133) + 0.25, -6);
q("clank", at("numbers", 133) + 0.55, -11);
q("impact", at("absurd,"), -6);
{
  const dz = at("dozens"), ds = at("destroy");
  for (let i = 4; i <= 32; i += 4) q(i % 8 ? "pop_a" : "pop_b", dz + (i / 32) * (ds - dz) + 0.1, -16);
}
q("pop_b", at("cheap") + 0.05, -8);
q("impact", at("not", 143.5), -4);
q("whoosh_b", at("not", 143.5) + 0.45, -8);
q("whoosh_a", at("math") + 0.9, -8);
q("whoosh_b", at("commander", 147) + 0.25, -8);
q("pop_a", at("commander", 147) + 0.35, -9);
q("pop_b", at("price", 149), -10);
q("typing", at("drone", 149.5) - 0.1, -12);
q("pop_a", at("price", 150.4), -10);
q("whoosh_b", at("he's") + 0.45, -8);
q("whoosh_b", at("intercept", 153) + 0.7, -8);
q("impact", at("damage"), -6);
q("prop", at("drone", 155) + 1.0, -10);
q("boom_a", at("through.", 157) - 0.05, -2);
q("whoosh_a", at("right", 158.3) + 0.6, -8);
q("scan", at("space") + 0.1, -10);
q("ping", at("two", 161.3) + 0.05, -10);
q("swarm", at("biggest") + 0.6, -6);
q("riser", at("taking"), -8);
q("swarm", at("taking"), -8);
q("impact", at("taking") + 0.02, -2);

/* ---------- sources ---------- */
q("whoosh_a", at("worth") + 0.3, -6);
q("paper", at("worth") + 0.6, -6);
q("whoosh_b", at("listed") + 0.1, -8);
[0, 0.2, 0.4].forEach((d) => q("click", at("description.") + d + 0.15, -10));
q("clank", at("links") + 0.2, -8);
q("whoosh_b", at("look") + 0.05, -10);
q("scan", at("data") + 0.2, -10);
[0, 0.25, 0.5].forEach((d) => q("click", at("check") + d + 0.1, -6));

cues.sort((a, b) => a.time - b.time);
for (const c of cues) {
  if (!meta[c.name]) throw new Error(`missing sfx ${c.name}`);
  c.start = +(c.time - meta[c.name].hit).toFixed(3);
}
fs.writeFileSync("src/data/sfx-cues.json", JSON.stringify(cues));
console.log("cues", cues.length);

const SFX_BUS_DB = Number(process.env.SFX_BUS_DB ?? -11);
const MUSIC_DB = Number(process.env.MUSIC_DB ?? -4);

// ---- SFX stem
{
  const names = [...new Set(cues.map((c) => c.name))];
  const args = ["-v", "error", "-y"];
  names.forEach((n) => args.push("-i", `public/audio/sfx/${n}.wav`));
  const uses = Object.fromEntries(names.map((n) => [n, cues.filter((c) => c.name === n).length]));
  let graph = names.map((n, i) => `[${i}]asplit=${uses[n]}${Array.from({ length: uses[n] }, (_, k) => `[${n}${k}]`).join("")}`).join(";");
  const used = Object.fromEntries(names.map((n) => [n, 0]));
  const labels = [];
  cues.forEach((c, i) => {
    const k = used[c.name]++;
    const trim = c.start < 0 ? `atrim=start=${(-c.start).toFixed(3)},asetpts=PTS-STARTPTS,` : "";
    const delay = Math.max(0, Math.round(c.start * 1000));
    graph += `;[${c.name}${k}]${trim}volume=${c.gain}dB,adelay=${delay}|${delay}[c${i}]`;
    labels.push(`[c${i}]`);
  });
  graph += `;${labels.join("")}amix=inputs=${labels.length}:normalize=0:dropout_transition=0,volume=${SFX_BUS_DB}dB,apad=whole_dur=${DUR},atrim=0:${DUR}[out]`;
  fs.writeFileSync("out/sfx-graph.txt", graph);
  execFileSync("ffmpeg", [...args, "-filter_complex_script", "out/sfx-graph.txt", "-map", "[out]", "-ar", "48000", "-ac", "2", "public/audio/sfx.wav"], { stdio: "inherit" });
}

// ---- voice stem, -16 LUFS
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", "public/audio/intro.mp3", "-af", `aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=11,apad=whole_dur=${DUR},atrim=0:${DUR}`, "-ar", "48000", "-ac", "2", "public/audio/voice.wav"], { stdio: "inherit" });

// ---- music stem: tamed dynamics, ducked under the narration
execFileSync(
  "ffmpeg",
  [
    "-v", "error", "-y",
    "-i", "public/audio/raw/music.mp3",
    "-i", "public/audio/voice.wav",
    "-filter_complex",
    `[0]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=-24dB:ratio=3:attack=40:release=400,volume=${MUSIC_DB}dB,afade=t=in:d=1.5,afade=t=out:st=${DUR - 1.4}:d=1.4,apad=whole_dur=${DUR},atrim=0:${DUR}[m];` +
      `[1]aformat=channel_layouts=stereo,lowpass=f=4000,volume=6dB[key];` +
      `[m][key]sidechaincompress=threshold=0.1:ratio=2.5:attack=80:release=900:makeup=1[out]`,
    "-map", "[out]", "-ar", "48000", "public/audio/music.wav",
  ],
  { stdio: "inherit" },
);

// ---- full mix
execFileSync(
  "ffmpeg",
  ["-v", "error", "-y", "-i", "public/audio/voice.wav", "-i", "public/audio/music.wav", "-i", "public/audio/sfx.wav", "-filter_complex", "[0][1][2]amix=inputs=3:normalize=0,alimiter=limit=0.89:level=false[out]", "-map", "[out]", "-ar", "48000", "public/audio/mix.wav"],
  { stdio: "inherit" },
);
console.log("done");
