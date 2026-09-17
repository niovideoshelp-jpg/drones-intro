import React from "react";
import { geoOrthographic, geoPath } from "d3-geo";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { Big, PriceTicker } from "../art/p1art";
import { DocPage, Pulse, Reticle, StrikeLine, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, useTime, win } from "../lib/kf";
import { LonLat, REGION, arcPoints } from "../lib/geo";
import { at } from "./words";

const T = {
  inAn: at("In", 116),
  analysis: at("analysis"),
  russian: at("Russian", 116.5),
  campaign: at("campaign"),
  ukraine: at("Ukraine,"),
  csis: at("CSIS", 119),
  calculation: at("calculation."),
  if: at("If", 122),
  shahed: at("Shahed"),
  d35: at("$35,000,", 123),
  roughly: at("roughly"),
  pct: at("90%"),
  intercepted: at("intercepted,"),
  offensive: at("offensive"),
  cost: at("cost", 129),
  d35b: at("$35,000", 129.8),
  anymore: at("anymore."),
  climbs: at("climbs"),
  d350: at("$350,000"),
  target: at("target", 136),
  struck: at("struck."),
  thats: at("That's"),
  difference: at("difference."),
  but: at("But", 139.5),
};
export const CALC_RANGE = [T.inAn - 0.3, T.but + 0.8] as const;

/* ---------- small textured map lens ---------- */
const MAP_CX = 960;
const MAP_CY = 540;
const MAP_R = 360;
const proj = geoOrthographic().rotate([-35, -49]).scale(1750).translate([MAP_CX, MAP_CY]).clipAngle(90).precision(0.6);
const path = geoPath(proj);
const LAND = REGION.filter((c) => c.iso !== "NKR").map((c) => ({ iso: c.iso, d: path(c.g) ?? "" })).filter((c) => c.d);
const LAND_ALL = LAND.map((c) => c.d).join("");
const SRC: LonLat[] = [
  [38.2, 51.4],
  [39.4, 47.4],
  [34.6, 45.3],
  [37.1, 50.8],
  [41.0, 49.2],
];
const DST: LonLat[] = [
  [30.5, 50.45],
  [36.2, 50.0],
  [30.7, 46.5],
  [35.0, 48.45],
  [24.0, 49.8],
];

const MiniMap: React.FC<{ t: number; a: number; shrink: number }> = ({ t, a, shrink }) => {
  const s = (0.6 + 0.4 * ease("back.out(1.3)")(clamp01((t - T.inAn + 0.2) / 0.7))) * (1 - 0.72 * shrink);
  const x = MAP_CX + (330 - MAP_CX) * shrink;
  const y = MAP_CY + (240 - MAP_CY) * shrink;
  const rus = prog(t, T.russian - 0.1, T.russian + 0.4);
  const ukr = prog(t, T.ukraine - 0.1, T.ukraine + 0.4);
  return (
    <g opacity={a} transform={`translate(${x} ${y}) scale(${s}) translate(${-MAP_CX} ${-MAP_CY})`}>
      <defs>
        <clipPath id="p1-lens">
          <circle cx={MAP_CX} cy={MAP_CY} r={MAP_R} />
        </clipPath>
        <clipPath id="p1-land">
          <path d={LAND_ALL} />
        </clipPath>
      </defs>
      <circle cx={MAP_CX} cy={MAP_CY} r={MAP_R + 18} fill={C.ink} />
      <g clipPath="url(#p1-lens)">
        <rect x={MAP_CX - MAP_R} y={MAP_CY - MAP_R} width={MAP_R * 2} height={MAP_R * 2} fill={C.ocean} />
        {LAND.map((c) => (
          <path key={c.iso + c.d.length} d={c.d} fill={c.iso === "RUS" ? C.amber : c.iso === "UKR" ? C.blue : C.land} fillOpacity={c.iso === "RUS" ? 0.35 + 0.55 * rus : c.iso === "UKR" ? 0.35 + 0.55 * ukr : 1} />
        ))}
        <rect x={MAP_CX - MAP_R} y={MAP_CY - MAP_R} width={MAP_R * 2} height={MAP_R * 2} fill="url(#pat-mottle)" clipPath="url(#p1-land)" />
        <rect x={MAP_CX - MAP_R} y={MAP_CY - MAP_R} width={MAP_R * 2} height={MAP_R * 2} fill="url(#pat-contours)" clipPath="url(#p1-land)" opacity={0.4} />
        <path d={LAND_ALL} fill="none" stroke={C.ink} strokeOpacity={0.55} strokeWidth={2} />
        {SRC.map((src, i) => {
          const t0 = T.campaign - 0.3 + i * 0.3;
          const p = ((t - t0) / 1.6 + 1) % 1;
          if (t < t0) return null;
          const pts = arcPoints(src, DST[i], p, 1.2, 24);
          const d = path({ type: "LineString", coordinates: pts }) ?? "";
          const a0 = proj(pts[Math.max(0, pts.length - 2)]) as [number, number];
          const a1 = proj(pts[pts.length - 1]) as [number, number];
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="10 7" />
              <ShahedTop x={a1[0]} y={a1[1]} r={(Math.atan2(a1[1] - a0[1], a1[0] - a0[0]) * 180) / Math.PI + 90} s={0.13} detail={false} />
            </g>
          );
        })}
      </g>
      <circle cx={MAP_CX} cy={MAP_CY} r={MAP_R + 8} fill="none" stroke={C.amber} strokeWidth={10} />
      <circle cx={MAP_CX} cy={MAP_CY} r={MAP_R + 30} fill="none" stroke={C.amber} strokeWidth={3} strokeDasharray="8 12" transform={`rotate(${t * 12} ${MAP_CX} ${MAP_CY})`} />
      <Tag x={MAP_CX + 150} y={MAP_CY - 170} text="RUSSIA" p={rus * (1 - shrink)} size={40} accent={C.amber} />
      <Tag x={MAP_CX - 160} y={MAP_CY + 40} text="UKRAINE" p={ukr * (1 - shrink)} size={40} accent={C.blue} />
    </g>
  );
};

const money = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;

export const Calc: React.FC = () => {
  const t = useTime();
  if (t < CALC_RANGE[0] || t > CALC_RANGE[1]) return null;

  const mapA = win(t, T.inAn - 0.2, T.if + 0.3, 0.4, 0.5);
  const shrink = prog(t, T.csis - 0.1, T.calculation, "power3.inOut");
  const boardA = win(t, T.csis - 0.1, T.but + 0.7, 0.4, 0.6);

  const rowA = ease("back.out(1.6)")(clamp01((t - T.shahed + 0.2) / 0.55));
  const iconsIn = (i: number) => ease("back.out(2)")(clamp01((t - T.roughly + 0.2 - i * 0.05) / 0.35));
  const killed = (i: number) => prog(t, T.pct + 0.1 + i * ((T.intercepted + 0.3 - T.pct) / 9), T.pct + 0.35 + i * ((T.intercepted + 0.3 - T.pct) / 9), "back.out(2)");
  const perHit = t < T.climbs ? 35000 : 35000 + 315000 * ease("power2.inOut")(prog(t, T.climbs, T.d350 + 0.2, "none"));
  const hitIn = prog(t, T.d35b - 0.1, T.d35b + 0.3, "back.out(2)");
  const strikeOld = prog(t, T.anymore - 0.1, T.anymore + 0.3, "power2.out") * (1 - prog(t, T.climbs - 0.1, T.climbs + 0.2));
  const big = prog(t, T.thats - 0.1, T.difference + 0.2, "back.out(2)");

  return (
    <Stage>
      <g opacity={boardA * 0.7}>
        <PriceTicker x={92} seed={11} opacity={0.22} speed={18} />
        <PriceTicker x={1828} seed={17} opacity={0.22} speed={25} />
      </g>
      {mapA > 0 && <MiniMap t={t} a={mapA} shrink={shrink} />}

      {boardA > 0 && (
        <g opacity={boardA}>
          {/* source */}
          <g transform={`translate(960 ${150 + Math.sin(t * 1.3) * 4}) scale(${ease("back.out(2)")(prog(t, T.csis - 0.2, T.csis + 0.3))})`}>
            <DocPage x={-150} y={10} s={0.26} r={-8} lines={prog(t, T.csis, T.calculation)} chart={prog(t, T.csis + 0.3, T.calculation + 0.6)} tab={C.blue} />
            <Tag x={30} y={10} text="CSIS" p={prog(t, T.csis - 0.05, T.csis + 0.5, "none")} size={46} accent={C.blue} />
          </g>

          {/* row A: price of one drone */}
          {rowA > 0 && (
            <g transform={`translate(0 ${(1 - rowA) * 40})`} opacity={clamp01(rowA * 2)}>
              <ShahedTop x={660} y={370 + Math.sin(t * 2) * 5} r={90} s={0.46} />
              <Big x={1180} y={405} text="$35,000" size={130} color={C.amber} opacity={prog(t, T.d35 - 0.15, T.d35 + 0.2)} />
              <g transform="translate(870 372)" opacity={prog(t, T.d35 - 0.15, T.d35 + 0.2)}>
                <path d="M-22,-22 L22,22 M22,-22 L-22,22" stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
                <path d="M-22,-22 L22,22 M22,-22 L-22,22" stroke={C.cream} strokeWidth={9} strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* row B: ten launched, nine intercepted */}
          <Big x={330} y={635} text="90%" size={96} color={C.red} opacity={prog(t, T.pct - 0.1, T.pct + 0.25)} />
          {Array.from({ length: 10 }, (_, i) => {
            const p = iconsIn(i);
            if (p <= 0) return null;
            const x = 470 + i * 118;
            const y = 600 + Math.sin(t * 2.5 + i) * 4;
            const k = i < 9 ? killed(i) : 0;
            return (
              <g key={i}>
                <ShahedTop x={x} y={y} r={90} s={0.3 * p} opacity={1 - 0.55 * clamp01(k)} />
                {k > 0 && (
                  <g transform={`translate(${x} ${y}) scale(${k})`}>
                    <path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
                    <path d="M-30,-30 L30,30 M30,-30 L-30,30" stroke={C.red} strokeWidth={10} strokeLinecap="round" />
                  </g>
                )}
                {i === 9 && t > T.intercepted && <circle cx={x} cy={y} r={50 + 4 * Math.sin(t * 8)} fill="none" stroke={C.amber} strokeWidth={6} opacity={prog(t, T.intercepted, T.intercepted + 0.3)} />}
              </g>
            );
          })}

          {/* row C: offensive cost per hit */}
          <Tag x={560} y={850} text="COST PER HIT" p={prog(t, T.offensive - 0.1, T.cost + 0.4, "none")} size={44} accent={C.amber} />
          {hitIn > 0 && (
            <g>
              <Big x={1150} y={885} text={money(perHit)} size={120 * (0.8 + 0.2 * hitIn)} color={t > T.climbs ? C.amber : C.cream} />
              <StrikeLine x1={930} y1={850} x2={1370} y2={850} p={strikeOld} width={14} />
              <Pulse x={1150} y={850} p={prog(t, T.d350, T.d350 + 1, "none")} r={380} color={C.amber} width={10} />
            </g>
          )}
          {t > T.target - 0.3 && (
            <g>
              <Reticle x={1640} y={850} size={120} lock={prog(t, T.target - 0.2, T.target + 0.5, "none") * 1.6} color={C.red} />
              <Pulse x={1640} y={850} p={prog(t, T.struck, T.struck + 0.8, "none")} r={160} color={C.red} width={8} />
            </g>
          )}
          {big > 0 && <Big x={1640} y={640} text="×10" size={110 * big} color={C.red} />}
        </g>
      )}
    </Stage>
  );
};
