import gsap from "gsap";
import { useCurrentFrame, useVideoConfig } from "remotion";

/** Time in seconds of the current (sequence-local) frame. */
export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

const easeCache = new Map<string, gsap.EaseFunction>();
export const ease = (name = "none"): gsap.EaseFunction => {
  let e = easeCache.get(name);
  if (!e) {
    e = gsap.parseEase(name) as gsap.EaseFunction;
    easeCache.set(name, e);
  }
  return e;
};

export type Key = [time: number, value: number, ease?: string];

/**
 * Stateless keyframe track evaluated with GSAP eases. The ease on a key shapes the segment that ENDS on it.
 * Seek-order independent, so safe for Remotion's parallel frame rendering.
 */
export const kf = (t: number, keys: Key[]): number => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1, e] = keys[i];
    if (t <= t1) {
      const [t0, v0] = keys[i - 1];
      const p = t1 === t0 ? 1 : (t - t0) / (t1 - t0);
      return v0 + (v1 - v0) * ease(e ?? "power2.inOut")(p);
    }
  }
  return keys[keys.length - 1][1];
};

/** 0→1 progress between two times with a GSAP ease. */
export const prog = (t: number, t0: number, t1: number, e = "power2.inOut") =>
  t <= t0 ? 0 : t >= t1 ? 1 : ease(e)((t - t0) / (t1 - t0));

/** Fade window: rises over `inDur` from t0 and falls over `outDur` to t1. */
export const win = (t: number, t0: number, t1: number, inDur = 0.4, outDur = 0.4) =>
  Math.min(prog(t, t0, t0 + inDur, "power2.out"), 1 - prog(t, t1 - outDur, t1, "power2.in"));

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Deterministic hash noise in [0,1). */
export const rnd = (i: number, salt = 0) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** van Wijk & Nuij smooth zoom-pan interpolation (same maths as d3.interpolateZoom). p = [x, y, width]. */
export const zoomInterp = (p0: [number, number, number], p1: [number, number, number]) => {
  const rho = Math.SQRT2;
  const [ux0, uy0, w0] = p0;
  const [ux1, uy1, w1] = p1;
  const dx = ux1 - ux0;
  const dy = uy1 - uy0;
  const d2 = dx * dx + dy * dy;
  if (d2 < 1e-12) {
    const S = Math.log(w1 / w0) / rho;
    return (t: number): [number, number, number] => [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(rho * t * S)];
  }
  const d1 = Math.sqrt(d2);
  const b0 = (w1 * w1 - w0 * w0 + 4 * d2) / (2 * w0 * 2 * d1);
  const b1 = (w1 * w1 - w0 * w0 - 4 * d2) / (2 * w1 * 2 * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const S = (r1 - r0) / rho;
  return (t: number): [number, number, number] => {
    const s = t * S;
    const u = (w0 / (2 * d1)) * (Math.cosh(r0) * Math.tanh(rho * s + r0) - Math.sinh(r0));
    return [ux0 + u * dx, uy0 + u * dy, (w0 * Math.cosh(r0)) / Math.cosh(rho * s + r0)];
  };
};
