import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { GlobalDefs } from "../GlobalDefs";
import { Open } from "./Open";
import { Estimates } from "./Estimates";
import { Ladder } from "./Ladder";
import { Doctrine } from "./Doctrine";
import { Industry } from "./Industry";
import { Calc } from "./Calc";
import { Damage } from "./Damage";
import { Attrition } from "./Attrition";

export type Film1Props = { preview?: boolean; audio?: boolean };

/** Part 1 — "The New Math of Air Warfare". */
export const Film1: React.FC<Film1Props> = ({ preview = false, audio = true }) => (
  <AbsoluteFill style={{ background: preview ? "#3b4447" : "transparent" }}>
    <GlobalDefs />
    <Open />
    <Estimates />
    <Ladder />
    <Doctrine />
    <Industry />
    <Calc />
    <Damage />
    <Attrition />
    {audio && <Html5Audio src={staticFile("audio/p1-mix.wav")} />}
  </AbsoluteFill>
);
