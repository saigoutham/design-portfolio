// Deterministic value noise, so terrain and snow look the same on every load.
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

export function vnoise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

export function fbm(x: number, y: number, octaves = 4) {
  let v = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * vnoise(x * f, y * f);
    f *= 2;
    amp *= 0.5;
  }
  return v;
}

export const smooth01 = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

// Smooth 1D curve through (x, value) control points (Catmull-Rom).
export function curve1d(pts: [number, number][], x: number) {
  let i = 0;
  while (i < pts.length - 2 && x > pts[i + 1][0]) i++;
  const p0 = pts[Math.max(0, i - 1)][1];
  const p1 = pts[i][1];
  const p2 = pts[i + 1][1];
  const p3 = pts[Math.min(pts.length - 1, i + 2)][1];
  const t = Math.min(1, Math.max(0, (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0])));
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}
