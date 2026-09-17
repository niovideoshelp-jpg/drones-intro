// Builds compact geography for the film from Natural Earth (public domain).
// Input: public/geo/*.geojson (downloaded from github.com/nvkelso/natural-earth-vector)
// Output: src/data/region.json (50m, Europe / Caucasus / Middle East), src/data/world.json (110m)
import fs from "node:fs";

const read = (f) => JSON.parse(fs.readFileSync(new URL(`../public/geo/${f}`, import.meta.url), "utf8"));
const round = (c, p) => (typeof c[0] === "number" ? [+c[0].toFixed(p), +c[1].toFixed(p)] : c.map((x) => round(x, p)));

const dedupe = (ring) => ring.filter((pt, i) => i === 0 || pt[0] !== ring[i - 1][0] || pt[1] !== ring[i - 1][1]);
const clean = (geom, p) => {
  const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  const out = polys
    .map((poly) => poly.map((ring) => dedupe(round(ring, p))).filter((r) => r.length >= 4))
    .filter((poly) => poly.length);
  return { type: "MultiPolygon", coordinates: out };
};
const bboxOf = (geom) => {
  let [x0, y0, x1, y1] = [180, 90, -180, -90];
  const walk = (c) => {
    if (typeof c[0] === "number") {
      x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]); y0 = Math.min(y0, c[1]); y1 = Math.max(y1, c[1]);
    } else c.forEach(walk);
  };
  walk(geom.coordinates);
  return [x0, y0, x1, y1];
};

const short = {
  "United Republic of Tanzania": "Tanzania",
  "Republic of Serbia": "Serbia",
  "Bosnia and Herzegovina": "Bosnia",
  "North Macedonia": "Macedonia",
};

const c50 = read("ne_50m_admin_0_countries.geojson");
const inWindow = (poly) => {
  const b = bboxOf({ coordinates: poly });
  return !(b[2] < -15 || b[0] > 80 || b[3] < 8 || b[1] > 72);
};
const clip = (geom) => ({
  type: "MultiPolygon",
  coordinates: (geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates).filter(inWindow),
});
const region = [];
for (const f of c50.features) {
  const b = bboxOf(f.geometry);
  // keep anything touching lon -12..75, lat 10..72
  if (b[2] < -12 || b[0] > 75 || b[3] < 10 || b[1] > 72) continue;
  const name = short[f.properties.ADMIN] ?? f.properties.ADMIN;
  const g = clean(clip(f.geometry), 2);
  if (!g.coordinates.length) continue;
  region.push({ n: name, iso: f.properties.ADM0_A3, g });
}
const disputed = read("ne_10m_admin_0_disputed_areas.geojson");
const artsakh = disputed.features.find((f) => f.properties.BRK_NAME === "Artsakh");
region.push({ n: "Nagorno-Karabakh", iso: "NKR", g: clean(artsakh.geometry, 3) });

const c110 = read("ne_110m_admin_0_countries.geojson");
const world = c110.features
  .filter((f) => f.properties.ADMIN !== "Antarctica")
  .map((f) => ({ n: short[f.properties.ADMIN] ?? f.properties.ADMIN, iso: f.properties.ADM0_A3, g: clean(f.geometry, 1) }));

fs.writeFileSync(new URL("../src/data/region.json", import.meta.url), JSON.stringify(region));
fs.writeFileSync(new URL("../src/data/world.json", import.meta.url), JSON.stringify(world));
console.log("region", region.length, (JSON.stringify(region).length / 1024).toFixed(0) + "KB");
console.log("world", world.length, (JSON.stringify(world).length / 1024).toFixed(0) + "KB");
console.log(region.map((r) => r.n).join(", "));
