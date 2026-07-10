"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { ShaderMaterial, Vector2 } from "three";

/**
 * The site-wide "calm flowing" background.
 *
 * A single full-screen fragment shader — no geometry, no textures, no HDRI —
 * so it is one draw call and stays smooth on modest hardware. It renders the
 * warm ivory canvas with slow coral + teal blooms drifting through it, nudged
 * gently by the pointer and by scroll.
 *
 * Kept deliberately SUBTLE: the blooms peak at ~18% mix toward an accent so
 * dark body text on top still clears WCAG contrast. This is ambience, never a
 * surface that competes with the content.
 */

const vert = /* glsl */ `
  // Fullscreen triangle: ignore the camera, write clip space directly.
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;   // 0..1, eased
  uniform float uScroll;  // page scroll, in "screens"
  uniform vec2  uRes;

  uniform vec3 uBase;     // ivory
  uniform vec3 uCoral;
  uniform vec3 uTeal;

  // Ashima simplex noise (2D) — compact, license-free.
  vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 3; i++){ s += a * snoise(p); p *= 2.0; a *= 0.5; }
    return s;
  }

  void main(){
    // Aspect-correct so blooms are round, not stretched.
    vec2 uv = vUv;
    uv.x *= uRes.x / max(uRes.y, 1.0);

    float t = uTime * 0.03;
    vec2 drift = vec2(t, t * 0.6 + uScroll * 0.15);
    vec2 m = (uMouse - 0.5) * 0.35;

    float n1 = fbm(uv * 1.4 + drift + m);
    float n2 = fbm(uv * 1.1 - drift * 0.8 - m + 12.7);

    // Soft, capped mixes — ambience, not a spotlight.
    vec3 col = uBase;
    col = mix(col, uCoral, smoothstep(0.15, 0.95, n1) * 0.18);
    col = mix(col, uTeal,  smoothstep(0.20, 0.95, n2) * 0.14);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function FlowPlane() {
  const mat = useRef<ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const mouse = useRef(new Vector2(0.5, 0.5));
  const eased = useRef(new Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uRes: { value: new Vector2(1, 1) },
      uBase: { value: [0.984, 0.965, 0.937] }, // #fbf6ef ivory
      uCoral: { value: [1.0, 0.416, 0.239] }, // #ff6a3d
      uTeal: { value: [0.059, 0.647, 0.596] }, // #0fa598
    }),
    []
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    const p = state.pointer; // -1..1
    mouse.current.set((p.x + 1) / 2, (p.y + 1) / 2);
    // Ease toward the pointer so motion is calm, never jumpy.
    eased.current.lerp(mouse.current, Math.min(1, delta * 1.6));

    const u = mat.current.uniforms;
    u.uTime.value += delta;
    u.uMouse.value.copy(eased.current);
    u.uRes.value.set(size.width, size.height);
    u.uScroll.value =
      typeof window !== "undefined" ? window.scrollY / Math.max(window.innerHeight, 1) : 0;
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

export default function FlowScene() {
  return (
    <Canvas
      // Cap pixel ratio hard: a background never needs retina.
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
      style={{ position: "fixed", inset: 0 }}
    >
      <FlowPlane />
    </Canvas>
  );
}
