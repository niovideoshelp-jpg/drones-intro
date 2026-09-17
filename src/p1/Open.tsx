import React from "react";
import { C, F } from "../design";
import { Clipboard, Gear, Pie, Wrench, Big } from "../art/p1art";
import { Interceptor } from "../art/p1art";
import { PriceTag, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, rnd, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  two: at("Two."),
  the: at("The"),
  new: at("New"),
  math: at("Math"),
  of: at("of"),
  air: at("Air"),
  warfare: at("Warfare"),
  exact: at("Exact"),
  prices: at("prices"),
  transparent: at("transparent."),
  they: at("They"),
  version: at("version,"),
  contract: at("contract,"),
  maintenance: at("maintenance"),
  pkg: at("package,"),
  split: at("split"),
  development: at("development"),
  costs: at("costs."),
  so: at("So"),
};
export const OPEN_END = T.so + 0.6;

const TITLE = [
  ["THE", T.the],
  ["NEW", T.new],
  ["MATH", T.math],
  ["OF", T.of],
  ["AIR", T.air],
  ["WARFARE", T.warfare],
] as const;

const FACTORS = [
  { key: "version", t: T.version, x: 470, y: 330, label: "VERSION" },
  { key: "contract", t: T.contract, x: 1450, y: 330, label: "CONTRACT SIZE" },
  { key: "maint", t: T.maintenance, x: 470, y: 780, label: "MAINTENANCE" },
  { key: "rnd", t: T.split, x: 1450, y: 780, label: "DEVELOPMENT COSTS" },
];

export const Open: React.FC = () => {
  const t = useTime();
  if (t > OPEN_END) return null;

  const up = prog(t, T.exact - 0.2, T.exact + 0.5, "power3.inOut");
  const out = prog(t, T.so - 0.2, T.so + 0.5, "power3.in");
  const numP = ease("back.out(2.2)")(clamp01((t - T.two + 0.1) / 0.5));
  const tagIn = ease("back.out(1.8)")(clamp01((t - T.exact - 0.1) / 0.6));
  const scramble = (seed: number) => {
    const rate = t < T.they ? 18 : 6;
    const d = Array.from({ length: 7 }, (_, i) => Math.floor(rnd(Math.floor(t * rate) * 13 + i * 7, seed) * 10)).join("");
    return `$${d[0]},${d.slice(1, 4)},${d.slice(4)}`;
  };
  const redact = prog(t, T.transparent - 0.2, T.transparent + 0.4, "power2.out");
  const tagY = 560 - 20 * up;

  // title block: centred big, then parked small at the top
  const ty = 470 - 330 * up;
  const ts = 1 - 0.55 * up;

  return (
    <Stage>
      <g opacity={1 - out}>
        <g transform={`translate(960 ${ty}) scale(${ts})`}>
          <g transform={`translate(0 -150) scale(${numP})`} opacity={clamp01(numP * 2)}>
            <circle r={120} fill={C.ink} stroke={C.amber} strokeWidth={10} />
            <circle r={140} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="10 10" transform={`rotate(${t * 30})`} />
            <Big x={0} y={78} text="2" size={220} color={C.amber} />
          </g>
          {(() => {
            let x = -740;
            return TITLE.map(([w, tw]) => {
              const width = w.length * 58 + 34;
              const p = prog(t, tw - 0.08, tw + 0.35, "back.out(2)");
              const cx = x + width / 2;
              x += width;
              return (
                <g key={w} transform={`translate(${cx} ${110 + (1 - p) * 40})`} opacity={clamp01(p * 1.5)}>
                  {w === "MATH" && <rect x={-width / 2 + 6} y={24} width={(width - 12) * prog(t, tw + 0.2, tw + 0.7, "power2.out")} height={16} fill={C.amber} />}
                  <text textAnchor="middle" fontFamily={F.oswald} fontWeight={700} fontSize={108} fill={C.cream} stroke={C.ink} strokeWidth={9} paintOrder="stroke" letterSpacing={2}>
                    {w}
                  </text>
                </g>
              );
            });
          })()}
        </g>

        {/* price that nobody can read exactly */}
        {tagIn > 0 && (
          <g transform={`translate(960 ${tagY}) scale(${tagIn})`}>
            <PriceTag x={-354} y={0} text={scramble(3)} size={120} color={C.amber} />
            {redact > 0 &&
              [0, 1, 2].map((i) => (
                <rect key={i} x={-205 + i * 190} y={-50} width={170 * clamp01(redact * 3 - i)} height={100} fill={C.ink} opacity={0.88} />
              ))}
            <Pulse x={0} y={0} p={prog(t, T.transparent, T.transparent + 0.9, "none")} r={420} color={C.amber} width={8} />
          </g>
        )}

        {/* what moves the price */}
        {FACTORS.map((f, i) => {
          const p = ease("back.out(1.7)")(clamp01((t - f.t + 0.15) / 0.55));
          if (p <= 0) return null;
          const tx = 960 + (f.x < 960 ? -250 : 250);
          const ty2 = tagY + (f.y < 540 ? -40 : 40);
          const flow = prog(t, f.t, f.t + 0.6, "power2.out");
          return (
            <g key={f.key}>
              <path d={`M${f.x},${f.y} L${f.x + (tx - f.x) * flow},${f.y + (ty2 - f.y) * flow}`} stroke={C.cream} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-t * 50} opacity={0.7} />
              <g transform={`translate(${f.x} ${f.y + Math.sin(t * 1.6 + i) * 6}) scale(${p})`}>
                <circle r={130} fill={C.ink} fillOpacity={0.9} stroke={C.amber} strokeWidth={6} />
                {f.key === "version" && (
                  <g>
                    <Interceptor kind="aim120" y={-50} s={0.62} />
                    <Interceptor kind="pac3" y={0} s={0.46} />
                    <Interceptor kind="thaad" y={50} s={0.4} />
                  </g>
                )}
                {f.key === "contract" && <Clipboard s={0.42} pages={clamp01((t - f.t) / 1.2) * 3} sign={prog(t, f.t + 0.2, f.t + 1.2)} />}
                {f.key === "maint" && (
                  <g>
                    <Gear x={-30} y={10} s={0.9} spin={t * 60} />
                    <Wrench x={40} y={0} s={0.6} r={35 + Math.sin(t * 3) * 10} />
                  </g>
                )}
                {f.key === "rnd" && <Pie s={0.95} split={prog(t, T.split, T.costs, "back.out(2)")} />}
              </g>
              <Tag x={f.x} y={f.y + 170} text={f.label} p={prog(t, f.t, f.t + 0.7, "none")} size={30} accent={C.amber} />
            </g>
          );
        })}
      </g>
      {win(t, T.two - 0.05, T.two + 0.8, 0.05, 0.6) > 0 && <Pulse x={960} y={320} p={prog(t, T.two, T.two + 0.8, "none")} r={300} color={C.amber} width={10} />}
    </Stage>
  );
};
