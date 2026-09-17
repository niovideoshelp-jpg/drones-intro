import React from "react";
import { AbsoluteFill } from "remotion";

/** Full-frame SVG stage for a scene. Texture filter optional. */
export const Stage: React.FC<{ children: React.ReactNode; textured?: boolean; style?: React.CSSProperties }> = ({ children, textured = true, style }) => (
  <AbsoluteFill style={style}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ overflow: "visible" }}>
      <g filter={textured ? "url(#tex)" : undefined}>{children}</g>
    </svg>
  </AbsoluteFill>
);
