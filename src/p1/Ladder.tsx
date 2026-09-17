import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { LauncherSide } from "../art/ground";
import { BallisticMissile, Big, FighterJet, Interceptor, NasamsLauncher } from "../art/p1art";
import { DocPage, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  meanwhile: at("Meanwhile,"),
  aim: at("AIM-120"),
  airToAir: at("air-to-air"),
  used: at("used", 41),
  fighter: at("fighter"),
  jets: at("jets"),
  adapted: at("adapted"),
  ground: at("ground"),
  nasams: at("NASAMS"),
  around: at("around", 46),
  m1: at("$1"),
  million1: at("million", 47),
  recent: at("recent"),
  estimates: at("estimates.", 49),
  comparison: at("by comparison,"),
  patriot: at("Patriot"),
  pac3: at("PAC-3"),
  interceptor: at("interceptor,"),
  m4: at("$4"),
  million4: at("million,", 55.8),
  thaad: at("THAAD,"),
  ballistic: at("ballistic"),
  missiles: at("missiles,", 60),
  m13: at("$13"),
  million13: at("million.", 62),
  now: at("Now,"),
};
export const LADDER_RANGE = [T.meanwhile - 0.2, T.now + 1.0] as const;

const BASE = 880;
const PX_PER_M = 600 / 13;
const COLS = [
  { x: 1110, value: 0.035, label: "SHAHED", text: "$35K", t: T.meanwhile + 0.3, accent: C.amber },
  { x: 1290, value: 1, label: "AIM-120", text: "$1M", t: T.million1, accent: C.red },
  { x: 1470, value: 4, label: "PAC-3 MSE", text: "$4M", t: T.million4, accent: C.red },
  { x: 1650, value: 13, label: "THAAD", text: "$13M+", t: T.million13, accent: C.red },
];

const HERO = { x: 520, y: 390 };

export const Ladder: React.FC = () => {
  const t = useTime();
  if (t < LADDER_RANGE[0] || t > LADDER_RANGE[1]) return null;
  const out = prog(t, T.now - 0.1, T.now + 0.8, "power3.in");
  const chartIn = prog(t, T.meanwhile - 0.1, T.meanwhile + 0.6, "power2.out");
  const hover = Math.sin(t * 2) * 8;

  /** hero missile: pops at t0, flies into its column between t1 and t2 */
  const heroMissile = (kind: "aim120" | "pac3" | "thaad", t0: number, t1: number, t2: number, col: (typeof COLS)[number], s: number) => {
    const pop = ease("back.out(1.6)")(clamp01((t - t0 + 0.1) / 0.5));
    if (pop <= 0 || t > t2 + 0.05) return null;
    const fly = prog(t, t1, t2, "power2.in");
    const topY = BASE - col.value * PX_PER_M;
    const x = HERO.x + (col.x - HERO.x) * fly;
    const y = HERO.y + hover * (1 - fly) + (topY - 40 - HERO.y) * fly;
    return (
      <g transform={`translate(${x} ${y}) rotate(${-90 * fly}) scale(${s * pop * (1 - 0.7 * fly)})`}>
        <Interceptor kind={kind} flame={fly > 0 ? 1 : 0} />
      </g>
    );
  };

  const stage = (t0: number, t1: number) => win(t, t0, t1, 0.35, 0.4);

  return (
    <Stage>
      <g opacity={1 - out} transform={`translate(960 540) scale(${1 - 0.15 * out}) translate(-960 -540)`}>
        {/* ---------------- chart ---------------- */}
        <g opacity={chartIn}>
          <path d={`M1010,${BASE} L1750,${BASE}`} stroke={C.cream} strokeWidth={6} strokeLinecap="round" />
          {[1, 4, 13].map((m) => (
            <path key={m} d={`M1010,${BASE - m * PX_PER_M} L1750,${BASE - m * PX_PER_M}`} stroke={C.cream} strokeOpacity={0.15} strokeWidth={2} strokeDasharray="8 10" />
          ))}
          {COLS.map((c, i) => {
            const grow = i === 0 ? prog(t, c.t, c.t + 0.4, "back.out(2)") : prog(t, c.t - 0.2, c.t + 0.6, "power3.out");
            const h = Math.max(i === 0 ? 5 : 0, c.value * PX_PER_M * grow);
            const shine = 0.15 + 0.1 * Math.sin(t * 3 + i);
            return (
              <g key={c.label}>
                <rect x={c.x - 60} y={BASE - h} width={120} height={h} fill={c.accent} stroke={C.ink} strokeWidth={4} />
                <rect x={c.x - 50} y={BASE - h} width={24} height={h} fill="#fff" opacity={shine * (h > 20 ? 1 : 0)} />
                {grow > 0 && <Big x={c.x} y={BASE - h - 22} text={c.text} size={50} color={i === 0 ? C.amber : C.cream} opacity={clamp01(grow * 2)} />}
                {grow > 0.3 && i > 0 && <Pulse x={c.x} y={BASE - h} p={prog(t, c.t + 0.3, c.t + 1.2, "none")} r={120} color={C.cream} width={5} />}
                <Tag x={c.x} y={BASE + 44} text={c.label} p={prog(t, i === 0 ? c.t - 0.3 : c.t - 1.2, i === 0 ? c.t + 0.3 : c.t - 0.6, "none")} size={24} accent={c.accent} />
              </g>
            );
          })}
          {/* the drone joining the chart */}
          {(() => {
            const p = prog(t, T.meanwhile - 0.2, T.meanwhile + 0.5, "power3.inOut");
            return p < 1 ? <ShahedTop x={960 + (1110 - 960) * p} y={590 + (BASE - 90 - 590) * p} s={0.92 - 0.72 * p} opacity={1 - p * 0.3} /> : <ShahedTop x={1110} y={BASE - 90 + hover * 0.4} s={0.2} />;
          })()}
        </g>

        {/* ---------------- hero stage: AIM-120 ---------------- */}
        {stage(T.aim - 0.2, T.recent) > 0 && (
          <g opacity={stage(T.aim - 0.2, T.recent)}>
            <Tag x={HERO.x} y={250} text="AIM-120" p={prog(t, T.aim - 0.05, T.aim + 0.6, "none") * (1 - prog(t, T.around, T.m1))} size={44} accent={C.red} />
            {(() => {
              const jetIn = prog(t, T.used - 0.3, T.jets, "power3.out");
              const jetOut = prog(t, T.adapted - 0.2, T.ground + 0.3, "power3.in");
              return jetIn > 0 && jetOut < 1 ? <FighterJet x={-300 + (HERO.x + 300) * jetIn + jetOut * 900} y={600 + Math.sin(t * 1.7) * 10 - jetOut * 400} s={0.85} r={-jetOut * 12} /> : null;
            })()}
            {(() => {
              const nIn = ease("back.out(1.3)")(clamp01((t - T.ground + 0.1) / 0.7));
              return nIn > 0 ? (
                <g>
                  <NasamsLauncher x={HERO.x + 30} y={780 + (1 - nIn) * 300} s={0.95} elev={32} />
                  <Tag x={HERO.x} y={880} text="NASAMS" p={prog(t, T.nasams - 0.05, T.nasams + 0.5, "none")} size={36} accent={C.blue} />
                </g>
              ) : null;
            })()}
          </g>
        )}
        {heroMissile("aim120", T.aim, T.around, T.million1, COLS[1], 1.3)}
        {stage(T.recent - 0.3, T.comparison + 0.2) > 0 && (
          <DocPage x={HERO.x} y={560} s={0.6 * ease("back.out(2)")(prog(t, T.recent - 0.3, T.recent + 0.2))} r={-4} lines={prog(t, T.recent, T.estimates)} chart={prog(t, T.recent + 0.2, T.estimates + 0.4)} tab={C.amber} opacity={stage(T.recent - 0.3, T.comparison + 0.2)} />
        )}

        {/* ---------------- hero stage: PAC-3 MSE ---------------- */}
        {stage(T.patriot - 0.4, T.m4 + 0.4) > 0 && (
          <g opacity={stage(T.patriot - 0.4, T.m4 + 0.4)}>
            <LauncherSide x={HERO.x + 40} y={800 + (1 - prog(t, T.patriot - 0.4, T.patriot + 0.3, "back.out(1.4)")) * 300} s={0.85} elev={38} />
            <Tag x={HERO.x} y={250} text="PATRIOT PAC-3 MSE" p={prog(t, T.patriot - 0.05, T.pac3 + 0.8, "none")} size={44} accent={C.red} />
          </g>
        )}
        {heroMissile("pac3", T.pac3, T.m4 - 0.2, T.million4, COLS[2], 0.95)}

        {/* ---------------- hero stage: THAAD ---------------- */}
        {stage(T.thaad - 0.4, T.m13 + 0.4) > 0 && (
          <g opacity={stage(T.thaad - 0.4, T.m13 + 0.4)}>
            <LauncherSide x={HERO.x + 40} y={800 + (1 - prog(t, T.thaad - 0.4, T.thaad + 0.3, "back.out(1.4)")) * 300} s={0.85} elev={58} />
            <Tag x={HERO.x} y={250} text="THAAD" p={prog(t, T.thaad - 0.05, T.thaad + 0.5, "none")} size={48} accent={C.red} />
            {(() => {
              const p = prog(t, T.ballistic - 0.3, T.missiles + 0.8, "power1.inOut");
              if (p <= 0) return null;
              const bx = 90 + 820 * p;
              const by = 190 - Math.sin(Math.PI * p) * 120;
              const ang = (Math.atan2(-Math.cos(Math.PI * p) * 120 * Math.PI, 820) * 180) / Math.PI + 90;
              return (
                <g>
                  <path
                    d={`M90,190 ${Array.from({ length: 21 }, (_, i) => {
                      const k = (i / 20) * p;
                      return `L${90 + 820 * k},${190 - Math.sin(Math.PI * k) * 120}`;
                    }).join(" ")}`}
                    fill="none"
                    stroke={C.red}
                    strokeWidth={5}
                    strokeDasharray="14 10"
                  />
                  <BallisticMissile x={bx} y={by} r={ang} s={0.32} />
                </g>
              );
            })()}
          </g>
        )}
        {heroMissile("thaad", T.thaad, T.m13 - 0.2, T.million13, COLS[3], 0.85)}
      </g>
    </Stage>
  );
};
