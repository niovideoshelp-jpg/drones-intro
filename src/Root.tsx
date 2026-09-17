import React from "react";
import { Composition } from "remotion";
import { Film } from "./Film";
import { Film1 } from "./p1/Film1";
import { P1_DURATION_S } from "./p1/words";
import { FPS } from "./design";

export const DURATION = Math.ceil(177.4 * FPS);
export const P1_DURATION = Math.ceil(P1_DURATION_S * FPS);

export const Root: React.FC = () => (
  <>
    <Composition id="DronesIntro" component={Film} width={1920} height={1080} fps={FPS} durationInFrames={DURATION} defaultProps={{ preview: false, audio: true }} />
    <Composition id="DronesIntro-preview" component={Film} width={1920} height={1080} fps={FPS} durationInFrames={DURATION} defaultProps={{ preview: true, audio: true }} />
    <Composition id="Part1" component={Film1} width={1920} height={1080} fps={FPS} durationInFrames={P1_DURATION} defaultProps={{ preview: false, audio: true }} />
    <Composition id="Part1-preview" component={Film1} width={1920} height={1080} fps={FPS} durationInFrames={P1_DURATION} defaultProps={{ preview: true, audio: true }} />
  </>
);
