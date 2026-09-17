import React from "react";
import { C } from "../design";
import { ChainLink, DocPage, Magnifier } from "../art/ui";
import { Stage } from "../Stage";
import { clamp01, ease, kf, prog, useTime } from "../lib/kf";
import { at } from "../lib/words";

const T = {
  worth: at("worth"),
  everything: at("everything"),
  presented: at("presented"),
  based: at("based"),
  sources: at("sources"),
  listed: at("listed"),
  description: at("description."),
  links: at("links"),
  look: at("look"),
  data: at("data"),
  check: at("check"),
  details: at("details."),
};
export const SOURCES_RANGE = [T.worth + 0.3, 999] as const;

const PAGES = [
  { x: 700, r: -9, tab: C.blue },
  { x: 960, r: 0, tab: C.amber },
  { x: 1220, r: 9, tab: C.red },
];

export const Sources: React.FC = () => {
  const t = useTime();
  if (t < SOURCES_RANGE[0]) return null;
  const end = prog(t, 177.0, 177.4, "power2.in");

  const panelIn = prog(t, T.listed - 0.3, T.description + 0.2, "power3.out");
  const toPanel = prog(t, T.listed - 0.1, T.description + 0.3, "power3.inOut");
  const chain = prog(t, T.links - 0.1, T.links + 0.5, "none");
  const lookP = prog(t, T.look - 0.2, T.data + 0.2, "back.out(1.5)");
  const scan = kf(t, [
    [T.data - 0.1, -70],
    [T.check, 70, "sine.inOut"],
    [T.details + 0.5, -40, "sine.inOut"],
  ]);
  const checkP = prog(t, T.check, T.check + 0.4, "none");
  const arrowBob = Math.sin(t * 6) * 10;

  return (
    <Stage>
      <g opacity={1 - end}>
        {/* source pages fan in, then drop into the description panel */}
        {PAGES.map((pg, i) => {
          const pop = ease("back.out(1.6)")(clamp01((t - T.worth - 0.25 - i * 0.22) / 0.6));
          if (pop <= 0 || toPanel >= 1) return null;
          const lines = prog(t, T.presented - 0.1 + i * 0.15, T.based + 0.4 + i * 0.15, "power1.out");
          const chart = prog(t, T.based + i * 0.15, T.sources + 0.5 + i * 0.15, "power2.out");
          const px = pg.x + (720 + i * 240 - pg.x) * toPanel;
          const py = 470 + (820 - 470) * toPanel;
          const s = pop * (1 - 0.85 * toPanel);
          return <DocPage key={i} x={px} y={py + (1 - pop) * 200} r={pg.r * (1 - toPanel)} s={s} lines={lines} chart={chart} tab={pg.tab} opacity={1 - toPanel * 0.6} />;
        })}

        {/* description panel */}
        {panelIn > 0 && (
          <g transform={`translate(0 ${(1 - panelIn) * 320})`} opacity={panelIn}>
            <rect x={460} y={720} width={1000} height={220} rx={18} fill={C.ink} fillOpacity={0.94} stroke={C.cream} strokeWidth={4} />
            {[0, 1, 2].map((i) => {
              const rowP = prog(t, T.description - 0.1 + i * 0.2, T.description + 0.4 + i * 0.2, "power2.out");
              const y = 770 + i * 60;
              const ck = prog(t, T.check + i * 0.25, T.check + i * 0.25 + 0.3, "back.out(3)");
              return (
                <g key={i} opacity={rowP}>
                  <g transform={`translate(520 ${y}) scale(0.16)`}>
                    <ChainLink join={1} />
                  </g>
                  <path d={`M580,${y} L${580 + 700 * rowP},${y}`} stroke={[C.blue, C.amber, C.red][i]} strokeWidth={12} strokeLinecap="round" />
                  <path d={`M580,${y + 18} L${580 + 480 * rowP},${y + 18}`} stroke={C.steelDark} strokeWidth={6} strokeLinecap="round" />
                  {ck > 0 && (
                    <g transform={`translate(1380 ${y + 6}) scale(${ck})`}>
                      <circle r={22} fill={C.green} stroke={C.ink} strokeWidth={4} />
                      <path d="M-10,0 L-3,8 L11,-8" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  )}
                </g>
              );
            })}
            <path d={`M960,${975 + arrowBob} l-34,-26 l22,0 l0,-30 l24,0 l0,30 l22,0Z`} fill={C.amber} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
          </g>
        )}

        {/* links */}
        {chain > 0 && (
          <g transform={`translate(${kf(t, [[T.links, 960], [T.look, 560, "power2.inOut"]])} ${kf(t, [[T.links, 420], [T.look, 400, "power2.inOut"]])}) scale(${ease("back.out(2)")(clamp01(chain * 2)) * kf(t, [[T.links, 1.1], [T.look, 0.7]])})`}>
            <ChainLink join={chain} />
          </g>
        )}

        {/* look at the data yourself */}
        {lookP > 0 && (
          <g>
            <DocPage x={1080} y={400} s={0.85 * lookP} r={4} lines={1} chart={prog(t, T.look, T.data + 0.6, "power2.out")} check={checkP} tab={C.amber} />
            <g transform={`translate(${1080 + scan} ${420 + Math.sin(t * 2.5) * 20}) scale(${0.8 * lookP})`}>
              <Magnifier />
            </g>
          </g>
        )}
      </g>
    </Stage>
  );
};
