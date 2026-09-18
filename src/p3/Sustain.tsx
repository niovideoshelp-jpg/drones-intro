import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { LauncherSide } from "../art/ground";
import { Factory } from "../art/p1art";
import { Glyph } from "../art/p2art";
import { aimTurret, LaserTurret, MicrowaveEmitter, Passive, SPAAG } from "../art/p3art";
import { FPVSide } from "../art/drones";
import { JammerMast } from "../art/ground";
import { Lens } from "../art/lens";
import { Big, Interceptor, NoSign } from "../p2/shared";
import { PriceTag, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { board, clamp01, ease, prog, rnd, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  theyll: at("They'll"),
  future: at("future,"),
  replace: at("replace"),
  weapon: at("weapon."),
  which: at("Which", 241.5),
  top: at("top", 242),
  chain: at("chain,"),
  missiles: at("missiles", 244.5),
  there: at("there.", 245.5),
  when: at("When", 247),
  far: at("far", 247.6),
  fast: at("fast,", 250),
  shrugging: at("shrugging"),
  layers: at("layers,", 252),
  dangerous: at("dangerous", 254),
  wait: at("wait"),
  patriot: at("Patriot", 256),
  aim: at("AIM-120"),
  essential: at("essential."),
  change: at("change", 260.3),
  rid: at("rid"),
  keeping: at("keeping"),
  firstAnswer: at("answer", 266),
  threat: at("threat.", 268),
  because: at("Because"),
  relying: at("relying"),
  millions: at("millions"),
  again: at("again,"),
  model: at("model"),
  sustain: at("sustain"),
  war: at("war."),
  money: at("money."),
  country: at("country"),
  cash: at("cash"),
  problem: at("problem", 286),
  building: at("building"),
  using: at("using", 287),
  stops: at("stops"),
  economic: at("economic", 291),
  industrial: at("industrial"),
  said: at("said,"),
  doomed: at("doomed."),
  lasers: at("Lasers,", 298.6),
  microwaves: at("microwaves,", 299.5),
  guns: at("guns,", 301),
  warfare: at("warfare,", 302),
  drones: at("drones", 303.8),
  cut: at("cut"),
  attacks: at("attacks.", 305.5),
  better: at("Better", 306),
  networks: at("networks"),
  shots: at("shots,"),
  passive: at("passive"),
  dispersing: at("dispersing"),
  camouflage: at("camouflage,"),
  hardening: at("hardening"),
  damage: at("damage", 315.8),
  through: at("through.", 320),
};
export const SUSTAIN_RANGE = [T.theyll - 0.3, T.through + 0.8] as const;

const HOPE = [
  { t0: T.lasers, kind: "laser", label: "LASERS" },
  { t0: T.microwaves, kind: "mw", label: "MICROWAVES" },
  { t0: T.guns, kind: "gun", label: "GUNS" },
  { t0: T.warfare, kind: "ew", label: "EW" },
  { t0: T.drones, kind: "drone", label: "INTERCEPTORS" },
];

const PASSIVE = [
  { t0: T.networks, kind: "sensors" as const, label: "SENSOR NETWORKS" },
  { t0: T.dispersing, kind: "disperse" as const, label: "DISPERSAL" },
  { t0: T.camouflage, kind: "camo" as const, label: "CAMOUFLAGE" },
  { t0: T.hardening, kind: "harden" as const, label: "HARDENING" },
];

const CONDITIONS = [
  { t: T.far, label: "TOO FAR OUT" },
  { t: T.fast, label: "TOO FAST" },
  { t: T.layers, label: "SHRUGS OFF THE LAYERS" },
  { t: T.dangerous, label: "TOO DANGEROUS TO WAIT" },
];

export const Sustain: React.FC = () => {
  const t = useTime();
  if (t < SUSTAIN_RANGE[0] || t > SUSTAIN_RANGE[1]) return null;

  const topB = board(t, T.theyll - 0.2, T.because - 0.2);
  const crown = prog(t, T.missiles - 0.2, T.there + 0.3, "back.out(2)");
  const firstAns = prog(t, T.keeping - 0.2, T.firstAnswer + 0.4, "power2.inOut");

  const drainB = board(t, T.because - 0.3, T.doomed - 0.4);
  const drainA = drainB.op;
  const spent = clamp01((t - T.relying) / (T.again - T.relying)) * 8_000_000;
  const stamp = prog(t, T.sustain - 0.1, T.war + 0.4, "back.out(2)");
  const rate = prog(t, T.building - 0.2, T.using + 0.6, "power2.inOut");
  const industrial = prog(t, T.stops - 0.2, T.industrial + 0.5, "power2.inOut");

  const hopeB = board(t, T.doomed - 0.5, T.through + 0.6);
  const hopeShown = HOPE.reduce((n, c) => n + clamp01((t - c.t0 + 0.3) / 0.45), 0);
  const passiveShown = PASSIVE.reduce((n, c) => n + clamp01((t - c.t0 + 0.3) / 0.45), 0);
  const cutP = prog(t, T.cut - 0.4, T.attacks + 0.3, "power2.inOut");

  return (
    <Stage>
      {topB.op > 0 && (
        <g opacity={topB.op} transform={topB.tf}>
          {/* the stack, cheap at the base, expensive on top */}
          {[
            { y: 810, w: 1180, label: "SENSORS · EW", color: C.cyan, t0: T.theyll + 0.1 },
            { y: 700, w: 940, label: "GUNS · ROCKETS", color: C.green, t0: T.theyll + 0.8 },
            { y: 590, w: 700, label: "INTERCEPTOR DRONES", color: C.amber, t0: T.future - 0.5 },
            { y: 480, w: 460, label: "DIRECTED ENERGY", color: "#9BE8FF", t0: T.future + 0.2 },
          ].map((row, i) => {
            const p = prog(t, row.t0, row.t0 + 0.5, "back.out(1.6)");
            if (p <= 0) return null;
            return (
              <g key={row.label} opacity={p}>
                <rect x={960 - (row.w * p) / 2} y={row.y - 46} width={row.w * p} height={92} rx={10} fill={C.ink} fillOpacity={0.9} stroke={row.color} strokeWidth={4} />
                <rect x={960 - (row.w * p) / 2} y={row.y - 46} width={row.w * p} height={92} rx={10} fill="none" stroke={row.color} strokeWidth={3} strokeDasharray="18 22" strokeDashoffset={(i % 2 ? 1 : -1) * t * 40} opacity={0.6} />
                <Tag x={960} y={row.y} text={row.label} p={p} size={28} accent={row.color} />
              </g>
            );
          })}
          {/* "won't replace every weapon": the top slot stays open until the missiles are named */}
          {t > T.replace - 0.3 && crown < 1 && (
            <g opacity={prog(t, T.replace - 0.3, T.replace + 0.2) * (1 - crown)}>
              <rect x={730} y={294} width={460} height={112} rx={12} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="16 14" strokeDashoffset={-t * 30} />
              <Tag x={960} y={350} text="?" p={1} size={40} accent={C.red} />
            </g>
          )}
          {crown > 0 && (
            <g transform={`translate(960 ${350 - 20 * crown})`} opacity={crown}>
              <rect x={-230} y={-56} width={460} height={112} rx={12} fill={C.ink} fillOpacity={0.94} stroke={C.red} strokeWidth={6} />
              <Tag x={0} y={0} text="EXPENSIVE MISSILES" p={crown} size={32} accent={C.red} />
              <Pulse x={0} y={0} p={prog(t, T.there, T.there + 1, "none")} r={320} color={C.red} width={8} />
            </g>
          )}
          {/* when only the top layer will do */}
          {CONDITIONS.map((c, i) => {
            const p = ease("back.out(1.6)")(clamp01((t - c.t + 0.25) / 0.45));
            if (p <= 0) return null;
            const x = 300 + i * 460;
            return (
              <g key={c.label} opacity={p * (1 - prog(t, T.change - 0.4, T.change))}>
                <Tag x={x} y={230} text={c.label} p={p} size={26} accent={C.red} />
              </g>
            );
          })}
          {/* the two systems that stay at the top */}
          {t > T.patriot - 0.4 && (
            <g opacity={win(t, T.patriot - 0.4, T.change - 0.2, 0.3, 0.4)}>
              <g transform="translate(250 600) scale(0.5)">
                <LauncherSide elev={42} />
              </g>
              <Tag x={250} y={660} text="PATRIOT" p={prog(t, T.patriot, T.patriot + 0.5, "none")} size={28} accent={C.red} />
              <g transform="translate(1690 560) scale(0.7)">
                <Interceptor kind="aim120" flame={0.5} r={-20} />
              </g>
              <Tag x={1690} y={660} text="AIM-120" p={prog(t, T.aim, T.aim + 0.5, "none")} size={28} accent={C.red} />
            </g>
          )}
          {/* not the first answer any more */}
          {firstAns > 0 && (
            <g opacity={firstAns}>
              <Tag x={960} y={170} text="NOT THE FIRST ANSWER" p={firstAns} size={40} accent={C.amber} />
              <NoSign x={960} y={380} p={prog(t, T.firstAnswer - 0.1, T.threat + 0.3, "none")} r={250} />
            </g>
          )}
        </g>
      )}

      {drainA > 0 && (
        <g opacity={drainA} transform={drainB.tf}>
          <Tag x={960} y={160} text="A MODEL THAT IS HARD TO SUSTAIN" p={prog(t, T.model - 0.2, T.sustain + 0.4, "none")} size={38} accent={C.red} />
          {/* the stock: a rack of missiles that launch one by one as the millions go */}
          <rect x={270} y={290} width={580} height={340} rx={16} fill={C.ink} fillOpacity={0.55} stroke={C.red} strokeWidth={4} strokeDasharray="16 12" />
          {Array.from({ length: 8 }, (_, i) => {
            const tf = T.relying + (i * (T.again + 0.5 - T.relying)) / 8;
            const fly = prog(t, tf, tf + 0.9, "power2.in");
            const x = 345 + (i % 4) * 143;
            const y = 385 + Math.floor(i / 4) * 150;
            return (
              <g key={i} opacity={1 - fly}>
                <g transform={`translate(${x} ${y - fly * 420}) rotate(-90) scale(0.3)`}>
                  <Interceptor kind="pac3" flame={fly > 0 ? 1 : 0} />
                </g>
              </g>
            );
          })}
          <Tag x={560} y={250} text="STOCK" p={prog(t, T.relying - 0.2, T.relying + 0.4, "none")} size={26} accent={C.red} />
          {Array.from({ length: 10 }, (_, i) => {
            const k = (((t - T.relying) * 0.16 + i / 10) % 1 + 1) % 1;
            return <ShahedTop key={i} x={1900 - k * 900} y={330 + ((i * 53) % 4) * 140 + rnd(i, 2) * 30} r={-90} s={0.17} opacity={drainA} />;
          })}
          <PriceTag x={1450} y={250} text={`$${Math.round(spent).toLocaleString("en-US")}`} size={52} color={C.red} s={prog(t, T.relying, T.relying + 0.4, "back.out(2)")} />
          {stamp > 0 && (
            <g transform={`translate(1270 540) rotate(-8) scale(${stamp})`} opacity={1 - prog(t, T.building - 0.6, T.building - 0.1)}>
              <rect x={-330} y={-58} width={660} height={116} rx={12} fill="none" stroke={C.red} strokeWidth={10} />
              <Big x={0} y={26} text="UNSUSTAINABLE" size={78} color={C.red} />
            </g>
          )}
          {/* production versus consumption */}
          {rate > 0 && (
            <g opacity={rate}>
              <g transform="translate(430 780) scale(0.6)">
                <Factory stop={0} />
              </g>
              <Tag x={430} y={905} text="BUILT" p={rate} size={26} accent={C.green} />
              <Tag x={1450} y={905} text="USED" p={rate} size={26} accent={C.red} />
              <rect x={640} y={740} width={220 * rate} height={44} fill={C.green} stroke={C.ink} strokeWidth={4} />
              <rect x={640} y={806} width={760 * rate} height={44} fill={C.red} stroke={C.ink} strokeWidth={4} />
            </g>
          )}
          {industrial > 0 && (
            <g opacity={industrial}>
              <Tag x={960} y={250} text="AN INDUSTRIAL QUESTION" p={industrial} size={40} accent={C.amber} />
            </g>
          )}
        </g>
      )}

      {hopeB.op > 0 && (
        <g opacity={hopeB.op} transform={hopeB.tf}>
          <Tag x={960} y={150} text="NOT DOOMED" p={prog(t, T.doomed - 0.3, T.doomed + 0.5, "none")} size={42} accent={C.green} />
          {HOPE.map((c, i) => {
            const p = ease("back.out(1.5)")(clamp01((t - c.t0 + 0.3) / 0.45)) * (1 - prog(t, T.networks - 0.7, T.networks - 0.2));
            if (p <= 0) return null;
            const x = 960 + (i - (hopeShown - 1) / 2) * 320;
            const k = ((((t - c.t0) * 0.4) % 1) + 1) % 1;
            return (
              <Lens key={c.label} id={`hope${i}`} x={x} y={420} r={112} t={t} s={p} ring={C.green} label={c.label} labelP={prog(t, c.t0, c.t0 + 0.4, "none")}>
                {c.kind === "laser" && <LaserTurret x={-30} y={47} s={0.34} beam={0.8} {...aimTurret(55, -55, -30, 47, 0.34)} />}
                {c.kind === "mw" && <MicrowaveEmitter x={-40} y={47} s={0.32} fire={0.8} angle={55} range={260} />}
                {c.kind === "gun" && <SPAAG x={-40} y={47} s={0.32} fire={1} angle={-40} />}
                {c.kind === "ew" && (
                  <g>
                    <g transform="translate(-45 47) scale(0.36)">
                      <JammerMast />
                    </g>
                    {[0, 1].map((j) => {
                      const q = (((t * 0.9 + j / 2) % 1) + 1) % 1;
                      return <path key={j} d={`M${-20 + q * 70},${-60} a${18 + q * 20},${40 + q * 16} 0 0 1 0,${80 + q * 32}`} fill="none" stroke={C.blue} strokeWidth={5} opacity={(1 - q) * 0.9} />;
                    })}
                  </g>
                )}
                {c.kind === "drone" && (
                  <g>
                    <ShahedTop x={-30 + k * 120} y={-40} r={-90} s={0.1} />
                    <FPVSide x={-95 + k * 120} y={-15 - k * 20} s={0.26} r={-10} />
                  </g>
                )}
                {(c.kind === "laser" || c.kind === "mw" || c.kind === "gun") && <ShahedTop x={55 + Math.sin(t * 1.5 + i) * 8} y={-55} r={-100} s={0.1} />}
              </Lens>
            );
          })}
          {cutP > 0 && (
            <g opacity={cutP * (1 - prog(t, T.networks - 0.7, T.networks - 0.2))}>
              <rect x={430} y={700} width={1060} height={46} rx={10} fill={C.ink} stroke={C.red} strokeWidth={4} />
              <rect x={430} y={700} width={1060 * (1 - 0.72 * cutP)} height={46} rx={10} fill={C.red} />
              <Tag x={960} y={800} text="COST OF DEALING WITH MASS ATTACKS" p={cutP} size={28} accent={C.green} />
            </g>
          )}
          {/* sensors and passive measures */}
          {PASSIVE.map((c, i) => {
            const p = ease("back.out(1.5)")(clamp01((t - c.t0 + 0.3) / 0.45));
            if (p <= 0) return null;
            const x = 960 + (i - (passiveShown - 1) / 2) * 360;
            return (
              <Lens key={c.label} id={`pas${i}`} x={x} y={500} r={120} t={t} s={p} ring={C.cyan} label={c.label} labelP={prog(t, c.t0, c.t0 + 0.4, "none")}>
                {c.kind === "sensors" ? (
                  <g>
                    <g transform="translate(0 20)">
                      <Glyph kind="radar" s={0.6} color={C.cream} />
                    </g>
                    <ShahedTop x={-70 + ((((t * 0.3) % 1) + 1) % 1) * 140} y={-60} r={-90} s={0.1} />
                  </g>
                ) : (
                  <g transform="translate(0 18)">
                    <Passive kind={c.kind} s={0.6} />
                  </g>
                )}
              </Lens>
            );
          })}
        </g>
      )}
    </Stage>
  );
};
