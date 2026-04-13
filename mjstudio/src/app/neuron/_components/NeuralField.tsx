"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect, Suspense, MutableRefObject } from "react";
import * as THREE from "three";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { useScrollFactor } from "@/components/useScrollFactor";

function Network({ scroll }: { scroll: MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodeCount = 36;

  const { positions, linePositions, connections } = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    const connections: Array<[number, number]> = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 2) connections.push([i, j]);
      }
    }

    const linePositions = new Float32Array(connections.length * 6);
    return { positions, linePositions, connections };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < nodeCount; i++) {
        arr[i * 3] = positions[i * 3] + Math.sin(t * 0.5 + i) * 0.15;
        arr[i * 3 + 1] = positions[i * 3 + 1] + Math.cos(t * 0.4 + i * 0.5) * 0.12;
        arr[i * 3 + 2] = positions[i * 3 + 2] + Math.sin(t * 0.3 + i * 0.7) * 0.1;
      }
      pos.needsUpdate = true;

      if (linesRef.current) {
        const lp = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const la = lp.array as Float32Array;
        for (let k = 0; k < connections.length; k++) {
          const [a, b] = connections[k];
          la[k * 6] = arr[a * 3];
          la[k * 6 + 1] = arr[a * 3 + 1];
          la[k * 6 + 2] = arr[a * 3 + 2];
          la[k * 6 + 3] = arr[b * 3];
          la[k * 6 + 4] = arr[b * 3 + 1];
          la[k * 6 + 5] = arr[b * 3 + 2];
        }
        lp.needsUpdate = true;
      }

      const s = scroll.current;
      pointsRef.current.rotation.y = t * 0.04 + s * Math.PI * 0.4;
      pointsRef.current.rotation.x = s * 0.25;
      pointsRef.current.scale.setScalar(1 + s * 0.15);
      if (linesRef.current) {
        linesRef.current.rotation.y = t * 0.04 + s * Math.PI * 0.4;
        linesRef.current.rotation.x = s * 0.25;
        linesRef.current.scale.setScalar(1 + s * 0.15);
      }
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(positions), 3]}
            count={nodeCount}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#0369a1"
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(linePositions), 3]}
            count={connections.length * 2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#0369a1" transparent opacity={0.2} />
      </lineSegments>
    </group>
  );
}

export function NeuralField() {
  const [reduced, setReduced] = useState(false);
  const scrollFactor = useScrollFactor(900);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  if (reduced) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <SceneErrorBoundary>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ambientLight intensity={1} />
            <Network scroll={scrollFactor} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
