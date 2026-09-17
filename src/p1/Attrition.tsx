import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { LauncherSide } from "../art/ground";
import { RadarAESA } from "../art/targets";
import { Interceptor, Soldier, SunMoon } from "../art/p1art";
import { Explosion, Pulse } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, rnd, useTime, win } from "../lib/kf";
import { at, P1_DURATION_S } from "./words";

const T = {
  so: at("So", 153),
  attacker: at("attacker"),
  every: at("every", 155),
  survive: at("survive."),
  he: at("He", 157),
  few: at("few"),
  through: at("through.", 159),
  and: at("And", 160),
  all: at("all", 160.5),
  rest: at("rest"),
  force: at("force"),
  opponent: at("opponent"),
  radars: at("radars,"),
  mobilize: at("mobilize"),
  crews: at("crews,"),
  fire: at("fire", 164),
  interceptors: at("interceptors,", 164.5),
  stay: at("stay"),
  alert: at("alert"),
  night1: at("night"),
  after: at("after", 167),
  night2: at("night.", 167.3),
};
export const ATTRITION_RANGE = [T.so - 0.2, P1_DURATION_S] as const;

const LINE_X = 1060;
const SWARM = Array.from({ length: 18 }, (_, i) => ({
  x0: -80 - (i % 4) * 110 - rnd(i, 1) * 60,
  y0: 300 + ((i * 37) % 7) * 75 + rnd(i, 2) * 30,
  survivor: i === 2 || i === 7 || i === 11,
  kill: 0,
}));
SWARM.filter((s) => !s.survivor).forEach((s, k, arr) => {
  s.kill = k / (arr.length - 1);
});

export const Attrition: React.FC = () => {
  const t = useTime();
  if (t < ATTRITION_RANGE[0]) return null;

  /* ---------------- the swarm ---------------- */
  const sA = win(t, T.so - 0.2, T.all + 0.8, 0.4, 0.8);
  const speed = 250;
  const run = t - (T.so - 0.2);
  const killT = (k: number) => T.every - 0.3 + k * (T.survive + 0.4 - (T.every - 0.3));

  /* ---------------- the defender kept busy ---------------- */
  const dA = win(t, T.and - 0.2, P1_DURATION_S + 1, 0.6, 0.1) * (1 - prog(t, P1_DURATION_S - 0.5, P1_DURATION_S, "power2.in"));
  const radarOn = prog(t, T.radars - 0.15, T.radars + 0.4, "power2.out");
  const crews = prog(t, T.mobilize - 0.1, T.crews + 0.6, "power2.inOut");
  const launch = (d: number) => prog(t, T.fire - 0.05 + d, T.fire + 1.4 + d, "power1.in");
  const cycle = prog(t, T.stay, T.night2 + 0.6, "none");
  const phase = (Math.sin(cycle * Math.PI * 3.5 - Math.PI / 2) + 1) / 2;

  return (
    <Stage>
      {sA > 0 && (
        <g opacity={sA}>
          <path d={`M${LINE_X},220 L${LINE_X},880`} stroke={C.cyan} strokeWidth={8} strokeDasharray="26 16" strokeDashoffset={t * 30} />
          {SWARM.map((s, i) => {
            const x = s.x0 + run * speed;
            const y = s.y0 + Math.sin(t * 2 + i) * 10;
            if (!s.survivor) {
              const tk = killT(s.kill);
              const boom = prog(t, tk, tk + 0.9, "none");
              if (boom >= 1) return null;
              return (
                <g key={i}>
                  {boom <= 0.15 && <ShahedTop x={x} y={y} r={90} s={0.32} />}
                  {boom > 0 && <Explosion x={x} y={y} p={boom} size={48} seed={90 + i} />}
                </g>
              );
            }
            const passed = x > LINE_X;
            return (
              <g key={i}>
                <ShahedTop x={x} y={y} r={90} s={0.32} />
                {t > T.few - 0.2 && <circle cx={x} cy={y} r={52 + 5 * Math.sin(t * 8)} fill="none" stroke={C.amber} strokeWidth={6} opacity={passed ? 1 : 0.6} />}
              </g>
            );
          })}
          {/* interceptors launched from the defended side */}
          {SWARM.filter((s) => !s.survivor).map((s, k) => {
            const tk = killT(s.kill);
            const p = prog(t, tk - 0.5, tk, "power2.in");
            if (p <= 0 || p >= 1) return null;
            const y = s.y0 + 30;
            const x = 1800 - (1800 - (s.x0 + (tk - (T.so - 0.2)) * speed)) * p;
            return (
              <g key={`i${k}`} transform={`translate(${x} ${y}) rotate(180) scale(0.26)`}>
                <Interceptor kind="pac3" flame={1} />
              </g>
            );
          })}
          <Pulse x={LINE_X} y={550} p={prog(t, T.through - 0.1, T.through + 0.8, "none")} r={320} color={C.amber} width={8} />
        </g>
      )}

      {dA > 0 && (
        <g opacity={dA}>
          {/* night sky cycle */}
          <path d="M360,300 Q960,40 1560,300" fill="none" stroke={C.cream} strokeOpacity={0.25} strokeWidth={4} strokeDasharray="10 12" />
          {cycle > 0 && (
            <g>
              <SunMoon x={360 + 1200 * ((cycle * 1.75) % 1)} y={300 - Math.sin(((cycle * 1.75) % 1) * Math.PI) * 190} phase={phase} s={0.9} />
            </g>
          )}

          {/* radar */}
          <g transform={`translate(560 ${760 + (1 - ease("back.out(1.3)")(prog(t, T.and - 0.2, T.all + 0.3))) * 260}) scale(0.68)`}>
            <RadarAESA turn={radarOn > 0 ? ((t * 80) % 360) - 180 : 20} />
          </g>
          {radarOn > 0 &&
            [0, 1, 2].map((k) => {
              const p = ((t - T.radars) * 0.7 + k / 3) % 1;
              return p > 0 ? <Pulse key={k} x={560} y={560} p={p} r={330} color={C.cyan} width={6} /> : null;
            })}

          {/* crews */}
          {Array.from({ length: 5 }, (_, i) => {
            const x0 = 900;
            const x1 = 760 + i * 95;
            const x = x0 + (x1 - x0) * crews;
            const y = 900 - Math.abs(Math.sin(crews * Math.PI)) * 20 + (i % 2) * 18;
            return crews > 0 ? <Soldier key={i} x={x} y={y} s={0.95} run={crews < 1} opacity={clamp01(crews * 4)} /> : null;
          })}

          {/* launcher firing */}
          <g transform={`translate(1360 ${820 + (1 - ease("back.out(1.3)")(prog(t, T.opponent - 0.3, T.opponent + 0.4))) * 280}) scale(0.72)`}>
            <LauncherSide elev={42} />
          </g>
          {[0, 0.28].map((d, i) => {
            const p = launch(d);
            if (p <= 0 || p >= 1) return null;
            const x = 1330 + p * 520;
            const y = 650 - p * p * 700;
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${-42 - p * 30}) scale(0.36)`}>
                <Interceptor kind="pac3" flame={1} />
              </g>
            );
          })}
          {[0, 0.28].map((d, i) => (
            <path
              key={`s${i}`}
              d={`M1330,650 Q${1330 + 260},${650 - 120} ${1330 + 520 * Math.min(1, launch(d))},${650 - Math.min(1, launch(d)) ** 2 * 700}`}
              fill="none"
              stroke="#CFCAC0"
              strokeWidth={12}
              strokeLinecap="round"
              opacity={launch(d) > 0 ? 0.45 * (1 - prog(t, T.fire + 2 + d, T.fire + 3.5 + d)) : 0}
            />
          ))}
          {/* alert beacon */}
          {t > T.alert - 0.2 && (
            <g transform="translate(960 640)">
              <circle r={34} fill={C.red} stroke={C.ink} strokeWidth={6} opacity={Math.sin(t * 9) > 0 ? 1 : 0.35} />
              <Pulse x={0} y={0} p={((t - T.alert) * 1.4) % 1} r={120} color={C.red} width={6} />
            </g>
          )}
        </g>
      )}
    </Stage>
  );
};
