import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Exposed as named export so Scene.jsx can import it with a forwardRef pattern
export const SkeletonModel = forwardRef(function SkeletonModel(props, ref) {
  const group = useRef();

  // Expose the group ref's Three.js Object3D to the parent via useImperativeHandle
  useImperativeHandle(ref, () => group.current, []);

  useFrame((state) => {
    // Subtle idle breathing — GSAP will override position/rotation during scroll
    if (group.current) {
      group.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.0005;
    }
  });

  return (
    <group ref={group} {...props}>
      {/* Outer wireframe shell */}
      <mesh castShadow>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#45d1fd"
          wireframe={true}
          emissive="#45d1fd"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Inner glowing core */}
      <mesh>
        <icosahedronGeometry args={[0.6, 2]} />
        <meshStandardMaterial
          color="#a855f7"
          transparent
          opacity={0.7}
          emissive="#a855f7"
          emissiveIntensity={1.2}
          roughness={0}
          metalness={0.9}
        />
      </mesh>
      {/* Orbiting ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#45d1fd"
          emissive="#45d1fd"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
});
