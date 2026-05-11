"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense, useMemo, useSyncExternalStore, MutableRefObject } from "react";
import * as THREE from "three";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { useScrollFactor } from "@/components/useScrollFactor";

/**
 * prefers-reduced-motion as an external store — server snapshot is `false`,
 * client subscribes to the media query. Avoids the setState-in-effect
 * pattern and is hydration-safe.
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
 * Procedural mountain ridge — a displaced plane sculpted into a peak with
 * value-noise, rendered as a glowing wireframe-over-solid mass with
 * ember-warm rim lighting. The camera drifts and the mass rotates slowly;
 * scroll pulls it down and forward, mimicking an ascent.
 */
function MountainMass({ scroll }: { scroll: MutableRefObject<number> }) {
  const solidRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Build the displaced geometry once.
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(14, 14, 96, 96);
    const pos = geo.attributes.position;
    // Cheap layered pseudo-noise — deterministic, no external lib.
    const noise2 = (x: number, y: number) => {
      const s =
        Math.sin(x * 1.3 + y * 0.7) * 0.5 +
        Math.sin(x * 0.5 - y * 1.9) * 0.3 +
        Math.sin(x * 2.7 + y * 2.1) * 0.18 +
        Math.cos(x * 4.1 - y * 3.3) * 0.08;
      return s;
    };
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // distance from centre → tall ridge near the middle, flat at edges
      const r = Math.sqrt(x * x + y * y);
      const peak = Math.max(0, 1 - r / 7);
      const ridge = Math.pow(peak, 1.8) * 4.2;
      const detail = noise2(x * 0.6, y * 0.6) * (0.5 + peak * 1.6);
      pos.setZ(i, ridge + detail);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = scroll.current;
    if (groupRef.current) {
      groupRef.current.rotation.z = t * 0.04 + s * 0.5;
      groupRef.current.position.y = -2.4 - s * 2.6;
      groupRef.current.position.z = s * 3.2;
    }
    if (wireRef.current) {
      const m = wireRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.16 + Math.sin(t * 1.8) * 0.04 - s * 0.1;
    }
  });

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2.4, 0, 0]}>
      {/* solid dark mass */}
      <mesh ref={solidRef} geometry={geometry}>
        <meshStandardMaterial
          color="#15100d"
          metalness={0.3}
          roughness={0.85}
          flatShading
        />
      </mesh>
      {/* glowing wireframe shell, slightly above */}
      <mesh ref={wireRef} geometry={geometry} position={[0, 0, 0.02]}>
        <meshBasicMaterial color="#ff5a1f" wireframe transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

/**
 * Deterministic pseudo-random (mulberry32). Used instead of Math.random so
 * the ember field is pure across renders — same seed → same layout, which
 * keeps the React purity lint happy and avoids SSR/client mismatch.
 */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Floating embers drifting up across the scene. */
function Embers({ scroll }: { scroll: MutableRefObject<number> }) {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 140;
  // recycle counter for respawned embers — purely visual jitter, never
  // read during render so it stays a ref
  const respawn = useRef(0);

  const { positions, speeds } = useMemo(() => {
    const rng = makeRng(0xc0ffee);
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (rng() - 0.5) * 18;
      positions[i * 3 + 1] = rng() * 12 - 4;
      positions[i * 3 + 2] = (rng() - 0.5) * 10;
      speeds[i] = 0.4 + rng() * 0.9;
    }
    return { positions, speeds };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const fade = 1 - scroll.current * 0.7;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 0.5 + i) * delta * 0.3;
      if (arr[i * 3 + 1] > 9) {
        arr[i * 3 + 1] = -5;
        // deterministic-ish horizontal reset using the frame counter so
        // we don't call Math.random inside the loop
        respawn.current = (respawn.current + 1) % 360;
        arr[i * 3] = Math.sin(respawn.current * 2.4 + i * 1.7) * 9;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity = 0.7 * Math.max(0, fade);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#ff7a3d"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** A slow camera dolly so the static composition breathes. */
function CameraRig({ scroll }: { scroll: MutableRefObject<number> }) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const s = scroll.current;
    camera.position.x = Math.sin(t * 0.12) * 0.6;
    camera.position.y = 2.2 + Math.sin(t * 0.18) * 0.2 + s * 1.4;
    camera.position.z = 9 - s * 1.5;
    camera.lookAt(0, 0.5 - s * 1.2, 0);
  });
  return null;
}

export function HeroScene() {
  const reduced = usePrefersReducedMotion();
  const scroll = useScrollFactor(1100);

  if (reduced) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_75%,rgba(255,90,31,0.22),transparent_70%)]" />
    );
  }

  return (
    <div className="absolute inset-0">
      <SceneErrorBoundary>
        <Canvas
          camera={{ position: [0, 2.2, 9], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <CameraRig scroll={scroll} />
            <ambientLight intensity={0.18} color="#3a2a1f" />
            {/* warm key light from the peak */}
            <pointLight position={[0, 4, 2]} intensity={28} color="#ff5a1f" distance={22} decay={1.6} />
            {/* cool fill from below-left */}
            <pointLight position={[-6, -2, 4]} intensity={6} color="#7dd3fc" distance={18} decay={2} />
            <directionalLight position={[3, 6, 4]} intensity={0.8} color="#ffd29a" />
            <MountainMass scroll={scroll} />
            <Embers scroll={scroll} />
            <fog attach="fog" args={["#07060a", 8, 24]} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
