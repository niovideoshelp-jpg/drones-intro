import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { ClockIcon, Engine, Factory, HelmetIcon, Interceptor, NoSign, PCB, ScanLine, ShieldIcon, Ultralight, Wrench, Big } from "../art/p1art";
import { Explosion, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, rnd, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  cheap: at("cheap", 91),
  completely: at("completely"),
  industrial: at("industrial"),
  logic: at("logic."),
  built: at("built"),
  lost: at("lost."),
  no1: at("No"),
  survival: at("survival"),
  no2: at("no", 97.5),
  pilot: at("pilot"),
  no3: at("no", 98.8),
  thousands: at("thousands"),
  maintenance: at("maintenance.", 100),
  it: at("It", 101),
  engine: at("engine"),
  ultralight: at("ultralight"),
  offShelf: at("off-the-shelf"),
  electronics: at("electronics,"),
  simple: at("simple"),
  airframe: at("airframe."),
  if: at("If"),
  nine: at("nine"),
  shot: at("shot"),
  down: at("down,"),
  only: at("only", 111),
  one: at("one", 111.5),
  target: at("target,", 112),
  operation: at("operation"),
  worth: at("worth"),
  inAn: at("In", 116),
};
export const INDUSTRY_RANGE = [T.cheap - 0.2, T.inAn + 0.6] as const;

const BELT_Y = 440;
const BX0 = 250;
const BX1 = 1670;

export const Industry: React.FC = () => {
  const t = useTime();
  if (t < INDUSTRY_RANGE[0] || t > INDUSTRY_RANGE[1]) return null;

  /* ---------------- conveyor ---------------- */
  const gA = win(t, T.cheap - 0.2, T.it + 0.3, 0.5, 0.5);
  const beltIn = prog(t, T.cheap - 0.2, T.cheap + 0.6, "power3.out");
  const dist = 170 * (t - T.cheap) + 180 * Math.max(0, Math.min(t, T.lost) - T.industrial);
  const spacing = 230;

  /* ---------------- exploded drone ---------------- */
  const hA = win(t, T.it - 0.2, T.if + 0.2, 0.5, 0.45);
  const droneIn = ease("back.out(1.3)")(clamp01((t - T.it + 0.1) / 0.7));
  const DX = 960;
  const DY = 560;
  const DS = 1.55;

  /* ---------------- nine of ten ---------------- */
  const iA = win(t, T.if - 0.2, T.inAn + 0.5, 0.4, 0.5);
  const t0 = T.if - 0.1;
  const speed = 285;
  const survivor = 7;
  const killAt = (k: number) => T.shot - 0.25 + (((k < survivor ? k : k - 1) / 8) * (T.down + 0.2 - (T.shot - 0.25)));
  const targetX = 1520;
  const reach = T.target;

  return (
    <Stage>
      {gA > 0 && (
        <g opacity={gA}>
          {/* stamping press feeding the belt */}
          <g transform={`translate(${BX0 + 60} ${BELT_Y - 120})`}>
            <rect x={-70} y={-120} width={140} height={60} rx={6} fill={C.steelDark} stroke={C.ink} strokeWidth={5} />
            <rect x={-12} y={-60} width={24} height={40 + 30 * Math.max(0, Math.sin(((t * 170) / spacing) * Math.PI * 2))} fill={C.steel} stroke={C.ink} strokeWidth={4} />
            <path d="M-90,-120 L-90,130 M90,-120 L90,130" stroke={C.ink} strokeWidth={10} />
            <circle cx={50} cy={-100} r={8} fill={C.amber} opacity={Math.sin(t * 8) > 0 ? 1 : 0.3} />
          </g>
          {/* belt */}
          <g transform={`translate(${960} ${BELT_Y}) scale(${beltIn} 1) translate(${-960} ${-BELT_Y})`}>
            <rect x={BX0} y={BELT_Y + 30} width={BX1 - BX0} height={36} rx={18} fill={C.ink3} stroke={C.ink} strokeWidth={5} />
            {Array.from({ length: 36 }, (_, i) => {
              const x = BX0 + ((((i * 40 - dist) % 1440) + 1440) % 1440);
              return x < BX1 - 10 ? <path key={i} d={`M${x},${BELT_Y + 34} L${x - 14},${BELT_Y + 62}`} stroke={C.steelDark} strokeWidth={5} /> : null;
            })}
            {Array.from({ length: 12 }, (_, i) => (
              <g key={i} transform={`translate(${BX0 + 40 + i * 125} ${BELT_Y + 96})`}>
                <circle r={20} fill={C.steel} stroke={C.ink} strokeWidth={4} />
                <path d={`M${-16 * Math.cos(dist / 20)},${-16 * Math.sin(dist / 20)} L${16 * Math.cos(dist / 20)},${16 * Math.sin(dist / 20)}`} stroke={C.ink} strokeWidth={4} />
              </g>
            ))}
            <path d={`M${BX0 + 40},${BELT_Y + 116} L${BX0 + 40},${BELT_Y + 200} M${BX1 - 40},${BELT_Y + 116} L${BX1 - 40},${BELT_Y + 200}`} stroke={C.ink} strokeWidth={10} />
          </g>
          {/* drones on the belt; the last ones drop off: built to be lost */}
          {beltIn > 0.6 &&
            Array.from({ length: 9 }, (_, i) => {
              const raw = ((dist + i * spacing) % (spacing * 9)) - 60;
              const x = BX0 + raw;
              if (x < BX0 + 60) return null;
              const over = Math.max(0, x - (BX1 - 20));
              const fall = over / 160;
              const y = BELT_Y - 10 + fall * fall * 140;
              const lostPhase = t > T.built - 0.3;
              if (!lostPhase && over > 0) return null;
              return <ShahedTop key={i} x={Math.min(x, BX1 - 20 + over * 0.6)} y={y} r={90 + fall * 80} s={0.34} opacity={1 - clamp01(fall / 2.2)} />;
            })}
          <Pulse x={BX1} y={BELT_Y + 60} p={prog(t, T.lost - 0.1, T.lost + 0.9, "none")} r={200} color={C.red} width={8} />

          {/* what it does not need */}
          {[
            { x: 560, tNo: T.no1, tIcon: T.survival, label: "SURVIVABILITY", icon: <ShieldIcon s={0.9} /> },
            { x: 960, tNo: T.no2, tIcon: T.pilot, label: "PILOT TRAINING", icon: <HelmetIcon s={0.85} /> },
            {
              x: 1360,
              tNo: T.no3,
              tIcon: T.thousands,
              label: "MAINTENANCE HOURS",
              icon: (
                <g>
                  <ClockIcon x={-24} y={6} s={0.85} turn={t * 6} />
                  <Wrench x={52} y={10} s={0.5} r={30} />
                </g>
              ),
            },
          ].map((b) => {
            const p = ease("back.out(1.7)")(clamp01((t - b.tNo + 0.2) / 0.5));
            if (p <= 0) return null;
            return (
              <g key={b.label}>
                <g transform={`translate(${b.x} ${800 + Math.sin(t * 1.5 + b.x) * 5}) scale(${p})`}>
                  <circle r={115} fill={C.ink} fillOpacity={0.9} stroke={C.cream} strokeWidth={5} />
                  {b.icon}
                </g>
                <NoSign x={b.x} y={800} p={prog(t, b.tIcon - 0.05, b.tIcon + 0.5, "none")} r={115} />
                <Tag x={b.x} y={960} text={b.label} p={prog(t, b.tIcon, b.tIcon + 0.6, "none")} size={26} accent={C.red} />
              </g>
            );
          })}
        </g>
      )}

      {hA > 0 && (
        <g opacity={hA}>
          <g transform={`translate(${DX} ${DY + (1 - droneIn) * 200}) rotate(${Math.sin(t * 0.9) * 4}) scale(${DS * droneIn})`}>
            <ShahedTop />
          </g>
          <ScanLine x={DX} w={620} y0={DY - 260} y1={DY + 260} period={3.4} />
          {(() => {
            const pulse = prog(t, T.simple - 0.1, T.airframe + 0.6, "none");
            return pulse > 0 ? (
              <g transform={`translate(${DX} ${DY}) rotate(${Math.sin(t * 0.9) * 4}) scale(${DS})`} className="blueprint" opacity={Math.sin(pulse * Math.PI * 3) * 0.5 + 0.5}>
                <ShahedTop detail={false} />
              </g>
            ) : null;
          })()}
          {/* engine */}
          {(() => {
            const p = ease("back.out(1.6)")(clamp01((t - T.engine + 0.2) / 0.55));
            if (p <= 0) return null;
            const line = prog(t, T.engine, T.engine + 0.5, "power2.out");
            return (
              <g>
                <path d={`M540,420 L${540 + (DX - 30 - 540) * line},${420 + (DY + 150 - 420) * line}`} stroke={C.amber} strokeWidth={5} strokeDasharray="12 8" />
                <circle cx={DX} cy={DY + 165} r={26} fill="none" stroke={C.amber} strokeWidth={5} opacity={line} />
                <g transform={`translate(400 400) scale(${0.94 * p})`}>
                  <Engine />
                </g>
                <Tag x={400} y={220} text="ENGINE" p={prog(t, T.engine, T.engine + 0.5, "none")} size={34} accent={C.amber} />
                {t > T.ultralight - 0.2 && (
                  <g opacity={prog(t, T.ultralight - 0.2, T.ultralight + 0.3)}>
                    <Big x={400} y={640} text="≈" size={90} color={C.amber} />
                    <Ultralight x={400} y={830} s={1.15 * ease("back.out(2)")(prog(t, T.ultralight - 0.2, T.ultralight + 0.3))} />
                  </g>
                )}
              </g>
            );
          })()}
          {/* electronics */}
          {(() => {
            const p = ease("back.out(1.6)")(clamp01((t - T.offShelf + 0.2) / 0.55));
            if (p <= 0) return null;
            const line = prog(t, T.offShelf, T.offShelf + 0.5, "power2.out");
            return (
              <g>
                <path d={`M1390,420 L${1390 + (DX + 20 - 1390) * line},${420 + (DY - 130 - 420) * line}`} stroke={C.cyan} strokeWidth={5} strokeDasharray="12 8" />
                <circle cx={DX} cy={DY - 140} r={26} fill="none" stroke={C.cyan} strokeWidth={5} opacity={line} />
                <g transform={`translate(1520 420) scale(${0.94 * p}) rotate(${Math.sin(t) * 3})`}>
                  <PCB />
                </g>
                <Tag x={1520} y={220} text="COMMERCIAL ELECTRONICS" p={prog(t, T.offShelf, T.electronics + 0.4, "none")} size={30} accent={C.cyan} />
              </g>
            );
          })()}
          {/* airframe */}
          {t > T.simple - 0.2 && (
            <g opacity={prog(t, T.simple - 0.2, T.simple + 0.2)}>
              <path d={`M1400,800 L${DX + 170},${DY + 110}`} stroke={C.cream} strokeWidth={5} strokeDasharray="12 8" />
              <Tag x={1520} y={820} text="SIMPLE AIRFRAME" p={prog(t, T.simple, T.airframe + 0.3, "none")} size={32} accent={C.cream} />
            </g>
          )}
        </g>
      )}

      {iA > 0 && (
        <g opacity={iA}>
          <path d="M1120,230 L1120,880" stroke={C.cyan} strokeWidth={6} strokeDasharray="22 14" strokeDashoffset={t * 30} />
          {/* interceptors coming off the line to meet them */}
          {Array.from({ length: 9 }, (_, k) => {
            const tk = killAt(k < survivor ? k : k + 1);
            const p = prog(t, tk - 0.55, tk, "power2.in");
            if (p <= 0 || p >= 1) return null;
            const ty = 470 + ((k * 37) % 5) * 90;
            const x = 1700 - 1100 * p;
            return (
              <g key={`i${k}`} transform={`translate(${x} ${ty}) rotate(180) scale(0.3)`}>
                <Interceptor kind="pac3" flame={1} />
              </g>
            );
          })}
          <g transform={`translate(${targetX + 60} 600) scale(0.98)`}>
            <Factory stop={0} />
          </g>
          {Array.from({ length: 10 }, (_, k) => {
            const row = k % 2;
            const col = Math.floor(k / 2);
            const x0 = 180 + col * 120 + (row ? 60 : 0);
            const y0 = 470 + row * 150 + (rnd(k, 3) - 0.5) * 30;
            const tk = killAt(k);
            const isSurvivor = k === survivor;
            const run = t - t0;
            let x = x0 + run * speed;
            let y = y0;
            if (isSurvivor) {
              const p = prog(t, t0, reach, "power1.in");
              x = x0 + (targetX - x0) * p;
              y = y0 + (560 - y0) * p;
            }
            const boom = prog(t, tk, tk + 0.9, "none");
            if (!isSurvivor && boom >= 1) return null;
            if (isSurvivor && t > reach + 0.05) return null;
            return (
              <g key={k}>
                {(isSurvivor || boom <= 0.15) && <ShahedTop x={x} y={y + Math.sin(t * 3 + k) * 4} r={90 + (isSurvivor ? (Math.atan2(560 - y0, targetX - x0) * 180) / Math.PI : 0)} s={0.34} />}
                {!isSurvivor && boom > 0 && <Explosion x={x} y={y} p={boom} size={46} seed={k + 50} />}
                {isSurvivor && t > T.only - 0.2 && <circle cx={x} cy={y} r={70 + 6 * Math.sin(t * 8)} fill="none" stroke={C.amber} strokeWidth={6} />}
              </g>
            );
          })}
          {t > reach && t < reach + 1.2 && <Explosion x={targetX + 40} y={520} p={prog(t, reach, reach + 1.2, "none")} size={150} seed={61} />}
          <Big x={960} y={220} text="1 OF 10" size={96} color={C.amber} opacity={prog(t, T.one - 0.1, T.one + 0.3) * (1 - prog(t, T.inAn - 0.2, T.inAn + 0.3))} />
          {t > T.worth - 0.2 && (
            <g transform={`translate(${targetX + 200} 330) scale(${ease("back.out(3)")(prog(t, T.worth - 0.2, T.worth + 0.3))})`}>
              <circle r={56} fill={C.green} stroke={C.ink} strokeWidth={6} />
              <path d="M-26,2 L-8,22 L28,-18" stroke={C.ink} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </g>
      )}
    </Stage>
  );
};
