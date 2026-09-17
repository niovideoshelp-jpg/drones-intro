import React from "react";
import { C } from "../design";
import { useTime } from "../lib/kf";
import { Box, Cyl, ISO_MATRIX, Line3, Plot, Post, iso, pts, shade } from "./iso";
import { OL, Placed, blink, place, thin } from "./style";

const GRASS = "#8E9A5B";
const GRAVEL = "#B9B19A";

/** Empty field with ploughed rows, fence and a lone tree. */
export const Field: React.FC<Placed> = (p) => {
  const t = useTime();
  const sway = Math.sin(t * 1.6) * 2;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <Plot w={220} d={220} color="#A38F5E" />
      <g transform={ISO_MATRIX}>
        {Array.from({ length: 10 }, (_, i) => -99 + i * 22).map((x) => (
          <path key={x} d={`M${x},-104 L${x},104`} stroke="#6E5E36" strokeWidth={6} strokeLinecap="round" opacity={0.55} />
        ))}
        {Array.from({ length: 10 }, (_, i) => -99 + i * 22).map((x) => (
          <path key={`g${x}`} d={`M${x + 5},-100 L${x + 5},100`} stroke={GRASS} strokeWidth={2} strokeDasharray="3 9" opacity={0.9} />
        ))}
      </g>
      {Array.from({ length: 6 }, (_, i) => -100 + i * 40).map((v) => (
        <Post key={`a${v}`} x={v} y={-104} h={22} color="#6B5433" width={4} />
      ))}
      {Array.from({ length: 6 }, (_, i) => -100 + i * 40).map((v) => (
        <Post key={`b${v}`} x={-104} y={v} h={22} color="#6B5433" width={4} />
      ))}
      <Line3 a={[-100, -104, 16]} b={[100, -104, 16]} color="#6B5433" width={2} />
      <Line3 a={[-104, -100, 16]} b={[-104, 100, 16]} color="#6B5433" width={2} />
      {(() => {
        const [tx, ty] = iso(60, 40, 0);
        return (
          <g transform={`translate(${tx} ${ty})`}>
            <ellipse cx={10} cy={4} rx={34} ry={12} fill={C.ink} opacity={0.2} />
            <path d="M-4,0 L-3,-44 L3,-44 L4,0Z" fill="#5B4430" {...OL} strokeWidth={2} />
            <g transform={`rotate(${sway} 0 -44)`}>
              <circle cx={0} cy={-70} r={30} fill="#58703A" {...OL} strokeWidth={2.5} />
              <circle cx={-18} cy={-54} r={18} fill="#58703A" {...OL} strokeWidth={2.5} />
              <circle cx={18} cy={-52} r={18} fill="#4C6232" {...OL} strokeWidth={2.5} />
              <circle cx={-8} cy={-80} r={10} fill="#7A9150" />
            </g>
          </g>
        );
      })()}
    </g>
  );
};

/** Electrical substation: transformers, bushings, gantries, busbars. */
export const Substation: React.FC<Placed> = (p) => {
  const t = useTime();
  const gantry = (x: number) => (
    <g>
      <Post x={x} y={-80} h={120} color={C.steelDark} width={5} />
      <Post x={x} y={70} h={120} color={C.steelDark} width={5} />
      <Line3 a={[x, -80, 120]} b={[x, 70, 120]} color={C.steelDark} width={5} />
      {[-80, -30, 20, 70].slice(0, 3).map((y, i) => (
        <Line3 key={y} a={[x, y, i % 2 ? 120 : 100]} b={[x, y + 50, i % 2 ? 100 : 120]} color={C.steelDark} width={2} />
      ))}
      {[-40, 0, 40].map((y) => (
        <g key={y}>
          <Line3 a={[x, y, 120]} b={[x, y, 104]} color="#8A3B2A" width={5} />
        </g>
      ))}
    </g>
  );
  const bush = (x: number, y: number, z: number) => {
    const [a, b] = iso(x, y, z);
    return (
      <g key={`${x}${y}`}>
        <path d={`M${a},${b} L${a},${b - 34}`} stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
        <path d={`M${a},${b} L${a},${b - 34}`} stroke="#8A3B2A" strokeWidth={6} strokeLinecap="round" />
        {[6, 14, 22, 30].map((k) => (
          <ellipse key={k} cx={a} cy={b - k} rx={6.5} ry={2.4} fill="#A94E37" stroke={C.ink} strokeWidth={1} />
        ))}
        <circle cx={a} cy={b - 36} r={3.5} fill={C.steelLight} stroke={C.ink} strokeWidth={1.5} />
      </g>
    );
  };
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <Plot w={230} d={220} color={GRAVEL} />
      {gantry(-95)}
      <Box x={-40} y={-80} z={0} w={70} d={60} h={14} color="#9C9F98" />
      <Box x={-40} y={10} z={0} w={70} d={60} h={14} color="#9C9F98" />
      <Box x={-30} y={-72} z={14} w={50} d={44} h={46} color="#7F8A86" />
      <Box x={-30} y={18} z={14} w={50} d={44} h={46} color="#7F8A86" />
      {[-66, 24].map((y) => (
        <g key={y}>
          {[0, 6, 12, 18, 24, 30, 36].map((k) => (
            <Line3 key={k} a={[22, y + 2 + k, 18]} b={[22, y + 2 + k, 56]} color={C.ink} width={1.2} />
          ))}
        </g>
      ))}
      {[-62, -50, -38].map((y) => bush(-10, y, 60))}
      {[28, 40, 52].map((y) => bush(-10, y, 60))}
      <Line3 a={[-10, -50, 96]} b={[-95, -40, 108]} color={C.ink} width={1.6} />
      <Line3 a={[-10, 40, 96]} b={[-95, 40, 108]} color={C.ink} width={1.6} />
      {gantry(80)}
      <Line3 a={[80, -40, 104]} b={[-10, -38, 96]} color={C.ink} width={1.6} />
      <Line3 a={[80, 40, 104]} b={[-10, 52, 96]} color={C.ink} width={1.6} />
      {/* fence */}
      {Array.from({ length: 9 }, (_, i) => -110 + i * 27.5).map((x) => (
        <Post key={x} x={x} y={110} h={26} color={C.steelDark} width={2.5} />
      ))}
      <Line3 a={[-110, 110, 24]} b={[110, 110, 24]} color={C.steelDark} width={1.5} />
      <Line3 a={[-110, 110, 12]} b={[110, 110, 12]} color={C.steelDark} width={1} />
      {(() => {
        const [a, b] = iso(30, 100, 20);
        return (
          <g transform={`translate(${a} ${b})`}>
            <polygon points="0,-10 9,0 0,10 -9,0" fill={C.amber} stroke={C.ink} strokeWidth={1.5} />
            <path d="M1,-6 L-3,1 L1,1 L-1,6" stroke={C.ink} strokeWidth={1.5} fill="none" />
          </g>
        );
      })()}
      <circle cx={iso(80, 70, 120)[0]} cy={iso(80, 70, 120)[1] - 6} r={3.5} fill={C.red} opacity={blink(t, 1.4, 0.3)} />
    </g>
  );
};

/** Ammunition depot: earth-covered igloo bunker, crates, hazard sign. */
export const AmmoDepot: React.FC<Placed> = (p) => {
  const arc = (y: number) =>
    Array.from({ length: 13 }, (_, i) => {
      const a = (Math.PI * i) / 12;
      return [-30 + 60 * Math.cos(a) * -1, y, 58 * Math.sin(a)] as [number, number, number];
    });
  const back = arc(-90);
  const front = arc(40);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <Plot w={230} d={220} color="#9C9A6C" />
      <polygon points={pts([...back, ...[...front].reverse()])} fill="#6F7D45" stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" />
      {back.slice(0, -1).map((pt, i) => (
        <polygon key={i} points={pts([pt, back[i + 1], front[i + 1], front[i]])} fill={shade("#7D8B4F", -0.25 + (i / 12) * 0.4)} stroke={C.ink} strokeOpacity={0.25} strokeWidth={1} />
      ))}
      <polygon points={pts(front)} fill="#A7A08A" stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" />
      <polygon points={pts([[-50, 40, 0], [-10, 40, 0], [-10, 40, 40], [-50, 40, 40]])} fill={C.ink3} stroke={C.ink} strokeWidth={2} />
      <polygon points={pts([[-48, 40, 0], [-30, 40, 0], [-30, 40, 38], [-48, 40, 38]])} fill="#5E6A6A" />
      <Line3 a={[-30, 40, 0]} b={[-30, 40, 40]} color={C.ink} width={1.5} />
      {/* crates */}
      {[
        [40, 40, 0],
        [40, 72, 0],
        [72, 40, 0],
        [40, 40, 26],
      ].map(([x, y, z], i) => (
        <g key={i}>
          <Box x={x} y={y} z={z} w={30} d={30} h={26} color="#8A7A4A" />
          <Line3 a={[x, y + 30, z + 13]} b={[x + 30, y + 30, z + 13]} color={C.amber} width={3} />
          <Line3 a={[x + 30, y, z + 13]} b={[x + 30, y + 30, z + 13]} color={C.amberDark} width={3} />
        </g>
      ))}
      {(() => {
        const [a, b] = iso(90, -40, 0);
        return (
          <g transform={`translate(${a} ${b})`}>
            <path d="M0,0 L0,-46" stroke={C.ink} strokeWidth={4} />
            <polygon points="0,-78 20,-58 0,-38 -20,-58" fill="#F07A1F" stroke={C.ink} strokeWidth={2.5} />
            <circle cx={0} cy={-56} r={6} fill={C.ink} />
            <path d="M3,-61 L8,-67" stroke={C.ink} strokeWidth={2} />
          </g>
        );
      })()}
    </g>
  );
};

/** Air base: runway with markings, hangar, parked jet, tower. */
export const AirBase: React.FC<Placed> = (p) => {
  const t = useTime();
  const hangar = Array.from({ length: 13 }, (_, i) => {
    const a = (Math.PI * i) / 12;
    return [60 * Math.cos(a), 0, 44 * Math.sin(a)] as [number, number, number];
  });
  const hx = (list: [number, number, number][], y: number) => list.map(([x, , z]) => [x - 40, y, z] as [number, number, number]);
  const hb = hx(hangar, -100);
  const hf = hx(hangar, -30);
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      <Plot w={240} d={230} color={GRASS} />
      <g transform={ISO_MATRIX}>
        <rect x={40} y={-115} width={50} height={230} fill="#4B504F" stroke={C.ink} strokeWidth={2.4} />
        {Array.from({ length: 7 }, (_, i) => -100 + i * 32).map((y) => (
          <rect key={y} x={63} y={y} width={4} height={16} fill={C.cream} />
        ))}
        {[-108, 96].map((y) => (
          <g key={y}>
            {[46, 54, 76, 84].map((x) => (
              <rect key={x} x={x} y={y} width={4} height={10} fill={C.cream} />
            ))}
          </g>
        ))}
        <rect x={-10} y={10} width={50} height={60} fill="#7B7F78" stroke={C.ink} strokeWidth={1.8} />
        {/* parked jet (top view on the ground plane) */}
        <g transform="translate(14 42) rotate(90)">
          <path d="M0,-30 C4,-30 5,-22 5,-14 L22,4 L22,9 L5,4 L4,18 L11,24 L11,27 L0,25 L-11,27 L-11,24 L-4,18 L-5,4 L-22,9 L-22,4 L-5,-14 C-5,-22 -4,-30 0,-30Z" fill={C.steel} stroke={C.ink} strokeWidth={1.8} />
        </g>
      </g>
      <polygon points={pts([...hb, ...[...hf].reverse()])} fill={C.steelDark} stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" />
      {hb.slice(0, -1).map((pt, i) => (
        <polygon key={i} points={pts([pt, hb[i + 1], hf[i + 1], hf[i]])} fill={shade("#8C9594", -0.3 + (i / 12) * 0.45)} stroke={C.ink} strokeOpacity={0.3} strokeWidth={1} />
      ))}
      <polygon points={pts(hf)} fill="#B8BDB9" stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" />
      <polygon points={pts([[-70, -30, 0], [-10, -30, 0], [-10, -30, 34], [-70, -30, 34]])} fill={C.ink3} opacity={0.85} />
      <Box x={-90} y={50} z={0} w={24} d={24} h={70} color="#B7AE95" />
      <Box x={-94} y={46} z={70} w={32} d={32} h={16} color="#6FA6B8" top="#D8D2C0" />
      <circle cx={iso(-78, 62, 92)[0]} cy={iso(-78, 62, 92)[1]} r={4} fill={C.red} opacity={blink(t, 1.2, 0.3)} />
    </g>
  );
};

/** AESA ground radar on a rotating pedestal. `turn` in degrees. */
export const RadarAESA: React.FC<Placed & { turn?: number; plot?: boolean }> = ({ turn, plot = true, ...p }) => {
  const t = useTime();
  const th = ((turn ?? Math.sin(t * 0.9) * 40) * Math.PI) / 180;
  const sx = Math.cos(th);
  const cols = 9;
  const rows = 7;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {plot && <Plot w={200} d={200} color={GRAVEL} />}
      <Cyl x={0} y={0} z={0} r={46} h={26} color="#5B6262" />
      <Cyl x={0} y={0} z={26} r={30} h={30} color="#474D4D" />
      <g transform={`translate(0 -70) scale(${Math.max(0.08, Math.abs(sx))} 1)`}>
        <path d="M-50,10 L-40,-40 M50,10 L40,-40" stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
        <path d="M-50,10 L-40,-40 M50,10 L40,-40" stroke="#5B6262" strokeWidth={7} strokeLinecap="round" />
        <g transform="rotate(-14 0 -80)">
          <rect x={-96} y={-196} width={192} height={150} rx={10} fill={sx > 0 ? "#3A3F40" : "#2B2F30"} {...OL} strokeWidth={4} />
          {sx > 0 ? (
            <>
              <rect x={-84} y={-184} width={168} height={126} rx={4} fill="#C9CDCB" stroke={C.ink} strokeWidth={2} />
              {Array.from({ length: cols - 1 }, (_, i) => -84 + ((i + 1) * 168) / cols).map((x) => (
                <path key={x} d={`M${x},-184 L${x},-58`} {...thin(1.2, C.ink, 0.45)} />
              ))}
              {Array.from({ length: rows - 1 }, (_, i) => -184 + ((i + 1) * 126) / rows).map((y) => (
                <path key={y} d={`M-84,${y} L84,${y}`} {...thin(1.2, C.ink, 0.45)} />
              ))}
              <path d="M-80,-180 L20,-180" stroke="#fff" strokeOpacity={0.6} strokeWidth={4} />
            </>
          ) : (
            <path d="M-80,-170 L80,-170 M-80,-120 L80,-120 M-80,-70 L80,-70" {...thin(3, C.steelDark, 0.8)} />
          )}
        </g>
      </g>
      <circle cx={0} cy={-280} r={4} fill={C.red} opacity={blink(t, 1, 0.25)} />
    </g>
  );
};
