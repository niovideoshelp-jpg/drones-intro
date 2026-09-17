import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { AAGunBig, CityBlock, Gauge, Tracers } from "../art/p2art";
import { Explosion, Pulse, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, rnd, useTime, win } from "../lib/kf";
import { at, P2_DURATION_S } from "./words";

const T = {
  and: at("And", 122.8),
  last: at("last"),
  limitation: at("limitation."),
  cheap: at("cheap", 125),
  dangerous: at("dangerous"),
  cities: at("cities."),
  gun: at("gun"),
  throw: at("throw"),
  dozens: at("dozens", 130),
  hundreds: at("hundreds", 130.5),
  rounds: at("rounds"),
  sky: at("sky"),
  bring: at("bring"),
  drone: at("drone.", 133.8),
  whatever: at("Whatever"),
  misses: at("misses"),
  come: at("come", 136),
  somewhere: at("somewhere."),
  wreckage: at("wreckage"),
  fuel: at("fuel,"),
  metal: at("metal,"),
  warhead: at("warhead."),
  near: at("Near"),
  isolated: at("isolated"),
  base: at("base,"),
  risk: at("risk", 145),
  acceptable: at("acceptable."),
  over: at("Over"),
  urban: at("urban"),
  area: at("area,", 147.5),
  decision: at("decision"),
  complicated: at("complicated."),
};
export const CITIES_RANGE = [T.and - 0.3, P2_DURATION_S] as const;

export const Cities: React.FC = () => {
  const t = useTime();
  if (t < CITIES_RANGE[0]) return null;

  const cityA = win(t, T.cheap - 0.4, T.near - 0.2, 0.5, 0.5);
  const fire = win(t, T.throw - 0.2, T.somewhere + 1.4, 0.2, 0.6);
  const rain = win(t, T.come - 0.2, T.warhead + 0.6, 0.4, 0.6);
  const hit = prog(t, T.drone - 0.25, T.drone + 0.9, "none");
  const wreck = prog(t, T.wreckage - 0.2, T.warhead + 0.6, "power1.in");
  const compareA = win(t, T.near - 0.3, P2_DURATION_S + 1, 0.5, 0.1) * (1 - prog(t, P2_DURATION_S - 0.5, P2_DURATION_S, "power2.in"));

  return (
    <Stage>
      {cityA > 0 && (
        <g opacity={cityA}>
          {[520, 960, 1400].map((x, i) => (
            <g key={x} transform={`translate(${x} ${900}) scale(${0.72 * ease("back.out(1.3)")(clamp01((t - T.cheap + 0.4 - i * 0.12) / 0.6))})`}>
              <CityBlock />
            </g>
          ))}
          <Tag x={960} y={210} text="DANGEROUS OVER CITIES" p={prog(t, T.dangerous - 0.2, T.cities + 0.4, "none")} size={40} accent={C.red} />
          <g transform={`translate(250 ${900}) scale(${0.85 * ease("back.out(1.4)")(clamp01((t - T.gun + 0.3) / 0.6))})`}>
            <AAGunBig fire={fire} />
          </g>
          <Tracers x={300} y={790} up={fire} down={rain} seed={2} />
          {hit < 0.2 && (
            <ShahedTop x={1320 - prog(t, T.gun, T.drone, "none") * 120} y={230 + Math.sin(t * 2) * 10} r={110} s={0.3} opacity={prog(t, T.gun - 0.6, T.gun)} />
          )}
          {hit > 0 && hit < 1 && <Explosion x={1200} y={230} p={hit} size={110} seed={31} />}
          {/* the wreck itself still carries fuel, metal, a warhead */}
          {wreck > 0 && wreck < 1 && (
            <g>
              <g transform={`translate(${1200 - 120 * wreck} ${240 + 560 * wreck * wreck}) rotate(${200 + wreck * 260}) scale(0.3)`}>
                <ShahedTop tone="#5A5450" />
              </g>
              {[
                { t0: T.fuel, label: "FUEL", dx: -240 },
                { t0: T.metal, label: "METAL", dx: 0 },
                { t0: T.warhead, label: "WARHEAD", dx: 250 },
              ].map((c) => (
                <Tag key={c.label} x={960 + c.dx} y={560} text={c.label} p={prog(t, c.t0 - 0.1, c.t0 + 0.5, "none")} size={30} accent={C.red} />
              ))}
            </g>
          )}
          {rain > 0 &&
            Array.from({ length: 5 }, (_, i) => {
              const t0 = T.come + i * 0.25;
              return <Pulse key={i} x={430 + rnd(i, 4) * 1200} y={840} p={prog(t, t0, t0 + 0.9, "none")} r={90} color={C.red} width={5} />;
            })}
        </g>
      )}

      {compareA > 0 && (
        <g opacity={compareA}>
          {[
            { key: "base", x: 540, t0: T.isolated, label: "ISOLATED BASE", risk: 0.25, color: C.green, tRisk: T.acceptable },
            { key: "urban", x: 1380, t0: T.urban, label: "URBAN AREA", risk: 0.92, color: C.red, tRisk: T.complicated },
          ].map((c) => {
            const p = ease("back.out(1.5)")(clamp01((t - c.t0 + 0.3) / 0.6));
            if (p <= 0) return null;
            return (
              <g key={c.key} opacity={p}>
                <rect x={c.x - 380} y={200} width={760} height={700} rx={24} fill={C.ink} fillOpacity={0.55} stroke={c.color} strokeWidth={5} />
                <g transform={`translate(${c.x} ${640}) scale(${c.key === "urban" ? 0.78 : 0.8})`}>
                  {c.key === "urban" ? (
                    <CityBlock />
                  ) : (
                    <g>
                      <g transform="scale(0.9)">
                        <CityBlock lit={0} opacity={0.25} />
                      </g>
                    </g>
                  )}
                </g>
                <Tag x={c.x} y={280} text={c.label} p={prog(t, c.t0, c.t0 + 0.5, "none")} size={36} accent={c.color} />
                <Gauge x={c.x} y={840} value={c.risk * prog(t, c.tRisk - 0.5, c.tRisk + 0.3, "power2.out")} color={c.color} s={1.3} />
                <Tag x={c.x} y={905} text={c.key === "base" ? "RISK ACCEPTABLE" : "DECISION GETS HARDER"} p={prog(t, c.tRisk - 0.2, c.tRisk + 0.5, "none")} size={26} accent={c.color} />
              </g>
            );
          })}
        </g>
      )}
    </Stage>
  );
};
