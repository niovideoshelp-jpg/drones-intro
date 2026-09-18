import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { LauncherSide } from "../art/ground";
import { Big, Interceptor } from "./shared";
import { Bracket, Glyph, WaterLine } from "../art/p2art";
import { DocPage, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { board, clamp01, ease, prog, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  cost: at("cost", 89),
  either: at("either."),
  detect: at("detect"),
  ground: at("ground,"),
  classify: at("classify"),
  track: at("track"),
  pass: at("pass"),
  along: at("along,"),
  authorize: at("authorize"),
  shot: at("shot."),
  takes: at("takes"),
  radars: at("radars,"),
  optical: at("optical"),
  acoustic: at("acoustic"),
  comms: at("communication"),
  command: at("command"),
  trained: at("trained"),
  maintenance: at("maintenance,"),
  power: at("power,"),
  clock: at("round-the-clock"),
  coverage: at("coverage."),
  reuters: at("Reuters"),
  competition: at("competition,"),
  complete: at("complete"),
  battery: at("battery"),
  billion: at("billion"),
  dollars: at("dollars."),
  interceptorW: at("interceptor", 118),
  visible: at("visible"),
  tip: at("tip"),
  structure: at("structure."),
  and2: at("And", 122.8),
};
export const CHAIN_RANGE = [T.cost - 0.3, T.and2 + 0.8] as const;

const STEPS = [
  { t: T.detect, label: "DETECT" },
  { t: T.classify, label: "CLASSIFY" },
  { t: T.track, label: "TRACK" },
  { t: T.pass, label: "PASS ON" },
  { t: T.authorize, label: "AUTHORIZE" },
];

const KIT = [
  { t: T.radars, kind: "radar" as const, label: "RADAR" },
  { t: T.optical, kind: "optic" as const, label: "OPTICAL" },
  { t: T.acoustic, kind: "acoustic" as const, label: "ACOUSTIC" },
  { t: T.comms, kind: "link" as const, label: "LINKS" },
  { t: T.command, kind: "command" as const, label: "COMMAND" },
  { t: T.trained, kind: "people" as const, label: "PEOPLE" },
  { t: T.maintenance, kind: "maint" as const, label: "MAINTENANCE" },
  { t: T.power, kind: "power" as const, label: "POWER" },
  { t: T.clock, kind: "clock" as const, label: "24/7" },
];

export const Chain: React.FC = () => {
  const t = useTime();
  if (t < CHAIN_RANGE[0] || t > CHAIN_RANGE[1]) return null;

  /* the kit replaces the chain on screen instead of landing on top of it */
  const chainB = board(t, T.cost - 0.2, T.takes + 0.15);
  const kitB = board(t, T.takes - 0.2, T.interceptorW - 0.3);
  const bergB = board(t, T.interceptorW - 0.3, T.and2 + 0.1);
  const kitShown = KIT.reduce((n, k) => n + clamp01((t - k.t + 0.25) / 0.45), 0);
  /* how many steps are on screen, smoothly: the chain stays centred while it grows */
  const shown = STEPS.reduce((n, st) => n + clamp01((t - st.t + 0.25) / 0.45), 0);

  const gather = prog(t, T.complete - 0.2, T.billion, "power2.inOut");
  const billion = prog(t, T.billion - 0.1, T.dollars + 0.3, "back.out(1.6)");

  return (
    <Stage>
      {chainB.op > 0 && (
        <g opacity={chainB.op} transform={chainB.tf}>
          {/* the threat keeps coming while the chain is built */}
          {(() => {
            const dx = 140 + prog(t, T.cost, T.takes, "none") * 1500;
            return (
              <g>
                <path d={`M60,370 L${dx - 60},370`} stroke={C.red} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-t * 26} opacity={0.6} />
                <ShahedTop x={dx} y={370 + Math.sin(t * 1.7) * 12} r={90} s={0.28} />
              </g>
            );
          })()}
          {STEPS.map((s, i) => {
            const p = ease("back.out(1.6)")(clamp01((t - s.t + 0.25) / 0.45));
            const x = 960 + (i - (shown - 1) / 2) * 330;
            const y = 560;
            if (p <= 0) return null;
            const link = i === 0 ? 0 : prog(t, s.t - 0.35, s.t, "power2.out");
            return (
              <g key={s.label}>
                {i > 0 && (
                  <g opacity={link}>
                    <path d={`M${x - 330 + 120},${y} L${x - 120 - 26 * link},${y}`} stroke={C.cyan} strokeWidth={6} />
                    <path d={`M${x - 146},${y - 16} L${x - 120},${y} L${x - 146},${y + 16}`} stroke={C.cyan} strokeWidth={6} fill="none" strokeLinejoin="round" />
                  </g>
                )}
                <g transform={`translate(${x} ${y}) scale(${p})`}>
                  <circle r={112} fill={C.ink} fillOpacity={0.92} stroke={C.cyan} strokeWidth={6} />
                  <circle r={140} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="9 13" opacity={0.55} transform={`rotate(${t * 28 + i * 40})`} />
                  <Big x={0} y={26} text={String(i + 1)} size={84} color={C.cyan} />
                </g>
                <Tag x={x} y={y + 170} text={s.label} p={prog(t, s.t, s.t + 0.5, "none")} size={30} accent={C.cyan} />
                <Pulse x={x} y={y} p={prog(t, s.t, s.t + 0.8, "none")} r={190} color={C.cyan} width={5} />
              </g>
            );
          })}
          <Tag x={960} y={220} text="EVERY SHOT NEEDS THIS CHAIN" p={prog(t, T.either - 0.1, T.detect, "none")} size={36} accent={C.cream} />
        </g>
      )}

      {kitB.op > 0 && (
        <g opacity={kitB.op} transform={kitB.tf}>
          {KIT.map((k, i) => {
            const p = ease("back.out(1.7)")(clamp01((t - k.t + 0.25) / 0.45));
            if (p <= 0) return null;
            const x0 = 960 + (i - (kitShown - 1) / 2) * 170;
            const y0 = 640;
            const x = x0 + (960 - x0) * gather;
            const y = y0 + (700 - y0) * gather;
            const s = p * (1 - 0.6 * gather);
            const fade = 1 - clamp01((gather - 0.55) / 0.35);
            return (
              <g key={k.label}>
                <g transform={`translate(${x} ${y}) scale(${Math.max(0.001, s)})`} opacity={fade}>
                  <circle r={92} fill={C.ink} fillOpacity={0.9} stroke={C.cyan} strokeWidth={5} />
                  <Glyph kind={k.kind} s={0.9} />
                </g>
                <g opacity={1 - clamp01(gather * 2.5)}>
                  <Tag x={x0} y={790} text={k.label} p={prog(t, k.t, k.t + 0.5, "none")} size={22} accent={C.cyan} />
                </g>
              </g>
            );
          })}
          {t > T.reuters - 0.4 && (
            <g opacity={win(t, T.reuters - 0.4, T.interceptorW - 0.2, 0.3, 0.4)}>
              <DocPage x={330} y={300} s={0.32} r={-6} lines={1} chart={prog(t, T.reuters, T.competition)} tab={C.amber} />
              <Tag x={520} y={300} text="REUTERS" p={prog(t, T.reuters, T.reuters + 0.5, "none")} size={36} accent={C.amber} anchor="start" />
            </g>
          )}
          {/* every piece merges into one battery */}
          {gather > 0.5 && (
            <g transform={`translate(960 ${800}) scale(${0.62 * ease("back.out(1.6)")(clamp01((gather - 0.5) / 0.5))})`}>
              <LauncherSide elev={42} />
            </g>
          )}
          {billion > 0 && (
            <g>
              <Bracket x0={520} y={430} x1={1400} p={billion} color={C.amber} />
              <Big x={960} y={380} text="$1,000,000,000+" size={96 * (0.9 + 0.1 * billion)} color={C.amber} />
              <Tag x={960} y={480} text="ONE COMPLETE BATTERY" p={prog(t, T.battery - 0.2, T.battery + 0.5, "none")} size={32} accent={C.amber} />
            </g>
          )}
        </g>
      )}

      {bergB.op > 0 && (
        <g opacity={bergB.op} transform={bergB.tf}>
          <WaterLine y={470} p={prog(t, T.interceptorW - 0.2, T.visible, "power2.out")} />
          <g transform={`translate(960 ${330 + Math.sin(t * 1.4) * 6}) scale(0.9)`}>
            <Interceptor kind="pac3" flame={0.4} r={-30} />
          </g>
          <Tag x={960} y={200} text="THE VISIBLE TIP" p={prog(t, T.visible - 0.1, T.tip + 0.4, "none")} size={40} accent={C.cream} />
          {(() => {
            const p = prog(t, T.tip - 0.1, T.structure + 0.4, "power2.out");
            if (p <= 0) return null;
            return (
              <g opacity={p}>
                <path d={`M${960 - 760 * p},520 L${960 + 760 * p},520 L${960 + 520 * p},960 L${960 - 520 * p},960Z`} fill={C.cyan} opacity={0.08} stroke={C.cyan} strokeOpacity={0.4} strokeWidth={4} />
                {KIT.slice(0, 6).map((k, i) => (
                  <g key={k.label} transform={`translate(${520 + i * 176} ${600}) scale(${0.55 * p})`}>
                    <circle r={92} fill={C.ink} fillOpacity={0.85} stroke={C.cyan} strokeWidth={5} />
                    <Glyph kind={k.kind} s={0.9} />
                  </g>
                ))}
                <g transform={`translate(700 925) scale(${0.4 * p})`}>
                  <LauncherSide elev={40} />
                </g>
                <g transform={`translate(1260 925) scale(${0.4 * p})`}>
                  <LauncherSide elev={54} />
                </g>
                <Big x={960} y={750} text="$1,000,000,000+" size={78} color={C.amber} opacity={p} />
              </g>
            );
          })()}
        </g>
      )}
    </Stage>
  );
};
