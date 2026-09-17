// Part 1 ("The New Math of Air Warfare") soundtrack. SFX hits follow the same word timings as src/p1/*.tsx.
import { makeAt, makeCues, renderSoundtrack } from "./mixlib.mjs";

const at = makeAt("src/data/p1-words.json");
const { cues, q } = makeCues();
const DUR = 168.8;

/* ---------- open ---------- */
q("impact", at("Two.") + 0.1, -3);
q("ping", at("Two.") + 0.15, -10);
["The", "New", "Math", "of", "Air", "Warfare"].forEach((w, i) => q(i % 2 ? "pop_b" : "pop_a", at(w) + 0.12, -13));
q("typing", at("Math") + 0.3, -13);
const exact = at("Exact");
q("whoosh_b", exact + 0.15, -8);
q("pop_a", exact + 0.25, -8);
q("counter", exact + 0.3, -11);
const transparent = at("transparent.");
[-0.1, 0.05, 0.2].forEach((d) => q("click", transparent + d, -10));
for (const [w, extra] of [["version,", null], ["contract,", "pen"], ["maintenance", "clank"], ["split", "whoosh_b"]]) {
  const t = at(w);
  q("pop_a", t + 0.15, -8);
  if (extra === "pen") q("pen", t + 0.8, -8);
  if (extra === "clank") q("clank", t + 0.25, -10);
  if (extra === "whoosh_b") q("whoosh_b", t + 0.35, -10);
}
q("pop_b", at("costs."), -10);
const so = at("So");
q("whoosh_a", so + 0.2, -7);

/* ---------- ballpark & the gap ---------- */
q("scan", so + 0.45, -10);
q("typing", at("numbers") + 0.1, -12);
q("whoosh_b", at("ballpark") + 0.1, -10);
q("pop_a", at("fixed") + 0.12, -8);
q("impact", at("tags.") + 0.05, -6);
q("pop_b", at("Even", 20) + 0.2, -9);
q("riser", at("obvious."), -8);
q("ping", at("obvious."), -10);

/* ---------- Shahed estimates ---------- */
const estimates = at("Estimates");
q("paper", estimates + 0.45, -8);
q("typing", at("CSIS"), -12);
q("typing", at("Reuters"), -12);
q("whoosh_a", at("Shahed-type") + 0.1, -6);
q("prop", at("drone", 27.5) + 0.6, -13);
q("pop_a", at("$20,000"), -8);
q("pop_b", at("$50,000."), -8);
q("whoosh_b", at("called") + 0.4, -8);
q("impact", at("Geran") + 0.05, -8);
q("clank", at("$35,000.") + 0.1, -6);
q("cash", at("$35,000.") + 0.15, -8);
q("whoosh_a", at("Meanwhile,") + 0.2, -8);

/* ---------- cost ladder ---------- */
q("pop_a", at("AIM-120") + 0.1, -8);
q("jet", at("jets") - 0.1, -4);
q("whoosh_a", at("ground"), -8);
q("clank", at("ground") + 0.4, -8);
q("typing", at("NASAMS"), -12);
q("missile", at("around", 46) + 0.25, -5);
q("cash", at("million", 47) + 0.1, -6);
q("paper", at("recent"), -9);
q("clank", at("Patriot") + 0.1, -8);
q("typing", at("PAC-3"), -12);
q("missile", at("$4"), -5);
q("cash", at("million,", 55.8) + 0.1, -6);
q("clank", at("THAAD,") + 0.1, -8);
q("whoosh_a", at("ballistic"), -9);
q("missile", at("$13"), -4);
q("cash", at("million.", 62) + 0.1, -6);
q("impact", at("million.", 62) + 0.2, -6);
q("whoosh_a", at("Now,") + 0.3, -8);

/* ---------- doctrine ---------- */
q("clank", at("Patriots") + 0.05, -9);
q("clank", at("THAADs") + 0.05, -9);
q("whoosh_b", at("fired") + 0.3, -10);
q("pop_a", at("every", 67), -9);
q("impact", at("drone.", 67.5) + 0.3, -5);
q("shield", at("save") + 0.1, -6);
q("cash", at("expensive", 71) + 0.1, -9);
for (const [w, after] of [["ballistic", 73], ["aircraft,", 74], ["cruise", 0], ["other", 0]]) q("pop_a", at(w, after) + 0.1, -7);
q("jet", at("aircraft,", 74) + 0.3, -12);
q("pop_b", at("simpler") + 0.1, -8);
q("click", at("beat."), -8);
q("whoosh_a", at("But") + 0.1, -7);
q("prop", at("But") + 2.2, -13);
q("pop_a", at("ideal"), -8);
q("ping", at("place", 83), -8);
q("tick", at("time.", 84) + 0.3, -15);
q("cash", at("million-dollar") + 0.1, -7);
q("shield", at("only", 87.5), -9);
q("prop", at("inside") - 0.8, -11);
q("lock", at("inside"), -6);
q("missile", at("engagement") + 0.25, -4);
q("boom_a", at("window."), -2);

/* ---------- industry ---------- */
const cheap = at("cheap", 91);
q("whoosh_b", cheap + 0.2, -8);
for (let t = cheap + 0.6; t < at("It", 101); t += 230 / 170) q("clank", t, -17);
q("whoosh_b", at("lost.") + 0.1, -10);
q("ping", at("lost."), -10);
for (const [no, what] of [["No", "survival"], ["no", "pilot"], ["no", "thousands"]]) {
  const tw = at(what);
  q("pop_a", tw - 0.4, -8);
  q("impact", tw + 0.2, -9);
}
const it = at("It", 101);
q("whoosh_a", it + 0.2, -7);
q("pop_a", at("engine") + 0.2, -8);
q("prop", at("engine") + 0.8, -12);
q("pop_b", at("ultralight"), -9);
q("pop_a", at("off-the-shelf") + 0.2, -8);
q("typing", at("electronics,"), -10);
q("scan", at("simple") + 0.2, -8);
const ifT = at("If");
q("swarm", ifT + 1.0, -8);
{
  const shot = at("shot"), down = at("down,");
  for (let k = 0; k < 9; k++) q("boom_b", shot - 0.25 + (k / 8) * (down + 0.2 - (shot - 0.25)) + 0.03, -13);
}
q("lock", at("only", 111), -6);
q("pop_b", at("one", 111.5), -8);
q("boom_a", at("target,", 112), -2);
q("click", at("worth"), -4);

/* ---------- CSIS calculation ---------- */
const inAn = at("In", 116);
q("zoom", inAn + 0.3, -6);
q("pop_a", at("Russian", 116.5), -9);
q("pop_b", at("Ukraine,"), -9);
q("prop", at("campaign") + 0.5, -13);
q("paper", at("CSIS", 119), -8);
q("whoosh_b", at("CSIS", 119) + 0.3, -9);
q("pop_a", at("Shahed") + 0.1, -8);
q("cash", at("$35,000,", 123), -7);
q("pop_b", at("roughly") + 0.1, -12);
q("impact", at("90%"), -6);
{
  const pct = at("90%"), icp = at("intercepted,");
  for (let i = 0; i < 9; i++) q("click", pct + 0.2 + i * ((icp + 0.3 - pct) / 9), -13);
  q("lock", icp + 0.1, -9);
}
q("typing", at("offensive"), -11);
q("pop_a", at("$35,000", 129.8), -8);
q("impact", at("anymore.") + 0.05, -6);
q("counter", at("climbs") + 0.1, -6);
q("riser", at("$350,000"), -8);
q("cash", at("$350,000") + 0.1, -5);
q("lock", at("target", 136), -6);
q("boom_b", at("struck."), -10);
q("impact", at("difference."), -5);

/* ---------- damage ---------- */
const but2 = at("But", 139.5);
q("whoosh_a", but2 + 0.2, -8);
q("impact", at("bargain"), -4);
q("cash", at("bargain") + 0.05, -8);
for (const [w0, hit, after, special] of [
  ["high-voltage", "transformer,", 0, "arc"],
  ["sets", "fire,", 147.5, "fire"],
  ["shuts", "line,", 0, "train"],
  ["military", "stop", 150, "powerdown"],
]) {
  const t0 = at(w0, w0 === "military" ? 150 : 0);
  const th = at(hit, after);
  q("pop_a", t0 - 0.2, -9);
  q("whoosh_b", th - 0.3, -10);
  q("boom_a", th, -4);
  if (special === "arc") q("arc", th + 0.1, -6);
  if (special === "fire") q("fire", th + 0.2, -5);
  if (special === "train") q("train", th + 0.4, -7);
  if (special === "powerdown") q("powerdown", th + 0.1, -5);
}

/* ---------- attrition ---------- */
const so2 = at("So", 153);
q("swarm", so2 + 1.5, -6);
q("prop", so2 + 3, -12);
{
  const e = at("every", 155), s = at("survive.");
  for (let k = 0; k < 11; k++) q("boom_b", e - 0.3 + (k / 10) * (s + 0.4 - (e - 0.3)) + 0.03, -13);
}
q("lock", at("few"), -7);
q("ping", at("through.", 159), -8);
q("whoosh_a", at("And", 160) + 0.1, -8);
q("scan", at("radars,"), -6);
q("ping", at("radars,") + 0.3, -9);
q("boots", at("mobilize") + 0.3, -6);
q("missile", at("fire", 164) + 0.05, -3);
q("missile", at("fire", 164) + 0.33, -6);
q("alarm", at("alert") - 0.1, -8);
q("alarm", at("night") + 0.3, -12);
q("whoosh_b", at("stay") + 0.5, -12);
q("whoosh_b", at("night.", 167.3), -12);

renderSoundtrack({
  dur: DUR,
  cues,
  voiceIn: "public/audio/part1.mp3",
  musicIn: "public/audio/raw/music_p1.mp3",
  prefix: "p1-",
  cuesOut: "src/data/p1-sfx-cues.json",
});
