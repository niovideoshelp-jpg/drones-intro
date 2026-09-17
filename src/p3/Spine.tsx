import React from "react";
import { C } from "../design";
import { LayerChip } from "../art/p3art";
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

const RAIL_Y = 985;

export const Spine: React.FC<{ show: number }> = ({ show }) => {
  const t = useTime();
  if (show <= 0.01) return null;
  const n = LAYERS.length;
  const w = 300;
  const gap = 12;
  const total = n * w + (n - 1) * gap;
  const x0 = 960 - total / 2 + w / 2;
  return (
    <g opacity={show}>
      {LAYERS.map((l, i) => {
        const p = ease("back.out(1.4)")(clamp01((t - l.t + 0.35) / 0.6));
        if (p <= 0) return null;
        const active = prog(t, l.from, l.from + 0.5) * (1 - prog(t, l.to - 0.4, l.to));
        return <LayerChip key={l.key} x={x0 + i * (w + gap)} y={RAIL_Y} w={w} label={String(i + 1)} index={i + 1} active={active} color={l.color} p={p} />;
      })}
      {LAYERS.map((l, i) => {
        const active = prog(t, l.from, l.from + 0.5) * (1 - prog(t, l.to - 0.4, l.to));
        if (active < 0.05) return null;
        return (
          <text
            key={`t${l.key}`}
            x={960}
            y={RAIL_Y - 78}
            textAnchor="middle"
            fontFamily="inherit"
            style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600 }}
            fontSize={34}
            fill={l.color}
            opacity={active}
            letterSpacing={2}
          >
            {`LAYER ${i + 1} — ${l.label}`}
          </text>
        );
      })}
    </g>
  );
};
