import React from "react";
import { C, F } from "../design";
import { clamp01, ease, prog, rnd, useTime } from "../lib/kf";
import { OL, Placed, place, thin } from "./style";

/** Text chip with reveal progress p (0..1). anchor: where (x,y) sits on the chip. */
export const Tag: React.FC<{
  x: number;
  y: number;
  text: string;
  p?: number;
  size?: number;
  accent?: string;
  anchor?: "middle" | "start" | "end";
  sub?: string;
  dark?: boolean;
}> = ({ x, y, text, p = 1, size = 34, accent = C.amber, anchor = "middle", sub, dark = true }) => {
  if (p <= 0) return null;
  const padX = size * 0.5;
  const w = text.length * size * 0.5 + padX * 2 + size * 0.35;
  const h = size * 1.45;
  const x0 = anchor === "middle" ? x - w / 2 : anchor === "start" ? x : x - w;
  const grow = ease("expo.out")(clamp01(p / 0.55));
  const chars = Math.round(text.length * clamp01((p - 0.25) / 0.6));
  return (
    <g opacity={clamp01(p * 3)}>
      <rect x={x0 + (w * (1 - grow)) / 2} y={y - h / 2} width={w * grow} height={h} rx={3} fill={dark ? C.ink : C.cream} fillOpacity={0.94} />
      <rect x={x0 + (w * (1 - grow)) / 2} y={y - h / 2} width={size * 0.18} height={h} fill={accent} />
      <text
        x={x0 + padX + size * 0.2}
        y={y + size * 0.36}
        fontFamily={F.oswald}
        fontWeight={600}
        fontSize={size}
        letterSpacing={size * 0.04}
        fill={dark ? C.cream : C.ink}
      >
        {text.slice(0, chars)}
      </text>
      {sub && p > 0.7 && (
        <text x={x0 + padX + size * 0.2} y={y + h / 2 + size * 0.75} fontFamily={F.fira} fontWeight={600} fontSize={size * 0.55} letterSpacing={2} fill={accent} opacity={clamp01((p - 0.7) / 0.3)}>
          {sub}
        </text>
      )}
    </g>
  );
};

/** Big date / number stamp in Anton. */
export const Stamp: React.FC<{ x: number; y: number; text: string; p?: number; size?: number; color?: string; stroke?: string; anchor?: "middle" | "start" | "end" }> = ({
  x,
  y,
  text,
  p = 1,
  size = 120,
  color = C.amber,
  stroke = C.ink,
  anchor = "middle",
}) => {
  if (p <= 0) return null;
  const s = 1 + (1 - ease("back.out(2.2)")(clamp01(p))) * 0.6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={clamp01(p * 2.5)}>
      <text textAnchor={anchor} y={size * 0.36} fontFamily={F.anton} fontSize={size} fill={color} stroke={stroke} strokeWidth={size * 0.07} paintOrder="stroke" letterSpacing={size * 0.02}>
        {text}
      </text>
    </g>
  );
};

/** Target reticle. lock: 0 (wide, searching) -> 1 (locked). */
export const Reticle: React.FC<Placed & { size?: number; lock?: number; color?: string }> = ({ size = 120, lock = 1, color = C.red, ...p }) => {
  const t = useTime();
  const k = 1 + (1 - ease("expo.out")(clamp01(lock))) * 0.8;
  const h = (size / 2) * k;
  const c = size * 0.22;
  const locked = lock >= 1;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <g stroke={color} strokeWidth={5} fill="none" strokeLinecap="square">
        <path d={`M${-h},${-h + c} L${-h},${-h} L${-h + c},${-h} M${h - c},${-h} L${h},${-h} L${h},${-h + c} M${h},${h - c} L${h},${h} L${h - c},${h} M${-h + c},${h} L${-h},${h} L${-h},${h - c}`} />
      </g>
      <g stroke={C.ink} strokeWidth={2} fill="none" opacity={0.6}>
        <path d={`M${-h - 3},${-h + c} L${-h - 3},${-h - 3} L${-h + c},${-h - 3}`} />
      </g>
      <circle r={size * 0.36} fill="none" stroke={color} strokeWidth={2} strokeDasharray="6 8" transform={`rotate(${t * 90})`} opacity={0.8} />
      <path d={`M0,${-size * 0.18} L0,${size * 0.18} M${-size * 0.18},0 L${size * 0.18},0`} stroke={color} strokeWidth={2.5} />
      {locked && <circle r={size * 0.5 + 6} fill="none" stroke={color} strokeWidth={3} opacity={Math.max(0, 1 - ((t * 2) % 1))} transform={`scale(${1 + ((t * 2) % 1) * 0.3})`} />}
    </g>
  );
};

/** Vector explosion, progress p 0..1 over its life. */
export const Explosion: React.FC<Placed & { p: number; size?: number; seed?: number }> = ({ p, size = 160, seed = 1, ...pl }) => {
  if (p <= 0 || p >= 1) return null;
  const flash = 1 - prog(p, 0, 0.25, "power2.out");
  const ball = ease("expo.out")(clamp01(p / 0.3));
  const fade = 1 - prog(p, 0.35, 1, "power1.in");
  const spikes = 12;
  const star = Array.from({ length: spikes * 2 }, (_, i) => {
    const a = (i / (spikes * 2)) * Math.PI * 2;
    const r = (i % 2 ? 0.45 : 0.95 + rnd(i, seed) * 0.35) * size * ball;
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <g transform={place(pl)} opacity={pl.opacity}>
      {Array.from({ length: 9 }, (_, i) => {
        const a = rnd(i, seed + 3) * Math.PI * 2;
        const d = size * (0.5 + ease("power2.out")(clamp01(p / 0.8)) * (0.9 + rnd(i, seed + 5)));
        const r = size * (0.28 + rnd(i, seed + 7) * 0.25) * (0.4 + p);
        return (
          <circle
            key={`s${i}`}
            cx={Math.cos(a) * d * 0.55}
            cy={Math.sin(a) * d * 0.45 - p * size * 0.5}
            r={r}
            fill={i % 2 ? "#4A4744" : "#6A6560"}
            stroke={C.ink}
            strokeWidth={2}
            opacity={prog(p, 0.1, 0.3) * fade * 0.9}
          />
        );
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const a = rnd(i, seed + 11) * Math.PI * 2;
        const d0 = size * 0.4 + size * 1.6 * ease("power3.out")(clamp01(p / 0.7));
        return (
          <path
            key={`d${i}`}
            d={`M${Math.cos(a) * d0},${Math.sin(a) * d0} L${Math.cos(a) * (d0 + 18)},${Math.sin(a) * (d0 + 18)}`}
            stroke={C.ink}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={1 - prog(p, 0.3, 0.8)}
          />
        );
      })}
      <polygon points={star} fill={C.red} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" opacity={1 - prog(p, 0.3, 0.6)} />
      <circle r={size * 0.55 * ball} fill={C.amber} opacity={1 - prog(p, 0.25, 0.55)} />
      <circle r={size * 0.3 * ball} fill="#FFF3C4" opacity={1 - prog(p, 0.2, 0.45)} />
      <circle r={size * 1.6 * (1 - flash * 0.3)} fill="#fff" opacity={flash * 0.55} />
    </g>
  );
};

/** Expanding ring pulse, p 0..1. */
export const Pulse: React.FC<{ x: number; y: number; p: number; r?: number; color?: string; width?: number }> = ({ x, y, p, r = 80, color = C.red, width = 4 }) =>
  p <= 0 || p >= 1 ? null : (
    <circle cx={x} cy={y} r={r * ease("power2.out")(p)} fill="none" stroke={color} strokeWidth={width * (1 - p) + 0.5} opacity={1 - p} />
  );

/** Question mark glyph in a circle. */
export const Query: React.FC<Placed & { color?: string }> = ({ color = C.amber, ...p }) => (
  <g transform={place(p)} opacity={p.opacity} className={p.className}>
    <circle r={34} fill={C.ink} stroke={color} strokeWidth={4} />
    <text y={17} textAnchor="middle" fontFamily={F.anton} fontSize={48} fill={color}>
      ?
    </text>
  </g>
);

/** Stopwatch face. `frac` = hand position (0..1 of a turn). */
export const Stopwatch: React.FC<Placed & { frac: number; label: string; alarm?: number }> = ({ frac, label, alarm = 0, ...p }) => {
  const col = alarm > 0.5 ? C.red : C.amber;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <rect x={-34} y={-300} width={68} height={40} rx={8} fill={C.steel} {...OL} strokeWidth={5} />
      <rect x={-50} y={-316} width={100} height={22} rx={8} fill={C.steelDark} {...OL} strokeWidth={5} />
      <path d="M150,-190 L186,-226" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
      <path d="M150,-190 L186,-226" stroke={C.steel} strokeWidth={12} strokeLinecap="round" />
      <circle r={272} fill={C.steelLight} {...OL} strokeWidth={6} />
      <circle r={246} fill={C.ink} stroke={C.ink} strokeWidth={4} />
      <circle r={236} fill="none" stroke={col} strokeWidth={2} opacity={0.4} />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const big = i % 5 === 0;
        const r0 = big ? 196 : 212;
        return (
          <path
            key={i}
            d={`M${Math.sin(a) * r0},${-Math.cos(a) * r0} L${Math.sin(a) * 228},${-Math.cos(a) * 228}`}
            stroke={i / 60 <= frac ? col : C.steelDark}
            strokeWidth={big ? 6 : 3}
            strokeLinecap="round"
          />
        );
      })}
      <path d={describeArc(0, 0, 176, 0, frac * 360)} fill="none" stroke={col} strokeWidth={14} opacity={0.35} />
      <text y={98} textAnchor="middle" fontFamily={F.anton} fontSize={92} fill={col} letterSpacing={4}>
        {label}
      </text>
      <g transform={`rotate(${frac * 360})`}>
        <path d="M0,24 L0,-190" stroke={col} strokeWidth={8} strokeLinecap="round" />
        <path d="M0,24 L0,56" stroke={col} strokeWidth={14} strokeLinecap="round" />
      </g>
      <circle r={16} fill={C.steelLight} stroke={C.ink} strokeWidth={5} />
    </g>
  );
};

export const describeArc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const s = Math.min(a1, 359.99);
  const p0 = [cx + r * Math.sin((a0 * Math.PI) / 180), cy - r * Math.cos((a0 * Math.PI) / 180)];
  const p1 = [cx + r * Math.sin((s * Math.PI) / 180), cy - r * Math.cos((s * Math.PI) / 180)];
  return `M${p0[0]},${p0[1]} A${r},${r} 0 ${s - a0 > 180 ? 1 : 0} 1 ${p1[0]},${p1[1]}`;
};

/** Hourglass with sand fraction `sand` (1 = all on top) and flip rotation `rot`. */
export const Hourglass: React.FC<Placed & { sand: number; rot?: number }> = ({ sand, rot = 0, ...p }) => {
  const t = useTime();
  const top = 90 * sand;
  const bottom = 90 * (1 - sand);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <g transform={`rotate(${rot})`}>
        <defs>
          <clipPath id="hg-top">
            <path d="M-70,-120 L70,-120 C70,-60 10,-20 6,0 L-6,0 C-10,-20 -70,-60 -70,-120Z" />
          </clipPath>
          <clipPath id="hg-bot">
            <path d="M-70,120 L70,120 C70,60 10,20 6,0 L-6,0 C-10,20 -70,60 -70,120Z" />
          </clipPath>
        </defs>
        <path d="M-70,-120 L70,-120 C70,-60 10,-20 6,0 C10,20 70,60 70,120 L-70,120 C-70,60 -10,20 -6,0 C-10,-20 -70,-60 -70,-120Z" fill="#DDEBEA" fillOpacity={0.35} />
        <rect x={-80} y={-120 + (120 - top)} width={160} height={top} fill={C.sand} clipPath="url(#hg-top)" />
        <path d={`M-80,120 L80,120 L80,${120 - bottom * 0.9} Q0,${120 - bottom * 1.35} -80,${120 - bottom * 0.9}Z`} fill={C.sand} clipPath="url(#hg-bot)" />
        {sand > 0.02 && sand < 0.98 && <path d="M0,0 L0,110" stroke={C.sand} strokeWidth={3} strokeDasharray="4 5" strokeDashoffset={-t * 60} />}
        <path d="M-70,-120 L70,-120 C70,-60 10,-20 6,0 C10,20 70,60 70,120 L-70,120 C-70,60 -10,20 -6,0 C-10,-20 -70,-60 -70,-120Z" fill="none" {...OL} strokeWidth={5} />
        <path d="M-50,-104 C-50,-70 -20,-40 -10,-24" stroke="#fff" strokeOpacity={0.7} strokeWidth={4} fill="none" />
        <rect x={-100} y={-146} width={200} height={28} rx={6} fill="#7A5A3A" {...OL} strokeWidth={5} />
        <rect x={-100} y={118} width={200} height={28} rx={6} fill="#7A5A3A" {...OL} strokeWidth={5} />
        <path d="M-88,-118 L-88,118 M88,-118 L88,118" stroke={C.ink} strokeWidth={12} />
        <path d="M-88,-118 L-88,118 M88,-118 L88,118" stroke="#8C6A48" strokeWidth={6} />
      </g>
    </g>
  );
};

/** Balance scale; tilt in degrees (positive = left pan down). Children rendered on pans via render props. */
export const Balance: React.FC<Placed & { tilt: number; left?: React.ReactNode; right?: React.ReactNode }> = ({ tilt, left, right, ...p }) => {
  const a = (tilt * Math.PI) / 180;
  const arm = 380;
  const lx = -Math.cos(a) * arm;
  const ly = -Math.sin(a) * -arm;
  const rx = Math.cos(a) * arm;
  const ry = -Math.sin(a) * arm;
  const pan = (x: number, y: number, content: React.ReactNode) => (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0,0 L-120,200 M0,0 L120,200" stroke={C.ink} strokeWidth={3} />
      <circle r={9} fill={C.amber} stroke={C.ink} strokeWidth={3} />
      <g transform="translate(0 200)">{content}</g>
      <path d="M-150,200 L150,200 C130,244 -130,244 -150,200Z" fill={C.amber} {...OL} strokeWidth={5} />
      <path d="M-120,212 C-60,226 60,226 120,212" stroke="#fff" strokeOpacity={0.5} strokeWidth={4} fill="none" />
    </g>
  );
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M-150,460 L150,460 L110,420 L-110,420Z" fill={C.amberDark} {...OL} strokeWidth={5} />
      <rect x={-18} y={0} width={36} height={424} fill={C.amber} {...OL} strokeWidth={5} />
      <path d="M-8,20 L-8,400" stroke="#fff" strokeOpacity={0.4} strokeWidth={5} />
      <g transform={`rotate(${-tilt})`}>
        <rect x={-arm - 10} y={-14} width={arm * 2 + 20} height={28} rx={14} fill={C.amber} {...OL} strokeWidth={5} />
        <path d="M-360,-4 L360,-4" stroke="#fff" strokeOpacity={0.45} strokeWidth={4} />
      </g>
      <circle r={30} fill={C.amberDark} {...OL} strokeWidth={5} />
      <path d="M0,-30 L0,-70" stroke={C.ink} strokeWidth={5} />
      <path d={`M0,-70 L${12 * Math.sin(-a)},-40`} stroke={C.red} strokeWidth={6} strokeLinecap="round" />
      {pan(lx, ly, left)}
      {pan(rx, ry, right)}
    </g>
  );
};

/** Source document page with chart. */
export const DocPage: React.FC<Placed & { lines?: number; chart?: number; check?: number; tab?: string }> = ({ lines = 1, chart = 1, check = 0, tab = C.amber, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <rect x={-150} y={-200} width={300} height={400} rx={6} fill={C.ink} opacity={0.25} transform="translate(10 12)" />
    <path d="M-150,-200 L100,-200 L150,-150 L150,200 L-150,200Z" fill={C.cream} {...OL} strokeWidth={4} />
    <path d="M100,-200 L100,-150 L150,-150Z" fill={C.sand} {...OL} strokeWidth={3} />
    <rect x={-120} y={-172} width={140} height={20} fill={tab} />
    {[-130, -104, -78].map((y, i) => (
      <path key={y} d={`M-120,${y} L${-120 + 240 * clamp01(lines * 3 - i) * (i === 2 ? 0.6 : 1)},${y}`} stroke={C.steelDark} strokeWidth={9} strokeLinecap="round" opacity={lines > 0 ? 1 : 0} />
    ))}
    <g transform="translate(-120 -40)">
      <rect width={240} height={140} fill="none" stroke={C.steel} strokeWidth={2} />
      {[0.55, 0.8, 0.4, 0.95, 0.7].map((v, i) => (
        <rect key={i} x={16 + i * 46} y={140 - 120 * v * clamp01(chart * 1.6 - i * 0.15)} width={30} height={120 * v * clamp01(chart * 1.6 - i * 0.15)} fill={i === 3 ? C.red : C.blue} stroke={C.ink} strokeWidth={2} />
      ))}
    </g>
    {[130, 156].map((y, i) => (
      <path key={y} d={`M-120,${y} L${-120 + 200 * clamp01(lines * 3 - 1 - i)},${y}`} stroke={C.steel} strokeWidth={8} strokeLinecap="round" />
    ))}
    {check > 0 && (
      <g transform={`translate(110 160) scale(${ease("back.out(3)")(clamp01(check))})`}>
        <circle r={38} fill={C.green} {...OL} strokeWidth={4} />
        <path d="M-17,1 L-5,14 L19,-12" stroke={C.ink} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </g>
);

/** Chain link icon, `join` 0..1 closes the two links together. */
export const ChainLink: React.FC<Placed & { join: number }> = ({ join, ...p }) => {
  const off = (1 - ease("back.out(2)")(clamp01(join))) * 70;
  const link = (dx: number, rot: number) => (
    <g transform={`translate(${dx} 0) rotate(${rot})`}>
      <rect x={-80} y={-36} width={160} height={72} rx={36} fill="none" stroke={C.ink} strokeWidth={30} />
      <rect x={-80} y={-36} width={160} height={72} rx={36} fill="none" stroke={C.cyan} strokeWidth={18} />
      <path d="M-50,-36 L40,-36" stroke="#fff" strokeOpacity={0.5} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <g transform="rotate(-35)">
        {link(-58 - off, 0)}
        {link(58 + off, 0)}
      </g>
    </g>
  );
};

export const Magnifier: React.FC<Placed> = (p) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <path d="M70,70 L170,170" stroke={C.ink} strokeWidth={42} strokeLinecap="round" />
    <path d="M78,78 L166,166" stroke="#7A5A3A" strokeWidth={28} strokeLinecap="round" />
    <circle r={100} fill="#CFE8EA" fillOpacity={0.25} stroke={C.ink} strokeWidth={34} />
    <circle r={100} fill="none" stroke={C.steelLight} strokeWidth={20} />
    <path d="M-60,-40 A70,70 0 0 1 -30,-66" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);

/** Dollar price tag. */
export const PriceTag: React.FC<Placed & { text: string; color?: string; size?: number }> = ({ text, color = C.amber, size = 64, ...p }) => {
  const w = text.length * size * 0.46 + size * 1.3;
  const h = size * 1.35;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d={`M0,0 L${h * 0.45},${-h / 2} L${w},${-h / 2} L${w},${h / 2} L${h * 0.45},${h / 2}Z`} fill={color} {...OL} strokeWidth={4} />
      <circle cx={h * 0.42} cy={0} r={size * 0.12} fill={C.ink} />
      <text x={h * 0.62} y={size * 0.36} fontFamily={F.anton} fontSize={size} fill={C.ink} letterSpacing={2}>
        {text}
      </text>
    </g>
  );
};

/** Thin dashed connector with animated flow. */
export const Flow: React.FC<{ d: string; p?: number; color?: string; width?: number; dash?: number }> = ({ d, p = 1, color = C.red, width = 4, dash = 14 }) => {
  const t = useTime();
  if (p <= 0) return null;
  return (
    <g>
      <path d={d} pathLength={1} fill="none" stroke={C.ink} strokeWidth={width + 4} strokeDasharray={`${p} 2`} opacity={0.35} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={`${dash} ${dash * 0.8}`} strokeDashoffset={-t * 60} mask={undefined} opacity={0.95} pathLength={undefined} />
    </g>
  );
};

export const StrikeLine: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string; width?: number }> = ({ x1, y1, x2, y2, p, color = C.red, width = 18 }) =>
  p <= 0 ? null : (
    <g>
      <path d={`M${x1},${y1} L${x1 + (x2 - x1) * p},${y1 + (y2 - y1) * p}`} stroke={C.ink} strokeWidth={width + 8} strokeLinecap="round" />
      <path d={`M${x1},${y1} L${x1 + (x2 - x1) * p},${y1 + (y2 - y1) * p}`} stroke={color} strokeWidth={width} strokeLinecap="round" />
    </g>
  );

export { thin };
