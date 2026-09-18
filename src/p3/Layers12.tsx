import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { JammerMast } from "../art/ground";
import { Glyph } from "../art/p2art";
import { FiberSpool } from "../art/p3art";
import { NoSign } from "../p2/shared";
import { PriceTag, Pulse, Query, Reticle, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { board, clamp01, ease, prog, useTime } from "../lib/kf";
import { Lens } from "../art/lens";
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
  const infoB = board(t, T.first - 0.2, T.then);
  const idFade = 1 - prog(t, T.decoy - 0.7, T.decoy - 0.2);
  const droneP = ease("back.out(1.4)")(clamp01((t - T.information + 0.2) / 0.7));
  const droneX = 1500 - prog(t, T.information, T.after, "none") * 520;
  const idP = prog(t, T.identify - 0.1, T.threat + 0.3, "back.out(2)");
  const trajP = prog(t, T.trajectory - 0.2, T.after + 0.2, "power2.out");

  /* ---------------- layer 2: electronic warfare ---------------- */
  const ewB = board(t, T.then - 0.1, T.but + 0.2);
  const jamP = prog(t, T.jamming - 0.2, T.signals + 0.4, "power2.out");
  const many = prog(t, T.singleSys - 0.2, T.once + 0.2, "power2.out");

  /* ---------------- the limits of jamming ---------------- */
  const limB = board(t, T.but, T.when + 0.4);

  return (
    <Stage>
      {infoB.op > 0 && (
        <g opacity={infoB.op} transform={infoB.tf}>
          <Tag x={960} y={150} text="KNOW WHAT IS COMING" p={prog(t, T.information - 0.2, T.coming + 0.4, "none")} size={40} accent={C.cyan} />
          {/* the identification picture: fades out when the three wasted-shot cases take the centre */}
          <g opacity={idFade}>
            {/* the picture being assembled — live from the first word of the layer */}
            <g opacity={prog(t, T.information - 0.3, T.information + 0.5) * (1 - prog(t, T.identify, T.identify + 0.6))}>
              <circle cx={960} cy={470} r={34} fill="none" stroke={C.cyan} strokeWidth={4} />
              <circle cx={960} cy={470} r={92} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="10 12" transform={`rotate(${t * 40} 960 470)`} opacity={0.8} />
              <Pulse x={960} y={470} p={((t * 0.6) % 1 + 1) % 1} r={300} color={C.cyan} width={4} />
            </g>
            {/* the incoming object */}
            <g opacity={droneP}>
              <path d={`M1880,300 L${droneX + 70},300`} stroke={C.red} strokeWidth={4} strokeDasharray="12 9" strokeDashoffset={-t * 30} opacity={0.7} />
              <ShahedTop x={droneX} y={300 + Math.sin(t * 2) * 6} r={-90} s={0.34} />
              {prog(t, T.before, T.know) > 0 && prog(t, T.identify - 0.2, T.identify) < 1 && <Query x={droneX + 120} y={250} s={0.8} color={C.amber} />}
            </g>
            {/* sensors feeding one picture */}
            {SENSORS.map((s, i) => {
              const p = ease("back.out(1.6)")(clamp01((t - s.t + 0.25) / 0.5));
              if (p <= 0) return null;
              const x = 480 + i * 320;
              const y = 700;
              const link = prog(t, s.t + 0.1, s.t + 0.7, "power2.out");
              return (
                <g key={s.label}>
                  <path d={`M${x},${y - 125} L${x + (960 - x) * link},${y - 125 - (y - 125 - 470) * link}`} stroke={C.cyan} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-t * 30} opacity={0.7} />
                  <Lens id={`sensor${i}`} x={x} y={y} r={105} t={t} s={p} ring={C.cyan} label={s.label} labelP={prog(t, s.t, s.t + 0.6, "none")}>
                    <g transform="translate(0 12)">
                      <Glyph kind={s.kind} s={0.62} />
                    </g>
                    <ShahedTop x={-60 + ((((t * 0.25 + i * 0.3) % 1) + 1) % 1) * 130} y={-62} r={-90} s={0.08} />
                  </Lens>
                </g>
              );
            })}
            {/* the fused picture */}
            {idP > 0 && (
              <g>
                <Reticle x={droneX} y={300} size={190} lock={idP * 1.6} color={C.cyan} />
                <Tag x={droneX} y={430} text="IDENTIFIED" p={idP} size={28} accent={C.cyan} />
              </g>
            )}
            {/* where it is heading: a straight predicted track toward the defended site, above the sensors */}
            {trajP > 0 && (
              <g opacity={trajP}>
                <path d={`M${droneX - 70},300 L${droneX - 70 - 560 * trajP},${300 + 140 * trajP}`} fill="none" stroke={C.amber} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-t * 40} />
                <Reticle x={droneX - 70 - 560 * trajP} y={300 + 140 * trajP} size={110} lock={trajP * 1.4} color={C.amber} />
              </g>
            )}
          </g>
          {/* what good identification saves you from — each case alone at the centre */}
          {WASTE.map((w, i) => {
            const p = ease("back.out(1.6)")(clamp01((t - w.t + 0.4) / 0.5));
            if (p <= 0) return null;
            const x = 480 + i * 480;
            const fall = i === 1 ? ((((t - w.t) * 0.35) % 1) + 1) % 1 : 0;
            return (
              <g key={w.label} opacity={1 - prog(t, T.then - 0.4, T.then)}>
                <Lens id={`waste${i}`} x={x} y={500} r={150} t={t} s={p} ring={C.red} sky={i === 1 ? "storm" : "day"} label={w.label} labelP={prog(t, w.t, w.t + 0.6, "none")}>
                  {i === 0 && (
                    <g>
                      <ShahedTop x={-30 + Math.sin(t * 1.3) * 20} y={-50} r={-90} s={0.2} opacity={0.45} />
                      <path d="M-80,-20 L40,-20" stroke={C.cream} strokeWidth={3} strokeDasharray="6 8" opacity={0.5} />
                    </g>
                  )}
                  {i === 1 && (
                    <g>
                      <ShahedTop x={-60 + fall * 90} y={-80 + fall * 140} r={-90 + fall * 120} s={0.2} tone="#6E6A64" />
                      {[0, 1, 2].map((k) => (
                        <circle key={k} cx={-70 + fall * 90 - k * 18} cy={-90 + fall * 140 - k * 16} r={10 + k * 5} fill="#5A5856" opacity={0.5 - k * 0.12} />
                      ))}
                    </g>
                  )}
                  {i === 2 && <ShahedTop x={-80 + ((((t - w.t) * 0.2) % 1) + 1) % 1 * 200} y={-60} r={-70} s={0.16} />}
                </Lens>
                <NoSign x={x} y={500} p={prog(t, w.t, w.t + 0.5, "none")} r={160} />
              </g>
            );
          })}
        </g>
      )}

      {ewB.op > 0 && (
        <g opacity={ewB.op} transform={ewB.tf}>
          <g transform={`translate(400 ${760}) scale(${1.0 * ease("back.out(1.4)")(clamp01((t - T.then + 0.2) / 0.6))})`}>
            <JammerMast />
          </g>
          {jamP > 0 &&
            [0, 1, 2, 3].map((i) => {
              const k = (((t * 1.1 + i / 4) % 1) + 1) % 1;
              return (
                <path
                  key={i}
                  d={`M${470 + k * 650},${330 - k * 20} a${30 + k * 50},${180 + k * 60} 0 0 1 0,${360 + k * 120}`}
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
          <Tag x={960} y={150} text="JAM IT INSTEAD OF DESTROYING IT" p={prog(t, T.jamming - 0.2, T.destroying + 0.3, "none")} size={38} accent={C.blue} />
        </g>
      )}

      {limB.op > 0 && (
        <g opacity={limB.op} transform={limB.tf}>
          <Tag x={960} y={150} text="WHERE JAMMING STOPS WORKING" p={prog(t, T.limits - 0.2, T.limits + 0.6, "none")} size={38} accent={C.red} />
          {/* autonomous navigation: the jamming arrives and the drone flies on */}
          {(() => {
            const p = ease("back.out(1.5)")(clamp01((t - T.but) / 0.7));
            if (p <= 0) return null;
            return (
              <g opacity={1 - prog(t, T.fiber - 0.5, T.fiber)}>
                {[0, 1, 2].map((k) => {
                  const q = (((t - T.limits) * 0.55 + k / 3) % 1 + 1) % 1;
                  return <path key={k} d={`M${420 + q * 260},${330 - q * 30} a${40 + q * 50},${170 + q * 30} 0 0 1 0,${340 + q * 60}`} fill="none" stroke={C.blue} strokeWidth={7} opacity={p * (1 - q) * 0.85} />;
                })}
                <Lens id="auto" x={1010} y={500} r={200} t={t} s={p} sky="dusk" label="INERTIAL / VISUAL NAV" labelP={prog(t, T.inertial - 0.1, T.visual + 0.5, "none")}>
                  <ShahedTop x={-10 + Math.sin(t * 1.6) * 30} y={-40 + Math.sin(t * 2.3) * 10} r={-90} s={0.36} />
                  <g transform="translate(-110 -120)">
                    <Glyph kind="optic" s={0.5} />
                  </g>
                  {[0, 1, 2, 3].map((k) => (
                    <path key={k} d={`M${-200 + k * 120},84 L${-150 + k * 120},84`} stroke={C.cream} strokeWidth={3} strokeDasharray="8 8" strokeDashoffset={-t * 60} opacity={0.5} />
                  ))}
                </Lens>
                <Pulse x={1010} y={500} p={prog(t, T.jam, T.jam + 0.9, "none")} r={260} color={C.amber} width={6} />
              </g>
            );
          })()}
          {/* fibre-optic control: the spool pays out and there is no signal left to jam */}
          {(() => {
            const p = ease("back.out(1.5)")(clamp01((t - T.fiber + 0.4) / 0.6));
            if (p <= 0) return null;
            const pay = prog(t, T.fiber, T.flight + 0.3, "power1.inOut");
            const dx = 700 + 620 * pay;
            const dy = 720 - 300 * pay;
            return (
              <g opacity={p * (1 - prog(t, T.indiscriminate - 0.5, T.indiscriminate))}>
                <path d="M300,820 L1620,820" stroke={C.cream} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
                <g transform={`translate(640 820) scale(${0.9 * p})`}>
                  <FiberSpool pay={pay} />
                </g>
                <ShahedTop x={dx} y={dy + Math.sin(t * 2) * 6} r={-70} s={0.32 * p} />
                <Tag x={960} y={900} text="FIBRE-OPTIC LINK" p={prog(t, T.cable - 0.2, T.cable + 0.5, "none")} size={30} accent={C.cyan} />
                {[0, 1].map((k) => {
                  const q = (((t * 0.8 + k / 2) % 1) + 1) % 1;
                  return <path key={k} d={`M${1500 - q * 120},${330} a${30 + q * 30},${80 + q * 20} 0 0 0 0,${160 + q * 40}`} fill="none" stroke={C.blue} strokeWidth={6} opacity={(1 - q) * 0.7} />;
                })}
                <NoSign x={1480} y={420} p={prog(t, T.eliminates, T.eliminates + 0.6, "none")} r={80} />
              </g>
            );
          })()}
          {/* jamming your own side */}
          {(() => {
            const p = ease("back.out(1.5)")(clamp01((t - T.indiscriminate + 0.3) / 0.6));
            if (p <= 0) return null;
            return (
              <g>
                <Lens id="own" x={960} y={500} r={200} t={t} s={p} ring={C.red} sky="storm" label="OWN COMMS JAMMED TOO" labelP={prog(t, T.interfere, T.comms + 0.3, "none")}>
                  <g transform="translate(-70 30)">
                    <Glyph kind="link" s={0.8} color={C.cream} />
                  </g>
                  <g transform="translate(90 30)">
                    <Glyph kind="radar" s={0.7} color={C.cream} />
                  </g>
                  {[0, 1, 2].map((k) => {
                    const q = (((t * 0.9 + k / 3) % 1) + 1) % 1;
                    return <circle key={k} cx={0} cy={-20} r={20 + q * 170} fill="none" stroke={C.blue} strokeWidth={5} opacity={(1 - q) * 0.7} />;
                  })}
                </Lens>
                <NoSign x={960} y={500} p={prog(t, T.interfere, T.comms + 0.2, "none")} r={215} />
              </g>
            );
          })()}
        </g>
      )}
    </Stage>
  );
};
