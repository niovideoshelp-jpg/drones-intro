import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { Glyph } from "../art/p2art";
import { aimTurret, LaserTurret, MicrowaveEmitter, Weather } from "../art/p3art";
import { Lens } from "../art/lens";
import { Big } from "../p2/shared";
import { PriceTag, Pulse, StrikeLine, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { board, clamp01, ease, prog, rnd, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  and: at("And", 171),
  promising: at("promising", 174),
  directed: at("directed"),
  weapons: at("weapons.", 177),
  lasers: at("Lasers"),
  advantage: at("advantage."),
  once: at("Once", 180),
  installed: at("installed,"),
  shot: at("shot", 183),
  fraction: at("fraction"),
  costs: at("costs,"),
  ammunition: at("ammunition", 187),
  power: at("power."),
  uk: at("Kingdom"),
  dragonfire: at("DragonFire"),
  pounds: at("pounds"),
  shot2: at("shot.", 196),
  israel: at("Israel"),
  ironbeam: at("Beam,"),
  states: at("States"),
  microwave: at("microwave"),
  weapons2: at("weapons.", 205),
  microwaves: at("Microwaves"),
  instead: at("Instead", 209),
  area: at("area,"),
  swarms: at("swarms."),
  butIts: at("But", 219),
  miracle: at("miracle"),
  integration: at("integration,"),
  reliability: at("reliability,"),
  maturity: at("maturity."),
  rain: at("rain,"),
  fog: at("fog,"),
  smoke: at("smoke,"),
  dust: at("dust,"),
  conditions: at("conditions.", 235),
  theyll: at("They'll"),
};
export const LAYER5_RANGE = [T.and - 0.3, T.theyll + 0.6] as const;

export const Layer5: React.FC = () => {
  const t = useTime();
  if (t < LAYER5_RANGE[0] || t > LAYER5_RANGE[1]) return null;

  const laserB = board(t, T.and - 0.2, T.israel - 0.5, { hits: [T.shot + 0.15] });
  const turretIn = ease("back.out(1.4)")(clamp01((t - T.and) / 0.8));
  /* two targets: the first burns and falls on "shot", the second takes the beam for DragonFire */
  const second = t > T.shot + 0.7;
  const fall1 = prog(t, T.shot, T.shot + 1.3, "power2.in");
  const tgtX = second ? 1470 : 1290;
  const tgtY = second ? 330 + Math.sin(t * 1.7) * 10 : 250;
  const TX = 560;
  const TY = 860;
  const aim = aimTurret(tgtX, tgtY, TX, TY, 1.05);
  const beam = Math.max(win(t, T.lasers - 0.2, T.shot + 0.3, 0.3, 0.3), win(t, T.shot + 0.9, T.shot2 + 0.6, 0.3, 0.5));
  const burn = prog(t, T.lasers, T.shot, "none");
  const costP = prog(t, T.shot - 0.2, T.costs + 0.3, "power2.inOut");
  const powerP = prog(t, T.ammunition - 0.2, T.power + 0.3, "power2.out");
  const dragon = prog(t, T.dragonfire - 0.2, T.shot2 + 0.3, "back.out(1.8)");

  const progB = board(t, T.israel - 0.4, T.microwaves - 0.2);
  const mwB = board(t, T.microwaves - 0.3, T.miracle - 0.4, { hits: [T.area + 0.7] });
  const mwFire = win(t, T.area - 0.6, T.swarms + 0.8, 0.3, 0.5);
  const limB = board(t, T.miracle - 0.5, T.theyll + 0.4);
  const GROUND = 860;

  return (
    <Stage>
      {laserB.op > 0 && (
        <g opacity={laserB.op} transform={laserB.tf}>
          <Tag x={960} y={150} text="DIRECTED ENERGY" p={prog(t, T.directed - 0.2, T.weapons + 0.4, "none")} size={42} accent="#9BE8FF" />
          <path d={`M180,${TY} L1740,${TY}`} stroke={C.cream} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
          {/* targets keep coming while the turret charges and tracks */}
          {[0, 1, 2].map((i) => {
            const k = (((t - T.and) * 0.06 + i * 0.34) % 1 + 1) % 1;
            return <ShahedTop key={i} x={1880 - k * 900} y={420 + i * 90} r={-90} s={0.18} opacity={0.55 * turretIn} />;
          })}
          {/* the first target: heats, glows, falls */}
          {fall1 < 1 && (
            <g transform={`translate(1290 ${250 + fall1 * 480}) rotate(${-90 + fall1 * 140})`} opacity={turretIn * (1 - fall1 * 0.6)}>
              <ShahedTop s={0.3} tone={burn > 0.5 ? "#D98A6A" : undefined} />
              {burn > 0 && <circle r={24 + 18 * burn} fill={C.red} opacity={0.35 * burn} />}
            </g>
          )}
          {/* the second target, for DragonFire */}
          {second && <ShahedTop x={1470} y={tgtY} r={-100} s={0.28} opacity={prog(t, T.shot + 0.5, T.shot + 0.9)} />}
          {beam <= 0.05 && turretIn > 0 && (
            <path d={`M${TX},${TY - 180} L${tgtX},${tgtY}`} stroke="#9BE8FF" strokeWidth={3} strokeDasharray="10 14" strokeDashoffset={-t * 60} opacity={0.4 * turretIn} />
          )}
          <g transform={`translate(${TX} ${TY}) scale(${1.05 * turretIn})`}>
            <LaserTurret beam={beam} angle={aim.angle} reach={aim.reach} />
          </g>
          {turretIn > 0 && beam <= 0.05 && <Pulse x={TX} y={TY - 100} p={((t * 0.7) % 1 + 1) % 1} r={200} color="#9BE8FF" width={5} />}
          {/* cost per shot */}
          {costP > 0 && (
            <g>
              <PriceTag x={1120} y={600} text="$1M" size={52} color={C.red} s={clamp01(costP * 2)} />
              <Big x={1330} y={615} text="→" size={70} color={C.cream} opacity={costP} />
              <PriceTag x={1400} y={600} text="$" size={52 * (1 - 0.35 * costP)} color={C.green} s={costP} />
              <Tag x={1290} y={690} text="PER SHOT" p={prog(t, T.fraction - 0.2, T.costs + 0.3, "none")} size={28} accent={C.green} />
            </g>
          )}
          {/* ammunition = power */}
          {powerP > 0 && (
            <g opacity={powerP}>
              <g transform="translate(260 480) scale(0.9)">
                <Glyph kind="power" s={1.2} color={C.amber} />
              </g>
              <Big x={260} y={630} text="∞" size={96} color={C.amber} />
              <Tag x={260} y={700} text="AMMO = POWER" p={powerP} size={26} accent={C.amber} />
            </g>
          )}
          {dragon > 0 && (
            <g transform={`translate(1040 790) scale(${dragon})`}>
              <Tag x={0} y={0} text="DRAGONFIRE" p={1} size={36} accent="#9BE8FF" />
              <Big x={0} y={80} text="< £10 / SHOT" size={64} color="#9BE8FF" />
            </g>
          )}
        </g>
      )}

      {progB.op > 0 && (
        <g opacity={progB.op} transform={progB.tf}>
          {[
            { t0: T.israel, label: "IRON BEAM", sub: "ISRAEL", x: 480, kind: "laser" },
            { t0: T.states, label: "US LASERS", sub: "UNITED STATES", x: 960, kind: "laser" },
            { t0: T.microwave, label: "HIGH-POWER MICROWAVE", sub: "UNITED STATES", x: 1440, kind: "mw" },
          ].map((p, i) => {
            const k = ease("back.out(1.5)")(clamp01((t - p.t0 + 0.3) / 0.55));
            if (k <= 0) return null;
            const dx = 60 + Math.sin(t * 1.4 + i) * 12;
            const dy = -95;
            const a = aimTurret(dx, dy, -60, 71, 0.42);
            return (
              <g key={p.label}>
                <Lens id={`nat${i}`} x={p.x} y={450} r={170} t={t} s={k} ring="#9BE8FF" sky={i === 1 ? "dusk" : "day"} label={p.label} labelP={prog(t, p.t0, p.t0 + 0.5, "none")}>
                  <ShahedTop x={dx} y={dy} r={-90} s={0.14} />
                  {p.kind === "laser" ? (
                    <LaserTurret x={-60} y={71} s={0.42} beam={0.9} angle={a.angle} reach={a.reach} />
                  ) : (
                    <MicrowaveEmitter x={-70} y={71} s={0.4} fire={0.9} angle={55} range={300} />
                  )}
                </Lens>
                <Tag x={p.x} y={730} text={p.sub} p={prog(t, p.t0 + 0.1, p.t0 + 0.6, "none")} size={22} accent={C.cream} />
              </g>
            );
          })}
        </g>
      )}

      {mwB.op > 0 && (
        <g opacity={mwB.op} transform={mwB.tf}>
          <Tag x={960} y={150} text="MICROWAVES: A WHOLE AREA AT ONCE" p={prog(t, T.microwaves - 0.2, T.area + 0.4, "none")} size={38} accent={C.cyan} />
          <path d={`M180,${GROUND} L1740,${GROUND}`} stroke={C.cream} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
          {/* the cone points at the swarm */}
          <g transform={`translate(430 ${GROUND}) scale(0.95)`}>
            <MicrowaveEmitter fire={mwFire} angle={66} range={820} />
          </g>
          {Array.from({ length: 12 }, (_, i) => {
            const x = 960 + (i % 4) * 210 + rnd(i, 2) * 50;
            const y = 300 + Math.floor(i / 4) * 150 + rnd(i, 3) * 40;
            const downT = T.area + 0.2 + rnd(i, 5) * 1.6;
            const down = prog(t, downT, downT + 1.4, "power2.in");
            const gy = GROUND - 12;
            return (
              <g key={i}>
                <ShahedTop x={x + (1 - down) * Math.sin(t * 1.6 + i) * 12} y={y + down * (gy - y)} r={-90 + down * 200} s={0.2} opacity={1 - down * 0.45} />
                {down > 0.05 && down < 0.4 && <Pulse x={x} y={y} p={down / 0.4} r={100} color={C.cyan} width={5} />}
              </g>
            );
          })}
          <Tag x={1260} y={220} text="ATTRACTIVE AGAINST SWARMS" p={prog(t, T.swarms - 0.3, T.swarms + 0.5, "none")} size={30} accent={C.cyan} />
        </g>
      )}

      {limB.op > 0 && (
        <g opacity={limB.op} transform={limB.tf}>
          <Tag x={960} y={150} text="NOT A MIRACLE CURE" p={prog(t, T.miracle - 0.2, T.miracle + 0.6, "none")} size={40} accent={C.red} />
          {[
            { t0: T.integration, label: "INTEGRATION", x: 560 },
            { t0: T.reliability, label: "RELIABILITY", x: 960 },
            { t0: T.maturity, label: "MATURITY", x: 1360 },
          ].map((c, i) => {
            const p = ease("back.out(1.6)")(clamp01((t - c.t0 + 0.3) / 0.5));
            const ghost = prog(t, T.miracle + 0.1, T.miracle + 0.7);
            return (
              <g key={c.label} opacity={Math.max(p, 0.45 * ghost)}>
                <Lens id={`mir${i}`} x={c.x} y={370} r={105} t={t} s={Math.max(p, 0.85 * ghost)} ring={C.red} sky="storm" label={p > 0 ? c.label : undefined} labelP={prog(t, c.t0, c.t0 + 0.5, "none")}>
                  <LaserTurret x={-10} y={44} s={0.34} beam={0} angle={30 + Math.sin(t * 0.8 + i) * 10} />
                </Lens>
                {p > 0 && (
                  <g transform={`translate(${c.x + 78} ${300}) scale(${p})`}>
                    <circle r={30} fill={C.red} stroke={C.ink} strokeWidth={5} />
                    <Big x={0} y={16} text="!" size={44} color={C.cream} />
                  </g>
                )}
              </g>
            );
          })}
          {[
            { t0: T.rain, kind: "rain" as const, label: "RAIN", x: 480 },
            { t0: T.fog, kind: "fog" as const, label: "FOG", x: 800 },
            { t0: T.smoke, kind: "smoke" as const, label: "SMOKE", x: 1120 },
            { t0: T.dust, kind: "dust" as const, label: "DUST", x: 1440 },
          ].map((w, i) => {
            const p = ease("back.out(1.5)")(clamp01((t - w.t0 + 0.3) / 0.45));
            if (p <= 0) return null;
            return (
              <Lens key={w.label} id={`wx${i}`} x={w.x} y={700} r={100} t={t} s={p} ring="#9BE8FF" sky="storm" label={w.label} labelP={prog(t, w.t0, w.t0 + 0.4, "none")}>
                <LaserTurret x={-40} y={42} s={0.3} beam={0.5 + 0.3 * Math.sin(t * 9 + i)} angle={40} reach={160} />
                <Weather kind={w.kind} s={0.7} y={-20} />
              </Lens>
            );
          })}
          {t > T.conditions - 0.3 && <StrikeLine x1={360} y1={700} x2={1560} y2={700} p={prog(t, T.conditions - 0.2, T.conditions + 0.5, "none")} width={14} />}
        </g>
      )}
    </Stage>
  );
};
