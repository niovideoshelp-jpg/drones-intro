import React from "react";
import { C } from "../design";
import { OL, Placed, place } from "./style";

export type Blip = { x: number; y: number; color?: string; age?: number; size?: number };

/** PPI radar scope. sweep in degrees (0 = north, clockwise). Blip coords in scope radii (-1..1). */
export const RadarScope: React.FC<Placed & { R?: number; sweep: number; blips?: Blip[]; draw?: number; tint?: string }> = ({
  R = 360,
  sweep,
  blips = [],
  draw = 1,
  tint = C.cyan,
  ...p
}) => {
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  const pt = (d: number, r: number) => `${(Math.cos(rad(d)) * r).toFixed(1)},${(Math.sin(rad(d)) * r).toFixed(1)}`;
  const wedges = 18;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {/* bezel */}
      <circle r={R + 46} fill={C.ink3} {...OL} strokeWidth={6} />
      <circle r={R + 30} fill={C.ink2} stroke={C.ink} strokeWidth={3} />
      {Array.from({ length: 72 }, (_, i) => {
        const big = i % 9 === 0;
        return (
          <path
            key={i}
            d={`M${pt(i * 5, R + 8)} L${pt(i * 5, R + (big ? 30 : 20))}`}
            stroke={big ? tint : C.steelDark}
            strokeWidth={big ? 4 : 2}
            opacity={i / 72 <= draw ? 1 : 0}
          />
        );
      })}
      <circle r={R} fill="#0A1614" stroke={C.ink} strokeWidth={4} />
      {/* rings + cross */}
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <circle key={k} r={R * k * Math.min(1, draw * 1.3)} fill="none" stroke={tint} strokeOpacity={k === 1 ? 0.5 : 0.25} strokeWidth={2} />
      ))}
      <path d={`M${-R * draw},0 L${R * draw},0 M0,${-R * draw} L0,${R * draw}`} stroke={tint} strokeOpacity={0.2} strokeWidth={2} />
      <path d={`M${pt(45, R * draw)} L${pt(225, R * draw)} M${pt(135, R * draw)} L${pt(315, R * draw)}`} stroke={tint} strokeOpacity={0.1} strokeWidth={1.5} />
      {/* sweep */}
      {draw >= 1 &&
        Array.from({ length: wedges }, (_, i) => {
          const a1 = sweep - i * 3.4;
          const a0 = a1 - 3.6;
          return <path key={i} d={`M0,0 L${pt(a0, R)} A${R},${R} 0 0 1 ${pt(a1, R)}Z`} fill={tint} opacity={0.32 * (1 - i / wedges) ** 1.6} />;
        })}
      {draw >= 1 && <path d={`M0,0 L${pt(sweep, R)}`} stroke={tint} strokeWidth={4} opacity={0.9} />}
      {blips.map((b, i) => {
        const col = b.color ?? C.red;
        const fade = Math.max(0.15, 1 - (b.age ?? 0));
        const s = b.size ?? 12;
        return (
          <g key={i} transform={`translate(${b.x * R} ${b.y * R})`} opacity={fade}>
            <circle r={s * 2.2} fill={col} opacity={0.25} />
            <circle r={s} fill={col} stroke={C.ink} strokeWidth={2} />
          </g>
        );
      })}
      <circle r={10} fill={tint} />
      <path d={`M${-R * 0.92},${-R * 0.18} A${R * 0.94},${R * 0.94} 0 0 1 ${-R * 0.5},${-R * 0.8}`} stroke="#fff" strokeOpacity={0.12} strokeWidth={10} fill="none" strokeLinecap="round" />
    </g>
  );
};
