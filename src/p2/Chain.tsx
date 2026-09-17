import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { LauncherSide } from "../art/ground";
import { Big, Interceptor } from "./shared";
import { Bracket, Glyph, WaterLine } from "../art/p2art";
import { DocPage, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
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

  const chainA = win(t, T.cost - 0.2, T.reuters - 0.2, 0.4, 0.5);
  const kitA = win(t, T.takes - 0.3, T.interceptorW - 0.1, 0.4, 0.5);
  const bergA = win(t, T.interceptorW - 0.4, T.and2 + 0.6, 0.5, 0.5);

  const gather = prog(t, T.complete - 0.2, T.billion, "power2.inOut");
  const billion = prog(t, T.billion - 0.1, T.dollars + 0.3, "back.out(1.6)");

  return (
    <Stage>
      {chainA > 0 && (
        <g opacity={chainA}>
          <ShahedTop x={200} y={250 + Math.sin(t * 1.7) * 14} r={90} s={0.28} />
          <path d={`M120,250 L${200 + 60},250`} stroke={C.red} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-t * 26} opacity={0.6} />
          {STEPS.map((s, i) => {
            const p = ease("back.out(1.6)")(clamp01((t - s.t + 0.25) / 0.45));
            const x = 330 + i * 330;
            const y = 520;
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

      {kitA > 0 && (
        <g opacity={kitA}>
          {KIT.map((k, i) => {
            const p = ease("back.out(1.7)")(clamp01((t - k.t + 0.25) / 0.45));
            if (p <= 0) return null;
            const x0 = 280 + i * 170;
            const y0 = 620;
            const x = x0 + (960 - x0) * gather;
            const y = y0 + (700 - y0) * gather;
            const s = p * (1 - 0.45 * gather);
            return (
              <g key={k.label}>
                <g transform={`translate(${x} ${y}) scale(${s})`}>
                  <circle r={92} fill={C.ink} fillOpacity={0.9} stroke={C.cyan} strokeWidth={5} />
                  <Glyph kind={k.kind} s={0.9} />
                </g>
                <Tag x={x0} y={770} text={k.label} p={prog(t, k.t, k.t + 0.5, "none") * (1 - gather)} size={22} accent={C.cyan} />
              </g>
            );
          })}
          {t > T.reuters - 0.4 && (
            <g opacity={win(t, T.reuters - 0.4, T.interceptorW - 0.2, 0.3, 0.4)}>
              <DocPage x={330} y={300} s={0.32} r={-6} lines={1} chart={prog(t, T.reuters, T.competition)} tab={C.amber} />
              <Tag x={520} y={300} text="REUTERS" p={prog(t, T.reuters, T.reuters + 0.5, "none")} size={36} accent={C.amber} anchor="start" />
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

      {bergA > 0 && (
        <g opacity={bergA}>
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
                  <g key={k.label} transform={`translate(${520 + i * 176} ${620}) scale(${0.55 * p})`}>
                    <circle r={92} fill={C.ink} fillOpacity={0.85} stroke={C.cyan} strokeWidth={5} />
                    <Glyph kind={k.kind} s={0.9} />
                  </g>
                ))}
                <g transform={`translate(700 880) scale(${0.42 * p})`}>
                  <LauncherSide elev={40} />
                </g>
                <g transform={`translate(1260 880) scale(${0.42 * p})`}>
                  <LauncherSide elev={54} />
                </g>
                <Big x={960} y={790} text="$1,000,000,000+" size={78} color={C.amber} opacity={p} />
              </g>
            );
          })()}
        </g>
      )}
    </Stage>
  );
};
