"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface GlassPanelProps {
  mousePosition: { x: number; y: number };
}

function GlassPanel({ mousePosition }: GlassPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const rimLightRef = useRef<THREE.Mesh>(null);
  const shimmerLightRef = useRef<THREE.PointLight>(null);

  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });

  const breathingPhase = useRef(0);
  const shimmerPhase = useRef(0);
  const autoRotation = useRef(0);

  /**
   * LAYER 1 – inner fog (now neutral white rather than blue)
   */
  const innerFogTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    const radial = ctx.createRadialGradient(256, 256, 40, 256, 256, 260);
    radial.addColorStop(0, "rgba(255,255,255,0.22)");
    radial.addColorStop(0.4, "rgba(248,250,252,0.12)");
    radial.addColorStop(0.7, "rgba(241,245,249,0.06)");
    radial.addColorStop(1, "rgba(229,231,235,0.02)");

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  /**
   * LAYER 2 – soft vertical gradient, very subtle cool tint
   */
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(255,255,255,0.20)");
    gradient.addColorStop(0.35, "rgba(248,250,252,0.10)");
    gradient.addColorStop(0.6, "rgba(241,245,249,0.06)");
    gradient.addColorStop(1, "rgba(226,232,240,0.10)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  /**
   * LAYER 3 – rim light texture (top-left highlight)
   */
  const rimTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    const radial = ctx.createRadialGradient(90, 90, 0, 256, 256, 380);
    radial.addColorStop(0, "rgba(255,255,255,0.5)");
    radial.addColorStop(0.25, "rgba(255,255,255,0.18)");
    radial.addColorStop(0.6, "rgba(248,250,252,0.06)");
    radial.addColorStop(1, "rgba(209,213,219,0)");

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  /**
   * LAYER 4 – Frozen code texture (lines of code trapped in glass)
   */
  const codeTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1536;
    const ctx = canvas.getContext("2d")!;

    // Transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Code snippets - clean and minimal
    const codeLines = [
      "const vision = {",
      "  future: true",
      "};",
    ];

    // Perfect rendering settings
    ctx.font = "bold 100px 'Consolas', 'Courier New', monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Stronger outline for maximum contrast
    ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;

    const lineHeight = 120;
    const startY = canvas.height / 2 - ((codeLines.length - 1) * lineHeight) / 2;

    codeLines.forEach((line, i) => {
      const y = startY + i * lineHeight;
      // Draw outline first
      ctx.strokeText(line, canvas.width / 2, y);
      // Then fill
      ctx.fillText(line, canvas.width / 2, y);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    // Auto-rotation for 3D depth showcase
    autoRotation.current += delta * 0.15;

    // Parallax rotation combined with auto-rotation
    targetRotation.current.x = mousePosition.y * 0.08;
    targetRotation.current.y = mousePosition.x * 0.12 + autoRotation.current;

    currentRotation.current.x +=
      (targetRotation.current.x - currentRotation.current.x) * 0.05;
    currentRotation.current.y +=
      (targetRotation.current.y - currentRotation.current.y) * 0.05;

    meshRef.current.rotation.x = currentRotation.current.x;
    meshRef.current.rotation.y = currentRotation.current.y;

    // Parallax position
    targetPosition.current.x = mousePosition.x * 0.12;
    targetPosition.current.y = mousePosition.y * 0.06;

    currentPosition.current.x +=
      (targetPosition.current.x - currentPosition.current.x) * 0.06;
    currentPosition.current.y +=
      (targetPosition.current.y - currentPosition.current.y) * 0.06;

    meshRef.current.position.x = currentPosition.current.x;
    meshRef.current.position.z = currentPosition.current.x * 0.15;

    // Breathing
    breathingPhase.current += delta * 0.35;
    const breathingScale = 1 + Math.sin(breathingPhase.current) * 0.012;
    meshRef.current.scale.setScalar(breathingScale);

    // Gentle float
    meshRef.current.position.y =
      Math.sin(breathingPhase.current * 0.5) * 0.05;

    // Inner glow pulsing
    if (innerGlowRef.current) {
      const glowPulse = 0.18 + Math.sin(breathingPhase.current * 1.1) * 0.05;
      (innerGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        glowPulse;
    }

    // Rim light subtle motion
    if (rimLightRef.current) {
      rimLightRef.current.rotation.z += delta * 0.08;
      const rimPulse = 0.22 + Math.sin(breathingPhase.current * 0.8) * 0.06;
      (rimLightRef.current.material as THREE.MeshBasicMaterial).opacity =
        rimPulse;
    }

    // Shimmer light sweep
    shimmerPhase.current += delta * 0.08;
    if (shimmerLightRef.current) {
      const shimmerX = Math.sin(shimmerPhase.current) * 1.7;
      const shimmerY = Math.cos(shimmerPhase.current * 0.7) * 1.2;
      shimmerLightRef.current.position.set(shimmerX, shimmerY, 2);

      const shimmerIntensity =
        Math.max(0, Math.sin(shimmerPhase.current * 2)) * 0.35;
      shimmerLightRef.current.intensity = shimmerIntensity;
    }
  });

  return (
    <group rotation={[0.1, -0.25, 0.04]}>
      {/* MAIN GLASS */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <RoundedBox args={[2.5, 2.1, 0.12]} radius={0.2} smoothness={16}>
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.25}
            samples={8}
            resolution={768}
            transmission={0.97}
            roughness={0.16}
            thickness={0.22}
            ior={1.45}
            chromaticAberration={0.018}
            anisotropy={0.06}
            distortion={0.03}
            distortionScale={0.1}
            temporalDistortion={0.06}
            clearcoat={0.95}
            clearcoatRoughness={0.16}
            attenuationDistance={1}
            attenuationColor="#f5f5f7"
            color="#f9fafb"
            toneMapped={false}
          />
        </RoundedBox>

        {/* Inner fog */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[2.35, 1.95]} />
          <meshBasicMaterial
            map={innerFogTexture}
            transparent
            opacity={0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Vertical gradient */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[2.35, 1.95]} />
          <meshBasicMaterial
            map={gradientTexture}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Inner glow plane */}
        <mesh ref={innerGlowRef} position={[0, 0, 0.02]}>
          <planeGeometry args={[2.0, 1.7]} />
          <meshBasicMaterial
            color="#f3f4f6"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Rim light plane */}
        <mesh ref={rimLightRef} position={[-0.55, 0.55, 0.05]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial
            map={rimTexture}
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Frozen code inside glass - ultra crisp */}
        <mesh position={[0, 0, 0.001]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1.9, 1.5]} />
          <meshBasicMaterial
            map={codeTexture}
            transparent
            opacity={0.9}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      </mesh>

      {/* SOFT SHADOW BEHIND PANEL */}
      <mesh position={[0.06, -0.06, -0.08]} receiveShadow>
        <RoundedBox args={[2.55, 2.15, 0.02]} radius={0.21} smoothness={12}>
          <meshStandardMaterial
            color="#020617"
            transparent
            opacity={0.35}
            roughness={0.98}
          />
        </RoundedBox>
      </mesh>

      {/* LIGHT SETUP */}
      <spotLight
        position={[1.6, 1.3, 3]}
        angle={0.45}
        penumbra={0.9}
        intensity={0.35}
        color="#ffffff"
        castShadow
      />

      <pointLight
        position={[-1.6, 1.6, 2.6]}
        intensity={0.28}
        color="#f5f5f7"
      />

      <pointLight
        ref={shimmerLightRef}
        position={[0, 0, 2]}
        intensity={0}
        color="#ffffff"
        distance={3}
      />

      {/* subtle edge glows */}
      <pointLight position={[1.1, 0, 1.4]} intensity={0.08} color="#f9fafb" />
      <pointLight position={[-1.1, 0, 1.4]} intensity={0.08} color="#f9fafb" />
    </group>
  );
}

export { GlassPanel };
