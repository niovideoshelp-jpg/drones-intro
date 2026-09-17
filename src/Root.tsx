import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { FPS } from "./design";

export const DURATION = Math.ceil(177.4 * FPS);

export const Root: React.FC = () => (
  <>
    <Composition id="DronesIntro" component={Film} width={1920} height={1080} fps={FPS} durationInFrames={DURATION} defaultProps={{ preview: false, audio: true }} />
    <Composition id="DronesIntro-preview" component={Film} width={1920} height={1080} fps={FPS} durationInFrames={DURATION} defaultProps={{ preview: true, audio: true }} />
  </>
);
