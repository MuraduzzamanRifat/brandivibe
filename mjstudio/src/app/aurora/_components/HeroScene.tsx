"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function GoldOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.y = t * 0.18;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.18;
    }
  });
  return (
    <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.35}>
      <mesh ref={ref} scale={1.9}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color="#f5c542"
          metalness={1}
          roughness={0.08}
          distort={0.22}
          speed={0.8}
          emissive="#d4a017"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh scale={2.2}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#d4a017" wireframe transparent opacity={0.08} />
      </mesh>
    </Float>
  );
}

function Rings() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) {
      g.current.rotation.z = clock.getElapsedTime() * 0.12;
    }
  });
  return (
    <group ref={g}>
      {[2.6, 3.0, 3.4].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 5]}>
          <torusGeometry args={[r, 0.005, 16, 180]} />
          <meshBasicMaterial color="#d4a017" transparent opacity={0.2 - i * 0.05} />
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4a017]/15 via-transparent to-[#07060a]" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 5, 5]} intensity={2.2} color="#fef3c7" />
        <directionalLight position={[-5, -3, -5]} intensity={1} color="#d4a017" />
        <pointLight position={[0, 0, 4]} intensity={2.5} color="#f5c542" distance={12} />
        <GoldOrb />
        <Rings />
        <Environment preset="sunset" />
        <fog attach="fog" args={["#07060a", 5, 14]} />
      </Canvas>
    </div>
  );
}
