import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { Glyph } from "../art/p2art";
import { LaserTurret, MicrowaveEmitter, Weather } from "../art/p3art";
import { Big, NoSign } from "../p2/shared";
import { PriceTag, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, rnd, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  and: at("And", 171),
  promising: at("promising", 174),
  directed: at("directed"),
  weapons: at("weapons.", 177),
  lasers: at("Lasers"),
  advantage: at("advantage."),
  once: at("Once"),
  installed: at("installed,"),
  shot: at("shot", 183),
  fraction: at("fraction"),
  costs: at("costs,"),
  ammunition: at("ammunition"),
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

  const laserA = win(t, T.and - 0.2, T.microwaves - 0.4, 0.4, 0.5);
  const turretIn = ease("back.out(1.4)")(clamp01((t - T.directed + 0.2) / 0.7));
  const beam = win(t, T.lasers - 0.2, T.shot2 + 0.6, 0.3, 0.5);
  const costP = prog(t, T.shot - 0.2, T.costs + 0.3, "power2.inOut");
  const powerP = prog(t, T.ammunition - 0.2, T.power + 0.3, "power2.out");
  const dragon = prog(t, T.dragonfire - 0.2, T.shot2 + 0.3, "back.out(1.8)");

  const progA = win(t, T.israel - 0.4, T.microwaves - 0.2, 0.4, 0.4);
  const mwA = win(t, T.microwaves - 0.3, T.butIts - 0.2, 0.4, 0.5);
  const mwFire = win(t, T.area - 0.6, T.swarms + 0.8, 0.3, 0.5);
  const limA = win(t, T.miracle - 0.5, T.theyll + 0.4, 0.4, 0.5);

  return (
    <Stage>
      {laserA > 0 && (
        <g opacity={laserA}>
          <Tag x={960} y={150} text="DIRECTED ENERGY" p={prog(t, T.directed - 0.2, T.weapons + 0.4, "none")} size={42} accent="#9BE8FF" />
          <g transform={`translate(560 900) scale(${1.05 * turretIn})`}>
            <LaserTurret beam={beam} angle={-46} />
          </g>
          {beam > 0.5 && (
            <g>
              <ShahedTop x={1290} y={250} r={-100} s={0.28} opacity={1 - prog(t, T.shot, T.shot + 0.5)} />
              <Pulse x={1290} y={250} p={prog(t, T.shot, T.shot + 0.9, "none")} r={200} color="#9BE8FF" width={7} />
            </g>
          )}
          {/* cost per shot */}
          {costP > 0 && (
            <g>
              <PriceTag x={1120} y={560} text="$1M" size={52} color={C.red} s={clamp01(costP * 2)} />
              <Big x={1330} y={575} text="→" size={70} color={C.cream} opacity={costP} />
              <PriceTag x={1400} y={560} text="$" size={52 * (1 - 0.35 * costP)} color={C.green} s={costP} />
              <Tag x={1290} y={680} text="PER SHOT" p={prog(t, T.fraction - 0.2, T.costs + 0.3, "none")} size={28} accent={C.green} />
            </g>
          )}
          {/* ammunition = power */}
          {powerP > 0 && (
            <g opacity={powerP}>
              <g transform="translate(300 480) scale(0.9)">
                <Glyph kind="power" s={1.2} color={C.amber} />
              </g>
              <Big x={300} y={630} text="∞" size={96} color={C.amber} />
              <Tag x={300} y={700} text="AMMO = POWER" p={powerP} size={26} accent={C.amber} />
            </g>
          )}
          {dragon > 0 && (
            <g transform={`translate(960 780) scale(${dragon})`}>
              <Tag x={0} y={0} text="DRAGONFIRE" p={1} size={40} accent="#9BE8FF" />
              <Big x={0} y={90} text="< £10 / SHOT" size={72} color="#9BE8FF" />
            </g>
          )}
        </g>
      )}

      {progA > 0 && (
        <g opacity={progA}>
          {[
            { t0: T.ironbeam, label: "IRON BEAM", sub: "ISRAEL", x: 430 },
            { t0: T.states, label: "US LASERS", sub: "UNITED STATES", x: 960 },
            { t0: T.microwave, label: "HIGH-POWER MICROWAVE", sub: "UNITED STATES", x: 1490 },
          ].map((p, i) => {
            const k = ease("back.out(1.5)")(clamp01((t - p.t0 + 0.3) / 0.55));
            if (k <= 0) return null;
            return (
              <g key={p.label} opacity={k}>
                <g transform={`translate(${p.x} 520) scale(${0.62 * k})`}>
                  {i < 2 ? <LaserTurret beam={0.8} angle={-40} /> : <MicrowaveEmitter fire={0.8} />}
                </g>
                <Tag x={p.x} y={640} text={p.label} p={prog(t, p.t0, p.t0 + 0.5, "none")} size={28} accent="#9BE8FF" />
                <Tag x={p.x} y={710} text={p.sub} p={prog(t, p.t0 + 0.1, p.t0 + 0.6, "none")} size={22} accent={C.cream} />
              </g>
            );
          })}
        </g>
      )}

      {mwA > 0 && (
        <g opacity={mwA}>
          <Tag x={960} y={150} text="MICROWAVES: A WHOLE AREA AT ONCE" p={prog(t, T.microwaves - 0.2, T.area + 0.4, "none")} size={38} accent={C.cyan} />
          <g transform="translate(430 930) scale(0.95)">
            <MicrowaveEmitter fire={mwFire} />
          </g>
          {Array.from({ length: 12 }, (_, i) => {
            const x = 900 + (i % 4) * 230 + rnd(i, 2) * 60;
            const y = 260 + Math.floor(i / 4) * 170 + rnd(i, 3) * 40;
            const downT = T.area + 0.2 + rnd(i, 5) * 1.6;
            const down = prog(t, downT, downT + 1.4, "power2.in");
            return (
              <g key={i}>
                <ShahedTop x={x} y={y + down * 520} r={-90 + down * 220} s={0.22} opacity={1 - down * 0.5} />
                {down > 0.05 && down < 0.4 && <Pulse x={x} y={y} p={down / 0.4} r={120} color={C.cyan} width={5} />}
              </g>
            );
          })}
          <Tag x={1400} y={880} text="ATTRACTIVE AGAINST SWARMS" p={prog(t, T.swarms - 0.3, T.swarms + 0.5, "none")} size={30} accent={C.cyan} />
        </g>
      )}

      {limA > 0 && (
        <g opacity={limA}>
          <Tag x={960} y={150} text="NOT A MIRACLE CURE" p={prog(t, T.miracle - 0.2, T.miracle + 0.6, "none")} size={40} accent={C.red} />
          {[
            { t0: T.integration, label: "INTEGRATION", x: 430 },
            { t0: T.reliability, label: "RELIABILITY", x: 960 },
            { t0: T.maturity, label: "MATURITY", x: 1490 },
          ].map((c) => {
            const p = ease("back.out(1.6)")(clamp01((t - c.t0 + 0.3) / 0.5));
            return p > 0 ? (
              <g key={c.label} opacity={p}>
                <g transform={`translate(${c.x} 400) scale(${p})`}>
                  <circle r={104} fill={C.ink} fillOpacity={0.9} stroke={C.red} strokeWidth={5} />
                  <Big x={0} y={26} text="!" size={92} color={C.red} />
                </g>
                <Tag x={c.x} y={540} text={c.label} p={prog(t, c.t0, c.t0 + 0.5, "none")} size={28} accent={C.red} />
              </g>
            ) : null;
          })}
          {[
            { t0: T.rain, kind: "rain" as const, label: "RAIN", x: 380 },
            { t0: T.fog, kind: "fog" as const, label: "FOG", x: 770 },
            { t0: T.smoke, kind: "smoke" as const, label: "SMOKE", x: 1160 },
            { t0: T.dust, kind: "dust" as const, label: "DUST", x: 1550 },
          ].map((w) => {
            const p = ease("back.out(1.5)")(clamp01((t - w.t0 + 0.3) / 0.45));
            if (p <= 0) return null;
            return (
              <g key={w.label} opacity={p}>
                <g transform={`translate(${w.x} 760) scale(${p})`}>
                  <circle r={104} fill={C.ink} fillOpacity={0.9} stroke="#9BE8FF" strokeWidth={5} />
                  <Weather kind={w.kind} s={0.9} />
                </g>
                <Tag x={w.x} y={900} text={w.label} p={prog(t, w.t0, w.t0 + 0.4, "none")} size={26} accent="#9BE8FF" />
              </g>
            );
          })}
          {t > T.conditions - 0.3 && <NoSign x={960} y={760} p={prog(t, T.conditions - 0.2, T.conditions + 0.5, "none")} r={430} />}
        </g>
      )}
    </Stage>
  );
};
