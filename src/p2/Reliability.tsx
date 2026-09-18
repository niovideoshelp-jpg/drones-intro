import React from "react";
import { C } from "../design";
import { FPVTop, ShahedTop } from "../art/drones";
import { Interceptor, JammerMastRef, SunMoon } from "./shared";
import { Gauge } from "../art/p2art";
import { Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
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

const PARTS = [
  { t: T.sensors, label: "SENSORS", dx: 150, dy: -230 },
  { t: T.links, label: "DATA LINKS", dx: -40, dy: -230 },
  { t: T.navigation, label: "NAVIGATION", dx: -230, dy: 230 },
  { t: T.control, label: "CONTROL SURFACES", dx: 40, dy: 250 },
  { t: T.motors, label: "MOTORS", dx: -300, dy: -230 },
];

const CHEAP = [
  { t: T.guns, label: "GUNS", value: 0.45 },
  { t: T.jammers, label: "JAMMERS", value: 0.35 },
  { t: T.drones, label: "INTERCEPTOR DRONES", value: 0.5 },
];

export const Reliability: React.FC = () => {
  const t = useTime();
  if (t < RELIABILITY_RANGE[0] || t > RELIABILITY_RANGE[1]) return null;

  const missA = win(t, T.theres - 0.2, T.guns - 0.3, 0.5, 0.5);
  const missIn = ease("back.out(1.4)")(clamp01((t - T.modern + 0.3) / 0.7));
  const MX = 860;
  const MY = 470;

  /* day / night, range, reaction */
  const dayP = prog(t, T.day - 0.2, T.night + 0.5, "none");
  const rangeP = prog(t, T.longer - 0.2, T.distances + 0.4, "power2.out");
  const reactP = prog(t, T.react - 0.2, T.direction + 0.3, "power1.inOut");

  /* cheaper options */
  const cheapA = win(t, T.guns - 0.4, T.and + 0.6, 0.4, 0.5);

  return (
    <Stage>
      {missA > 0 && (
        <g opacity={missA}>
          <Tag x={960} y={180} text="RELIABILITY" p={prog(t, T.reliability - 0.2, T.reliability + 0.5, "none")} size={44} accent={C.cyan} />
          {/* the shot is never a still frame: the tracking ring keeps turning */}
          <g opacity={0.5}>
            <circle cx={MX} cy={MY} r={250} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="14 18" transform={`rotate(${t * 24} ${MX} ${MY})`} />
            <Pulse x={MX} y={MY} p={((t * 0.45) % 1 + 1) % 1} r={430} color={C.cyan} width={4} />
          </g>
          <g transform={`translate(${MX} ${MY + Math.sin(t * 1.4) * 6}) scale(${1.5 * missIn})`}>
            <Interceptor kind="pac3" flame={0.5} />
          </g>
          {PARTS.map((p) => {
            const k = ease("back.out(1.6)")(clamp01((t - p.t + 0.25) / 0.5));
            if (k <= 0) return null;
            const x = MX + p.dx;
            const y = MY + p.dy;
            const ax = MX + p.dx * 0.42;
            const ay = MY + (p.dy > 0 ? 28 : -28);
            return (
              <g key={p.label} opacity={k}>
                <path d={`M${x},${y + (p.dy > 0 ? -34 : 34)} L${ax},${ay}`} stroke={C.cyan} strokeWidth={4} strokeDasharray="10 8" />
                <circle cx={ax} cy={ay} r={12} fill={C.cyan} stroke={C.ink} strokeWidth={4} />
                <Tag x={x} y={y} text={p.label} p={prog(t, p.t, p.t + 0.5, "none")} size={30} accent={C.cyan} />
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

      {cheapA > 0 && (
        <g opacity={cheapA}>
          {CHEAP.map((c, i) => {
            const p = ease("back.out(1.5)")(clamp01((t - c.t + 0.3) / 0.55));
            if (p <= 0) return null;
            const x = 420 + i * 420;
            return (
              <g key={c.label} opacity={p}>
                <g transform={`translate(${x} 450) scale(${p})`}>
                  <circle r={130} fill={C.ink} fillOpacity={0.9} stroke={C.green} strokeWidth={6} />
                  <circle r={156} fill="none" stroke={C.green} strokeWidth={3} strokeDasharray="10 14" opacity={0.5} transform={`rotate(${(i % 2 ? -1 : 1) * t * 28})`} />
                  {i === 0 && <path d="M-70,40 L70,40 L48,0 L-48,0Z M-14,0 L-14,-18 L70,-70 M14,0 L14,-18 L86,-52" fill={C.olive} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />}
                  {i === 1 && <JammerMastRef />}
                  {i === 2 && <FPVTop s={0.7} payload={false} />}
                </g>
                <Tag x={x} y={620} text={c.label} p={prog(t, c.t, c.t + 0.5, "none")} size={26} accent={C.green} />
                <Gauge x={x} y={800} value={c.value * prog(t, T.probability - 0.2, T.success + 0.3, "power2.out")} label="" color={C.green} s={1.1} />
              </g>
            );
          })}
          {/* the missile's own gauge, for comparison */}
          {t > T.probability - 0.3 && (
            <g opacity={prog(t, T.probability - 0.3, T.probability + 0.3)}>
              <g transform="translate(1620 450) scale(0.9)">
                <Interceptor kind="pac3" s={0.8} r={-35} />
              </g>
              <Tag x={1620} y={620} text="MISSILE" p={prog(t, T.probability, T.probability + 0.5, "none")} size={26} accent={C.red} />
              <Gauge x={1620} y={800} value={0.92 * prog(t, T.probability - 0.1, T.success + 0.4, "power2.out")} color={C.red} s={1.1} />
              <Pulse x={1620} y={800} p={prog(t, T.condition, T.condition + 0.9, "none")} r={220} color={C.red} width={6} />
            </g>
          )}
          <Tag x={960} y={200} text="PROBABILITY OF SUCCESS" p={prog(t, T.probability - 0.1, T.success + 0.4, "none")} size={38} accent={C.cream} />
        </g>
      )}
    </Stage>
  );
};
