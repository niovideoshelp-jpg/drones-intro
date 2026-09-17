import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { AirBase, AmmoDepot, Field, RadarAESA, Substation } from "../art/targets";
import { Pulse, Query, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime } from "../lib/kf";
import { at } from "../lib/words";

const T = {
  importantly: at("importantly,"),
  know: at("know", 103),
  trying: at("trying"),
  hit: at("hit."),
  empty: at("empty"),
  power: at("power"),
  ammunition: at("ammunition"),
  airbase: at("airbase,"),
  radar: at("radar", 112),
  protecting: at("protecting"),
  entire: at("entire"),
  region: at("region."),
  he: at("He", 115.8),
};
export const TARGETS_RANGE = [T.importantly + 0.1, T.he + 0.7] as const;

const HUB = { x: 960, y: 420 };
const DRONE = { x: 960, y: 190 };
const S = 0.74;

const SLOTS = [
  { key: "field", x: 250, y: 770, top: 650, t: T.empty, label: "EMPTY FIELD", C: Field },
  { key: "sub", x: 605, y: 800, top: 650, t: T.power, label: "POWER SUBSTATION", C: Substation },
  { key: "radar", x: 960, y: 790, top: 590, t: T.radar, label: "RADAR", C: RadarAESA },
  { key: "ammo", x: 1315, y: 800, top: 690, t: T.ammunition, label: "AMMO DEPOT", C: AmmoDepot },
  { key: "air", x: 1670, y: 770, top: 690, t: T.airbase, label: "AIR BASE", C: AirBase },
];

export const Targets: React.FC = () => {
  const t = useTime();
  if (t < TARGETS_RANGE[0] || t > TARGETS_RANGE[1]) return null;

  const droneIn = ease("expo.out")(clamp01((t - T.importantly - 0.3) / 0.9));
  const leave = prog(t, T.he - 0.45, T.he + 0.15, "power3.in");
  const path = prog(t, T.know - 0.1, T.trying + 0.2, "power2.inOut");
  const branch = prog(t, T.hit - 0.1, T.hit + 0.6, "power2.out");
  const dome = prog(t, T.protecting - 0.1, T.region + 0.3, "power2.out");
  const hover = Math.sin(t * 2.4) * 8;

  return (
    <Stage>
      <g opacity={1 - leave} transform={`translate(960 ${540 + leave * 140}) scale(${1 - leave * 0.25}) translate(-960 -540)`}>
        {/* unknown-target placeholders, filled in as each target is named */}
        {SLOTS.map((sl, i) => {
          const ghost = prog(t, T.importantly + 0.35 + i * 0.12, T.importantly + 0.85 + i * 0.12, "back.out(2)");
          const filled = prog(t, sl.t - 0.15, sl.t + 0.2);
          const a = ghost * (1 - filled);
          if (a <= 0) return null;
          const k = S * (0.85 + 0.15 * ghost);
          return (
            <g key={`g${sl.key}`} opacity={a}>
              <path
                d={`M${sl.x},${sl.y - 110 * k} L${sl.x + 190 * k},${sl.y} L${sl.x},${sl.y + 110 * k} L${sl.x - 190 * k},${sl.y}Z`}
                fill={C.ink}
                fillOpacity={0.55}
                stroke={C.cream}
                strokeOpacity={0.6}
                strokeWidth={4}
                strokeDasharray="14 10"
                strokeDashoffset={-t * 30}
              />
              <Query x={sl.x} y={sl.y - 10 + Math.sin(t * 2.2 + i) * 6} s={0.9} color={C.cream} />
            </g>
          );
        })}
        {/* protective dome from the radar */}
        {dome > 0 && (
          <g>
            <path
              d={`M${960 - 900 * dome},900 A${900 * dome},${430 * dome} 0 0 1 ${960 + 900 * dome},900`}
              fill={C.cyan}
              fillOpacity={0.12}
              stroke={C.cyan}
              strokeWidth={6}
              strokeDasharray="22 12"
              strokeDashoffset={-t * 40}
            />
            {[0.72, 0.45].map((k) => (
              <path key={k} d={`M${960 - 900 * dome * k},900 A${900 * dome * k},${430 * dome * k} 0 0 1 ${960 + 900 * dome * k},900`} fill="none" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={3} />
            ))}
          </g>
        )}

        {/* projected path: drone -> hub -> five possible targets */}
        {path > 0 && (
          <g>
            <path d={`M${DRONE.x},${DRONE.y + 130} L${HUB.x},${DRONE.y + 130 + (HUB.y - DRONE.y - 130) * path}`} stroke={C.red} strokeWidth={6} strokeDasharray="16 10" strokeDashoffset={-t * 50} />
          </g>
        )}
        {branch > 0 &&
          SLOTS.map((sl) => {
            const on = prog(t, sl.t - 0.1, sl.t + 0.4);
            const ex = HUB.x + (sl.x - HUB.x) * branch;
            const ey = HUB.y + (sl.top - HUB.y) * branch;
            return (
              <path
                key={sl.key}
                d={`M${HUB.x},${HUB.y} L${ex},${ey}`}
                stroke={on > 0 ? C.red : C.cream}
                strokeOpacity={0.45 + 0.55 * on}
                strokeWidth={on > 0 ? 6 : 4}
                strokeDasharray="14 10"
                strokeDashoffset={-t * 50}
              />
            );
          })}
        {branch > 0 && (
          <circle cx={HUB.x} cy={HUB.y} r={16} fill={C.red} stroke={C.ink} strokeWidth={4} />
        )}
        {prog(t, T.trying - 0.2, T.trying + 0.3) > 0 && (
          <Query x={HUB.x + 80} y={HUB.y - 20} s={ease("back.out(2.5)")(clamp01((t - T.trying + 0.2) / 0.45)) * 1.1} color={C.red} />
        )}

        {/* targets */}
        {SLOTS.map((sl) => {
          const pop = ease("back.out(1.8)")(clamp01((t - sl.t + 0.15) / 0.55));
          if (pop <= 0) return null;
          return (
            <g key={sl.key}>
              <g transform={`translate(${sl.x} ${sl.y + (1 - pop) * 60}) scale(${S * pop})`}>
                <sl.C />
              </g>
              <circle cx={sl.x} cy={sl.top} r={10} fill={C.red} stroke={C.ink} strokeWidth={3} opacity={pop} />
              <Pulse x={sl.x} y={sl.top} p={prog(t, sl.t, sl.t + 0.8, "none")} r={80} color={C.red} width={5} />
              <Tag x={sl.x} y={sl.y + 130} text={sl.label} p={prog(t, sl.t, sl.t + 0.7, "none")} size={26} accent={sl.key === "radar" ? C.cyan : C.red} />
            </g>
          );
        })}

        {/* the incoming drone */}
        <g transform={`translate(${DRONE.x} ${DRONE.y - (1 - droneIn) * 300 + hover}) rotate(180) scale(${0.72 * droneIn + 0.001})`}>
          <ShahedTop />
        </g>
        <path d={`M${DRONE.x},0 L${DRONE.x},${DRONE.y - 120}`} stroke={C.red} strokeWidth={4} strokeDasharray="8 10" opacity={0.6 * droneIn} strokeDashoffset={t * 40} />
      </g>
    </Stage>
  );
};
