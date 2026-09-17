import React from "react";
import { C } from "../design";
import { FPVSide, FPVTop, HexaSide, ReconDroneTop, ShahedTop, Bomb } from "../art/drones";
import { JammerMast, Refinery, TankSide, TankTop } from "../art/ground";
import { Explosion, Reticle, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, kf, prog, rnd, useTime } from "../lib/kf";
import { at } from "../lib/words";

const T = {
  recon: at("reconnaissance,", 50),
  correcting: at("correcting"),
  artillery: at("artillery", 53),
  fire: at("fire,"),
  strikes: at("strikes"),
  armored: at("armored"),
  vehicles: at("vehicles,", 55),
  dropping: at("dropping"),
  explosives: at("explosives,"),
  electronic: at("electronic"),
  warfare: at("warfare,"),
  longRange: at("long-range"),
  attacks: at("attacks"),
  infrastructure: at("infrastructure"),
  military: at("military", 62),
  installations: at("installations."),
  and: at("And", 63.5),
  moved: at("moved"),
  fast: at("fast"),
};
export const MISSIONS_RANGE = [T.recon - 0.4, T.fast + 0.6] as const;

const R = 175;

const Smoke: React.FC<{ x: number; y: number; t: number; n?: number; seed?: number }> = ({ x, y, t, n = 5, seed = 0 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const k = ((t * 0.6 + i / n + rnd(i, seed)) % 1 + 1) % 1;
      return <circle key={i} cx={x + Math.sin(i * 2 + t) * 10 + k * 30} cy={y - k * 120} r={12 + k * 26} fill="#55524E" stroke={C.ink} strokeWidth={2} opacity={0.75 * (1 - k)} />;
    })}
  </g>
);

const Ground: React.FC<{ y?: number; color?: string }> = ({ y = 95, color = "#8E8460" }) => (
  <g>
    <rect x={-R} y={-R} width={R * 2} height={R * 2} fill="url(#lens-sky)" />
    <rect x={-R} y={-R} width={R * 2} height={R * 2} fill="url(#pat-speck)" opacity={0.5} />
    <ellipse cx={-60} cy={-90} rx={70} ry={16} fill="#fff" opacity={0.12} />
    <ellipse cx={90} cy={-40} rx={50} ry={10} fill="#fff" opacity={0.1} />
    <rect x={-R} y={y} width={R * 2} height={R} fill={color} />
    <rect x={-R} y={y} width={R * 2} height={R} fill="url(#pat-mottle)" />
    <path d={`M${-R},${y} L${R},${y}`} stroke={C.ink} strokeWidth={4} />
  </g>
);

/* ---------- lens contents (local coords, centre 0,0, radius R) ---------- */

const ReconLens: React.FC<{ t: number }> = ({ t }) => {
  const k = ((t - T.recon) * 0.22) % 1;
  const x = -R - 60 + k * (R * 2 + 120);
  return (
    <g>
      <rect x={-R} y={-R} width={R * 2} height={R * 2} fill="#8A8566" />
      <rect x={-R} y={-R} width={R * 2} height={R * 2} fill="url(#pat-contours)" />
      <path d={`M${-R},60 C-40,20 40,110 ${R},30`} stroke="#B3A98A" strokeWidth={22} fill="none" />
      {[
        [-90, 40],
        [10, 70],
        [100, 30],
      ].map(([vx, vy], i) => (
        <g key={i}>
          <TankTop x={vx} y={vy} s={0.2} r={80 + i * 10} />
          {Math.abs(x - vx) < 70 && <Reticle x={vx} y={vy} size={56} lock={1} color={C.red} />}
        </g>
      ))}
      <circle cx={x} cy={40} r={70} fill={C.cyan} opacity={0.18} />
      <circle cx={x} cy={40} r={70} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="8 6" />
      <ReconDroneTop x={x - 20} y={-70} r={90} s={0.5} />
    </g>
  );
};

const ArtilleryLens: React.FC<{ t: number }> = ({ t }) => {
  const f1 = prog(t, T.correcting + 0.1, T.artillery + 0.1, "none");
  const splash = prog(t, T.artillery + 0.1, T.artillery + 0.9, "none");
  const corr = prog(t, T.artillery + 0.2, T.fire - 0.05, "power2.out");
  const f2 = prog(t, T.fire, T.strikes - 0.05, "none");
  const hit = prog(t, T.strikes - 0.05, T.strikes + 1.1, "none");
  const arc = (p: number, x1: number) => {
    const pts = Array.from({ length: 16 }, (_, i) => {
      const k = (i / 15) * p;
      const x = -120 + (x1 + 120) * k;
      const y = 60 - Math.sin(Math.PI * k) * 200;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return `M${pts.join(" L")}`;
  };
  return (
    <g>
      <Ground y={95} />
      {/* gun */}
      <g transform="translate(-120 95)">
        <path d="M0,-30 L70,-100" stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
        <path d="M0,-30 L70,-100" stroke={C.olive} strokeWidth={10} strokeLinecap="round" />
        <path d="M-40,0 L10,-34 L30,0" fill={C.oliveDark} stroke={C.ink} strokeWidth={4} />
        <circle cx={0} cy={-14} r={16} fill={C.ink2} stroke={C.ink} strokeWidth={4} />
      </g>
      <TankSide x={110} y={95} s={0.28} />
      {f1 > 0 && <path d={arc(f1, 30)} fill="none" stroke={C.cream} strokeWidth={4} strokeDasharray="10 8" />}
      {splash > 0 && splash < 1 && <circle cx={30} cy={85} r={10 + splash * 40} fill="#6A655E" opacity={1 - splash} stroke={C.ink} strokeWidth={2} />}
      {f2 > 0 && <path d={arc(f2, 110)} fill="none" stroke={C.amber} strokeWidth={5} strokeDasharray="12 8" />}
      {hit > 0 && hit < 1 && <Explosion x={110} y={70} p={hit} size={60} seed={2} />}
      {hit >= 0.5 && <Smoke x={110} y={60} t={t} n={4} />}
      {/* spotter drone with correction arrow */}
      <FPVTop x={60} y={-110} s={0.32} payload={false} />
      {corr > 0 && (
        <g opacity={corr * (1 - prog(t, T.strikes, T.strikes + 0.4))}>
          <path d="M60,-80 L40,60" stroke={C.cyan} strokeWidth={3} strokeDasharray="6 6" />
          <path d={`M30,70 L${30 + 72 * corr},70`} stroke={C.cyan} strokeWidth={6} />
          <path d={`M${30 + 72 * corr},58 L${46 + 72 * corr},70 L${30 + 72 * corr},82Z`} fill={C.cyan} />
        </g>
      )}
    </g>
  );
};

const StrikeLens: React.FC<{ t: number }> = ({ t }) => {
  const dive = prog(t, T.strikes, T.vehicles, "power2.in");
  const hit = prog(t, T.vehicles, T.vehicles + 1.1, "none");
  const x = kf(t, [
    [T.strikes, -140],
    [T.vehicles, 40, "power2.in"],
  ]);
  const y = kf(t, [
    [T.strikes, -130],
    [T.vehicles, 60, "power2.in"],
  ]);
  return (
    <g>
      <Ground y={105} color="#7F7A5A" />
      <TankSide x={40} y={105} s={0.5} />
      {hit < 0.2 && <FPVSide x={x} y={y} s={0.55} r={20 + dive * 25} />}
      {hit > 0 && hit < 1 && <Explosion x={40} y={60} p={hit} size={80} seed={6} />}
      {hit >= 0.45 && <Smoke x={30} y={40} t={t} n={6} seed={3} />}
    </g>
  );
};

const BombLens: React.FC<{ t: number }> = ({ t }) => {
  const drop = prog(t, T.explosives, T.explosives + 0.55, "power2.in");
  const hit = prog(t, T.explosives + 0.55, T.explosives + 1.6, "none");
  const hover = Math.sin(t * 2.2) * 6;
  return (
    <g>
      <Ground y={100} color="#857C58" />
      <path d={`M${-R},100 L-80,100 L-66,128 L40,128 L54,100 L${R},100`} fill="#5E563C" stroke={C.ink} strokeWidth={4} />
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={i} cx={-100 + i * 36 + (i > 2 ? 60 : 0)} cy={92} rx={18} ry={9} fill="#A89B70" stroke={C.ink} strokeWidth={2.5} />
      ))}
      <HexaSide x={0} y={-90 + hover} s={0.5} dropped={drop > 0} />
      {drop > 0 && hit <= 0 && <Bomb x={0} y={-75 + hover + drop * 190} s={0.9} />}
      {hit > 0 && hit < 1 && <Explosion x={0} y={110} p={hit} size={70} seed={9} />}
      {hit >= 0.45 && <Smoke x={-10} y={100} t={t} n={5} seed={5} />}
    </g>
  );
};

const EWLens: React.FC<{ t: number }> = ({ t }) => {
  const jam = prog(t, T.electronic - 0.1, T.electronic + 0.4);
  const fall = prog(t, T.warfare + 0.2, T.warfare + 1.4, "power2.in");
  const wob = jam * (1 - fall) * Math.sin(t * 22) * 12;
  return (
    <g>
      <Ground y={115} color="#80805E" />
      <JammerMast x={-100} y={115} s={0.55} />
      {jam > 0 &&
        Array.from({ length: 4 }, (_, i) => {
          const k = ((t * 1.2 + i / 4) % 1 + 1) % 1;
          return <path key={i} d={`M${-86 + k * 150},${-60 - k * 60} a${40 + k * 90},${60 + k * 110} 0 0 1 0,${120 + k * 220}`} fill="none" stroke={C.cyan} strokeWidth={5} opacity={(1 - k) * jam} transform={`rotate(-18 -86 -60)`} />;
        })}
      <g transform={`translate(${70 + fall * 20} ${-70 + fall * 190}) rotate(${wob + fall * 220})`}>
        <FPVTop s={0.35} payload={false} />
      </g>
      {jam > 0.5 && fall < 0.3 && (
        <g transform="translate(120 -150)">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 12} y={-i * 8} width={8} height={10 + i * 8} fill={C.cream} stroke={C.ink} strokeWidth={2} />
          ))}
          <path d="M-6,-34 L50,14 M50,-34 L-6,14" stroke={C.red} strokeWidth={7} strokeLinecap="round" />
        </g>
      )}
      {fall >= 1 && <Smoke x={90} y={110} t={t} n={3} seed={8} />}
    </g>
  );
};

const LongRangeLens: React.FC<{ t: number }> = ({ t }) => {
  const fly1 = prog(t, T.longRange, T.infrastructure + 0.3, "power1.inOut");
  const hit1 = prog(t, T.infrastructure + 0.3, T.infrastructure + 1.4, "none");
  const fly2 = prog(t, T.infrastructure + 0.4, T.installations + 0.1, "power1.inOut");
  const hit2 = prog(t, T.installations + 0.1, T.installations + 1.2, "none");
  const path = (p: number, x1: number, y1: number) => {
    const x = -150 + (x1 + 150) * p;
    const y = -40 + (y1 + 40) * p - Math.sin(Math.PI * p) * 110;
    return { x, y };
  };
  const trail = (p: number, x1: number, y1: number) =>
    `M${Array.from({ length: 20 }, (_, i) => {
      const q = path((i / 19) * p, x1, y1);
      return `${q.x.toFixed(1)},${q.y.toFixed(1)}`;
    }).join(" L")}`;
  const h1 = path(fly1, 60, 70);
  const h2 = path(fly2, -40, 110);
  const h1b = path(Math.max(0, fly1 - 0.02), 60, 70);
  const h2b = path(Math.max(0, fly2 - 0.02), -40, 110);
  return (
    <g>
      <rect x={-R} y={-R} width={R * 2} height={R * 2} fill="#7E7A5E" />
      <rect x={-R} y={-R} width={R * 2} height={R * 2} fill="url(#pat-contours)" />
      <Refinery x={80} y={100} s={0.42} />
      {/* military installation: hangar + flag */}
      <g transform="translate(-60 130)">
        <path d="M-50,0 L-50,-26 A50,34 0 0 1 50,-26 L50,0Z" fill={C.steelDark} stroke={C.ink} strokeWidth={4} />
        <rect x={-18} y={-26} width={36} height={26} fill={C.ink3} />
        <path d="M70,0 L70,-70" stroke={C.ink} strokeWidth={4} />
        <path d="M70,-70 L102,-60 L70,-50Z" fill={C.red} stroke={C.ink} strokeWidth={2} />
      </g>
      {fly1 > 0 && <path d={trail(fly1, 60, 70)} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="10 7" />}
      {fly1 > 0 && fly1 < 1 && <ShahedTop x={h1.x} y={h1.y} r={(Math.atan2(h1.y - h1b.y, h1.x - h1b.x) * 180) / Math.PI + 90} s={0.13} detail={false} />}
      {hit1 > 0 && hit1 < 1 && <Explosion x={60} y={50} p={hit1} size={70} seed={12} />}
      {hit1 >= 0.45 && <Smoke x={60} y={30} t={t} n={4} seed={13} />}
      {fly2 > 0 && <path d={trail(fly2, -40, 110)} fill="none" stroke={C.red} strokeWidth={4} strokeDasharray="10 7" />}
      {fly2 > 0 && fly2 < 1 && <ShahedTop x={h2.x} y={h2.y} r={(Math.atan2(h2.y - h2b.y, h2.x - h2b.x) * 180) / Math.PI + 90} s={0.13} detail={false} />}
      {hit2 > 0 && hit2 < 1 && <Explosion x={-60} y={100} p={hit2} size={70} seed={14} />}
      <circle cx={-150} cy={-40} r={9} fill={C.amber} stroke={C.ink} strokeWidth={3} />
    </g>
  );
};

const LENSES = [
  { C: ReconLens, t0: T.recon, label: "RECON", x: 460, y: 300 },
  { C: ArtilleryLens, t0: T.correcting, label: "ARTILLERY SPOTTING", x: 960, y: 300 },
  { C: StrikeLens, t0: T.strikes, label: "ANTI-ARMOR STRIKES", x: 1460, y: 300 },
  { C: BombLens, t0: T.dropping, label: "BOMB DROPS", x: 460, y: 730 },
  { C: EWLens, t0: T.electronic, label: "ELECTRONIC WARFARE", x: 960, y: 730 },
  { C: LongRangeLens, t0: T.longRange, label: "LONG-RANGE STRIKES", x: 1460, y: 730 },
];

export const Missions: React.FC = () => {
  const t = useTime();
  if (t < MISSIONS_RANGE[0] || t > MISSIONS_RANGE[1]) return null;
  const collapse = prog(t, T.moved - 0.2, T.fast + 0.1, "power3.in");
  return (
    <Stage>
      <defs>
        <linearGradient id="lens-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3C565B" />
          <stop offset="70%" stopColor="#7A938A" />
          <stop offset="100%" stopColor="#A7AE92" />
        </linearGradient>
      </defs>
      {collapse > 0.05 &&
        Array.from({ length: 18 }, (_, i) => {
          const a = (i / 18) * Math.PI * 2;
          const r0 = 900 - collapse * 700;
          return <path key={i} d={`M${960 + Math.cos(a) * r0},${540 + Math.sin(a) * r0} L${960 + Math.cos(a) * (r0 + 160)},${540 + Math.sin(a) * (r0 + 160)}`} stroke={C.cream} strokeWidth={5} opacity={collapse * (1 - collapse) * 2.5} strokeLinecap="round" />;
        })}
      {LENSES.map((L, i) => {
        const pop = ease("back.out(1.7)")(clamp01((t - L.t0 + 0.3) / 0.55));
        if (pop <= 0) return null;
        const x = L.x + (960 - L.x) * collapse;
        const y = L.y + (540 - L.y) * collapse;
        const s = pop * (1 - collapse);
        const id = `lens-${i}`;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${-collapse * 90}) scale(${Math.max(0.001, s)})`}>
            <defs>
              <clipPath id={id}>
                <circle r={R} />
              </clipPath>
            </defs>
            <circle r={R + 16} fill={C.ink} />
            <g clipPath={`url(#${id})`}>
              <L.C t={t} />
            </g>
            <circle r={R + 6} fill="none" stroke={C.amber} strokeWidth={8} />
            {Array.from({ length: 24 }, (_, k) => {
              const a = (k / 24) * Math.PI * 2 + t * 0.2;
              return <path key={k} d={`M${Math.cos(a) * (R + 12)},${Math.sin(a) * (R + 12)} L${Math.cos(a) * (R + 20)},${Math.sin(a) * (R + 20)}`} stroke={C.ink} strokeWidth={3} />;
            })}
            {collapse < 0.2 && <Tag x={0} y={R + 44} text={L.label} p={prog(t, L.t0, L.t0 + 0.8, "none") * (1 - collapse * 5)} size={28} accent={C.amber} />}
          </g>
        );
      })}
    </Stage>
  );
};
