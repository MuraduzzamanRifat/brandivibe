"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

/**
 * The live WebGL object shown on the WebGL & 3D service page.
 *
 * This module is heavy (three + fiber + drei), so it is ONLY ever reached
 * through the dynamic import in WebglShowcase.tsx — never in the initial
 * bundle, and never mounted until the section scrolls into view.
 *
 * Lighting is done with plain lights rather than drei's <Environment>, which
 * would fetch an HDRI over the network just to make a single object shiny.
 */

function Knot({ accent, spin }: { accent: string; spin: boolean }) {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!spin || !mesh.current) return;
    mesh.current.rotation.y += delta * 0.25;
    mesh.current.rotation.x += delta * 0.08;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh ref={mesh} castShadow={false} receiveShadow={false}>
        <torusKnotGeometry args={[1, 0.34, 180, 32]} />
        <MeshDistortMaterial
          color={accent}
          distort={0.32}
          speed={1.4}
          roughness={0.18}
          metalness={0.35}
        />
      </mesh>
    </Float>
  );
}

export default function WebglShowcaseScene({
  accent,
  interactive,
}: {
  accent: string;
  /** Pointer-capable devices get drag-to-rotate; touch devices must keep their scroll. */
  interactive: boolean;
}) {
  return (
    <Canvas
      // Cap the pixel ratio: a marketing page does not need retina WebGL.
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 5, 3]} intensity={1.9} />
      <directionalLight position={[-4, -2, -3]} intensity={0.55} color="#ffd9c9" />

      <Knot accent={accent} spin />

      {interactive && (
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.5}
        />
      )}
    </Canvas>
  );
}
