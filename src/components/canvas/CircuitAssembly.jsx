import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';

// Abstract humanoid shape generator (returns an array of node positions + assigned sections)
function generateCircuit(isMobile) {
  const nodeCount = isMobile ? 60 : 120;
  const nodes = [];
  const traces = [];

  // 1 point of light for section 0
  nodes.push({ pos: new THREE.Vector3(0, 0, 0), section: 0 });

  // Rough torso volumes (x, y, z, radius, section assignment)
  const volumes = [
    { pos: new THREE.Vector3(0, 0, 0), r: 0.5, s: 1 },       // Core / Heart
    { pos: new THREE.Vector3(0, 1.5, 0), r: 0.8, s: 2 },     // Upper Chest
    { pos: new THREE.Vector3(0, -1.5, 0), r: 0.6, s: 2 },    // Lower abdomen
    { pos: new THREE.Vector3(1.2, 1.2, -0.2), r: 0.5, s: 3 }, // Right Shoulder
    { pos: new THREE.Vector3(-1.2, 1.2, -0.2), r: 0.5, s: 3 },// Left Shoulder
    { pos: new THREE.Vector3(0, 2.8, 0.2), r: 0.4, s: 4 },   // Head / Mind
    { pos: new THREE.Vector3(1.8, 0, -0.4), r: 0.4, s: 4 },  // Right Arm
    { pos: new THREE.Vector3(-1.8, 0, -0.4), r: 0.4, s: 4 }, // Left Arm
    { pos: new THREE.Vector3(0, -3, 0), r: 0.5, s: 5 },      // Base / Legs
    { pos: new THREE.Vector3(0, 0, 0), r: 2.5, s: 5 },       // Aura / Halo for contact
  ];

  for (let i = 1; i < nodeCount; i++) {
    const vol = volumes[Math.floor(Math.random() * volumes.length)];
    const x = vol.pos.x + (Math.random() - 0.5) * vol.r * 2;
    const y = vol.pos.y + (Math.random() - 0.5) * vol.r * 2;
    const z = vol.pos.z + (Math.random() - 0.5) * vol.r * 2;
    nodes.push({ pos: new THREE.Vector3(x, y, z), section: vol.s });
  }

  // Generate traces by connecting nearest nodes in the same or n-1 section
  nodes.forEach((node, i) => {
    if (i === 0) return; // skip center point initially
    let nearest = null;
    let minDist = Infinity;
    
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const other = nodes[j];
      // Only connect if the other node was built previously or in the same step
      if (other.section > node.section) continue; 
      
      const dist = node.pos.distanceTo(other.pos);
      if (dist < minDist && dist > 0.1 && dist < 1.5) {
        minDist = dist;
        nearest = other;
      }
    }
    
    if (nearest) {
      traces.push({
        start: nearest.pos,
        end: node.pos,
        section: node.section
      });
    }
  });

  return { nodes, traces };
}

// Custom shader material for instanced geometry that draws based on a progress uniform
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    u_progress: { value: 0 },
    u_color: { value: new THREE.Color('#00FFD1') },
  },
  vertexShader: `
    attribute float a_section;
    varying float v_section;
    varying vec3 v_position;
    
    void main() {
      v_section = a_section;
      v_position = position;
      gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float u_progress;
    uniform vec3 u_color;
    varying float v_section;
    varying vec3 v_position;

    void main() {
      // If the trace's section is greater than current progress, hide it
      // We add a tiny gradient so it "draws" in
      float drawState = clamp(u_progress - v_section + 1.0, 0.0, 1.0);
      
      if (drawState <= 0.01) discard;

      // Glow effect based on position along the segment
      float intensity = 1.0;
      if (drawState < 1.0) {
        // Simple directional wipe along local Y
        float localProg = (v_position.y + 0.5); // 0 to 1
        if (localProg > drawState) discard;
        intensity = 2.0; // bright head of the trace
      }

      gl_FragColor = vec4(u_color * intensity, 1.0);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

export default function CircuitAssembly({ activeSection, isMobile }) {
  const tracesRef = useRef();
  const nodesRef = useRef();
  const { invalidate } = useThree();

  const uniforms = useRef({ u_progress: { value: 0 } });

  // Generate circuit data once
  const { nodes, traces } = useMemo(() => generateCircuit(isMobile), [isMobile]);

  useEffect(() => {
    // GSAP tween the progress uniform to the new active section
    // Use onUpdate: invalidate to only render frames when animating
    gsap.to(uniforms.current.u_progress, {
      value: activeSection,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: invalidate
    });
  }, [activeSection, invalidate]);

  useEffect(() => {
    // Setup instanced mesh matrices and section attributes
    const traceMesh = tracesRef.current;
    const nodeMesh = nodesRef.current;
    if (!traceMesh || !nodeMesh) return;

    const dummy = new THREE.Object3D();
    const traceSections = new Float32Array(traces.length);
    const nodeSections = new Float32Array(nodes.length);

    // Build Traces
    traces.forEach((trace, i) => {
      const dir = new THREE.Vector3().subVectors(trace.end, trace.start);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(trace.start, trace.end).multiplyScalar(0.5);
      
      dummy.position.copy(mid);
      // Orient the box along the line (default box Y is up)
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      dummy.scale.set(0.015, len, 0.015);
      dummy.updateMatrix();
      
      traceMesh.setMatrixAt(i, dummy.matrix);
      traceSections[i] = trace.section;
    });

    // Build Nodes
    nodes.forEach((node, i) => {
      dummy.position.copy(node.pos);
      dummy.scale.setScalar(0.04);
      dummy.quaternion.identity();
      dummy.updateMatrix();

      nodeMesh.setMatrixAt(i, dummy.matrix);
      nodeSections[i] = node.section;
    });

    traceMesh.geometry.setAttribute('a_section', new THREE.InstancedBufferAttribute(traceSections, 1));
    nodeMesh.geometry.setAttribute('a_section', new THREE.InstancedBufferAttribute(nodeSections, 1));

    traceMesh.instanceMatrix.needsUpdate = true;
    nodeMesh.instanceMatrix.needsUpdate = true;

    // Apply the local uniform ref to the shared material clone
    traceMesh.material = shaderMaterial.clone();
    traceMesh.material.uniforms.u_progress = uniforms.current;
    
    nodeMesh.material = shaderMaterial.clone();
    nodeMesh.material.uniforms.u_progress = uniforms.current;

    invalidate(); // Initial render
  }, [nodes, traces, invalidate]);

  return (
    <group position={[isMobile ? 0 : 2, 0, 0]} rotation={[0, 0, 0]}>
      <instancedMesh ref={tracesRef} args={[null, null, traces.length]}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
      
      <instancedMesh ref={nodesRef} args={[null, null, nodes.length]}>
        <circleGeometry args={[1, 8]} />
      </instancedMesh>
    </group>
  );
}
