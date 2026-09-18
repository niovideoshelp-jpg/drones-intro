import React from "react";
import { C, F } from "../design";
import { useTime } from "../lib/kf";
import { OL, Placed, blink, place, thin } from "./style";

/** Laser turret on a vehicle; `beam` fires a beam up-right. */
/** Barrel angle (0 = straight up, clockwise positive) and beam length that put a turret at x,y (scale s) on target tx,ty. */
export const aimTurret = (tx: number, ty: number, x: number, y: number, s = 1) => {
  const dx = tx - x;
  const dy = ty - (y - 96 * s);
  return { angle: (Math.atan2(dx, -dy) * 180) / Math.PI, reach: Math.max(0, Math.hypot(dx, dy) / s - 94) };
};

export const LaserTurret: React.FC<Placed & { beam?: number; angle?: number; reach?: number }> = ({ beam = 0, angle = 40, reach = 1500, ...p }) => {
  const t = useTime();
  const flick = 1 + 0.25 * Math.sin(t * 48);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M-120,0 L120,0 L100,-40 L-100,-40Z" fill={C.steelDark} {...OL} strokeWidth={5} />
      {[-70, 0, 70].map((x) => (
        <circle key={x} cx={x} cy={-8} r={20} fill={C.ink2} stroke={C.ink} strokeWidth={4} />
      ))}
      <rect x={-70} y={-96} width={140} height={60} rx={10} fill={C.olive} {...OL} strokeWidth={5} />
      <g transform={`rotate(${angle} 0 -96)`}>
        <rect x={-26} y={-190} width={52} height={104} rx={12} fill={C.steelLight} {...OL} strokeWidth={5} />
        <circle cx={0} cy={-186} r={26} fill={C.ink3} stroke={C.ink} strokeWidth={5} />
        <circle cx={0} cy={-186} r={13} fill={beam > 0 ? "#9BE8FF" : C.steelDark} />
        {beam > 0 && (
          <g opacity={beam}>
            <path d={`M0,-190 L0,${-190 - reach}`} stroke="#9BE8FF" strokeWidth={26 * flick} strokeLinecap="round" opacity={0.25} />
            <path d={`M0,-190 L0,${-190 - reach}`} stroke="#DCF7FF" strokeWidth={9 * flick} strokeLinecap="round" />
            <circle cx={0} cy={-190 - reach} r={30 * flick} fill="#DCF7FF" opacity={0.55} />
            <circle cx={0} cy={-190} r={34 * flick} fill="#9BE8FF" opacity={0.4} />
          </g>
        )}
      </g>
      <circle cx={92} cy={-84} r={6} fill={C.green} opacity={blink(t, 0.8, 0.4)} />
    </g>
  );
};

/** High-power microwave emitter: a flat dish sweeping a wedge of energy. */
export const MicrowaveEmitter: React.FC<Placed & { fire?: number; angle?: number; range?: number }> = ({ fire = 0, angle = 34, range = 210, ...p }) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M-110,0 L110,0 L92,-36 L-92,-36Z" fill={C.steelDark} {...OL} strokeWidth={5} />
      {[-60, 60].map((x) => (
        <circle key={x} cx={x} cy={-6} r={18} fill={C.ink2} stroke={C.ink} strokeWidth={4} />
      ))}
      <rect x={-52} y={-88} width={104} height={54} rx={8} fill={C.olive} {...OL} strokeWidth={5} />
      <g transform={`rotate(${angle} 0 -88)`}>
        <rect x={-18} y={-210} width={36} height={124} rx={8} fill={C.steelDark} {...OL} strokeWidth={4} />
        <rect x={-120} y={-266} width={240} height={70} rx={10} fill={C.cream} {...OL} strokeWidth={5} />
        {[-90, -50, -10, 30, 70].map((x) => (
          <rect key={x} x={x} y={-256} width={24} height={50} fill={C.steelLight} stroke={C.ink} strokeWidth={2} />
        ))}
        {fire > 0 &&
          [0, 1, 2].map((i) => {
            const k = (((t * 1.1 + i / 3) % 1) + 1) % 1;
            return (
              <path
                key={i}
                d={`M${-120 - k * range * 0.55},${-266 - k * range} Q0,${-300 - k * range * 1.12} ${120 + k * range * 0.55},${-266 - k * range}`}
                fill="none"
                stroke={C.cyan}
                strokeWidth={10}
                strokeLinecap="round"
                opacity={fire * (1 - k) * 0.8}
              />
            );
          })}
      </g>
    </g>
  );
};

/** Tracked self-propelled AA gun (Gepard-style), side view. */
/** Barrel angle (SVG degrees) about a pivot px,py in the art's own units that points art at x,y (scale s) at tx,ty; muzzle `len` along it. */
export const aimBarrel = (tx: number, ty: number, x: number, y: number, s: number, px: number, py: number, len: number) => {
  const wx = x + px * s;
  const wy = y + py * s;
  const a = Math.atan2(ty - wy, tx - wx);
  return { angle: (a * 180) / Math.PI, mx: wx + Math.cos(a) * len * s, my: wy + Math.sin(a) * len * s };
};
/** SPAAG barrels pivot at (30,-120) and reach 175; CIWS at (40,-60) and 145. */
export const aimSPAAG = (tx: number, ty: number, x: number, y: number, s: number) => aimBarrel(tx, ty, x, y, s, 30, -120, 175);
export const aimCIWS = (tx: number, ty: number, x: number, y: number, s: number) => aimBarrel(tx, ty, x, y, s, 40, -60, 145);

export const SPAAG: React.FC<Placed & { fire?: number; angle?: number }> = ({ fire = 0, angle = -48, ...p }) => {
  const t = useTime();
  const recoil = fire > 0 ? Math.sin(t * 36) * 4 : 0;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M-150,-14 C-160,-14 -164,-46 -148,-50 L146,-50 C162,-46 158,-14 148,-14 C132,2 -134,2 -150,-14Z" fill={C.ink3} {...OL} strokeWidth={5} />
      {[-112, -72, -32, 8, 48, 88, 128].map((x) => (
        <circle key={x} cx={x} cy={-22} r={13} fill={C.steelDark} stroke={C.ink} strokeWidth={3} />
      ))}
      <path d="M-160,-54 L160,-54 L148,-84 L-148,-84Z" fill={C.olive} {...OL} strokeWidth={5} />
      <path d="M-70,-84 L60,-84 L46,-136 L-58,-136Z" fill="#7C8550" {...OL} strokeWidth={5} />
      <g transform={`translate(${recoil} 0) rotate(${angle} 30 -120)`}>
        <rect x={20} y={-136} width={180} height={12} rx={5} fill={C.steelDark} {...OL} strokeWidth={4} />
        <rect x={20} y={-116} width={180} height={12} rx={5} fill={C.steelDark} {...OL} strokeWidth={4} />
      </g>
      <circle cx={-40} cy={-150} r={16} fill={C.steel} stroke={C.ink} strokeWidth={4} />
      <path d={`M-40,-166 L-40,-190`} stroke={C.ink} strokeWidth={4} />
      <circle cx={-40} cy={-150} r={8} fill={C.cyan} opacity={blink(t, 1.2, 0.5)} />
    </g>
  );
};

/** Close-in weapon system (Phalanx-style radome + rotary cannon). */
export const CIWS: React.FC<Placed & { fire?: number; angle?: number }> = ({ fire = 0, angle = -38, ...p }) => {
  const t = useTime();
  const spin = fire > 0 ? t * 900 : 0;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M-70,0 L70,0 L54,-40 L-54,-40Z" fill={C.steelDark} {...OL} strokeWidth={5} />
      <path d="M-60,-40 C-60,-150 60,-150 60,-40Z" fill={C.cream} {...OL} strokeWidth={5} />
      <path d="M-34,-70 C-34,-120 34,-120 34,-70" stroke="#fff" strokeOpacity={0.5} strokeWidth={6} fill="none" />
      <g transform={`rotate(${angle} 40 -60)`}>
        <rect x={30} y={-80} width={40} height={54} rx={8} fill={C.steelDark} {...OL} strokeWidth={4} />
        <g transform={`translate(70 -54) rotate(${spin})`}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 11} cy={Math.sin((a * Math.PI) / 180) * 11} r={4} fill={C.ink2} />
          ))}
        </g>
        <rect x={70} y={-62} width={110} height={16} rx={6} fill={C.steel} {...OL} strokeWidth={4} />
      </g>
    </g>
  );
};

/** Guided-rocket pod (APKWS-style), side view. */
export const RocketPod: React.FC<Placed & { fire?: number }> = ({ fire = 0, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <path d="M-110,0 L110,0 L96,-34 L-96,-34Z" fill={C.steelDark} {...OL} strokeWidth={5} />
    <g transform="rotate(-30 0 -60)">
      <rect x={-90} y={-104} width={180} height={78} rx={10} fill={C.olive} {...OL} strokeWidth={5} />
      {[0, 1].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <circle key={`${r}${c}`} cx={-58 + c * 38} cy={-86 + r * 40} r={14} fill={C.ink2} stroke={C.ink} strokeWidth={3} />
        )),
      )}
      {fire > 0 && (
        <g>
          <path d="M90,-86 L190,-96 L190,-76Z" fill={C.amber} opacity={0.9} />
          <circle cx={150} cy={-86} r={12} fill="#FFE7A6" />
        </g>
      )}
    </g>
  </g>
);

/** Drone controlled through a fibre-optic spool — no radio link to jam. */
export const FiberSpool: React.FC<Placed & { pay?: number }> = ({ pay = 0, ...p }) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <circle r={54} fill={C.ink3} {...OL} strokeWidth={5} />
      <circle r={30} fill={C.steelDark} stroke={C.ink} strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} r={34 + i * 4} fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.5} transform={`rotate(${t * 40 + i * 12})`} strokeDasharray="30 200" />
      ))}
      {pay > 0 && <path d={`M40,0 C${120 + pay * 160},-20 ${240 + pay * 260},60 ${380 + pay * 420},-40`} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.9} />}
    </g>
  );
};

/** Weather that degrades a laser: rain, fog, smoke, dust. */
export const Weather: React.FC<Placed & { kind: "rain" | "fog" | "smoke" | "dust" }> = ({ kind, ...p }) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {kind === "rain" && (
        <g>
          <path d="M-70,-10 C-92,-10 -96,-46 -66,-50 C-58,-86 2,-92 16,-56 C52,-66 74,-34 56,-10Z" fill={C.steel} {...OL} strokeWidth={5} />
          {[-50, -20, 10, 40].map((x, i) => {
            const k = (((t * 1.6 + i / 4) % 1) + 1) % 1;
            return <path key={x} d={`M${x},${10 + k * 60} L${x - 8},${34 + k * 60}`} stroke={C.cyan} strokeWidth={5} strokeLinecap="round" opacity={1 - k} />;
          })}
        </g>
      )}
      {kind === "fog" && (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${-90 + Math.sin(t * 0.7 + i) * 16},${-40 + i * 28} L${90 + Math.sin(t * 0.9 + i) * 16},${-40 + i * 28}`}
              stroke={C.steelLight}
              strokeWidth={14}
              strokeLinecap="round"
              opacity={0.5 - i * 0.07}
            />
          ))}
        </g>
      )}
      {kind === "smoke" && (
        <g>
          {[0, 1, 2, 3, 4].map((i) => {
            const k = (((t * 0.5 + i / 5) % 1) + 1) % 1;
            return <circle key={i} cx={Math.sin(i * 2 + t) * 18 + k * 20} cy={40 - k * 120} r={18 + k * 34} fill="#4E4A46" stroke={C.ink} strokeWidth={3} opacity={0.75 * (1 - k)} />;
          })}
        </g>
      )}
      {kind === "dust" && (
        <g>
          {Array.from({ length: 14 }, (_, i) => {
            const k = (((t * 0.8 + i / 14) % 1) + 1) % 1;
            return <circle key={i} cx={-90 + k * 190} cy={-40 + ((i * 37) % 90)} r={4 + (i % 3) * 3} fill="#B4A277" opacity={0.8 * (1 - k)} />;
          })}
          <path d="M-96,52 L96,52" stroke="#B4A277" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
        </g>
      )}
    </g>
  );
};

/** Passive measures: dispersal, camouflage netting, hardened shelter. */
export const Passive: React.FC<Placed & { kind: "disperse" | "camo" | "harden" }> = ({ kind, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    {kind === "disperse" && (
      <g>
        <rect x={-14} y={-14} width={28} height={28} rx={4} fill={C.steel} {...OL} strokeWidth={4} />
        {[
          [-80, -60],
          [70, -50],
          [-70, 60],
          [80, 56],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 14} y={y - 14} width={28} height={28} rx={4} fill={C.steel} {...OL} strokeWidth={4} />
            <path d={`M${x * 0.28},${y * 0.28} L${x * 0.72},${y * 0.72}`} stroke={C.cyan} strokeWidth={4} strokeDasharray="8 7" />
          </g>
        ))}
      </g>
    )}
    {kind === "camo" && (
      <g>
        <path d="M-96,40 L-40,-46 L40,-46 L96,40Z" fill="#6E7A45" {...OL} strokeWidth={5} />
        {[-60, -20, 20, 60].map((x, i) => (
          <path key={x} d={`M${x},${40 - (i % 2) * 14} L${x + 14},${-20}`} stroke="#57603A" strokeWidth={8} strokeLinecap="round" />
        ))}
        <rect x={-30} y={4} width={60} height={36} rx={5} fill={C.steelDark} stroke={C.ink} strokeWidth={4} />
      </g>
    )}
    {kind === "harden" && (
      <g>
        <path d="M-96,40 C-96,-60 96,-60 96,40Z" fill="#8A8F84" {...OL} strokeWidth={5} />
        <path d="M-56,40 C-56,-16 56,-16 56,40Z" fill={C.ink3} stroke={C.ink} strokeWidth={4} />
        <path d="M-96,40 L96,40" stroke={C.ink} strokeWidth={6} />
        {[-70, -30, 10, 50].map((x) => (
          <path key={x} d={`M${x},-6 L${x + 18},-30`} stroke="#6F746A" strokeWidth={6} />
        ))}
      </g>
    )}
  </g>
);

/** Layer chip used by the spine of this chapter. */
export const LayerChip: React.FC<{ x: number; y: number; w?: number; label: string; index: number; active?: number; color?: string; p?: number }> = ({
  x,
  y,
  w = 520,
  label,
  index,
  active = 0,
  color = C.cyan,
  p = 1,
}) => {
  const h = 92;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.9 + 0.1 * p})`} opacity={p}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={C.ink} fillOpacity={0.92} stroke={color} strokeWidth={4 + 4 * active} />
      <rect x={-w / 2} y={-h / 2} width={h} height={h} rx={12} fill={color} opacity={0.2 + 0.6 * active} />
      <text x={-w / 2 + h / 2} y={16} textAnchor="middle" fontFamily={F.anton} fontSize={54} fill={active > 0.5 ? C.ink : color}>
        {index}
      </text>
      <text x={-w / 2 + h + 22} y={14} fontFamily={F.oswald} fontWeight={600} fontSize={38} fill={C.cream} letterSpacing={1}>
        {label}
      </text>
    </g>
  );
};

export { thin };
