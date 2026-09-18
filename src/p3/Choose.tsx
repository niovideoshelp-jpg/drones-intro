import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { LaserTurret, SPAAG, Weather } from "../art/p3art";
import { Big, Interceptor, NoSign } from "../p2/shared";
import { ChainLink, DocPage, Magnifier, PriceTag, Pulse, StrikeLine, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { board, clamp01, ease, prog, rnd, useTime } from "../lib/kf";
import { Lens } from "../art/lens";
import { JammerMast } from "../art/ground";
import { at, P3_DURATION_S } from "./words";

const T = {
  none: at("None", 321),
  perfectly: at("perfectly."),
  lasers: at("Lasers", 323),
  struggle: at("struggle", 324),
  jammers: at("Jammers"),
  autonomous: at("autonomous", 327.8),
  guns: at("Guns", 329),
  range: at("range.", 329.5),
  cheapInt: at("interceptors"),
  saturated: at("saturated"),
  conventional: at("Conventional", 332.6),
  necessary: at("necessary"),
  threats: at("threats.", 339),
  so: at("So", 339.5),
  conclusion: at("conclusion"),
  d20: at("$20,000"),
  drone: at("drone", 343.5),
  millionDollar: at("million", 344.3),
  useless: at("useless."),
  its: at("It's", 346),
  standard: at("standard"),
  answer: at("answer,", 349),
  unsustainable: at("unsustainable.", 349.2),
  futureAD: at("future", 352),
  choose: at("choose."),
  ignore: at("Ignore"),
  realThreat: at("threat.", 357),
  jam: at("Jam", 357.5),
  jammed: at("jammed."),
  shoot: at("Shoot", 359.3),
  rangeGuns: at("guns", 359.5),
  dronesShoot: at("drones.", 362),
  save: at("save"),
  nothing: at("nothing"),
  enough: at("enough.", 366.1),
  because: at("Because", 368),
  winner: at("winner"),
  most: at("most", 371.8),
  keep: at("keep"),
  thousands: at("thousands", 375),
  again: at("again,", 375.5),
  sources: at("sources"),
  description: at("description,"),
  check: at("check"),
  yourself: at("yourself."),
};
export const CHOOSE_RANGE = [T.none - 0.4, P3_DURATION_S] as const;

const FLAWS = [
  { t: T.struggle, label: "LASERS · WEATHER", x: 330 },
  { t: T.autonomous, label: "JAMMERS · AUTONOMY", x: 750 },
  { t: T.range, label: "GUNS · RANGE", x: 1170 },
  { t: T.saturated, label: "INTERCEPTORS · SATURATION", x: 1590 },
];

const RULES = [
  { t: T.ignore, text: "IGNORE WHAT ISN'T A REAL THREAT", color: C.cyan },
  { t: T.jam, text: "JAM WHAT CAN BE JAMMED", color: C.blue },
  { t: T.shoot, text: "SHOOT DOWN WHAT'S IN RANGE", color: C.green },
  { t: T.save, text: "SAVE THE EXPENSIVE MISSILES", color: C.red },
];

export const Choose: React.FC = () => {
  const t = useTime();
  if (t < CHOOSE_RANGE[0]) return null;
  const end = prog(t, P3_DURATION_S - 0.6, P3_DURATION_S, "power2.in");

  const flawB = board(t, T.none - 0.3, T.so - 0.1);
  const needed = prog(t, T.conventional - 0.2, T.threats + 0.3, "power2.out");

  const concB = board(t, T.so - 0.2, T.ignore - 0.3, { hits: [T.useless + 0.1, T.unsustainable + 0.1] });
  const cross = prog(t, T.useless - 0.15, T.useless + 0.5, "power2.out");
  const stamp = prog(t, T.unsustainable - 0.2, T.unsustainable + 0.5, "back.out(2)");
  const chooseP = prog(t, T.futureAD - 0.2, T.choose + 0.4, "back.out(1.6)");

  const rulesB = board(t, T.ignore - 0.35, T.because - 0.1);
  const warB = board(t, T.because - 0.2, T.sources - 0.5);
  const srcB = board(t, T.sources - 1.1, P3_DURATION_S + 1);

  const counter = Math.round(clamp01((t - T.because) / (T.thousands + 0.6 - T.because)) * 4000);

  return (
    <Stage>
      <g opacity={1 - end}>
        {flawB.op > 0 && (
          <g opacity={flawB.op} transform={flawB.tf}>
            <Tag x={960} y={150} text="NOTHING WORKS PERFECTLY" p={prog(t, T.none - 0.2, T.perfectly + 0.4, "none")} size={40} accent={C.red} />
            {FLAWS.map((f, i) => {
              const lit = ease("back.out(1.5)")(clamp01((t - f.t + 0.35) / 0.5));
              const p = Math.max(lit, 0.8 * prog(t, T.none + 0.2, T.none + 0.8));
              if (p <= 0) return null;
              const k = ((((t - f.t) * 0.5) % 1) + 1) % 1;
              return (
                <g key={f.label}>
                  <Lens id={`flaw${i}`} x={f.x} y={430} r={125} t={t} s={p} opacity={lit > 0 ? 1 : 0.5} ring={C.red} sky={i === 0 ? "storm" : "day"} label={lit > 0 ? f.label : undefined} labelP={prog(t, f.t, f.t + 0.5, "none")}>
                    {i === 0 && (
                      <g>
                        <LaserTurret x={-40} y={52} s={0.36} beam={0.5 + 0.3 * Math.sin(t * 9)} angle={45} reach={150} />
                        <Weather kind="fog" s={0.8} y={-30} />
                      </g>
                    )}
                    {i === 1 && (
                      <g>
                        <g transform="translate(-50 52) scale(0.4)">
                          <JammerMast />
                        </g>
                        <ShahedTop x={60} y={-40} r={-90} s={0.14} />
                        <path d="M10,-60 L100,-10 M100,-60 L10,-10" stroke={C.red} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
                      </g>
                    )}
                    {i === 2 && (
                      <g>
                        <SPAAG x={-50} y={52} s={0.36} fire={0.8} angle={-30} />
                        <ShahedTop x={80} y={-70} r={-100} s={0.1} />
                      </g>
                    )}
                    {i === 3 && (
                      <g>
                        {[0, 1, 2, 3, 4, 5].map((j) => {
                          const a = (j / 6) * Math.PI * 2;
                          const rr = 110 - k * 50;
                          return <ShahedTop key={j} x={Math.cos(a) * rr} y={-20 + Math.sin(a) * rr * 0.55} r={(a * 180) / Math.PI + 90} s={0.1} />;
                        })}
                      </g>
                    )}
                  </Lens>
                  <NoSign x={f.x} y={430} p={prog(t, f.t, f.t + 0.5, "none")} r={132} />
                </g>
              );
            })}
            {needed > 0 && (
              <g opacity={needed}>
                <g transform={`translate(${900 + needed * 60} ${760 - needed * 20}) rotate(-12) scale(${0.62 * needed})`}>
                  <Interceptor kind="pac3" flame={0.8} />
                </g>
                <Tag x={960} y={860} text="STILL NECESSARY FOR THE HARDEST THREATS" p={needed} size={30} accent={C.red} />
              </g>
            )}
          </g>
        )}

        {concB.op > 0 && (
          <g opacity={concB.op} transform={concB.tf}>
            <g transform={`translate(${420 + Math.sin(t * 1.3) * 16} ${430 + Math.sin(t * 2.1) * 12})`}>
              <ShahedTop s={0.42} r={-90} />
              <PriceTag x={-150} y={168} text="$20,000" size={50} color={C.amber} s={prog(t, T.d20 - 0.2, T.d20 + 0.3, "back.out(2)")} />
            </g>
            <g transform={`translate(1520 ${430 + Math.cos(t * 1.7) * 12})`}>
              <Interceptor kind="pac3" s={0.8} r={-20} flame={0.4} />
              <PriceTag x={-130} y={168} text="$1M" size={50} color={C.red} s={prog(t, T.millionDollar - 0.2, T.millionDollar + 0.3, "back.out(2)")} />
            </g>
            <Big x={960} y={455} text="USELESS?" size={72} color={C.cream} opacity={prog(t, T.useless - 0.5, T.useless)} />
            <StrikeLine x1={790} y1={385} x2={1130} y2={495} p={cross} width={14} />
            {stamp > 0 && (
              <g transform={`translate(960 760) rotate(-5) scale(${stamp})`}>
                <rect x={-420} y={-64} width={840} height={128} rx={14} fill={C.ink} fillOpacity={0.9} stroke={C.red} strokeWidth={9} />
                <Big x={0} y={16} text="AS THE STANDARD ANSWER:" size={40} color={C.cream} />
                <Big x={0} y={70} text="UNSUSTAINABLE" size={54} color={C.red} />
              </g>
            )}
            {chooseP > 0 && <Tag x={960} y={915} text="AIR DEFENCE HAS TO LEARN HOW TO CHOOSE" p={chooseP} size={38} accent={C.amber} />}
          </g>
        )}

        {rulesB.op > 0 && (
          <g opacity={rulesB.op} transform={rulesB.tf}>
            <Tag x={960} y={180} text="HOW TO CHOOSE" p={prog(t, T.ignore - 0.3, T.ignore + 0.3, "none")} size={44} accent={C.cream} />
            {RULES.map((r, i) => {
              const p = ease("back.out(1.5)")(clamp01((t - r.t + 0.25) / 0.5));
              if (p <= 0) return null;
              const y = 360 + i * 150;
              return (
                <g key={r.text} opacity={p}>
                  <rect x={960 - 640 * p} y={y - 52} width={1280 * p} height={104} rx={12} fill={C.ink} fillOpacity={0.92} stroke={r.color} strokeWidth={5} />
                  <g transform={`translate(${430} ${y}) scale(${p})`}>
                    <circle r={34} fill={r.color} stroke={C.ink} strokeWidth={4} />
                    <path d="M-15,2 L-4,14 L16,-10" stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <Tag x={510} y={y} text={r.text} p={p} size={34} accent={r.color} anchor="start" />
                </g>
              );
            })}
          </g>
        )}

        {warB.op > 0 && (
          <g opacity={warB.op} transform={warB.tf}>
            <Tag x={960} y={200} text="IN A LONG WAR" p={prog(t, T.because - 0.2, T.because + 0.5, "none")} size={40} accent={C.cream} />
            <Big x={960} y={520} text={counter.toLocaleString("en-US")} size={190} color={C.amber} />
            <Tag x={960} y={620} text="THREATS HANDLED" p={prog(t, T.most - 0.2, T.most + 0.4, "none")} size={30} accent={C.amber} />
            {Array.from({ length: 22 }, (_, i) => {
              const k = (((t - T.because) * 0.2 + i / 22) % 1 + 1) % 1;
              return <ShahedTop key={i} x={1980 - k * 2100} y={760 + ((i * 47) % 3) * 90 + rnd(i, 3) * 20} r={-90} s={0.15} opacity={0.85} />;
            })}
            <Tag x={960} y={705} text="THE WINNER IS WHOEVER CAN KEEP DOING IT" p={prog(t, T.keep - 0.2, T.thousands + 0.5, "none")} size={32} accent={C.green} />
          </g>
        )}

        {srcB.op > 0 && (
          <g opacity={srcB.op} transform={srcB.tf}>
            {[0, 1, 2].map((i) => {
              const p = ease("back.out(1.6)")(clamp01((t - T.sources + 1.1 - i * 0.2) / 0.6));
              if (p <= 0) return null;
              return <DocPage key={i} x={700 + i * 260} y={440 + Math.sin(t * 1.6 + i * 1.2) * 10} s={0.52 * p} r={(i - 1) * 8} lines={prog(t, T.sources, T.description)} chart={prog(t, T.sources + 0.3, T.description + 0.5)} check={prog(t, T.check, T.check + 0.5)} tab={[C.blue, C.amber, C.red][i]} />;
            })}
            <g transform={`translate(430 700) scale(${0.5 * prog(t, T.description - 0.2, T.description + 0.4, "back.out(2)")})`}>
              <ChainLink join={1} />
            </g>
            <g transform={`translate(1420 640) scale(${0.7 * prog(t, T.check - 0.3, T.check + 0.3, "back.out(2)")})`}>
              <Magnifier />
            </g>
            <Tag x={960} y={860} text="SOURCES IN THE DESCRIPTION" p={prog(t, T.sources - 0.2, T.description + 0.4, "none")} size={38} accent={C.amber} />
            <Pulse x={960} y={440} p={prog(t, T.yourself, T.yourself + 1, "none")} r={300} color={C.amber} width={8} />
          </g>
        )}
      </g>
    </Stage>
  );
};
