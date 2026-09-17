import React from "react";
import { C } from "../design";
import { useTime } from "../lib/kf";
import { OL, Placed, place, thin } from "./style";

const SKIN = "#C99A74";
const SKIN_D = "#A87A57";
const UNIFORM = "#6B7148";
const UNIFORM_D = "#50553A";

/** Air-defence commander seated at a console, facing left (-x). Feet at y≈60, head top ≈ -300. */
export const Commander: React.FC<Placed & { glow?: number; head?: number }> = ({ glow = 1, head = 0, ...p }) => {
  const t = useTime();
  const breathe = Math.sin(t * 1.8) * 2;
  return (
    <g transform={place(p)} className={p.className} opacity={p.opacity}>
      {/* chair */}
      <path d="M-40,110 L100,110 M30,110 L30,40" stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <circle cx={-40} cy={114} r={9} fill={C.ink2} />
      <circle cx={100} cy={114} r={9} fill={C.ink2} />
      <rect x={-50} y={16} width={130} height={26} rx={10} fill={C.ink3} {...OL} />
      <path d="M72,30 C86,-40 94,-120 90,-190" stroke={C.ink} strokeWidth={14} strokeLinecap="round" fill="none" />
      <rect x={70} y={-210} width={46} height={170} rx={20} fill={C.ink3} {...OL} transform="rotate(8 93 -125)" />
      {/* legs */}
      <path d="M40,20 L-110,24 L-126,112" stroke={C.ink} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M40,20 L-110,24 L-126,112" stroke={UNIFORM_D} strokeWidth={38} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-156,110 L-96,110 C-90,110 -88,128 -96,128 L-162,128 C-172,128 -170,110 -156,110Z" fill={C.ink2} {...OL} strokeWidth={2.5} />
      {/* torso */}
      <g transform={`translate(0 ${breathe * 0.4})`}>
        <path d="M-58,-190 C-20,-206 44,-204 62,-178 L66,-10 C60,26 -40,30 -46,-8 C-60,-60 -74,-150 -58,-190Z" fill={UNIFORM} {...OL} />
        <path d="M40,-180 L50,-14" stroke={UNIFORM_D} strokeWidth={16} strokeLinecap="round" opacity={0.7} />
        <rect x={-44} y={-26} width={104} height={14} fill={C.ink3} stroke={C.ink} strokeWidth={2} />
        <rect x={-6} y={-24} width={14} height={10} fill={C.amber} />
        <path d="M-44,-150 L-12,-150 L-12,-118 L-44,-118Z" {...thin(2, C.ink, 0.5)} />
        <rect x={-2} y={-176} width={30} height={18} rx={2} fill="#7C8A54" stroke={C.ink} strokeWidth={1.5} />
        <path d="M2,-167 L24,-167" stroke={C.amber} strokeWidth={3} />
        {/* neck + head */}
        <rect x={-26} y={-222} width={32} height={36} fill={SKIN_D} stroke={C.ink} strokeWidth={2.5} />
        <path d="M-40,-196 L-16,-184 L8,-198" fill="none" stroke={UNIFORM_D} strokeWidth={10} strokeLinejoin="round" />
        <g transform={`rotate(${head} -10 -210)`}>
          <path d="M-8,-316 C34,-316 48,-286 44,-252 C42,-226 26,-208 0,-206 L-22,-206 C-30,-214 -32,-222 -40,-226 L-56,-230 C-60,-236 -52,-244 -52,-248 L-60,-258 C-58,-266 -50,-268 -50,-276 C-50,-302 -34,-316 -8,-316Z" fill={SKIN} {...OL} />
          <path d="M-52,-282 C-52,-318 30,-330 46,-280 C38,-290 10,-296 -8,-292 C-26,-290 -40,-282 -52,-282Z" fill={C.ink2} stroke={C.ink} strokeWidth={2.5} />
          <circle cx={-34} cy={-266} r={3.5} fill={C.ink} />
          <path d="M-44,-280 L-26,-282" stroke={C.ink} strokeWidth={3} strokeLinecap="round" />
          {/* headset */}
          <path d="M6,-262 C4,-330 -40,-326 -30,-300" stroke={C.ink} strokeWidth={9} fill="none" strokeLinecap="round" />
          <circle cx={8} cy={-258} r={22} fill={C.ink3} {...OL} strokeWidth={3} />
          <circle cx={8} cy={-258} r={9} fill={C.steelDark} />
          <path d="M-4,-242 C-20,-224 -40,-222 -58,-230" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
          <circle cx={-60} cy={-230} r={7} fill={C.ink2} />
          {/* screen glow on face */}
          <path d="M-54,-276 C-52,-250 -46,-232 -28,-212" stroke={C.cyan} strokeWidth={5} fill="none" opacity={0.55 * glow} strokeLinecap="round" />
        </g>
        {/* arm to console */}
        <path d="M10,-176 L-40,-86 L-150,-96" stroke={C.ink} strokeWidth={42} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M10,-176 L-40,-86 L-150,-96" stroke={UNIFORM} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M-150,-96 L-178,-98" stroke={SKIN} strokeWidth={26} strokeLinecap="round" />
      </g>
      {/* console desk */}
      <path d="M-330,-74 L-120,-74 L-120,-58 L-330,-58Z" fill={C.steelDark} {...OL} />
      <path d="M-300,-58 L-300,120 M-150,-58 L-150,120" stroke={C.ink} strokeWidth={8} />
      <rect x={-238} y={-96} width={80} height={22} rx={4} fill={C.ink3} stroke={C.ink} strokeWidth={2.5} />
      <circle cx={-182} cy={-96} r={14} fill={C.red} stroke={C.ink} strokeWidth={2.5} />
      <path d="M-230,-86 L-170,-86" stroke={C.cyan} strokeWidth={2} opacity={0.6} />
    </g>
  );
};
