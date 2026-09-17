import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { Big, Factory, FuelDepot, RailLine, Transformer } from "../art/p1art";
import { Explosion, PriceTag, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  but: at("But", 139.5),
  d350: at("$350,000", 140),
  still: at("still", 142),
  bargain: at("bargain"),
  drone: at("drone", 143),
  through: at("through", 144),
  highVoltage: at("high-voltage"),
  transformer: at("transformer,"),
  sets: at("sets"),
  fire: at("fire,", 147.5),
  shuts: at("shuts"),
  line: at("line,"),
  military: at("military", 150),
  factory: at("factory"),
  stop: at("stop"),
  production: at("production."),
  so: at("So", 153),
};
export const DAMAGE_RANGE = [T.but - 0.2, T.so + 0.7] as const;

const CARDS = [
  { key: "tr", x: 300, t0: T.highVoltage, hit: T.transformer, label: "TRANSFORMER" },
  { key: "fuel", x: 740, t0: T.sets, hit: T.fire, label: "FUEL DEPOT" },
  { key: "rail", x: 1180, t0: T.shuts, hit: T.line, label: "RAIL LINE" },
  { key: "fac", x: 1620, t0: T.military, hit: T.stop, label: "MILITARY FACTORY" },
];

export const Damage: React.FC = () => {
  const t = useTime();
  if (t < DAMAGE_RANGE[0] || t > DAMAGE_RANGE[1]) return null;

  const a = win(t, T.but - 0.1, T.so + 0.6, 0.4, 0.6);
  const tagIn = prog(t, T.but - 0.1, T.d350 + 0.2, "power3.out");
  const bargain = prog(t, T.bargain - 0.1, T.bargain + 0.35, "back.out(2.5)");
  const damages = CARDS.filter((c) => t > c.hit).length;
  const tagScale = 1 - 0.07 * damages;
  const tagX = 1150 + (960 - 1150) * tagIn;
  const tagY = 860 + (250 - 860) * tagIn;

  return (
    <Stage>
      <g opacity={a}>
        {/* the price of one successful hit */}
        <g transform={`translate(${tagX} ${tagY + Math.sin(t * 1.5) * 5}) scale(${tagScale})`}>
          <PriceTag x={-259} y={0} text="$350,000" size={104} color={bargain > 0.5 ? C.green : C.amber} />
          {bargain > 0 && (
            <g transform={`translate(440 -60) rotate(-10) scale(${bargain})`}>
              <rect x={-150} y={-44} width={300} height={88} rx={10} fill="none" stroke={C.green} strokeWidth={10} />
              <Big x={0} y={30} text="BARGAIN" size={76} color={C.green} />
            </g>
          )}
          <Pulse x={0} y={0} p={prog(t, T.bargain, T.bargain + 0.9, "none")} r={420} color={C.green} width={8} />
        </g>

        {/* "the drone that got through" crosses toward the targets */}
        {(() => {
          const p = prog(t, T.drone - 0.4, T.through + 0.7, "power1.inOut");
          if (p <= 0 || p >= 1) return null;
          const x = -120 + 2160 * p;
          const y = 520 - Math.sin(p * Math.PI) * 60;
          return (
            <g>
              <path d={`M-120,520 Q${(x - 120) / 2},${460} ${x},${y}`} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="14 10" opacity={0.7} />
              <ShahedTop x={x} y={y} r={90} s={0.34} />
              <circle cx={x} cy={y} r={70 + 6 * Math.sin(t * 8)} fill="none" stroke={C.amber} strokeWidth={6} />
            </g>
          );
        })()}

        {/* what one drone that gets through can do */}
        {CARDS.map((c, i) => {
          const pop = ease("back.out(1.6)")(clamp01((t - c.t0 + 0.45) / 0.55));
          if (pop <= 0) return null;
          const dive = prog(t, c.t0 - 0.25, c.hit, "power2.in");
          const boom = prog(t, c.hit, c.hit + 1.1, "none");
          const y = 690;
          const effect = prog(t, c.hit, c.hit + 0.6, "power2.out");
          return (
            <g key={c.key}>
              <g transform={`translate(${c.x} ${y + (1 - pop) * 80 + Math.sin(t * 1.2 + i) * 4}) scale(${0.84 * pop})`}>
                {c.key === "tr" && <Transformer arc={prog(t, c.hit, c.hit + 1.2, "none")} />}
                {c.key === "fuel" && <FuelDepot fire={effect} />}
                {c.key === "rail" && <RailLine stop={effect} />}
                {c.key === "fac" && <Factory stop={prog(t, T.stop - 0.1, T.production, "power2.out")} />}
              </g>
              {dive > 0 && dive < 1 && <ShahedTop x={c.x - 260 + 260 * dive} y={420 + (y - 60 - 420) * dive} r={135} s={0.2} />}
              {boom > 0 && boom < 1 && <Explosion x={c.x} y={y - 40} p={boom} size={90} seed={70 + i} />}
              <Tag x={c.x} y={y + 190} text={c.label} p={prog(t, c.t0, c.t0 + 0.7, "none")} size={30} accent={C.red} />
            </g>
          );
        })}
      </g>
    </Stage>
  );
};
