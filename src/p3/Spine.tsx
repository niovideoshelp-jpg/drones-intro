import React from "react";
import { C, F } from "../design";
import { clamp01, ease, prog, useTime } from "../lib/kf";
import { at } from "./words";

/** The five layers of the defence, introduced once and lit as the narration walks through them. */
export const LAYERS = [
  { key: "info", label: "INFORMATION", t: at("information."), color: C.cyan, from: at("information.") - 0.3, to: at("Then") },
  { key: "ew", label: "ELECTRONIC WAR", t: at("warfare.", 51), color: C.blue, from: at("Then") - 0.2, to: at("When") },
  { key: "guns", label: "GUNS & ROCKETS", t: at("guns"), color: C.green, from: at("When") - 0.2, to: at("Another") },
  { key: "drones", label: "INTERCEPTOR DRONES", t: at("drones.", 133), color: C.amber, from: at("Another") - 0.2, to: at("And", 171) },
  { key: "energy", label: "DIRECTED ENERGY", t: at("weapons.", 177), color: "#9BE8FF", from: at("And", 171) - 0.2, to: at("Which", 241.5) },
  { key: "missiles", label: "EXPENSIVE MISSILES", t: at("missiles", 244.5), color: C.red, from: at("Which", 241.5) - 0.2, to: 999 },
];

/** Bottom of the frame kept for the rail: scenes stay above this line. */
export const RAIL_TOP = 986;
const RAIL_Y = 1018;
const H = 52;
const SMALL = 64;
const WIDE = 400;
const GAP = 12;

/**
 * A compact rail of numbered chips. The active chip widens and carries its own name, so no loose caption line
 * sits between the scene and the rail.
 */
export const Spine: React.FC<{ show: number }> = ({ show }) => {
  const t = useTime();
  if (show <= 0.01) return null;
  const chips = LAYERS.map((l) => {
    const p = ease("back.out(1.4)")(clamp01((t - l.t + 0.35) / 0.6));
    const active = prog(t, l.from, l.from + 0.5) * (1 - prog(t, l.to - 0.4, l.to));
    return { ...l, p, active, w: p > 0 ? SMALL + (WIDE - SMALL) * active : 0 };
  }).filter((c) => c.p > 0);
  const total = chips.reduce((s, c) => s + c.w, 0) + GAP * Math.max(0, chips.length - 1);
  let x = 960 - total / 2;
  return (
    <g opacity={show}>
      {chips.map((c, i) => {
        const x0 = x;
        x += c.w + GAP;
        return (
          <g key={c.key} transform={`translate(${x0} ${RAIL_Y - H / 2})`} opacity={c.p}>
            <rect width={c.w} height={H} rx={10} fill={C.ink} fillOpacity={0.9} stroke={c.color} strokeWidth={3 + 3 * c.active} />
            <rect width={SMALL} height={H} rx={10} fill={c.color} opacity={0.18 + 0.7 * c.active} />
            <text x={SMALL / 2} y={H / 2 + 13} textAnchor="middle" fontFamily={F.anton} fontSize={36} fill={c.active > 0.5 ? C.ink : c.color}>
              {i + 1}
            </text>
            {c.active > 0.35 && (
              <text x={SMALL + 18} y={H / 2 + 10} fontFamily={F.oswald} fontWeight={600} fontSize={27} letterSpacing={1.5} fill={C.cream} opacity={clamp01((c.active - 0.35) / 0.4)}>
                {c.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};
