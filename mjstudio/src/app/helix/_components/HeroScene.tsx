"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  Sparkles,
  Trail,
} from "@react-three/drei";
import { useRef, useState, useEffect, useMemo, Suspense, MutableRefObject } from "react";
import * as THREE from "three";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { useScrollFactor } from "@/components/useScrollFactor";

function HelixStrand({
  phase = 0,
  radius = 2,
  height = 6,
  turns = 3.5,
  count = 60,
  color = "#fbbf24",
}: {
  phase?: number;
  radius?: number;
  height?: number;
  turns?: number;
  count?: number;
  color?: string;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const angle = p * Math.PI * 2 * turns + phase + t * 0.5;
      const y = (p - 0.5) * height;
      const breathe = Math.sin(t * 1.2 + i * 0.1) * 0.08;
      const x = Math.cos(angle) * (radius + breathe);
      const z = Math.sin(angle) * (radius + breathe);
      dummy.position.set(x, y, z);
      const s = 0.12 + Math.sin(t * 2.5 + i * 0.3) * 0.04;
      dummy.scale.set(s, s, s);
      dummy.rotation.set(t + i, t * 0.5 + i, 0);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        metalness={0.95}
        roughness={0.08}
        emissive={color}
        emissiveIntensity={0.8}
      />
    </instancedMesh>
  );
}

function Rings() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current) {
      g.current.rotation.z = clock.getElapsedTime() * 0.15;
      g.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });
  return (
    <group ref={g}>
      {[2.6, 3.1, 3.6].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 5]}>
          <torusGeometry args={[r, 0.01, 16, 120]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.15 - i * 0.03} />
        </mesh>
      ))}
    </group>
  );
}

function CenterOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.4) * 0.2;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} scale={1.3}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color="#fcd34d"
          metalness={1}
          roughness={0.03}
          distort={0.45}
          speed={1.8}
          emissive="#f59e0b"
          emissiveIntensity={0.6}
        />
      </mesh>
      <mesh scale={1.55}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#fbbf24" wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

function CameraRig({ scroll }: { scroll: MutableRefObject<number> }) {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime() * 0.15;
    const s = scroll.current;
    camera.position.x = Math.sin(t) * 0.6;
    camera.position.y = Math.cos(t * 0.8) * 0.4 + s * 1.5;
    camera.position.z = 7 + s * 3; // pull camera back as user scrolls
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function HelixGroup({ scroll }: { scroll: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      const s = scroll.current;
      group.current.rotation.y = clock.getElapsedTime() * 0.12 + s * Math.PI;
      group.current.rotation.x = s * 0.3;
      group.current.scale.setScalar(1 - s * 0.1);
    }
  });
  return (
    <group ref={group}>
      <HelixStrand phase={0} color="#fbbf24" />
      <HelixStrand phase={Math.PI} color="#fcd34d" />
      <CenterOrb />
      <Rings />
      <Sparkles count={120} scale={10} size={3} speed={0.4} color="#fcd34d" />
      <Sparkles count={60} scale={14} size={1.5} speed={0.2} color="#ffffff" />
    </group>
  );
}

export function HeroScene() {
  const [reduced, setReduced] = useState(false);
  const scrollFactor = useScrollFactor(900);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  if (reduced) {
    return (
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fbbf24]/10 via-[#8b5cf6]/5 to-[#0a0f1c]" />
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <SceneErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={["#0a0f1c"]} />
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 5, 5]} intensity={1.8} color="#fef3c7" />
            <directionalLight position={[-5, -3, -5]} intensity={1} color="#8b5cf6" />
            <pointLight position={[0, 0, 4]} intensity={3} color="#fbbf24" distance={12} />
            <pointLight position={[0, 3, -3]} intensity={1.5} color="#fcd34d" />
            <HelixGroup scroll={scrollFactor} />
            <CameraRig scroll={scrollFactor} />
            <Environment preset="city" />
            <fog attach="fog" args={["#0a0f1c", 7, 18]} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
