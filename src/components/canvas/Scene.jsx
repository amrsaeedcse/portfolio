import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PhoneMockup } from './PhoneMockup';
import { Particle, Floor } from './SceneHelpers';

const PARTICLES = Array.from({ length: 18 }, () => ({
  position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4],
  speed: 0.3 + Math.random() * 0.7,
}));

const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

export default React.memo(function Scene({ phoneRef }) {
  return (
    <Canvas
      shadows
      camera={{ position: [1.0, 0, 9], fov: 46 }}
      gl={{ antialias: !isMobile, alpha: true }}
      dpr={isMobile ? 1 : [1, 1.5]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.05} color="#0d1020" />
      <directionalLight position={[3, 4, 5]} intensity={0.25} color="#ffffff" />

      <Suspense fallback={null}>
        <PhoneMockup
          ref={phoneRef}
          position={[2.5, 0, 0]}
          scale={[1.6, 1.6, 1.6]}
          rotation={[0, 0, 0]}
        />

        {PARTICLES.map((p, i) => (
          <Particle key={i} position={p.position} speed={p.speed} />
        ))}
        <Floor />
      </Suspense>
    </Canvas>
  );
});
