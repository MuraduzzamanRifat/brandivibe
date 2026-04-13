"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function GlassBlob() {
  const ref = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.12;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (ref2.current) {
      ref2.current.rotation.y = -t * 0.08;
      ref2.current.rotation.z = Math.cos(t * 0.2) * 0.1;
    }
  });

  return (
    <group>
      <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={ref} position={[1.2, -0.3, 0]} scale={2.1}>
          <icosahedronGeometry args={[1, 5]} />
          <MeshDistortMaterial
            color="#84e1ff"
            metalness={0.9}
            roughness={0.08}
            distort={0.45}
            speed={1.4}
            emissive="#a78bfa"
            emissiveIntensity={0.18}
          />
        </mesh>
      </Float>
      <Float speed={0.6} rotationIntensity={0.5} floatIntensity={0.6}>
        <mesh ref={ref2} position={[-1.4, 0.6, -1]} scale={0.9}>
          <icosahedronGeometry args={[1, 3]} />
          <meshBasicMaterial
            color="#a78bfa"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>
      </Float>
    </group>
  );
}

function CameraDrift() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * 0.08;
    camera.position.x = Math.sin(t) * 0.25;
    camera.position.y = Math.cos(t * 0.7) * 0.15;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroBackground() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const cb = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  }, []);

  if (reduced) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,rgba(132,225,255,0.15),transparent_60%),radial-gradient(ellipse_50%_40%_at_30%_60%,rgba(167,139,250,0.1),transparent)]" />
    );
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.6} color="#84e1ff" />
        <directionalLight position={[-5, -3, -5]} intensity={1.2} color="#a78bfa" />
        <pointLight position={[2, 0, 3]} intensity={2} color="#84e1ff" distance={10} />
        <GlassBlob />
        <CameraDrift />
        <Environment preset="night" />
        <fog attach="fog" args={["#08080a", 4, 14]} />
      </Canvas>
    </div>
  );
}
