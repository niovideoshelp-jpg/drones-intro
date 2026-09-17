import React from "react";
import { AbsoluteFill, Html5Audio, staticFile } from "remotion";
import { GlobalDefs } from "../GlobalDefs";
import { Open3 } from "./Open3";
import { Layers12 } from "./Layers12";
import { Layers34 } from "./Layers34";
import { Layer5 } from "./Layer5";
import { Sustain } from "./Sustain";
import { Choose } from "./Choose";
import { Spine } from "./Spine";
import { useTime, win } from "../lib/kf";
import { at } from "./words";

export type Film3Props = { preview?: boolean; audio?: boolean };

const SPINE_FROM = at("information.") - 0.5;
const SPINE_TO = at("Ignore") - 0.3;

const Rail: React.FC = () => {
  const t = useTime();
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <Spine show={win(t, SPINE_FROM, SPINE_TO, 0.6, 0.6)} />
      </svg>
    </AbsoluteFill>
  );
};

/** Part 3 — "Is air defence becoming unsustainable?" */
export const Film3: React.FC<Film3Props> = ({ preview = false, audio = true }) => (
  <AbsoluteFill style={{ background: preview ? "#3b4447" : "transparent" }}>
    <GlobalDefs />
    <Open3 />
    <Layers12 />
    <Layers34 />
    <Layer5 />
    <Sustain />
    <Choose />
    <Rail />
    {audio && <Html5Audio src={staticFile("audio/p3-mix.wav")} />}
  </AbsoluteFill>
);
