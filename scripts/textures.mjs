// Procedural textures (no third-party images): writes RGBA PNGs to public/tex.
import fs from "node:fs";
import zlib from "node:zlib";

const crcTable = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (buf) => {
  let c = -1;
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const png = (w, h, rgba) => {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

// deterministic PRNG + tileable value noise
let seed = 1337;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const lattice = (n) => Float32Array.from({ length: n * n }, rand);
const smooth = (t) => t * t * (3 - 2 * t);
const makeNoise = (period) => {
  const L = lattice(period);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = smooth(x - xi), yf = smooth(y - yi);
    const i0 = ((xi % period) + period) % period, j0 = ((yi % period) + period) % period;
    const i1 = (i0 + 1) % period, j1 = (j0 + 1) % period;
    const a = L[j0 * period + i0], b = L[j0 * period + i1], c = L[j1 * period + i0], d = L[j1 * period + i1];
    return a + (b - a) * xf + (c + (d - c) * xf - (a + (b - a) * xf)) * yf;
  };
};
const fbm = (size, base, octaves) => {
  const layers = Array.from({ length: octaves }, (_, o) => ({ n: makeNoise(base << o), f: (base << o) / size, a: 0.5 ** o }));
  const norm = layers.reduce((s, l) => s + l.a, 0);
  return (x, y) => layers.reduce((s, l) => s + l.n(x * l.f, y * l.f) * l.a, 0) / norm;
};

const out = (name, w, h, fn) => {
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const [r, g, b, a] = fn(x, y);
      const i = (y * w + x) * 4;
      buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = Math.max(0, Math.min(255, Math.round(a)));
    }
  fs.writeFileSync(new URL(`../public/tex/${name}`, import.meta.url), png(w, h, buf));
  console.log(name, w, h);
};

const S = 1024; // tileable
// 1) dark mottling + fibres for land / plates (multiply-like shading as alpha black)
{
  const m = fbm(S, 4, 6), fine = fbm(S, 128, 2), fib = fbm(S, 16, 3);
  out("mottle.png", S, S, (x, y) => {
    const v = m(x, y);
    const g = fine(x, y);
    const fibre = Math.abs(fib(x * 0.25, y * 2.2) - 0.5) < 0.012 ? 30 : 0;
    const a = Math.max(0, (v - 0.42) * 260) + (g - 0.5) * 70 + fibre;
    return [18, 16, 10, a];
  });
}
// 2) light speckle / dust for highlights
{
  const m = fbm(S, 8, 4);
  out("speck.png", S, S, (x, y) => {
    const r = rand();
    const v = m(x, y);
    let a = 0;
    if (r > 0.9965) a = 150 + rand() * 90;
    else if (r > 0.985) a = 40 * v;
    a += Math.max(0, v - 0.7) * 45;
    return [255, 250, 235, a];
  });
}
// 3) worn-print mask: mostly opaque, soft blotches + pinholes (used as CSS mask on the whole stage)
{
  const m = fbm(S, 6, 5), n = fbm(S, 64, 2);
  out("wear.png", S, S, (x, y) => {
    const v = m(x, y), g = n(x, y);
    let a = 255 - Math.max(0, v - 0.6) * 260 - Math.max(0, g - 0.62) * 300;
    if (rand() > 0.9992) a = 40;
    return [255, 255, 255, Math.max(150, a)];
  });
}
// 4) topographic-ish contour lines (for terrain close-ups)
{
  const m = fbm(S, 3, 5);
  out("contours.png", S, S, (x, y) => {
    const v = m(x, y) * 14;
    const d = Math.abs(v - Math.round(v));
    const major = Math.round(v) % 4 === 0;
    const a = d < (major ? 0.07 : 0.04) ? (major ? 90 : 55) : 0;
    return [20, 22, 16, a];
  });
}
