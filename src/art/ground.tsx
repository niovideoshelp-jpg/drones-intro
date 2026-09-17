import React from "react";
import { C } from "../design";
import { useTime } from "../lib/kf";
import { OL, Placed, blink, place, thin } from "./style";

/** Main battle tank, top view, gun to -y. Hull 116 x 152. */
export const TankTop: React.FC<Placed & { thermal?: boolean; hull?: string }> = ({ thermal = false, hull = C.olive, ...p }) => {
  const body = thermal ? "#3B4240" : hull;
  const deck = thermal ? "#EDEFE9" : C.oliveDark;
  const turret = thermal ? "#9DA6A2" : "#838A5E";
  const links = Array.from({ length: 19 }, (_, i) => -72 + i * 8);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {!thermal && <rect x={-54} y={-70} width={120} height={156} rx={10} fill={C.ink} opacity={0.2} />}
      {/* tracks */}
      {[-58, 40].map((x) => (
        <g key={x}>
          <rect x={x} y={-78} width={18} height={156} rx={4} fill={thermal ? "#5A625F" : C.ink3} {...OL} strokeWidth={2.5} />
          {links.map((y) => (
            <path key={y} d={`M${x + 2},${y} L${x + 16},${y}`} {...thin(1.6, thermal ? "#9DA6A2" : C.steelDark, 0.8)} />
          ))}
        </g>
      ))}
      {/* hull */}
      <path d="M-42,-78 L42,-78 L46,-60 L46,74 L-46,74 L-46,-60Z" fill={body} {...OL} strokeWidth={2.5} />
      <path d="M-46,-40 L-40,-40 L-40,70 L-46,70Z M46,-40 L40,-40 L40,70 L46,70Z" fill={C.ink} opacity={0.2} />
      {/* engine deck */}
      <rect x={-34} y={38} width={68} height={32} rx={3} fill={deck} stroke={C.ink} strokeWidth={2} />
      {[44, 50, 56, 62].map((y) => (
        <path key={y} d={`M-30,${y} L30,${y}`} {...thin(1.5, C.ink, thermal ? 0.25 : 0.55)} />
      ))}
      {/* turret */}
      <path d="M-30,-28 L-14,-42 L14,-42 L30,-28 L34,16 L22,32 L-22,32 L-34,16Z" fill={turret} {...OL} strokeWidth={2.5} />
      <path d="M-26,-24 L-12,-36 L12,-36" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} fill="none" />
      <rect x={-22} y={18} width={44} height={10} rx={2} fill={body} stroke={C.ink} strokeWidth={1.5} />
      <circle cx={13} cy={2} r={9} fill={body} stroke={C.ink} strokeWidth={2} />
      <circle cx={-14} cy={8} r={7} fill={body} stroke={C.ink} strokeWidth={2} />
      <path d="M13,2 L20,-6" stroke={C.ink} strokeWidth={2} />
      {/* ERA blocks */}
      {[-24, -12, 0, 12].map((x) => (
        <rect key={x} x={x - 4} y={-40} width={10} height={7} fill={turret} stroke={C.ink} strokeWidth={1.2} />
      ))}
      {/* gun */}
      <rect x={-4.5} y={-150} width={9} height={110} rx={2} fill={turret} {...OL} strokeWidth={2.5} />
      <rect x={-7} y={-120} width={14} height={20} rx={3} fill={body} stroke={C.ink} strokeWidth={2} />
      <rect x={-6} y={-156} width={12} height={10} rx={2} fill={C.ink2} />
    </g>
  );
};

/** Tank side view, gun to +x. ~300 x 110; ground contact at y=0. */
export const TankSide: React.FC<Placed & { hull?: string }> = ({ hull = C.olive, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <ellipse cx={0} cy={4} rx={150} ry={8} fill={C.ink} opacity={0.2} />
    <path d="M-136,-16 C-146,-16 -150,-44 -134,-48 L130,-48 C148,-44 146,-16 134,-16 C120,0 -120,0 -136,-16Z" fill={C.ink3} {...OL} />
    {[-104, -64, -24, 16, 56, 96].map((x) => (
      <g key={x}>
        <circle cx={x} cy={-22} r={15} fill={C.steelDark} stroke={C.ink} strokeWidth={2.5} />
        <circle cx={x} cy={-22} r={5} fill={C.ink2} />
      </g>
    ))}
    <path d="M-150,-52 L150,-52 L140,-72 L-130,-80Z" fill={hull} {...OL} />
    <path d="M-140,-60 L144,-60" {...thin(1.5, C.ink, 0.4)} />
    <path d="M-80,-80 L-70,-108 L50,-110 L80,-96 L78,-80Z" fill="#838A5E" {...OL} />
    <path d="M-60,-104 L40,-106" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} />
    <rect x={76} y={-100} width={170} height={9} rx={2} fill="#838A5E" {...OL} strokeWidth={2.5} />
    <rect x={150} y={-102} width={22} height={13} rx={2} fill={hull} stroke={C.ink} strokeWidth={2} />
    <rect x={-40} y={-120} width={30} height={12} rx={3} fill={hull} stroke={C.ink} strokeWidth={2} />
    <path d="M-66,-104 L-90,-160" stroke={C.ink} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

/** Towed howitzer, top view, barrel to -y. */
export const HowitzerTop: React.FC<Placed> = (p) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <path d="M-8,10 L-60,120 M8,10 L60,120" stroke={C.ink} strokeWidth={14} strokeLinecap="round" />
    <path d="M-8,10 L-60,120 M8,10 L60,120" stroke={C.olive} strokeWidth={8} strokeLinecap="round" />
    <path d="M-74,116 L-46,126 M46,126 L74,116" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    {[-44, 30].map((x) => (
      <rect key={x} x={x} y={-12} width={14} height={40} rx={5} fill={C.ink3} {...OL} strokeWidth={2.5} />
    ))}
    <path d="M-40,-24 L40,-24 L32,-4 L-32,-4Z" fill={C.olive} {...OL} strokeWidth={2.5} />
    <rect x={-12} y={-20} width={24} height={46} rx={5} fill="#838A5E" {...OL} strokeWidth={2.5} />
    <rect x={-4} y={-130} width={8} height={112} fill="#838A5E" {...OL} strokeWidth={2.5} />
    <rect x={-8} y={-140} width={16} height={14} rx={2} fill={C.oliveDark} stroke={C.ink} strokeWidth={2} />
    <path d="M-4,-60 L4,-60" {...thin(1.5, C.ink, 0.5)} />
  </g>
);

/** Self-propelled SAM, top view, cab to -y. */
export const SAMTop: React.FC<Placed> = (p) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <rect x={-40} y={-118} width={96} height={240} rx={10} fill={C.ink} opacity={0.2} />
      {[-86, -46, 40, 80].map((y) => (
        <g key={y}>
          <rect x={-50} y={y} width={12} height={28} rx={4} fill={C.ink2} />
          <rect x={38} y={y} width={12} height={28} rx={4} fill={C.ink2} />
        </g>
      ))}
      <rect x={-40} y={-120} width={80} height={236} rx={8} fill={C.olive} {...OL} />
      <path d="M-40,-66 L40,-66" stroke={C.ink} strokeWidth={2.5} />
      <path d="M-32,-112 L32,-112 L28,-96 L-28,-96Z" fill="#9FC2C9" stroke={C.ink} strokeWidth={2} />
      <path d="M-36,-40 L36,-40 M-36,90 L36,90" {...thin(1.5, C.ink, 0.45)} />
      {/* launcher rails */}
      <g transform="rotate(-8 0 20)">
        <rect x={-34} y={-34} width={68} height={118} rx={4} fill={C.oliveDark} {...OL} strokeWidth={2.5} />
        {[-24, -8, 8, 24].map((x) => (
          <g key={x}>
            <rect x={x - 6} y={-28} width={12} height={106} rx={5} fill="#C8CBB7" stroke={C.ink} strokeWidth={2} />
            <path d={`M${x - 6},-18 L${x + 6},-18`} stroke={C.red} strokeWidth={2} />
          </g>
        ))}
      </g>
      <circle cx={0} cy={-52} r={12} fill={C.steel} stroke={C.ink} strokeWidth={2.5} />
      <path d={`M0,-52 L${12 * Math.cos(t * 3)},${-52 + 12 * Math.sin(t * 3)}`} stroke={C.ink} strokeWidth={2} />
      <circle cx={30} cy={-104} r={3} fill={C.amber} opacity={blink(t, 0.8, 0.3)} />
    </g>
  );
};

/** Interceptor missile, side view, nose to +x, length 320. Flame class "flame". */
export const MissileSide: React.FC<Placed & { flame?: number }> = ({ flame = 0, ...p }) => {
  const t = useTime();
  const f = 1 + 0.18 * Math.sin(t * 90) + 0.1 * Math.sin(t * 37);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {flame > 0 && (
        <g transform={`translate(-160 0) scale(${flame * f} ${0.9 + 0.1 * f})`}>
          <path d="M0,-14 C-60,-16 -150,-6 -190,0 C-150,6 -60,16 0,14Z" fill={C.amber} opacity={0.85} />
          <path d="M0,-9 C-40,-10 -90,-4 -120,0 C-90,4 -40,10 0,9Z" fill="#FFE7A6" />
          <path d="M0,-4 C-20,-4 -40,-2 -54,0 C-40,2 -20,4 0,4Z" fill="#fff" />
        </g>
      )}
      <path d="M-160,-15 L-148,-15 L-120,-44 L-98,-44 L-110,-15 L-110,15 L-98,44 L-120,44 L-148,15 L-160,15Z" fill={C.ink2} {...OL} strokeWidth={2.5} />
      <path d="M-156,-15 L120,-15 C150,-15 172,-8 180,0 C172,8 150,15 120,15 L-156,15Z" fill="#F1F0EA" {...OL} strokeWidth={3} />
      <path d="M-150,6 L120,6 C150,6 168,4 176,2 C168,8 150,15 120,15 L-150,15Z" fill={C.steel} opacity={0.7} />
      <path d="M120,-15 C150,-15 172,-8 180,0 C172,8 150,15 120,15Z" fill={C.ink2} />
      <path d="M-40,-15 L-40,15 M-20,-15 L-20,15" stroke={C.red} strokeWidth={6} />
      <path d="M30,-15 L10,-34 L-4,-34 L4,-15Z M30,15 L10,34 L-4,34 L4,15Z" fill={C.ink2} {...OL} strokeWidth={2} />
      <path d="M-120,-9 L100,-9" stroke="#fff" strokeOpacity={0.8} strokeWidth={3} strokeLinecap="round" />
      <path d="M60,-15 L60,15 M-80,-15 L-80,15" {...thin(1.5, C.ink, 0.5)} />
    </g>
  );
};

/** Canister launcher truck (Patriot-class), side view, launcher raised. Ground y=0, ~420 wide. */
export const LauncherSide: React.FC<Placed & { elev?: number }> = ({ elev = 38, ...p }) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <ellipse cx={0} cy={2} rx={220} ry={10} fill={C.ink} opacity={0.2} />
    <rect x={-200} y={-74} width={300} height={40} rx={4} fill={C.olive} {...OL} />
    <path d="M100,-34 L100,-96 L170,-96 L196,-60 L196,-34Z" fill={C.olive} {...OL} />
    <path d="M112,-88 L162,-88 L184,-60 L112,-60Z" fill="#9FC2C9" stroke={C.ink} strokeWidth={2.5} />
    <path d="M-190,-54 L90,-54" {...thin(1.5, C.ink, 0.45)} />
    {[-160, -110, 60, 150].map((x) => (
      <g key={x}>
        <circle cx={x} cy={-18} r={20} fill={C.ink2} stroke={C.ink} strokeWidth={3} />
        <circle cx={x} cy={-18} r={8} fill={C.steelDark} />
      </g>
    ))}
    {/* raised canister pack, pivot at (-170,-74) */}
    <g className="pack" transform={`rotate(${-elev} -170 -74)`}>
      <rect x={-190} y={-146} width={270} height={72} rx={4} fill={C.oliveDark} {...OL} />
      <path d="M-190,-110 L80,-110 M-100,-146 L-100,-74 M-10,-146 L-10,-74" stroke={C.ink} strokeWidth={2} opacity={0.6} />
      <rect x={70} y={-142} width={14} height={64} rx={2} fill={C.ink2} />
    </g>
    <path d="M-40,-74 L-120,-150" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
    <path d="M-40,-74 L-120,-150" stroke={C.steelDark} strokeWidth={3} strokeLinecap="round" />
  </g>
);

/** Anti-drone jammer mast with panel antennas. Ground y=0. */
export const JammerMast: React.FC<Placed> = (p) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M0,-120 L-50,0 M0,-120 L50,0 M0,-120 L0,0" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
      <rect x={-6} y={-240} width={12} height={130} fill={C.steelDark} {...OL} strokeWidth={2.5} />
      <rect x={-34} y={-150} width={68} height={40} rx={4} fill={C.olive} {...OL} strokeWidth={2.5} />
      <circle cx={22} cy={-130} r={4} fill={C.green} opacity={blink(t, 0.6, 0.5)} />
      <path d="M-26,-138 L6,-138 M-26,-128 L6,-128" {...thin(1.5, C.ink, 0.5)} />
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d * 26} -226) rotate(${d * 18})`}>
          <rect x={-14} y={-26} width={28} height={52} rx={3} fill={C.cream} {...OL} strokeWidth={2.5} />
          <path d="M-8,-14 L8,-14 M-8,0 L8,0 M-8,14 L8,14" {...thin(1.5, C.ink, 0.4)} />
        </g>
      ))}
      <rect x={-14} y={-280} width={28} height={40} rx={3} fill={C.cream} {...OL} strokeWidth={2.5} />
    </g>
  );
};

/** Oil refinery: tanks, column and flare. Ground y=0. */
export const Refinery: React.FC<Placed> = (p) => {
  const t = useTime();
  const fl = 1 + 0.15 * Math.sin(t * 20) + 0.08 * Math.sin(t * 51);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M-170,0 L170,0" stroke={C.ink} strokeWidth={4} />
      {[
        [-120, 70],
        [-40, 56],
      ].map(([x, h], i) => (
        <g key={i}>
          <path d={`M${x - 36},0 L${x - 36},${-h} A36,10 0 0 1 ${x + 36},${-h} L${x + 36},0Z`} fill={C.cream} {...OL} strokeWidth={2.5} />
          <ellipse cx={x} cy={-h} rx={36} ry={10} fill={C.steelLight} {...OL} strokeWidth={2.5} />
          <path d={`M${x + 20},${-h + 4} L${x + 20},-2`} {...thin(1.5, C.steelDark, 0.8)} />
        </g>
      ))}
      <rect x={30} y={-190} width={30} height={190} rx={4} fill={C.steelLight} {...OL} strokeWidth={2.5} />
      {[-160, -120, -80, -40].map((y) => (
        <path key={y} d={`M26,${y} L64,${y}`} stroke={C.ink} strokeWidth={2.5} />
      ))}
      <path d="M60,-60 L110,-60 L110,-10" fill="none" stroke={C.steelDark} strokeWidth={6} />
      <rect x={120} y={-230} width={10} height={230} fill={C.steelDark} {...OL} strokeWidth={2} />
      <g transform={`translate(125 -232) scale(${fl})`}>
        <path d="M0,0 C-14,-10 -8,-34 0,-46 C8,-34 14,-10 0,0Z" fill={C.amber} />
        <path d="M0,0 C-6,-6 -4,-20 0,-26 C4,-20 6,-6 0,0Z" fill="#FFE7A6" />
      </g>
    </g>
  );
};
