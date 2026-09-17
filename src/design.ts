import { loadFont as anton } from "@remotion/google-fonts/Anton";
import { loadFont as oswald } from "@remotion/google-fonts/Oswald";
import { loadFont as fira } from "@remotion/google-fonts/FiraSansCondensed";
import { loadFont as bebas } from "@remotion/google-fonts/BebasNeue";

export const F = {
  anton: anton("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  oswald: oswald("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily,
  fira: fira("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily,
  bebas: bebas("normal", { weights: ["400"], subsets: ["latin"] }).fontFamily,
};

/** Tactical-dossier palette. Every element carries its own fill: the stage background is transparent. */
export const C = {
  ink: "#121716",
  ink2: "#1E2523",
  ink3: "#2C3431",
  paper: "#EFE8D6",
  cream: "#F6F1E3",
  sand: "#CDBE95",
  land: "#8A8566",
  landDim: "#5E5B47",
  ocean: "#16262A",
  amber: "#F2A230",
  amberDark: "#B86F12",
  red: "#E2432C",
  redDark: "#9E2716",
  blue: "#4C93C6",
  blueDark: "#2A5F88",
  cyan: "#56D6C9",
  steel: "#A9B2B2",
  steelLight: "#D4DAD8",
  steelDark: "#5F6A6A",
  olive: "#6F7552",
  oliveDark: "#474B33",
  green: "#8BC34A",
};

export const W = 1920;
export const H = 1080;
export const FPS = 30;
