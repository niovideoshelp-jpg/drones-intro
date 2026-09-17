import React from "react";
import { getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";
import { C } from "../design";
import { ReconDroneSide } from "../art/drones";
import { TankTop } from "../art/ground";
import { Pulse } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, kf, prog, rnd, useTime } from "../lib/kf";
import { useGsap } from "../lib/useGsap";
import { at } from "../lib/words";

const T = {
  over: at("Over"),
  drones: at("drones"),
  recon: at("reconnaissance"),
  tools: at("tools"),
  playing: at("playing"),
  bigger1: at("bigger"),
  bigger2: at("bigger", 6),
  role: at("role"),
  major: at("major"),
  military: at("military"),
  operations: at("operations."),
  one: at("One"),
};
export const INTRO_END = T.one + 0.4;

const GROUND_Y = 790;
const VEHICLES = [
  { x: 560, r: 90 },
  { x: 800, r: 80 },
  { x: 1130, r: 100 },
  { x: 1370, r: 85 },
];

const ARROWS = [
  { d: "M420,880 C700,850 900,910 1180,850", color: C.blue, t: 0 },
  { d: "M520,940 C820,960 1100,930 1420,890", color: C.blue, t: 0.25 },
];

const Arrow: React.FC<{ d: string; p: number; color: string }> = ({ d, p, color }) => {
  if (p <= 0) return null;
  const len = getLength(d);
  const at = Math.max(1, len * p);
  const pt = getPointAtLength(d, at) ?? { x: 0, y: 0 };
  const tan = getTangentAtLength(d, at) ?? { x: 1, y: 0 };
  const ang = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
  return (
    <g>
      <path d={d} fill="none" stroke={C.ink} strokeWidth={44} strokeDasharray={`${at} ${len + 10}`} strokeLinecap="butt" />
      <path d={d} fill="none" stroke={color} strokeWidth={34} strokeDasharray={`${at} ${len + 10}`} strokeLinecap="butt" />
      <path d={d} fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={6} strokeDasharray={`${at} ${len + 10}`} transform="translate(0 -9)" />
      <path d="M0,-44 L58,0 L0,44Z" transform={`translate(${pt.x} ${pt.y}) rotate(${ang})`} fill={color} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};

const Unit: React.FC<{ x: number; y: number; kind: "inf" | "arm"; p: number }> = ({ x, y, kind, p }) =>
  p <= 0 ? null : (
    <g transform={`translate(${x} ${y}) scale(${ease("back.out(2.5)")(clamp01(p))})`}>
      <rect x={-40} y={-26} width={80} height={52} fill={C.blue} stroke={C.ink} strokeWidth={5} />
      {kind === "inf" ? (
        <path d="M-40,-26 L40,26 M40,-26 L-40,26" stroke={C.ink} strokeWidth={4} />
      ) : (
        <ellipse rx={26} ry={13} fill="none" stroke={C.ink} strokeWidth={4} />
      )}
    </g>
  );

export const Intro: React.FC = () => {
  const t = useTime();
  if (t > INTRO_END) return null;
  return <IntroInner />;
};

const IntroInner: React.FC = () => {
  const t = useTime();
  const scope = useGsap<SVGGElement>((tl, q) => {
    // hero drone: fly in, settle, grow twice, then leave with the formation
    tl.fromTo(q(".hero"), { x: -1500, y: -120, rotation: -6 }, { x: 0, y: 0, rotation: 0, duration: T.drones + 0.35, ease: "power3.out" }, 0);
    tl.to(q(".hero"), { scale: 1.16, duration: 0.45, ease: "back.out(3)", transformOrigin: "50% 50%" }, T.bigger1 - 0.05);
    tl.to(q(".hero"), { scale: 1.3, duration: 0.45, ease: "back.out(3)", transformOrigin: "50% 50%" }, T.bigger2 - 0.05);
    tl.to(q(".hero"), { y: -90, duration: 0.8, ease: "power2.inOut" }, T.major - 0.2);
    tl.to(q(".hero"), { x: 1500, y: -520, rotation: -12, duration: 0.9, ease: "power3.in" }, T.one - 0.55);
    tl.fromTo(q(".wing"), { x: -900, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.12 }, T.bigger2 - 0.1);
    tl.to(q(".wing"), { x: 1400, y: -500, duration: 0.9, ease: "power3.in", stagger: 0.08 }, T.one - 0.6);
    // ground strip
    tl.fromTo(q(".ground"), { scaleX: 0, transformOrigin: "50% 50%" }, { scaleX: 1, duration: 0.9, ease: "expo.out" }, T.over + 0.2);
    tl.to(q(".ground"), { scaleX: 0, opacity: 0, duration: 0.5, ease: "power3.in" }, T.one - 0.4);
  });

  const scanP = prog(t, T.recon - 0.15, T.playing, "power1.inOut");
  const scanA = Math.min(prog(t, T.recon - 0.2, T.recon + 0.2), 1 - prog(t, T.playing - 0.1, T.playing + 0.3));
  const gimbal = kf(t, [
    [T.recon - 0.4, 20],
    [T.recon, 90, "power2.out"],
    [T.playing, 90],
    [T.playing + 0.4, 30],
  ]);
  const sway = Math.sin(t * 1.4) * 6;
  const armed = t >= T.bigger1;
  const coneX = 470 + scanP * 980;
  const opsA = prog(t, T.major - 0.1, T.major + 0.3);
  const endFade = 1 - prog(t, T.one - 0.3, T.one + 0.3);

  return (
    <Stage>
      <g ref={scope} opacity={endFade}>
        {/* ground strip with vehicles */}
        <g className="ground">
          <path d={`M340,${GROUND_Y - 56} L1580,${GROUND_Y - 56} C1610,${GROUND_Y - 56} 1610,${GROUND_Y + 56} 1580,${GROUND_Y + 56} L340,${GROUND_Y + 56} C310,${GROUND_Y + 56} 310,${GROUND_Y - 56} 340,${GROUND_Y - 56}Z`} fill={C.sand} stroke={C.ink} strokeWidth={5} />
          <path d={`M340,${GROUND_Y + 8} C700,${GROUND_Y - 10} 1100,${GROUND_Y + 22} 1580,${GROUND_Y}`} fill="none" stroke="#9A8A62" strokeWidth={10} />
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={i} cx={380 + i * 78 + rnd(i) * 30} cy={GROUND_Y - 34 + rnd(i, 2) * 68} r={10 + rnd(i, 3) * 9} fill="#6E7A45" stroke={C.ink} strokeWidth={2} />
          ))}
          {VEHICLES.map((v, i) => (
            <TankTop key={i} x={v.x} y={GROUND_Y} s={0.4} r={v.r} />
          ))}
        </g>

        {/* scan cone from the gimbal to the ground */}
        {scanA > 0 && (
          <g opacity={scanA}>
            <path d={`M1139,${500 + sway} L${coneX - 120},${GROUND_Y - 30} L${coneX + 120},${GROUND_Y - 30}Z`} fill={C.cyan} opacity={0.22} />
            <path d={`M1139,${500 + sway} L${coneX - 120},${GROUND_Y - 30} M1139,${500 + sway} L${coneX + 120},${GROUND_Y - 30}`} stroke={C.cyan} strokeWidth={3} strokeDasharray="10 8" />
            {VEHICLES.map((v, i) => {
              const hit = prog(t, T.recon - 0.15 + ((v.x - 470) / 980) * (T.playing - T.recon + 0.15), T.recon + ((v.x - 470) / 980) * (T.playing - T.recon) + 0.25, "back.out(3)");
              return hit > 0 ? (
                <g key={i}>
                  <rect x={v.x - 50} y={GROUND_Y - 50} width={100} height={100} fill="none" stroke={C.red} strokeWidth={4} transform={`translate(${v.x} ${GROUND_Y}) scale(${2 - hit}) translate(${-v.x} ${-GROUND_Y})`} />
                  <Pulse x={v.x} y={GROUND_Y} p={prog(t, T.recon + ((v.x - 470) / 980) * (T.playing - T.recon), T.recon + ((v.x - 470) / 980) * (T.playing - T.recon) + 0.7, "none")} r={70} />
                </g>
              ) : null;
            })}
          </g>
        )}

        {/* operation arrows + unit symbols */}
        {opsA > 0 && (
          <g>
            {ARROWS.map((a, i) => (
              <Arrow key={i} d={a.d} color={a.color} p={prog(t, T.major + a.t, T.operations + 0.4 + a.t, "power2.inOut")} />
            ))}
            <Unit x={420} y={880} kind="inf" p={prog(t, T.major - 0.05, T.major + 0.35)} />
            <Unit x={520} y={940} kind="arm" p={prog(t, T.military, T.military + 0.4)} />
          </g>
        )}

        {/* air streaks sell the forward flight while the drone holds centre frame */}
        <g opacity={prog(t, 0.6, 1.4) * (1 - prog(t, T.one - 0.7, T.one - 0.3))}>
          {Array.from({ length: 16 }, (_, i) => {
            const len = 120 + rnd(i, 7) * 200;
            const x = ((((rnd(i, 3) * 2400 - t * (700 + rnd(i, 4) * 500)) % 2400) + 2400) % 2400) - 240;
            const y = 170 + rnd(i, 5) * 480;
            return <path key={i} d={`M${x},${y} L${x + len},${y}`} stroke={C.cream} strokeOpacity={0.18 + rnd(i, 6) * 0.2} strokeWidth={3 + rnd(i, 8) * 3} strokeLinecap="round" />;
          })}
        </g>

        {/* formation wingmen */}
        <g className="wing">
          <ReconDroneSide x={420} y={200 + sway * 0.6} s={0.5} armed gimbal={40} lights={false} />
        </g>
        <g className="wing">
          <ReconDroneSide x={1500} y={230 - sway * 0.5} s={0.46} armed gimbal={40} lights={false} />
        </g>

        {/* hero */}
        <g className="hero">
          <g transform={`translate(960 ${440 + sway})`}>
            <ReconDroneSide s={1.25} gimbal={gimbal} armed={armed} />
          </g>
        </g>
      </g>
    </Stage>
  );
};
