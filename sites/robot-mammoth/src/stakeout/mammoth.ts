import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { curve1d, fbm } from "./noise";

// Local space: head toward +x, the watcher's side toward +z, belly at y = 0.
// It lies down with its legs folded under, so the body is one smooth mass whose side
// profile is the thing its shadow will show: sloping back, high shoulder hump, a dip
// at the neck, then the domed skull, the highest point.

const TOP: [number, number][] = [
  [-10.5, 0.8], [-9.5, 2.6], [-8, 3.9], [-5.5, 4.8], [-2, 5.3], [1, 6.0], [2.8, 6.7],
  [4.6, 6.0], [5.4, 5.7], [6.6, 6.5], [7.6, 6.9], [8.6, 6.2], [9.4, 4.8], [9.9, 3.0],
];
const BOTTOM: [number, number][] = [
  [-10.5, 0.8], [-9, 0], [7.5, 0], [8.5, 0.8], [9.4, 1.6], [9.9, 3.0],
];
const HALF_WIDTH: [number, number][] = [
  [-10.5, 0], [-9.5, 1.6], [-7, 2.6], [-3, 3.0], [2.5, 2.9], [5.2, 2.1], [7.4, 2.1], [8.8, 1.7], [9.5, 1.1], [9.9, 0],
];

function loftedBody(rings = 140, seg = 56) {
  const x0 = TOP[0][0];
  const x1 = TOP[TOP.length - 1][0];
  const pos: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  for (let i = 0; i <= rings; i++) {
    const x = x0 + ((x1 - x0) * i) / rings;
    const top = curve1d(TOP, x);
    const bottom = Math.min(top, curve1d(BOTTOM, x));
    const hw = Math.max(0, curve1d(HALF_WIDTH, x));
    const mid = (top + bottom) / 2;
    const hh = (top - bottom) / 2;
    for (let j = 0; j <= seg; j++) {
      const a = (j / seg) * Math.PI * 2;
      const s = Math.sin(a);
      const c = Math.cos(a);
      // Slightly boxy cross-section: a back, not a tube.
      const ys = Math.sign(s) * Math.pow(Math.abs(s), 0.8);
      const zs = Math.sign(c) * Math.pow(Math.abs(c), 0.8);
      pos.push(x, mid + hh * ys, hw * zs);
      uv.push(i / rings, j / seg);
    }
  }
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i * (seg + 1) + j;
      const b = a + seg + 1;
      index.push(a, b, a + 1, b, b + 1, a + 1); // outward-facing
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
}

function taperedTube(points: [number, number, number][], r0: number, r1: number, tubular = 72, radial = 16) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const g = new THREE.TubeGeometry(curve, tubular, 1, radial, false);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    curve.getPointAt(t, c);
    const r = r0 + (r1 - r0) * Math.pow(t, 0.85);
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, k).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
  }
  g.computeVertexNormals();
  return g;
}

// Snow lies lumpy on its back, so its outline never reads as one smooth animal.
function snowDisplace(g: THREE.BufferGeometry, amount: number) {
  const pos = g.attributes.position;
  const nor = g.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const d = (fbm(x * 0.3 + z * 0.25, y * 0.3 - z * 0.2, 4) - 0.45) * amount;
    pos.setXYZ(i, x + nor.getX(i) * d, y + nor.getY(i) * d, z + nor.getZ(i) * d);
  }
  g.computeVertexNormals();
  return g;
}

export const TRUNK_TIP = new THREE.Vector3(11.5, 4.8, 0.2);
export const SHOULDER = new THREE.Vector3(2.8, 6.6, 1.2);
export const LENS = { position: new THREE.Vector3(8.15, 4.6, 1.95), radius: 0.27 };

export function mammothGeometries() {
  const trunk = taperedTube(
    // Down from the face, forward, then curled up between the tusks.
    [[9.6, 3.6, 0.15], [10.3, 2.5, 0.25], [11.0, 2.3, 0.3], [11.8, 2.9, 0.3], [12.1, 3.9, 0.25], [11.7, 4.7, 0.2], [11.2, 4.6, 0.2]],
    0.8,
    0.26,
  );
  const body = mergeGeometries([loftedBody(), trunk])!;
  snowDisplace(body, 0.6);

  const tusk = (s: 1 | -1) =>
    taperedTube(
      [[9.2, 3.0, 0.8 * s], [10.4, 2.0, 1.4 * s], [12.2, 2.0, 1.8 * s], [13.8, 3.4, 1.5 * s], [14.2, 5.2, 0.8 * s], [13.5, 6.4, 0.2 * s]],
      0.42,
      0.08,
    );
  // Rimed over like everything else: in daylight they pass for curved cornices.
  const tusks = snowDisplace(mergeGeometries([tusk(1), tusk(-1)])!, 0.12);

  return { body, tusks };
}
