import React from "react";
import { C } from "../design";
import { FPVSide, ShahedTop } from "../art/drones";
import { Lens } from "../art/lens";
import { CityBlock, Glyph, Tracers } from "../art/p2art";
import { aimCIWS, aimSPAAG, CIWS, RocketPod, SPAAG, Weather } from "../art/p3art";
import { Big, Interceptor, NoSign } from "../p2/shared";
import { Explosion, PriceTag, Reticle, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { board, clamp01, ease, prog, useTime, win } from "../lib/kf";
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
  const gunB = board(t, T.when - 0.2, T.physical - 0.4, { hits: [T.airburst + 0.1, T.apkws + 0.8] });
  const fire = win(t, T.guns, T.but, 0.4, 0.6);
  const burst = prog(t, T.airburst - 0.2, T.ammunition + 0.6, "none");
  const rocket = prog(t, T.guided - 0.2, T.apkws + 0.8, "power1.in");
  const rHit = prog(t, T.apkws + 0.8, T.apkws + 1.8, "none");
  const priceP = prog(t, T.tens - 0.2, T.dollars + 0.3, "back.out(2)");
  const trade = prog(t, T.better - 0.2, T.missile + 0.4, "power2.out");
  /* what the guns are shooting at: one drone until the airburst, a second one after it */
  const first = t < T.airburst - 0.2;
  const tgtX = first ? 1760 - prog(t, T.guns, T.airburst - 0.2, "none") * 440 : 1760 - prog(t, T.ammunition + 0.6, T.but, "none") * 420;
  const tgtY = first ? 300 : 250 + Math.sin(t * 1.8) * 12;
  const alive = first || t > T.ammunition + 0.6;
  const GUN_Y = 780;

  /* ---- their limits ---- */
  const limB = board(t, T.physical - 0.5, T.another - 0.3);
  const ring = prog(t, T.close - 0.2, T.target + 0.3, "power2.out");
  const rain = win(t, T.rounds - 0.3, T.another - 0.4, 0.3, 0.5);

  /* ---- interceptor drones ---- */
  const dB = board(t, T.another - 0.2, T.butThey + 0.15, { hits: [T.destroy + 0.25] });
  const approach = prog(t, T.interceptorD, T.send - 0.2, "none");
  const chase = prog(t, T.send - 0.2, T.destroy + 0.2, "power1.inOut");
  const kill = prog(t, T.destroy + 0.2, T.destroy + 1.2, "none");
  const bars = prog(t, T.brings - 0.2, T.attacking + 0.4, "power2.inOut");
  const under = prog(t, T.cases - 0.2, T.threatCheap + 0.3, "power2.inOut");
  const shX = 260 + 440 * approach + 680 * chase;
  const shY = 440 - 60 * chase + Math.sin(t * 2) * 10;
  const fpX = approach < 1 ? 360 + (shX - 300 - 360) * approach : shX - 300 + 220 * chase;
  const fpY = (approach < 1 ? 860 - 320 * approach : 540 - 110 * chase) + Math.sin(t * 3.2) * 12;

  /* ---- their limits ---- */
  const dLimB = board(t, T.butThey - 0.15, T.and + 0.5);

  return (
    <Stage>
      {gunB.op > 0 && (
        <g opacity={gunB.op} transform={gunB.tf}>
          <Tag x={960} y={150} text="LOWER-COST GUNS & ROCKETS" p={prog(t, T.when, T.rockets + 0.4, "none")} size={38} accent={C.green} />
          <path d={`M180,${GUN_Y} L1740,${GUN_Y}`} stroke={C.cream} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
          {/* the target the guns are tracking */}
          {alive && (burst <= 0 || burst >= 1) && <ShahedTop x={tgtX} y={tgtY} r={-90} s={0.28} opacity={prog(t, T.guns - 0.4, T.guns)} />}
          {GUNS.map((g, i) => {
            const p = ease("back.out(1.4)")(clamp01((t - (T.enough - 0.1 + i * 0.45)) / 0.6));
            if (p <= 0) return null;
            const s = (i === 1 ? 1.15 : 0.9) * p;
            const aim = i === 1 ? aimCIWS(tgtX, tgtY, g.x, GUN_Y, s) : aimSPAAG(tgtX, tgtY, g.x, GUN_Y, s);
            return (
              <g key={g.label} opacity={p}>
                <g transform={`translate(${g.x} ${GUN_Y}) scale(${s})`}>
                  {i === 1 ? <CIWS fire={fire} angle={aim.angle} /> : <SPAAG fire={fire} angle={aim.angle} />}
                </g>
                <Tag x={g.x} y={860} text={g.label} p={prog(t, g.t, g.t + 0.5, "none")} size={30} accent={C.green} />
                {fire > 0 && alive && <Tracers x={aim.mx} y={aim.my} up={fire * 0.85} tx={tgtX} ty={tgtY} seed={i} />}
              </g>
            );
          })}
          {/* airburst round bursting into fragments in front of the drone */}
          {burst > 0 && burst < 1 && (
            <g>
              <ShahedTop x={1320} y={300} r={-90} s={0.28} opacity={1 - burst} />
              <g transform="translate(1250 310)">
                {Array.from({ length: 16 }, (_, i) => {
                  const a = (i / 16) * Math.PI * 2;
                  const d = 30 + burst * 190;
                  return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d * 0.7} r={7 * (1 - burst)} fill={C.amber} />;
                })}
                <circle r={40 * (1 - burst)} fill="#FFE7A6" opacity={1 - burst} />
              </g>
              <Explosion x={1320} y={300} p={burst} size={120} seed={11} />
              <Tag x={1250} y={190} text="AIRBURST" p={prog(t, T.airburst, T.ammunition + 0.3, "none")} size={26} accent={C.amber} />
            </g>
          )}
          {/* guided rocket, from its own pod between the Gepard and the C-RAM */}
          {rocket > 0 && (
            <g>
              <g transform={`translate(700 ${GUN_Y}) scale(0.7)`}>
                <RocketPod fire={rocket < 1 ? 1 : 0} />
              </g>
              {rocket < 1 && (
                <g transform={`translate(${760 + 640 * rocket} ${720 - 440 * rocket}) rotate(${-34})`}>
                  <Interceptor kind="aim120" s={0.4} flame={1} />
                </g>
              )}
              {rHit > 0 && rHit < 1 && <Explosion x={1400} y={280} p={rHit} size={110} seed={4} />}
              <Tag x={700} y={905} text="APKWS GUIDED ROCKET" p={prog(t, T.apkws - 0.2, T.apkws + 0.6, "none")} size={26} accent={C.green} />
            </g>
          )}
          {priceP > 0 && <PriceTag x={330} y={250} text="TENS OF THOUSANDS" size={44} color={C.green} s={priceP} />}
          {trade > 0 && (
            <g opacity={trade}>
              <PriceTag x={1010} y={250} text="$1M" size={44} color={C.red} s={trade} />
              <path d="M720,250 L970,250" stroke={C.cream} strokeWidth={5} strokeDasharray="12 10" strokeDashoffset={-t * 30} />
              <g transform={`translate(845 250) scale(${trade})`}>
                <circle r={44} fill={C.green} stroke={C.ink} strokeWidth={5} />
                <path d="M-20,2 L-6,18 L22,-14" stroke={C.ink} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          )}
        </g>
      )}

      {limB.op > 0 && (
        <g opacity={limB.op} transform={limB.tf}>
          <Tag x={960} y={150} text="ONLY IF IT IS CLOSE ENOUGH" p={prog(t, T.physical - 0.2, T.target + 0.4, "none")} size={38} accent={C.red} />
          <path d="M180,820 L1740,820" stroke={C.cream} strokeWidth={6} strokeLinecap="round" opacity={0.5} />
          {/* the reach of a gun: a dome sitting on the ground, never below it */}
          {ring > 0 && (
            <g>
              <path d={`M${700 - 360 * ring},820 A${360 * ring},${330 * ring} 0 0 1 ${700 + 360 * ring},820Z`} fill={C.green} fillOpacity={0.08} stroke={C.green} strokeWidth={5} strokeDasharray="18 12" strokeDashoffset={t * 25} />
              <Tag x={700} y={440} text="SHORT RANGE" p={prog(t, T.shorter - 0.2, T.shorter + 0.5, "none")} size={26} accent={C.green} />
            </g>
          )}
          <g transform="translate(700 820) scale(0.9)">
            <SPAAG fire={0} angle={-30} />
          </g>
          <ShahedTop x={1500 - 40 * Math.sin(t * 0.8)} y={330} r={-100} s={0.3} opacity={ring} />
          <path d={`M1060,470 L1440,360`} stroke={C.red} strokeWidth={4} strokeDasharray="10 10" opacity={ring * 0.6} />
          <NoSign x={1250} y={420} p={prog(t, T.line - 0.1, T.line + 0.7, "none")} r={80} />
          {/* line of fire over the city, and the rounds that come back down on it */}
          <g transform="translate(1480 820) scale(0.7)" opacity={prog(t, T.urban - 0.3, T.urban + 0.4)}>
            <CityBlock />
          </g>
          <Tracers x={760} y={660} up={0} down={rain} seed={5} area={{ x0: 1330, x1: 1640, y0: 330, y1: 790 }} />
          <Tag x={1480} y={900} text="ROUNDS COME BACK DOWN" p={prog(t, T.debris - 0.2, T.ground + 0.4, "none")} size={28} accent={C.red} />
        </g>
      )}

      {dB.op > 0 && (
        <g opacity={dB.op} transform={dB.tf}>
          <Tag x={960} y={150} text="INTERCEPTOR DRONES" p={prog(t, T.another - 0.1, T.interceptorD + 0.4, "none")} size={38} accent={C.amber} />
          <Tag x={960} y={215} text="UKRAINE" p={prog(t, T.ukraine - 0.1, T.economics + 0.4, "none")} size={30} accent={C.blue} />
          {/* the raid that pays for all this, far behind the chase */}
          <g opacity={0.45}>
            {[0, 1, 2, 3].map((i) => {
              const k = (((t - T.another) * 0.07 + i * 0.25) % 1 + 1) % 1;
              return <ShahedTop key={i} x={1980 - k * 2100} y={330 + (i % 2) * 90} r={-90} s={0.14} />;
            })}
          </g>
          {/* the chase, large and in the middle of the frame */}
          {kill <= 0 && (
            <g>
              <path d={`M${fpX - 200},${fpY + 40} Q${(fpX + shX) / 2},${fpY + 60} ${fpX},${fpY}`} fill="none" stroke={C.amber} strokeWidth={5} strokeDasharray="14 10" strokeDashoffset={-t * 60} opacity={0.7 * clamp01(chase * 4 + approach)} />
              <ShahedTop x={shX} y={shY} r={-90} s={0.5} />
              <FPVSide x={fpX} y={fpY} s={1.05} r={-12 + chase * 10} />
              {chase > 0.6 && <Reticle x={shX} y={shY} size={160} lock={(chase - 0.6) * 2.5} color={C.amber} />}
            </g>
          )}
          {kill > 0 && kill < 1 && <Explosion x={1380} y={380} p={kill} size={200} seed={77} />}
          {/* the two costs converging */}
          {bars > 0 && (
            <g>
              <rect x={640} y={820 - 180 * (1 - 0.55 * bars - 0.25 * under)} width={180} height={180 * (1 - 0.55 * bars - 0.25 * under)} fill={C.red} stroke={C.ink} strokeWidth={4} />
              <rect x={1100} y={820 - 150} width={180} height={150} fill={C.amber} stroke={C.ink} strokeWidth={4} />
              <Tag x={730} y={862} text="DEFENDING" p={bars} size={24} accent={C.red} />
              <Tag x={1190} y={862} text="ATTACKING" p={bars} size={24} accent={C.amber} />
              {under > 0.4 && <Big x={960} y={600} text="CHEAPER" size={70} color={C.green} opacity={under} />}
            </g>
          )}
        </g>
      )}

      {dLimB.op > 0 && (
        <g opacity={dLimB.op} transform={dLimB.tf}>
          <Tag x={960} y={150} text="THEY DO NOT SOLVE EVERYTHING" p={prog(t, T.butThey, T.depend + 0.4, "none")} size={38} accent={C.red} />
          {[
            { t0: T.sensors, label: "SENSORS", kind: "radar" as const, x: 560 },
            { t0: T.operators, label: "OPERATORS", kind: "people" as const, x: 960 },
            { t0: T.autonomous, label: "AUTONOMY", kind: "command" as const, x: 1360 },
          ].map((d, i) => {
            const p = Math.max(ease("back.out(1.5)")(clamp01((t - d.t0 + 0.3) / 0.5)), 0.8 * prog(t, T.butThey + 0.2, T.butThey + 0.8));
            return (
              <Lens key={d.label} id={`dep${i}`} x={d.x} y={370} r={105} t={t} s={p} opacity={t < d.t0 - 0.3 ? 0.5 : 1} label={t > d.t0 - 0.3 ? d.label : undefined} labelP={prog(t, d.t0, d.t0 + 0.5, "none")}>
                <g transform="translate(0 16)">
                  <Glyph kind={d.kind} s={0.6} color={C.cream} />
                </g>
                <FPVSide x={-40 + ((((t * 0.3 + i * 0.33) % 1) + 1) % 1) * 90} y={-55} s={0.22} />
              </Lens>
            );
          })}
          {[
            { t0: T.fast, label: "VERY FAST DRONES", x: 560, icon: "fast", sky: "day" as const },
            { t0: T.weather, label: "BAD WEATHER", x: 960, icon: "weather", sky: "storm" as const },
            { t0: T.directions, label: "MANY DIRECTIONS", x: 1360, icon: "many", sky: "dusk" as const },
          ].map((d, i) => {
            const p = ease("back.out(1.5)")(clamp01((t - d.t0 + 0.3) / 0.5));
            const k = ((((t - d.t0) * 0.9) % 1) + 1) % 1;
            return (
              <Lens key={d.label} id={`lim${i}`} x={d.x} y={700} r={105} t={t} s={p} ring={C.red} sky={d.sky} label={d.label} labelP={prog(t, d.t0, d.t0 + 0.5, "none")}>
                {d.icon === "fast" && (
                  <g>
                    <ShahedTop x={-130 + k * 260} y={-30} r={-90} s={0.16} />
                    {[0, 1, 2].map((j) => (
                      <path key={j} d={`M${-130 + k * 260 - 40 - j * 22},${-40 + j * 10} L${-130 + k * 260 - 10 - j * 22},${-40 + j * 10}`} stroke={C.cream} strokeWidth={5} strokeLinecap="round" opacity={0.7 - j * 0.2} />
                    ))}
                  </g>
                )}
                {d.icon === "weather" && (
                  <g>
                    <Weather kind="rain" s={0.75} y={-30} />
                    <FPVSide x={Math.sin(t * 5) * 16} y={-10 + Math.cos(t * 4) * 10} s={0.24} r={Math.sin(t * 6) * 16} />
                  </g>
                )}
                {d.icon === "many" && (
                  <g>
                    {[0, 1, 2, 3, 4].map((j) => {
                      const a = (j / 5) * Math.PI * 2 + 0.3;
                      const rr = 95 - k * 55;
                      return <ShahedTop key={j} x={Math.cos(a) * rr} y={-20 + Math.sin(a) * rr * 0.6} r={(a * 180) / Math.PI + 90} s={0.1} />;
                    })}
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
