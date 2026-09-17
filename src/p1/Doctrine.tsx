import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { LauncherSide, SAMTop } from "../art/ground";
import { BallisticMissile, ClockIcon, CruiseMissile, FighterJet, Interceptor, NoSign } from "../art/p1art";
import { Explosion, PriceTag, Pulse, Query, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  now: at("Now,"),
  patriots: at("Patriots"),
  thaads: at("THAADs"),
  fired: at("fired"),
  every: at("every", 67),
  drone: at("drone.", 67.5),
  practice: at("practice,"),
  save: at("save"),
  expensive: at("expensive", 71),
  interceptors: at("interceptors", 72),
  ballistic: at("ballistic", 73),
  aircraft: at("aircraft,", 74),
  cruise: at("cruise"),
  other: at("other"),
  simpler: at("simpler"),
  cant: at("can't"),
  beat: at("beat."),
  but: at("But"),
  hand: at("hand"),
  ideal: at("ideal"),
  place: at("place", 83),
  time: at("time.", 84),
  sometimes: at("Sometimes"),
  million: at("million-dollar"),
  missile: at("missile", 86),
  only: at("only", 87.5),
  inside: at("inside"),
  engagement: at("engagement"),
  window: at("window."),
  cheap: at("cheap", 91),
};
export const DOCTRINE_RANGE = [T.now + 0.3, T.cheap + 0.4] as const;

const JUNCTION = { x: 760, y: 550 };
const THREATS = [
  { key: "ballistic", t: T.ballistic, y: 290, label: "BALLISTIC MISSILES" },
  { key: "aircraft", t: T.aircraft, y: 460, label: "AIRCRAFT" },
  { key: "cruise", t: T.cruise, y: 630, label: "CRUISE MISSILES" },
  { key: "other", t: T.other, y: 800, label: "OTHER THREATS" },
];

/* engagement board geometry */
const SITE = { x: 960, y: 610 };
const R = 330;
const P0 = { x: 150, y: 230 };
const DIST = Math.hypot(SITE.x - P0.x, SITE.y - P0.y);
const along = (f: number) => ({ x: P0.x + (SITE.x - P0.x) * f, y: P0.y + (SITE.y - P0.y) * f });
const F_EDGE = (DIST - R) / DIST;

export const Doctrine: React.FC = () => {
  const t = useTime();
  if (t < DOCTRINE_RANGE[0] || t > DOCTRINE_RANGE[1]) return null;

  /* ---------------- part 1: what the expensive interceptors are for ---------------- */
  const aA = win(t, T.now + 0.3, T.but + 0.2, 0.5, 0.5);
  const launcherP = (t0: number) => ease("back.out(1.5)")(clamp01((t - t0 + 0.25) / 0.6));
  const droneA = win(t, T.every - 0.3, T.practice + 1.2, 0.3, 0.6);
  const toDrone = prog(t, T.fired - 0.1, T.drone, "power2.inOut");
  const no = prog(t, T.drone + 0.05, T.drone + 0.7, "none");
  const vault = prog(t, T.save - 0.1, T.save + 0.5, "back.out(2)");
  const simple = ease("back.out(1.6)")(clamp01((t - T.simpler + 0.2) / 0.6));
  const blocked = prog(t, T.cant - 0.1, T.beat + 0.2, "power2.out");

  /* ---------------- part 2: the engagement window ---------------- */
  const bA = win(t, T.but - 0.1, T.cheap + 0.3, 0.5, 0.5);
  const f = Math.min(0.72, ((t - (T.but + 0.1)) / (T.inside - (T.but + 0.1))) * F_EDGE);
  const dronePos = along(Math.max(0, f));
  const intercept = prog(t, T.window, T.window + 1.1, "none");
  const launch = prog(t, T.engagement + 0.05, T.window, "power1.in");
  const hit = along(0.72);
  const inWindow = t >= T.inside - 0.05;
  const cheapZone = { x: 1540, y: 300 };

  return (
    <Stage>
      {aA > 0 && (
        <g opacity={aA}>
          {/* launchers */}
          {[
            { y: 360, t0: T.patriots, label: "PATRIOT", elev: 38, price: "$4M" },
            { y: 740, t0: T.thaads, label: "THAAD", elev: 58, price: "$13M+" },
          ].map((l, i) => {
            const p = launcherP(l.t0);
            return p > 0 ? (
              <g key={l.label}>
                <path d={`M600,${l.y - 40} L${JUNCTION.x},${JUNCTION.y}`} stroke={C.cyan} strokeWidth={6} opacity={prog(t, T.ballistic - 0.4, T.ballistic)} />
                <g transform={`translate(360 ${l.y + 60}) scale(${0.62 * p})`}>
                  <LauncherSide elev={l.elev} />
                </g>
                <Tag x={360} y={l.y + 120} text={l.label} p={prog(t, l.t0, l.t0 + 0.5, "none")} size={32} accent={C.red} />
                {vault > 0 && (
                  <g>
                    <circle cx={360} cy={l.y - 10} r={200} fill="none" stroke={C.cyan} strokeWidth={5} strokeDasharray="18 12" strokeDashoffset={t * 30 * (i ? -1 : 1)} opacity={vault} />
                    <PriceTag x={440} y={l.y - 140} text={l.price} size={44} color={C.amber} s={prog(t, T.expensive - 0.1 + i * 0.15, T.expensive + 0.3 + i * 0.15, "back.out(2)")} />
                  </g>
                )}
              </g>
            ) : null;
          })}

          {/* not at every small drone */}
          {droneA > 0 && (
            <g opacity={droneA}>
              {[360, 740].map((y, i) => (
                <path key={y} d={`M600,${y - 40} Q${1000},${550 + (i ? 60 : -60)} ${600 + (1320 - 600) * toDrone},${y - 40 + (550 - y + 40) * toDrone}`} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="16 10" strokeDashoffset={-t * 50} />
              ))}
              <ShahedTop x={1400} y={550 + Math.sin(t * 2) * 8} r={-90} s={0.4 * ease("back.out(2)")(prog(t, T.every - 0.3, T.every + 0.2))} />
              <NoSign x={1000} y={550} p={no} r={130} />
            </g>
          )}

          {/* what they are saved for */}
          <circle cx={JUNCTION.x} cy={JUNCTION.y} r={14 * prog(t, T.ballistic - 0.4, T.ballistic)} fill={C.cyan} stroke={C.ink} strokeWidth={4} />
          {THREATS.map((th, i) => {
            const p = ease("back.out(1.6)")(clamp01((t - th.t + 0.2) / 0.55));
            if (p <= 0) return null;
            const link = prog(t, th.t - 0.2, th.t + 0.4, "power2.out");
            const tx = 1260;
            return (
              <g key={th.key}>
                <path d={`M${JUNCTION.x},${JUNCTION.y} L${JUNCTION.x + (tx - JUNCTION.x) * link},${JUNCTION.y + (th.y - JUNCTION.y) * link}`} stroke={C.cyan} strokeWidth={6} />
                <g transform={`translate(1450 ${th.y + Math.sin(t * 1.8 + i) * 5}) scale(${p})`}>
                  <circle r={78} fill={C.ink} fillOpacity={0.9} stroke={C.red} strokeWidth={5} />
                  {th.key === "ballistic" && <BallisticMissile r={40} s={0.42} />}
                  {th.key === "aircraft" && <FighterJet s={0.28} afterburner={0.8} missile={false} />}
                  {th.key === "cruise" && <CruiseMissile s={0.42} />}
                  {th.key === "other" && <Query s={1.3} color={C.red} />}
                </g>
                <Tag x={1550} y={th.y} text={th.label} p={prog(t, th.t, th.t + 0.6, "none")} size={26} accent={C.red} anchor="start" />
              </g>
            );
          })}

          {/* simpler systems */}
          {simple > 0 && (
            <g>
              <g transform={`translate(760 ${960}) scale(${simple})`}>
                <circle r={70} fill={C.ink} fillOpacity={0.9} stroke={C.green} strokeWidth={5} />
                <path d="M-40,20 L40,20 L28,0 L-28,0Z M-8,0 L-8,-10 L40,-40 M8,0 L8,-10 L50,-30" fill={C.olive} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
              </g>
              <path d={`M840,940 L${840 + (1180 - 840) * blocked},${940 - (940 - 820) * blocked}`} stroke={C.green} strokeWidth={6} strokeDasharray="14 10" />
              {blocked > 0.7 && <NoSign x={1200} y={815} p={prog(t, T.beat - 0.2, T.beat + 0.4, "none")} r={46} />}
            </g>
          )}
        </g>
      )}

      {bA > 0 && (
        <g opacity={bA}>
          {/* defended site with its missile battery */}
          <circle cx={SITE.x} cy={SITE.y} r={R} fill={C.cyan} fillOpacity={0.06 + (inWindow ? 0.06 : 0) + 0.08 * prog(t, T.only - 0.2, T.only + 0.4) * (1 - prog(t, T.window, T.window + 1))} stroke={C.cyan} strokeWidth={5} strokeDasharray="20 12" strokeDashoffset={t * 25} />
          {[0.66, 0.33].map((k) => (
            <circle key={k} cx={SITE.x} cy={SITE.y} r={R * k} fill="none" stroke={C.cyan} strokeOpacity={0.3} strokeWidth={3} />
          ))}
          <SAMTop x={SITE.x} y={SITE.y} s={0.62} r={-25} />
          <PriceTag x={SITE.x + 150} y={SITE.y + 110} text="$1M" size={58} color={C.amber} s={prog(t, T.million - 0.1, T.million + 0.3, "back.out(2)")} />

          {/* the cheaper weapon, somewhere else */}
          {(() => {
            const p = ease("back.out(1.6)")(clamp01((t - T.ideal + 0.2) / 0.55));
            if (p <= 0) return null;
            return (
              <g>
                <circle cx={cheapZone.x} cy={cheapZone.y} r={160 * p} fill={C.green} fillOpacity={0.12} stroke={C.green} strokeWidth={5} strokeDasharray="14 10" />
                <g transform={`translate(${cheapZone.x} ${cheapZone.y}) scale(${p})`}>
                  <path d="M-40,20 L40,20 L28,0 L-28,0Z M-8,0 L-8,-10 L40,-40 M8,0 L8,-10 L50,-30" fill={C.olive} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
                </g>
                <Pulse x={cheapZone.x} y={cheapZone.y} p={prog(t, T.place - 0.1, T.place + 0.9, "none")} r={220} color={C.green} width={6} />
                {t > T.place - 0.1 && (
                  <g opacity={prog(t, T.place - 0.1, T.place + 0.3)}>
                    <path d={`M${cheapZone.x - 160},${cheapZone.y + 20} L${dronePos.x + 60},${dronePos.y}`} stroke={C.green} strokeWidth={4} strokeDasharray="8 10" />
                    <NoSign x={(cheapZone.x - 160 + dronePos.x) / 2 + 30} y={(cheapZone.y + 20 + dronePos.y) / 2} p={prog(t, T.place, T.place + 0.6, "none")} r={34} />
                  </g>
                )}
                {t > T.time - 0.2 && <ClockIcon x={cheapZone.x + 150} y={cheapZone.y + 150} s={0.55 * ease("back.out(2)")(prog(t, T.time - 0.2, T.time + 0.2))} turn={t * 8} />}
              </g>
            );
          })()}

          {/* incoming drone */}
          {intercept < 0.25 && <ShahedTop x={dronePos.x} y={dronePos.y} r={(Math.atan2(SITE.y - P0.y, SITE.x - P0.x) * 180) / Math.PI + 90} s={0.34} />}
          <path d={`M${P0.x},${P0.y} L${dronePos.x},${dronePos.y}`} stroke={C.red} strokeWidth={4} strokeDasharray="10 8" opacity={0.7} />

          {/* engagement window: the arc of the circle the drone crosses */}
          {t > T.inside - 0.3 && (
            <g opacity={prog(t, T.inside - 0.3, T.inside + 0.2)}>
              {(() => {
                const a = Math.atan2(P0.y - SITE.y, P0.x - SITE.x);
                const a0 = a - 0.35;
                const a1 = a + 0.35;
                return (
                  <path
                    d={`M${SITE.x + Math.cos(a0) * R},${SITE.y + Math.sin(a0) * R} A${R},${R} 0 0 1 ${SITE.x + Math.cos(a1) * R},${SITE.y + Math.sin(a1) * R}`}
                    fill="none"
                    stroke={C.amber}
                    strokeWidth={16 + 4 * Math.sin(t * 10)}
                    strokeLinecap="round"
                  />
                );
              })()}
            </g>
          )}
          {launch > 0 && intercept <= 0 && (
            <g transform={`translate(${SITE.x + (hit.x - SITE.x) * launch} ${SITE.y + (hit.y - SITE.y) * launch}) rotate(${(Math.atan2(hit.y - SITE.y, hit.x - SITE.x) * 180) / Math.PI}) scale(0.32)`}>
              <Interceptor kind="pac3" flame={1} />
            </g>
          )}
          {intercept > 0 && intercept < 1 && <Explosion x={hit.x} y={hit.y} p={intercept} size={90} seed={41} />}

          {/* timeline of the window */}
          {(() => {
            const p = prog(t, T.sometimes, T.sometimes + 0.5, "power2.out");
            if (p <= 0) return null;
            const x0 = 560;
            const x1 = 1360;
            const start = T.but + 0.1;
            const stop = T.window + 0.6;
            const u = (tt: number) => clamp01((tt - start) / (stop - start));
            const w0 = x0 + (x1 - x0) * u(T.inside);
            const w1 = x0 + (x1 - x0) * u(T.window + 0.1);
            const marker = x0 + (x1 - x0) * u(Math.min(t, T.window + 0.1));
            return (
              <g opacity={p}>
                <rect x={x0} y={1000} width={(x1 - x0) * p} height={18} rx={9} fill={C.ink} stroke={C.cream} strokeWidth={3} />
                <rect x={w0} y={1000} width={(w1 - w0) * p} height={18} fill={C.amber} opacity={inWindow ? 1 : 0.55} />
                <path d={`M${marker},990 L${marker - 12},968 L${marker + 12},968Z`} fill={C.red} stroke={C.ink} strokeWidth={3} />
              </g>
            );
          })()}
        </g>
      )}
    </Stage>
  );
};
