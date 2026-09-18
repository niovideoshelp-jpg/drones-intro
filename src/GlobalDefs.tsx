import React from "react";
import { staticFile } from "remotion";

/** Shared SVG paint servers, always mounted so every scene can reference them by id. */
export const GlobalDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
    <style>{".blueprint * { fill: none !important; stroke: #56D6C9 !important; stroke-opacity: 0.9 !important; }"}</style>
    <defs>
      <pattern id="pat-mottle" patternUnits="userSpaceOnUse" width={1024} height={1024}>
        <image href={staticFile("tex/mottle.png")} width={1024} height={1024} />
      </pattern>
      <pattern id="pat-speck" patternUnits="userSpaceOnUse" width={1024} height={1024}>
        <image href={staticFile("tex/speck.png")} width={1024} height={1024} />
      </pattern>
      <pattern id="pat-contours" patternUnits="userSpaceOnUse" width={1024} height={1024}>
        <image href={staticFile("tex/contours.png")} width={1024} height={1024} />
      </pattern>
      {/* skies for the illustrated lenses (src/art/lens.tsx), same palette as the intro's mission lenses */}
      <linearGradient id="lens-day" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3C565B" />
        <stop offset="70%" stopColor="#7A938A" />
        <stop offset="100%" stopColor="#A7AE92" />
      </linearGradient>
      <linearGradient id="lens-dusk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2E3A4A" />
        <stop offset="65%" stopColor="#7D6A5A" />
        <stop offset="100%" stopColor="#C49A68" />
      </linearGradient>
      <linearGradient id="lens-storm" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2B3336" />
        <stop offset="70%" stopColor="#56615F" />
        <stop offset="100%" stopColor="#7C837A" />
      </linearGradient>
      <filter id="tex" x={0} y={0} width={1920} height={1080} filterUnits="userSpaceOnUse">
        <feImage href={staticFile("tex/mottle.png")} x={0} y={0} width={1024} height={1024} result="img" />
        <feTile in="img" result="tile" />
        <feComposite in="tile" in2="SourceAlpha" operator="in" result="shade" />
        <feImage href={staticFile("tex/speck.png")} x={0} y={0} width={1024} height={1024} result="img2" />
        <feTile in="img2" result="tile2" />
        <feComposite in="tile2" in2="SourceAlpha" operator="in" result="light" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="shade" />
          <feMergeNode in="light" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);
