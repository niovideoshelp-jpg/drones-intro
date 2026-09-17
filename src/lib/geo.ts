import { GeoPermissibleObjects, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import region from "../data/region.json";
import world from "../data/world.json";
import { at } from "./words";
import { ease, zoomInterp } from "./kf";

export type Country = { n: string; iso: string; g: GeoPermissibleObjects };
export const REGION = region as unknown as Country[];
export const WORLD = world as unknown as Country[];
export const GRATICULE = geoGraticule10();

export type LonLat = [number, number];
type CamKey = { t: number; lon: number; lat: number; scale: number; ease?: string };

/** One continuous camera for every map moment in the film. Times come from the narration. */
export const CAMERA: CamKey[] = [
  { t: 8.6, lon: 40, lat: 41, scale: 520 },
  { t: at("Nagorno-Karabakh"), lon: 46.3, lat: 40.2, scale: 5200, ease: "power3.inOut" },
  { t: at("During") - 0.1, lon: 46.4, lat: 40.05, scale: 5900, ease: "none" },
  { t: at("Azerbaijani") + 0.6, lon: 46.75, lat: 39.86, scale: 36000, ease: "power3.inOut" },
  { t: at("Footage"), lon: 46.78, lat: 39.84, scale: 40000, ease: "none" },
  { t: at("Not") + 0.1, lon: 46.8, lat: 39.83, scale: 42000, ease: "none" },
  { t: at("Ukraine", 40), lon: 35.5, lat: 48.8, scale: 1650, ease: "power2.inOut" },
  { t: at("scale", 40) + 0.6, lon: 35.8, lat: 48.9, scale: 1380, ease: "power2.inOut" },
  { t: at("imagine") + 0.4, lon: 33.2, lat: 48.8, scale: 2150, ease: "power1.inOut" },
  { t: at("moved") + 0.2, lon: 33, lat: 48.8, scale: 2250, ease: "none" },
  { t: at("lessons") + 0.5, lon: 31.5, lat: 49, scale: 1800, ease: "power2.inOut" },
  { t: at("studied") + 0.4, lon: 22, lat: 38, scale: 470, ease: "power2.inOut" },
  { t: at("Iran") - 0.1, lon: 12, lat: 34, scale: 450, ease: "none" },
  { t: at("launching") + 0.2, lon: 43.5, lat: 32.6, scale: 1850, ease: "power2.inOut" },
  { t: at("models"), lon: 43, lat: 32.8, scale: 1950, ease: "none" },
  { t: at("became"), lon: 43, lat: 32.8, scale: 1990, ease: "none" },
  { t: at("Russia's") + 0.9, lon: 43, lat: 44.5, scale: 1150, ease: "power2.inOut" },
  { t: at("exactly") + 0.8, lon: 41, lat: 45.5, scale: 1300, ease: "power1.inOut" },
];

const toPlane = (k: CamKey): [number, number, number] => [k.lon * Math.cos((42 * Math.PI) / 180), k.lat, (1920 / k.scale) * (180 / Math.PI)];

export const cameraAt = (t: number) => {
  const K = CAMERA;
  if (t <= K[0].t) return { lon: K[0].lon, lat: K[0].lat, scale: K[0].scale };
  for (let i = 1; i < K.length; i++) {
    if (t <= K[i].t) {
      const a = K[i - 1];
      const b = K[i];
      const p = ease(b.ease ?? "power2.inOut")((t - a.t) / (b.t - a.t));
      const [x, y, w] = zoomInterp(toPlane(a), toPlane(b))(p);
      return { lon: x / Math.cos((42 * Math.PI) / 180), lat: y, scale: (1920 / w) * (180 / Math.PI) };
    }
  }
  const z = K[K.length - 1];
  return { lon: z.lon, lat: z.lat, scale: z.scale };
};

export const makeProjection = (t: number) => {
  const c = cameraAt(t);
  const proj = geoOrthographic()
    .rotate([-c.lon, -c.lat])
    .scale(c.scale)
    .translate([960, 540])
    .clipAngle(90)
    .precision(0.6);
  return { proj, path: geoPath(proj), cam: c };
};

export type Projection = ReturnType<typeof makeProjection>;

/** Screen point if visible on the front hemisphere, else null. */
export const project = (P: Projection, ll: LonLat): [number, number] | null => {
  const r = P.proj.rotate();
  const lon = ((ll[0] + r[0] + 540) % 360) - 180;
  const lat0 = -r[1];
  const cosc =
    Math.sin((lat0 * Math.PI) / 180) * Math.sin((ll[1] * Math.PI) / 180) +
    Math.cos((lat0 * Math.PI) / 180) * Math.cos((ll[1] * Math.PI) / 180) * Math.cos((lon * Math.PI) / 180);
  if (cosc < 0) return null;
  return P.proj(ll) as [number, number];
};

/** Great-circle arc (optionally bowed sideways) as lon/lat samples up to progress p. */
export const arcPoints = (a: LonLat, b: LonLat, p = 1, bow = 0, n = 48): LonLat[] => {
  const gi = geoInterpolate(a, b);
  const out: LonLat[] = [];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const steps = Math.max(2, Math.ceil(n * p));
  for (let i = 0; i <= steps; i++) {
    const k = (i / steps) * p;
    const [lon, lat] = gi(k);
    const off = Math.sin(Math.PI * k) * bow;
    out.push([lon + (-dy / len) * off, lat + (dx / len) * off]);
  }
  return out;
};

export const lineD = (P: Projection, list: LonLat[]) => P.path({ type: "LineString", coordinates: list }) ?? "";

/** Screen position + heading (deg, 0 = up) at the end of a lon/lat polyline. */
export const headOf = (P: Projection, list: LonLat[]) => {
  const a = project(P, list[Math.max(0, list.length - 2)]);
  const b = project(P, list[list.length - 1]);
  if (!a || !b) return null;
  return { x: b[0], y: b[1], rot: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + 90 };
};
