import React from "react";
import { C } from "../design";
import { RadarScope } from "../art/radar";
import { Commander } from "../art/people";
import { PriceTag, Pulse, Query, Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, prog, rnd, useTime } from "../lib/kf";
import { at } from "../lib/words";

const T = {
  exactly: at("exactly"),
  bigger: at("bigger", 88.5),
  problem: at("problem"),
  shows: at("shows"),
  other: at("other"),
  radar: at("radar,"),
  commander: at("commander"),
  air: at("air", 94.5),
  doesnt: at("doesn't"),
  necessarily: at("necessarily"),
  know: at("know"),
  incoming: at("incoming"),
  drone: at("drone", 99),
  cost: at("cost."),
  importantly: at("importantly,"),
};
export const RADAR_RANGE = [T.exactly + 0.2, T.importantly + 0.9] as const;

export const RadarRoom: React.FC = () => {
  const t = useTime();
  if (t < RADAR_RANGE[0] || t > RADAR_RANGE[1]) return null;

  const draw = prog(t, T.exactly + 0.4, T.bigger + 0.4, "power2.inOut");
  const appear = ease("back.out(1.4)")(clamp01((t - T.exactly - 0.3) / 0.8));
  const side = prog(t, T.other - 0.1, T.radar + 0.2, "power3.inOut");
  const leave = prog(t, T.importantly - 0.3, T.importantly + 0.6, "power3.in");
  const rx = 960 - 380 * side;
  const rs = (0.55 + 0.45 * appear) * (1 - 0.2 * side);
  const sweep = (t * 120) % 360;

  // blip drifts toward the centre once it shows up
  const bp = prog(t, T.shows, T.importantly + 0.6, "none");
  const bx = 0.62 - 0.32 * bp;
  const by = -0.5 + 0.24 * bp;
  const bAng = ((Math.atan2(bx, -by) * 180) / Math.PI + 360) % 360;
  const since = ((sweep - bAng + 360) % 360) / 360;
  const blips = t >= T.shows ? [{ x: bx, y: by, age: since * 0.8, size: 14 }] : [];
  const trail = t >= T.incoming ? Array.from({ length: 6 }, (_, i) => ({ x: bx + (i + 1) * 0.055, y: by - (i + 1) * 0.04, age: 0.5 + i * 0.08, size: 6, color: C.amber })) : [];

  const cmdIn = ease("power3.out")(clamp01((t - T.radar + 0.2) / 0.9));
  const cmdX = 1420 + (1 - cmdIn) * 700 + leave * 700;
  const q = (k: number, t0: number) => ease("back.out(2.5)")(clamp01((t - t0) / 0.4));

  // screen position of the blip for the price tag
  const bsx = rx + bx * 360 * rs;
  const bsy = 520 + by * 360 * rs;
  const priceP = prog(t, T.cost - 0.1, T.cost + 0.3, "back.out(2)");
  const digits = Array.from({ length: 5 }, (_, i) => Math.floor(rnd(Math.floor(t * 14) + i * 7, 3) * 10)).join("");
  const priceText = `$${digits.slice(0, 2)},${digits.slice(2)}`;

  return (
    <Stage>
      <g transform={`translate(${rx} ${520 - leave * 320}) scale(${rs * (1 - leave * 0.7)})`} opacity={1 - leave}>
        <RadarScope sweep={sweep} draw={draw} blips={[...trail, ...blips]} />
        {t >= T.shows && <Pulse x={bx * 360} y={by * 360} p={prog(t, T.shows, T.shows + 0.9, "none")} r={110} color={C.red} width={6} />}
        {t >= T.incoming && (
          <g transform={`translate(${bx * 360} ${by * 360})`} opacity={prog(t, T.incoming, T.incoming + 0.3)}>
            <path d="M-34,-20 L-34,-34 L-20,-34 M20,-34 L34,-34 L34,-20 M34,20 L34,34 L20,34 M-20,34 L-34,34 L-34,20" stroke={C.red} strokeWidth={5} fill="none" />
          </g>
        )}
      </g>

      {priceP > 0 && (
        <g opacity={1 - leave}>
          <path d={`M${bsx + 30},${bsy - 30} L${bsx + 90},${bsy - 110}`} stroke={C.ink} strokeWidth={4} />
          <PriceTag x={bsx + 90} y={bsy - 110} s={priceP} text={priceText} color={C.amber} size={52} />
        </g>
      )}

      {cmdIn > 0 && (
        <g>
          <Commander x={cmdX} y={640} s={1.05} glow={cmdIn} head={Math.sin(t * 0.8) * 2} />
          <Tag x={cmdX - 60} y={880} text="AIR DEFENSE COMMANDER" p={prog(t, T.commander, T.air + 0.6, "none") * (1 - leave)} size={34} accent={C.cyan} />
          {[
            [T.doesnt + 0.1, -90, -380],
            [T.necessarily + 0.2, -10, -430],
            [T.know, 70, -375],
          ].map(([t0, dx, dy], k) => {
            const p = q(k, t0) * (1 - prog(t, T.incoming - 0.2, T.incoming + 0.3));
            return p > 0 ? <Query key={k} x={cmdX + dx} y={640 + dy + Math.sin(t * 3 + k) * 6} s={p * (k === 1 ? 1.2 : 0.9)} color={C.amber} /> : null;
          })}
        </g>
      )}
    </Stage>
  );
};
