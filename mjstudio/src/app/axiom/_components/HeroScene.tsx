"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, useState, useEffect, Suspense, MutableRefObject } from "react";
import * as THREE from "three";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { useScrollFactor } from "@/components/useScrollFactor";

function DataSlab({ scroll }: { scroll: MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      const s = scroll.current;
      ref.current.rotation.y = t * 0.25 + s * Math.PI * 0.6;
      ref.current.rotation.x = Math.sin(t * 0.4) * 0.2 + s * 0.25;
      ref.current.position.z = -s * 1.2;
    }
  });
  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={ref} scale={[2.4, 3.4, 0.12]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.85}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive="#14b8a6"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function RingPulse() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.z = t * 0.3;
      const s = 1 + Math.sin(t * 1.5) * 0.08;
      ref.current.scale.set(s, s, s);
    }
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3.2, 0.01, 16, 180]} />
      <meshBasicMaterial color="#14b8a6" transparent opacity={0.25} />
    </mesh>
  );
}

export function HeroScene() {
  const [reduced, setReduced] = useState(false);
  const scrollFactor = useScrollFactor(900);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#14b8a6]/8 via-transparent to-[#0a0e1a]" />
    );
  }

  return (
    <div className="absolute inset-0">
      <SceneErrorBoundary>
        <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fef3c7" />
            <directionalLight position={[-5, -3, -5]} intensity={0.9} color="#14b8a6" />
            <pointLight position={[0, 0, 4]} intensity={2} color="#2dd4bf" distance={12} />
            <DataSlab scroll={scrollFactor} />
            <RingPulse />
            <Environment preset="studio" />
            <fog attach="fog" args={["#0a0e1a", 6, 16]} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
