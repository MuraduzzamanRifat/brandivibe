"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, useState, useEffect, Suspense, MutableRefObject } from "react";
import * as THREE from "three";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { useScrollFactor } from "@/components/useScrollFactor";

function VehicleForm({ scroll }: { scroll: MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      const s = scroll.current;
      ref.current.rotation.y = t * 0.25 + s * Math.PI * 0.8;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.08 + s * 0.15;
      ref.current.position.y = s * -0.5;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={ref}>
        {/* core body — elongated form */}
        <mesh scale={[3.6, 0.5, 1.1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#0a0c14"
            metalness={0.95}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.02}
            envMapIntensity={1.8}
          />
        </mesh>
        {/* accent strip */}
        <mesh position={[0, 0.26, 0.51]} scale={[3.4, 0.05, 0.02]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#84ff6b" />
        </mesh>
        {/* wheels */}
        {[-1.4, 1.4].map((x) => (
          <group key={x}>
            <mesh position={[x, -0.35, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.12, 32]} />
              <meshStandardMaterial color="#1c1917" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[x, -0.35, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 0.12, 32]} />
              <meshStandardMaterial color="#1c1917" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        ))}
        {/* headlight glow */}
        <mesh position={[1.85, 0, 0]} scale={[0.05, 0.2, 0.2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#84ff6b" />
        </mesh>
      </group>
    </Float>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
      <planeGeometry args={[30, 30, 30, 30]} />
      <meshBasicMaterial color="#84ff6b" wireframe transparent opacity={0.08} />
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#84ff6b]/8 via-transparent to-[#05060a]" />
    );
  }

  return (
    <div className="absolute inset-0">
      <SceneErrorBoundary>
        <Canvas camera={{ position: [0, 1.5, 7], fov: 38 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#84ff6b" />
            <pointLight position={[0, 2, 4]} intensity={3} color="#84ff6b" distance={10} />
            <VehicleForm scroll={scrollFactor} />
            <GridFloor />
            <Environment preset="night" />
            <fog attach="fog" args={["#05060a", 7, 18]} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
