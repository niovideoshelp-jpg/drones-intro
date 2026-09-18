import React from "react";
import { C, F } from "../design";
import { useTime } from "../lib/kf";
import { Box, Cyl, Plot, iso, pts, shade } from "./iso";
import { OL, Placed, blink, place, thin } from "./style";

/** Warship, side view, bow to +x. ~560 long, waterline at y=0. */
export const Warship: React.FC<Placed> = (p) => {
  const t = useTime();
  const roll = Math.sin(t * 0.8) * 1.2;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <g transform={`rotate(${roll})`}>
        <path d="M-260,0 L250,0 L300,-26 L-250,-26Z" fill={C.steelDark} {...OL} strokeWidth={4} />
        <path d="M-250,-26 L300,-26 L286,-60 L-240,-60Z" fill={C.steel} {...OL} strokeWidth={4} />
        <path d="M-180,-60 L120,-60 L110,-96 L-170,-96Z" fill={C.steelLight} {...OL} strokeWidth={4} />
        <path d="M-90,-96 L40,-96 L30,-140 L-80,-140Z" fill={C.steelLight} {...OL} strokeWidth={4} />
        <path d="M-40,-140 L-40,-210 L-20,-210 L-20,-140Z" fill={C.steel} {...OL} strokeWidth={3} />
        <path d="M-30,-210 L-30,-250 M-58,-232 L-2,-232" stroke={C.ink} strokeWidth={5} />
        <circle cx={-30} cy={-256} r={6} fill={C.red} opacity={blink(t, 1.4, 0.3)} />
        {/* gun turret + VLS cells */}
        <path d="M150,-60 C150,-84 200,-84 200,-60Z" fill={C.steelDark} {...OL} strokeWidth={3} />
        <path d="M196,-74 L262,-82" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
        {[-150, -128, -106, -84].map((x) => (
          <rect key={x} x={x} y={-78} width={16} height={16} fill={C.ink3} stroke={C.ink} strokeWidth={2} />
        ))}
        {[-160, -120, -80, -40, 0, 40, 80, 120, 160, 200, 240].map((x) => (
          <rect key={`w${x}`} x={x} y={-52} width={14} height={10} fill="#9FC2C9" stroke={C.ink} strokeWidth={1.5} />
        ))}
        <path d="M-170,-96 L110,-96" {...thin(2, C.ink, 0.4)} />
      </g>
      {/* water */}
      <path d={`M-360,6 Q-300,${0 + Math.sin(t * 2) * 6} -240,6 T-120,6 T0,6 T120,6 T240,6 T360,6`} fill="none" stroke="#7FA7A3" strokeWidth={10} strokeLinecap="round" opacity={0.85} />
      <path d={`M-360,26 Q-290,${20 + Math.sin(t * 2 + 1) * 6} -220,26 T-80,26 T60,26 T200,26 T360,26`} fill="none" stroke="#5E8A88" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
    </g>
  );
};

/** Dense city block, isometric. hit > 0 marks falling debris impacts. */
export const CityBlock: React.FC<Placed & { lit?: number }> = ({ lit = 1, ...p }) => {
  const t = useTime();
  const towers = [
    [-80, -60, 46, 46, 150],
    [-10, -70, 40, 40, 210],
    [50, -40, 44, 44, 120],
    [-70, 20, 40, 40, 170],
    [10, 30, 48, 48, 96],
    [70, 40, 38, 38, 140],
  ] as const;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <Plot w={240} d={230} color="#8E8C84" />
      {towers.map(([x, y, w, d, h], i) => (
        <g key={i}>
          <Box x={x} y={y} w={w} d={d} h={h} color={i % 2 ? "#6E7A80" : "#7C8790"} />
          {Array.from({ length: Math.floor(h / 30) }, (_, k) => {
            const [a, b] = iso(x, y + d, h - 20 - k * 30);
            const on = blink(t, 2.2 + i * 0.3, 0.75, k) > 0.5 ? lit : 0.25 * lit;
            return <rect key={k} x={a + 4} y={b - 10} width={w * 0.7} height={10} fill={C.amber} opacity={0.75 * on} />;
          })}
        </g>
      ))}
      <path d={`M${iso(-120, 0)[0]},${iso(-120, 0)[1]} L${iso(120, 0)[0]},${iso(120, 0)[1]}`} stroke="#5A5A55" strokeWidth={12} />
    </g>
  );
};


/** Where an AAGunBig placed at x,y (scale s) must point its barrel to hit tx,ty, and where its muzzle then is. */
export const aimGun = (tx: number, ty: number, x: number, y: number, s = 1) => {
  const py = y - 70 * s;
  const a = Math.atan2(ty - py, tx - x);
  return { angle: (a * 180) / Math.PI, mx: x + Math.cos(a) * 150 * s, my: py + Math.sin(a) * 150 * s };
};

export const AAGunBig: React.FC<Placed & { fire?: number; angle?: number }> = ({ fire = 0, angle = -52, ...p }) => {
  const t = useTime();
  const recoil = fire > 0 ? Math.sin(t * 40) * 5 : 0;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M-90,0 L90,0 L70,-34 L-70,-34Z" fill={C.olive} {...OL} strokeWidth={5} />
      <circle cx={-52} cy={-8} r={20} fill={C.ink2} stroke={C.ink} strokeWidth={4} />
      <circle cx={52} cy={-8} r={20} fill={C.ink2} stroke={C.ink} strokeWidth={4} />
      <rect x={-46} y={-84} width={92} height={54} rx={10} fill={C.oliveDark} {...OL} strokeWidth={5} />
      <g transform={`rotate(${angle} 0 -70) translate(${recoil} 0)`}>
        <rect x={-10} y={-96} width={150} height={13} rx={5} fill={C.steelDark} {...OL} strokeWidth={4} />
        <rect x={-10} y={-74} width={150} height={13} rx={5} fill={C.steelDark} {...OL} strokeWidth={4} />
        {fire > 0 && (
          <g transform="translate(146 -84)">
            <path d="M0,0 L54,-16 L54,16Z" fill={C.amber} opacity={0.8 + 0.2 * Math.sin(t * 60)} />
            <path d="M0,0 L30,-8 L30,8Z" fill="#FFF3C4" />
          </g>
        )}
      </g>
      <path d="M-30,-30 L-30,-10 M30,-30 L30,-10" stroke={C.ink} strokeWidth={5} />
    </g>
  );
};

/** Tracer streaks going up (and the spent rounds coming back down). */
/**
 * Gun bursts. With a target (tx, ty) every streak flies from the muzzle to the target and stops there, sparking;
 * without one they fly along `angle` for `reach` px. `down` drops the rounds that missed back onto `area`
 * (x0..x1, landing at y1) as bright points with a short trail.
 */
export const Tracers: React.FC<{
  x: number;
  y: number;
  up: number;
  down?: number;
  angle?: number;
  reach?: number;
  tx?: number;
  ty?: number;
  seed?: number;
  area?: { x0: number; x1: number; y0: number; y1: number };
}> = ({ x, y, up, down = 0, angle = -52, reach = 520, tx, ty, seed = 0, area = { x0: 600, x1: 1500, y0: 200, y1: 860 } }) => {
  const t = useTime();
  const aimed = tx !== undefined && ty !== undefined;
  const rad = aimed ? Math.atan2(ty - y, tx - x) : (angle * Math.PI) / 180;
  const dist = aimed ? Math.hypot(tx - x, ty - y) : reach;
  const nx = -Math.sin(rad);
  const ny = Math.cos(rad);
  return (
    <g>
      {up > 0 &&
        Array.from({ length: 12 }, (_, i) => {
          const k = (((t * 1.8 + i / 12 + seed * 0.13) % 1) + 1) % 1;
          const len = Math.min(80, dist * 0.18);
          const d = 30 + k * (dist - 30 - len);
          const j = Math.sin(i * 3.7 + seed) * 14 * k;
          const x0 = x + Math.cos(rad) * d + nx * j;
          const y0 = y + Math.sin(rad) * d + ny * j;
          return (
            <path key={i} d={`M${x0},${y0} L${x0 + Math.cos(rad) * len},${y0 + Math.sin(rad) * len}`} stroke={C.amber} strokeWidth={6} strokeLinecap="round" opacity={up * (0.35 + 0.6 * (1 - k))} />
          );
        })}
      {up > 0 &&
        aimed &&
        [0, 1, 2].map((i) => {
          const k = (((t * 3 + i / 3) % 1) + 1) % 1;
          return <circle key={`s${i}`} cx={tx + Math.cos(i * 2.1 + t * 9) * 18 * k} cy={ty + Math.sin(i * 2.1 + t * 9) * 18 * k} r={7 * (1 - k)} fill="#FFE7A6" opacity={up} />;
        })}
      {down > 0 &&
        Array.from({ length: 12 }, (_, i) => {
          const k = (((t * 0.6 + i / 12) % 1) + 1) % 1;
          const px = area.x0 + ((i * 0.618 + seed * 0.1) % 1) * (area.x1 - area.x0);
          const py = area.y0 + k * k * (area.y1 - area.y0);
          const land = k > 0.94;
          return (
            <g key={`d${i}`} opacity={down}>
              {!land && <path d={`M${px},${py} L${px},${py - 26}`} stroke={C.amber} strokeWidth={3} strokeLinecap="round" opacity={0.45} />}
              {!land && <circle cx={px} cy={py} r={5} fill="#FFE7A6" />}
              {land && <circle cx={px} cy={area.y1} r={16 * (1 - (k - 0.94) / 0.06)} fill="none" stroke={C.red} strokeWidth={4} />}
            </g>
          );
        })}
    </g>
  );
};

/** Radar / sensor / infrastructure glyphs used by the kill-chain scene. */
export const Glyph: React.FC<Placed & { kind: "radar" | "optic" | "acoustic" | "link" | "command" | "people" | "maint" | "power" | "clock"; color?: string }> = ({ kind, color = C.cyan, ...p }) => {
  const t = useTime();
  const stroke = { stroke: C.ink, strokeWidth: 5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {kind === "radar" && (
        <g>
          <path d="M-46,52 L46,52 L28,20 L-28,20Z" {...stroke} fill={C.steelDark} />
          <g transform={`rotate(${Math.sin(t * 1.2) * 28})`}>
            <path d="M-40,-46 L40,-46 L30,4 L-30,4Z" {...stroke} fill={color} />
            <path d="M-24,-30 L24,-30 M-20,-14 L20,-14" stroke={C.ink} strokeWidth={3} />
          </g>
        </g>
      )}
      {kind === "optic" && (
        <g>
          <rect x={-48} y={-32} width={96} height={64} rx={10} {...stroke} fill={C.ink3} />
          <circle cx={6} cy={0} r={22} {...stroke} fill={color} />
          <circle cx={6} cy={0} r={9} fill={C.ink} />
          <rect x={-56} y={-14} width={16} height={28} rx={4} {...stroke} fill={C.steelDark} />
        </g>
      )}
      {kind === "acoustic" && (
        <g>
          <path d="M-14,-34 L-14,20 C-14,36 14,36 14,20 L14,-34 C14,-50 -14,-50 -14,-34Z" {...stroke} fill={C.steelLight} />
          <path d="M-30,6 C-30,44 30,44 30,6" {...stroke} />
          <path d="M0,44 L0,60 M-22,60 L22,60" {...stroke} />
        </g>
      )}
      {kind === "link" && (
        <g>
          <path d="M0,50 L0,-18" {...stroke} />
          <path d="M-30,50 L30,50" {...stroke} />
          <circle cx={0} cy={-26} r={8} fill={color} />
          {[26, 44, 62].map((r, i) => (
            <path key={r} d={`M${-r * 0.7},${-26 - r * 0.5} A${r},${r} 0 0 1 ${r * 0.7},${-26 - r * 0.5}`} stroke={color} strokeWidth={5} fill="none" opacity={blink(t, 1.2, 0.75, i * 0.3)} />
          ))}
        </g>
      )}
      {kind === "command" && (
        <g>
          <rect x={-56} y={-30} width={112} height={70} rx={8} {...stroke} fill={C.ink3} />
          <rect x={-42} y={-16} width={84} height={42} fill={color} opacity={0.75} />
          <path d="M-30,-6 L-10,-6 M-30,8 L10,8 M18,-10 L30,-10" stroke={C.ink} strokeWidth={4} />
          <path d="M-20,40 L20,40 L28,56 L-28,56Z" {...stroke} fill={C.steelDark} />
        </g>
      )}
      {kind === "people" && (
        <g>
          {[-26, 26].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i ? 6 : 0})`}>
              <circle cx={0} cy={-26} r={14} {...stroke} fill={C.steelLight} />
              <path d="M-22,34 C-22,-2 22,-2 22,34Z" {...stroke} fill={color} />
            </g>
          ))}
        </g>
      )}
      {kind === "maint" && (
        <g>
          <path d="M-34,34 L20,-20" stroke={C.steelLight} strokeWidth={18} strokeLinecap="round" />
          <path d="M-34,34 L20,-20" stroke={C.ink} strokeWidth={5} fill="none" />
          <path d="M10,-30 C26,-46 52,-40 52,-18 C52,0 30,10 16,0Z" {...stroke} fill={C.steelLight} />
        </g>
      )}
      {kind === "power" && (
        <g>
          <path d="M8,-52 L-26,6 L2,6 L-8,52 L28,-10 L0,-10Z" {...stroke} fill={C.amber} />
        </g>
      )}
      {kind === "clock" && (
        <g>
          <circle r={44} {...stroke} fill={C.cream} />
          <path d={`M0,0 L${Math.sin(t * 2) * 22},${-Math.cos(t * 2) * 22} M0,0 L${Math.sin(t * 0.3) * 30},${-Math.cos(t * 0.3) * 30}`} stroke={C.ink} strokeWidth={5} />
          <circle r={5} fill={C.ink} />
        </g>
      )}
    </g>
  );
};

/** Probability gauge: an arc filled to `value` (0..1). */
export const Gauge: React.FC<Placed & { value: number; label?: string; color?: string }> = ({ value, label, color = C.green, ...p }) => {
  const R = 70;
  const a0 = Math.PI * 0.85;
  const a1 = Math.PI * 0.15;
  const a = a0 + (a1 - a0) * value;
  const pt = (ang: number, r = R) => `${(Math.cos(ang) * r).toFixed(1)},${(-Math.sin(ang) * r).toFixed(1)}`;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d={`M${pt(a0)} A${R},${R} 0 0 0 ${pt(a1)}`} fill="none" stroke={C.ink} strokeWidth={22} strokeLinecap="round" opacity={0.5} />
      <path d={`M${pt(a0)} A${R},${R} 0 0 0 ${pt(a)}`} fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" />
      <path d={`M0,0 L${pt(a, R - 16)}`} stroke={C.cream} strokeWidth={6} strokeLinecap="round" />
      <circle r={9} fill={C.cream} stroke={C.ink} strokeWidth={3} />
      {label && (
        <text y={44} textAnchor="middle" fontFamily={F.oswald} fontWeight={600} fontSize={26} fill={C.cream} letterSpacing={1}>
          {label}
        </text>
      )}
    </g>
  );
};

/** Iceberg-style framing: the visible tip above the line, the mass below it. */
export const WaterLine: React.FC<{ y: number; w?: number; p?: number }> = ({ y, w = 1680, p = 1 }) => {
  const t = useTime();
  const x0 = 960 - (w / 2) * p;
  const x1 = 960 + (w / 2) * p;
  return (
    <g>
      <path d={`M${x0},${y} L${x1},${y}`} stroke={C.cyan} strokeWidth={6} strokeLinecap="round" opacity={0.9} />
      <path d={`M${x0},${y + 14} Q${(x0 + x1) / 2},${y + 14 + Math.sin(t * 2) * 8} ${x1},${y + 14}`} fill="none" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={4} />
      <rect x={x0} y={y} width={x1 - x0} height={620} fill={C.cyan} opacity={0.05} />
    </g>
  );
};

export const Bracket: React.FC<{ x0: number; x1: number; y: number; p?: number; color?: string; down?: boolean }> = ({ x0, x1, y, p = 1, color = C.amber, down = false }) => {
  const k = down ? 1 : -1;
  const w = (x1 - x0) * p;
  const cx = (x0 + x1) / 2;
  return (
    <g stroke={color} strokeWidth={6} fill="none" strokeLinecap="round">
      <path d={`M${cx - w / 2},${y} L${cx + w / 2},${y}`} />
      <path d={`M${cx - w / 2},${y} L${cx - w / 2},${y + 26 * k} M${cx + w / 2},${y} L${cx + w / 2},${y + 26 * k}`} />
      <path d={`M${cx},${y} L${cx},${y - 26 * k}`} />
    </g>
  );
};

export { Box, Cyl, Plot, iso, pts, shade };
