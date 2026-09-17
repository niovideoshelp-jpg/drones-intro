import React from "react";
import { C } from "../design";
import { ShahedTop } from "../art/drones";
import { Tag } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, kf, prog, useTime } from "../lib/kf";
import { at } from "../lib/words";

const T = {
  among: at("Among"),
  models: at("models"),
  aircraft: at("aircraft", 79),
  shahed: at("Shahed"),
  family: at("family,"),
  became: at("became"),
};
export const SHAHED_RANGE = [T.among - 0.3, T.became + 0.6] as const;

const CX = 960;
const CY = 520;

export const Shahed: React.FC = () => {
  const t = useTime();
  if (t < SHAHED_RANGE[0] || t > SHAHED_RANGE[1]) return null;

  const enter = ease("expo.out")(clamp01((t - T.among + 0.25) / 0.9));
  const scanBlue = prog(t, T.models - 0.1, T.aircraft, "power1.inOut");
  const scanFill = prog(t, T.aircraft - 0.1, T.shahed - 0.05, "power2.inOut");
  const leave = prog(t, T.became - 0.15, T.became + 0.55, "power3.in");
  const s = (1.55 + 0.25 * (1 - enter)) * (1 - leave * 0.94);
  const x = CX + (1196 - CX) * leave;
  const y = CY + 400 * (1 - enter) + (440 - CY) * leave;
  const rot = kf(t, [
    [T.among - 0.3, 30],
    [T.among + 0.6, 0, "power3.out"],
    [T.became - 0.15, 0],
    [T.became + 0.55, -40, "power2.in"],
  ]);
  const top = CY - 180 * 1.55;
  const bottom = CY + 150 * 1.55;
  const scanY = (p: number) => top + (bottom - top) * p;
  const hover = Math.sin(t * 2) * 5;
  const famP = prog(t, T.family - 0.1, T.family + 0.6, "back.out(1.8)");
  const dims = prog(t, T.models, T.aircraft, "power2.out") * (1 - leave);

  return (
    <Stage>
      <defs>
        <clipPath id="shahed-blue">
          <rect x={0} y={0} width={1920} height={scanY(scanBlue)} />
        </clipPath>
        <clipPath id="shahed-fill">
          <rect x={0} y={0} width={1920} height={scanY(scanFill)} />
        </clipPath>
      </defs>

      {/* family silhouettes */}
      {famP > 0 && (
        <g opacity={clamp01(famP) * (1 - leave)}>
          <g transform={`translate(${CX - 560 + (1 - famP) * 200} ${CY + 30}) scale(0.95)`} className="blueprint">
            <ShahedTop detail={false} />
          </g>
          <g transform={`translate(${CX + 560 - (1 - famP) * 200} ${CY + 30}) scale(1.05)`} className="blueprint">
            <ShahedTop detail={false} />
          </g>
        </g>
      )}

      {/* construction lines */}
      <g opacity={dims} stroke={C.cyan} strokeWidth={3} fill="none">
        <path d={`M${CX},${CY - 330} L${CX},${CY + 300}`} strokeDasharray="18 10" />
        <path d={`M${CX - 232},${CY + 270} L${CX + 232},${CY + 270}`} />
        <path d={`M${CX - 232},${CY + 250} L${CX - 232},${CY + 290} M${CX + 232},${CY + 250} L${CX + 232},${CY + 290}`} />
        <path d={`M${CX - 212},${CY + 258} L${CX - 232},${CY + 270} L${CX - 212},${CY + 282} M${CX + 212},${CY + 258} L${CX + 232},${CY + 270} L${CX + 212},${CY + 282}`} />
        <path d={`M${CX - 300},${CY - 272} L${CX - 300},${CY + 230}`} strokeDasharray="6 8" />
        <path d={`M${CX - 318},${CY - 272} L${CX - 282},${CY - 272} M${CX - 318},${CY + 230} L${CX - 282},${CY + 230}`} />
        <circle cx={CX} cy={CY} r={380 * dims} strokeDasharray="4 12" opacity={0.6} transform={`rotate(${t * 20} ${CX} ${CY})`} />
      </g>

      <g clipPath="url(#shahed-blue)">
        <g transform={`translate(${x} ${y + hover}) rotate(${rot}) scale(${s})`} className="blueprint">
          <ShahedTop />
        </g>
      </g>
      <g clipPath={leave > 0 ? undefined : "url(#shahed-fill)"}>
        <g transform={`translate(${x} ${y + hover}) rotate(${rot}) scale(${s})`}>
          <ShahedTop />
        </g>
      </g>
      {scanBlue > 0 && scanFill < 1 && (
        <path d={`M${CX - 420},${scanY(scanFill > 0 ? scanFill : scanBlue)} L${CX + 420},${scanY(scanFill > 0 ? scanFill : scanBlue)}`} stroke={scanFill > 0 ? C.amber : C.cyan} strokeWidth={6} opacity={0.9} />
      )}

      <Tag x={CX} y={CY + 390} text="SHAHED" p={prog(t, T.shahed - 0.05, T.shahed + 0.6, "none") * (1 - leave)} size={64} accent={C.red} />
    </Stage>
  );
};
