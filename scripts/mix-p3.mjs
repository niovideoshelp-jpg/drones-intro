// Part 3 ("the five layers") soundtrack, synced to the same words as src/p3/*.tsx.
import { makeAt, makeCues, renderSoundtrack } from "./mixlib.mjs";

const at = makeAt("src/data/p3-words.json");
const { cues, q } = makeCues();
const DUR = 386.5;

/* ---------- opening: the cost curve and the five rings ---------- */
q("whoosh_a", at("Is") + 0.2, -6);
q("riser", at("air") + 0.1, -9);
q("impact", at("unsustainable?") + 0.1, -5);
q("arc", at("No") + 0.15, -8);
q("powerdown", at("technology") + 0.1, -9);
q("click", at("own.") + 0.1, -10);
q("whoosh_b", at("combining") + 0.1, -9);
for (const [w, off] of [["combining", 0.1], ["combining", 0.45], ["layers", -0.1], ["layers", 0.25], ["using,", 0.1]]) q("pop_a", at(w) + off, -11);
q("ping", at("cheapest") + 0.1, -10);
q("shield", at("success.") + 0.1, -7);

/* ---------- layer 1: information ---------- */
q("scan", at("information.") + 0.15, -7);
q("typing", at("Before") + 0.1, -12);
for (const w of ["Acoustic", "radars,", "thermal", "cameras,"]) q("pop_b", at(w) + 0.1, -11);
q("counter", at("fusion") + 0.1, -10);
q("lock", at("identify") + 0.1, -8);
q("tick", at("trajectory,") + 0.1, -11);
q("click", at("after.") + 0.1, -10);
q("pop_a", at("decoy,") + 0.1, -10);
q("powerdown", at("fall") + 0.2, -11);
q("alarm", at("danger.") - 0.1, -9);

/* ---------- layer 2: electronic warfare ---------- */
q("whoosh_a", at("Then") + 0.2, -7);
q("jam", at("warfare.", 51) + 0.1, -6);
q("jam", at("Jamming") + 0.15, -9);
q("powerdown", at("signals") + 0.2, -10);
q("scan", at("navigation", 55) + 0.1, -11);
q("cash", at("cheaper") + 0.1, -10);
q("swarm", at("several") + 0.2, -10);
q("impact", at("once.") + 0.05, -8);
q("click", at("But", 64) + 0.1, -10);
q("prop", at("autonomously") + 0.3, -12);
q("ping", at("inertial") + 0.1, -11);
q("ping", at("visual") + 0.1, -11);
q("jam", at("jam.") + 0.05, -9);
q("zoom", at("fiber") + 0.1, -10);
q("tick", at("cable,") + 0.2, -12);
q("shield", at("eliminates") + 0.1, -9);
q("alarm", at("indiscriminate") + 0.1, -10);
q("powerdown", at("communications.") + 0.1, -10);

/* ---------- layer 3: guns and rockets ---------- */
q("whoosh_b", at("When") + 0.2, -7);
q("clank", at("enough,") + 0.1, -9);
q("clank", at("guns") + 0.1, -8);
q("fire", at("rockets") + 0.15, -8);
for (const w of ["Gepard,", "C-RAM,", "SkyRanger,"]) {
  q("pop_a", at(w) + 0.1, -9);
  q("aagun", at(w) + 0.35, -10);
}
q("boom_b", at("airburst") + 0.25, -7);
q("missile", at("APKWS,") + 0.1, -8);
q("cash", at("dollars,") + 0.1, -9);
q("click", at("less.") + 0.1, -10);
q("ping", at("trade") + 0.1, -10);
q("impact", at("missile.", 113) + 0.1, -7);
q("click", at("But", 114) + 0.1, -10);
q("scan", at("physical") + 0.1, -11);
q("lock", at("close") + 0.1, -10);
q("tick", at("shorter") + 0.1, -11);
q("aagun", at("rounds") + 0.2, -9);
q("debris", at("debris") + 0.2, -8);
q("impact", at("ground.") + 0.1, -8);

/* ---------- layer 4: interceptor drones ---------- */
q("whoosh_a", at("Another") + 0.2, -7);
q("fpv", at("drones.", 133) + 0.15, -7);
q("pop_b", at("Ukraine,") + 0.1, -11);
q("counter", at("economics") + 0.1, -10);
q("prop", at("send") + 0.2, -11);
q("zoom", at("chase") + 0.2, -9);
q("boom_a", at("destroy", 144) + 0.35, -6);
q("cash", at("brings") + 0.1, -10);
q("click", at("cases,", 150) + 0.1, -10);
q("ping", at("threat.", 154) + 0.1, -9);
q("click", at("But", 155) + 0.1, -10);
for (const w of [["sensors,", 158], ["operators,", 159], ["autonomous", 160]]) q("pop_a", at(...w) + 0.1, -11);
q("alarm", at("struggle") + 0.1, -10);
q("swarm", at("directions") + 0.2, -9);
q("impact", at("once.", 170) + 0.05, -8);

/* ---------- layer 5: directed energy ---------- */
q("whoosh_b", at("And", 171) + 0.2, -7);
q("arc", at("weapons.", 177) + 0.1, -6);
q("arc", at("Lasers") + 0.15, -9);
q("shield", at("advantage.") + 0.1, -9);
q("tick", at("installed,") + 0.1, -11);
q("cash", at("fraction") + 0.1, -10);
q("ping", at("power.") + 0.1, -10);
q("pop_b", at("DragonFire") + 0.1, -10);
q("cash", at("pounds") + 0.1, -9);
q("pop_b", at("Beam,") + 0.1, -10);
q("pop_b", at("States") + 0.1, -10);
q("arc", at("microwave") + 0.15, -8);
q("swarm", at("area,") + 0.2, -9);
q("boom_b", at("swarms.") + 0.1, -7);
q("click", at("But", 219) + 0.1, -10);
q("powerdown", at("miracle") + 0.1, -9);
for (const w of ["integration,", "reliability,", "maturity."]) q("pop_a", at(w) + 0.1, -11);
for (const w of ["rain,", "fog,", "smoke,", "dust,"]) q("pop_b", at(w) + 0.1, -12);
q("alarm", at("conditions.", 235) - 0.1, -9);

/* ---------- the top of the chain: the expensive missiles stay ---------- */
q("whoosh_a", at("They'll") + 0.2, -8);
q("click", at("weapon.") + 0.1, -10);
q("riser", at("Which", 241.5) + 0.1, -9);
q("lock", at("missiles", 244.5) + 0.1, -7);
q("jet", at("far", 247.6) + 0.2, -8);
q("zoom", at("fast,", 250) + 0.1, -9);
q("powerdown", at("shrugging") + 0.2, -10);
q("alarm", at("dangerous", 254) + 0.1, -9);
q("missile", at("Patriot", 256) + 0.2, -6);
q("missile", at("AIM-120") + 0.2, -8);
q("shield", at("essential.") + 0.1, -8);
q("click", at("rid") + 0.1, -10);
q("ping", at("answer", 266) + 0.1, -9);
q("impact", at("threat.", 268) + 0.05, -8);

/* ---------- sustaining it: money, industry, attrition ---------- */
q("whoosh_b", at("Because") + 0.2, -8);
q("cash", at("millions") + 0.1, -8);
q("counter", at("again,") + 0.1, -9);
q("powerdown", at("sustain") + 0.2, -9);
q("impact", at("war.") + 0.05, -7);
q("cash", at("money.") + 0.1, -9);
q("train", at("country") + 0.2, -9);
q("typing", at("building") + 0.1, -11);
q("click", at("using", 287) + 0.1, -10);
q("alarm", at("stops") + 0.1, -9);
q("clank", at("industrial") + 0.15, -9);
q("riser", at("said,") + 0.1, -9);
q("boom_a", at("doomed.") + 0.05, -6);
for (const w of [["Lasers,", 298.6], ["microwaves,", 299.5], ["guns,", 301], ["warfare,", 302]]) q("pop_a", at(...w) + 0.1, -11);
q("fpv", at("drones", 303.8) + 0.1, -10);
q("scan", at("cut") + 0.1, -10);
q("shield", at("attacks.", 305.5) + 0.1, -8);
q("ping", at("networks") + 0.1, -10);
for (const w of ["passive", "dispersing", "camouflage,", "hardening"]) q("pop_b", at(w) + 0.1, -11);
q("clank", at("damage", 315.8) + 0.15, -9);
q("click", at("through.", 320) + 0.1, -10);

/* ---------- nothing is perfect, so choose ---------- */
q("whoosh_a", at("None", 321) + 0.2, -7);
q("powerdown", at("perfectly.") + 0.1, -9);
for (const [w, after] of [["struggle", 324], ["autonomous", 327.8], ["range.", 329.5], ["saturated", 332]]) {
  const t = after ? at(w, after) : at(w);
  q("pop_a", t + 0.1, -10);
  q("click", t + 0.35, -12);
}
q("missile", at("necessary") + 0.2, -7);
q("impact", at("threats.", 339) + 0.05, -8);
q("whoosh_b", at("So", 339.5) + 0.2, -8);
q("cash", at("$20,000") + 0.1, -9);
q("cash", at("million", 344.3) + 0.1, -8);
q("powerdown", at("useless.") + 0.1, -7);
q("impact", at("unsustainable.", 349.2) + 0.1, -6);
q("riser", at("future", 352) + 0.1, -9);
q("ping", at("choose.") + 0.1, -8);

/* ---------- the four rules ---------- */
for (const [w, af, sfx] of [["Ignore", 356, "pop_b"], ["Jam", 357.5, "jam"], ["Shoot", 359.3, "aagun"], ["save", 363, "shield"]]) {
  q(sfx, at(w, af) + 0.15, -9);
  q("click", at(w, af) + 0.05, -12);
}
q("click", at("enough.", 366.1) + 0.1, -10);

/* ---------- the long war ---------- */
q("whoosh_a", at("Because", 368) + 0.2, -8);
q("counter", at("keep") + 0.1, -9);
q("swarm", at("thousands", 375) + 0.1, -9);
q("ping", at("again,", 375.5) + 0.1, -10);

/* ---------- sources ---------- */
q("paper", at("sources") + 0.15, -9);
q("paper", at("description,") + 0.15, -10);
q("pen", at("check") + 0.1, -10);
q("shield", at("yourself.") + 0.1, -8);

renderSoundtrack({
  dur: DUR,
  cues,
  voiceIn: "public/audio/part3.mp3",
  musicIn: "public/audio/raw/music_p3.mp3",
  prefix: "p3-",
  cuesOut: "src/data/p3-sfx-cues.json",
  sfxBusDb: -9.5,
});
