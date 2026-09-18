import React from "react";
import { C } from "../design";
import { rnd } from "../lib/kf";
import { Tag } from "./ui";

export type Sky = "day" | "dusk" | "storm";

/**
 * An illustrated porthole in the style of the intro's mission lenses: sky, drifting clouds, textured ground
 * and an amber ring with turning ticks. Children draw in local coordinates (centre 0,0) and are clipped to the
 * lens, so art stands on the ground line at `ground`.
 */
export const Lens: React.FC<{
  id: string;
  x: number;
  y: number;
  t: number;
  r?: number;
  s?: number;
  ground?: number;
  groundColor?: string;
  sky?: Sky;
  ring?: string;
  label?: string;
  labelP?: number;
  opacity?: number;
  children?: React.ReactNode;
}> = ({ id, x, y, t, r = 120, s = 1, ground, groundColor = "#8E8460", sky = "day", ring = C.amber, label, labelP = 1, opacity = 1, children }) => {
  if (s <= 0.001 || opacity <= 0.001) return null;
  const gy = ground ?? r * 0.42;
  const seed = id.length * 7 + id.charCodeAt(id.length - 1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <defs>
        <clipPath id={`lens-clip-${id}`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <circle r={r + 14} fill={C.ink} />
      <g clipPath={`url(#lens-clip-${id})`}>
        <rect x={-r} y={-r} width={r * 2} height={r * 2} fill={`url(#lens-${sky})`} />
        <rect x={-r} y={-r} width={r * 2} height={r * 2} fill="url(#pat-speck)" opacity={0.45} />
        {[0, 1].map((k) => {
          const span = r * 2 + 220;
          const cx = ((((t * (10 + k * 6) + rnd(seed, k) * span) % span) + span) % span) - r - 110;
          return <ellipse key={k} cx={cx} cy={-r * (0.62 - k * 0.3)} rx={r * (0.5 - k * 0.12)} ry={r * 0.11} fill="#fff" opacity={0.13} />;
        })}
        <rect x={-r} y={gy} width={r * 2} height={r} fill={groundColor} />
        <rect x={-r} y={gy} width={r * 2} height={r} fill="url(#pat-mottle)" />
        <path d={`M${-r},${gy} L${r},${gy}`} stroke={C.ink} strokeWidth={4} />
        {children}
      </g>
      <circle r={r + 5} fill="none" stroke={ring} strokeWidth={7} />
      {Array.from({ length: 24 }, (_, k) => {
        const a = (k / 24) * Math.PI * 2 + t * 0.2;
        return <path key={k} d={`M${Math.cos(a) * (r + 11)},${Math.sin(a) * (r + 11)} L${Math.cos(a) * (r + 18)},${Math.sin(a) * (r + 18)}`} stroke={C.ink} strokeWidth={3} />;
      })}
      {label && <Tag x={0} y={r + 44} text={label} p={labelP} size={26} accent={ring} />}
    </g>
  );
};
