import React from "react";
import { C, F } from "../design";
import { NoSign } from "../p2/shared";
import { aimTurret, LaserTurret } from "../art/p3art";
import { ShahedTop } from "../art/drones";
import { Lens } from "../art/lens";
import { PriceTag, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { board, clamp01, ease, prog, useTime } from "../lib/kf";
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

  /* the question, the "no", and the layered answer each own the screen in turn */
  const titleB = board(t, 0, T.no + 0.1, { inDur: 0.01 });
  const titleA = titleB.op;
  const titleIn = ease("back.out(1.6)")(clamp01((t - 0.05) / 0.7));
  const curve = prog(t, 0.2, T.no, "power2.inOut");
  const noneB = board(t, T.no - 0.2, T.combining - 0.1, { hits: [T.own + 0.1] });
  const noneA = noneB.op;
  const noneP = ease("back.out(1.5)")(clamp01((t - T.no + 0.1) / 0.6));
  const cross = prog(t, T.technology, T.own + 0.2, "none");

  const ringsB = board(t, T.combining - 0.3, T.first + 0.4);
  const ringsA = ringsB.op;
  const cheap = prog(t, T.cheapest - 0.2, T.success + 0.3, "power2.inOut");
  const CX = 960;
  const CY = 560;

  return (
    <Stage>
      {titleA > 0 && (
        <g opacity={titleA} transform={titleB.tf}>
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
            {curve > 0.1 && <PriceTag x={330 + curve * 1290} y={800 - Math.pow(curve, 2.1) * 520 + Math.sin(t * 2.4) * 8} text="$$$" size={46} color={C.red} s={clamp01(curve * 2)} />}
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
        <g opacity={noneA} transform={noneB.tf}>
          {/* one system alone, in its own landscape, and why it is not enough */}
          <Lens id="none" x={960} y={520} r={230} t={t} s={noneP} ring={C.cream} sky="dusk">
            <LaserTurret x={-60} y={97} s={0.8} beam={cross < 0.6 ? 1 : 0} {...aimTurret(120, -120, -60, 97, 0.8)} />
            <ShahedTop x={120 + Math.sin(t * 2) * 10} y={-120} r={-90} s={0.2} />
            {[0, 1].map((k) => (
              <ShahedTop key={k} x={-40 + ((((t * 0.5 + k * 0.5) % 1) + 1) % 1) * 300} y={-40 - k * 100} r={90} s={0.14} opacity={0.8} />
            ))}
          </Lens>
          <NoSign x={960} y={520} p={cross} r={250} />
          <Tag x={960} y={860} text="NO SINGLE TECHNOLOGY" p={prog(t, T.single, T.own + 0.2, "none")} size={40} accent={C.red} />
        </g>
      )}

      {ringsA > 0 && (
        <g opacity={ringsA} transform={ringsB.tf}>
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
          {/* a sweep crossing every layer, so the stack never sits still */}
          {(() => {
            const k = ((t - T.combining) * 0.4) % 1;
            const a = Math.PI * (1 + (k < 0.5 ? k * 2 : 2 - k * 2));
            return <path d={`M${CX},${CY + 40} L${CX + Math.cos(a) * 640},${CY + 40 + Math.sin(a) * 640 * 0.72}`} stroke={C.cream} strokeWidth={4} opacity={0.35 * prog(t, T.combining, T.combining + 0.6)} />;
          })()}
          <g transform={`translate(${CX} ${CY + 40})`}>
            <circle r={26} fill={C.cream} stroke={C.ink} strokeWidth={5} />
            <circle r={54} fill="none" stroke={C.cream} strokeWidth={3} strokeDasharray="8 10" transform={`rotate(${t * 25})`} />
          </g>
          {/* the cheapest layer that still works, first */}
          {cheap > 0 && (
            <g>
              <PriceTag x={CX - 700 + cheap * 420} y={CY - 160} text="$" size={54} color={C.green} s={clamp01(cheap * 3)} />
              {(() => {
                const q = prog(t, T.success, T.success + 1, "none");
                if (q <= 0 || q >= 1) return null;
                const r = 60 + q * 640;
                return <path d={`M${CX - r},${CY + 40} A${r},${r * 0.72} 0 0 1 ${CX + r},${CY + 40}`} fill="none" stroke={C.green} strokeWidth={8} opacity={1 - q} />;
              })()}
              <Tag x={CX} y={110} text="CHEAPEST OPTION THAT STILL WORKS" p={prog(t, T.cheapest, T.option + 0.6, "none")} size={38} accent={C.green} />
            </g>
          )}
        </g>
      )}
    </Stage>
  );
};
