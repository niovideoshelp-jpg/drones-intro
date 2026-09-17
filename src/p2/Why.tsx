import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { LauncherSide } from "../art/ground";
import { FuelDepot } from "../art/p1art";
import { Big, Interceptor } from "../art/p1art";
import { CityBlock, Warship } from "../art/p2art";
import { Explosion, PriceTag, Pulse, Query, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
import { at } from "./words";

const T = {
  why: at("Why"),
  expensive: at("expensive"),
  missileQ: at("missile?"),
  first: at("first"),
  answer: at("answer"),
  simple: at("simple."),
  defense: at("defense"),
  isnt: at("isn't"),
  drone: at("drone."),
  its: at("It's"),
  behind: at("behind"),
  it: at("it."),
  if: at("If"),
  d30: at("$30,000"),
  flying: at("flying"),
  warship: at("warship,"),
  patriot: at("Patriot"),
  battery: at("battery,"),
  fuel: at("fuel"),
  depot: at("depot,"),
  densely: at("densely"),
  area: at("area,"),
  firing: at("firing"),
  million: at("million"),
  missile2: at("missile", 18.8),
  rational: at("rational."),
  value: at("value"),
  protected: at("protected,"),
  risk: at("risk"),
  crew: at("crew,"),
  impact: at("impact"),
  dozens: at("dozens,"),
  hundreds: at("hundreds"),
  higher: at("higher."),
  theres: at("There's"),
};
export const WHY_RANGE = [0, T.theres + 0.8] as const;

const ASSETS = [
  { key: "ship", t: T.warship, x: 330, label: "WARSHIP" },
  { key: "patriot", t: T.battery, x: 760, label: "PATRIOT BATTERY" },
  { key: "fuel", t: T.depot, x: 1190, label: "FUEL DEPOT" },
  { key: "city", t: T.area, x: 1620, label: "POPULATED AREA" },
];

const VALUES = [
  { t: T.protected, label: "VALUE PROTECTED" },
  { t: T.crew, label: "RISK TO THE CREW" },
  { t: T.impact, label: "MILITARY IMPACT" },
];

export const Why: React.FC = () => {
  const t = useTime();
  if (t > WHY_RANGE[1]) return null;

  /* ---- the question ---- */
  const qA = win(t, 0, T.defense + 0.3, 0.5, 0.5);
  const qIn = ease("back.out(1.5)")(clamp01((t - 0.1) / 0.8));
  const qMark = ease("back.out(2.5)")(clamp01((t - T.missileQ + 0.2) / 0.5));
  const answer = prog(t, T.first - 0.1, T.simple + 0.2, "power2.out");

  /* ---- it is not about the drone ---- */
  const bA = win(t, T.defense - 0.2, T.rational + 0.7, 0.4, 0.5);
  const droneDim = prog(t, T.drone - 0.1, T.drone + 0.6);
  const spotlight = prog(t, T.its - 0.2, T.behind + 0.3, "power2.inOut");
  const droneX = 150 + prog(t, T.defense, T.million, "none") * 620;

  /* ---- fire ---- */
  const fire = prog(t, T.firing, T.missile2 + 0.4, "power1.in");
  const hit = prog(t, T.missile2 + 0.4, T.missile2 + 1.4, "none");
  const rational = prog(t, T.rational - 0.1, T.rational + 0.5, "back.out(2)");

  /* ---- the multiplier ---- */
  const vA = win(t, T.value - 0.3, T.theres + 0.5, 0.4, 0.5);
  const mult = t < T.dozens ? 0 : t < T.hundreds ? 1 : 2;
  const multP = prog(t, T.dozens - 0.1, T.higher + 0.2, "power2.out");
  const multText = mult === 0 ? "" : mult === 1 ? "×DOZENS" : "×HUNDREDS";

  return (
    <Stage>
      {qA > 0 && (
        <g opacity={qA}>
          <g transform={`translate(760 ${430 + Math.sin(t * 1.6) * 8}) scale(${1.3 * qIn})`}>
            <Interceptor kind="pac3" flame={0.6} />
          </g>
          <PriceTag x={1130} y={430} text="$1M" size={72} color={C.amber} s={qIn} />
          {qMark > 0 && <Query x={960} y={660} s={2.6 * qMark} color={C.amber} />}
          {answer > 0 && (
            <g opacity={answer}>
              <Tag x={960} y={880} text="ANSWER 1" p={answer} size={40} accent={C.cyan} />
            </g>
          )}
        </g>
      )}

      {bA > 0 && (
        <g opacity={bA}>
          {/* the drone: not the thing being protected */}
          <g opacity={1 - 0.55 * droneDim}>
            <ShahedTop x={droneX} y={300} r={90} s={0.34} />
            <path d={`M60,300 L${droneX - 60},300`} stroke={C.red} strokeWidth={4} strokeDasharray="12 9" opacity={0.7} />
            <PriceTag x={droneX - 120} y={210} text="$30,000" size={44} color={C.cream} s={prog(t, T.d30 - 0.1, T.d30 + 0.3, "back.out(2)")} />
          </g>

          {/* what is behind it */}
          {spotlight > 0 && (
            <g>
              <rect x={200} y={470} width={1560 * spotlight} height={420} rx={26} fill={C.cyan} opacity={0.07} />
              <rect x={200} y={470} width={1560 * spotlight} height={420} rx={26} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="18 14" strokeDashoffset={-t * 30} opacity={0.6} />
              <Tag x={960} y={430} text="WHAT'S BEHIND IT" p={prog(t, T.behind - 0.15, T.it + 0.4, "none")} size={38} accent={C.cyan} />
              {/* the assets are there from the start, dim until each one is named */}
              {ASSETS.map((a) => {
                const named = prog(t, a.t - 0.3, a.t + 0.3);
                return (
                  <g key={`g${a.key}`} opacity={(1 - named) * 0.45 * spotlight}>
                    <g transform={`translate(${a.x} ${a.key === "ship" ? 700 : 690}) scale(${a.key === "ship" ? 0.5 : a.key === "patriot" ? 0.62 : 0.66})`}>
                      {a.key === "ship" && <Warship />}
                      {a.key === "patriot" && <LauncherSide elev={40} />}
                      {a.key === "fuel" && <FuelDepot />}
                      {a.key === "city" && <CityBlock lit={0} />}
                    </g>
                  </g>
                );
              })}
            </g>
          )}
          {ASSETS.map((a) => {
            const p = ease("back.out(1.5)")(clamp01((t - a.t + 0.3) / 0.6));
            if (p <= 0) return null;
            return (
              <g key={a.key} opacity={p}>
                <g transform={`translate(${a.x} ${a.key === "ship" ? 700 : 690}) scale(${(a.key === "ship" ? 0.5 : a.key === "patriot" ? 0.62 : 0.66) * p})`}>
                  {a.key === "ship" && <Warship />}
                  {a.key === "patriot" && <LauncherSide elev={40} />}
                  {a.key === "fuel" && <FuelDepot />}
                  {a.key === "city" && <CityBlock />}
                </g>
                <Tag x={a.x} y={880} text={a.label} p={prog(t, a.t, a.t + 0.6, "none")} size={26} accent={C.cyan} />
              </g>
            );
          })}

          {/* the shot */}
          {fire > 0 && hit <= 0 && (
            <g transform={`translate(${760 + (droneX - 760) * fire} ${640 - 330 * fire}) rotate(${-60 + fire * 20}) scale(0.5)`}>
              <Interceptor kind="pac3" flame={1} />
            </g>
          )}
          {hit > 0 && hit < 1 && <Explosion x={droneX} y={300} p={hit} size={110} seed={7} />}
          {rational > 0 && (
            <g transform={`translate(1500 300) scale(${rational})`}>
              <circle r={62} fill={C.green} stroke={C.ink} strokeWidth={6} />
              <path d="M-28,2 L-9,24 L30,-20" stroke={C.ink} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </g>
      )}

      {vA > 0 && (
        <g opacity={vA}>
          {VALUES.map((v, i) => {
            const p = ease("back.out(1.6)")(clamp01((t - v.t + 0.25) / 0.5));
            if (p <= 0) return null;
            const y = 330 + i * 150;
            return (
              <g key={v.label} opacity={p}>
                <rect x={330} y={y - 44} width={760 * p} height={88} rx={10} fill={C.ink} fillOpacity={0.9} stroke={C.cyan} strokeWidth={4} />
                <Tag x={420} y={y} text={v.label} p={p} size={34} accent={C.cyan} anchor="start" />
              </g>
            );
          })}
          {multP > 0 && (
            <g transform={`translate(1450 ${480}) scale(${0.9 + 0.35 * multP})`}>
              <Big x={0} y={40} text={multText} size={92} color={C.red} />
              <Pulse x={0} y={0} p={prog(t, T.hundreds, T.hundreds + 1, "none")} r={420} color={C.red} width={10} />
            </g>
          )}
        </g>
      )}
    </Stage>
  );
};
