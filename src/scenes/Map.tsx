import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../design";
import { DocPage, Tag, Stamp, Pulse } from "../art/ui";
import { ShahedTop } from "../art/drones";
import { clamp01, kf, prog, rnd, useTime, win } from "../lib/kf";
import { GRATICULE, LonLat, Projection, REGION, WORLD, arcPoints, headOf, lineD, makeProjection, project } from "../lib/geo";
import { at } from "../lib/words";
import { KarabakhField } from "./KarabakhField";

type Hi = { iso: string; color: string; keys: [number, number, string?][] };

const T = {
  nk: at("Nagorno-Karabakh"),
  y2020: at("2020"),
  arm: at("Armenia"),
  aze: at("Azerbaijan."),
  during: at("During"),
  not: at("Not"),
  russia: at("Russia"),
  ukraine: at("Ukraine", 40),
  bigger: at("bigger", 44),
  there: at("There,"),
  imagine: at("imagine"),
  recon2: at("reconnaissance,", 50),
  moved: at("moved"),
  lessons: at("lessons"),
  ukr2: at("Ukraine", 66),
  studied: at("studied"),
  world2: at("world.", 70),
  iran: at("Iran"),
  launching: at("launching"),
  israel: at("Israel."),
  models: at("models"),
  became: at("became"),
  russias: at("Russia's"),
  ukr3: at("Ukraine.", 85),
  exactly: at("exactly"),
};

const HIGHLIGHTS: Hi[] = [
  { iso: "ARM", color: C.blue, keys: [[T.arm - 0.1, 0], [T.arm + 0.4, 0.8], [T.not - 0.2, 0.8], [T.not + 0.6, 0]] },
  { iso: "AZE", color: C.amber, keys: [[T.aze - 0.1, 0], [T.aze + 0.4, 0.8], [T.not - 0.2, 0.8], [T.not + 0.6, 0]] },
  { iso: "RUS", color: C.amber, keys: [[T.russia - 0.1, 0], [T.russia + 0.4, 0.72], [T.lessons, 0.72], [T.lessons + 1, 0], [T.russias - 0.1, 0], [T.russias + 0.4, 0.72]] },
  { iso: "UKR", color: C.blue, keys: [[T.ukraine - 0.1, 0], [T.ukraine + 0.4, 0.82], [T.studied + 1, 0.82], [T.world2, 0], [T.ukr3 - 0.1, 0], [T.ukr3 + 0.4, 0.82]] },
  { iso: "IRN", color: C.amber, keys: [[T.iran - 0.1, 0], [T.iran + 0.5, 0.8]] },
  { iso: "ISR", color: C.blue, keys: [[T.israel - 0.1, 0], [T.israel + 0.4, 0.9], [T.became, 0.9], [T.became + 0.8, 0]] },
];

/** Where the map is shown at full strength / dimmed behind illustrations. */
const mapOpacity = (t: number) =>
  kf(t, [
    [8.6, 0],
    [9.4, 1, "power2.out"],
    [at("Footage") - 0.2, 1],
    [at("Footage") + 0.4, 0.28],
    [at("helped") - 0.3, 0.28],
    [at("helped") + 0.3, 1],
    [T.recon2 - 0.5, 1],
    [T.recon2 + 0.2, 0.22],
    [T.moved + 0.2, 0.22],
    [T.moved + 1.0, 1],
    [T.models - 0.2, 1],
    [T.models + 0.5, 0.25],
    [T.became - 0.3, 0.25],
    [T.became + 0.4, 1],
    [T.exactly + 0.4, 1],
    [T.exactly + 1.3, 0, "power2.in"],
  ]);

const FRONT: LonLat[] = [
  [37.6, 50.3],
  [37.9, 49.3],
  [37.8, 48.5],
  [37.3, 47.9],
  [36.0, 47.6],
  [34.8, 47.4],
  [33.6, 46.9],
  [32.7, 46.5],
];

const IRAN_LAUNCH: LonLat[] = Array.from({ length: 26 }, (_, i) => [46.4 + rnd(i, 1) * 5.5, 32.3 + rnd(i, 2) * 3.4]);
const ISRAEL_HIT: LonLat[] = Array.from({ length: 26 }, (_, i) => [34.75 + rnd(i, 3) * 0.7, 31.0 + rnd(i, 4) * 1.9]);

const CAPITALS: LonLat[] = [
  [-77.0, 38.9],
  [-0.1, 51.5],
  [2.35, 48.85],
  [13.4, 52.5],
  [21.0, 52.2],
  [24.9, 60.2],
  [32.9, 39.9],
  [34.8, 32.1],
  [46.7, 24.7],
  [77.2, 28.6],
  [-47.9, -15.8],
  [28.2, -25.7],
  [18.1, 59.3],
  [10.7, 59.9],
  [-9.1, 38.7],
  [36.8, -1.3],
  [-3.7, 40.4],
  [55.3, 25.3],
];
const KYIV: LonLat = [30.5, 50.45];

const RU_LAUNCH: LonLat[] = [
  [37.5, 51.2],
  [39.2, 47.3],
  [34.2, 45.2],
  [36.6, 50.6],
  [38.5, 52.6],
  [40.0, 48.0],
];
const UA_CITIES: LonLat[] = [
  [30.5, 50.45],
  [36.2, 50.0],
  [30.7, 46.5],
  [35.0, 48.45],
  [24.0, 49.8],
  [35.1, 47.8],
  [32.0, 46.97],
  [28.5, 49.2],
];

const SWARM = Array.from({ length: 34 }, (_, i) => {
  const a: LonLat = [23.5 + rnd(i, 10) * 15, 45.6 + rnd(i, 11) * 6];
  const b: LonLat = [23.5 + rnd(i, 12) * 15, 45.6 + rnd(i, 13) * 6];
  return { a, b, t0: T.there + 0.5 + rnd(i, 14) * 4.2, bow: (rnd(i, 15) - 0.5) * 3 };
});

const Land: React.FC<{ P: Projection; data: typeof REGION; opacity: number; hiAlpha: (iso: string) => { color: string; a: number }[] }> = ({ P, data, opacity, hiAlpha }) => {
  if (opacity <= 0.001) return null;
  const paths = data.map((c) => ({ c, d: P.path(c.g) ?? "" })).filter((x) => x.d);
  const all = paths.map((x) => x.d).join("");
  const id = data === REGION ? "r" : "w";
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={`land-${id}`}>
          <path d={all} />
        </clipPath>
      </defs>
      <path d={all} fill="none" stroke="#9CC0BA" strokeOpacity={0.1} strokeWidth={18} strokeLinejoin="round" />
      <path d={all} fill="none" stroke="#9CC0BA" strokeOpacity={0.16} strokeWidth={7} strokeLinejoin="round" />
      {paths.map(({ c, d }) => (
        <path key={c.iso + c.n} d={d} fill={C.land} />
      ))}
      {paths.map(({ c, d }) =>
        hiAlpha(c.iso).map((h, i) => (h.a > 0.001 ? <path key={`${c.iso}-${i}`} d={d} fill={h.color} opacity={h.a} /> : null)),
      )}
      <rect width={1920} height={1080} fill="url(#pat-mottle)" clipPath={`url(#land-${id})`} />
      <rect width={1920} height={1080} fill="url(#pat-contours)" clipPath={`url(#land-${id})`} opacity={clamp01((P.cam.scale - 3000) / 20000) * 0.9 + 0.12} />
      <rect width={1920} height={1080} fill="url(#pat-speck)" clipPath={`url(#land-${id})`} opacity={0.6} />
      {paths.map(({ c, d }) => (
        <path key={`b${c.iso}${c.n}`} d={d} fill="none" stroke={C.ink} strokeOpacity={0.55} strokeWidth={1.6} strokeLinejoin="round" />
      ))}
    </g>
  );
};

export const MapLayer: React.FC = () => {
  const t = useTime();
  const op = mapOpacity(t);
  if (op <= 0.001) return null;
  const P = makeProjection(t);
  const s = P.cam.scale;
  const regionMix = clamp01((s - 1050) / 350);
  // highlights calm down when the camera is on the ground so drawn units stay readable
  const closeUp = 1 - clamp01((s - 8000) / 20000) * 0.55;
  const hiAlpha = (iso: string) => HIGHLIGHTS.filter((h) => h.iso === iso).map((h) => ({ color: h.color, a: kf(t, h.keys) * closeUp }));
  const sphere = P.path({ type: "Sphere" }) ?? "";

  // vignette: generous around the globe, tighter when zoomed in
  const globeness = clamp01((900 - s) / 400);
  const mask = `radial-gradient(ellipse ${46 + globeness * 12}% ${56 + globeness * 30}% at 50% 50%, #000 ${58 + globeness * 20}%, transparent 100%)`;

  const lab = (ll: LonLat, text: string, p: number, dx = 0, dy = -70, accent: string = C.amber, size = 36) => {
    const pt = project(P, ll);
    if (!pt || p <= 0) return null;
    return (
      <g key={text + ll[0]}>
        <path d={`M${pt[0]},${pt[1]} L${pt[0] + dx},${pt[1] + dy + 26}`} stroke={C.ink} strokeWidth={3} opacity={clamp01(p * 2)} />
        <circle cx={pt[0]} cy={pt[1]} r={7} fill={accent} stroke={C.ink} strokeWidth={3} opacity={clamp01(p * 2)} />
        <Tag x={pt[0] + dx} y={pt[1] + dy} text={text} p={p} accent={accent} size={size} />
      </g>
    );
  };

  const nkr = REGION.find((c) => c.iso === "NKR")!;
  const nkrD = P.path(nkr.g) ?? "";
  const nkrA = win(t, T.nk - 0.2, T.not + 0.6, 0.6, 0.6);
  const nkrPt = project(P, [46.75, 39.85]);

  // --- Russia / Ukraine: scale-up dots on the front line
  const dots = Array.from({ length: 140 }, (_, i) => {
    const seg = Math.floor(rnd(i, 21) * (FRONT.length - 1));
    const k = rnd(i, 22);
    const a = FRONT[seg];
    const b = FRONT[seg + 1];
    const ll: LonLat = [a[0] + (b[0] - a[0]) * k + (rnd(i, 23) - 0.5) * 2.2, a[1] + (b[1] - a[1]) * k + (rnd(i, 24) - 0.5) * 1.4];
    const t0 = T.ukraine + 0.9 + (i / 140) * (T.bigger + 0.9 - T.ukraine - 0.9) * (0.6 + rnd(i, 25) * 0.4);
    return { ll, t0, side: rnd(i, 26) > 0.5 };
  });
  const dotsA = win(t, T.ukraine + 0.8, T.recon2 + 0.2, 0.3, 0.7);

  // --- lessons spreading from Kyiv
  const lessonsA = win(t, T.studied - 0.2, T.iran + 0.6, 0.3, 0.8);

  // --- Iran -> Israel
  const iranA = win(t, T.launching - 0.1, T.models + 0.6, 0.2, 0.6);

  // --- Shahed via Russia into Ukraine
  const ruA = win(t, T.became + 0.2, T.exactly + 1.2, 0.2, 0.5);
  const converge = prog(t, T.exactly - 0.1, T.exactly + 1.0, "power3.in");

  return (
    <AbsoluteFill style={{ opacity: op, WebkitMaskImage: mask, maskImage: mask }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <pattern id="pat-hatch" patternUnits="userSpaceOnUse" width={16} height={16} patternTransform="rotate(45)">
            <rect width={16} height={16} fill={C.red} fillOpacity={0.25} />
            <path d="M0,0 L0,16" stroke={C.red} strokeWidth={6} />
          </pattern>
          <radialGradient id="ocean-g" cx="45%" cy="40%" r="75%">
            <stop offset="0%" stopColor="#21393D" />
            <stop offset="100%" stopColor="#101C1F" />
          </radialGradient>
        </defs>
        <path d={sphere} fill="url(#ocean-g)" opacity={0.94} />
        <path d={sphere} fill="url(#pat-mottle)" opacity={0.5} />
        <path d={P.path(GRATICULE) ?? ""} fill="none" stroke="#9CC0BA" strokeOpacity={0.12} strokeWidth={1.2} />
        <Land P={P} data={WORLD} opacity={1 - regionMix} hiAlpha={hiAlpha} />
        <Land P={P} data={REGION} opacity={regionMix} hiAlpha={hiAlpha} />
        {globeness > 0 && <path d={sphere} fill="none" stroke={C.cyan} strokeOpacity={0.35 * globeness} strokeWidth={3} />}

        {/* Nagorno-Karabakh */}
        {nkrA > 0 && (
          <g opacity={nkrA}>
            <path d={nkrD} fill="url(#pat-hatch)" />
            <path d={nkrD} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="12 8" strokeDashoffset={-t * 20} />
          </g>
        )}
        {nkrPt && (
          <>
            <Pulse x={nkrPt[0]} y={nkrPt[1]} p={prog(t, T.nk, T.nk + 1.2, "none")} r={220} color={C.red} width={6} />
            {lab([46.75, 39.85], "NAGORNO-KARABAKH", win(t, T.nk, T.during + 0.1, 0.9, 0.35), 0, -120, C.red, 40)}
            <Stamp x={nkrPt[0]} y={nkrPt[1] + 150} text="2020" p={win(t, T.y2020 - 0.05, T.during + 0.1, 0.5, 0.35)} size={130} color={C.cream} />
          </>
        )}
        {lab([44.8, 40.25], "ARMENIA", win(t, T.arm, T.during + 0.1, 0.7, 0.3), -210, -40, C.blue)}
        {lab([48.3, 40.6], "AZERBAIJAN", win(t, T.aze, T.during + 0.1, 0.7, 0.3), 230, -60, C.amber)}

        <KarabakhField P={P} />

        {/* Russia / Ukraine */}
        {lab([41, 52.8], "RUSSIA", win(t, T.russia, T.recon2 - 0.3, 0.7, 0.4), 60, -60, C.amber)}
        {lab([31.2, 49.3], "UKRAINE", win(t, T.ukraine, T.recon2 - 0.3, 0.7, 0.4), -60, -110, C.blue)}
        {dotsA > 0 && (
          <g opacity={dotsA}>
            {dots.map((d, i) => {
              const pt = project(P, d.ll);
              const pp = prog(t, d.t0, d.t0 + 0.35, "back.out(3)");
              if (!pt || pp <= 0) return null;
              return <path key={i} d={`M${pt[0]},${pt[1] - 15 * pp} L${pt[0] + 13 * pp},${pt[1] + 11 * pp} L${pt[0] - 13 * pp},${pt[1] + 11 * pp}Z`} fill={d.side ? C.amber : C.blue} stroke={C.ink} strokeWidth={2.5} />;
            })}
          </g>
        )}
        {SWARM.map((sw, i) => {
          const pp = prog(t, sw.t0, sw.t0 + 2.2, "power1.inOut");
          const a = win(t, sw.t0, T.recon2 + 0.3, 0.2, 0.6);
          if (pp <= 0 || a <= 0) return null;
          const pts = arcPoints(sw.a, sw.b, pp, sw.bow, 30);
          const h = headOf(P, pts);
          return (
            <g key={`sw${i}`} opacity={a}>
              <path d={lineD(P, pts)} fill="none" stroke={C.cream} strokeWidth={3.5} strokeDasharray="10 8" opacity={0.8} />
              {h && pp < 1 && <path d="M0,-18 L14,14 L0,7 L-14,14Z" transform={`translate(${h.x} ${h.y}) rotate(${h.rot})`} fill={C.cream} stroke={C.ink} strokeWidth={2.5} />}
            </g>
          );
        })}

        {/* lessons from Ukraine to the world */}
        {lab([31.2, 49.3], "UKRAINE", win(t, T.ukr2 - 0.3, T.studied + 1.2, 0.6, 0.5), -60, -110, C.blue, 36)}
        {(() => {
          const k = project(P, KYIV);
          const a = win(t, T.lessons - 0.1, T.studied + 0.6, 0.4, 0.5);
          if (!k || a <= 0) return null;
          const pop = prog(t, T.lessons - 0.1, T.lessons + 0.5, "back.out(2)");
          return (
            <g opacity={a}>
              <Pulse x={k[0]} y={k[1]} p={((t - T.lessons) * 0.8) % 1} r={120} color={C.amber} width={5} />
              <g transform={`translate(${k[0] + 70} ${k[1] + 60}) rotate(-6) scale(${0.26 * pop})`}>
                <DocPage lines={prog(t, T.lessons, T.ukr2 + 0.6, "none")} chart={prog(t, T.lessons + 0.3, T.studied, "none")} tab={C.blue} />
              </g>
            </g>
          );
        })()}
        {lessonsA > 0 && (
          <g opacity={lessonsA}>
            {CAPITALS.map((cap, i) => {
              const t0 = T.studied + (i / CAPITALS.length) * 1.6;
              const pp = prog(t, t0, t0 + 1.3, "power2.inOut");
              if (pp <= 0) return null;
              const pts = arcPoints(KYIV, cap, pp, 0, 40);
              const end = project(P, cap);
              const arrive = prog(t, t0 + 1.2, t0 + 2.4, "none");
              return (
                <g key={`c${i}`}>
                  <path d={lineD(P, pts)} fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" opacity={0.5} />
                  <path d={lineD(P, pts)} fill="none" stroke={C.amber} strokeWidth={4} strokeLinecap="round" />
                  {end && pp >= 1 && <circle cx={end[0]} cy={end[1]} r={9} fill={C.amber} stroke={C.ink} strokeWidth={3} />}
                  {end && <Pulse x={end[0]} y={end[1]} p={arrive} r={60} color={C.amber} width={5} />}
                </g>
              );
            })}
            {(() => {
              const k = project(P, KYIV);
              return k ? <circle cx={k[0]} cy={k[1]} r={10} fill={C.blue} stroke={C.ink} strokeWidth={3} /> : null;
            })()}
          </g>
        )}

        {/* Iran -> Israel */}
        {lab([54, 32.8], "IRAN", win(t, T.iran, T.models + 0.2, 0.7, 0.4), 40, -90, C.amber, 38)}
        {lab([34.95, 31.6], "ISRAEL", win(t, T.israel, T.models + 0.2, 0.7, 0.4), -170, -40, C.blue, 38)}
        {iranA > 0 &&
          IRAN_LAUNCH.map((a, i) => {
            const t0 = T.launching + (i / IRAN_LAUNCH.length) * 2.2;
            const pp = prog(t, t0, t0 + 2.6, "power1.inOut");
            if (pp <= 0) return null;
            const pts = arcPoints(a, ISRAEL_HIT[i], pp, (rnd(i, 7) - 0.5) * 2.5, 36);
            const h = headOf(P, pts);
            return (
              <g key={`ir${i}`} opacity={iranA}>
                <path d={lineD(P, pts)} fill="none" stroke={C.red} strokeWidth={2.5} strokeDasharray="10 6" opacity={0.8} />
                {h && pp < 1 && <ShahedTop x={h.x} y={h.y} r={h.rot} s={0.1} detail={false} />}
                {pp >= 1 &&
                  (() => {
                    const e = project(P, ISRAEL_HIT[i]);
                    return e ? <Pulse x={e[0]} y={e[1]} p={prog(t, t0 + 2.6, t0 + 3.4, "none")} r={30} color={C.red} width={3} /> : null;
                  })()}
              </g>
            );
          })}

        {/* Shahed: Iran -> Russia -> Ukraine */}
        {ruA > 0 && (
          <g opacity={ruA}>
            {lab([44, 54.2], "RUSSIA", win(t, T.russias, T.exactly + 0.4, 0.6, 0.4), 0, -70, C.amber, 36)}
            {lab([53.5, 32.8], "IRAN", win(t, T.became, T.exactly + 0.4, 0.6, 0.4), 40, 80, C.amber, 32)}
            {lab([31, 49.4], "UKRAINE", win(t, T.ukr3 - 0.2, T.exactly + 0.4, 0.6, 0.4), -80, -80, C.blue, 36)}
            {(() => {
              const pp = prog(t, T.became + 0.3, T.russias + 0.6, "power2.inOut");
              const pts = arcPoints([51.4, 35.7], [45.5, 51.5], pp, 2.5, 40);
              const h = headOf(P, pts);
              return pp > 0 ? (
                <g>
                  <path d={lineD(P, pts)} fill="none" stroke={C.amber} strokeWidth={5} strokeDasharray="16 10" strokeDashoffset={-t * 40} />
                  {h && <ShahedTop x={h.x} y={h.y} r={h.rot} s={0.16 * (1 - converge)} detail={false} />}
                </g>
              ) : null;
            })()}
            {UA_CITIES.map((city, i) => {
              const src = RU_LAUNCH[i % RU_LAUNCH.length];
              const t0 = T.russias + 0.9 + i * 0.22;
              const pp = prog(t, t0, t0 + 1.6, "power1.inOut");
              if (pp <= 0) return null;
              const pts = arcPoints(src, city, pp, (rnd(i, 31) - 0.5) * 2, 30);
              const h = headOf(P, pts);
              const cx = h ? h.x + (960 - h.x) * converge : 0;
              const cy = h ? h.y + (540 - h.y) * converge : 0;
              return (
                <g key={`ua${i}`}>
                  <path d={lineD(P, pts)} fill="none" stroke={C.red} strokeWidth={3} strokeDasharray="10 7" opacity={0.85 * (1 - converge)} />
                  {h && <ShahedTop x={cx} y={cy} r={h.rot} s={0.13 * (1 - converge * 0.6)} detail={false} />}
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
