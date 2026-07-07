"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense, useSyncExternalStore, MutableRefObject } from "react";
import * as THREE from "three";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { useScrollFactor } from "@/components/useScrollFactor";

const SEG = 110;
const SIZE = 20;

/**
 * The mountain heightfield is a module-level singleton: there is exactly
 * one TerrainPulse in the scene, so the geometry, per-vertex base-Z, and
 * per-vertex centre radius are built once at module load (pure vertex math,
 * no WebGL context needed — safe under SSR). Building it here rather than
 * via a hook keeps the component free of the "mutate a hook return" /
 * "access a ref in render" lint constraints while still letting useFrame
 * mutate the buffers each frame.
 */
const TERRAIN = (() => {
  const geometry = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
  const pos = geometry.attributes.position;
  const baseZ = new Float32Array(pos.count);
  const radii = new Float32Array(pos.count);
  const noise = (x: number, y: number) =>
    Math.sin(x * 0.9 + y * 0.5) * 0.5 +
    Math.sin(x * 0.4 - y * 1.7) * 0.3 +
    Math.sin(x * 2.3 + y * 1.9) * 0.16 +
    Math.cos(x * 4.0 - y * 3.1) * 0.07;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const r = Math.sqrt(x * x + y * y);
    radii[i] = r;
    const peak = Math.max(0, 1 - r / 9);
    const ridge = Math.pow(peak, 1.7) * 3.6;
    const detail = noise(x * 0.7, y * 0.7) * (0.35 + peak * 1.4);
    const z = ridge + detail;
    baseZ[i] = z;
    pos.setZ(i, z);
  }
  geometry.computeVertexNormals();
  return { geometry, baseZ, radii };
})();

/**
 * prefers-reduced-motion as an external store — server snapshot is `false`,
 * client subscribes to the media query. Hydration-safe, no setState-in-effect.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/**
 * Terrain Grid Pulse — a wireframe mountain mesh that a radial wave travels
 * across, lifting vertices as it passes (a sonar-style ping over terrain).
 * Two such pulses run offset so the surface is never still. Warm-tan
 * wireframe over near-black. This is the signature element of the
 * "campaign destination" genre.
 */
function TerrainPulse({ scroll }: { scroll: MutableRefObject<number> }) {
  const wireRef = useRef<THREE.Mesh>(null);
  const fillRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = scroll.current;
    // reference the module-level singleton directly — the geometry is not
    // a local variable, so mutating it here is fine.
    const pos = TERRAIN.geometry.attributes.position;
    const { baseZ, radii } = TERRAIN;

    // two pulse fronts moving outward, period ~8s, offset by half
    const front1 = (t * 1.7) % 14;
    const front2 = ((t * 1.7) + 7) % 14;
    const band = 1.6;

    for (let i = 0; i < pos.count; i++) {
      const r = radii[i];
      const d1 = Math.abs(r - front1);
      const d2 = Math.abs(r - front2);
      const w1 = d1 < band ? Math.cos((d1 / band) * Math.PI * 0.5) ** 2 : 0;
      const w2 = d2 < band ? Math.cos((d2 / band) * Math.PI * 0.5) ** 2 : 0;
      const lift = (w1 + w2) * 0.9 * (0.4 + Math.max(0, 1 - r / 11));
      pos.setZ(i, baseZ[i] + lift);
    }
    pos.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.03 + s * 0.4;
      groupRef.current.position.y = -2.0 - s * 2.4;
      groupRef.current.position.z = s * 3.0;
    }
    if (wireRef.current) {
      const m = wireRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.26 - s * 0.18;
    }
    if (fillRef.current) {
      const m = fillRef.current.material as THREE.MeshStandardMaterial;
      m.opacity = 0.9 - s * 0.4;
    }
  });

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2.5, 0, 0]}>
      {/* dark solid fill so the wireframe reads against the bg */}
      <mesh ref={fillRef} geometry={TERRAIN.geometry}>
        <meshStandardMaterial
          color="#100d0a"
          metalness={0.2}
          roughness={0.95}
          transparent
          opacity={0.9}
          flatShading
        />
      </mesh>
      {/* tan wireframe shell */}
      <mesh ref={wireRef} geometry={TERRAIN.geometry} position={[0, 0, 0.015]}>
        <meshBasicMaterial color="#c4b49a" wireframe transparent opacity={0.26} />
      </mesh>
      {/* faint glowing peak */}
      <pointLight position={[0, 0, 3]} intensity={6} color="#c4b49a" distance={9} decay={2} />
    </group>
  );
}

/** Slow camera dolly — keeps the static frame breathing. */
function CameraRig({ scroll }: { scroll: MutableRefObject<number> }) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const s = scroll.current;
    camera.position.x = Math.sin(t * 0.1) * 0.5;
    camera.position.y = 2.6 + Math.sin(t * 0.16) * 0.18 + s * 1.4;
    camera.position.z = 9.5 - s * 1.6;
    camera.lookAt(0, 0.4 - s * 1.0, 0);
  });
  return null;
}

export function HeroScene() {
  const reduced = usePrefersReducedMotion();
  const scroll = useScrollFactor(1100);

  if (reduced) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_70%,rgba(196,180,154,0.16),transparent_70%)] overflow-hidden">
        <span className="pulse-ring" />
        <span className="pulse-ring" style={{ animationDelay: "2.5s" }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <SceneErrorBoundary>
        <Canvas
          camera={{ position: [0, 2.6, 9.5], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <CameraRig scroll={scroll} />
            <ambientLight intensity={0.12} color="#2a241c" />
            <directionalLight position={[4, 5, 3]} intensity={0.5} color="#ddcfb5" />
            <directionalLight position={[-5, -2, 4]} intensity={0.25} color="#5a4f3f" />
            <TerrainPulse scroll={scroll} />
            <fog attach="fog" args={["#0a0908", 9, 26]} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
