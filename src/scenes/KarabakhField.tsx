import React from "react";
import { C } from "../design";
import { LoiterTop, ReconDroneTop } from "../art/drones";
import { HowitzerTop, SAMTop, TankTop } from "../art/ground";
import { Reticle, Tag } from "../art/ui";
import { clamp01, ease, kf, prog, rnd, useTime, win } from "../lib/kf";
import { Projection, project } from "../lib/geo";
import { at } from "../lib/words";

const T = {
  during: at("During"),
  recon: at("reconnaissance", 20),
  strike: at("strike"),
  armenian: at("Armenian"),
  tanks: at("tanks,"),
  artillery: at("artillery"),
  air: at("air"),
  systems: at("systems."),
  footage: at("Footage"),
  helped: at("helped"),
  small: at("small"),
  completely: at("completely"),
  works: at("works."),
  not: at("Not"),
};

const TARGETS = [
  { dx: -480, dy: -30, t: T.tanks, label: "TANKS", s: 0.8, r: 24, kind: "tank" },
  { dx: 0, dy: 190, t: T.artillery, label: "ARTILLERY", s: 0.75, r: -28, kind: "gun" },
  { dx: 480, dy: -50, t: T.air, label: "AIR DEFENSE", s: 0.62, r: 64, kind: "sam" },
] as const;

const HEX = 62;
const CELLS = (() => {
  const out: { x: number; y: number; d: number; i: number }[] = [];
  const w = HEX * 1.5;
  const h = HEX * Math.sqrt(3);
  let i = 0;
  for (let q = -12; q <= 12; q++)
    for (let r = -7; r <= 7; r++) {
      const x = q * w;
      const y = r * h + (q % 2 ? h / 2 : 0);
      if ((x / 900) ** 2 + (y / 470) ** 2 > 1) continue;
      out.push({ x, y, d: Math.hypot(x, y * 1.6), i: i++ });
    }
  return out;
})();
const hexD = (() => {
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k;
    return `${(Math.cos(a) * (HEX - 3)).toFixed(1)},${(Math.sin(a) * (HEX - 3)).toFixed(1)}`;
  });
  return `M${pts.join(" L")}Z`;
})();

export const KarabakhField: React.FC<{ P: Projection }> = ({ P }) => {
  const t = useTime();
  if (t < T.during || t > T.not + 1) return null;
  const c = project(P, [46.75, 39.85]);
  if (!c) return null;
  const [cx, cy] = c;

  // phase A: drones against targets
  const aA = win(t, T.recon - 0.3, T.footage - 0.05, 0.4, 0.35);
  // recon drone holds a tight overwatch orbit above the centre, clear of targets and labels
  const orbit = (t - T.recon) * 0.9;
  const reconIn = ease("power3.out")(clamp01((t - T.recon + 0.2) / 1.4));
  const ox = cx;
  const oy = cy - 250;
  const rx = ox + Math.cos(orbit) * 150 - (1 - reconIn) * 900;
  const ry = oy + Math.sin(orbit) * 60 - (1 - reconIn) * 200;
  const rHead = (Math.atan2(Math.cos(orbit) * 60, -Math.sin(orbit) * 150) * 180) / Math.PI + 90;

  // strike drone hops between targets, parked up-right of each so reticles and tags stay clear
  const hop = (i: number) => [cx + TARGETS[i].dx + (i === 2 ? -150 : 150), cy + TARGETS[i].dy - 70] as const;
  const sx = kf(t, [
    [T.strike - 0.2, cx + 900],
    [T.tanks - 0.1, hop(0)[0], "power2.inOut"],
    [T.artillery + 0.05, hop(0)[0]],
    [T.artillery + 0.55, hop(1)[0], "power2.inOut"],
    [T.air, hop(1)[0]],
    [T.air + 0.6, hop(2)[0], "power2.inOut"],
  ]);
  const sy = kf(t, [
    [T.strike - 0.2, cy + 380],
    [T.tanks - 0.1, hop(0)[1], "power2.inOut"],
    [T.artillery + 0.05, hop(0)[1]],
    [T.artillery + 0.55, hop(1)[1], "power2.inOut"],
    [T.air, hop(1)[1]],
    [T.air + 0.6, hop(2)[1], "power2.inOut"],
  ]);
  const sRot = kf(t, [
    [T.strike - 0.2, -60],
    [T.tanks - 0.3, -80],
    [T.artillery + 0.05, -80],
    [T.artillery + 0.3, 200],
    [T.air, 200],
    [T.air + 0.3, 70],
  ]);

  // phase B: battlefield grid
  const bA = win(t, T.helped - 0.2, T.not + 0.5, 0.5, 0.6);
  const smallP = prog(t, T.small - 0.4, T.small + 0.5, "back.out(1.6)");

  return (
    <g>
      {aA > 0 && (
        <g opacity={aA}>
          {TARGETS.map((tg, i) => {
            const appear = prog(t, T.armenian + i * 0.25, T.armenian + i * 0.25 + 0.5, "back.out(2)");
            const lock = prog(t, tg.t - 0.1, tg.t + 0.6, "none");
            const x = cx + tg.dx;
            const y = cy + tg.dy;
            return (
              <g key={tg.label}>
                <g opacity={appear} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * appear})`}>
                  {tg.kind === "tank" && <TankTop s={tg.s} r={tg.r} />}
                  {tg.kind === "gun" && <HowitzerTop s={tg.s} r={tg.r} />}
                  {tg.kind === "sam" && <SAMTop s={tg.s} r={tg.r} />}
                </g>
                {lock > 0 && <Reticle x={x} y={y} size={200} lock={lock * 1.7} color={C.red} opacity={clamp01(lock * 4)} />}
                <Tag x={x} y={y + 150} text={tg.label} p={prog(t, tg.t, tg.t + 0.7, "none")} accent={C.red} size={34} />
              </g>
            );
          })}
          {/* sensor beam from recon drone to the most recent target */}
          {(() => {
            const idx: number = t >= T.air ? 2 : t >= T.artillery ? 1 : t >= T.tanks - 0.2 ? 0 : -1;
            if (idx < 0) return null;
            const tx = cx + TARGETS[idx].dx;
            const ty = cy + TARGETS[idx].dy;
            const a = Math.atan2(ty - ry, tx - rx);
            const px = Math.cos(a + Math.PI / 2) * 70;
            const py = Math.sin(a + Math.PI / 2) * 70;
            return <path d={`M${rx},${ry} L${tx + px},${ty + py} L${tx - px},${ty - py}Z`} fill={C.cyan} opacity={0.16} />;
          })()}
          <ReconDroneTop x={rx} y={ry} r={rHead} s={1.05} opacity={reconIn} />
          {t > T.strike - 0.2 && <LoiterTop x={sx} y={sy} r={sRot} s={0.9} />}
        </g>
      )}

      {bA > 0 && (
        <g opacity={bA}>
          {CELLS.map((cell) => {
            const on = prog(t, T.completely + cell.d / 700, T.completely + cell.d / 700 + 0.35, "power2.out");
            if (on <= 0) return null;
            const hot = rnd(cell.i, 5) > 0.84;
            const scan = hot ? 0.18 + 0.12 * Math.sin(t * 5 + cell.i) : 0;
            return (
              <path
                key={cell.i}
                d={hexD}
                transform={`translate(${cx + cell.x} ${cy + cell.y}) scale(${0.5 + on * 0.5})`}
                fill={hot ? C.amber : "none"}
                fillOpacity={scan}
                stroke={C.cream}
                strokeOpacity={0.45 * on}
                strokeWidth={2}
              />
            );
          })}
          {CELLS.filter((cell) => rnd(cell.i, 9) > 0.9).map((cell, k) => {
            const t0 = T.completely + cell.d / 700 + 0.3;
            const on = prog(t, t0, t0 + 0.4, "back.out(2)");
            const spotted = prog(t, t0 + 0.7, t0 + 1.1, "none");
            return on > 0 ? (
              <g key={`u${cell.i}`}>
                <TankTop x={cx + cell.x} y={cy + cell.y} s={0.26 * on} r={rnd(k, 3) * 360} />
                {spotted > 0 && <Reticle x={cx + cell.x} y={cy + cell.y} size={70} lock={spotted * 1.5} color={C.red} />}
              </g>
            ) : null;
          })}
          {Array.from({ length: 7 }, (_, k) => {
            const t0 = T.completely + 0.4 + k * 0.28;
            const on = prog(t, t0, t0 + 0.6, "power2.out");
            if (on <= 0) return null;
            const ang = (k / 7) * Math.PI * 2 + t * 0.35;
            const x = cx + Math.cos(ang) * (300 + 160 * rnd(k, 1));
            const y = cy + Math.sin(ang) * (170 + 90 * rnd(k, 2));
            return (
              <g key={`d${k}`} opacity={on}>
                <circle cx={x} cy={y} r={90} fill={C.cyan} opacity={0.08} />
                <circle cx={x} cy={y} r={90} fill="none" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2} strokeDasharray="6 8" />
                <LoiterTop x={x} y={y} r={(ang * 180) / Math.PI + 180} s={0.42} />
              </g>
            );
          })}
          {(() => {
            // one small drone patrols the terrain from "helped", flagged when "small" is said
            const a = win(t, T.helped - 0.1, T.works + 0.4, 0.4, 0.5);
            if (a <= 0) return null;
            const ang = (t - T.helped) * 1.05 - 1.2;
            const x = cx + Math.cos(ang) * 330;
            const y = cy + Math.sin(ang) * 170;
            const heading = (Math.atan2(Math.cos(ang) * 170, -Math.sin(ang) * 330) * 180) / Math.PI + 90;
            const flag = 1 + 0.35 * smallP * (1 - prog(t, T.small + 0.5, T.completely, "power2.inOut"));
            return (
              <g opacity={a}>
                <ellipse cx={cx} cy={cy} rx={330} ry={170} fill="none" stroke={C.amber} strokeOpacity={0.35} strokeWidth={3} strokeDasharray="12 12" strokeDashoffset={-t * 40} />
                <circle cx={x} cy={y} r={110 * flag} fill={C.cyan} opacity={0.1} />
                <circle cx={x} cy={y} r={110 * flag} fill="none" stroke={C.amber} strokeWidth={4} strokeDasharray="10 8" />
                <LoiterTop x={x} y={y} r={heading} s={0.7 * flag} />
              </g>
            );
          })()}
        </g>
      )}
    </g>
  );
};
