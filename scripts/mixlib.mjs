// Shared soundtrack engine: word lookups + SFX/voice/music/mix stems for one narrated part.
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$]/g, "");

export const makeAt = (wordsFile) => {
  const words = JSON.parse(fs.readFileSync(wordsFile, "utf8"));
  return (word, after = 0, n = 1) => {
    let c = 0;
    for (const w of words) if (w.s >= after && norm(w.w) === norm(word) && ++c === n) return w.s;
    throw new Error(`word ${word} after ${after}`);
  };
};

export const makeCues = () => {
  const cues = [];
  const q = (name, time, gain = -8) => cues.push({ name, time: +time.toFixed(3), gain });
  return { cues, q };
};

/**
 * @param {{dur:number, cues:any[], voiceIn:string, musicIn:string, prefix:string, cuesOut:string, sfxBusDb?:number, musicDb?:number}} o
 * Writes public/audio/<prefix>{voice,music,sfx,mix}.wav
 */
export const renderSoundtrack = (o) => {
  const { dur, cues, voiceIn, musicIn, prefix, cuesOut } = o;
  const sfxBus = o.sfxBusDb ?? -11;
  const musicDb = o.musicDb ?? -4;
  const meta = JSON.parse(fs.readFileSync("src/data/sfx-meta.json", "utf8"));
  fs.mkdirSync("out", { recursive: true });
  cues.sort((a, b) => a.time - b.time);
  for (const c of cues) {
    if (!meta[c.name]) throw new Error(`missing sfx ${c.name}`);
    c.start = +(c.time - meta[c.name].hit).toFixed(3);
  }
  fs.writeFileSync(cuesOut, JSON.stringify(cues));
  console.log("cues", cues.length);
  const A = (f) => `public/audio/${prefix}${f}.wav`;

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
  graph += `;${labels.join("")}amix=inputs=${labels.length}:normalize=0:dropout_transition=0,volume=${sfxBus}dB,apad=whole_dur=${dur},atrim=0:${dur}[out]`;
  const graphFile = `out/${prefix}sfx-graph.txt`;
  fs.writeFileSync(graphFile, graph);
  execFileSync("ffmpeg", [...args, "-filter_complex_script", graphFile, "-map", "[out]", "-ar", "48000", "-ac", "2", A("sfx")], { stdio: "inherit" });

  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", voiceIn, "-af", `aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=11,apad=whole_dur=${dur},atrim=0:${dur}`, "-ar", "48000", "-ac", "2", A("voice")], { stdio: "inherit" });

  execFileSync(
    "ffmpeg",
    [
      "-v", "error", "-y",
      "-i", musicIn,
      "-i", A("voice"),
      "-filter_complex",
      `[0]aresample=48000,aformat=channel_layouts=stereo,acompressor=threshold=-24dB:ratio=3:attack=40:release=400,volume=${musicDb}dB,afade=t=in:d=1.5,afade=t=out:st=${dur - 1.6}:d=1.6,apad=whole_dur=${dur},atrim=0:${dur}[m];` +
        `[1]aformat=channel_layouts=stereo,lowpass=f=4000,volume=6dB[key];` +
        `[m][key]sidechaincompress=threshold=0.1:ratio=2.5:attack=80:release=900:makeup=1[out]`,
      "-map", "[out]", "-ar", "48000", A("music"),
    ],
    { stdio: "inherit" },
  );

  execFileSync(
    "ffmpeg",
    ["-v", "error", "-y", "-i", A("voice"), "-i", A("music"), "-i", A("sfx"), "-filter_complex", "[0][1][2]amix=inputs=3:normalize=0,alimiter=limit=0.89:level=false[out]", "-map", "[out]", "-ar", "48000", A("mix")],
    { stdio: "inherit" },
  );
  console.log("done", prefix || "intro");
};
