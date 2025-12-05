"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface GlassPanelProps {
  mousePosition: { x: number; y: number };
}

function GlassPanel({ mousePosition }: GlassPanelProps) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const shimmerLightRef = useRef<THREE.PointLight>(null);

  const autoRotation = useRef({ x: 0, y: 0, z: 0 });
  const shimmerPhase = useRef(0);
  
  // Touch interaction state
  const touchStart = useRef({ x: 0, y: 0 });
  const touchRotation = useRef({ x: 0, y: 0 });
  const isTouching = useRef(false);

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
   * Background texture - coding themed pattern
   */
  const backgroundTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Dark subtle gradient
    const gradient = ctx.createRadialGradient(512, 512, 100, 512, 512, 600);
    gradient.addColorStop(0, "rgba(20, 20, 30, 0.15)");
    gradient.addColorStop(1, "rgba(10, 10, 20, 0.05)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle code-like lines pattern
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 30; i++) {
      const y = Math.random() * canvas.height;
      const x = Math.random() * 200 + 150;
      const length = Math.random() * 400 + 200;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + length, y);
      ctx.stroke();
    }

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

    // Code snippets - Mart OS branding
    const codeLines = [
      "Mart OS v1.0",
      "",
      "const mart = { role: \"Software Developer\" }",
      "",
      "> crafting interfaces…",
    ];

    // Perfect rendering settings
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Stronger outline for maximum contrast
    ctx.strokeStyle = "rgba(0, 0, 0, 0.85)";
    ctx.lineJoin = "round";
    ctx.miterLimit = 2;

    const lineHeight = 110;
    const startY = canvas.height / 2 - ((codeLines.length - 1) * lineHeight) / 2;

    codeLines.forEach((line, i) => {
      if (line === "") return; // Skip empty lines
      
      const y = startY + i * lineHeight;
      
      // Different sizes for visual hierarchy
      if (i === 0) {
        // Title - larger
        ctx.font = "bold 120px 'Consolas', 'Courier New', monospace";
        ctx.lineWidth = 12;
      } else if (i === 4) {
        // Subtitle - italic
        ctx.font = "italic bold 80px 'Consolas', 'Courier New', monospace";
        ctx.lineWidth = 8;
      } else {
        // Code line - regular
        ctx.font = "bold 85px 'Consolas', 'Courier New', monospace";
        ctx.lineWidth = 9;
      }
      
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

  // Create custom crystal geometry
  const crystalGeometry = useMemo(() => {
    const geometry = new THREE.OctahedronGeometry(0.8, 0);
    
    // Modify geometry for more crystalline appearance
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Scale to create crystal-like proportions
      positions.setXYZ(i, x * 1.1, y * 0.8, z * 0.35);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useFrame((_state, delta) => {
    if (!crystalRef.current) return;

    // Continuous rotation on all axes for crystal effect (only when not touching)
    if (!isTouching.current) {
      autoRotation.current.x += delta * 0.2;
      autoRotation.current.y += delta * 0.35;
      autoRotation.current.z += delta * 0.15;
    }

    // Apply rotation with mouse parallax or touch influence
    crystalRef.current.rotation.x = autoRotation.current.x + mousePosition.y * 0.3 + touchRotation.current.x;
    crystalRef.current.rotation.y = autoRotation.current.y + mousePosition.x * 0.3 + touchRotation.current.y;
    crystalRef.current.rotation.z = autoRotation.current.z;

    // Gentle floating animation
    crystalRef.current.position.y = Math.sin(autoRotation.current.y) * 0.08;

    // Sync shadow rotation
    if (shadowRef.current) {
      shadowRef.current.rotation.x = crystalRef.current.rotation.x;
      shadowRef.current.rotation.y = crystalRef.current.rotation.y;
      shadowRef.current.rotation.z = crystalRef.current.rotation.z;
    }

    // Shimmer light sweep
    shimmerPhase.current += delta * 0.1;
    if (shimmerLightRef.current) {
      const shimmerX = Math.sin(shimmerPhase.current) * 2;
      const shimmerY = Math.cos(shimmerPhase.current * 0.6) * 1.5;
      shimmerLightRef.current.position.set(shimmerX, shimmerY, 2.5);

      const shimmerIntensity =
        Math.max(0, Math.sin(shimmerPhase.current * 1.5)) * 0.5;
      shimmerLightRef.current.intensity = shimmerIntensity;
    }
  });

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouching.current = true;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching.current) return;

    const deltaX = e.touches[0].clientX - touchStart.current.x;
    const deltaY = e.touches[0].clientY - touchStart.current.y;

    // Apply smooth rotation based on touch movement
    touchRotation.current.y = deltaX * 0.01;
    touchRotation.current.x = -deltaY * 0.01;
  };

  const handleTouchEnd = () => {
    isTouching.current = false;
    // Smoothly reset touch rotation
    touchRotation.current.x *= 0.95;
    touchRotation.current.y *= 0.95;
  };

  return (
    <group>
      {/* GLASS CRYSTAL */}
      <mesh 
        ref={crystalRef} 
        geometry={crystalGeometry} 
        castShadow 
        receiveShadow
        onPointerDown={(e) => {
          if ('touches' in e.nativeEvent) {
            handleTouchStart(e.nativeEvent as unknown as React.TouchEvent);
          }
        }}
        onPointerMove={(e) => {
          if ('touches' in e.nativeEvent && isTouching.current) {
            handleTouchMove(e.nativeEvent as unknown as React.TouchEvent);
          }
        }}
        onPointerUp={handleTouchEnd}
        onPointerCancel={handleTouchEnd}
      >
        <MeshTransmissionMaterial
          backside
          samples={32}
          resolution={2048}
          transmission={0.99}
          roughness={0.02}
          thickness={0.8}
          ior={2.4}
          chromaticAberration={0.025}
          anisotropy={0.5}
          distortion={0.05}
          distortionScale={0.2}
          temporalDistortion={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          attenuationDistance={0.3}
          attenuationColor="#e0f0ff"
          color="#ffffff"
          toneMapped={false}
          flatShading={true}
        />
      </mesh>

      {/* LAYERED SHADOW SYSTEM */}
      {/* Primary shadow */}
      <mesh ref={shadowRef} geometry={crystalGeometry} position={[0.08, -0.12, -0.15]}>
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>
      
      {/* Soft diffuse shadow */}
      <mesh position={[0.05, -0.15, -0.2]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.25}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Ultra-soft ambient shadow */}
      <mesh position={[0, -0.18, -0.25]}>
        <circleGeometry args={[1.3, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* DRAMATIC LIGHTING FOR CRYSTAL */}
      <spotLight
        position={[2, 2, 3]}
        angle={0.5}
        penumbra={0.8}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight
        position={[-2, 1.5, 2]}
        intensity={0.6}
        color="#e0f0ff"
      />

      <pointLight
        ref={shimmerLightRef}
        position={[0, 0, 2.5]}
        intensity={0}
        color="#ffffff"
        distance={4}
      />

      {/* Accent rim lights for crystal facets */}
      <pointLight position={[1.5, 0.5, 1.5]} intensity={0.3} color="#d0e8ff" />
      <pointLight position={[-1.5, -0.5, 1.5]} intensity={0.3} color="#e8f0ff" />
      <pointLight position={[0, 1.8, 1]} intensity={0.4} color="#ffffff" />
    </group>
  );
}

export { GlassPanel };
