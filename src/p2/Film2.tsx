import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { GlobalDefs } from "../GlobalDefs";
import { Why } from "./Why";
import { Reliability } from "./Reliability";
import { Mixed } from "./Mixed";
import { Chain } from "./Chain";
import { Cities } from "./Cities";

export type Film2Props = { preview?: boolean; audio?: boolean };

/** Part 2 — "Why use such an expensive missile". */
export const Film2: React.FC<Film2Props> = ({ preview = false, audio = true }) => (
  <AbsoluteFill style={{ background: preview ? "#3b4447" : "transparent" }}>
    <GlobalDefs />
    <Why />
    <Reliability />
    <Mixed />
    <Chain />
    <Cities />
    {audio && <Html5Audio src={staticFile("audio/p2-mix.wav")} />}
  </AbsoluteFill>
);
