import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../../lib/scrollState';

// GSAP SKILL: Prefer transform + opacity for GPU performance.
// The phone uses TWO nested groups:
//   outerRef  ← GSAP controls x/y/scale (scroll choreography)
//   floatRef  ← useFrame controls y (idle float, never conflicts with GSAP)

const SCREENS = [
  (ctx, w, h, t, lp) => {
    ctx.fillStyle = '#040e1c';
    ctx.fillRect(0, 0, w, h);
    const grd = ctx.createLinearGradient(0, 0, w, h * 0.5);
    grd.addColorStop(0, '#00FFD122'); grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h * 0.45);
    ctx.strokeStyle = '#00FFD1'; ctx.lineWidth = 2;
    const r = 80 + Math.sin(t * 1.5) * 8;
    ctx.beginPath(); ctx.arc(w / 2, h * 0.38, r, 0, Math.PI * 2);
    ctx.globalAlpha = 0.5; ctx.stroke(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(w / 2, h * 0.38, r * 0.6, 0, Math.PI * 2);
    ctx.strokeStyle = '#00FFD155'; ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 52px monospace'; ctx.textAlign = 'center';
    ctx.fillText('AMR', w / 2, h * 0.38 + 18);
    ctx.font = '18px monospace'; ctx.fillStyle = '#00FFD1';
    ctx.fillText('PORTFOLIO 2025', w / 2, h * 0.55);
    ctx.font = '13px sans-serif'; ctx.fillStyle = '#ffffff55';
    ctx.fillText('Flutter · IoT · Systems', w / 2, h * 0.62);
    ctx.textAlign = 'left';
  },
  (ctx, w, h, t) => {
    ctx.fillStyle = '#0e0818'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1a0f2e';
    ctx.beginPath(); ctx.roundRect(30, 80, w-60, 270, 20); ctx.fill();
    ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(w/2, 195, 65, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = '#8b5cf6'; ctx.font = 'bold 28px monospace'; ctx.textAlign='center';
    ctx.fillText('AMR', w/2, 205);
    ctx.font='14px sans-serif'; ctx.fillStyle='#ffffff88'; ctx.fillText('Engineer at Heart', w/2, 300);
    ctx.textAlign='left';
    [['3+','Years'],['10+','Projects'],['2','Certs']].forEach(([n,l],i)=>{
      const x=50+i*145; ctx.fillStyle='#8b5cf622';
      ctx.beginPath(); ctx.roundRect(x,390,120,75,10); ctx.fill();
      ctx.font='bold 28px monospace'; ctx.fillStyle='#8b5cf6'; ctx.fillText(n,x+14,435);
      ctx.font='12px sans-serif'; ctx.fillStyle='#ffffff55'; ctx.fillText(l,x+14,455);
    });
  },
  (ctx, w, h, t, lp) => {
    ctx.fillStyle = '#06160e'; ctx.fillRect(0, 0, w, h);
    ctx.font='bold 22px monospace'; ctx.fillStyle='#00FFD1'; ctx.fillText('TECH STACK', 30, 90);
    const skills=[['Flutter',95,'#0ea5e9'],['Dart',90,'#0ea5e9'],['C/C++',80,'#f59e0b'],['ESP32',75,'#f59e0b'],['Firebase',85,'#00FFD1'],['React',70,'#00FFD1'],['Git',88,'#a855f7'],['VHDL',65,'#a855f7']];
    skills.forEach(([name,pct,color],i)=>{
      const y=140+i*80;
      ctx.font='14px monospace'; ctx.fillStyle='#ffffff99'; ctx.fillText(name,30,y);
      ctx.fillStyle=color; ctx.fillText(`${pct}%`,430,y);
      ctx.fillStyle='#ffffff11'; ctx.beginPath(); ctx.roundRect(30,y+10,430,14,7); ctx.fill();
      const fill=(pct/100)*Math.min(1,lp*2+0.2);
      ctx.fillStyle=color; ctx.beginPath(); ctx.roundRect(30,y+10,430*fill,14,7); ctx.fill();
    });
  },
  (ctx, w, h, t) => {
    ctx.fillStyle='#100a02'; ctx.fillRect(0,0,w,h);
    ctx.font='bold 22px monospace'; ctx.fillStyle='#f59e0b'; ctx.fillText('PROJECTS',30,90);
    [['Batrina','E-Commerce · Flutter','#0ea5e9'],['AI Todo','AI Task · OpenAI','#10b981'],['Green Guardian','IoT · ESP32','#00FFD1'],['MIPS-32','Hardware · VHDL','#f59e0b'],['Spotify Clone','Music App · Flutter','#a855f7']].forEach(([name,sub,color],i)=>{
      const y=130+i*142;
      ctx.fillStyle=color+'15'; ctx.beginPath(); ctx.roundRect(20,y,w-40,122,12); ctx.fill();
      ctx.strokeStyle=color+(0.4+Math.sin(t*2+i)*0.2).toString(16).padStart(2,'0');
      ctx.lineWidth=1; ctx.stroke();
      ctx.fillStyle=color; ctx.beginPath(); ctx.roundRect(28,y+12,6,88,3); ctx.fill();
      ctx.font='bold 18px monospace'; ctx.fillStyle='#ffffffee'; ctx.fillText(name,50,y+46);
      ctx.font='13px sans-serif'; ctx.fillStyle='#ffffff66'; ctx.fillText(sub,50,y+70);
      ctx.font='bold 18px monospace'; ctx.fillStyle=color+'aa'; ctx.fillText('→',w-55,y+60);
    });
  },
  (ctx, w, h, t) => {
    ctx.fillStyle='#0a0615'; ctx.fillRect(0,0,w,h);
    ctx.font='bold 22px monospace'; ctx.fillStyle='#ec4899'; ctx.fillText('MY JOURNEY',30,90);
    ctx.strokeStyle='#ffffff11'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(50,130); ctx.lineTo(50,820); ctx.stroke();
    [['2024–Now','DEPI Trainee','Mobile App · Flutter','#0ea5e9'],['Summer 2024','ITI Trainee','Flutter & Dart','#a855f7'],['2021–Now','Zagazig Uni','Computer Engineering','#00FFD1']].forEach(([date,title,sub,color],i)=>{
      const y=155+i*220;
      ctx.fillStyle=color; ctx.beginPath(); ctx.arc(50,y,10,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#0a0615'; ctx.beginPath(); ctx.arc(50,y,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=color+'14'; ctx.beginPath(); ctx.roundRect(75,y-50,w-100,158,10); ctx.fill();
      ctx.font='12px monospace'; ctx.fillStyle=color; ctx.fillText(date,90,y-20);
      ctx.font='bold 20px monospace'; ctx.fillStyle='#ffffffee'; ctx.fillText(title,90,y+14);
      ctx.font='14px sans-serif'; ctx.fillStyle='#ffffff66'; ctx.fillText(sub,90,y+42);
    });
  },
  (ctx, w, h, t) => {
    ctx.fillStyle='#030e14'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#00FFD111'; ctx.fillRect(0,0,w,80);
    ctx.font='bold 20px monospace'; ctx.fillStyle='#00FFD1'; ctx.fillText('📨  Let\'s Talk',24,48);
    [{ text:'Hello! 👋',from:'user',y:130},{ text:'Hi! I\'m Amr.\nFlutter & IoT.',from:'amr',y:220},{ text:'Got a project?',from:'user',y:370},{ text:'Let\'s build\nsomething amazing.',from:'amr',y:460},{ text:'Drop me a message!',from:'amr',y:610}].forEach(({text,from,y})=>{
      const isAmr=from==='amr'; const lines=text.split('\n');
      const bw=300; const bh=lines.length>1?80:50;
      ctx.fillStyle=isAmr?'#00FFD122':'#ffffff11'; ctx.beginPath();
      const rx=isAmr?24:w-24-bw; ctx.roundRect(rx,y,bw,bh,12); ctx.fill();
      ctx.font='16px sans-serif'; ctx.fillStyle=isAmr?'#00FFD1ee':'#ffffffcc';
      lines.forEach((l,li)=>ctx.fillText(l,rx+14,y+26+li*24));
    });
    ctx.fillStyle='#00FFD111'; ctx.fillRect(0,h-90,w,90);
    ctx.fillStyle='#ffffff22'; ctx.beginPath(); ctx.roundRect(20,h-72,380,44,22); ctx.fill();
    ctx.font='14px sans-serif'; ctx.fillStyle='#ffffff44'; ctx.fillText('Type a message...',40,h-44);
    ctx.fillStyle='#00FFD1'; ctx.beginPath(); ctx.arc(w-35,h-50,22,0,Math.PI*2); ctx.fill();
    ctx.font='bold 18px monospace'; ctx.fillStyle='#000'; ctx.textAlign='center'; ctx.fillText('→',w-35,h-43); ctx.textAlign='left';
  },
];

function drawStatusBar(ctx, w, t, section) {
  const colors = ['#00FFD1','#8b5cf6','#10b981','#f59e0b','#ec4899','#00FFD1'];
  const color = colors[Math.min(5, section)];
  ctx.fillStyle='#00000055'; ctx.fillRect(0,0,w,48);
  ctx.font='bold 18px monospace'; ctx.fillStyle=color; ctx.fillText('9:41',20,32);
  [8,13,18,23].forEach((bh,i)=>{ ctx.fillStyle=i<=2?color:color+'44'; ctx.fillRect(w-95+i*14,32-bh,9,bh); });
  const charge=0.3+scrollState.lampIntensity*0.7;
  ctx.strokeStyle=color+'88'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.roundRect(w-48,14,36,20,3); ctx.stroke();
  ctx.fillStyle=color; ctx.fillRect(w-47,15,34*charge,18);
  ctx.fillStyle=color+'88'; ctx.fillRect(w-12,20,4,10);
}

export const PhoneMockup = React.forwardRef(function PhoneMockup(props, ref) {
  const outerRef = useRef();  // GSAP controls x,y,scale on this
  const floatRef = useRef();  // useFrame controls idle y-float on this (no conflict)
  const screenRef = useRef();

  // Expose outer group to GSAP via forwarded ref
  React.useImperativeHandle(ref, () => outerRef.current, []);

  const { texture, canvas, ctx } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 900;
    const ctx = canvas.getContext('2d');
    return { texture: new THREE.CanvasTexture(canvas), canvas, ctx };
  }, []);

  useFrame((state) => {
    if (!floatRef.current) return;
    const t = state.clock.elapsedTime;

    // 3d-web-experience SKILL: smooth idle float on INNER group, isolated from GSAP
    floatRef.current.position.y = Math.sin(t * 1.1) * 0.14;

    const section = scrollState.section;
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    SCREENS[section](ctx, w, h, t, scrollState.lampIntensity);
    drawStatusBar(ctx, w, t, section);
    texture.needsUpdate = true;

    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.3 + scrollState.lampIntensity * 0.7;
    }
  });

  return (
    // OUTER group — GSAP target (x, y, scale)
    <group ref={outerRef} {...props}>
      {/* INNER group — float animation (y only, never conflicts) */}
      <group ref={floatRef}>
        {/* Phone body */}
        <mesh castShadow>
          <boxGeometry args={[2.1, 4.2, 0.2]} />
          <meshStandardMaterial color="#0d0d14" metalness={0.94} roughness={0.1} />
        </mesh>
        {/* Bezel */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[1.88, 3.88, 0.01]} />
          <meshStandardMaterial color="#06060c" roughness={0.5} />
        </mesh>
        {/* Screen */}
        <mesh ref={screenRef} position={[0, 0, 0.108]}>
          <planeGeometry args={[1.82, 3.78]} />
          <meshStandardMaterial
            map={texture} emissiveMap={texture}
            emissive={new THREE.Color(1,1,1)} emissiveIntensity={0.3} roughness={0}
          />
        </mesh>
        {/* Glass shimmer */}
        <mesh position={[-0.3, 0.8, 0.115]} rotation={[0,0,0.3]}>
          <planeGeometry args={[0.3, 2]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} depthWrite={false} />
        </mesh>
        {/* Notch */}
        <mesh position={[0, 1.87, 0.115]}>
          <capsuleGeometry args={[0.07, 0.44, 4, 8]} />
          <meshStandardMaterial color="#06060c" roughness={0.8} />
        </mesh>
        {/* Buttons */}
        <mesh position={[1.08, 0.7, 0]} rotation={[0,Math.PI/2,0]}>
          <boxGeometry args={[0.07, 0.46, 0.05]} />
          <meshStandardMaterial color="#1a1a24" metalness={0.95} roughness={0.1} emissive="#00FFD1" emissiveIntensity={0.2} />
        </mesh>
        {[-0.35,-0.75].map((y,i)=>(
          <mesh key={i} position={[-1.08,y,0]} rotation={[0,Math.PI/2,0]}>
            <boxGeometry args={[0.07,0.33,0.05]} />
            <meshStandardMaterial color="#1a1a24" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
        {/* Speaker */}
        {[-0.3,-0.15,0,0.15,0.3].map((x,i)=>(
          <mesh key={i} position={[x,-2.02,0.1]}>
            <sphereGeometry args={[0.025,6,6]} />
            <meshStandardMaterial color="#0a0a12" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Cyan edge glow ring */}
        <mesh position={[0,0,-0.015]}>
          <boxGeometry args={[2.18,4.28,0.02]} />
          <meshStandardMaterial color="#00FFD1" emissive="#00FFD1" emissiveIntensity={0.25} transparent opacity={0.18} />
        </mesh>
      </group>
    </group>
  );
});
