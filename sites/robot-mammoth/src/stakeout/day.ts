import * as THREE from "three";

// Values from design-system/robot-mammoth/MASTER.md. Scene colours are mixes of these.
export const TOKENS = {
  background: "#F8FAFC",
  muted: "#E9EEF5",
  foreground: "#0F172A",
  primary: "#1E3A5F",
  secondary: "#334155",
  accent: "#B45309",
  mutedForeground: "#475569",
  border: "#CBD5E1",
};

const c = (hex: string) => new THREE.Color(hex);
const mix = (a: string, b: string, t: number) => c(a).lerp(c(b), t);

type Light = {
  sky: THREE.Color;
  fog: number;
  sunEl: number; // degrees above the horizon
  sunAz: number; // degrees, 0 = from behind the watcher, 90 = from the right
  sunI: number;
  sunColor: THREE.Color;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiI: number;
  wind: number;
  exposure: number; // noon glare bleaches the frame so nothing reads
};

export type Waypoint = Light & { t: number; label?: string };

const T = TOKENS;
export const WAYPOINTS: Waypoint[] = [
  { t: 0, label: "First light", sky: c(T.muted), fog: 0.021, sunEl: 2, sunAz: 175, sunI: 0.6, sunColor: c(T.background), hemiSky: c(T.muted), hemiGround: c(T.background), hemiI: 2.6, wind: 0.8, exposure: 1 },
  { t: 0.36, label: "Noon", sky: c(T.background), fog: 0.0045, sunEl: 62, sunAz: 30, sunI: 2.6, sunColor: c("#ffffff"), hemiSky: c(T.background), hemiGround: c(T.background), hemiI: 1.7, wind: 0.5, exposure: 1.4 },
  { t: 0.6, label: "Wind drops", sky: mix(T.background, T.accent, 0.04), fog: 0.003, sunEl: 15, sunAz: 40, sunI: 2.8, sunColor: mix(T.background, T.accent, 0.1), hemiSky: mix(T.background, T.primary, 0.35), hemiGround: c(T.background), hemiI: 1.3, wind: 0, exposure: 1.05 },
  { t: 0.9, label: "Low sun", sky: mix(T.background, T.accent, 0.1), fog: 0.004, sunEl: 4.5, sunAz: 10, sunI: 3.4, sunColor: mix(T.background, T.accent, 0.22), hemiSky: mix(T.primary, T.background, 0.35), hemiGround: mix(T.background, T.primary, 0.15), hemiI: 1.6, wind: 0.05, exposure: 1 },
  { t: 1, sky: mix(T.background, T.accent, 0.1), fog: 0.004, sunEl: 4.5, sunAz: 10, sunI: 3.4, sunColor: mix(T.background, T.accent, 0.22), hemiSky: mix(T.primary, T.background, 0.35), hemiGround: mix(T.background, T.primary, 0.15), hemiI: 1.6, wind: 0.05, exposure: 1 },
];

const out: Light = {
  sky: new THREE.Color(), fog: 0, sunEl: 0, sunAz: 0, sunI: 0, sunColor: new THREE.Color(),
  hemiSky: new THREE.Color(), hemiGround: new THREE.Color(), hemiI: 0, wind: 0, exposure: 1,
};

export function sampleDay(t: number): Light {
  let i = 0;
  while (i < WAYPOINTS.length - 2 && t > WAYPOINTS[i + 1].t) i++;
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  const raw = Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
  const k = raw * raw * (3 - 2 * raw);
  const lerp = (x: number, y: number) => x + (y - x) * k;
  out.sky.copy(a.sky).lerp(b.sky, k);
  out.fog = lerp(a.fog, b.fog);
  out.sunEl = lerp(a.sunEl, b.sunEl);
  out.sunAz = lerp(a.sunAz, b.sunAz);
  out.sunI = lerp(a.sunI, b.sunI);
  out.sunColor.copy(a.sunColor).lerp(b.sunColor, k);
  out.hemiSky.copy(a.hemiSky).lerp(b.hemiSky, k);
  out.hemiGround.copy(a.hemiGround).lerp(b.hemiGround, k);
  out.hemiI = lerp(a.hemiI, b.hemiI);
  out.wind = lerp(a.wind, b.wind);
  out.exposure = lerp(a.exposure, b.exposure);
  return out;
}
