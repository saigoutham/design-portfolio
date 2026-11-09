"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sampleDay, TOKENS } from "./day";
import { LENS, mammothGeometries, SHOULDER, TRUNK_TIP } from "./mammoth";
import { stage } from "./stage";
import { heightAt, RIDGE_Z, terrainGeometry } from "./terrain";

const LOOK_AT = new THREE.Vector3(2, 4, -8);
const SUN_TARGET = new THREE.Vector3(2, 3, -12);
const MAMMOTH_AT = new THREE.Vector3(-1, 1.6, RIDGE_Z);
const CAMERA_FROM = new THREE.Vector3(0, 34, 56);

// One snow material for terrain, drifts and the mammoth's mantle: same colour, same
// roughness, so nothing about its surface gives it away. Only light can.
const snow = new THREE.MeshStandardMaterial({ color: TOKENS.background, roughness: 0.93, metalness: 0 });

function softDot() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function seeded(n: number, seed: number) {
  let s = seed;
  const r = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: n }, () => [r(), r(), r(), r()] as const);
}

function Rig() {
  // Three objects are mutated inside useFrame from its state argument, the R3F idiom.
  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    // Landscape keeps about 44 m of ridge across the width. Portrait keeps 28 m, so the
    // mammoth still spans most of a phone, and gets a taller frame for the shadow above it.
    const hHalf = Math.atan((aspect < 1 ? 14 : 22) / 70);
    const vfov = Math.max(22, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hHalf) / aspect)));
    if (Math.abs(cam.fov - vfov) > 0.01) {
      cam.fov = vfov;
      cam.updateProjectionMatrix();
    }
    const push = stage.t * 5; // the watcher leans in a few metres over the day
    cam.position.set(CAMERA_FROM.x, CAMERA_FROM.y - push * 0.25, CAMERA_FROM.z - push);
    cam.lookAt(LOOK_AT);
  });
  return null;
}

function Light() {
  const get = useThree((s) => s.get);
  const narrow = useThree((s) => s.size.width < 700);
  const sun = useRef<THREE.DirectionalLight>(null!);
  const hemi = useRef<THREE.HemisphereLight>(null!);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.copy(SUN_TARGET);
    return o;
  }, []);
  const mapSize = narrow ? 1024 : 2048;

  useEffect(() => {
    const { scene } = get();
    scene.fog = new THREE.FogExp2(TOKENS.muted, 0.012);
    scene.background = new THREE.Color(TOKENS.muted);
    scene.add(target);
    sun.current.target = target;
    return () => {
      scene.remove(target);
    };
  }, [get, target]);

  useFrame((state) => {
    const d = sampleDay(stage.t);
    const fog = state.scene.fog as THREE.FogExp2 | null;
    (state.scene.background as THREE.Color | null)?.copy(d.sky);
    if (fog) {
      fog.color.copy(d.sky);
      fog.density = d.fog;
    }
    const el = THREE.MathUtils.degToRad(d.sunEl);
    const az = THREE.MathUtils.degToRad(d.sunAz);
    sun.current.position.set(
      SUN_TARGET.x + Math.sin(az) * Math.cos(el) * 150,
      SUN_TARGET.y + Math.sin(el) * 150,
      SUN_TARGET.z + Math.cos(az) * Math.cos(el) * 150,
    );
    sun.current.color.copy(d.sunColor);
    sun.current.intensity = d.sunI;
    hemi.current.color.copy(d.hemiSky);
    hemi.current.groundColor.copy(d.hemiGround);
    hemi.current.intensity = d.hemiI;
    state.gl.toneMappingExposure = d.exposure;
  });

  return (
    <>
      <hemisphereLight ref={hemi} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[mapSize, mapSize]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.05}
      >
        <orthographicCamera attach="shadow-camera" args={[-48, 48, 42, -42, 1, 320]} />
      </directionalLight>
    </>
  );
}

const ROCKS = 15;

function Terrain() {
  const geometry = useMemo(() => terrainGeometry(), []);
  const rocks = useMemo(() => {
    const g = new THREE.DodecahedronGeometry(1, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const k = 0.75 + 0.4 * Math.sin(p.getX(i) * 3.1 + p.getY(i) * 2.3 + p.getZ(i) * 1.7);
      p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.7, p.getZ(i) * k);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const rockRef = useRef<THREE.InstancedMesh>(null!);
  useEffect(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    seeded(ROCKS, 7).forEach(([a, b, c, d], i) => {
      const onRidge = i < 9;
      const x = onRidge ? (a < 0.5 ? -38 + a * 44 : 13 + (a - 0.5) * 50) : -34 + a * 72;
      const z = onRidge ? RIDGE_Z + (b - 0.5) * 4 : 8 + b * 16;
      const s = onRidge ? 0.5 + c * 0.9 : 0.4 + c * 0.9;
      q.setFromEuler(new THREE.Euler(d * 2, c * 6, a));
      m.compose(new THREE.Vector3(x, heightAt(x, z) - s * 0.35, z), q, new THREE.Vector3(s, s, s));
      rockRef.current.setMatrixAt(i, m);
    });
    rockRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <>
      <mesh geometry={geometry} material={snow} receiveShadow castShadow />
      <instancedMesh ref={rockRef} args={[rocks, undefined, ROCKS]} castShadow receiveShadow>
        <meshStandardMaterial color="#78828F" roughness={0.85} />
      </instancedMesh>
    </>
  );
}

function Lens() {
  const group = useRef<THREE.Group>(null!);
  const housing = useRef<THREE.Mesh>(null!);
  const iris = useRef<THREE.Mesh>(null!);
  useEffect(() => {
    group.current.lookAt(CAMERA_FROM.x, CAMERA_FROM.y - 2, CAMERA_FROM.z);
  }, []);
  useFrame(() => {
    const k = Math.sin(Math.PI * stage.iris);
    iris.current.scale.setScalar(1 - 0.45 * k);
    housing.current.rotation.z = stage.iris * 0.6;
  });
  const r = LENS.radius;
  return (
    <group ref={group} position={LENS.position}>
      <mesh ref={housing} castShadow>
        <torusGeometry args={[r * 1.2, r * 0.3, 4, 6]} />
        <meshStandardMaterial color={TOKENS.secondary} roughness={0.45} metalness={0.6} />
      </mesh>
      <mesh scale={[1, 1, 0.45]} position={[0, 0, 0.02]}>
        <sphereGeometry args={[r, 32, 16]} />
        <meshStandardMaterial color={TOKENS.foreground} roughness={0.08} metalness={0.3} />
      </mesh>
      <mesh ref={iris} position={[0, 0, r * 0.47]}>
        <torusGeometry args={[r * 0.5, r * 0.09, 8, 32]} />
        <meshStandardMaterial color={TOKENS.primary} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[-r * 0.35, r * 0.35, r * 0.5]}>
        <sphereGeometry args={[r * 0.15, 12, 8]} />
        <meshBasicMaterial color="#ffffff" fog={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Mammoth() {
  const { body, tusks } = useMemo(() => mammothGeometries(), []);
  const bodyRef = useRef<THREE.Mesh>(null!);
  const dot = useMemo(() => softDot(), []);

  const plume = useMemo(() => ({ seeds: seeded(70, 3), geo: new THREE.BufferGeometry() }), []);
  const trickle = useMemo(() => ({ seeds: seeded(16, 11), geo: new THREE.BufferGeometry() }), []);
  const plumeMat = useRef<THREE.PointsMaterial>(null!);
  const trickleMat = useRef<THREE.PointsMaterial>(null!);

  useEffect(() => {
    plume.geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(plume.seeds.length * 3), 3));
    trickle.geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(trickle.seeds.length * 3), 3));
  }, [plume, trickle]);

  useFrame(() => {
    // Breathing lifts the chest a little; scrolling freezes it (stage.breath falls to 0).
    bodyRef.current.scale.y = 1 + 0.014 * Math.sin(Math.PI * stage.breath);

    const pp = plume.geo.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (pp) {
      plume.seeds.forEach(([a, b, c, d], i) => {
        const f = stage.plumeRise * (0.45 + d * 0.55);
        pp.setXYZ(i, TRUNK_TIP.x + (a - 0.3) * f * 2.2, TRUNK_TIP.y + f * (3 + b * 3.5), TRUNK_TIP.z + (c - 0.5) * f * 1.8);
      });
      pp.needsUpdate = true;
      plumeMat.current.opacity = stage.plumeAlpha;
    }
    const tp = trickle.geo.getAttribute("position") as THREE.BufferAttribute | undefined;
    if (tp) {
      trickle.seeds.forEach(([a, b, c, d], i) => {
        const f = Math.max(0, stage.trickle - d * 0.3);
        tp.setXYZ(i, SHOULDER.x + (a - 0.5) * 1.6, SHOULDER.y - f * f * (3.2 + b * 2), SHOULDER.z + f * (1.2 + c));
      });
      tp.needsUpdate = true;
      trickleMat.current.opacity = Math.sin(Math.PI * Math.min(1, stage.trickle));
    }
  });

  return (
    <group position={MAMMOTH_AT}>
      <mesh ref={bodyRef} geometry={body} material={snow} castShadow receiveShadow />
      <mesh geometry={tusks} material={snow} castShadow receiveShadow />
      <Lens />
      <points geometry={plume.geo} frustumCulled={false}>
        <pointsMaterial ref={plumeMat} map={dot} size={1.7} color="#ffffff" transparent opacity={0} depthWrite={false} />
      </points>
      <points geometry={trickle.geo} frustumCulled={false}>
        <pointsMaterial ref={trickleMat} map={dot} size={0.45} color="#ffffff" transparent opacity={0} depthWrite={false} />
      </points>
    </group>
  );
}

function Snowfall() {
  const count = 1400;
  const dot = useMemo(() => softDot(), []);
  const { geo, seeds } = useMemo(() => {
    const seeds = seeded(count, 23);
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    seeds.forEach(([a, b, c], i) => {
      p[i * 3] = -40 + a * 80;
      p[i * 3 + 1] = b * 34;
      p[i * 3 + 2] = -22 + c * 64;
    });
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return { geo: g, seeds };
  }, []);
  useFrame((_, dt) => {
    const d = sampleDay(stage.t);
    const p = geo.getAttribute("position") as THREE.BufferAttribute;
    const step = Math.min(dt, 0.05);
    for (let i = 0; i < count; i++) {
      const s = seeds[i][3];
      let x = p.getX(i) + d.wind * (4 + s * 3) * step;
      let y = p.getY(i) - (0.8 + s * 0.9) * step * (0.3 + d.wind);
      if (y < 0) y += 34;
      if (x > 40) x -= 80;
      p.setXY(i, x, y);
    }
    p.needsUpdate = true;
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial map={dot} size={0.22} color="#ffffff" transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

export default function Scene() {
  return (
    <Canvas
      frameloop="never"
      shadows="soft"
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 22, near: 1, far: 700, position: CAMERA_FROM.toArray() }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1;
      }}
    >
      <Rig />
      <Light />
      <Terrain />
      <Mammoth />
      <Snowfall />
    </Canvas>
  );
}
