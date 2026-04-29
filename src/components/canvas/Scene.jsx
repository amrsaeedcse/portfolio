import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PhoneMockup } from './PhoneMockup';
import { IotLamp } from './IotLamp';
import { Particle, Floor, TechChips } from './SceneHelpers';

// Particles spread across the scene
const PARTICLES = Array.from({ length: 35 }, (_, i) => ({
  position: [
    (Math.random() - 0.5) * 14,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 6,
  ],
  speed: 0.4 + Math.random() * 0.8,
}));

// 3d-web-experience SKILL: "DPR limit on mobile", "Suspense with loading fallback"
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

export default function Scene({ phoneRef, lampRef }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: !isMobile, alpha: true }}
      dpr={isMobile ? 1 : [1, 2]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      {/* 3d-web-experience SKILL: "limit lights — one ambient + targeted" */}
      <ambientLight intensity={0.04} color="#1a1a2e" />

      {/* Subtle fill light from opposite side */}
      <directionalLight
        position={[-6, 4, 4]}
        intensity={0.15}
        color="#4a5568"
      />

      <Suspense fallback={null}>
        {/* IoT Lamp — left side, controls all the scene lighting */}
        <IotLamp ref={lampRef} position={[-4.5, 1, 0]} />

        {/* Phone Mockup — right side, slider driven by scroll */}
        <PhoneMockup ref={phoneRef} position={[2.8, 0, 0]} />

        {/* Floating ambient particles */}
        {PARTICLES.map((p, i) => (
          <Particle key={i} position={p.position} speed={p.speed} />
        ))}

        {/* Floor for shadow receipt */}
        <Floor />

        {/* Orbiting tech tags */}
        <TechChips phonePos={[2.8, 0, 0]} />
      </Suspense>
    </Canvas>
  );
}
