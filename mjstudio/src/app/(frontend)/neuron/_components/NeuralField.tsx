"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  useRef,
  useMemo,
  useState,
  useEffect,
  Suspense,
  MutableRefObject,
} from "react";
import * as THREE from "three";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";
import { useScrollFactor } from "@/components/useScrollFactor";

type MouseRef = MutableRefObject<{ x: number; y: number }>;

function Network({
  scroll,
  mouse,
  intensity,
}: {
  scroll: MutableRefObject<number>;
  mouse: MouseRef;
  intensity: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsMat = useRef<THREE.PointsMaterial>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);

  const nodeCount = 44;
  const tiltX = useRef(0);
  const tiltY = useRef(0);

  const { positions, linePositions, connections } = useMemo(() => {
    const positions = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
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

  // Color targets: idle blue, active pink-magenta, interpolated by scroll
  const idleColor = useMemo(() => new THREE.Color("#0369a1"), []);
  const activeColor = useMemo(() => new THREE.Color("#ef476f"), []);
  const workingColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = scroll.current;

    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < nodeCount; i++) {
        arr[i * 3] = positions[i * 3] + Math.sin(t * 0.5 + i) * 0.18;
        arr[i * 3 + 1] = positions[i * 3 + 1] + Math.cos(t * 0.4 + i * 0.5) * 0.14;
        arr[i * 3 + 2] = positions[i * 3 + 2] + Math.sin(t * 0.3 + i * 0.7) * 0.12;
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

      // Ease mouse tilt toward target — fields "look at" the cursor.
      tiltX.current += (mouse.current.y * 0.35 - tiltX.current) * 0.06;
      tiltY.current += (mouse.current.x * 0.5 - tiltY.current) * 0.06;

      const rotationX = s * 0.6 + tiltX.current;
      const rotationY = t * 0.04 + s * Math.PI * 0.55 + tiltY.current;
      const scale = 1 + s * 0.4 + Math.abs(tiltY.current) * 0.05;

      pointsRef.current.rotation.set(rotationX, rotationY, 0);
      pointsRef.current.scale.setScalar(scale);
      if (linesRef.current) {
        linesRef.current.rotation.set(rotationX, rotationY, 0);
        linesRef.current.scale.setScalar(scale);
      }

      // Color lerp — blue (idle) → pink (scrolled + active)
      const colorT = Math.min(1, s * 1.4 + Math.abs(mouse.current.x) * 0.2);
      workingColor.copy(idleColor).lerp(activeColor, colorT);
      if (pointsMat.current) pointsMat.current.color.copy(workingColor);
      if (linesMat.current) linesMat.current.color.copy(workingColor);
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
          ref={pointsMat}
          size={0.1}
          color="#0369a1"
          transparent
          opacity={0.35 + intensity * 0.6}
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
        <lineBasicMaterial
          ref={linesMat}
          color="#0369a1"
          transparent
          opacity={0.15 + intensity * 0.25}
        />
      </lineSegments>
    </group>
  );
}

export function NeuralField({ intensity = 0.4 }: { intensity?: number } = {}) {
  const [reduced, setReduced] = useState(false);
  const scrollFactor = useScrollFactor(900);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  if (reduced) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <SceneErrorBoundary>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ambientLight intensity={1} />
            <Network scroll={scrollFactor} mouse={mouse} intensity={intensity} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
