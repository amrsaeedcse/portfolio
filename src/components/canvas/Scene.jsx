import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PhoneMockup } from './PhoneMockup';
import { Particles, Floor } from './SceneHelpers';

// Computed once at module load — not re-created on renders
const PARTICLES = Array.from({ length: 18 }, () => ({
  position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4],
  speed: 0.3 + Math.random() * 0.7,
}));

// Detect mobile once at module load (navigator is available in browsers)
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

// Suppress noisy THREE deprecation warning — done in effect so it doesn't run on SSR
let _warnPatched = false;
function patchConsoleWarn() {
  if (_warnPatched) return;
  _warnPatched = true;
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) return;
    originalWarn(...args);
  };
}

function SceneReadySignal({ onLoaded }) {
  useEffect(() => {
    // Suppress Three.js deprecation noise after mount
    patchConsoleWarn();

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onLoaded?.();
      });
    });
    return () => cancelAnimationFrame(id);
  }, [onLoaded]);
  return null;
}

// React.memo — Scene never needs to re-render from parent state changes.
// phoneRef is a ref (stable), onLoaded is a useCallback (stable).
export default React.memo(function Scene({ phoneRef, onLoaded }) {
  return (
    <Canvas
      shadows
      camera={{ position: [1.0, 0, 9], fov: 46 }}
      gl={{
        antialias: !isMobile,
        alpha: true,
        // VERCEL SKILL bundle-defer-third-party: reduce GPU load on mobile
        powerPreference: isMobile ? 'low-power' : 'high-performance',
      }}
      dpr={isMobile ? 1 : [1, 1.5]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.05} color="#0d1020" />
      <directionalLight position={[3, 4, 5]} intensity={0.25} color="#ffffff" />

      <Suspense fallback={null}>
        <PhoneMockup
          ref={phoneRef}
          position={[isMobile ? 0 : 2.5, 0, 0]}
          scale={[isMobile ? 0.7 : 1.05, isMobile ? 0.7 : 1.05, isMobile ? 0.7 : 1.05]}
          rotation={[0, 0, 0]}
        />
        {/* Single Particles component = ONE useFrame instead of 18 */}
        <Particles particles={PARTICLES} />
        <Floor />
        <SceneReadySignal onLoaded={onLoaded} />
      </Suspense>
    </Canvas>
  );
});