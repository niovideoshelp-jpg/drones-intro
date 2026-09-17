import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { BallisticMissile, CruiseMissile } from "../art/p1art";
import { RadarScope } from "../art/radar";
import { RadarAESA } from "../art/targets";
import { Query, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, rnd, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  and: at("And", 57.8),
  problem: at("problem"),
  harder: at("harder"),
  mixed: at("mixed"),
  one: at("one."),
  russia: at("Russia,"),
  iran: at("Iran,"),
  operators: at("operators"),
  combine: at("combine"),
  attack: at("attack", 65.5),
  drones: at("drones,", 66),
  decoy: at("decoy"),
  decoys: at("drones,", 67),
  cruise: at("cruise"),
  cruiseM: at("missiles,", 68),
  ballistic: at("ballistic"),
  ballisticM: at("missiles.", 69),
  routes: at("routes,"),
  speeds: at("speeds,"),
  altitudes: at("altitudes."),
  some: at("Some"),
  bait: at("bait"),
  radars: at("radars."),
  others: at("Others"),
  punch: at("punch"),
  hole: at("hole."),
  scenario: at("scenario,"),
  watching: at("watching"),
  dot: at("dot"),
  screen: at("screen"),
  last: at("last"),
  second: at("second"),
  which: at("which"),
  real: at("real"),
  threat: at("threat."),
  cost: at("cost", 89),
};
export const MIXED_RANGE = [T.and - 0.3, T.cost + 0.8] as const;

/** the four threat types, each with its own altitude band and speed */
const TRACKS = [
  { key: "ballistic", t: T.ballisticM, y0: 170, y1: 250, speed: 1.0, color: C.red, label: "BALLISTIC" },
  { key: "cruise", t: T.cruiseM, y0: 430, y1: 470, speed: 0.72, color: C.amber, label: "CRUISE" },
  { key: "attack", t: T.drones, y0: 620, y1: 640, speed: 0.44, color: C.cream, label: "ATTACK DRONES" },
  { key: "decoy", t: T.decoys, y0: 730, y1: 700, speed: 0.5, color: C.steel, label: "DECOYS" },
];

export const Mixed: React.FC = () => {
  const t = useTime();
  if (t < MIXED_RANGE[0] || t > MIXED_RANGE[1]) return null;

  const boardA = win(t, T.and - 0.2, T.scenario + 0.3, 0.5, 0.5);
  const scopeA = win(t, T.scenario - 0.2, T.cost + 0.6, 0.5, 0.5);
  const DEF_X = 1660;
  const GROUND = 880;

  return (
    <Stage>
      {boardA > 0 && (
        <g opacity={boardA}>
          {/* ground + altitude bands */}
          <path d={`M120,${GROUND} L1820,${GROUND}`} stroke={C.cream} strokeWidth={8} strokeLinecap="round" />
          {[250, 470, 660].map((y, i) => (
            <g key={y} opacity={prog(t, T.altitudes - 0.3 + i * 0.1, T.altitudes + 0.3 + i * 0.1)}>
              <path d={`M120,${y} L1820,${y}`} stroke={C.cream} strokeOpacity={0.18} strokeWidth={2} strokeDasharray="10 12" />
            </g>
          ))}
          {/* the defended site and its radar coverage */}
          <g transform={`translate(${DEF_X} ${GROUND}) scale(0.5)`}>
            <RadarAESA plot={false} />
          </g>
          {(() => {
            const p = prog(t, T.and, T.and + 0.8, "power2.out");
            const a0 = Math.PI * 0.62;
            const a1 = Math.PI * 1.02;
            const R = 1180 * p;
            return (
              <path
                d={`M${DEF_X},${GROUND - 60} L${DEF_X + Math.cos(a0) * R},${GROUND - 60 + Math.sin(a0) * R} A${R},${R} 0 0 0 ${DEF_X + Math.cos(a1) * R},${GROUND - 60 + Math.sin(a1) * R}Z`}
                fill={C.cyan}
                opacity={0.07}
                stroke={C.cyan}
                strokeOpacity={0.35}
                strokeWidth={3}
              />
            );
          })()}

          {TRACKS.map((tr, i) => {
            const appear = prog(t, tr.t - 0.4, tr.t + 0.2, "power2.out");
            if (appear <= 0) return null;
            const n = tr.key === "attack" ? 4 : tr.key === "decoy" ? 3 : 2;
            return (
              <g key={tr.key}>
                <Tag x={230} y={tr.y0} text={tr.label} p={prog(t, tr.t, tr.t + 0.6, "none")} size={26} accent={tr.color} />
                {Array.from({ length: n }, (_, k) => {
                  const off = k * 0.16 + rnd(i * 5 + k, 3) * 0.1;
                  const run = clamp01((t - (tr.t + 0.1)) * 0.14 * tr.speed + off);
                  const x = 300 + (DEF_X - 340) * run;
                  const y = tr.y0 + (tr.y1 - tr.y0) * run + (tr.key === "ballistic" ? -Math.sin(run * Math.PI) * 120 : Math.sin(t * 2 + k) * 6);
                  const ghost = tr.key === "decoy";
                  return (
                    <g key={k} opacity={appear * (ghost ? 0.55 : 1)}>
                      <path d={`M300,${tr.y0} Q${(300 + x) / 2},${tr.key === "ballistic" ? tr.y0 - 200 : (tr.y0 + y) / 2} ${x},${y}`} fill="none" stroke={tr.color} strokeWidth={ghost ? 3 : 4} strokeDasharray={ghost ? "6 10" : "12 9"} opacity={0.7} />
                      {tr.key === "ballistic" && <BallisticMissile x={x} y={y} r={110 - run * 40} s={0.22} />}
                      {tr.key === "cruise" && <CruiseMissile x={x} y={y} s={0.3} />}
                      {(tr.key === "attack" || ghost) && <ShahedTop x={x} y={y} r={90} s={0.2} opacity={ghost ? 0.6 : 1} />}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* decoys pulling the radar, and the gap one of them punches */}
          {t > T.bait - 0.2 && (
            <g opacity={win(t, T.bait - 0.2, T.hole + 1.2, 0.3, 0.5)}>
              <path d={`M${DEF_X},${GROUND - 60} L760,710`} stroke={C.steel} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-t * 60} />
              <Tag x={700} y={790} text="BAIT" p={prog(t, T.bait, T.bait + 0.5, "none")} size={26} accent={C.steel} />
            </g>
          )}
          {t > T.punch - 0.2 && (
            <g opacity={win(t, T.punch - 0.2, T.scenario + 0.2, 0.3, 0.4)}>
              <path d={`M1180,600 L1400,600`} stroke={C.red} strokeWidth={10} strokeDasharray="26 18" />
              <Pulse x={1290} y={600} p={prog(t, T.hole, T.hole + 0.9, "none")} r={220} color={C.red} width={8} />
              <Tag x={1290} y={520} text="HOLE" p={prog(t, T.hole, T.hole + 0.5, "none")} size={30} accent={C.red} />
            </g>
          )}
        </g>
      )}

      {scopeA > 0 && (
        <g opacity={scopeA}>
          {(() => {
            const sweep = (t * 110) % 360;
            const blips = Array.from({ length: 14 }, (_, i) => {
              const a = rnd(i, 21) * Math.PI * 2;
              const r = 0.25 + rnd(i, 22) * 0.6;
              const drift = ((t - T.scenario) * 0.02) % 0.3;
              return { x: Math.cos(a) * (r - drift), y: Math.sin(a) * (r - drift), color: i % 5 === 0 ? C.red : C.cream, size: i % 5 === 0 ? 13 : 9, age: 0.25 };
            });
            return <RadarScope x={760} y={540} R={330} sweep={sweep} blips={blips} draw={prog(t, T.scenario - 0.1, T.scenario + 0.6)} />;
          })()}
          {[0, 1, 2].map((k) => {
            const t0 = T.watching + k * 0.6;
            const p = ease("back.out(2)")(clamp01((t - t0) / 0.4));
            return p > 0 ? <Query key={k} x={610 + k * 190} y={330 + (k % 2) * 380} s={0.9 * p} color={C.amber} /> : null;
          })}
          <Tag x={1450} y={330} text="WHICH ONE IS THE REAL THREAT?" p={prog(t, T.which - 0.2, T.threat + 0.4, "none")} size={34} accent={C.red} />
          <g transform="translate(1450 560)">
            <circle r={110} fill="none" stroke={C.red} strokeWidth={8} opacity={0.5} />
            <path
              d={`M0,-110 A110,110 0 ${prog(t, T.scenario, T.threat + 0.5, "none") > 0.5 ? 1 : 0} 1 ${110 * Math.sin(prog(t, T.scenario, T.threat + 0.5, "none") * Math.PI * 2)},${-110 * Math.cos(prog(t, T.scenario, T.threat + 0.5, "none") * Math.PI * 2)}`}
              fill="none"
              stroke={C.red}
              strokeWidth={12}
              strokeLinecap="round"
            />
            <Tag x={0} y={0} text="SECONDS" p={prog(t, T.second - 0.2, T.second + 0.4, "none")} size={30} accent={C.red} />
          </g>
        </g>
      )}
    </Stage>
  );
};
