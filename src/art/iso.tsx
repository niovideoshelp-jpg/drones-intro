import React from "react";
import { C } from "../design";

/** Isometric helpers: world (x right-back, y left-back, z up) -> screen. */
export const iso = (x: number, y: number, z = 0): [number, number] => [(x - y) * 0.866, (x + y) * 0.5 - z];
export const pts = (list: [number, number, number][]) => list.map(([x, y, z]) => iso(x, y, z).map((v) => v.toFixed(1)).join(",")).join(" ");
export const ISO_MATRIX = "matrix(0.866 0.5 -0.866 0.5 0 0)";

export const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const to = amt > 0 ? 255 : 0;
  const k = Math.abs(amt);
  const mix = (c: number) => Math.round(c + (to - c) * k);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
};

const edge = { stroke: C.ink, strokeWidth: 2.2, strokeLinejoin: "round" as const };

export const Box: React.FC<{ x: number; y: number; z?: number; w: number; d: number; h: number; color: string; top?: string }> = ({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  color,
  top,
}) => (
  <g>
    <polygon points={pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={color} {...edge} />
    <polygon points={pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill={shade(color, -0.28)} {...edge} />
    <polygon points={pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={top ?? shade(color, 0.22)} {...edge} />
  </g>
);

/** Vertical cylinder. */
export const Cyl: React.FC<{ x: number; y: number; z?: number; r: number; h: number; color: string; cap?: string }> = ({ x, y, z = 0, r, h, color, cap }) => {
  const [cx, cyb] = iso(x, y, z);
  const cyt = cyb - h;
  const rx = r * 1.2247;
  const ry = r * 0.7071;
  return (
    <g>
      <path d={`M${cx - rx},${cyt} L${cx - rx},${cyb} A${rx},${ry} 0 0 0 ${cx + rx},${cyb} L${cx + rx},${cyt}Z`} fill={color} {...edge} />
      <path d={`M${cx + rx * 0.35},${cyt + ry * 0.9} L${cx + rx * 0.35},${cyb + ry * 0.9}`} stroke={C.ink} strokeOpacity={0.2} strokeWidth={rx * 0.5} />
      <ellipse cx={cx} cy={cyt} rx={rx} ry={ry} fill={cap ?? shade(color, 0.25)} {...edge} />
    </g>
  );
};

/** Ground slab (diorama tile). */
export const Plot: React.FC<{ w: number; d: number; color: string; depth?: number }> = ({ w, d, color, depth = 16 }) => {
  const x0 = -w / 2;
  const y0 = -d / 2;
  return (
    <g>
      <polygon points={pts([[x0, y0 + d, 0], [x0 + w, y0 + d, 0], [x0 + w, y0 + d, -depth], [x0, y0 + d, -depth]])} fill={shade(color, -0.3)} {...edge} />
      <polygon points={pts([[x0 + w, y0, 0], [x0 + w, y0 + d, 0], [x0 + w, y0 + d, -depth], [x0 + w, y0, -depth]])} fill={shade(color, -0.45)} {...edge} />
      <polygon points={pts([[x0, y0, 0], [x0 + w, y0, 0], [x0 + w, y0 + d, 0], [x0, y0 + d, 0]])} fill={color} {...edge} />
    </g>
  );
};

/** Post from ground to height (thin vertical bar). */
export const Post: React.FC<{ x: number; y: number; z?: number; h: number; color?: string; width?: number }> = ({ x, y, z = 0, h, color = C.steelDark, width = 4 }) => {
  const [a, b] = iso(x, y, z);
  return <path d={`M${a},${b} L${a},${b - h}`} stroke={color} strokeWidth={width} strokeLinecap="round" />;
};

export const Line3: React.FC<{ a: [number, number, number]; b: [number, number, number]; color?: string; width?: number; dash?: string }> = ({
  a,
  b,
  color = C.ink,
  width = 2,
  dash,
}) => {
  const [x1, y1] = iso(...a);
  const [x2, y2] = iso(...b);
  return <path d={`M${x1},${y1} L${x2},${y2}`} stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" fill="none" />;
};
