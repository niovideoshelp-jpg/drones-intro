import React from "react";
import { JammerMast } from "../art/ground";

export { Big, Interceptor, SunMoon, ClockIcon, NoSign } from "../art/p1art";

/** Jammer mast centred inside a badge circle. */
export const JammerMastRef: React.FC = () => (
  <g transform="translate(0 90) scale(0.55)">
    <JammerMast />
  </g>
);
