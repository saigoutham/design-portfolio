"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { StaticFlame } from "./StaticFlame";

// The one procedural flame. Drawn the same in the night and inside every painting.
// The canvas is 2:3; the flame's base (where it meets the wick) sits at 50% x, 88% y.
export const FLAME_BASE = { x: 0.5, y: 0.88 };

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uIntensity;
uniform float uSeed;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;          // 0..1, y up
  float t = uTime + uSeed;
  float H = 0.74 * (0.95 + 0.05 * sin(t * 3.1 + fbm(vec2(t * 0.8, 0.0)) * 4.0));
  vec2 p = vec2((uv.x - 0.5) * (uRes.x / uRes.y), uv.y - 0.08);
  float v = p.y / H;

  // sway grows with height; licks only near the tip
  float sway = (fbm(vec2(v * 2.2 - t * 1.3, t * 0.4)) - 0.5) * 0.15 * pow(clamp(v, 0.0, 1.0), 1.5);
  p.x += sway;
  float lick = (fbm(vec2(p.x * 8.0, v * 4.0 - t * 3.6)) - 0.5) * 0.24 * smoothstep(0.35, 1.0, v);
  float vv = v + lick;

  // teardrop: round bottom (sqrt), long taper to a point
  float r = 0.27 * sqrt(max(vv, 0.0)) * pow(max(1.0 - vv, 0.0), 0.95);
  float d = abs(p.x) / max(r, 1e-4);
  float shape = (1.0 - smoothstep(0.3, 1.0, d)) * step(0.0, vv) * step(vv, 1.0);
  shape *= smoothstep(0.0, 0.05, vv);

  float vc = v * 1.55;
  float rc = 0.2 * sqrt(max(vc, 0.0)) * pow(max(1.0 - vc, 0.0), 1.1);
  float core = (1.0 - smoothstep(0.25, 1.0, abs(p.x) / max(rc, 1e-4))) * step(0.0, vc) * step(vc, 1.0);
  float root = (1.0 - smoothstep(0.0, 0.13, v)) * shape;

  vec3 edgeC = vec3(0.910, 0.392, 0.118);   // --flame-edge
  vec3 midC  = vec3(1.000, 0.710, 0.278);   // --flame
  vec3 coreC = vec3(1.000, 0.953, 0.820);   // --flame-core
  vec3 col = mix(edgeC, midC, smoothstep(0.0, 0.85, shape) * (1.0 - 0.45 * smoothstep(0.5, 1.0, v)));
  col = mix(col, coreC, clamp(core * 1.2, 0.0, 1.0));
  col = mix(col, vec3(0.30, 0.42, 0.88), root * 0.55 * (1.0 - core));

  float alpha = clamp(pow(shape, 0.85) * (1.0 - 0.3 * smoothstep(0.4, 1.0, v)) + core * 0.35, 0.0, 1.0);
  alpha *= mix(1.0, 0.75, root);
  float halo = exp(-length(vec2(p.x * 1.3, (p.y - 0.22) * 0.95)) * 4.6) * 0.34;
  alpha = clamp(alpha + halo * (1.0 - alpha), 0.0, 1.0);
  col = mix(col, midC, halo * (1.0 - shape));

  alpha *= uIntensity;
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

export type FlameHandle = {
  setIntensity: (v: number) => void;
  element: HTMLDivElement | null;
};

type Props = {
  width: number; // css px
  className?: string;
  style?: React.CSSProperties;
  initialIntensity?: number;
  seed?: number;
};

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl", { premultipliedAlpha: true });
  } catch {
    return false;
  }
}

export const FlameCanvas = forwardRef<FlameHandle, Props>(function FlameCanvas(
  { width, className, style, initialIntensity = 1, seed = 0 },
  ref
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensity = useRef(initialIntensity);
  const [mode, setMode] = useState<"gl" | "svg" | "pending">("pending");
  const height = Math.round(width * 1.5);

  useImperativeHandle(ref, () => ({
    setIntensity: (v: number) => {
      intensity.current = v;
      if (wrapRef.current && mode !== "gl") wrapRef.current.style.opacity = String(v);
    },
    get element() {
      return wrapRef.current;
    },
  }), [mode]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ok = webglAvailable();
    setMode(!reduced && ok ? "gl" : "svg");
  }, []);

  useEffect(() => {
    if (mode !== "gl") return;
    const canvas = canvasRef.current!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) {
      setMode("svg");
      return;
    }
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
    } catch {
      setMode("svg");
      return;
    }
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setMode("svg");
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uInt = gl.getUniformLocation(prog, "uIntensity");
    const uSeed = gl.getUniformLocation(prog, "uSeed");
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uSeed, seed);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let raf = 0;
    let visible = true;
    const start = performance.now();
    const draw = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform1f(uInt, intensity.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", kick);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [mode, width, height, seed]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ width, height, pointerEvents: "none", position: "relative", opacity: mode === "gl" ? 1 : initialIntensity, ...style }}
      aria-hidden="true"
    >
      {mode === "gl" && <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />}
      {mode === "svg" && (
        <StaticFlame
          style={{ width: "54%", height: "auto", position: "absolute", left: "23%", bottom: `${(1 - FLAME_BASE.y) * 100}%` }}
        />
      )}
    </div>
  );
});
