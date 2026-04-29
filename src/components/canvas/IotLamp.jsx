import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../../lib/scrollState';

// IoT control panel floating beside the lamp
function IotPanel() {
  const panelRef = useRef();
  const ledRefs = useRef([]);

  useFrame((state) => {
    if (!panelRef.current) return;
    const t = state.clock.elapsedTime;
    const intensity = scrollState.lampIntensity;
    // Gentle hover
    panelRef.current.position.y = -1.8 + Math.sin(t * 0.6) * 0.06;
    panelRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
    // LEDs pulse based on lamp intensity
    ledRefs.current.forEach((led, i) => {
      if (!led) return;
      const active = intensity > (i + 1) * 0.18;
      led.material.emissiveIntensity = active
        ? 0.8 + Math.sin(t * 2 + i) * 0.3
        : 0.05;
    });
  });

  const LED_COLORS = ['#00ff88', '#ffaa00', '#ff4444', '#00aaff', '#ff00ff'];

  return (
    <group ref={panelRef} position={[0.2, -2.6, 0.8]}>
      {/* Panel board */}
      <mesh castShadow>
        <boxGeometry args={[1.4, 1.0, 0.08]} />
        <meshStandardMaterial color="#0a1a0a" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* PCB trace lines (cosmetic) */}
      {[-0.35, 0, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.045]}>
          <boxGeometry args={[0.02, 0.85, 0.002]} />
          <meshStandardMaterial color="#1a4a1a" emissive="#00ff44" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Status LEDs */}
      {LED_COLORS.map((color, i) => (
        <mesh key={i} ref={(el) => (ledRefs.current[i] = el)}
          position={[-0.5 + i * 0.25, 0.3, 0.046]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.05} />
        </mesh>
      ))}
      {/* Small chip components */}
      {[[-0.4, -0.1], [0.1, -0.15], [0.4, -0.05]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.044]}>
          <boxGeometry args={[0.18, 0.12, 0.03]} />
          <meshStandardMaterial color="#111a11" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {/* ESP32 label */}
      <mesh position={[0, -0.3, 0.044]}>
        <boxGeometry args={[0.6, 0.14, 0.015]} />
        <meshStandardMaterial color="#0d1f0d" emissive="#00ff44" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

export const IotLamp = React.forwardRef(function IotLamp(props, ref) {
  const groupRef = useRef();
  const lightRef = useRef();
  const bulbRef = useRef();
  const shadeRef = useRef();
  const shadeInnerRef = useRef();

  React.useImperativeHandle(ref, () => groupRef.current, []);

  useFrame((state) => {
    if (!lightRef.current || !bulbRef.current) return;
    const t = state.clock.elapsedTime;
    const intensity = scrollState.lampIntensity;

    // Warm white gradient from cold amber
    const warm = new THREE.Color().lerpColors(
      new THREE.Color('#5a2800'),
      new THREE.Color('#fff4d0'),
      intensity
    );

    // Main spot light intensity
    lightRef.current.intensity = intensity * 7;
    lightRef.current.color.copy(warm);

    // Bulb glow
    bulbRef.current.material.emissiveIntensity = 0.2 + intensity * 5;
    bulbRef.current.material.emissive.copy(warm);
    // Slight flicker at low intensity
    if (intensity < 0.3) {
      bulbRef.current.material.emissiveIntensity += Math.sin(t * 40) * 0.02 * (0.3 - intensity);
    }

    // Shade interior glow
    if (shadeInnerRef.current) {
      shadeInnerRef.current.material.emissiveIntensity = intensity * 2;
      shadeInnerRef.current.material.emissive.copy(warm);
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Base plate */}
      <mesh position={[0, -3.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.14, 32]} />
        <meshStandardMaterial color="#111118" metalness={0.85} roughness={0.18} />
      </mesh>
      {/* Weight */}
      <mesh position={[0, -3.36, 0]}>
        <cylinderGeometry args={[0.38, 0.38, 0.08, 32]} />
        <meshStandardMaterial color="#1c1c22" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Main pole */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <cylinderGeometry args={[0.048, 0.058, 4, 16]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.88} roughness={0.12} />
      </mesh>
      {/* Neck joint */}
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#222230" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.55, 0.72, 0]} rotation={[0, 0, Math.PI / 8]} castShadow>
        <cylinderGeometry args={[0.036, 0.042, 1.3, 12]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.88} roughness={0.12} />
      </mesh>
      {/* Shade (cone open at bottom) */}
      <mesh ref={shadeRef} position={[1.1, 0.15, 0]} rotation={[0, 0, -Math.PI / 1.7]} castShadow>
        <coneGeometry args={[0.6, 1.0, 32, 1, true]} />
        <meshStandardMaterial
          color="#b8943a" metalness={0.55} roughness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Shade inner (emissive) */}
      <mesh ref={shadeInnerRef} position={[1.1, 0.15, 0]} rotation={[0, 0, -Math.PI / 1.7]}>
        <coneGeometry args={[0.58, 0.96, 32, 1, true]} />
        <meshStandardMaterial
          color="#ffcc44" emissive="#ff9900" emissiveIntensity={0}
          side={THREE.BackSide} transparent opacity={0.9}
        />
      </mesh>
      {/* Shade cap */}
      <mesh position={[1.1, 0.65, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial color="#111118" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Bulb */}
      <mesh ref={bulbRef} position={[1.1, 0.12, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color="#fff5e0" emissive="#ffcc44" emissiveIntensity={0.2}
          transparent opacity={0.92} roughness={0} metalness={0}
        />
      </mesh>
      {/* Point light inside shade */}
      <pointLight
        ref={lightRef}
        position={[1.1, -0.1, 0]}
        intensity={0} distance={14} decay={2}
        color="#ff6b00" castShadow
        shadow-mapSize={[512, 512]}
      />
      {/* IoT ESP32 control panel */}
      <IotPanel />
    </group>
  );
});
