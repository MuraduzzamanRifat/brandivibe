"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function GoldSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.y = t * 0.1;
      ref.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    }
  });
  return (
    <Float speed={0.35} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={ref} scale={2.1}>
        <icosahedronGeometry args={[1, 4]} />
        <meshPhysicalMaterial
          color="#c9a14a"
          metalness={0.92}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#e8d49a"
          emissiveIntensity={0.12}
        />
      </mesh>
    </Float>
  );
}

function OrbitRings() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) {
      g.current.rotation.z = clock.getElapsedTime() * 0.08;
    }
  });
  return (
    <group ref={g}>
      {[2.8, 3.2, 3.6].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, (i * Math.PI) / 7, 0]}>
          <torusGeometry args={[r, 0.006, 16, 180]} />
          <meshBasicMaterial color="#e8d49a" transparent opacity={0.15 - i * 0.03} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8d49a]/10 via-transparent to-[#0a1020]" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#f5e4ad" />
        <directionalLight position={[-5, -3, -5]} intensity={1} color="#c9a14a" />
        <pointLight position={[0, 0, 4]} intensity={2.2} color="#e8d49a" distance={12} />
        <GoldSphere />
        <OrbitRings />
        <Environment preset="sunset" />
        <fog attach="fog" args={["#0a1020", 5, 14]} />
      </Canvas>
    </div>
  );
}
