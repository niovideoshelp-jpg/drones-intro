import { continueRender, delayRender, staticFile } from "remotion";

/**
 * The four faces are served from public/fonts: a render must never depend on
 * fonts.gstatic.com answering — one timeout there used to kill a whole render.
 */
const FACES = [
  { family: "Anton", file: "anton-400.woff2", weight: "400" },
  { family: "Oswald", file: "oswald-var.woff2", weight: "200 700" },
  { family: "Fira Sans Condensed", file: "fira-500.woff2", weight: "500" },
  { family: "Fira Sans Condensed", file: "fira-600.woff2", weight: "600" },
  { family: "Fira Sans Condensed", file: "fira-700.woff2", weight: "700" },
  { family: "Bebas Neue", file: "bebas-400.woff2", weight: "400" },
];

if (typeof document !== "undefined") {
  const handle = delayRender("loading the local fonts");
  Promise.all(
    FACES.map(async (f) => {
      const src = `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`;
      document.fonts.add(await new FontFace(f.family, src, { weight: f.weight }).load());
    }),
  )
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}

export const F = {
  anton: "Anton",
  oswald: "Oswald",
  fira: "Fira Sans Condensed",
  bebas: "Bebas Neue",
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
