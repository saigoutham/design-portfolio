import * as THREE from "three";
import { curve1d, fbm, smooth01 } from "./noise";

// The ridge runs left to right across the frame at z = RIDGE_Z. The mammoth lies
// on it, so the crest dips under the mammoth and rises to meet its back at both ends.
export const RIDGE_Z = -2;
// Where the snowfield behind the ridge ends and the far slope starts.
export const SLOPE_Z = -20;

// World x. The crest sits low under the mammoth (its body is the ridge there), meets its
// back at the hips, and drops to a low saddle past its head so trunk and tusks hang over open air.
const CREST: [number, number][] = [
  [-140, 2.6], [-70, 3.0], [-34, 3.2], [-18, 3.2], [-12, 3.0], [-9.5, 2.7], [-7, 2.4],
  [6, 2.4], [9, 1.4], [12, 0.8], [18, 1.0], [28, 2.0], [50, 2.6], [140, 2.4],
];

const crest = (x: number) => curve1d(CREST, x);

// The mammoth lies in a notch on the crest; snow is banked against its front flank.
const DRIFT_FROM = -16;
const DRIFT_TO = 2.5;

export function heightAt(x: number, z: number) {
  const n = fbm(x * 0.045 + 10, z * 0.045 + 3);
  const fine = fbm(x * 0.3, z * 0.3, 2);
  const dz = z - RIDGE_Z;

  // Behind the crest: a plateau of snow. In front: a steep face down into the valley.
  let h = 1.2 + n * 0.5 + fine * 0.12;
  if (dz > 0) h -= 17 * smooth01(dz / 15);

  // The crest itself.
  h += (crest(x) + n * 0.9) * Math.exp(-(dz * dz) / (2 * 3.5 * 3.5));

  // Snow banked against the mammoth's front flank, stopping short of its face.
  const w = smooth01((x - DRIFT_FROM) / 8) * (1 - smooth01((x - DRIFT_TO) / 3.5));
  if (dz > -1) h += 3.8 * w * Math.exp(-((dz - 2) * (dz - 2)) / (2 * 2.2 * 2.2)) * (0.85 + fine * 0.3);

  // A drift heaped in front of its face buries the trunk's base and the low sweep of the tusks.
  h += 2.6 * Math.exp(-((x - 11) * (x - 11)) / (2 * 2.5 * 2.5) - ((dz - 0.5) * (dz - 0.5)) / (2 * 2.5 * 2.5));

  // Far slope: a steep face behind the plateau, then distant peaks.
  const s = SLOPE_Z - z;
  if (s > 0) {
    h += 13 * smooth01(s / 13) + Math.max(0, s - 13) * 0.8 + n * 1.2 * smooth01(s / 18);
    h += 55 * smooth01((s - 45) / 45) * (0.45 + n);
  }

  return h;
}

export function terrainGeometry() {
  const g = new THREE.PlaneGeometry(260, 190, 300, 220);
  g.rotateX(-Math.PI / 2);
  g.translate(0, 0, -45);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
  }
  g.computeVertexNormals();
  return g;
}
