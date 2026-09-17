import React from "react";
import { C, F } from "../design";
import { ShahedTop } from "../art/drones";
import { MissileSide } from "../art/ground";
import { AirBase, RadarAESA, Substation } from "../art/targets";
import { Balance, Explosion, PriceTag, Pulse, StrikeLine, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, kf, prog, rnd, useTime, win } from "../lib/kf";
import { at } from "../lib/words";

const T = {
  looking: at("Looking"),
  numbers: at("numbers", 133),
  alone: at("alone,"),
  first: at("first"),
  absurd: at("absurd,"),
  weapon: at("weapon"),
  dozens: at("dozens"),
  expensive: at("expensive"),
  destroy: at("destroy"),
  cheap: at("cheap"),
  target: at("target."),
  but: at("But", 142.5),
  not: at("not", 143.5),
  math: at("math"),
  unit: at("unit"),
  commander: at("commander", 147),
  price1: at("price", 149),
  drone1: at("drone", 149.5),
  price2: at("price", 150.4),
  missile: at("missile,", 151),
  hes: at("he's"),
  cost: at("cost", 152.5),
  intercept: at("intercept", 153),
  damage: at("damage"),
  drone2: at("drone", 155),
  makes: at("makes"),
  through: at("through.", 157),
  right: at("right", 158.3),
  space: at("space"),
  between: at("between", 160.3),
  two: at("two", 161.3),
  that: at("that", 162.9),
  biggest: at("biggest"),
  problems: at("problems"),
  taking: at("taking"),
  shape: at("shape."),
  and3: at("And", 166.9),
  worth: at("worth"),
};
export const MATH_RANGE = [T.looking - 0.2, T.worth + 1.0] as const;

/** Points along a question-mark glyph centred at (0,0), height ~520. */
const QUESTION = (() => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 26; i++) {
    const a = Math.PI * 1.05 - (i / 26) * Math.PI * 1.55;
    pts.push([Math.cos(a) * 150, -120 - Math.sin(a) * 140]);
  }
  const hook = pts[pts.length - 1];
  for (let i = 1; i <= 9; i++) {
    const k = i / 9;
    pts.push([hook[0] + (0 - hook[0]) * k, hook[1] + (90 - hook[1]) * k]);
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    pts.push([Math.cos(a) * 30, 210 + Math.sin(a) * 30]);
  }
  pts.push([0, 210]);
  // second strand offset inward/outward so the glyph reads bold
  const strand = pts.slice(0, 36).map(([x, y], i) => {
    const [nx, ny] = pts[Math.min(35, i + 1)];
    const dx = nx - x;
    const dy = ny - y;
    const len = Math.hypot(dx, dy) || 1;
    return [x - (dy / len) * 34, y + (dx / len) * 34] as [number, number];
  });
  return [...pts, ...strand];
})();

const Card: React.FC<{ x: number; y: number; flip: number; s: number; glow?: number; front: React.ReactNode; back: React.ReactNode; accent: string; backAccent: string }> = ({
  x,
  y,
  flip,
  s,
  glow = 0,
  front,
  back,
  accent,
  backAccent,
}) => {
  const k = Math.cos(flip * Math.PI);
  const showBack = flip > 0.5;
  const col = showBack ? backAccent : accent;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * Math.max(0.02, Math.abs(k))} ${s})`}>
      {glow > 0 && <rect x={-290} y={-330} width={580} height={660} rx={30} fill="none" stroke={col} strokeWidth={14} opacity={glow * 0.6} />}
      <rect x={-260} y={-300} width={520} height={600} rx={22} fill={C.ink} fillOpacity={0.92} stroke={col} strokeWidth={8} />
      <rect x={-260} y={-300} width={520} height={600} rx={22} fill="url(#pat-mottle)" opacity={0.6} />
      {showBack ? back : front}
    </g>
  );
};

export const TheMath: React.FC = () => {
  const t = useTime();
  if (t < MATH_RANGE[0] || t > MATH_RANGE[1]) return null;

  /* ---------------- balance ---------------- */
  const balIn = ease("back.out(1.3)")(clamp01((t - T.looking - 0.1) / 0.7));
  const balOut = prog(t, T.math + 0.2, T.unit + 0.2, "power3.in");
  const stack = Math.floor(clamp01((t - T.dozens + 0.1) / (T.destroy - T.dozens)) * 32);
  const tilt =
    kf(t, [
      [T.numbers - 0.2, 0],
      [T.alone + 0.2, 24, "elastic.out(1, 0.5)"],
      [T.dozens, 24],
      [T.destroy, 4, "power1.inOut"],
    ]) + (t > T.absurd && t < T.absurd + 0.6 ? Math.sin((t - T.absurd) * 50) * 3 * (1 - (t - T.absurd) / 0.6) : 0);
  const missileDrop = ease("bounce.out")(clamp01((t - T.numbers + 0.2) / 0.6));
  const droneDrop = ease("bounce.out")(clamp01((t - T.numbers) / 0.6));
  const strike1 = prog(t, T.not - 0.05, T.not + 0.35, "power2.out");
  const strike2 = prog(t, T.not + 0.3, T.math + 0.1, "power2.out");

  /* ---------------- cards ---------------- */
  const cardsIn = ease("back.out(1.4)")(clamp01((t - T.commander + 0.1) / 0.7));
  const flipL = prog(t, T.hes, T.cost + 0.1, "power2.inOut");
  const flipR = prog(t, T.intercept + 0.25, T.damage + 0.2, "power2.inOut");
  const apart = prog(t, T.right - 0.1, T.space, "power3.inOut");
  const cardsOut = prog(t, T.worth - 0.2, T.worth + 0.8, "power3.in");
  const lx = 560 - 180 * apart;
  const rx = 1360 + 180 * apart;
  const cs = cardsIn * (1 - 0.18 * apart) * (1 - cardsOut);
  const grow = prog(t, T.makes, T.through + 0.4, "back.out(2)");
  const dmgBoom = prog(t, T.through - 0.1, T.through + 1.1, "none");
  const pulseTwo = win(t, T.two - 0.1, T.two + 0.9, 0.2, 0.6);

  const cheapDrone = (
    <g>
      <Tag x={0} y={-230} text="DRONE" p={prog(t, T.drone1 - 0.2, T.drone1 + 0.4, "none")} size={40} accent={C.red} />
      <ShahedTop y={-10} s={0.72} r={Math.sin(t * 1.5) * 4} />
      <PriceTag x={-70} y={210} text="$" size={64} color={C.green} s={prog(t, T.price1 - 0.1, T.price1 + 0.3, "back.out(2)")} />
    </g>
  );
  const missileFront = (
    <g>
      <Tag x={0} y={-230} text="MISSILE" p={prog(t, T.price2 - 0.1, T.missile + 0.3, "none")} size={40} accent={C.amber} />
      <MissileSide y={-10} r={-35} s={0.95} flame={0} />
      <PriceTag x={-120} y={210} text="$1M" size={64} color={C.amber} s={prog(t, T.price2 - 0.1, T.price2 + 0.3, "back.out(2)")} />
    </g>
  );
  const interceptBack = (
    <g>
      <Tag x={0} y={-230} text="INTERCEPT COST" p={prog(t, T.cost, T.intercept + 0.4, "none")} size={38} accent={C.amber} />
      <MissileSide y={-10} r={-35} s={0.95} flame={0.7} />
      <PriceTag x={-120} y={210} text="$1M" size={64} color={C.amber} />
    </g>
  );
  const damageBack = (
    <g>
      <Tag x={0} y={-230} text="DAMAGE" p={prog(t, T.damage - 0.05, T.damage + 0.5, "none")} size={44} accent={C.red} />
      <g transform="translate(-120 40) scale(0.42)">
        <Substation />
      </g>
      <g transform="translate(120 60) scale(0.4)">
        <AirBase />
      </g>
      <g transform="translate(0 110) scale(0.36)">
        <RadarAESA />
      </g>
      {dmgBoom > 0 && dmgBoom < 1 && <Explosion x={0} y={20} p={dmgBoom} size={150} seed={31} />}
      {Array.from({ length: 3 }, (_, i) => {
        const k = ((t * 0.5 + i / 3) % 1 + 1) % 1;
        return t > T.through + 0.3 ? <circle key={i} cx={-60 + i * 60 + k * 20} cy={-20 - k * 150} r={26 + k * 40} fill="#4F4B47" stroke={C.ink} strokeWidth={3} opacity={0.8 * (1 - k)} /> : null;
      })}
      <text x={0} y={250} textAnchor="middle" fontFamily={F.anton} fontSize={92} fill={C.red} stroke={C.ink} strokeWidth={6} paintOrder="stroke" opacity={prog(t, T.damage, T.damage + 0.4)}>
        ???
      </text>
    </g>
  );

  /* ---------------- question mark swarm ---------------- */
  const swarmA = 1 - prog(t, T.worth - 0.1, T.worth + 0.9, "power2.in");
  const measure = win(t, T.space - 0.1, T.that + 0.4, 0.5, 0.5);

  return (
    <Stage>
      {/* balance */}
      {balIn > 0 && balOut < 1 && (
        <g transform={`translate(960 ${320 + balOut * 500}) rotate(${balOut * 25}) scale(${1.12 * balIn * (1 - balOut * 0.5)})`} opacity={1 - balOut}>
          <Balance
            tilt={tilt}
            left={
              missileDrop > 0 ? (
                <g transform={`translate(0 ${-(1 - missileDrop) * 300})`}>
                  <MissileSide y={-105} r={-90} s={0.6} flame={0} />
                  <PriceTag x={-95} y={95} text="$1M" size={52} color={C.amber} />
                </g>
              ) : null
            }
            right={
              droneDrop > 0 ? (
                <g transform={`translate(0 ${-(1 - droneDrop) * 300})`}>
                  {Array.from({ length: 1 + stack }, (_, i) => {
                    const row = Math.floor((i - 1) / 8);
                    const col = (i - 1) % 8;
                    const drop = clamp01((t - (T.dozens + (i / 32) * (T.destroy - T.dozens))) / 0.25);
                    return i === 0 ? (
                      <ShahedTop key={i} x={0} y={-42} s={0.28} r={-90} />
                    ) : (
                      <ShahedTop key={i} x={-122 + col * 35} y={-92 - row * 30 - (1 - drop) * 120} s={0.1} r={-90 + rnd(i) * 20} opacity={drop} />
                    );
                  })}
                  {t > T.cheap - 0.1 && <PriceTag x={-45} y={95} text="$" size={52} color={C.green} s={prog(t, T.cheap - 0.1, T.cheap + 0.3, "back.out(2)")} />}
                </g>
              ) : null
            }
          />
          {t > T.absurd && t < T.absurd + 0.6 && <Pulse x={0} y={0} p={prog(t, T.absurd, T.absurd + 0.6, "none")} r={420} color={C.red} width={10} />}
        </g>
      )}
      <StrikeLine x1={560} y1={180} x2={1360} y2={860} p={strike1 * (1 - balOut)} />
      <StrikeLine x1={1360} y1={180} x2={560} y2={860} p={strike2 * (1 - balOut)} />

      {/* comparison cards */}
      {cardsIn > 0 && cardsOut < 1 && (
        <g>
          <Card x={lx} y={540} s={cs} flip={flipL} glow={pulseTwo} accent={C.red} backAccent={C.amber} front={cheapDrone} back={interceptBack} />
          <Card x={rx} y={540} s={cs * (1 + 0.14 * grow)} flip={flipR} glow={pulseTwo} accent={C.amber} backAccent={C.red} front={missileFront} back={damageBack} />
          {apart < 0.5 && (
            <g transform={`translate(960 540) scale(${cardsIn * (1 - apart * 2)})`}>
              <circle r={62} fill={C.cream} stroke={C.ink} strokeWidth={6} />
              <text y={24} textAnchor="middle" fontFamily={F.anton} fontSize={64} fill={C.ink}>
                VS
              </text>
            </g>
          )}
          {/* drone slipping through to the damage side */}
          {t > T.drone2 - 0.2 && t < T.through + 0.1 && (
            <ShahedTop x={kf(t, [[T.drone2 - 0.2, 960], [T.through, rx - 40, "power2.in"]])} y={kf(t, [[T.drone2 - 0.2, 140], [T.through, 520, "power2.in"]])} r={130} s={0.3} />
          )}
        </g>
      )}

      {/* the space between the two calculations */}
      {measure > 0 && (
        <g opacity={measure}>
          <path d="M700,250 L700,830 M1220,250 L1220,830" stroke={C.cream} strokeWidth={3} strokeDasharray="10 10" opacity={0.6} />
          <path d={`M${960 - 260 * measure},540 L${960 + 260 * measure},540`} stroke={C.amber} strokeWidth={8} />
          <path d={`M${960 - 260 * measure + 30},510 L${960 - 260 * measure},540 L${960 - 260 * measure + 30},570 M${960 + 260 * measure - 30},510 L${960 + 260 * measure},540 L${960 + 260 * measure - 30},570`} stroke={C.amber} strokeWidth={8} fill="none" strokeLinejoin="round" />
        </g>
      )}
      {t > T.that - 0.2 &&
        QUESTION.map(([qx, qy], i) => {
          const t0 = T.that - 0.1 + (i / QUESTION.length) * (T.taking - T.that);
          const p = prog(t, t0, t0 + 1.1, "power3.out");
          if (p <= 0) return null;
          const a = rnd(i, 41) * Math.PI * 2;
          const sx = 960 + Math.cos(a) * 1300;
          const sy = 540 + Math.sin(a) * 800;
          const lock = prog(t, T.taking - 0.05, T.shape + 0.2, "back.out(3)");
          const tx = 960 + qx * (1 + 0.08 * lock);
          const ty = 520 + qy * (1 + 0.08 * lock);
          const scatter = prog(t, T.worth - 0.2, T.worth + 0.9, "power2.in");
          const x = sx + (tx - sx) * p + Math.cos(a) * 1400 * scatter;
          const y = sy + (ty - sy) * p + Math.sin(a) * 900 * scatter;
          const heading = p < 0.95 ? (Math.atan2(ty - sy, tx - sx) * 180) / Math.PI + 90 : 180 + Math.sin(t * 2 + i) * 10;
          return <ShahedTop key={i} x={x} y={y + Math.sin(t * 3 + i) * 3} r={heading} s={0.19} opacity={swarmA} />;
        })}
      {t > T.taking && <Pulse x={960} y={520} p={prog(t, T.taking, T.taking + 1.2, "none")} r={520} color={C.red} width={12} />}
    </Stage>
  );
};
