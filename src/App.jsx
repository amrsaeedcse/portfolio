import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';
import Scene from './components/canvas/Scene';
import Loader from './components/Loader';
import ProjectDetail from './components/sections/ProjectDetail';
import { scrollState } from './lib/scrollState';
import {
  HeroPanel, AboutPanel, SkillsPanel,
  ProjectsPanel, ExperiencePanel, ContactPanel,
} from './components/sections/SectionPanels';

gsap.registerPlugin(ScrollTrigger);

// Phone choreography — subtle, always facing front
const PHONE_STATES = [
  { y: 0,    rotY: 0,     scale: 1.0 },
  { y: 0.2,  rotY: 0.1,  scale: 0.96 },
  { y: -0.15,rotY: -0.08, scale: 1.0 },
  { y: 0.25, rotY: 0.08,  scale: 0.94 },
  { y: -0.2, rotY: -0.06, scale: 1.0 },
  { y: 0,    rotY: 0,     scale: 1.04 },
];

// ONE scroll = ONE section. 6 sections × short distance each.
const TOTAL_SCROLL = 1800; // 6 sections × 360px each (very short, snaps fast)

export default function App() {
  const [loaded, setLoaded]               = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const pinnedRef   = useRef(null);
  const phoneRef    = useRef(null);
  const panelRefs   = useRef([]);
  const dotRefs     = useRef([]);
  const tlRef       = useRef(null);
  const currentSec  = useRef(0);
  const isAnim      = useRef(false);

  const handleLoaderDone = useCallback(() => setLoaded(true), []);

  // Navigate to section index — called by nav buttons + scroll handler
  const goToSection = useCallback((idx) => {
    if (idx < 0 || idx > 5) return;
    if (isAnim.current) return;

    isAnim.current = true;
    currentSec.current = idx;
    scrollState.progress = idx / 5;
    scrollState.lampIntensity = 0.05 + (idx / 5) * 0.95;

    const tl = tlRef.current;
    if (!tl) { isAnim.current = false; return; }

    // Animate timeline progress with gsap.to (works on free GSAP)
    const target = idx === 0 ? 0 : idx / 5;
    gsap.to(tl, {
      progress: target,
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: () => { isAnim.current = false; },
    });

    // Sync UI immediately
    const panels = panelRefs.current.filter(Boolean);
    panels.forEach((p, i) => { p.style.pointerEvents = i === idx ? 'auto' : 'none'; });
    dotRefs.current.forEach((d, i) => {
      if (!d) return;
      d.style.transform = i === idx ? 'scale(1.8)' : 'scale(1)';
      d.style.opacity   = i === idx ? '1' : '0.3';
    });
  }, []);

  const scrollToSection = useCallback((idx) => goToSection(idx), [goToSection]);

  useEffect(() => {
    if (!loaded) return;

    // Double RAF — ensure DOM is fully painted
    const raf = requestAnimationFrame(() => requestAnimationFrame(buildTimeline));

    function buildTimeline() {
      const panels = panelRefs.current.filter(Boolean);
      if (!pinnedRef.current || panels.length === 0) return;

      // ── MASTER TIMELINE (paused — driven by snap ScrollTrigger) ─────────────
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.inOut' },
      });
      tlRef.current = tl;

      // Add s0 at position 0 for snap to include start
      tl.addLabel('s0', 0);

      for (let i = 1; i < 6; i++) {
        const label = `s${i}`;
        const prev = panels[i - 1];
        const curr = panels[i];
        const ps = PHONE_STATES[i];

        tl.addLabel(label, i / 5);   // each section at equal 0.2 intervals

        tl.to(prev, { autoAlpha: 0, y: -40, duration: 0.4 }, label);
        tl.to(curr, { autoAlpha: 1, y: 0,   duration: 0.4 }, '<0.08');

        if (phoneRef.current) {
          tl.to(phoneRef.current.position, { x: 5, duration: 0.2 }, label);
          tl.to(phoneRef.current.position, { x: 2.5, y: ps.y, duration: 0.4 }, `${label}+=0.22`);
          tl.to(phoneRef.current.rotation, { y: ps.rotY, duration: 0.5 }, '<');
          tl.to(phoneRef.current.scale, { x: ps.scale, y: ps.scale, z: ps.scale, duration: 0.4 }, '<0.1');
        }

        // Section entrance animations
        if (i === 1) {
          tl.to('#hero-content', { x: -80, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, label);
          tl.fromTo('#about-photo',
            { x: -70, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, `${label}+=0.18`);
          tl.fromTo('#about-text-content',
            { x: 70, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, '<');
        }
        if (i === 2) {
          tl.fromTo('.skill-card',
            { scale: 0.82, autoAlpha: 0, y: 18 },
            { scale: 1, autoAlpha: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)',
              stagger: { each: 0.1 }, immediateRender: false }, `${label}+=0.15`);
        }
        if (i === 3) {
          tl.fromTo('.project-card',
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out',
              stagger: { each: 0.12 }, immediateRender: false }, `${label}+=0.15`);
        }
      }

      // ── SCROLL TRIGGER — snap makes one scroll = one section ─────────────────
      ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: 'top top',
        end: `+=${TOTAL_SCROLL}`,
        pin: true,
        anticipatePin: 1,
        snap: {
          snapTo: [0, 0.2, 0.4, 0.6, 0.8, 1.0], // 6 exact stops
          duration: { min: 0.3, max: 0.55 },
          ease: 'power2.inOut',
          delay: 0.05,
        },
        onUpdate(self) {
          scrollState.progress = self.progress;
          const idx = Math.min(5, Math.round(self.progress * 5));
          tl.progress(self.progress);

          // Sync pointer-events every frame (both directions)
          const panels = panelRefs.current.filter(Boolean);
          panels.forEach((p, i) => { p.style.pointerEvents = i === idx ? 'auto' : 'none'; });
          dotRefs.current.forEach((d, i) => {
            if (!d) return;
            d.style.transform = i === idx ? 'scale(1.8)' : 'scale(1)';
            d.style.opacity   = i === idx ? '1' : '0.3';
          });
          currentSec.current = idx;
        },
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (tlRef.current) tlRef.current.kill();
    };
  }, [loaded]);

  const panelComponents = [HeroPanel, AboutPanel, SkillsPanel, ProjectsPanel, ExperiencePanel, ContactPanel];

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      {/* Cinematic loader */}
      <AnimatePresence>
        {!loaded && <Loader key="loader" onComplete={handleLoaderDone} />}
      </AnimatePresence>

      {/* Project detail overlay */}
      <AnimatePresence>
        {activeProject && (
          <ProjectDetail
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>

      {/* Fixed 3D canvas — full screen, behind HTML */}
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <Scene phoneRef={phoneRef} />
      </div>

      {/* Subtle atmosphere glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:'35vw', height:'40vh', borderRadius:'50%', background:'radial-gradient(#00FFD108, transparent 70%)', filter:'blur(80px)' }} />
      </div>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 md:px-16 py-5"
        style={{ zIndex: 50 }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:'1.5rem', letterSpacing:'0.06em', cursor:'pointer' }}
          onClick={() => scrollToSection(0)}>
          <span style={{ color:'#00FFD1' }}>&lt;</span>
          <span style={{ color:'#f4f4f5' }}>AMR</span>
          <span style={{ color:'#00FFD1' }}>/&gt;</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[['About',1],['Work',3],['Contact',5]].map(([item, idx]) => (
            <button key={item} onClick={() => scrollToSection(idx)}
              style={{ fontFamily:'DM Sans', fontSize:'0.75rem', letterSpacing:'0.15em', textTransform:'uppercase',
                color:'oklch(52% 0.02 264)', background:'none', border:'none', cursor:'pointer', padding:0,
                transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='#00FFD1'}
              onMouseLeave={e=>e.target.style.color='oklch(52% 0.02 264)'}>{item}</button>
          ))}
        </div>
        <a href="/assets/Amr_Abdelazeem_Resume.pdf" download
          style={{ fontFamily:'DM Sans', fontSize:'0.72rem', letterSpacing:'0.1em', textTransform:'uppercase',
            padding:'0.5rem 1.2rem', border:'1px solid #ffffff22', color:'oklch(52% 0.02 264)', borderRadius:'9999px',
            textDecoration:'none', transition:'all 0.2s' }}
          onMouseEnter={e=>{e.target.style.borderColor='#00FFD1';e.target.style.color='#00FFD1'}}
          onMouseLeave={e=>{e.target.style.borderColor='#ffffff22';e.target.style.color='oklch(52% 0.02 264)'}}>
          Resume ↓
        </a>
      </nav>

      {/* Side label */}
      <div className="fixed left-5 top-1/2 hidden md:block"
        style={{ zIndex:50, writingMode:'vertical-rl', transform:'translateY(-50%) rotate(180deg)',
          fontFamily:'DM Sans', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase',
          color:'oklch(22% 0.02 264)' }}>
        AMRSAEEDCSE · 2025
      </div>

      {/* Progress dots */}
      <div className="fixed right-5 top-1/2 flex flex-col gap-3"
        style={{ zIndex:50, transform:'translateY(-50%)' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} ref={el => dotRefs.current[i] = el}
            onClick={() => scrollToSection(i)}
            style={{ width:7, height:7, borderRadius:'50%', background:'#f4f4f5',
              opacity: i===0?1:0.3, transform: i===0?'scale(1.8)':'scale(1)',
              transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)', cursor:'pointer' }} />
        ))}
      </div>

      {/* Scroll hint (shown at section 0 only) */}
      <div className="fixed bottom-7 left-1/2 flex flex-col items-center gap-2"
        style={{ zIndex:50, transform:'translateX(-50%)', opacity:0.35, pointerEvents:'none' }}>
        <span style={{ fontFamily:'DM Sans', fontSize:'0.6rem', letterSpacing:'0.25em',
          color:'oklch(52% 0.02 264)', textTransform:'uppercase' }}>Scroll</span>
        <div style={{ width:1, height:28, background:'linear-gradient(to bottom, #00FFD1, transparent)' }} />
      </div>

      {/* ── PINNED SECTION CONTAINER ─────────────────────────────────────────── */}
      <div ref={pinnedRef}
        style={{ position:'relative', width:'100vw', height:'100vh', overflow:'hidden', zIndex:10 }}>
        {panelComponents.map((Panel, i) => (
          <Panel
            key={i}
            panelRef={el => panelRefs.current[i] = el}
            scrollToSection={scrollToSection}
            onProjectClick={i === 3 ? setActiveProject : undefined}
          />
        ))}
      </div>

      {/* Footer */}
      <footer style={{ position:'relative', zIndex:10, borderTop:'1px solid #ffffff0d',
        padding:'2rem 4rem', display:'flex', justifyContent:'space-between', alignItems:'center',
        flexWrap:'wrap', gap:'1rem', background:'#0a0a0f' }}>
        <p style={{ fontFamily:'DM Sans', fontSize:'0.72rem', color:'oklch(28% 0.02 264)' }}>
          © 2025 Amr Abdelazeem — Built with React &amp; Three.js
        </p>
        <div style={{ display:'flex', gap:'2rem' }}>
          {[['LinkedIn','https://linkedin.com/in/amrsaeed-cse'],['GitHub','https://github.com/amrsaeedcse'],['WhatsApp','https://wa.me/201121153059']].map(([l,h])=>(
            <a key={l} href={h} target="_blank" rel="noreferrer"
              style={{ fontFamily:'DM Sans', fontSize:'0.72rem', color:'oklch(35% 0.02 264)', textDecoration:'none',
                transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='#00FFD1'}
              onMouseLeave={e=>e.target.style.color='oklch(35% 0.02 264)'}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
