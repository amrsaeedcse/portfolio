import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';
import Scene from './components/canvas/Scene';
import Loader from './components/Loader';
import { scrollState } from './lib/scrollState';
import {
  HeroPanel, AboutPanel, SkillsPanel,
  ProjectsPanel, ExperiencePanel, ContactPanel,
} from './components/sections/SectionPanels';

gsap.registerPlugin(ScrollTrigger);

// Phone choreography per section (index 0–5)
const PHONE_STATES = [
  { y: 0,    rotY: -0.2, scale: 1.0  },
  { y: 0.5,  rotY: 0.35, scale: 0.9  },
  { y: -0.4, rotY: -0.5, scale: 1.05 },
  { y: 0.8,  rotY: 0.6,  scale: 0.95 },
  { y: -0.5, rotY: -0.3, scale: 1.0  },
  { y: 0,    rotY: 0,    scale: 1.08 },
];
const LAMP_TARGETS = [0.05, 0.28, 0.52, 0.73, 0.88, 1.0];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const pinnedRef  = useRef(null);
  const phoneRef   = useRef(null);
  const panelRefs  = useRef([]);
  const dotRefs    = useRef([]);

  const handleLoaderDone = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (!loaded) return;

    let rafId = requestAnimationFrame(() => {
      let rafId2 = requestAnimationFrame(buildTimeline);
      return () => cancelAnimationFrame(rafId2);
    });

    function buildTimeline() {
      const panels = panelRefs.current.filter(Boolean);
      if (!pinnedRef.current || panels.length === 0) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: pinnedRef.current,
          start: 'top top',
          end: '+=3800',
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          onUpdate(self) {
            scrollState.progress = self.progress;
          },
        },
      });

      for (let i = 1; i < 6; i++) {
        const label = `s${i}`;
        const prev = panels[i - 1];
        const curr = panels[i];
        const ps = PHONE_STATES[i];

        tl.addLabel(label);

        tl.to(prev, { opacity: 0, y: -50, duration: 0.5,
          onStart() { prev.style.pointerEvents = 'none'; } }, label);

        tl.to(curr, { opacity: 1, y: 0, duration: 0.5,
          onStart() { curr.style.pointerEvents = 'auto'; } }, '<0.1');

        // Lamp intensity
        tl.to(scrollState, { lampIntensity: LAMP_TARGETS[i], duration: 1 }, '<');

        // Progress dots
        tl.call(() => {
          dotRefs.current.forEach((d, di) => {
            if (!d) return;
            d.style.transform = di === i ? 'scale(1.8)' : 'scale(1)';
            d.style.opacity   = di === i ? '1' : '0.3';
          });
        }, null, '<');

        // Phone
        if (phoneRef.current) {
          tl.to(phoneRef.current.position, { y: ps.y, duration: 1.2 }, '<');
          tl.to(phoneRef.current.rotation, { y: ps.rotY, duration: 1.2 }, '<');
          tl.to(phoneRef.current.scale,
            { x: ps.scale, y: ps.scale, z: ps.scale, duration: 1 }, '<0.2');
        }
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [loaded]);

  const panelComponents = [HeroPanel, AboutPanel, SkillsPanel, ProjectsPanel, ExperiencePanel, ContactPanel];

  return (
    <div className="grain" style={{ background: 'oklch(10% 0.01 264)', minHeight: '100vh' }}>

      {/* Loader */}
      <AnimatePresence>
        {!loaded && <Loader key="loader" onComplete={handleLoaderDone} />}
      </AnimatePresence>

      {/* Fixed 3D canvas */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <Scene phoneRef={phoneRef} />
      </div>

      {/* Atmosphere glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ position:'absolute', top:'-5%', left:'-15%', width:'45vw', height:'55vh', borderRadius:'50%', background:'radial-gradient(oklch(75% 0.18 60 / 0.1), transparent 70%)', filter:'blur(70px)' }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:'35vw', height:'40vh', borderRadius:'50%', background:'radial-gradient(oklch(68% 0.15 200 / 0.07), transparent 70%)', filter:'blur(80px)' }} />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 md:px-16 py-5" style={{ zIndex: 50 }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:'1.5rem', letterSpacing:'0.06em' }}>
          <span style={{ color:'oklch(68% 0.15 200)' }}>&lt;</span>
          <span style={{ color:'oklch(96% 0.005 264)' }}>AMR</span>
          <span style={{ color:'oklch(68% 0.15 200)' }}>/&gt;</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['About','Work','Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              style={{ fontFamily:'DM Sans', fontSize:'0.75rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'oklch(52% 0.02 264)', textDecoration:'none' }}
              onMouseEnter={e=>e.target.style.color='oklch(68% 0.15 200)'}
              onMouseLeave={e=>e.target.style.color='oklch(52% 0.02 264)'}>{item}</a>
          ))}
        </div>
        <a href="/assets/Amr_Abdelazeem_Resume.pdf" download
          style={{ fontFamily:'DM Sans', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.5rem 1.2rem', border:'1px solid oklch(22% 0.02 264)', color:'oklch(52% 0.02 264)', borderRadius:'9999px', textDecoration:'none' }}
          onMouseEnter={e=>{e.target.style.borderColor='oklch(68% 0.15 200)';e.target.style.color='oklch(68% 0.15 200)'}}
          onMouseLeave={e=>{e.target.style.borderColor='oklch(22% 0.02 264)';e.target.style.color='oklch(52% 0.02 264)'}}>
          Resume ↓
        </a>
      </nav>

      {/* Side label */}
      <div className="fixed left-5 top-1/2 hidden md:block" style={{ zIndex:50, writingMode:'vertical-rl', transform:'translateY(-50%) rotate(180deg)', fontFamily:'DM Sans', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'oklch(25% 0.02 264)' }}>
        AMRSAEEDCSE · 2025
      </div>

      {/* Progress dots */}
      <div className="fixed right-5 top-1/2 flex flex-col gap-3" style={{ zIndex:50, transform:'translateY(-50%)' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} ref={el => dotRefs.current[i] = el}
            style={{ width:7, height:7, borderRadius:'50%', background:'oklch(96% 0.005 264)', opacity: i===0?1:0.3, transform: i===0?'scale(1.8)':'scale(1)', transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }} />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="fixed bottom-7 left-1/2 flex flex-col items-center gap-2 scroll-hint"
        style={{ zIndex:50, transform:'translateX(-50%)', opacity:0.4 }}>
        <span style={{ fontFamily:'DM Sans', fontSize:'0.6rem', letterSpacing:'0.25em', color:'oklch(52% 0.02 264)', textTransform:'uppercase' }}>Scroll</span>
        <div style={{ width:1, height:28, background:'linear-gradient(to bottom, oklch(68% 0.15 200), transparent)' }} />
      </div>

      {/* Master pinned container — Flutter Stack: all children absolute inset-0 */}
      <div ref={pinnedRef} style={{ position:'relative', width:'100vw', height:'100vh', overflow:'hidden', zIndex:10 }}>
        {panelComponents.map((Panel, i) => (
          <Panel key={i} panelRef={el => panelRefs.current[i] = el} />
        ))}
      </div>

      {/* Footer */}
      <footer style={{ position:'relative', zIndex:10, borderTop:'1px solid oklch(18% 0.02 264)', padding:'2.5rem 4rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', background:'oklch(10% 0.01 264)' }}>
        <p style={{ fontFamily:'DM Sans', fontSize:'0.72rem', color:'oklch(28% 0.02 264)' }}>© 2025 Amr Abdelazeem. All rights reserved.</p>
        <div style={{ display:'flex', gap:'2rem' }}>
          {[['LinkedIn','https://linkedin.com/in/amrsaeed-cse'],['GitHub','https://github.com/amrsaeedcse'],['WhatsApp','https://wa.me/201121153059']].map(([l,h]) => (
            <a key={l} href={h} target="_blank" rel="noreferrer"
              style={{ fontFamily:'DM Sans', fontSize:'0.72rem', color:'oklch(35% 0.02 264)', textDecoration:'none' }}
              onMouseEnter={e=>e.target.style.color='oklch(68% 0.15 200)'}
              onMouseLeave={e=>e.target.style.color='oklch(35% 0.02 264)'}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
