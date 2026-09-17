import React from "react";
import { C } from "../design";
import { TankTop } from "../art/ground";
import { Explosion, Reticle } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, kf, prog, rnd, useTime, win } from "../lib/kf";
import { at } from "../lib/words";

const T = {
  footage: at("Footage"),
  vehicles: at("vehicles"),
  spotted: at("spotted"),
  destroyed: at("destroyed"),
  above: at("above"),
  went: at("went"),
  world: at("world,"),
  helped: at("helped"),
};
export const FOOTAGE_RANGE = [T.footage - 0.4, T.helped + 0.5] as const;

const FW = 1120;
const FH = 630;

/** Thermal ground seen by the drone camera, in frame-local coords (0..FW, 0..FH). */
const Thermal: React.FC<{ t: number; zoom: number; mini?: boolean }> = ({ t, zoom, mini = false }) => {
  const drive = mini ? 1 : prog(t, T.footage - 0.4, T.destroyed, "none");
  const vx = 430 + drive * 190;
  const vy = 380 - drive * 80;
  const boom = mini ? ((t * 0.7) % 1) : prog(t, T.destroyed, T.destroyed + 2.2, "none");
  const hit = mini || t >= T.destroyed;
  return (
    <g transform={`translate(${FW / 2} ${FH / 2}) scale(${zoom}) translate(${-FW / 2} ${-FH / 2})`}>
      <rect x={-200} y={-200} width={FW + 400} height={FH + 400} fill="#343B39" />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${-100 + i * 170},-120 L${40 + i * 170},-120 L${-60 + i * 170},${FH + 120} L${-200 + i * 170},${FH + 120}Z`}
          fill={i % 2 ? "#3E4644" : "#2E3533"}
        />
      ))}
      <path d={`M-100,${FH - 40} C300,${FH - 120} 500,300 ${FW + 100},120`} stroke="#6D7572" strokeWidth={70} fill="none" />
      <path d={`M-100,${FH - 40} C300,${FH - 120} 500,300 ${FW + 100},120`} stroke="#59615E" strokeWidth={4} strokeDasharray="30 30" fill="none" />
      {Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={rnd(i, 1) * FW} cy={rnd(i, 2) * FH} r={14 + rnd(i, 3) * 22} fill="#1E2322" />
      ))}
      {!hit || boom < 0.25 ? <TankTop x={vx} y={vy} s={0.95} r={62} thermal /> : null}
      {hit && (
        <g>
          <circle cx={vx} cy={vy} r={60 + boom * 120} fill="#fff" opacity={0.9 * (1 - boom)} />
          <circle cx={vx} cy={vy} r={40} fill="#E8EAE6" opacity={Math.min(1, boom * 4) * 0.8} />
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i} cx={vx + (rnd(i, 8) - 0.5) * 160 * boom} cy={vy - boom * 90 * rnd(i, 9)} r={30 + boom * 50} fill="#8D9490" opacity={0.6 * Math.min(1, boom * 3) * (1 - boom * 0.6)} />
          ))}
        </g>
      )}
    </g>
  );
};

const Device: React.FC<{ kind: number; t: number }> = ({ kind, t }) => {
  const clip = `dev-clip-${kind}`;
  const [w, h] = kind === 0 ? [150, 266] : kind === 1 ? [300, 178] : [270, 166];
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={kind === 0 ? 14 : 4} />
        </clipPath>
      </defs>
      {kind === 1 && <path d={`M-40,${h / 2 + 10} L40,${h / 2 + 10} L60,${h / 2 + 44} L-60,${h / 2 + 44}Z`} fill={C.ink3} stroke={C.ink} strokeWidth={4} />}
      {kind === 2 && <path d={`M${-w / 2 - 30},${h / 2 + 14} L${w / 2 + 30},${h / 2 + 14} L${w / 2 + 50},${h / 2 + 34} L${-w / 2 - 50},${h / 2 + 34}Z`} fill={C.steelDark} stroke={C.ink} strokeWidth={4} />}
      <rect x={-w / 2 - 14} y={-h / 2 - (kind === 0 ? 30 : 14)} width={w + 28} height={h + (kind === 0 ? 60 : 28)} rx={kind === 0 ? 30 : 10} fill={C.ink2} stroke={C.ink} strokeWidth={5} />
      <g clipPath={`url(#${clip})`}>
        <g transform={`translate(${-w / 2} ${-h / 2}) scale(${w / FW} ${h / FH})`}>
          <g transform={`translate(${FW / 2} ${FH / 2}) scale(${Math.max(w / h, h / w) > 1.5 && kind === 0 ? 1.8 : 1}) translate(${-FW / 2} ${-FH / 2})`}>
            <Thermal t={t + kind * 0.3} zoom={1.3} mini />
          </g>
        </g>
        <rect x={-w / 2} y={h / 2 - 10} width={w} height={10} fill={C.ink} opacity={0.7} />
        <rect x={-w / 2} y={h / 2 - 10} width={w * ((t * 0.3 + kind * 0.2) % 1)} height={10} fill={C.red} />
      </g>
      {kind === 0 && <rect x={-24} y={-h / 2 - 20} width={48} height={8} rx={4} fill={C.ink} />}
    </g>
  );
};

export const Footage: React.FC = () => {
  const t = useTime();
  if (t < FOOTAGE_RANGE[0] || t > FOOTAGE_RANGE[1]) return null;

  const enter = ease("expo.out")(clamp01((t - T.footage + 0.35) / 0.7));
  const shrink = prog(t, T.went - 0.1, T.world + 0.2, "power3.inOut");
  const out = prog(t, T.helped - 0.3, T.helped + 0.4, "power2.in");
  const shake = t > T.destroyed && t < T.destroyed + 0.6 ? (1 - (t - T.destroyed) / 0.6) * 14 : 0;
  const sx = Math.sin(t * 97) * shake;
  const sy = Math.cos(t * 83) * shake;
  const zoom = kf(t, [
    [T.footage, 1],
    [T.spotted, 1.2, "power1.inOut"],
    [T.destroyed, 1.45, "power2.out"],
    [T.went, 1.5],
  ]);
  const frameScale = (0.55 + 0.45 * enter) * (1 - 0.72 * shrink) * (1 - out);
  const lock = prog(t, T.spotted - 0.1, T.spotted + 0.45, "none");
  const flash = t > T.destroyed ? Math.max(0, 1 - (t - T.destroyed) / 0.25) : 0;
  const drive = prog(t, T.footage - 0.4, T.destroyed, "none");
  const vx = 430 + drive * 190;
  const vy = 380 - drive * 80;
  const lockX = FW / 2 + (vx - FW / 2) * zoom;
  const lockY = FH / 2 + (vy - FH / 2) * zoom;
  const rec = Math.floor(t * 2) % 2 === 0;

  const ring = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2 + 0.2;
    return { x: 960 + Math.cos(a) * 640, y: 540 + Math.sin(a) * 330, kind: i % 3, t0: T.went + i * 0.09 };
  });

  return (
    <Stage>
      {/* devices spreading the clip */}
      {ring.map((d, i) => {
        const p = prog(t, d.t0, d.t0 + 0.75, "back.out(1.4)");
        if (p <= 0) return null;
        const x = 960 + (d.x - 960) * p;
        const y = 540 + (d.y - 540) * p;
        const s = (0.35 + 0.65 * p) * (1 - out) * 0.8;
        return (
          <g key={i}>
            <path d={`M960,540 Q${(960 + x) / 2 + (y - 540) * 0.3},${(540 + y) / 2 - (x - 960) * 0.15} ${x},${y}`} fill="none" stroke={C.amber} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-t * 60} opacity={0.8 * p * (1 - out)} />
            <g transform={`translate(${x} ${y}) scale(${s}) rotate(${(rnd(i) - 0.5) * 10})`}>
              <Device kind={d.kind} t={t} />
            </g>
          </g>
        );
      })}

      {/* main drone camera frame */}
      <g transform={`translate(${960 + sx} ${540 + sy}) scale(${frameScale}) translate(${-FW / 2} ${-FH / 2})`} opacity={enter * (1 - out) * (1 - clamp01((shrink - 0.7) / 0.3))}>
        <defs>
          <clipPath id="footage-clip">
            <rect width={FW} height={FH} rx={10} />
          </clipPath>
        </defs>
        <rect x={-18} y={-18} width={FW + 36} height={FH + 36} rx={20} fill={C.ink} />
        <g clipPath="url(#footage-clip)">
          <Thermal t={t} zoom={zoom} />
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={i} x={0} y={i * 16 + ((t * 40) % 16)} width={FW} height={2} fill="#000" opacity={0.08} />
          ))}
          <rect width={FW} height={FH} fill="#fff" opacity={flash * 0.85} />
        </g>
        {/* HUD */}
        <g stroke={C.cream} strokeWidth={4} fill="none" opacity={0.9}>
          <path d={`M${FW / 2 - 60},${FH / 2} L${FW / 2 - 18},${FH / 2} M${FW / 2 + 18},${FH / 2} L${FW / 2 + 60},${FH / 2} M${FW / 2},${FH / 2 - 60} L${FW / 2},${FH / 2 - 18} M${FW / 2},${FH / 2 + 18} L${FW / 2},${FH / 2 + 60}`} />
          <path d={`M30,90 L30,30 L90,30 M${FW - 90},30 L${FW - 30},30 L${FW - 30},90 M${FW - 30},${FH - 90} L${FW - 30},${FH - 30} L${FW - 90},${FH - 30} M90,${FH - 30} L30,${FH - 30} L30,${FH - 90}`} strokeWidth={6} />
          {Array.from({ length: 11 }, (_, i) => (
            <path key={i} d={`M${FW - 70},${FH / 2 - 150 + i * 30} L${FW - (i % 5 === 0 ? 40 : 52)},${FH / 2 - 150 + i * 30}`} strokeWidth={3} />
          ))}
        </g>
        <circle cx={64} cy={64} r={13} fill={C.red} opacity={rec ? 1 : 0.25} />
        {lock > 0 && t < T.destroyed + 0.5 && <Reticle x={lockX} y={lockY} size={170} lock={lock * 1.6} color={C.red} />}
        {t > T.destroyed && t < T.destroyed + 1.2 && <Explosion x={lockX} y={lockY} p={prog(t, T.destroyed, T.destroyed + 1.2, "none")} size={120} seed={4} />}
      </g>

      {/* globe badge the clip collapses into */}
      {shrink > 0 && (
        <g transform={`translate(960 540) scale(${ease("back.out(2)")(clamp01((t - T.world + 0.4) / 0.5)) * (1 - out)})`}>
          <circle r={96} fill={C.ocean} stroke={C.ink} strokeWidth={6} />
          <path d="M-96,0 L96,0 M0,-96 C-60,-40 -60,40 0,96 M0,-96 C60,-40 60,40 0,96 M-84,-46 L84,-46 M-84,46 L84,46" stroke={C.cyan} strokeWidth={3} fill="none" opacity={0.7} />
          <circle r={96} fill="none" stroke={C.amber} strokeWidth={6} strokeDasharray="20 14" transform={`rotate(${t * 60})`} />
          <circle r={124 + win(t, T.world - 0.1, T.world + 0.9, 0.05, 0.8) * 30} fill="none" stroke={C.amber} strokeWidth={4} opacity={win(t, T.world - 0.1, T.world + 0.9, 0.05, 0.8)} />
        </g>
      )}
    </Stage>
  );
};
