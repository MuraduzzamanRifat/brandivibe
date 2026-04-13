"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function BreathingBlob() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.y = t * 0.08;
      const breath = 1 + Math.sin(t * 0.7) * 0.06; // slow, calm breathing
      ref.current.scale.set(breath, breath, breath);
    }
  });
  return (
    <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.25}>
      <mesh ref={ref} scale={2.4}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color="#0d9488"
          metalness={0.2}
          roughness={0.25}
          distort={0.25}
          speed={0.8}
          emissive="#a7f3d0"
          emissiveIntensity={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#a7f3d0]/30 via-transparent to-[#fafaf7]" />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} color="#fef7ed" />
        <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#a7f3d0" />
        <pointLight position={[0, 0, 3]} intensity={1.5} color="#14b8a6" distance={10} />
        <BreathingBlob />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
}
