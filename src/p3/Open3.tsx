import React from "react";
import { C, F } from "../design";
import { NoSign } from "../p2/shared";
import { LaserTurret } from "../art/p3art";
import { PriceTag, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  is: at("Is"),
  unsustainable: at("unsustainable?"),
  no: at("No"),
  single: at("single"),
  technology: at("technology"),
  own: at("own."),
  most: at("most"),
  combining: at("combining"),
  layers: at("layers"),
  using: at("using,"),
  cheapest: at("cheapest"),
  option: at("option"),
  chance: at("chance"),
  success: at("success."),
  first: at("first"),
};
export const OPEN3_RANGE = [0, T.first + 0.6] as const;

const RINGS = [
  { r: 620, color: C.cyan, t: T.combining + 0.1 },
  { r: 520, color: C.blue, t: T.combining + 0.45 },
  { r: 420, color: C.green, t: T.layers - 0.1 },
  { r: 320, color: C.amber, t: T.layers + 0.25 },
  { r: 220, color: C.red, t: T.using + 0.1 },
];

export const Open3: React.FC = () => {
  const t = useTime();
  if (t > OPEN3_RANGE[1]) return null;

  const titleA = win(t, 0, T.combining - 0.1, 0.4, 0.5);
  const titleIn = ease("back.out(1.6)")(clamp01((t - 0.05) / 0.7));
  const curve = prog(t, 0.4, T.unsustainable + 0.8, "power2.inOut");
  const noneA = win(t, T.no - 0.2, T.combining - 0.2, 0.4, 0.4);
  const noneP = ease("back.out(1.5)")(clamp01((t - T.no) / 0.6));
  const cross = prog(t, T.technology, T.own + 0.2, "none");

  const ringsA = win(t, T.combining - 0.3, T.first + 0.4, 0.5, 0.5);
  const cheap = prog(t, T.cheapest - 0.2, T.success + 0.3, "power2.inOut");
  const CX = 960;
  const CY = 560;

  return (
    <Stage>
      {titleA > 0 && (
        <g opacity={titleA}>
          {/* a cost curve that will not stop rising */}
          <g opacity={0.9}>
            <path d="M300,820 L1620,820" stroke={C.cream} strokeWidth={6} strokeLinecap="round" />
            <path d="M300,820 L300,300" stroke={C.cream} strokeWidth={6} strokeLinecap="round" />
            <path
              d={`M300,820 ${Array.from({ length: 26 }, (_, i) => {
                const k = (i / 25) * curve;
                const x = 300 + k * 1320;
                const y = 820 - Math.pow(k, 2.1) * 520;
                return `L${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(" ")}`}
              fill="none"
              stroke={C.red}
              strokeWidth={10}
              strokeLinecap="round"
            />
            {curve > 0.1 && <PriceTag x={330 + curve * 1290} y={800 - Math.pow(curve, 2.1) * 520} text="$$$" size={46} color={C.red} s={clamp01(curve * 2)} />}
          </g>
          <g transform={`translate(960 ${300 - 20 * (1 - titleIn)}) scale(${titleIn})`}>
            <text textAnchor="middle" fontFamily={F.oswald} fontWeight={700} fontSize={82} fill={C.cream} stroke={C.ink} strokeWidth={9} paintOrder="stroke" letterSpacing={2}>
              IS AIR DEFENSE BECOMING
            </text>
            <text y={96} textAnchor="middle" fontFamily={F.anton} fontSize={104} fill={C.red} stroke={C.ink} strokeWidth={10} paintOrder="stroke" letterSpacing={3}>
              UNSUSTAINABLE?
            </text>
          </g>
        </g>
      )}

      {noneA > 0 && (
        <g opacity={noneA}>
          <g transform={`translate(960 640) scale(${0.95 * noneP})`}>
            <circle r={230} fill={C.ink} fillOpacity={0.9} stroke={C.cream} strokeWidth={6} />
            <g transform="translate(0 90) scale(0.85)">
              <LaserTurret beam={0.8} angle={-30} />
            </g>
          </g>
          <NoSign x={960} y={640} p={cross} r={240} />
          <Tag x={960} y={950} text="NO SINGLE TECHNOLOGY" p={prog(t, T.single, T.own + 0.2, "none")} size={40} accent={C.red} />
        </g>
      )}

      {ringsA > 0 && (
        <g opacity={ringsA}>
          {RINGS.map((r, i) => {
            const p = prog(t, r.t, r.t + 0.6, "power2.out");
            if (p <= 0) return null;
            return (
              <g key={i}>
                <path
                  d={`M${CX - r.r},${CY + 40} A${r.r},${r.r * 0.72} 0 0 1 ${CX + r.r},${CY + 40}`}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={10}
                  strokeDasharray={`${2200 * p} 3000`}
                  strokeLinecap="round"
                  opacity={0.9}
                />
                <path d={`M${CX - r.r},${CY + 40} A${r.r},${r.r * 0.72} 0 0 1 ${CX + r.r},${CY + 40}`} fill={r.color} opacity={0.05 * p} />
              </g>
            );
          })}
          <g transform={`translate(${CX} ${CY + 40})`}>
            <circle r={26} fill={C.cream} stroke={C.ink} strokeWidth={5} />
            <circle r={54} fill="none" stroke={C.cream} strokeWidth={3} strokeDasharray="8 10" transform={`rotate(${t * 25})`} />
          </g>
          {/* the cheapest layer that still works, first */}
          {cheap > 0 && (
            <g>
              <PriceTag x={CX - 700 + cheap * 420} y={CY - 160} text="$" size={54} color={C.green} s={clamp01(cheap * 3)} />
              <Pulse x={CX} y={CY + 40} p={prog(t, T.success, T.success + 1, "none")} r={680} color={C.green} width={8} />
              <Tag x={CX} y={200} text="CHEAPEST OPTION THAT STILL WORKS" p={prog(t, T.cheapest, T.option + 0.6, "none")} size={38} accent={C.green} />
            </g>
          )}
        </g>
      )}
    </Stage>
  );
};
