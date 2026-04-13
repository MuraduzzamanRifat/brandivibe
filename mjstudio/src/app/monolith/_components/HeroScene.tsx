"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function StandingForm() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.y = t * 0.12;
    }
  });

  return (
    <group ref={ref}>
      {/* tall concrete slab */}
      <mesh position={[0, 0, 0]} scale={[1.2, 3.4, 1.2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c9c5bf" roughness={0.95} metalness={0.02} />
      </mesh>
      {/* thin horizontal mezzanine line */}
      <mesh position={[0, 0.3, 0.61]} scale={[1.21, 0.02, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      {/* cutout window */}
      <mesh position={[0, -0.4, 0.61]} scale={[0.6, 0.4, 0.02]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      {/* base plinth */}
      <mesh position={[0, -1.9, 0]} scale={[2, 0.1, 2]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#a8a4a0" roughness={0.9} metalness={0.02} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) {
    return <div className="absolute inset-0 bg-[#e7e3dc]" />;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [2.5, 0, 6], fov: 38 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" castShadow />
        <directionalLight position={[-5, 3, -3]} intensity={0.5} color="#fef3c7" />
        <StandingForm />
      </Canvas>
    </div>
  );
}
