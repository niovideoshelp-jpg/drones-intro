import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { Interceptor, Big } from "../art/p1art";
import { DocPage, PriceTag, Pulse, StrikeLine, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  so: at("So"),
  pub: at("public"),
  numbers: at("numbers"),
  ballpark: at("ballpark"),
  figures: at("figures,"),
  not: at("not", 19),
  fixed: at("fixed"),
  tags: at("tags."),
  even: at("Even", 20),
  gap: at("gap"),
  obvious: at("obvious."),
  estimates: at("Estimates"),
  csis: at("CSIS"),
  reuters: at("Reuters"),
  shahed: at("Shahed-type"),
  drone: at("drone", 27.5),
  d20: at("$20,000"),
  d50: at("$50,000."),
  widely: at("widely"),
  russian: at("Russian"),
  called: at("called"),
  geran: at("Geran"),
  d35: at("$35,000."),
  meanwhile: at("Meanwhile,"),
};
export const ESTIMATES_RANGE = [T.so - 0.2, T.meanwhile + 0.7] as const;

const AX0 = 460;
const AX1 = 1460;
const AY = 640;

export const Estimates: React.FC = () => {
  const t = useTime();
  if (t < ESTIMATES_RANGE[0] || t > ESTIMATES_RANGE[1]) return null;

  /* ---- ballpark axis ---- */
  const axisA = win(t, T.so - 0.1, T.even + 0.4, 0.4, 0.5);
  const axisP = prog(t, T.so, T.pub + 0.4, "power2.out");
  const band = prog(t, T.ballpark - 0.1, T.figures + 0.3, "back.out(1.6)");
  const breathe = 1 + 0.06 * Math.sin(t * 3);
  const tagP = prog(t, T.fixed - 0.1, T.fixed + 0.3, "back.out(2)");
  const strike = prog(t, T.tags - 0.1, T.tags + 0.3, "power2.out");

  /* ---- the gap ---- */
  const gapA = win(t, T.even - 0.1, T.estimates + 0.1, 0.3, 0.5);
  const big = prog(t, T.gap - 0.4, T.obvious + 0.2, "power3.out");
  const small = prog(t, T.even, T.even + 0.4, "back.out(2)");

  /* ---- estimates ---- */
  const estA = win(t, T.estimates - 0.2, T.meanwhile + 0.6, 0.4, 0.6);
  const cardP = (t0: number) => ease("back.out(1.8)")(clamp01((t - t0 + 0.2) / 0.55));
  const droneP = ease("back.out(1.4)")(clamp01((t - T.shahed + 0.2) / 0.7));
  const flip = prog(t, T.called - 0.1, T.geran + 0.1, "power2.inOut");
  const flipX = Math.cos(flip * Math.PI);
  const isGeran = flip > 0.5;
  const rangeP = prog(t, T.d20 - 0.1, T.d50 + 0.1, "power1.inOut");
  const pin = prog(t, T.d35 - 0.3, T.d35 + 0.2, "bounce.out");
  const leave = prog(t, T.meanwhile - 0.2, T.meanwhile + 0.6, "power3.in");
  const RX0 = 560;
  const RX1 = 1360;
  const RY = 900;
  const x35 = RX0 + ((35 - 20) / 30) * (RX1 - RX0);

  return (
    <Stage>
      {axisA > 0 && (
        <g opacity={axisA}>
          <path d={`M${AX0},${AY} L${AX0 + (AX1 - AX0) * axisP},${AY}`} stroke={C.cream} strokeWidth={8} strokeLinecap="round" />
          {Array.from({ length: 11 }, (_, i) => {
            const x = AX0 + i * 100;
            const p = prog(t, T.numbers - 0.2 + i * 0.05, T.numbers + 0.2 + i * 0.05, "back.out(2)");
            return <path key={i} d={`M${x},${AY} L${x},${AY + (i % 5 === 0 ? 40 : 22) * p}`} stroke={C.cream} strokeWidth={5} />;
          })}
          {band > 0 && (
            <g>
              <defs>
                <linearGradient id="ballpark" x1="0" x2="1">
                  <stop offset="0" stopColor={C.amber} stopOpacity={0} />
                  <stop offset="0.5" stopColor={C.amber} stopOpacity={0.75} />
                  <stop offset="1" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <rect x={960 - 280 * band * breathe} y={AY - 60} width={560 * band * breathe} height={120} fill="url(#ballpark)" />
              <Big x={960} y={AY - 110} text="≈" size={170 * band} color={C.amber} />
            </g>
          )}
          {tagP > 0 && (
            <g>
              <path d={`M960,${AY - 20} L960,${AY - 170}`} stroke={C.ink} strokeWidth={5} opacity={tagP} />
              <PriceTag x={940} y={AY - 230} text="$" size={80} s={tagP} color={C.cream} r={-8} />
            </g>
          )}
          <StrikeLine x1={880} y1={AY - 320} x2={1110} y2={AY - 130} p={strike} width={16} />
          <StrikeLine x1={1110} y1={AY - 320} x2={880} y2={AY - 130} p={strike} width={16} />
        </g>
      )}

      {gapA > 0 && (
        <g opacity={gapA}>
          <path d="M560,880 L1360,880" stroke={C.cream} strokeWidth={6} strokeLinecap="round" />
          <rect x={690} y={880 - 26 * small} width={140} height={26 * small} fill={C.amber} stroke={C.ink} strokeWidth={4} />
          <ShahedTop x={760} y={790} s={0.3 * small} r={-90} />
          <rect x={1090} y={880 - 540 * big} width={140} height={540 * big} fill={C.red} stroke={C.ink} strokeWidth={4} />
          <rect x={1100} y={880 - 540 * big} width={30} height={540 * big} fill="#fff" opacity={0.2} />
          <g transform={`translate(1160 ${880 - 540 * big - 150}) rotate(-90)`} opacity={big}>
            <Interceptor kind="pac3" s={0.55} />
          </g>
          {big > 0.8 && (
            <g opacity={prog(t, T.gap, T.obvious)}>
              <path d={`M930,850 L930,${340 + 20}`} stroke={C.cream} strokeWidth={6} strokeDasharray="12 8" />
              <path d="M910,370 L930,340 L950,370 M910,826 L930,856 L950,826" stroke={C.cream} strokeWidth={6} fill="none" />
              <Pulse x={930} y={600} p={prog(t, T.obvious, T.obvious + 0.9, "none")} r={300} color={C.cream} width={8} />
            </g>
          )}
        </g>
      )}

      {estA > 0 && (
        <g opacity={estA}>
          {/* sources */}
          {[
            { x: 640, t0: T.estimates + 0.1, label: "CSIS", tl: T.csis, tab: C.blue },
            { x: 1280, t0: T.estimates + 0.35, label: "REUTERS", tl: T.reuters, tab: C.amber },
          ].map((c, i) => {
            const p = cardP(c.t0) * (1 - leave);
            return p > 0 ? (
              <g key={i}>
                <DocPage x={c.x} y={200 + Math.sin(t * 1.4 + i) * 5} s={0.36 * p} r={i ? 6 : -6} lines={prog(t, c.t0, c.t0 + 1)} chart={prog(t, c.t0 + 0.3, c.t0 + 1.5)} tab={c.tab} />
                <Tag x={c.x} y={318} text={c.label} p={prog(t, c.tl - 0.05, c.tl + 0.5, "none") * (1 - leave)} size={34} accent={c.tab} />
              </g>
            ) : null;
          })}

          {/* the drone */}
          {droneP > 0 && (
            <g transform={`translate(960 ${590 + Math.sin(t * 1.6) * 6}) scale(${droneP * (1 - leave * 0.6)}) scale(${Math.max(0.03, Math.abs(flipX))} 1)`} opacity={1 - leave}>
              <ShahedTop s={0.92} tone={isGeran ? "#4A504E" : "#C9CCC8"} />
            </g>
          )}
          <Tag x={690} y={600} text="SHAHED-TYPE" p={prog(t, T.drone - 0.1, T.drone + 0.6, "none") * (1 - flip) * (1 - leave)} size={34} accent={C.red} anchor="end" />
          <Tag x={1230} y={600} text="GERAN-2" p={prog(t, T.geran, T.geran + 0.5, "none") * (1 - leave)} size={40} accent={C.red} anchor="start" />

          {/* price range */}
          {rangeP > 0 && (
            <g opacity={1 - leave}>
              <path d={`M${RX0},${RY} L${RX1},${RY}`} stroke={C.ink} strokeWidth={30} strokeLinecap="round" />
              <path d={`M${RX0},${RY} L${RX0 + (RX1 - RX0) * rangeP},${RY}`} stroke={C.amber} strokeWidth={20} strokeLinecap="round" />
              <circle cx={RX0} cy={RY} r={18} fill={C.cream} stroke={C.ink} strokeWidth={5} />
              {rangeP >= 1 && <circle cx={RX1} cy={RY} r={18} fill={C.cream} stroke={C.ink} strokeWidth={5} />}
              <Big x={RX0} y={RY + 78} text="$20,000" size={54} opacity={prog(t, T.d20 - 0.1, T.d20 + 0.2)} />
              <Big x={RX1} y={RY + 78} text="$50,000" size={54} opacity={prog(t, T.d50 - 0.1, T.d50 + 0.2)} />
              {pin > 0 && (
                <g transform={`translate(${x35} ${RY - 30 - (1 - pin) * 120})`}>
                  <path d="M-24,-40 L24,-40 L0,0Z" fill={C.red} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
                  <Big x={0} y={-60} text="$35,000" size={70} color={C.amber} />
                </g>
              )}
            </g>
          )}
        </g>
      )}
    </Stage>
  );
};

