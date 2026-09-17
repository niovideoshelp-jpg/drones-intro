import React from "react";
import { C, F } from "../design";
import { ShahedTop } from "../art/drones";
import { JammerMast, LauncherSide, MissileSide } from "../art/ground";
import { Substation } from "../art/targets";
import { Explosion, Hourglass, PriceTag, Pulse, Query, Stopwatch, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, kf, prog, useTime } from "../lib/kf";
import { at } from "../lib/words";

const T = {
  he: at("He", 115.8),
  few: at("few", 116),
  minutes: at("minutes"),
  decide: at("decide"),
  sometimes: at("sometimes"),
  only: at("only", 119),
  seconds: at("seconds."),
  he2: at("He", 120.5),
  fire: at("fire", 121),
  missile: at("missile"),
  costs: at("costs"),
  million: at("million"),
  dollars: at("dollars"),
  drone: at("drone.", 125),
  wait: at("wait"),
  cheaper: at("cheaper"),
  intercept: at("intercept", 128),
  take: at("take"),
  risk: at("risk"),
  let: at("let"),
  through: at("through.", 132),
  looking: at("Looking"),
};
export const DECISION_RANGE = [T.he - 0.2, T.looking + 0.7] as const;

const fmt = (sec: number) => {
  const s = Math.max(0, Math.ceil(sec));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/** simple twin-barrel AA gun */
const AAGun: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70,0 L70,0 L50,-30 L-50,-30Z" fill={C.olive} stroke={C.ink} strokeWidth={5} />
    <g transform={`rotate(${-40 + Math.sin(t * 1.5) * 8} 0 -40)`}>
      <rect x={-6} y={-48} width={130} height={10} rx={3} fill={C.steelDark} stroke={C.ink} strokeWidth={4} />
      <rect x={-6} y={-32} width={130} height={10} rx={3} fill={C.steelDark} stroke={C.ink} strokeWidth={4} />
    </g>
    <rect x={-34} y={-66} width={68} height={40} rx={8} fill={C.oliveDark} stroke={C.ink} strokeWidth={5} />
  </g>
);

export const Decision: React.FC = () => {
  const t = useTime();
  if (t < DECISION_RANGE[0] || t > DECISION_RANGE[1]) return null;

  /* ---------- stopwatch ---------- */
  const swIn = ease("back.out(1.6)")(clamp01((t - T.he - 0.1) / 0.6));
  const alarm = prog(t, T.only - 0.05, T.only + 0.2, "none");
  const dock = prog(t, T.he2 - 0.1, T.fire + 0.2, "power3.inOut");
  const remaining = t < T.only ? 180 - Math.max(0, t - T.minutes) * 24 : 8 - Math.max(0, t - T.only) * 0.85;
  const frac = t < T.only ? ((180 - remaining) / 60) % 1 : (8 - remaining) / 60 + (t - T.only) * 0.015;
  const swX = 960;
  const swY = 560 + (140 - 560) * dock;
  const swS = (0.9 * swIn) * (1 - 0.8 * dock);
  const beat = alarm > 0 ? 1 + Math.max(0, Math.sin((t - T.only) * Math.PI * 2)) * 0.03 : 1;
  const leaveAll = prog(t, T.looking - 0.2, T.looking + 0.6, "power3.in");

  /* ---------- options ---------- */
  const colIn = (t0: number) => ease("back.out(1.5)")(clamp01((t - t0 + 0.2) / 0.6));
  const o1 = colIn(T.fire);
  const shift1 = prog(t, T.wait - 0.55, T.wait + 0.15, "power3.inOut");
  const o2 = colIn(T.wait);
  const o3 = colIn(T.take);

  // option 1: fire
  const launch = prog(t, T.missile, T.drone + 0.1, "power1.in");
  const intercept = prog(t, T.drone + 0.1, T.drone + 1.2, "none");
  const mx = kf(t, [
    [T.missile, 407],
    [T.drone + 0.1, 560, "power1.in"],
  ]);
  const my = kf(t, [
    [T.missile, 600],
    [T.drone + 0.1, 385, "power2.in"],
  ]);
  const mRot = -38 - launch * 17;
  const price = Math.round(ease("power2.out")(prog(t, T.costs, T.dollars + 0.2, "none")) * 1000000);
  const priceText = `$${price.toLocaleString("en-US")}`;

  // option 2: wait
  const flip = kf(t, [
    [T.wait - 0.1, 180],
    [T.wait + 0.4, 360, "back.out(1.5)"],
  ]);
  const sand = 1 - prog(t, T.wait + 0.4, T.looking + 2, "none");
  const cheap = prog(t, T.cheaper - 0.1, T.intercept + 0.3, "back.out(2)");

  // option 3: let it through
  const pass = prog(t, T.let - 0.3, T.through + 0.6, "power1.in");
  const dx = 1500;
  const dy = 360 + pass * 380;
  const impact = prog(t, T.through + 0.6, T.through + 1.6, "none");
  const warn = prog(t, T.risk - 0.1, T.risk + 0.3, "back.out(3)");

  return (
    <Stage>
      <g opacity={1 - leaveAll}>
        {/* column guides */}
        {o2 > 0 && (
          <g stroke={C.cream} strokeOpacity={0.35} strokeWidth={3} strokeDasharray="10 12">
            <path d={`M690,${320} L690,${320 + 560 * clamp01(o2)}`} />
            <path d={`M1230,${320} L1230,${320 + 560 * clamp01(o3)}`} />
          </g>
        )}

        {/* option 1: centred and larger until the second option arrives */}
        {o1 > 0 && (
          <g transform={`translate(${(960 - 420) * (1 - shift1)} ${-30 * (1 - shift1)}) translate(420 600) scale(${1 + 0.22 * (1 - shift1)}) translate(-420 -600)`}>
            <LauncherSide x={400} y={820} s={0.85 * o1} elev={38} />
            {launch > 0 && intercept <= 0 && (
              <g>
                <path d={`M407,600 Q440,470 ${mx},${my}`} fill="none" stroke="#C9C4B8" strokeWidth={14} strokeLinecap="round" opacity={0.5} />
                <MissileSide x={mx} y={my} r={mRot} s={0.5} flame={1} />
              </g>
            )}
            {t < T.drone + 0.4 && <ShahedTop x={560 + Math.sin(t * 2) * 6} y={380} r={-120} s={0.38 * o1} />}
            {intercept > 0 && intercept < 1 && <Explosion x={560} y={385} p={intercept} size={110} seed={21} />}
            <PriceTag x={205} y={915} text={priceText} s={prog(t, T.costs - 0.1, T.costs + 0.3, "back.out(2)")} size={54} color={C.amber} />
          </g>
        )}

        {o1 > 0 && <Tag x={420 + 540 * (1 - shift1)} y={270} text="FIRE" p={prog(t, T.fire, T.fire + 0.5, "none")} size={44} accent={C.red} />}

        {/* option 2 */}
        {o2 > 0 && (
          <g>
            <Tag x={960} y={270} text="WAIT" p={prog(t, T.wait, T.wait + 0.5, "none")} size={44} accent={C.amber} />
            <Hourglass x={960} y={540} s={1.25 * o2} sand={sand} rot={flip} />
            {cheap > 0 && (
              <g>
                <g transform={`translate(790 ${815}) scale(${cheap})`}>
                  <JammerMast s={0.62} />
                  <Query x={64} y={-190} s={0.7} color={C.green} />
                </g>
                <g transform={`translate(1125 ${815}) scale(${cheap})`}>
                  <AAGun x={0} y={0} s={0.85} t={t} />
                  <Query x={16} y={-140} s={0.7} color={C.green} />
                </g>
                <PriceTag x={880} y={915} text="$?" s={cheap} size={54} color={C.green} />
              </g>
            )}
          </g>
        )}

        {/* option 3 */}
        {o3 > 0 && (
          <g>
            <Tag x={1500} y={270} text="LET IT THROUGH" p={prog(t, T.let - 0.1, T.let + 0.6, "none")} size={44} accent={C.blue} />
            <g transform={`translate(1500 840) scale(${0.8 * o3})`}>
              <Substation />
            </g>
            <path d="M1260,590 L1430,590 M1570,590 L1740,590" stroke={C.cyan} strokeWidth={10} strokeDasharray="22 12" opacity={o3} />
            <path d="M1430,565 L1430,615 M1570,565 L1570,615" stroke={C.cyan} strokeWidth={10} opacity={o3} />
            {impact <= 0 && <ShahedTop x={dx} y={dy} r={180} s={0.4 * o3} />}
            {impact > 0 && impact < 1 && <Explosion x={1500} y={740} p={impact} size={140} seed={23} />}
            {warn > 0 && (
              <g transform={`translate(1680 430) scale(${warn * (1.2 + 0.07 * Math.sin(t * 10))})`}>
                <path d="M0,-58 L56,44 L-56,44Z" fill={C.red} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
                <text y={34} textAnchor="middle" fontFamily={F.anton} fontSize={70} fill={C.cream}>
                  !
                </text>
              </g>
            )}
          </g>
        )}
      </g>

      {/* stopwatch (centre, then docked at the top) */}
      {swS > 0.01 && (
        <g opacity={1 - leaveAll}>
          {alarm > 0 && dock < 1 && (
            <>
              <Pulse x={swX} y={swY} p={prog(t, T.only, T.only + 1, "none")} r={420} color={C.red} width={10} />
              <Pulse x={swX} y={swY} p={prog(t, T.seconds, T.seconds + 1, "none")} r={420} color={C.red} width={10} />
            </>
          )}
          <Stopwatch x={swX} y={swY} s={swS * beat} frac={frac} label={fmt(remaining)} alarm={alarm} />
        </g>
      )}
    </Stage>
  );
};
