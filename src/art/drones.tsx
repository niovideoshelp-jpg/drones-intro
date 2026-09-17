import React from "react";
import { C } from "../design";
import { useTime } from "../lib/kf";
import { OL, Placed, blink, place, thin } from "./style";

/** Bayraktar-class MALE drone, side view, nose to +x. ~520 x 120 units. */
export const ReconDroneSide: React.FC<Placed & { gimbal?: number; armed?: boolean; lights?: boolean }> = ({
  gimbal = 30,
  armed = false,
  lights = true,
  ...p
}) => {
  const t = useTime();
  const propPhase = Math.sin(t * 90);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {/* far wing (behind fuselage) */}
      <path d="M96,-40 C80,-50 10,-52 -24,-45 L-40,-38 C0,-37 60,-37 96,-40Z" fill={C.steelDark} {...OL} strokeWidth={2.5} />
      {/* tail boom + inverted V tail */}
      <path d="M-20,-40 L-226,-34 L-226,-26 L-20,-30Z" fill={C.steel} {...OL} strokeWidth={2.5} />
      <path d="M-196,-34 L-238,-34 L-268,18 L-240,20Z" fill={C.steel} {...OL} strokeWidth={2.5} />
      <path d="M-212,-28 L-236,-30 L-258,10" {...thin(1.5, C.ink, 0.35)} />
      {/* pusher propeller disc */}
      <ellipse cx={-224} cy={0} rx={6} ry={38} fill={C.ink} opacity={0.18} />
      <path d={`M-224,0 L${-224 + 3 * propPhase},-36 M-224,0 L${-224 - 3 * propPhase},36`} stroke={C.ink2} strokeWidth={5} strokeLinecap="round" opacity={0.55} />
      <circle cx={-222} cy={0} r={6} fill={C.ink2} />
      {/* fuselage */}
      <path
        d="M252,2 C252,-22 226,-36 190,-38 L40,-36 C0,-35 -60,-28 -150,-15 L-205,-9 C-217,-7 -219,7 -205,9 L-150,13 C-60,21 0,27 40,29 L182,29 C226,27 252,20 252,2Z"
        fill={C.steelLight}
        {...OL}
      />
      <path d="M252,6 C249,19 226,27 182,29 L40,29 C0,27 -60,21 -150,13 L-205,9 C-214,7 -216,3 -214,1 L-150,5 C-60,11 0,15 40,15 L190,13 C230,11 248,9 252,6Z" fill={C.steel} />
      <path d="M204,-31 L40,-29 C0,-28 -60,-22 -140,-12" stroke="#fff" strokeWidth={4} strokeOpacity={0.55} fill="none" strokeLinecap="round" />
      {/* panel lines */}
      <path d="M150,-37 L150,29 M60,-36 L60,29 M-60,-26 L-60,20 M-130,-17 L-130,14 M200,-20 C212,-8 214,8 206,20" {...thin(1.5, C.ink, 0.4)} />
      <rect x={82} y={-14} width={34} height={12} rx={3} {...thin(1.5, C.ink, 0.45)} />
      {/* near wing */}
      <path d="M104,-35 C88,-47 16,-49 -18,-42 L-34,-33 C6,-32 66,-31 104,-35Z" fill={C.steelLight} {...OL} strokeWidth={2.5} />
      <path d="M-18,-37 L96,-37" {...thin(1.5, C.ink, 0.35)} />
      {/* antennas + satcom hump */}
      <path d="M110,-37 L104,-58 M-40,-30 L-50,-48" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      <path d="M150,-37 C150,-50 186,-50 190,-38" fill={C.steelLight} {...OL} strokeWidth={2.5} />
      {/* munitions under wing */}
      {armed && (
        <g className="munitions">
          <path d="M48,-30 L48,-18 M-6,-30 L-6,-18" stroke={C.ink} strokeWidth={3} />
          <path d="M76,-12 C76,-20 66,-22 56,-22 L-6,-22 L-18,-26 L-18,-6 L-6,-10 L56,-10 C66,-10 76,-6 76,-12Z" fill={C.olive} {...OL} strokeWidth={2.5} />
          <path d="M60,-22 L60,-10 M8,-22 L8,-10" {...thin(1.5, C.ink, 0.5)} />
          <circle cx={72} cy={-16} r={2.5} fill={C.red} />
        </g>
      )}
      {/* landing gear */}
      <path d="M36,28 L18,66 M52,28 L22,66" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <circle cx={18} cy={70} r={12} fill={C.ink2} stroke={C.ink} strokeWidth={3} />
      <circle cx={18} cy={70} r={4} fill={C.steel} />
      <path d="M196,28 L204,60" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <circle cx={204} cy={64} r={9} fill={C.ink2} stroke={C.ink} strokeWidth={3} />
      {/* EO/IR gimbal */}
      <g className="gimbal">
        <rect x={132} y={26} width={22} height={10} fill={C.steelDark} {...OL} strokeWidth={2} />
        <circle cx={143} cy={48} r={18} fill={C.steel} {...OL} strokeWidth={2.5} />
        <path d="M128,44 C132,34 150,32 158,42" stroke="#fff" strokeOpacity={0.5} strokeWidth={3} fill="none" />
        <g transform={`rotate(${gimbal} 143 48)`}>
          <circle cx={157} cy={48} r={8} fill={C.ink} />
          <circle cx={159} cy={46} r={2.5} fill={C.cyan} />
        </g>
      </g>
      {lights && (
        <>
          <circle cx={-44} cy={-48} r={4} fill="#fff" opacity={blink(t, 1.3, 0.1)} />
          <circle cx={100} cy={-40} r={4} fill={C.red} opacity={blink(t, 1.1, 0.2, 0.4)} />
        </>
      )}
    </g>
  );
};

/** Bayraktar-class MALE drone, top view, nose to -y. Wingspan 240. */
export const ReconDroneTop: React.FC<Placed & { armed?: boolean; tone?: string }> = ({ armed = false, tone = C.steelLight, ...p }) => {
  const t = useTime();
  const a = (t * 2400) % 360;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <ellipse cx={8} cy={14} rx={120} ry={16} fill={C.ink} opacity={0.18} />
      {/* booms and tail */}
      <path d="M-37,8 L-31,8 L-31,70 L-37,70Z M31,8 L37,8 L37,70 L31,70Z" fill={C.steel} {...OL} strokeWidth={2} />
      <path d="M-44,62 L44,62 L38,76 L-38,76Z" fill={tone} {...OL} strokeWidth={2.5} />
      <path d="M-40,70 L40,70" {...thin(1.2, C.ink, 0.4)} />
      {/* wing */}
      <path d="M-122,-4 L-18,-12 L18,-12 L122,-4 L122,7 L18,15 L-18,15 L-122,7Z" fill={tone} {...OL} strokeWidth={2.5} />
      <path d="M-122,3 L-18,10 L18,10 L122,3 L122,7 L18,15 L-18,15 L-122,7Z" fill={C.steel} />
      <path d="M-112,5 L-64,8 M64,8 L112,5 M-60,-8 L-60,11 M60,-8 L60,11" {...thin(1.2, C.ink, 0.45)} />
      {armed && (
        <g className="munitions">
          <rect x={-60} y={-18} width={7} height={30} rx={3} fill={C.olive} {...OL} strokeWidth={1.6} />
          <rect x={53} y={-18} width={7} height={30} rx={3} fill={C.olive} {...OL} strokeWidth={1.6} />
        </g>
      )}
      {/* fuselage */}
      <path d="M0,-66 C12,-66 13,-52 13,-32 L10,42 C8,54 -8,54 -10,42 L-13,-32 C-13,-52 -12,-66 0,-66Z" fill={tone} {...OL} strokeWidth={2.5} />
      <path d="M-5,-58 C-8,-40 -8,0 -6,40" stroke="#fff" strokeOpacity={0.6} strokeWidth={3} fill="none" />
      <path d="M-12,-30 L12,-30 M-10,20 L10,20" {...thin(1.2, C.ink, 0.45)} />
      {/* prop */}
      <ellipse cx={0} cy={56} rx={20} ry={5} fill={C.ink} opacity={0.2} />
      <path d={`M${-18 * Math.cos((a * Math.PI) / 180)},56 L${18 * Math.cos((a * Math.PI) / 180)},56`} stroke={C.ink2} strokeWidth={4} strokeLinecap="round" />
      <circle cx={-121} cy={2} r={3.5} fill={C.red} opacity={blink(t, 1.1)} />
      <circle cx={121} cy={2} r={3.5} fill={C.green} opacity={blink(t, 1.1)} />
    </g>
  );
};

/** Loitering munition (canard delta), top view, nose to -y. ~150 wide. */
export const LoiterTop: React.FC<Placed & { tone?: string }> = ({ tone = C.sand, ...p }) => {
  const t = useTime();
  const a = (t * 2200) % 360;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M0,-80 C8,-80 10,-66 10,-50 L10,50 L-10,50 L-10,-50 C-10,-66 -8,-80 0,-80Z" fill={tone} {...OL} strokeWidth={2.5} />
      <path d="M-10,-50 L-30,-36 L-10,-36Z M10,-50 L30,-36 L10,-36Z" fill={tone} {...OL} strokeWidth={2} />
      <path d="M-10,-6 L-78,40 L-78,52 L-10,48Z M10,-6 L78,40 L78,52 L10,48Z" fill={tone} {...OL} strokeWidth={2.5} />
      <path d="M-78,40 L-78,52 M78,40 L78,52" stroke={C.ink} strokeWidth={5} />
      <path d="M-60,44 L-20,44 M60,44 L20,44 M-4,-70 C-6,-40 -6,0 -4,40" {...thin(1.3, C.ink, 0.45)} />
      <path d={`M${-16 * Math.cos((a * Math.PI) / 180)},54 L${16 * Math.cos((a * Math.PI) / 180)},54`} stroke={C.ink2} strokeWidth={4} strokeLinecap="round" />
      <rect x={-6} y={-78} width={12} height={10} rx={4} fill={C.ink2} />
    </g>
  );
};

/** Shahed-136-type delta loitering munition, top view, nose to -y. Span 300. */
export const ShahedTop: React.FC<Placed & { tone?: string; detail?: boolean }> = ({ tone = "#C9CCC8", detail = true, ...p }) => {
  const t = useTime();
  const a = (t * 2600) % 360;
  const blade = 44 * Math.cos((a * Math.PI) / 180);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {/* wings */}
      <path d="M-20,-56 L-150,96 L-150,128 L-20,122Z M20,-56 L150,96 L150,128 L20,122Z" fill={tone} {...OL} strokeWidth={3} />
      <path d="M-20,40 L-150,112 L-150,128 L-20,122Z M20,40 L150,112 L150,128 L20,122Z" fill={C.steel} opacity={0.75} />
      {/* elevons */}
      <path d="M-40,110 L-128,116 M40,110 L128,116 M-84,112 L-84,126 M84,112 L84,126" {...thin(1.6, C.ink, 0.55)} />
      {/* winglets (seen from above) */}
      <rect x={-156} y={78} width={12} height={54} rx={3} fill={C.steelDark} {...OL} strokeWidth={2.5} />
      <rect x={144} y={78} width={12} height={54} rx={3} fill={C.steelDark} {...OL} strokeWidth={2.5} />
      {/* fuselage */}
      <path d="M0,-176 C16,-176 22,-160 22,-138 L22,120 C22,132 -22,132 -22,120 L-22,-138 C-22,-160 -16,-176 0,-176Z" fill={tone} {...OL} strokeWidth={3} />
      <path d="M-9,-164 C-13,-130 -13,40 -10,118" stroke="#fff" strokeOpacity={0.55} strokeWidth={5} fill="none" strokeLinecap="round" />
      {detail && (
        <>
          <path d="M-22,-118 L22,-118 M-22,-40 L22,-40 M-22,60 L22,60" {...thin(1.8, C.ink, 0.55)} />
          <circle cx={0} cy={-6} r={7} fill={C.steelDark} {...OL} strokeWidth={1.5} />
          <path d="M-8,-90 L8,-90 M-8,-84 L8,-84 M-8,-78 L8,-78" {...thin(1.4, C.ink, 0.4)} />
          <path d="M-100,60 L-60,20 M100,60 L60,20" {...thin(1.3, C.ink, 0.3)} />
        </>
      )}
      {/* engine + prop */}
      <rect x={-16} y={122} width={32} height={18} rx={4} fill={C.ink3} {...OL} strokeWidth={2} />
      <ellipse cx={0} cy={146} rx={48} ry={7} fill={C.ink} opacity={0.18} />
      <path d={`M${-blade},146 L${blade},146`} stroke={C.ink2} strokeWidth={6} strokeLinecap="round" />
      <circle cx={0} cy={146} r={5} fill={C.ink} />
    </g>
  );
};

/** FPV quadcopter, top view, camera to -y. ~200 across. */
export const FPVTop: React.FC<Placed & { payload?: boolean }> = ({ payload = true, ...p }) => {
  const t = useTime();
  const motors: [number, number][] = [
    [-66, -66],
    [66, -66],
    [-66, 66],
    [66, 66],
  ];
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <path d="M-66,-66 L66,66 M66,-66 L-66,66" stroke={C.ink} strokeWidth={17} strokeLinecap="round" />
      <path d="M-66,-66 L66,66 M66,-66 L-66,66" stroke="#3A3F40" strokeWidth={11} strokeLinecap="round" />
      {motors.map(([x, y], i) => {
        const a = (t * (i % 2 ? -3000 : 3000) + i * 40) % 360;
        const r = (a * Math.PI) / 180;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={46} fill={C.steel} opacity={0.22} />
            <circle cx={x} cy={y} r={46} fill="none" stroke={C.ink} strokeOpacity={0.35} strokeWidth={1.5} />
            <path d={`M${x - 44 * Math.cos(r)},${y - 44 * Math.sin(r)} L${x + 44 * Math.cos(r)},${y + 44 * Math.sin(r)}`} stroke={C.ink2} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
            <circle cx={x} cy={y} r={13} fill={C.steelDark} stroke={C.ink} strokeWidth={3} />
            <circle cx={x} cy={y} r={5} fill={C.red} />
          </g>
        );
      })}
      {/* body stack */}
      <rect x={-22} y={-40} width={44} height={80} rx={8} fill={C.ink3} {...OL} />
      <rect x={-16} y={-18} width={32} height={46} rx={4} fill={C.steelDark} stroke={C.ink} strokeWidth={2} />
      <path d="M-16,-4 L16,-4 M-16,10 L16,10" {...thin(4, C.red, 0.9)} />
      {/* camera */}
      <rect x={-12} y={-54} width={24} height={18} rx={4} fill={C.ink2} stroke={C.ink} strokeWidth={2} />
      <circle cx={0} cy={-52} r={6} fill={C.ink} stroke={C.cyan} strokeWidth={1.5} />
      {/* antennas */}
      <path d="M-8,40 L-24,74 M8,40 L24,74" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
      <circle cx={-24} cy={76} r={4} fill={C.red} />
      <circle cx={24} cy={76} r={4} fill={C.red} />
      {payload && (
        <g>
          <path d="M-9,-60 L9,-60 L14,-96 C14,-112 -14,-112 -14,-96Z" fill={C.olive} {...OL} strokeWidth={2.5} />
          <path d="M-12,-86 L12,-86" {...thin(1.5, C.ink, 0.5)} />
        </g>
      )}
    </g>
  );
};

/** FPV quad side view with RPG-type warhead, nose to +x, pitched by rotating the placement. */
export const FPVSide: React.FC<Placed> = (p) => {
  const t = useTime();
  const w = 30 + 12 * Math.sin(t * 70);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {[-58, 58].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={-26} rx={46} ry={5} fill={C.ink} opacity={0.18} />
          <path d={`M${x - w},-26 L${x + w},-26`} stroke={C.ink2} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
          <rect x={x - 9} y={-22} width={18} height={14} rx={3} fill={C.steelDark} stroke={C.ink} strokeWidth={2.5} />
        </g>
      ))}
      <path d="M-66,-6 L66,-6" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <rect x={-28} y={-18} width={56} height={30} rx={6} fill={C.ink3} {...OL} />
      <path d="M-20,-4 L20,-4" {...thin(4, C.red, 0.9)} />
      <rect x={20} y={-14} width={16} height={16} rx={3} fill={C.ink2} stroke={C.ink} strokeWidth={2} />
      <circle cx={34} cy={-6} r={4} fill={C.cyan} />
      {/* warhead */}
      <path d="M-20,12 L40,12 L84,20 L40,28 L-20,28Z" fill={C.olive} {...OL} strokeWidth={2.5} />
      <path d="M-20,12 L-34,6 L-34,34 L-20,28" fill={C.oliveDark} {...OL} strokeWidth={2} />
      <path d="M0,12 L0,28 M24,12 L24,28" {...thin(1.5, C.ink, 0.5)} />
      <path d="M-34,-6 L-50,-30" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

/** Hexacopter bomber, side view, with release claw and finned grenade (class "bomb"). */
export const HexaSide: React.FC<Placed & { dropped?: boolean }> = ({ dropped = false, ...p }) => {
  const t = useTime();
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {[-120, -40, 40, 120].map((x, i) => {
        const w = 34 + 10 * Math.sin(t * 80 + i);
        return (
          <g key={x}>
            <path d={`M${x - w},-44 L${x + w},-44`} stroke={C.ink2} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
            <ellipse cx={x} cy={-44} rx={40} ry={4} fill={C.ink} opacity={0.15} />
            <rect x={x - 8} y={-40} width={16} height={12} rx={2} fill={C.steelDark} stroke={C.ink} strokeWidth={2.5} />
          </g>
        );
      })}
      <path d="M-120,-26 L120,-26" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      <path d="M-120,-26 L120,-26" stroke={C.steelDark} strokeWidth={4} strokeLinecap="round" />
      <path d="M-46,-24 C-46,-50 46,-50 46,-24 L40,2 L-40,2Z" fill={C.ink3} {...OL} />
      <path d="M-30,-36 C-10,-44 14,-44 30,-36" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} fill="none" />
      <circle cx={30} cy={-12} r={5} fill={C.red} opacity={blink(t, 0.9)} />
      <path d="M-36,2 L-58,40 M36,2 L58,40 M-70,40 L-44,40 M44,40 L70,40" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <path d="M-8,2 L-8,16 M8,2 L8,16" stroke={C.ink} strokeWidth={3} />
      {!dropped && <Bomb x={0} y={30} className="bomb" />}
    </g>
  );
};

export const Bomb: React.FC<Placed> = (p) => (
  <g transform={place(p)} className={p.className} opacity={p.opacity}>
    <path d="M-10,0 L10,0 L10,20 C10,34 -10,34 -10,20Z" fill={C.olive} {...OL} strokeWidth={2.5} />
    <path d="M-10,0 L-14,-10 L14,-10 L10,0" fill={C.oliveDark} {...OL} strokeWidth={2} />
    <path d="M-10,12 L10,12" {...thin(1.5, C.ink, 0.5)} />
  </g>
);
