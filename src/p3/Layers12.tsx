import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { JammerMast } from "../art/ground";
import { Glyph } from "../art/p2art";
import { FiberSpool } from "../art/p3art";
import { NoSign } from "../p2/shared";
import { PriceTag, Pulse, Query, Reticle, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  first: at("first"),
  information: at("information."),
  before: at("Before"),
  know: at("know"),
  coming: at("coming"),
  acoustic: at("Acoustic"),
  radars: at("radars,"),
  thermal: at("thermal"),
  cameras: at("cameras,"),
  fusion: at("fusion"),
  identify: at("identify"),
  threat: at("threat,"),
  trajectory: at("trajectory,"),
  after: at("after."),
  better: at("better"),
  waste: at("waste"),
  decoy: at("decoy,"),
  fall: at("fall"),
  anyway: at("anyway,"),
  immediate: at("immediate"),
  danger: at("danger."),
  then: at("Then"),
  ew: at("warfare.", 51),
  jamming: at("Jamming"),
  signals: at("signals"),
  navigation: at("navigation", 55),
  cheaper: at("cheaper"),
  destroying: at("destroying"),
  singleSys: at("single", 60),
  several: at("several"),
  once: at("once."),
  but: at("But", 64),
  limits: at("limits"),
  autonomously: at("autonomously"),
  inertial: at("inertial"),
  visual: at("visual"),
  jam: at("jam."),
  fiber: at("fiber"),
  cable: at("cable,"),
  eliminates: at("eliminates"),
  flight: at("flight."),
  indiscriminate: at("indiscriminate"),
  interfere: at("interfere"),
  comms: at("communications."),
  when: at("When"),
};
export const LAYERS12_RANGE = [T.first - 0.3, T.when + 0.6] as const;

const SENSORS = [
  { t: T.acoustic, kind: "acoustic" as const, label: "ACOUSTIC" },
  { t: T.radars, kind: "radar" as const, label: "SHORT-RANGE RADAR" },
  { t: T.cameras, kind: "optic" as const, label: "THERMAL CAMERA" },
  { t: T.fusion, kind: "link" as const, label: "DATA FUSION" },
];

const WASTE = [
  { t: T.decoy, label: "DECOY" },
  { t: T.anyway, label: "ALREADY FALLING" },
  { t: T.danger, label: "NO IMMEDIATE DANGER" },
];

export const Layers12: React.FC = () => {
  const t = useTime();
  if (t < LAYERS12_RANGE[0] || t > LAYERS12_RANGE[1]) return null;

  /* ---------------- layer 1: information ---------------- */
  const infoA = win(t, T.first - 0.2, T.then - 0.1, 0.4, 0.5);
  const droneP = ease("back.out(1.4)")(clamp01((t - T.information + 0.2) / 0.7));
  const droneX = 1500 - prog(t, T.information, T.after, "none") * 520;
  const idP = prog(t, T.identify - 0.1, T.threat + 0.3, "back.out(2)");
  const trajP = prog(t, T.trajectory - 0.2, T.after + 0.2, "power2.out");

  /* ---------------- layer 2: electronic warfare ---------------- */
  const ewA = win(t, T.then - 0.2, T.but + 0.4, 0.4, 0.5);
  const jamP = prog(t, T.jamming - 0.2, T.signals + 0.4, "power2.out");
  const many = prog(t, T.singleSys - 0.2, T.once + 0.2, "power2.out");

  /* ---------------- the limits of jamming ---------------- */
  const limA = win(t, T.but - 0.1, T.when + 0.4, 0.4, 0.5);

  return (
    <Stage>
      {infoA > 0 && (
        <g opacity={infoA}>
          <Tag x={960} y={170} text="KNOW WHAT IS COMING" p={prog(t, T.information - 0.2, T.coming + 0.4, "none")} size={40} accent={C.cyan} />
          {/* the picture being assembled — live from the first word of the layer */}
          <g opacity={prog(t, T.information - 0.3, T.information + 0.5) * (1 - prog(t, T.identify, T.identify + 0.6))}>
            <circle cx={960} cy={470} r={34} fill="none" stroke={C.cyan} strokeWidth={4} />
            <circle cx={960} cy={470} r={92} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="10 12" transform={`rotate(${t * 40} 960 470)`} opacity={0.8} />
            <Pulse x={960} y={470} p={((t * 0.6) % 1 + 1) % 1} r={300} color={C.cyan} width={4} />
          </g>
          {/* the incoming object */}
          <g opacity={droneP}>
            <ShahedTop x={droneX} y={330} r={-90} s={0.34} />
            <path d={`M1780,330 L${droneX + 60},330`} stroke={C.red} strokeWidth={4} strokeDasharray="12 9" opacity={0.7} />
            {prog(t, T.before, T.know) > 0 && prog(t, T.identify - 0.2, T.identify) < 1 && <Query x={droneX} y={200} s={0.9} color={C.amber} />}
          </g>
          {/* sensors feeding one picture */}
          {SENSORS.map((s, i) => {
            const p = ease("back.out(1.6)")(clamp01((t - s.t + 0.25) / 0.5));
            if (p <= 0) return null;
            const x = 330 + i * 300;
            const y = 700;
            const link = prog(t, s.t + 0.1, s.t + 0.7, "power2.out");
            return (
              <g key={s.label}>
                <path d={`M${x},${y - 110} L${x + (960 - x) * link},${y - 110 - (y - 110 - 470) * link}`} stroke={C.cyan} strokeWidth={4} strokeDasharray="10 8" opacity={0.7} />
                <g transform={`translate(${x} ${y}) scale(${p})`}>
                  <circle r={104} fill={C.ink} fillOpacity={0.92} stroke={C.cyan} strokeWidth={5} />
                  <Glyph kind={s.kind} s={0.95} />
                </g>
                <Tag x={x} y={y + 150} text={s.label} p={prog(t, s.t, s.t + 0.6, "none")} size={24} accent={C.cyan} />
              </g>
            );
          })}
          {/* the fused picture */}
          {idP > 0 && (
            <g>
              <Reticle x={droneX} y={330} size={190} lock={idP * 1.6} color={C.cyan} />
              <Tag x={droneX + 190} y={250} text="IDENTIFIED" p={idP} size={28} accent={C.cyan} anchor="start" />
            </g>
          )}
          {trajP > 0 && (
            <g opacity={trajP}>
              <path
                d={`M${droneX},330 ${Array.from({ length: 16 }, (_, i) => {
                  const k = (i / 15) * trajP;
                  return `L${droneX - 520 * k},${330 + 260 * k * k}`;
                }).join(" ")}`}
                fill="none"
                stroke={C.amber}
                strokeWidth={5}
                strokeDasharray="14 10"
              />
              <Reticle x={droneX - 520 * trajP} y={330 + 260 * trajP * trajP} size={120} lock={trajP * 1.4} color={C.amber} />
            </g>
          )}
          {/* what good identification saves you from */}
          {WASTE.map((w, i) => {
            const p = ease("back.out(1.6)")(clamp01((t - w.t + 0.4) / 0.5));
            if (p <= 0) return null;
            const x = 430 + i * 530;
            return (
              <g key={w.label} opacity={p * (1 - prog(t, T.then - 0.4, T.then))}>
                <g transform={`translate(${x} 420) scale(${p})`}>
                  <circle r={118} fill={C.ink} fillOpacity={0.9} stroke={C.red} strokeWidth={5} />
                  <ShahedTop s={0.28} r={-90} opacity={0.75} />
                </g>
                <NoSign x={x} y={420} p={prog(t, w.t, w.t + 0.5, "none")} r={118} />
                <Tag x={x} y={580} text={w.label} p={prog(t, w.t, w.t + 0.6, "none")} size={26} accent={C.red} />
              </g>
            );
          })}
        </g>
      )}

      {ewA > 0 && (
        <g opacity={ewA}>
          <g transform={`translate(400 ${760}) scale(${1.0 * ease("back.out(1.4)")(clamp01((t - T.then + 0.2) / 0.6))})`}>
            <JammerMast />
          </g>
          {jamP > 0 &&
            [0, 1, 2, 3].map((i) => {
              const k = (((t * 1.1 + i / 4) % 1) + 1) % 1;
              return (
                <path
                  key={i}
                  d={`M${420 + k * 120},${420 - k * 40} a${60 + k * 320},${120 + k * 380} 0 0 1 0,${240 + k * 760}`}
                  fill="none"
                  stroke={C.blue}
                  strokeWidth={7}
                  opacity={jamP * (1 - k) * 0.9}
                />
              );
            })}
          {/* several aircraft at once */}
          {[0, 1, 2].map((i) => {
            const p = i === 0 ? jamP : many;
            if (p <= 0) return null;
            const x = 1180 + i * 240;
            const y = 300 + i * 190;
            const wob = p * Math.sin(t * 16 + i * 2) * 14;
            return (
              <g key={i} opacity={clamp01(p * 2)}>
                <ShahedTop x={x} y={y} r={-90 + wob} s={0.28} />
                <g transform={`translate(${x} ${y - 120})`} opacity={clamp01(p * 2)}>
                  {[0, 1, 2, 3].map((k) => (
                    <rect key={k} x={k * 14} y={-k * 10} width={9} height={12 + k * 10} fill={C.cream} stroke={C.ink} strokeWidth={2} opacity={0.5} />
                  ))}
                  <path d="M-8,-30 L60,16 M60,-30 L-8,16" stroke={C.red} strokeWidth={8} strokeLinecap="round" />
                </g>
              </g>
            );
          })}
          <PriceTag x={330} y={300} text="CHEAPER" size={44} color={C.green} s={prog(t, T.cheaper - 0.2, T.cheaper + 0.3, "back.out(2)")} />
          <Tag x={960} y={170} text="JAM IT INSTEAD OF DESTROYING IT" p={prog(t, T.jamming - 0.2, T.destroying + 0.3, "none")} size={38} accent={C.blue} />
        </g>
      )}

      {limA > 0 && (
        <g opacity={limA}>
          <Tag x={960} y={170} text="WHERE JAMMING STOPS WORKING" p={prog(t, T.limits - 0.2, T.limits + 0.6, "none")} size={38} accent={C.red} />
          {/* autonomous navigation */}
          {(() => {
            const p = ease("back.out(1.5)")(clamp01((t - T.limits + 0.2) / 0.7));
            if (p <= 0) return null;
            return (
              <g opacity={p * (1 - prog(t, T.fiber - 0.5, T.fiber))}>
                <g transform={`translate(520 520) scale(${p})`}>
                  <circle r={150} fill={C.ink} fillOpacity={0.9} stroke={C.amber} strokeWidth={6} />
                  <ShahedTop s={0.42} r={-90} />
                  <g transform="translate(-70 -90)">
                    <Glyph kind="optic" s={0.42} />
                  </g>
                </g>
                <Tag x={520} y={720} text="INERTIAL / VISUAL NAV" p={prog(t, T.inertial - 0.1, T.visual + 0.5, "none")} size={28} accent={C.amber} />
                <Pulse x={520} y={520} p={prog(t, T.jam, T.jam + 0.9, "none")} r={260} color={C.amber} width={6} />
              </g>
            );
          })()}
          {/* fibre-optic control */}
          {(() => {
            const p = ease("back.out(1.5)")(clamp01((t - T.fiber + 0.4) / 0.6));
            if (p <= 0) return null;
            const pay = prog(t, T.fiber, T.flight + 0.3, "power1.inOut");
            return (
              <g opacity={p * (1 - prog(t, T.indiscriminate - 0.5, T.indiscriminate))}>
                <g transform={`translate(430 780) scale(${0.9 * p})`}>
                  <FiberSpool pay={pay} />
                </g>
                <ShahedTop x={430 + 900 * pay} y={700 - 240 * pay} r={-70} s={0.3 * p} />
                <Tag x={620} y={846} text="FIBRE-OPTIC LINK" p={prog(t, T.cable - 0.2, T.cable + 0.5, "none")} size={28} accent={C.cyan} anchor="start" />
                <NoSign x={1180} y={420} p={prog(t, T.eliminates, T.eliminates + 0.6, "none")} r={70} />
              </g>
            );
          })()}
          {/* jamming your own side */}
          {(() => {
            const p = ease("back.out(1.5)")(clamp01((t - T.indiscriminate + 0.3) / 0.6));
            if (p <= 0) return null;
            return (
              <g opacity={p}>
                <g transform={`translate(1360 560) scale(${1.1 * p})`}>
                  <circle r={150} fill={C.ink} fillOpacity={0.9} stroke={C.red} strokeWidth={6} />
                  <Glyph kind="link" s={1.1} color={C.red} />
                </g>
                <NoSign x={1360} y={560} p={prog(t, T.interfere, T.comms + 0.2, "none")} r={150} />
                <Tag x={1360} y={780} text="OWN COMMS JAMMED TOO" p={prog(t, T.interfere, T.comms + 0.3, "none")} size={30} accent={C.red} />
              </g>
            );
          })()}
        </g>
      )}
    </Stage>
  );
};
