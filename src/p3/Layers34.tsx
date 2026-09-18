import React from "react";
import { C } from "../design";
import { FPVSide, FPVTop, ShahedTop } from "../art/drones";
import { CityBlock, Glyph, Tracers } from "../art/p2art";
import { CIWS, RocketPod, SPAAG, Weather } from "../art/p3art";
import { Big, Interceptor, NoSign } from "../p2/shared";
import { Explosion, PriceTag, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  when: at("When"),
  enough: at("enough,"),
  guns: at("guns"),
  rockets: at("rockets"),
  gepard: at("Gepard,"),
  cram: at("C-RAM,"),
  skyranger: at("SkyRanger,"),
  airburst: at("airburst"),
  ammunition: at("ammunition,"),
  guided: at("guided"),
  apkws: at("APKWS,"),
  tens: at("tens"),
  dollars: at("dollars,"),
  less: at("less."),
  better: at("better", 108),
  trade: at("trade"),
  missile: at("missile.", 113),
  but: at("But", 114),
  physical: at("physical"),
  close: at("close"),
  target: at("target."),
  shorter: at("shorter"),
  line: at("line"),
  urban: at("urban"),
  rounds: at("rounds"),
  debris: at("debris"),
  ground: at("ground."),
  another: at("Another"),
  interceptorD: at("drones.", 133),
  ukraine: at("Ukraine,"),
  economics: at("economics"),
  instead: at("Instead"),
  send: at("send"),
  chase: at("chase"),
  destroy: at("destroy", 144),
  brings: at("brings"),
  attacking: at("attacking,"),
  cases: at("cases,", 150),
  threatCheap: at("threat.", 154),
  butThey: at("But", 155),
  depend: at("depend", 155),
  sensors: at("sensors,", 158),
  operators: at("operators,"),
  autonomous: at("autonomous"),
  struggle: at("struggle"),
  fast: at("fast", 165),
  weather: at("weather,"),
  directions: at("directions"),
  once: at("once.", 170),
  and: at("And", 171),
};
export const LAYERS34_RANGE = [T.when - 0.3, T.and + 0.8] as const;

const GUNS = [
  { t: T.gepard, label: "GEPARD", x: 430 },
  { t: T.cram, label: "C-RAM", x: 960 },
  { t: T.skyranger, label: "SKYRANGER", x: 1490 },
];

export const Layers34: React.FC = () => {
  const t = useTime();
  if (t < LAYERS34_RANGE[0] || t > LAYERS34_RANGE[1]) return null;

  /* ---- guns and rockets ---- */
  const gunA = win(t, T.when - 0.2, T.physical - 0.4, 0.4, 0.5);
  const fire = win(t, T.gepard - 0.3, T.but, 0.3, 0.6);
  const burst = prog(t, T.airburst - 0.2, T.ammunition + 0.6, "none");
  const rocket = prog(t, T.guided - 0.2, T.apkws + 0.8, "power1.in");
  const priceP = prog(t, T.tens - 0.2, T.dollars + 0.3, "back.out(2)");
  const trade = prog(t, T.better - 0.2, T.missile + 0.4, "power2.out");

  /* ---- their limits ---- */
  const limA = win(t, T.physical - 0.5, T.another - 0.3, 0.4, 0.5);
  const ring = prog(t, T.close - 0.2, T.target + 0.3, "power2.out");
  const rain = win(t, T.rounds - 0.3, T.another - 0.4, 0.3, 0.5);

  /* ---- interceptor drones ---- */
  const dA = win(t, T.another - 0.2, T.depend - 0.4, 0.4, 0.5);
  const approach = prog(t, T.interceptorD, T.send - 0.2, "none");
  const chase = prog(t, T.send - 0.2, T.destroy + 0.2, "power1.inOut");
  const kill = prog(t, T.destroy + 0.2, T.destroy + 1.2, "none");
  const bars = prog(t, T.brings - 0.2, T.attacking + 0.4, "power2.inOut");
  const under = prog(t, T.cases - 0.2, T.threatCheap + 0.3, "power2.inOut");

  /* ---- their limits ---- */
  const dLimA = win(t, T.butThey - 0.3, T.and + 0.5, 0.4, 0.5);

  return (
    <Stage>
      {gunA > 0 && (
        <g opacity={gunA}>
          <Tag x={960} y={160} text="LOWER-COST GUNS & ROCKETS" p={prog(t, T.when, T.rockets + 0.4, "none")} size={38} accent={C.green} />
          {GUNS.map((g, i) => {
            const p = ease("back.out(1.4)")(clamp01((t - (T.enough - 0.1 + i * 0.45)) / 0.6));
            if (p <= 0) return null;
            return (
              <g key={g.label} opacity={p}>
                <g transform={`translate(${g.x} 780) scale(${(i === 1 ? 1.15 : 0.9) * p})`}>
                  {i === 0 && <SPAAG fire={fire} />}
                  {i === 1 && <CIWS fire={fire} />}
                  {i === 2 && <SPAAG fire={fire} />}
                </g>
                <Tag x={g.x} y={860} text={g.label} p={prog(t, g.t, g.t + 0.5, "none")} size={30} accent={C.green} />
                {fire > 0 && <Tracers x={g.x} y={640} up={fire * 0.8} angle={-64 + i * 12} seed={i} />}
              </g>
            );
          })}
          {/* airburst round bursting into fragments in front of a drone */}
          {burst > 0 && burst < 1 && (
            <g>
              <ShahedTop x={1320} y={300} r={-90} s={0.26} />
              <g transform={`translate(${1200} 320)`}>
                {Array.from({ length: 16 }, (_, i) => {
                  const a = (i / 16) * Math.PI * 2;
                  const d = 30 + burst * 190;
                  return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.7} r={7 * (1 - burst)} fill={C.amber} />;
                })}
                <circle r={40 * (1 - burst)} fill="#FFE7A6" opacity={1 - burst} />
              </g>
              <Tag x={1140} y={190} text="AIRBURST" p={prog(t, T.airburst, T.ammunition + 0.3, "none")} size={26} accent={C.amber} />
            </g>
          )}
          {/* guided rocket */}
          {rocket > 0 && (
            <g>
              <g transform="translate(560 800) scale(0.8)">
                <RocketPod fire={rocket < 1 ? 1 : 0} />
              </g>
              {rocket < 1 && (
                <g transform={`translate(${640 + 760 * rocket} ${700 - 430 * rocket}) rotate(${-30})`}>
                  <Interceptor kind="aim120" s={0.4} flame={1} />
                </g>
              )}
              <Tag x={560} y={862} text="APKWS GUIDED ROCKET" p={prog(t, T.apkws - 0.2, T.apkws + 0.6, "none")} size={26} accent={C.green} />
            </g>
          )}
          {priceP > 0 && <PriceTag x={330} y={330} text="TENS OF THOUSANDS" size={44} color={C.green} s={priceP} />}
          {trade > 0 && (
            <g opacity={trade}>
              <PriceTag x={1220} y={330} text="$1M" size={44} color={C.red} s={trade} />
              <path d="M760,330 L1180,330" stroke={C.cream} strokeWidth={5} strokeDasharray="12 10" />
              <g transform={`translate(970 330) scale(${trade})`}>
                <circle r={44} fill={C.green} stroke={C.ink} strokeWidth={5} />
                <path d="M-20,2 L-6,18 L22,-14" stroke={C.ink} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          )}
        </g>
      )}

      {limA > 0 && (
        <g opacity={limA}>
          <Tag x={960} y={160} text="ONLY IF IT IS CLOSE ENOUGH" p={prog(t, T.physical - 0.2, T.target + 0.4, "none")} size={38} accent={C.red} />
          <g transform="translate(700 800) scale(0.9)">
            <SPAAG fire={0} />
          </g>
          {ring > 0 && (
            <g>
              <circle cx={700} cy={740} r={330 * ring} fill={C.green} fillOpacity={0.08} stroke={C.green} strokeWidth={5} strokeDasharray="18 12" strokeDashoffset={t * 25} />
              <Tag x={700} y={430} text="SHORT RANGE" p={prog(t, T.shorter - 0.2, T.shorter + 0.5, "none")} size={26} accent={C.green} />
            </g>
          )}
          <ShahedTop x={1520} y={360} r={-100} s={0.3} opacity={ring} />
          <NoSign x={1180} y={520} p={prog(t, T.line - 0.1, T.line + 0.7, "none")} r={90} />
          {/* line of fire blocked by the city */}
          <g transform="translate(1480 860) scale(0.7)" opacity={prog(t, T.urban - 0.3, T.urban + 0.4)}>
            <CityBlock />
          </g>
          <Tracers x={700} y={700} up={0} down={rain} seed={5} />
          <Tag x={1300} y={200} text="ROUNDS COME BACK DOWN" p={prog(t, T.debris - 0.2, T.ground + 0.4, "none")} size={30} accent={C.red} />
        </g>
      )}

      {dA > 0 && (
        <g opacity={dA}>
          <Tag x={960} y={160} text="INTERCEPTOR DRONES" p={prog(t, T.another - 0.1, T.interceptorD + 0.4, "none")} size={38} accent={C.amber} />
          <Tag x={430} y={260} text="UKRAINE" p={prog(t, T.ukraine - 0.1, T.economics + 0.4, "none")} size={32} accent={C.blue} />
          {/* the chase */}
          {/* the raid that pays for all this, running behind the chase */}
          <g opacity={0.55 + 0.25 * (1 - prog(t, T.brings - 0.6, T.brings))}>
            {[0, 1, 2, 3].map((i) => {
              const k = (((t - T.another) * 0.09 + i * 0.25) % 1 + 1) % 1;
              return <ShahedTop key={i} x={1980 - k * 2100} y={720 + (i % 2) * 120} r={-90} s={0.18} opacity={0.85} />;
            })}
          </g>
          {kill <= 0 && (
            <g>
              <ShahedTop x={-120 + 540 * approach + 1040 * chase} y={420 - 60 * chase} r={-90} s={0.3} />
              <FPVSide x={180 + 1160 * chase} y={560 - 120 * chase + (1 - chase) * Math.sin(t * 3.2) * 12} s={0.6} r={-14} />
              <path d={`M180,600 L${180 + 1160 * chase},${560 - 120 * chase}`} stroke={C.amber} strokeWidth={4} strokeDasharray="12 10" opacity={0.7} />
            </g>
          )}
          {kill > 0 && kill < 1 && <Explosion x={1460} y={380} p={kill} size={120} seed={77} />}
          {/* the two costs converging */}
          {bars > 0 && (
            <g>
              <rect x={640} y={820 - 180 * (1 - 0.55 * bars - 0.25 * under)} width={180} height={180 * (1 - 0.55 * bars - 0.25 * under)} fill={C.red} stroke={C.ink} strokeWidth={4} />
              <rect x={1100} y={820 - 150} width={180} height={150} fill={C.amber} stroke={C.ink} strokeWidth={4} />
              <Tag x={730} y={862} text="DEFENDING" p={bars} size={24} accent={C.red} />
              <Tag x={1190} y={862} text="ATTACKING" p={bars} size={24} accent={C.amber} />
              {under > 0.4 && <Big x={960} y={620} text="CHEAPER" size={70} color={C.green} opacity={under} />}
            </g>
          )}
        </g>
      )}

      {dLimA > 0 && (
        <g opacity={dLimA}>
          <Tag x={960} y={160} text="THEY DO NOT SOLVE EVERYTHING" p={prog(t, T.butThey, T.depend + 0.4, "none")} size={38} accent={C.red} />
          {[
            { t0: T.sensors, label: "SENSORS", kind: "radar" as const, x: 430 },
            { t0: T.operators, label: "OPERATORS", kind: "people" as const, x: 960 },
            { t0: T.autonomous, label: "AUTONOMY", kind: "command" as const, x: 1490 },
          ].map((d) => {
            const p = ease("back.out(1.5)")(clamp01((t - d.t0 + 0.3) / 0.5));
            return p > 0 ? (
              <g key={d.label} opacity={p}>
                <g transform={`translate(${d.x} 430) scale(${p})`}>
                  <circle r={110} fill={C.ink} fillOpacity={0.9} stroke={C.amber} strokeWidth={5} />
                  <circle r={134} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="10 14" opacity={0.5} transform={`rotate(${t * 30})`} />
                  <Glyph kind={d.kind} s={1} color={C.amber} />
                </g>
                <Tag x={d.x} y={580} text={d.label} p={prog(t, d.t0, d.t0 + 0.5, "none")} size={26} accent={C.amber} />
              </g>
            ) : null;
          })}
          {[
            { t0: T.fast, label: "VERY FAST DRONES", x: 430, icon: "fast" },
            { t0: T.weather, label: "BAD WEATHER", x: 960, icon: "weather" },
            { t0: T.directions, label: "MANY DIRECTIONS", x: 1490, icon: "many" },
          ].map((d) => {
            const p = ease("back.out(1.5)")(clamp01((t - d.t0 + 0.3) / 0.5));
            if (p <= 0) return null;
            return (
              <g key={d.label} opacity={p}>
                <g transform={`translate(${d.x} 760) scale(${p})`}>
                  <circle r={110} fill={C.ink} fillOpacity={0.9} stroke={C.red} strokeWidth={5} />
                  {d.icon === "fast" && (
                    <g>
                      <ShahedTop s={0.26} r={-90} />
                      {[0, 1, 2].map((k) => (
                        <path key={k} d={`M${-90 - k * 26},${-20 + k * 20} L${-30 - k * 26},${-20 + k * 20}`} stroke={C.red} strokeWidth={7} strokeLinecap="round" opacity={0.8 - k * 0.2} />
                      ))}
                    </g>
                  )}
                  {d.icon === "weather" && <Weather kind="rain" s={0.9} />}
                  {d.icon === "many" && (
                    <g>
                      {[0, 1, 2, 3, 4].map((k) => {
                        const a = (k / 5) * Math.PI * 2;
                        return <ShahedTop key={k} x={Math.cos(a) * 66} y={Math.sin(a) * 66} r={(a * 180) / Math.PI + 90} s={0.15} />;
                      })}
                    </g>
                  )}
                </g>
                <Tag x={d.x} y={862} text={d.label} p={prog(t, d.t0, d.t0 + 0.5, "none")} size={26} accent={C.red} />
                <Pulse x={d.x} y={790} p={prog(t, d.t0, d.t0 + 0.9, "none")} r={190} color={C.red} width={5} />
              </g>
            );
          })}
          {t > T.fast - 0.5 && <FPVTop x={960} y={430} s={0.001} />}
        </g>
      )}
    </Stage>
  );
};
