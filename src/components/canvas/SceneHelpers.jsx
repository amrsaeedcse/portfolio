import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../../lib/scrollState';

// VERCEL SKILL: rerender-no-inline-components + rendering-content-visibility
// Instead of 18 individual <Particle> components each running their own useFrame,
// we merge them into ONE component with ONE useFrame call.
// This reduces R3F's internal subscription overhead by 17 callbacks per frame.
export function Particles({ particles }) {
  // One ref array for all meshes
  const refs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const opacityBase = 0.3 + scrollState.lampIntensity * 0.5;
    particles.forEach((p, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      // Animate y position + opacity in one pass — VERCEL SKILL: js-combine-iterations
      mesh.position.y = p.position[1] + Math.sin(t * p.speed + p.position[0]) * 0.3;
      mesh.material.opacity = opacityBase;
    });
  });

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} ref={el => (refs.current[i] = el)} position={p.position}>
          <sphereGeometry args={[0.015, 4, 4]} />
          {/* Reduced poly: 4,4 instead of 6,6 — imperceptible at this size */}
          <meshBasicMaterial color="#ffd700" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

// Keep single-particle export for backward compat if needed elsewhere
export function Particle({ position, speed }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.3;
    ref.current.material.opacity = 0.3 + scrollState.lampIntensity * 0.5;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.015, 4, 4]} />
      <meshBasicMaterial color="#ffd700" transparent opacity={0.3} />
    </mesh>
  );
}

// Floor plane to receive lamp shadow
export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

// Floating tech-tag chips that orbit the phone
export function TechChips({ phonePos }) {
  const chips = useRef([]);
  const TAGS = ['Flutter', 'Dart', 'IoT', 'ESP32', 'Firebase', 'Git'];

  useFrame((state) => {
    chips.current.forEach((chip, i) => {
      if (!chip) return;
      const angle = (i / TAGS.length) * Math.PI * 2 + state.clock.elapsedTime * 0.15;
      const radius = 2.5 + scrollState.lampIntensity * 0.5;
      chip.position.x = phonePos[0] + Math.cos(angle) * radius;
      chip.position.y = phonePos[1] + Math.sin(angle * 0.7) * 0.8;
      chip.position.z = phonePos[2] + Math.sin(angle) * 1.2;
      chip.material.opacity = 0.15 + scrollState.lampIntensity * 0.5;
    });
  });

  return (
    <group>
      {TAGS.map((tag, i) => (
        <mesh key={tag} ref={(el) => (chips.current[i] = el)}>
          <boxGeometry args={[0.8, 0.25, 0.04]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0ea5e9"
            emissiveIntensity={0.5}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
