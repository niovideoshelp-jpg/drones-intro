import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { GlobalDefs } from "./GlobalDefs";
import { MapLayer } from "./scenes/Map";
import { Intro } from "./scenes/Intro";
import { Footage } from "./scenes/Footage";
import { Missions } from "./scenes/Missions";
import { Shahed } from "./scenes/Shahed";
import { RadarRoom } from "./scenes/RadarRoom";
import { Targets } from "./scenes/Targets";
import { Decision } from "./scenes/Decision";
import { TheMath } from "./scenes/TheMath";
import { Sources } from "./scenes/Sources";

export type FilmProps = { preview?: boolean; audio?: boolean };

export const Film: React.FC<FilmProps> = ({ preview = false, audio = true }) => (
  <AbsoluteFill style={{ background: preview ? "#3b4447" : "transparent" }}>
    <GlobalDefs />
    <MapLayer />
    <Intro />
    <Footage />
    <Missions />
    <Shahed />
    <RadarRoom />
    <Targets />
    <Decision />
    <TheMath />
    <Sources />
    {audio && <Html5Audio src={staticFile("audio/mix.wav")} />}
  </AbsoluteFill>
);
