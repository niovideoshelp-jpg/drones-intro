import { C } from "../design";

export const OL = {
  stroke: C.ink,
  strokeWidth: 3,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

export const thin = (w = 1.5, color: string = C.ink, opacity = 0.5) => ({
  stroke: color,
  strokeWidth: w,
  strokeOpacity: opacity,
  fill: "none",
  strokeLinecap: "round" as const,
});

export type Placed = {
  x?: number;
  y?: number;
  s?: number;
  r?: number;
  className?: string;
  opacity?: number;
};

export const place = ({ x = 0, y = 0, s = 1, r = 0 }: Placed) =>
  `translate(${x} ${y}) rotate(${r}) scale(${s})`;

/** Blink helper for nav lights: on for `duty` of each `period` seconds. */
export const blink = (t: number, period = 1.1, duty = 0.18, phase = 0) =>
  ((t + phase) % period) / period < duty ? 1 : 0.15;
