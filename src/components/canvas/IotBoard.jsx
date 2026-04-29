import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../../lib/scrollState';

// ── Data packet that flies from IoT board → phone
// VERCEL: rerender-no-inline-components
function DataPacket({ startX, phase }) {
  const mesh = useRef();
  useFrame((state) => {
    if (!mesh.current) return;
    const t = (state.clock.elapsedTime * 0.6 + phase) % 1;
    // Arc from left (IoT board) to right (phone)
    mesh.current.position.x = startX + (2.8 - startX) * t;
    mesh.current.position.y = Math.sin(t * Math.PI) * 0.8;
    mesh.current.position.z = 0;
    mesh.current.material.opacity = t < 0.1 ? t * 10 : t > 0.85 ? (1 - t) / 0.15 : 0.9;
    // Pulse size
    const s = 0.5 + Math.sin(t * Math.PI * 3) * 0.3;
    mesh.current.scale.setScalar(s * (0.3 + scrollState.progress * 0.4));
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.055, 8, 8]} />
      <meshBasicMaterial color="#00ff88" transparent opacity={0} />
    </mesh>
  );
}

// ── ESP32 IoT board
function IotBoard() {
  const groupRef = useRef();
  const ledRefs = useRef([]);
  const pingRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle hover
    groupRef.current.position.y = -0.5 + Math.sin(t * 0.7) * 0.08;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.12;
    groupRef.current.rotation.x = -0.2 + Math.sin(t * 0.5) * 0.05;

    // LEDs blink based on data transfer activity
    ledRefs.current.forEach((led, i) => {
      if (!led) return;
      const blink = Math.sin(t * (2 + i * 1.3) + i) > 0.6;
      led.material.emissiveIntensity = blink ? 1.2 + Math.sin(t * 8) * 0.3 : 0.1;
    });

    // Wifi ping ring
    if (pingRef.current) {
      const s = 1 + (t % 2) * 0.8;
      pingRef.current.scale.setScalar(s);
      pingRef.current.material.opacity = Math.max(0, 0.6 - (t % 2) * 0.35);
    }
  });

  const LED_COLORS = ['#00ff44', '#ff8800', '#00aaff', '#ff0044', '#aa00ff'];

  return (
    <group ref={groupRef} position={[-2.8, -0.5, 0]}>
      {/* PCB board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.8, 0.08]} />
        <meshStandardMaterial color="#1a4a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* PCB surface layer */}
      <mesh position={[0, 0, 0.042]}>
        <boxGeometry args={[2.75, 1.75, 0.005]} />
        <meshStandardMaterial color="#0d2e0d" roughness={0.8} />
      </mesh>

      {/* Green trace lines */}
      {[[-0.8, 0], [0, 0], [0.8, 0], [-0.4, 0.4], [0.4, -0.4]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.046]} rotation={[0, 0, i % 2 === 0 ? 0 : Math.PI / 4]}>
          <boxGeometry args={[0.015, 1.4, 0.002]} />
          <meshStandardMaterial color="#00ff44" emissive="#00ff44" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* ESP32 main chip */}
      <mesh position={[-0.3, 0.1, 0.055]}>
        <boxGeometry args={[1.0, 0.65, 0.06]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.3, 0.1, 0.088]}>
        <boxGeometry args={[0.85, 0.5, 0.005]} />
        <meshStandardMaterial color="#222" emissive="#003300" emissiveIntensity={0.5} />
      </mesh>

      {/* WiFi antenna strip */}
      <mesh position={[0.8, 0.5, 0.055]}>
        <boxGeometry args={[0.08, 0.6, 0.04]} />
        <meshStandardMaterial color="#888" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Status LEDs */}
      {LED_COLORS.map((color, i) => (
        <mesh key={i} ref={el => ledRefs.current[i] = el}
          position={[-1.2 + i * 0.55, -0.65, 0.065]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} />
        </mesh>
      ))}

      {/* Capacitors */}
      {[[-1.1, 0.4], [-1.1, -0.1], [1.1, 0.3]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.065]}>
          <cylinderGeometry args={[0.08, 0.08, 0.18, 12]} />
          <meshStandardMaterial color="#1a1a88" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* USB connector */}
      <mesh position={[0, -0.95, 0.04]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshStandardMaterial color="#888" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wifi ping ring */}
      <mesh ref={pingRef} position={[0.8, 0.5, 0.15]}>
        <torusGeometry args={[0.25, 0.015, 8, 32]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.5} />
      </mesh>

      {/* Data packets flying to phone */}
      {[0, 0.33, 0.66].map((phase, i) => (
        <DataPacket key={i} startX={-1.4} phase={phase} />
      ))}

      {/* Sensor label */}
      <mesh position={[-0.3, 0.1, 0.092]}>
        <planeGeometry args={[0.7, 0.12]} />
        <meshBasicMaterial color="#00ff44" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

export { IotBoard };
