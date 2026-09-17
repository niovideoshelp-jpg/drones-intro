import React from "react";
import { C, F } from "../design";
import { useTime } from "../lib/kf";
import { Box, Cyl, ISO_MATRIX, Line3, Plot, Post, iso, pts, shade } from "./iso";
import { OL, Placed, blink, place, thin } from "./style";

/* ------------------------------------------------------------------ documents */

/** Procurement contract on a clipboard. sign 0..1 draws the signature, pages adds sheets behind. */
export const Clipboard: React.FC<Placed & { sign?: number; pages?: number }> = ({ sign = 0, pages = 0, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    {Array.from({ length: Math.round(pages) }, (_, i) => (
      <rect key={i} x={-150 + (i + 1) * 10} y={-200 + (i + 1) * 8} width={300} height={390} rx={6} fill={C.cream} {...OL} strokeWidth={3} transform={`rotate(${(i + 1) * 2.5})`} />
    ))}
    <rect x={-170} y={-230} width={340} height={450} rx={18} fill={C.ink3} {...OL} strokeWidth={5} />
    <rect x={-145} y={-195} width={290} height={390} rx={4} fill={C.cream} {...OL} strokeWidth={3} />
    <rect x={-60} y={-250} width={120} height={46} rx={10} fill={C.steel} {...OL} strokeWidth={4} />
    <circle cx={0} cy={-236} r={9} fill={C.ink2} />
    <path d="M-110,-140 L60,-140 M-110,-110 L100,-110 M-110,-80 L90,-80 M-110,-50 L110,-50 M-110,-20 L70,-20 M-110,10 L100,10 M-110,40 L60,40" stroke={C.steelDark} strokeWidth={9} strokeLinecap="round" />
    <path d="M-110,-170 L-20,-170" stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
    <circle cx={80} cy={-165} r={26} fill="none" stroke={C.red} strokeWidth={5} />
    <path d="M68,-165 L92,-165 M80,-177 L80,-153" stroke={C.red} strokeWidth={4} />
    <path d="M-110,150 L40,150" stroke={C.steel} strokeWidth={3} />
    {sign > 0 && (
      <path d="M-100,140 C-80,100 -70,160 -50,120 C-40,100 -30,150 -10,125 C0,112 10,140 30,118" fill="none" stroke={C.blueDark} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${sign} 2`} />
    )}
  </g>
);

export const Gear: React.FC<Placed & { teeth?: number; color?: string; spin?: number }> = ({ teeth = 10, color = C.steel, spin = 0, ...p }) => {
  const outer = 60;
  const inner = 46;
  const d = Array.from({ length: teeth * 2 }, (_, i) => {
    const a0 = (i / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 ? inner : outer;
    return `L${(Math.cos(a0) * r).toFixed(1)},${(Math.sin(a0) * r).toFixed(1)} L${(Math.cos(a1) * r).toFixed(1)},${(Math.sin(a1) * r).toFixed(1)}`;
  }).join(" ");
  return (
    <g transform={`${place(p)} rotate(${spin})`} className={p.className} opacity={p.opacity}>
      <path d={`M${outer},0 ${d}Z`} fill={color} {...OL} strokeWidth={4} />
      <circle r={20} fill={C.ink2} stroke={C.ink} strokeWidth={4} />
    </g>
  );
};

export const Wrench: React.FC<Placed> = (p) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <path d="M-16,-60 L16,-60 L16,70 C16,90 -16,90 -16,70Z" fill={C.steelLight} {...OL} strokeWidth={4} />
    <path d="M-44,-100 C-44,-140 44,-140 44,-100 C44,-76 26,-60 16,-56 L16,-80 L-16,-80 L-16,-56 C-26,-60 -44,-76 -44,-100Z" fill={C.steelLight} {...OL} strokeWidth={4} />
    <path d="M-6,-50 L-6,70" stroke="#fff" strokeOpacity={0.5} strokeWidth={5} />
  </g>
);

/** Pie chart; split pushes slices outward. */
export const Pie: React.FC<Placed & { split?: number }> = ({ split = 0, ...p }) => {
  const slices = [
    [0, 0.42, C.amber],
    [0.42, 0.7, C.blue],
    [0.7, 0.88, C.red],
    [0.88, 1, C.cyan],
  ] as const;
  const R = 90;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {slices.map(([a, b, col], i) => {
        const a0 = a * Math.PI * 2 - Math.PI / 2;
        const a1 = b * Math.PI * 2 - Math.PI / 2;
        const mid = (a0 + a1) / 2;
        const off = split * 22;
        const dx = Math.cos(mid) * off;
        const dy = Math.sin(mid) * off;
        return (
          <path
            key={i}
            d={`M${dx},${dy} L${dx + Math.cos(a0) * R},${dy + Math.sin(a0) * R} A${R},${R} 0 ${b - a > 0.5 ? 1 : 0} 1 ${dx + Math.cos(a1) * R},${dy + Math.sin(a1) * R}Z`}
            fill={col}
            {...OL}
            strokeWidth={4}
          />
        );
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ aircraft & missiles */

/** Generic 4th-gen fighter, side view, nose to +x, ~480 long. */
export const FighterJet: React.FC<Placed & { afterburner?: number; missile?: boolean }> = ({ afterburner = 0.6, missile = true, ...p }) => {
  const t = useTime();
  const f = 1 + 0.2 * Math.sin(t * 60);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {afterburner > 0 && (
        <g transform={`translate(-238 4) scale(${afterburner * f} 1)`}>
          <path d="M0,-12 C-40,-14 -90,-4 -120,0 C-90,4 -40,14 0,12Z" fill={C.amber} opacity={0.85} />
          <path d="M0,-7 C-30,-8 -60,-3 -76,0 C-60,3 -30,8 0,7Z" fill="#FFE7A6" />
        </g>
      )}
      <path d="M-150,-14 L-230,-110 L-190,-110 L-100,-18Z" fill={C.steel} {...OL} strokeWidth={3} />
      <path d="M240,4 C200,-18 150,-30 90,-32 L-20,-28 L-150,-18 L-240,-12 L-240,16 L-140,22 L60,22 C140,22 200,18 240,4Z" fill={C.steelLight} {...OL} strokeWidth={3.5} />
      <path d="M240,4 C200,14 140,22 60,22 L-140,22 L-240,16 L-240,8 L-140,12 L60,12 C140,12 200,10 240,4Z" fill={C.steel} />
      <path d="M150,-28 C130,-54 70,-58 40,-30Z" fill="#9FC2C9" {...OL} strokeWidth={3} />
      <path d="M130,-38 C115,-50 85,-50 70,-38" stroke="#fff" strokeOpacity={0.7} strokeWidth={4} fill="none" />
      <path d="M40,20 L-10,36 L-40,36 L-20,20Z" fill={C.steelDark} {...OL} strokeWidth={2.5} />
      <path d="M20,10 L-120,60 L-160,60 L-80,10Z" fill={C.steel} {...OL} strokeWidth={3} />
      <path d="M-150,-2 L-230,40 L-250,40 L-200,-2Z" fill={C.steel} {...OL} strokeWidth={3} />
      <path d="M-100,-20 L-100,20 M40,-30 L40,22 M180,-8 L180,16" {...thin(1.5, C.ink, 0.4)} />
      {missile && (
        <g>
          <path d="M-40,62 L60,62" stroke={C.ink} strokeWidth={3} />
          <rect x={-70} y={62} width={150} height={10} rx={5} fill="#E9E8E2" {...OL} strokeWidth={2.5} />
          <path d="M80,62 L96,67 L80,72Z" fill={C.ink2} />
        </g>
      )}
      <circle cx={-190} cy={-104} r={4} fill={C.red} opacity={blink(t, 1.2)} />
    </g>
  );
};

type MissileKind = "aim120" | "pac3" | "thaad";
const MISSILE_LEN: Record<MissileKind, number> = { aim120: 300, pac3: 420, thaad: 500 };

/** Interceptor side view, nose to +x, centred. */
export const Interceptor: React.FC<Placed & { kind: MissileKind; flame?: number }> = ({ kind, flame = 0, ...p }) => {
  const t = useTime();
  const L = MISSILE_LEN[kind];
  const h = kind === "aim120" ? 12 : kind === "pac3" ? 17 : 22;
  const x0 = -L / 2;
  const x1 = L / 2;
  const body = kind === "aim120" ? "#C9CCC6" : "#F1F0EA";
  const nose = kind === "thaad" ? C.ink2 : kind === "pac3" ? "#E6E2D6" : "#F4F2EA";
  const f = 1 + 0.18 * Math.sin(t * 80);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {flame > 0 && (
        <g transform={`translate(${x0} 0) scale(${flame * f} 1)`}>
          <path d={`M0,${-h * 0.8} C-60,${-h} -150,-4 -190,0 C-150,4 -60,${h} 0,${h * 0.8}Z`} fill={C.amber} opacity={0.85} />
          <path d={`M0,${-h * 0.5} C-40,${-h * 0.6} -90,-2 -120,0 C-90,2 -40,${h * 0.6} 0,${h * 0.5}Z`} fill="#FFE7A6" />
        </g>
      )}
      {kind === "thaad" && <path d={`M${x0},${-h - 8} L${x0 + 60},${-h} L${x0 + 60},${h} L${x0},${h + 8}Z`} fill={C.steelLight} {...OL} strokeWidth={3} />}
      <path d={`M${x0},${-h} L${x1 - (kind === "thaad" ? 90 : 60)},${-h} L${x1 - (kind === "thaad" ? 90 : 60)},${h} L${x0},${h}Z`} fill={body} {...OL} strokeWidth={3} />
      <path d={`M${x1 - (kind === "thaad" ? 90 : 60)},${-h} C${x1 - 20},${-h} ${x1 - 4},${-h * 0.35} ${x1},0 C${x1 - 4},${h * 0.35} ${x1 - 20},${h} ${x1 - (kind === "thaad" ? 90 : 60)},${h}Z`} fill={nose} {...OL} strokeWidth={3} />
      <path d={`M${x0 + 8},${h * 0.35} L${x1 - 70},${h * 0.35} L${x1 - 70},${h} L${x0 + 8},${h}Z`} fill={C.steel} opacity={0.5} />
      <path d={`M${x0 + 10},${-h * 0.5} L${x1 - 80},${-h * 0.5}`} stroke="#fff" strokeOpacity={0.8} strokeWidth={3} strokeLinecap="round" />
      {kind === "aim120" && (
        <>
          <path d={`M${x0 + 150},${-h} L${x0 + 175},${-h - 22} L${x0 + 195},${-h - 22} L${x0 + 190},${-h}Z M${x0 + 150},${h} L${x0 + 175},${h + 22} L${x0 + 195},${h + 22} L${x0 + 190},${h}Z`} fill={C.steelDark} {...OL} strokeWidth={2.5} />
          <path d={`M${x0 + 4},${-h} L${x0 + 14},${-h - 24} L${x0 + 36},${-h - 24} L${x0 + 40},${-h}Z M${x0 + 4},${h} L${x0 + 14},${h + 24} L${x0 + 36},${h + 24} L${x0 + 40},${h}Z`} fill={C.steelDark} {...OL} strokeWidth={2.5} />
          <path d={`M${x0 + 100},${-h} L${x0 + 100},${h}`} stroke={C.amber} strokeWidth={6} />
        </>
      )}
      {kind === "pac3" && (
        <>
          <path d={`M${x0 + 4},${-h} L${x0 + 20},${-h - 26} L${x0 + 46},${-h - 26} L${x0 + 50},${-h}Z M${x0 + 4},${h} L${x0 + 20},${h + 26} L${x0 + 46},${h + 26} L${x0 + 50},${h}Z`} fill={C.ink2} {...OL} strokeWidth={2.5} />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={x1 - 118 + (i % 2) * 5} y={-h + i * ((2 * h) / 8)} width={6} height={3} fill={C.ink2} />
          ))}
          <path d={`M${x1 - 130},${-h} L${x1 - 130},${h} M${x0 + 150},${-h} L${x0 + 150},${h}`} stroke={C.red} strokeWidth={5} />
        </>
      )}
      {kind === "thaad" && (
        <>
          <path d={`M${x0 + 150},${-h} L${x0 + 150},${h} M${x1 - 150},${-h} L${x1 - 150},${h}`} {...thin(2, C.ink, 0.5)} />
          <rect x={x0 + 200} y={-h + 4} width={70} height={10} fill={C.blueDark} opacity={0.7} />
        </>
      )}
    </g>
  );
};

/** NASAMS-style canister launcher on a truck, side view. Ground y=0. */
export const NasamsLauncher: React.FC<Placed & { elev?: number }> = ({ elev = 30, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <ellipse cx={0} cy={2} rx={200} ry={10} fill={C.ink} opacity={0.2} />
    <rect x={-190} y={-66} width={250} height={36} rx={4} fill={C.olive} {...OL} />
    <path d="M60,-30 L60,-92 L130,-92 L160,-58 L160,-30Z" fill={C.olive} {...OL} />
    <path d="M72,-84 L124,-84 L148,-58 L72,-58Z" fill="#9FC2C9" stroke={C.ink} strokeWidth={2.5} />
    {[-150, -100, 20, 120].map((x) => (
      <g key={x}>
        <circle cx={x} cy={-16} r={18} fill={C.ink2} stroke={C.ink} strokeWidth={3} />
        <circle cx={x} cy={-16} r={7} fill={C.steelDark} />
      </g>
    ))}
    <g transform={`rotate(${-elev} -160 -66)`}>
      <rect x={-180} y={-150} width={220} height={84} rx={4} fill={C.oliveDark} {...OL} />
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => <circle key={`${r}${c}`} cx={48} cy={-136 + r * 28 + c * 0} r={0} />),
      )}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={30} y={-146 + i * 27} width={14} height={22} rx={3} fill={C.ink2} />
      ))}
      <path d="M-180,-108 L40,-108 M-110,-150 L-110,-66" stroke={C.ink} strokeWidth={2} opacity={0.6} />
    </g>
  </g>
);

/** Ballistic missile silhouette (vertical), nose to -y. */
export const BallisticMissile: React.FC<Placed> = (p) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <path d="M0,-150 C14,-120 18,-90 18,-60 L18,110 L40,150 L-40,150 L-18,110 L-18,-60 C-18,-90 -14,-120 0,-150Z" fill={C.steelLight} {...OL} strokeWidth={4} />
    <path d="M0,-150 C14,-120 18,-90 18,-60 L-18,-60 C-18,-90 -14,-120 0,-150Z" fill={C.red} {...OL} strokeWidth={4} />
    <path d="M-18,20 L18,20 M-18,70 L18,70" {...thin(2, C.ink, 0.5)} />
  </g>
);

/** Cruise missile, side view, nose to +x. */
export const CruiseMissile: React.FC<Placed> = (p) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <path d="M-150,-12 L110,-12 C140,-12 160,-4 165,0 C160,4 140,12 110,12 L-150,12Z" fill={C.steel} {...OL} strokeWidth={3.5} />
    <path d="M-20,4 L-60,44 L-40,44 L20,4Z" fill={C.steelDark} {...OL} strokeWidth={3} />
    <path d="M-150,-12 L-175,-44 L-160,-44 L-130,-12Z M-150,12 L-170,34 L-150,34 L-130,12Z" fill={C.steelDark} {...OL} strokeWidth={3} />
    <path d="M-120,12 L-100,24 L-60,24 L-50,12" fill={C.ink3} {...OL} strokeWidth={2.5} />
  </g>
);

export const Ultralight: React.FC<Placed> = (p) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M-160,-70 C-60,-100 60,-100 160,-70 L150,-58 C60,-84 -60,-84 -150,-58Z" fill={C.amber} {...OL} strokeWidth={4} />
      <path d="M0,-80 L0,-10 M-40,-60 L-10,10 M40,-60 L10,10" stroke={C.ink} strokeWidth={4} />
      <path d="M-40,0 C-40,-20 40,-20 40,0 L30,20 L-30,20Z" fill={C.blue} {...OL} strokeWidth={4} />
      <circle cx={-30} cy={34} r={12} fill={C.ink2} />
      <circle cx={30} cy={34} r={12} fill={C.ink2} />
      <path d={`M-52,${-2 - 26 * Math.sin(t * 50)} L-52,${-2 + 26 * Math.sin(t * 50)}`} stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

/** Small two-stroke boxer engine with wooden propeller (spinning). */
export const Engine: React.FC<Placed & { spin?: boolean }> = ({ spin = true, ...p }) => {
  const t = useTime();
  const a = spin ? (t * 1400) % 360 : 30;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <rect x={-40} y={-50} width={120} height={100} rx={14} fill={C.steelDark} {...OL} strokeWidth={4} />
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(20 ${d * 68})`}>
          <rect x={-34} y={-26} width={68} height={52} rx={8} fill={C.steel} {...OL} strokeWidth={4} />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${-30 + i * 12},-26 L${-30 + i * 12},26`} stroke={C.ink} strokeWidth={3} opacity={0.6} />
          ))}
          <circle cx={0} cy={d * 34} r={7} fill={C.ink2} />
          <path d={`M0,${d * 40} C30,${d * 70} 70,${d * 40} 90,${d * 10}`} stroke={C.red} strokeWidth={4} fill="none" />
        </g>
      ))}
      <rect x={80} y={-22} width={56} height={44} rx={8} fill={C.ink3} {...OL} strokeWidth={4} />
      <circle cx={-52} cy={0} r={16} fill={C.steelLight} {...OL} strokeWidth={4} />
      <g transform={`translate(-60 0) scale(1 ${Math.cos((a * Math.PI) / 180)})`}>
        <path d="M-8,0 C-14,-60 -6,-150 8,-170 C18,-150 16,-60 8,0 C16,60 18,150 8,170 C-6,150 -14,60 -8,0Z" fill="#B7813F" {...OL} strokeWidth={4} />
        <path d="M2,-160 C4,-110 4,-60 2,-10" stroke="#E2B77A" strokeWidth={4} />
      </g>
      <circle cx={-60} cy={0} r={10} fill={C.ink2} />
    </g>
  );
};

/** Commercial flight controller board. */
export const PCB: React.FC<Placed> = (p) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <rect x={-150} y={-150} width={300} height={300} rx={22} fill="#1F2A26" {...OL} strokeWidth={5} />
      {[
        [-126, -126],
        [126, -126],
        [-126, 126],
        [126, 126],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={11} fill={C.steelLight} stroke={C.ink} strokeWidth={3} />
      ))}
      <path d="M-100,-60 L-40,-60 L-20,-40 M-100,-20 L-60,-20 L-40,0 M100,60 L40,60 L30,40 M100,90 L10,90 L-10,60 M-90,90 L-40,40 M60,-100 L60,-50 M90,-100 L90,-40 L60,-20" stroke="#C9A64B" strokeWidth={4} fill="none" strokeLinecap="round" />
      <rect x={-50} y={-50} width={100} height={100} rx={6} fill={C.ink} stroke={C.steelDark} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <path d={`M${-44 + i * 12},-50 L${-44 + i * 12},-62 M${-44 + i * 12},50 L${-44 + i * 12},62 M-50,${-44 + i * 12} L-62,${-44 + i * 12} M50,${-44 + i * 12} L62,${-44 + i * 12}`} stroke={C.steelLight} strokeWidth={3} />
        </g>
      ))}
      <circle cx={-20} cy={-20} r={6} fill={C.steelDark} />
      <circle cx={-100} cy={40} r={20} fill={C.steelLight} {...OL} strokeWidth={3} />
      <circle cx={-100} cy={40} r={9} fill={C.steel} />
      <circle cx={-60} cy={110} r={14} fill={C.steelLight} {...OL} strokeWidth={3} />
      <rect x={80} y={-10} width={36} height={22} rx={3} fill={C.ink3} stroke={C.steelDark} strokeWidth={2} />
      <circle cx={100} cy={-120} r={9} fill={C.red} opacity={blink(t, 0.7, 0.4)} />
      <circle cx={70} cy={-120} r={9} fill={C.green} opacity={blink(t, 0.9, 0.5, 0.3)} />
    </g>
  );
};

/* ------------------------------------------------------------------ infrastructure (isometric) */

/** High-voltage transformer with radiators and bushings. arc 0..1 flashes an electrical fault. */
export const Transformer: React.FC<Placed & { arc?: number }> = ({ arc = 0, ...p }) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <Plot w={220} d={200} color="#B9B19A" />
      <Box x={-70} y={-60} w={130} h={16} d={120} color="#9C9F98" />
      <Box x={-60} y={-50} z={16} w={100} d={100} h={90} color="#7E8985" />
      {[-44, -20, 4, 28].map((y) => (
        <g key={y}>
          <Box x={40} y={y} z={24} w={20} d={14} h={70} color="#6F7A77" />
        </g>
      ))}
      <Cyl x={-40} y={-40} z={106} r={16} h={6} color="#6F7A77" />
      <g>
        {[-30, 0, 30].map((y) => {
          const [a, b] = iso(-10, y, 106);
          return (
            <g key={y}>
              <path d={`M${a},${b} L${a},${b - 60}`} stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
              <path d={`M${a},${b} L${a},${b - 60}`} stroke="#8A3B2A" strokeWidth={8} strokeLinecap="round" />
              {[10, 22, 34, 46].map((k) => (
                <ellipse key={k} cx={a} cy={b - k} rx={9} ry={3} fill="#A94E37" stroke={C.ink} strokeWidth={1.2} />
              ))}
              <circle cx={a} cy={b - 64} r={5} fill={C.steelLight} stroke={C.ink} strokeWidth={2} />
            </g>
          );
        })}
      </g>
      {(() => {
        const [cx, cy] = iso(-60, 0, 150);
        return (
          <g>
            <path d={`M${cx - 70},${cy} L${cx + 50},${cy - 30}`} stroke={C.ink} strokeWidth={30} strokeLinecap="round" />
            <path d={`M${cx - 70},${cy} L${cx + 50},${cy - 30}`} stroke="#8F9A96" strokeWidth={24} strokeLinecap="round" />
          </g>
        );
      })()}
      {arc > 0 && arc < 1 && (
        <g opacity={1 - arc}>
          {[0, 1, 2].map((i) => {
            const [a, b] = iso(-10, -30 + i * 30, 170);
            const j = (k: number) => Math.sin(t * 90 + i * 3 + k) * 14;
            return <path key={i} d={`M${a},${b} L${a + 20 + j(1)},${b - 30} L${a - 10 + j(2)},${b - 55} L${a + 25 + j(3)},${b - 85}`} stroke={C.cyan} strokeWidth={5} fill="none" strokeLinejoin="round" />;
          })}
          <circle cx={iso(-10, 0, 170)[0]} cy={iso(-10, 0, 170)[1] - 40} r={90 * (1 - arc)} fill="#fff" opacity={0.5} />
        </g>
      )}
    </g>
  );
};

/** Fuel depot: three tanks with ladders and pipes. fire 0..1 sets the big tank ablaze. */
export const FuelDepot: React.FC<Placed & { fire?: number }> = ({ fire = 0, ...p }) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <Plot w={240} d={220} color="#A8A290" />
      <g transform={ISO_MATRIX}>
        <rect x={-110} y={-100} width={220} height={200} fill="none" stroke="#7D7766" strokeWidth={10} />
      </g>
      <Cyl x={-40} y={-30} r={52} h={110} color="#D9D8D1" cap="#EEEDE7" />
      <Cyl x={60} y={40} r={36} h={80} color="#D9D8D1" cap="#EEEDE7" />
      <Cyl x={-40} y={70} r={30} h={60} color="#D9D8D1" cap="#EEEDE7" />
      <Line3 a={[-10, 20, 20]} b={[40, 40, 20]} color={C.steelDark} width={8} />
      <Line3 a={[-40, 40, 14]} b={[-40, 20, 14]} color={C.steelDark} width={8} />
      {(() => {
        const [a, b] = iso(-40, -30, 0);
        return <path d={`M${a + 50},${b - 5} L${a + 50},${b - 105}`} stroke={C.steelDark} strokeWidth={3} strokeDasharray="6 5" />;
      })()}
      {fire > 0 &&
        (() => {
          const [a, b] = iso(-40, -30, 110);
          const s = Math.min(1, fire * 1.6);
          return (
            <g transform={`translate(${a} ${b})`}>
              {Array.from({ length: 5 }, (_, i) => {
                const k = ((t * 0.7 + i / 5) % 1 + 1) % 1;
                return <circle key={`s${i}`} cx={Math.sin(i * 2 + t) * 20 + k * 40} cy={-60 - k * 220 * s} r={(24 + k * 50) * s} fill="#3F3B38" stroke={C.ink} strokeWidth={3} opacity={0.8 * (1 - k)} />;
              })}
              {[0, 1, 2].map((i) => {
                const fl = 1 + 0.18 * Math.sin(t * 16 + i * 2);
                return (
                  <g key={i} transform={`translate(${-40 + i * 40} 0) scale(${s * fl})`}>
                    <path d="M0,0 C-40,-20 -26,-90 0,-130 C26,-90 40,-20 0,0Z" fill={C.red} stroke={C.ink} strokeWidth={3} />
                    <path d="M0,0 C-22,-14 -14,-56 0,-84 C14,-56 22,-14 0,0Z" fill={C.amber} />
                    <path d="M0,0 C-10,-8 -6,-28 0,-44 C6,-28 10,-8 0,0Z" fill="#FFE7A6" />
                  </g>
                );
              })}
            </g>
          );
        })()}
    </g>
  );
};

/** Rail line with a freight train. stop 0..1 halts the train and turns the signal red. */
export const RailLine: React.FC<Placed & { stop?: number }> = ({ stop = 0, ...p }) => {
  const t = useTime();
  const move = ((t * 60 * (1 - stop)) % 60) - 30;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <Plot w={240} d={220} color="#9E9A73" />
      <g transform={ISO_MATRIX}>
        <rect x={-120} y={-30} width={240} height={60} fill="#8C8577" />
        {Array.from({ length: 13 }, (_, i) => -114 + i * 19).map((x) => (
          <rect key={x} x={x} y={-28} width={8} height={56} fill="#6B5433" />
        ))}
        <path d="M-120,-14 L120,-14 M-120,14 L120,14" stroke={C.steelDark} strokeWidth={5} />
      </g>
      {[-60, 10].map((x, i) => (
        <g key={i} transform={`translate(${iso(x + move * 0.3, 0)[0] - iso(x, 0)[0]} ${iso(x + move * 0.3, 0)[1] - iso(x, 0)[1]})`}>
          <Box x={x} y={-22} z={6} w={60} d={44} h={40} color={i ? "#8A4B3A" : "#3E6A7D"} />
        </g>
      ))}
      {(() => {
        const [a, b] = iso(100, 60, 0);
        return (
          <g transform={`translate(${a} ${b})`}>
            <path d="M0,0 L0,-90" stroke={C.ink} strokeWidth={6} />
            <rect x={-16} y={-126} width={32} height={48} rx={6} fill={C.ink2} stroke={C.ink} strokeWidth={3} />
            <circle cx={0} cy={-112} r={9} fill={stop > 0.5 ? C.red : "#4A2222"} opacity={stop > 0.5 ? blink(t, 0.6, 0.6) : 1} />
            <circle cx={0} cy={-90} r={9} fill={stop > 0.5 ? "#223A22" : C.green} />
          </g>
        );
      })()}
    </g>
  );
};

/** Military factory with sawtooth roof and chimney. stop 0..1 kills the smoke and stops the gear. */
export const Factory: React.FC<Placed & { stop?: number }> = ({ stop = 0, ...p }) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <Plot w={250} d={230} color="#A8A596" />
      <Box x={-90} y={-70} w={170} d={130} h={60} color="#8E9496" />
      {[-70, -26, 18].map((y) => (
        <polygon key={y} points={pts([[-90, y, 60], [80, y, 60], [80, y + 44, 60], [-90, y + 44, 60], [-90, y + 44, 90], [80, y + 44, 90]])} fill={shade("#6D7577", 0.1)} stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" />
      ))}
      {[-60, -20, 20].map((x) => (
        <polygon key={x} points={pts([[x, 60, 14], [x + 26, 60, 14], [x + 26, 60, 44], [x, 60, 44]])} fill="#9FC2C9" stroke={C.ink} strokeWidth={1.5} />
      ))}
      <polygon points={pts([[60, 60, 0], [80, 60, 0], [80, 60, 36], [60, 60, 36]])} fill={C.ink3} stroke={C.ink} strokeWidth={1.5} />
      <Cyl x={-70} y={-60} z={60} r={12} h={90} color="#8A3B2A" cap="#6E2E21" />
      <Box x={90} y={20} w={40} d={40} h={24} color="#8A7A4A" />
      {(() => {
        const [a, b] = iso(-70, -60, 150);
        return (
          <g transform={`translate(${a} ${b})`}>
            {Array.from({ length: 5 }, (_, i) => {
              const k = ((t * 0.5 + i / 5) % 1 + 1) % 1;
              return <circle key={i} cx={k * 50} cy={-k * 140} r={14 + k * 34} fill="#6A6560" stroke={C.ink} strokeWidth={2} opacity={0.75 * (1 - k) * (1 - stop)} />;
            })}
          </g>
        );
      })()}
      {(() => {
        const [a, b] = iso(40, 60, 70);
        return (
          <g transform={`translate(${a + 40} ${b - 40})`}>
            <Gear s={0.42} spin={(1 - stop) * t * 90 + stop * 40} color={stop > 0.5 ? C.steelDark : C.amber} />
            {stop > 0.5 && (
              <g transform="translate(34 -34)">
                <polygon points="-18,-8 -8,-18 8,-18 18,-8 18,8 8,18 -8,18 -18,8" fill={C.red} stroke={C.ink} strokeWidth={3} />
                <path d="M-8,0 L8,0" stroke={C.cream} strokeWidth={5} />
              </g>
            )}
          </g>
        );
      })()}
      <Post x={110} y={100} h={70} color={C.ink} width={3} />
    </g>
  );
};

/* ------------------------------------------------------------------ people & symbols */

export const Soldier: React.FC<Placed & { run?: boolean }> = ({ run = true, ...p }) => {
  const t = useTime();
  const k = run ? Math.sin(t * 14) : 0;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d={`M0,-40 L${-14 * k},0 M0,-40 L${14 * k},0`} stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
      <path d={`M0,-40 L${-14 * k},0 M0,-40 L${14 * k},0`} stroke={C.oliveDark} strokeWidth={9} strokeLinecap="round" />
      <path d="M-14,-44 C-16,-70 16,-70 14,-44Z" fill={C.olive} {...OL} strokeWidth={3} />
      <rect x={-16} y={-92} width={32} height={50} rx={10} fill={C.olive} {...OL} strokeWidth={3} />
      <path d={`M0,-84 L${18 * k + 10},-58 M0,-84 L${-18 * k - 10},-58`} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      <circle cx={0} cy={-104} r={13} fill="#C99A74" stroke={C.ink} strokeWidth={3} />
      <path d="M-15,-106 C-15,-126 15,-126 15,-106Z" fill={C.oliveDark} stroke={C.ink} strokeWidth={3} />
    </g>
  );
};

export const ShieldIcon: React.FC<Placed & { color?: string }> = ({ color = C.blue, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <path d="M0,-80 L64,-56 C64,10 44,56 0,80 C-44,56 -64,10 -64,-56Z" fill={color} {...OL} strokeWidth={5} />
    <path d="M0,-58 L44,-42 C44,6 30,38 0,58Z" fill="#fff" opacity={0.25} />
  </g>
);

export const HelmetIcon: React.FC<Placed> = (p) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <path d="M-70,20 C-76,-60 -30,-86 10,-86 C60,-86 80,-40 76,20 L50,40 L-50,40Z" fill={C.olive} {...OL} strokeWidth={5} />
    <path d="M-50,-10 C-30,-40 30,-40 60,-10 L56,20 C20,6 -20,6 -52,20Z" fill="#9FC2C9" {...OL} strokeWidth={4} />
    <path d="M-40,-8 C-20,-24 20,-26 40,-12" stroke="#fff" strokeOpacity={0.7} strokeWidth={5} fill="none" />
    <path d="M-10,-86 L-10,-50" stroke={C.oliveDark} strokeWidth={6} />
  </g>
);

export const ClockIcon: React.FC<Placed & { turn?: number }> = ({ turn = 0, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <circle r={72} fill={C.cream} {...OL} strokeWidth={6} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <path key={i} d={`M${Math.sin(a) * 56},${-Math.cos(a) * 56} L${Math.sin(a) * 64},${-Math.cos(a) * 64}`} stroke={C.ink} strokeWidth={4} />;
    })}
    <path d={`M0,0 L${Math.sin(turn * 12) * 36},${-Math.cos(turn * 12) * 36}`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
    <path d={`M0,0 L${Math.sin(turn) * 26},${-Math.cos(turn) * 26}`} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
    <circle r={7} fill={C.ink} />
  </g>
);

/** Red "no" sign drawn over an icon, p 0..1. */
export const NoSign: React.FC<Placed & { p: number; r?: number }> = ({ p: pr, r = 100, ...pl }) =>
  pr <= 0 ? null : (
    <g transform={place(pl)} opacity={pl.opacity}>
      <circle r={r} fill="none" stroke={C.ink} strokeWidth={26} pathLength={1} strokeDasharray={`${Math.min(1, pr * 1.6)} 2`} transform="rotate(-90)" />
      <circle r={r} fill="none" stroke={C.red} strokeWidth={16} pathLength={1} strokeDasharray={`${Math.min(1, pr * 1.6)} 2`} transform="rotate(-90)" />
      {pr > 0.6 && <path d={`M${-r * 0.7},${-r * 0.7} L${-r * 0.7 + r * 1.4 * Math.min(1, (pr - 0.6) / 0.4)},${-r * 0.7 + r * 1.4 * Math.min(1, (pr - 0.6) / 0.4)}`} stroke={C.red} strokeWidth={16} strokeLinecap="round" />}
    </g>
  );

/** Sun / moon swap for day-night cycles. phase 0 = sun, 1 = moon. */
export const SunMoon: React.FC<Placed & { phase: number }> = ({ phase, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <g opacity={1 - phase}>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <path key={i} d={`M${Math.cos(a) * 52},${Math.sin(a) * 52} L${Math.cos(a) * 74},${Math.sin(a) * 74}`} stroke={C.amber} strokeWidth={8} strokeLinecap="round" />;
      })}
      <circle r={40} fill={C.amber} {...OL} strokeWidth={5} />
    </g>
    <g opacity={phase}>
      <path d="M20,-50 A54,54 0 1 0 50,30 A42,42 0 1 1 20,-50Z" fill={C.cream} {...OL} strokeWidth={5} />
      <circle cx={-60} cy={-40} r={4} fill={C.cream} />
      <circle cx={70} cy={-60} r={3} fill={C.cream} />
    </g>
  </g>
);

export const Big: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; anchor?: "start" | "middle" | "end"; opacity?: number }> = ({
  x,
  y,
  text,
  size = 96,
  color = C.cream,
  anchor = "middle",
  opacity = 1,
}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={F.anton} fontSize={size} fill={color} stroke={C.ink} strokeWidth={size * 0.08} paintOrder="stroke" letterSpacing={size * 0.02} opacity={opacity}>
    {text}
  </text>
);

/** Scrolling column of scrambling prices — the running theme of this part. */
export const PriceTicker: React.FC<{ x: number; seed?: number; rows?: number; opacity?: number; speed?: number }> = ({ x, seed = 0, rows = 9, opacity = 0.34, speed = 26 }) => {
  const t = useTime();
  const step = 118;
  const span = rows * step;
  const digits = (i: number) => {
    const k = Math.floor(t * 1.6 + i * 3 + seed * 7);
    const d = Array.from({ length: 6 }, (_, j) => Math.floor(((Math.sin(k * 12.9898 + j * 78.233 + seed) * 43758.5453) % 1 + 1) % 1 * 10)).join("");
    return `$${d.slice(0, 2)},${d.slice(2, 5)}`;
  };
  return (
    <g opacity={opacity}>
      {Array.from({ length: rows + 1 }, (_, i) => {
        const y = 40 + (((i * step - t * speed) % span) + span) % span;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M-96,0 L96,0" stroke={C.cream} strokeOpacity={0.35} strokeWidth={2} />
            <text y={-14} textAnchor="middle" fontFamily={F.anton} fontSize={40} fill={i % 3 === 0 ? C.amber : C.cream} letterSpacing={1}>
              {digits(i)}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/** Sweeping scan line used over exploded views. */
export const ScanLine: React.FC<{ x: number; w: number; y0: number; y1: number; color?: string; period?: number }> = ({ x, w, y0, y1, color = C.cyan, period = 3.2 }) => {
  const t = useTime();
  const k = ((t % period) / period);
  const y = y0 + (y1 - y0) * k;
  return (
    <g opacity={0.55 + 0.25 * Math.sin(t * 6)}>
      <path d={`M${x - w / 2},${y} L${x + w / 2},${y}`} stroke={color} strokeWidth={5} />
      <path d={`M${x - w / 2},${y}` + ` L${x + w / 2},${y}`} stroke={color} strokeWidth={22} opacity={0.18} />
    </g>
  );
};
