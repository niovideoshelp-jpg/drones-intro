import React from "react";
import { C } from "../design";
import { FPVSide, ShahedTop } from "../art/drones";
import { JammerMast } from "../art/ground";
import { Lens } from "../art/lens";
import { SPAAG } from "../art/p3art";
import { Interceptor, SunMoon } from "./shared";
import { Gauge, Tracers } from "../art/p2art";
import { Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { board, clamp01, ease, prog, useTime } from "../lib/kf";
import { at } from "./words";

const T = {
  theres: at("There's"),
  difference: at("difference"),
  reliability: at("reliability."),
  modern: at("Modern"),
  sensors: at("sensors,"),
  links: at("links,"),
  navigation: at("navigation"),
  control: at("control"),
  motors: at("motors"),
  conditions: at("conditions."),
  they: at("They"),
  day: at("day"),
  night: at("night,"),
  longer: at("longer"),
  distances: at("distances,"),
  react: at("react"),
  changes: at("changes"),
  direction: at("direction."),
  guns: at("Guns,"),
  jammers: at("jammers,"),
  interceptor: at("interceptor"),
  drones: at("drones", 52),
  cheaper: at("cheaper,"),
  probability: at("probability"),
  success: at("success"),
  every: at("every", 56),
  condition: at("condition."),
  and: at("And", 57.8),
};
export const RELIABILITY_RANGE = [T.theres - 0.3, T.and + 0.8] as const;

/* Each part points from the component it names (ax: offset along the missile, ay: which edge) to a label placed
   so the leaders never cross: top row left to right, bottom row left to right. */
const PARTS = [
  { t: T.motors, label: "MOTORS", ax: -255, ay: -1, lx: -330 },
  { t: T.links, label: "DATA LINKS", ax: 90, ay: -1, lx: 30 },
  { t: T.sensors, label: "SENSORS", ax: 270, ay: -1, lx: 330 },
  { t: T.control, label: "CONTROL SURFACES", ax: -278, ay: 1, lx: -360 },
  { t: T.navigation, label: "NAVIGATION", ax: -45, ay: 1, lx: 20 },
];

const CHEAP = [
  { t: T.guns, label: "GUNS", value: 0.45 },
  { t: T.jammers, label: "JAMMERS", value: 0.35 },
  { t: T.drones, label: "INTERCEPTOR DRONES", value: 0.5 },
];

export const Reliability: React.FC = () => {
  const t = useTime();
  if (t < RELIABILITY_RANGE[0] || t > RELIABILITY_RANGE[1]) return null;

  const missB = board(t, T.theres - 0.2, T.guns - 0.2);
  const missIn = ease("back.out(1.4)")(clamp01((t - T.theres) / 0.7));
  const MX = 860;
  const MY = 470;

  /* day / night, range, reaction */
  const dayP = prog(t, T.day - 0.2, T.night + 0.5, "none");
  const rangeP = prog(t, T.longer - 0.2, T.distances + 0.4, "power2.out");
  const reactP = prog(t, T.react - 0.2, T.direction + 0.3, "power1.inOut");

  /* cheaper options */
  const cheapB = board(t, T.guns - 0.35, T.and + 0.6);

  return (
    <Stage>
      {missB.op > 0 && (
        <g opacity={missB.op} transform={missB.tf}>
          <Tag x={960} y={180} text="RELIABILITY" p={prog(t, T.theres, T.reliability + 0.5, "none")} size={44} accent={C.cyan} />
          <g transform={`translate(${MX} ${MY + Math.sin(t * 1.4) * 6}) scale(${1.5 * missIn})`}>
            <Interceptor kind="pac3" flame={0.5} />
          </g>
          {/* an inspection band sweeping the airframe while its parts are named */}
          {missIn > 0.9 && (
            <g opacity={0.55 * (1 - prog(t, T.conditions, T.conditions + 0.5))}>
              <rect x={MX - 300 + (((t - T.modern) * 0.45) % 1 + 1) % 1 * 580} y={MY - 40 + Math.sin(t * 1.4) * 6} width={10} height={80} rx={5} fill={C.cyan} />
            </g>
          )}
          {PARTS.map((p) => {
            const k = ease("back.out(1.6)")(clamp01((t - p.t + 0.25) / 0.5));
            if (k <= 0) return null;
            const bob = Math.sin(t * 1.4) * 6;
            const ax = MX + p.ax;
            const ay = MY + bob + (p.ax < -260 && p.ay > 0 ? 64 : 25) * p.ay;
            const elbowY = MY + bob + 110 * p.ay;
            const lx = MX + p.lx;
            const ly = MY + 170 * p.ay;
            const draw = prog(t, p.t - 0.2, p.t + 0.3, "power2.out");
            const d = `M${ax},${ay} L${ax},${elbowY} L${lx},${elbowY} L${lx},${ly - 26 * p.ay}`;
            return (
              <g key={p.label} opacity={k}>
                <path d={d} fill="none" stroke={C.cyan} strokeWidth={4} strokeLinejoin="round" strokeDasharray={`${draw * 400} 400`} />
                <circle cx={ax} cy={ay} r={9 + 3 * Math.sin(t * 5 + p.ax)} fill={C.cyan} stroke={C.ink} strokeWidth={4} />
                <Tag x={lx} y={ly} text={p.label} p={prog(t, p.t, p.t + 0.5, "none")} size={30} accent={C.cyan} />
              </g>
            );
          })}
          {/* works day or night */}
          {dayP > 0 && (
            <g opacity={clamp01(dayP * 3)}>
              <SunMoon x={430} y={760} phase={clamp01((t - T.day) / (T.night + 0.4 - T.day))} s={0.85} />
              <Tag x={430} y={900} text="DAY OR NIGHT" p={prog(t, T.day, T.night + 0.3, "none")} size={28} accent={C.amber} />
            </g>
          )}
          {/* longer reach */}
          {rangeP > 0 && (
            <g opacity={clamp01(rangeP * 3)}>
              <path d={`M960,880 L${960 + 620 * rangeP},880`} stroke={C.cyan} strokeWidth={8} strokeLinecap="round" />
              <path d={`M${960 + 620 * rangeP - 30},856 L${960 + 620 * rangeP},880 L${960 + 620 * rangeP - 30},904`} stroke={C.cyan} strokeWidth={8} fill="none" strokeLinejoin="round" />
              <Tag x={1250} y={940} text="LONGER REACH" p={prog(t, T.longer, T.distances + 0.2, "none")} size={28} accent={C.cyan} />
            </g>
          )}
          {/* reacts to a turn */}
          {reactP > 0 && (
            <g opacity={clamp01(reactP * 3)}>
              {(() => {
                const px = 1420 + 260 * reactP;
                const py = 300 - Math.sin(reactP * Math.PI) * 120;
                return (
                  <g>
                    <path d={`M1400,300 Q1560,${300 - 160 * reactP} ${px},${py}`} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="12 9" />
                    <ShahedTop x={px} y={py} r={70} s={0.22} />
                    <path d={`M${MX + 200},${MY - 40} Q1500,${200} ${px - 40},${py + 30}`} fill="none" stroke={C.cyan} strokeWidth={5} />
                  </g>
                );
              })()}
            </g>
          )}
        </g>
      )}

      {cheapB.op > 0 && (
        <g opacity={cheapB.op} transform={cheapB.tf}>
          <Tag x={960} y={200} text="PROBABILITY OF SUCCESS" p={prog(t, T.probability - 0.1, T.success + 0.4, "none")} size={38} accent={C.cream} />
          {CHEAP.map((c, i) => {
            const p = ease("back.out(1.5)")(clamp01((t - c.t + 0.3) / 0.55));
            if (p <= 0) return null;
            const x = 420 + i * 420;
            const loop = (((t - c.t) * 0.45) % 1 + 1) % 1;
            return (
              <g key={c.label}>
                <Lens id={`cheap${i}`} x={x} y={450} r={130} t={t} s={p} ring={C.green} label={c.label} labelP={prog(t, c.t, c.t + 0.5, "none")}>
                  {i === 0 && (
                    <g>
                      <SPAAG x={-60} y={55} s={0.38} fire={1} />
                      <ShahedTop x={75 + Math.sin(t * 1.5) * 8} y={-75} r={-100} s={0.12} />
                      <Tracers x={-8} y={-41} up={1} tx={75 + Math.sin(t * 1.5) * 8} ty={-75} seed={i} />
                    </g>
                  )}
                  {i === 1 && (
                    <g>
                      <g transform="translate(-55 55) scale(0.42)">
                        <JammerMast />
                      </g>
                      {[0, 1, 2].map((k) => {
                        const q = (((t * 0.9 + k / 3) % 1) + 1) % 1;
                        return <path key={k} d={`M${-20 + q * 90},${-70 - q * 10} a${22 + q * 26},${48 + q * 20} 0 0 1 0,${96 + q * 40}`} fill="none" stroke={C.blue} strokeWidth={5} opacity={(1 - q) * 0.9} />;
                      })}
                      <ShahedTop x={80} y={-40 + Math.sin(t * 7) * 6} r={-90 + Math.sin(t * 5) * 14} s={0.12} />
                    </g>
                  )}
                  {i === 2 && (
                    <g>
                      <ShahedTop x={-40 + loop * 150} y={-50 + Math.sin(t * 2) * 6} r={-90} s={0.12} />
                      <FPVSide x={-120 + loop * 150} y={-15 - loop * 30} s={0.32} r={-10} />
                    </g>
                  )}
                </Lens>
                <Gauge x={x} y={800} value={c.value * prog(t, T.probability - 0.2, T.success + 0.3, "power2.out")} label="" color={C.green} s={1.1} />
              </g>
            );
          })}
          {/* the missile's own lens and gauge, for comparison */}
          {t > T.probability - 0.3 && (
            <g>
              <Lens id="cheap-missile" x={1620} y={450} r={130} t={t} s={ease("back.out(1.5)")(clamp01((t - T.probability + 0.3) / 0.55))} ring={C.red} sky="dusk" label="MISSILE" labelP={prog(t, T.probability, T.probability + 0.5, "none")}>
                <g transform={`translate(${-40 + ((((t - T.probability) * 0.35) % 1) + 1) % 1 * 90} ${10 - ((((t - T.probability) * 0.35) % 1) + 1) % 1 * 70}) rotate(-35) scale(0.3)`}>
                  <Interceptor kind="pac3" flame={1} />
                </g>
              </Lens>
              <Gauge x={1620} y={800} value={0.92 * prog(t, T.probability - 0.1, T.success + 0.4, "power2.out")} color={C.red} s={1.1} />
              <Pulse x={1620} y={790} p={prog(t, T.condition, T.condition + 0.9, "none")} r={105} color={C.red} width={6} />
            </g>
          )}
        </g>
      )}
    </Stage>
  );
};
