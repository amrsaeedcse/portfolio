import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../../lib/scrollState';

const SCREEN_STATES = [
  { accent: '#0ea5e9', bg: '#061827', label: 'PORTFOLIO' },
  { accent: '#8b5cf6', bg: '#110c1e', label: 'ABOUT ME' },
  { accent: '#10b981', bg: '#061812', label: 'DEV STACK' },
  { accent: '#f59e0b', bg: '#1a1002', label: 'PROJECTS' },
  { accent: '#ec4899', bg: '#1a0612', label: 'JOURNEY' },
  { accent: '#06b6d4', bg: '#04141a', label: 'CONTACT' },
];

export const PhoneMockup = React.forwardRef(function PhoneMockup(props, ref) {
  const groupRef = useRef();
  const screenRef = useRef();

  React.useImperativeHandle(ref, () => groupRef.current, []);

  const { texture, canvas, ctx } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 900;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    return { texture, canvas, ctx };
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const si = Math.min(5, Math.max(0, Math.floor(scrollState.progress * 5.99)));
    const { accent, bg, label } = SCREEN_STATES[si];

    // Idle float
    groupRef.current.position.y += Math.sin(t * 0.8) * 0.0008;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.012;

    // Redraw screen canvas
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 900);

    // Status bar
    ctx.fillStyle = accent + '22';
    ctx.fillRect(0, 0, 512, 52);
    ctx.fillStyle = accent;
    ctx.font = 'bold 20px monospace';
    ctx.fillText('9:41', 24, 34);
    ctx.fillText('▮▮▮ ◈', 390, 34);

    // Accent line under status bar
    ctx.fillStyle = accent;
    ctx.fillRect(0, 52, 512, 2);

    // App label
    ctx.font = 'bold 28px monospace';
    ctx.fillStyle = accent;
    ctx.fillText(label, 24, 110);

    // Divider
    ctx.fillStyle = accent + '44';
    ctx.fillRect(24, 128, 464, 1);

    // Content rows
    for (let i = 0; i < 5; i++) {
      const y = 155 + i * 130;
      const alpha = ['ff', 'cc', '99', '66', '44'][i];
      // Row background
      ctx.fillStyle = accent + '11';
      ctx.fillRect(20, y, 472, 110);
      // Thumbnail
      ctx.fillStyle = accent + alpha;
      ctx.fillRect(28, y + 12, 80, 80);
      // Lines
      ctx.fillStyle = '#ffffff99';
      ctx.fillRect(125, y + 22, 260, 12);
      ctx.fillStyle = '#ffffff55';
      ctx.fillRect(125, y + 44, 180, 9);
      ctx.fillRect(125, y + 62, 140, 8);
      // Accent badge
      ctx.fillStyle = accent + '88';
      ctx.fillRect(390, y + 35, 60, 22);
    }

    // Bottom progress
    ctx.fillStyle = accent + '22';
    ctx.fillRect(0, 862, 512, 38);
    const sectionProgress = (scrollState.progress % (1 / 5.99)) * 5.99;
    ctx.fillStyle = accent;
    ctx.fillRect(0, 862, 512 * sectionProgress, 38);
    ctx.fillStyle = accent;
    ctx.font = '13px monospace';
    ctx.fillText(`SECTION ${si + 1} / 6`, 200, 886);

    texture.needsUpdate = true;

    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.25 + scrollState.lampIntensity * 0.7;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {/* Phone body — slightly rounded look via bevel */}
      <mesh castShadow>
        <boxGeometry args={[2.1, 4.2, 0.2]} />
        <meshStandardMaterial color="#0d0d12" metalness={0.92} roughness={0.12} />
      </mesh>
      {/* Inner chamfer ring */}
      <mesh>
        <boxGeometry args={[2.0, 4.1, 0.22]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.8} roughness={0.2} wireframe={false} transparent opacity={0} />
      </mesh>
      {/* Bezel */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[1.88, 3.85, 0.01]} />
        <meshStandardMaterial color="#080810" roughness={0.4} />
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.108]}>
        <planeGeometry args={[1.82, 3.78]} />
        <meshStandardMaterial
          map={texture} emissiveMap={texture}
          emissive={new THREE.Color(1, 1, 1)} emissiveIntensity={0.3} roughness={0}
        />
      </mesh>
      {/* Notch */}
      <mesh position={[0, 1.87, 0.12]}>
        <capsuleGeometry args={[0.07, 0.45, 4, 8]} />
        <meshStandardMaterial color="#080810" roughness={0.8} />
      </mesh>
      {/* Power button */}
      <mesh position={[1.08, 0.7, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.07, 0.45, 0.05]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Volume */}
      {[-0.35, -0.75].map((y, i) => (
        <mesh key={i} position={[-1.08, y, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.07, 0.32, 0.05]} />
          <meshStandardMaterial color="#1a1a22" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}
      {/* Screen edge glow */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[2.18, 4.28, 0.02]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.08} transparent opacity={0.12} />
      </mesh>
    </group>
  );
});
