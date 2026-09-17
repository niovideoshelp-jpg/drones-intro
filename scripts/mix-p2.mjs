// Part 2 ("Why use such an expensive missile") soundtrack, synced to the same words as src/p2/*.tsx.
import { makeAt, makeCues, renderSoundtrack } from "./mixlib.mjs";

const at = makeAt("src/data/p2-words.json");
const { cues, q } = makeCues();
const DUR = 151.6;

/* ---------- the question ---------- */
q("whoosh_a", at("Why") + 0.2, -6);
q("pop_a", at("expensive") + 0.1, -9);
q("impact", at("missile?") + 0.15, -6);
q("typing", at("first") + 0.1, -12);
q("pop_b", at("answer") + 0.1, -9);

/* ---------- not the drone, what is behind it ---------- */
q("whoosh_b", at("defense") + 0.1, -9);
q("prop", at("isn't") + 0.5, -13);
q("click", at("drone.") + 0.1, -10);
q("shield", at("It's") + 0.2, -7);
q("cash", at("$30,000") + 0.1, -9);
for (const [w, extra] of [["warship,", null], ["battery,", "clank"], ["depot,", null], ["area,", null]]) {
  const t = at(w);
  q("pop_a", t + 0.1, -8);
  if (extra === "clank") q("clank", t + 0.25, -12);
}
q("missile", at("firing") + 0.3, -4);
q("boom_a", at("missile", 18.8) + 0.5, -4);
q("click", at("rational.") + 0.1, -6);

/* ---------- value multiplier ---------- */
for (const w of ["protected,", "crew,", "impact"]) q("pop_b", at(w) + 0.1, -10);
q("riser", at("hundreds"), -8);
q("impact", at("higher.") + 0.05, -5);

/* ---------- reliability ---------- */
q("whoosh_a", at("There's") + 0.2, -7);
q("scan", at("reliability.") + 0.2, -8);
for (const w of ["sensors,", "links,", "navigation", "control", "motors"]) q("pop_a", at(w) + 0.1, -11);
q("typing", at("conditions.") - 0.2, -12);
q("ping", at("day") + 0.1, -11);
q("whoosh_b", at("longer") + 0.2, -11);
q("missile", at("react") + 0.2, -8);
q("lock", at("direction.") + 0.1, -8);
q("pop_a", at("Guns,") + 0.1, -8);
q("pop_b", at("jammers,") + 0.1, -8);
q("jam", at("jammers,") + 0.3, -12);
q("pop_a", at("interceptor") + 0.1, -8);
q("fpv", at("drones", 52) + 0.2, -13);
q("scan", at("probability") + 0.1, -10);
q("ping", at("success") + 0.1, -9);
q("impact", at("condition.") + 0.05, -8);

/* ---------- mixed attack ---------- */
q("whoosh_a", at("And", 57.8) + 0.2, -7);
q("riser", at("harder"), -9);
q("pop_a", at("mixed") + 0.1, -8);
q("prop", at("drones,", 66) + 0.3, -12);
q("fpv", at("drones,", 67) + 0.3, -13);
q("missile", at("missiles,", 68) + 0.2, -9);
q("boom_b", at("missiles.", 69) + 0.2, -10);
q("scan", at("altitudes.") + 0.1, -10);
q("lock", at("bait") + 0.1, -9);
q("impact", at("hole.") + 0.05, -6);
q("whoosh_b", at("scenario,") + 0.2, -8);
for (let i = 0; i < 4; i++) q("ping", at("watching") + i * 0.6, -14);
q("alarm", at("second") + 0.1, -9);
q("typing", at("which") + 0.1, -12);
q("impact", at("threat.") + 0.05, -6);

/* ---------- the chain and the battery ---------- */
q("whoosh_a", at("cost", 89) + 0.2, -7);
for (const w of ["detect", "classify", "track", "pass", "authorize"]) {
  q("pop_a", at(w) + 0.12, -9);
  q("click", at(w) + 0.2, -13);
}
q("lock", at("shot.") + 0.05, -7);
for (const w of ["radars,", "optical", "acoustic", "communication", "command", "trained", "maintenance,", "power,", "round-the-clock"]) q("pop_b", at(w) + 0.1, -14);
q("paper", at("Reuters") + 0.1, -9);
q("counter", at("billion") - 0.3, -7);
q("cash", at("dollars.") + 0.05, -4);
q("impact", at("dollars.") + 0.15, -6);
q("whoosh_b", at("visible") + 0.1, -9);
q("shield", at("tip") + 0.2, -8);
q("riser", at("structure."), -8);

/* ---------- cities ---------- */
q("whoosh_a", at("And", 122.8) + 0.2, -8);
q("pop_a", at("cheap", 125) + 0.1, -9);
q("impact", at("cities.") + 0.05, -6);
q("clank", at("gun") + 0.1, -9);
{
  const start = at("throw");
  for (let k = 0; k < 4; k++) q("aagun", start + 0.4 + k * 1.1, -8);
}
q("boom_a", at("drone.", 133.8) + 0.05, -4);
q("debris", at("come", 136) + 0.4, -6);
q("debris", at("somewhere.") + 0.5, -9);
q("whoosh_b", at("wreckage") + 0.1, -10);
for (const w of ["fuel,", "metal,", "warhead."]) q("pop_b", at(w) + 0.1, -10);
q("impact", at("warhead.") + 0.2, -7);
q("pop_a", at("isolated") + 0.1, -9);
q("click", at("acceptable.") + 0.1, -8);
q("pop_a", at("urban") + 0.1, -9);
q("alarm", at("complicated.") - 0.1, -8);

renderSoundtrack({
  dur: DUR,
  cues,
  voiceIn: "public/audio/part2.mp3",
  musicIn: "public/audio/raw/music_p2.mp3",
  prefix: "p2-",
  cuesOut: "src/data/p2-sfx-cues.json",
});
