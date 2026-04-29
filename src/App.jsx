import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { AnimatePresence, motion } from 'framer-motion';
import Scene from './components/canvas/Scene';
import Loader from './components/Loader';
import ProjectDetail from './components/sections/ProjectDetail';
import ProjectArchive from './components/sections/ProjectArchive';
import { scrollState } from './lib/scrollState';
import {
  HeroPanel, AboutPanel, SkillsPanel,
  ProjectsPanel, ExperiencePanel, ContactPanel,
  ContactPanelMobile1, ContactPanelMobile2,
  ExperiencePanelMobile1, ExperiencePanelMobile2
} from './components/sections/SectionPanels';


gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

// Per-stop phone choreography
const getPhoneStates = (width) => {
  const isMobile = width < 768;
  if (isMobile) {
    return Array.from({ length: 12 }, () => ({ x: 0, y: 0, rotY: 0, scale: 0.7 }));
  }
  return [
    { x: 2.2, y: 0, rotY: 0, scale: 1.05 }, // 0 Hero
    { x: 3.5, y: 0.15, rotY: 0.1, scale: 0.9 }, // 1 About (pushed right)
    { x: 3.8, y: -0.1, rotY: -0.08, scale: 0.82 }, // 2 Skills (pushed right)
    { x: 4.5, y: 0, rotY: 0.05, scale: 0.62 }, // 3 Proj1
    { x: 4.5, y: -0.1, rotY: -0.05, scale: 0.62 }, // 4 Proj2
    { x: 4.5, y: 0.1, rotY: 0.05, scale: 0.62 }, // 5 Proj3
    { x: 4.5, y: 0, rotY: -0.05, scale: 0.62 }, // 6 Proj4
    { x: 4.5, y: -0.1, rotY: 0.05, scale: 0.62 }, // 7 Proj5 (MIPS)
    { x: 3.2, y: 0, rotY: 0, scale: 0.9 }, // 8 Experience
    { x: 2.8, y: 0, rotY: 0, scale: 1.0 }, // 9 Contact
  ];
};

// Map scroll stop → panel index
function stopToPanel(stop, isMobile) {
  if (!isMobile) {
    if (stop <= 2) return stop;
    if (stop <= 7) return 3; // projects
    return stop - 4;         // 8→4 Exp, 9→5 Contact
  } else {
    if (stop <= 2) return stop; // 0 Hero, 1 About, 2 Skills
    if (stop <= 7) return 3; // projects 3,4,5,6,7
    if (stop === 8) return 4; // Exp1
    if (stop === 9) return 5; // Exp2
    if (stop === 10) return 6; // Contact1
    return 7; // Contact2
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pinnedRef = useRef(null);
  const phoneRef = useRef(null);
  const panelRefs = useRef([]);
  const dotRefs = useRef([]);
  const tlRef = useRef(null);
  const currentStop = useRef(0);
  const isAnimating = useRef(false);
  const obsRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleLoaderDone = useCallback(() => setLoaded(true), []);
  const handleLoaderExiting = useCallback(() => setLoaderExiting(true), []);

  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
        window.scrollTo(0, 0); // Reset to start on resize
      }, 300);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Pause observer if modal is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
      if (obsRef.current) obsRef.current.disable();
    } else {
      document.body.style.overflow = '';
      if (obsRef.current) obsRef.current.enable();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProject]);

  const isMobile = windowWidth < 768;
  const STOPS = isMobile ? 11 : 9;
  const TOTAL_SCROLL = isMobile ? 2800 : 2400;
  const SNAP_POINTS = Array.from({ length: STOPS + 1 }, (_, i) => i / STOPS);

  // Nav helper — maps logical section (0-5) to scroll stop
  const SECTION_TO_STOP = isMobile ? [0, 1, 2, 3, 8, 10] : [0, 1, 2, 3, 8, 9];
  const scrollToSection = useCallback((sectionIdx) => {
    const stop = SECTION_TO_STOP[sectionIdx] ?? sectionIdx;
    const target = stop / STOPS;
    window.scrollTo({ top: target * TOTAL_SCROLL, behavior: 'smooth' });
    setMobileMenuOpen(false); // Close mobile menu on navigate
  }, [SECTION_TO_STOP, STOPS, TOTAL_SCROLL]);

  useEffect(() => {
    if (!loaded) return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(buildTimeline));

    function buildTimeline() {
      const PHONE_STATES = getPhoneStates(windowWidth);
      const panels = panelRefs.current.filter(Boolean);
      if (!pinnedRef.current || panels.length === 0) return;

      // ── MASTER TIMELINE ────────────────────────────────────────────────────
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
      tlRef.current = tl;

      // Labels at equal 1/STOPS intervals
      const LABELS = Array.from({ length: STOPS + 1 }, (_, i) => 's' + i);
      LABELS.forEach((lbl, i) => tl.addLabel(lbl, i / STOPS));

      // ── PANEL CROSSFADES (only at actual section boundaries) ───────────────
      const crossfades = isMobile ? [
        ['s1', 0, 1], // Hero -> About (at stop 1)
        ['s2', 1, 2], // About -> Skills (at stop 2)
        ['s3', 2, 3], // Skills -> Proj (at stop 3)
        ['s8', 3, 4], // Proj -> Exp1 (at stop 8)
        ['s9', 4, 5], // Exp1 -> Exp2 (at stop 9)
        ['s10', 5, 6], // Exp2 -> Contact1 (at stop 10)
        ['s11', 6, 7], // Contact1 -> Contact2 (at stop 11)
      ] : [
        ['s1', 0, 1],   // Hero → About (starts at s1)
        ['s2', 1, 2],   // About → Skills (starts at s2)
        ['s3', 2, 3],   // Skills → Projects (starts at s3)
        ['s8', 3, 4],  // Projects → Experience (starts at s8)
        ['s9', 4, 5],   // Experience → Contact (starts at s9)
      ];
      crossfades.forEach(([label, fromIdx, toIdx]) => {
        // Offset the transition so it completes BY the label, meaning it starts at prev stop
        tl.to(panels[fromIdx], { autoAlpha: 0, y: -36, duration: 1 / STOPS }, `${label}-=${1 / STOPS}`);
        tl.to(panels[toIdx], { autoAlpha: 1, y: 0, duration: 1 / STOPS }, `${label}-=${1 / STOPS}`);
      });

      // ── PROJECT CAROUSEL (xPercent of #project-track) ─────────────────────
      const projStart = 's3';
      const p1 = 's4';
      const p2 = 's5';
      const p3 = 's6';
      const pEnd = 's8';
      
      tl.set('#project-track', { xPercent: 0 }, projStart);
      tl.to('#project-track', { xPercent: -20, duration: 1 / STOPS }, projStart);
      tl.to('#project-track', { xPercent: -40, duration: 1 / STOPS }, p1);
      tl.to('#project-track', { xPercent: -60, duration: 1 / STOPS }, p2);
      tl.to('#project-track', { xPercent: -80, duration: 1 / STOPS }, p3);
      tl.set('#project-track', { xPercent: 0 }, pEnd);

      // ── PHONE CHOREOGRAPHY (per stop) ─────────────────────────────────────
      for (let i = 1; i <= STOPS; i++) {
        if (!phoneRef.current) break;
        const ps = PHONE_STATES[i];
        const prevLabel = LABELS[i - 1]; // tween from previous label to this label
        tl.to(phoneRef.current.position, { x: ps.x, y: ps.y, duration: 1 / STOPS }, prevLabel);
        tl.to(phoneRef.current.rotation, { y: ps.rotY, duration: 1 / STOPS }, prevLabel);
        tl.to(phoneRef.current.scale, { x: ps.scale, y: ps.scale, z: ps.scale, duration: 1 / STOPS }, prevLabel);
      }

      // ── SCROLL TRIGGER — snap to exact stop positions ─────────────────────
      // ── SCROLL TRIGGER — fallback snap for native scrollbar dragging ────────
      ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: 'top top',
        end: `+=${TOTAL_SCROLL}`,
        pin: true,
        anticipatePin: 1,
        animation: tl, // السر الأول: ربطنا التايم لاين بالـ ScrollTrigger عشان يشوف الـ Labels
        scrub: true,   // FIX 1: Instant scrub to prevent double-delay lag behind Observer
        onUpdate(self) {
          scrollState.progress = self.progress;
          const stop = Math.min(STOPS, Math.round(self.progress * STOPS));
          const panelIdx = stopToPanel(stop, isMobile);
          scrollState.section = panelIdx;

          // Sync pointer-events
          panels.forEach((p, i) => { p.style.pointerEvents = i === panelIdx ? 'auto' : 'none'; });

          // Sync dots
          dotRefs.current.forEach((d, i) => {
            if (!d) return;
            d.style.transform = i === stop ? 'scale(1.8)' : 'scale(1)';
            d.style.opacity = i === stop ? '1' : '0.3';
          });
          currentStop.current = stop;
        },
      });

      // ── OBSERVER — Intercept Wheel/Touch for Strict Presentation Snapping ───
      obsRef.current = Observer.create({
        target: window,
        type: 'wheel,touch',
        preventDefault: true,
        wheelSpeed: -1,            // FIX 3: Prevent native scroll wheel from jumping over sections
        tolerance: 10,
        onUp: () => gotoNext(),    // FIX 3: swiped up / wheel down -> MORE content
        onDown: () => gotoPrev(),  // FIX 3: swiped down / wheel up -> PREV content
      });

      function gotoNext() {
        if (isAnimating.current) return;
        const nextStop = Math.min(STOPS, currentStop.current + 1);
        if (nextStop !== currentStop.current) {
          snapToStop(nextStop);
        }
      }

      function gotoPrev() {
        if (isAnimating.current) return;
        const prevStop = Math.max(0, currentStop.current - 1);
        if (prevStop !== currentStop.current) {
          snapToStop(prevStop);
        }
      }

      function snapToStop(stopIdx) {
        isAnimating.current = true;
        const targetScroll = (stopIdx / STOPS) * TOTAL_SCROLL;
        gsap.to(window, {
          scrollTo: targetScroll,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => {
            isAnimating.current = false;
          }
        });
      }

      // ── ENTRANCE ANIMATION — phone swoops in after loader ─────────────────
      // Point 3: Set phone off-screen right initially, then swoop in
      if (phoneRef.current) {
        gsap.set(phoneRef.current.position, { x: 7 });
        gsap.set(phoneRef.current.scale, { x: 0.5, y: 0.5, z: 0.5 });
        gsap.timeline({ delay: 0.15 })
          .to(phoneRef.current.position, { x: PHONE_STATES[0].x, duration: 1.0, ease: 'power3.out' })
          .to(phoneRef.current.scale, { x: PHONE_STATES[0].scale, y: PHONE_STATES[0].scale, z: PHONE_STATES[0].scale, duration: 0.9, ease: 'back.out(1.2)' }, 0.1);
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      if (obsRef.current) obsRef.current.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [loaded, windowWidth]);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      <AnimatePresence>
        {!loaded && <Loader key="loader" onComplete={handleLoaderDone} onExiting={handleLoaderExiting} readyToExit={sceneReady} />}
      </AnimatePresence>

      {/* Point 4: Canvas is ALWAYS mounted at top level — never unmounts on project open */}
      <AnimatePresence mode="wait">
        {activeProject === 'ARCHIVE' ? (
          <ProjectArchive key="archive" onClose={() => setActiveProject(null)} onOpenProject={setActiveProject} />
        ) : activeProject ? (
          <ProjectDetail key="project-modal" project={activeProject} onClose={() => setActiveProject(null)} />
        ) : null}
      </AnimatePresence>

      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <Scene phoneRef={phoneRef} onLoaded={() => setSceneReady(true)} />

      </div>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-8 md:px-16 py-5"
        style={{ zIndex: 50 }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', letterSpacing: '0.06em', cursor: 'pointer' }}
          onClick={() => scrollToSection(0)}>
          <span style={{ color: '#00FFD1' }}>&lt;</span>
          <span style={{ color: '#f4f4f5' }}>AMR</span>
          <span style={{ color: '#00FFD1' }}>/&gt;</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[['About', 1], ['Skills', 2], ['Work', 3], ['Experience', 4], ['Contact', 5]].map(([item, idx]) => (
            <button key={item} onClick={() => scrollToSection(idx)}
              style={{
                fontFamily: 'DM Sans', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'oklch(52% 0.02 264)', background: 'none', border: 'none', cursor: 'pointer', padding: 0
              }}
              onMouseEnter={e => e.target.style.color = '#00FFD1'}
              onMouseLeave={e => e.target.style.color = 'oklch(52% 0.02 264)'}>{item}</button>
          ))}
        </div>
        <a href="assets/Amr_Abdelazeem_Resume.pdf" download className="hidden md:inline-flex"
          style={{
            fontFamily: 'DM Sans', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '0.5rem 1.2rem', border: '1px solid #ffffff22', color: 'oklch(52% 0.02 264)',
            borderRadius: '9999px', textDecoration: 'none'
          }}
          onMouseEnter={e => { e.target.style.borderColor = '#00FFD1'; e.target.style.color = '#00FFD1' }}
          onMouseLeave={e => { e.target.style.borderColor = '#ffffff22'; e.target.style.color = 'oklch(52% 0.02 264)' }}>
          Resume ↓
        </a>

        {/* Mobile Hamburger Button */}
        <button className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer pointer-events-auto" onClick={() => setMobileMenuOpen(true)}>
          <div style={{ width: 24, height: 2, background: '#f4f4f5', borderRadius: 2 }} />
          <div style={{ width: 16, height: 2, background: '#00FFD1', borderRadius: 2, alignSelf: 'flex-end' }} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 flex flex-col items-center justify-center backdrop-blur-2xl bg-[#0a0a0f]/90"
            style={{ zIndex: 60 }}
          >
            <button className="absolute top-6 right-6 p-2" onClick={() => setMobileMenuOpen(false)}
              style={{ fontFamily: 'monospace', fontSize: '1.5rem', color: '#00FFD1', background: 'none', border: 'none' }}>
              ✕
            </button>
            <div className="flex flex-col items-center gap-8">
              {[['Home', 0], ['About', 1], ['Skills', 2], ['Work', 3], ['Experience', 4], ['Contact', 5]].map(([item, idx]) => (
                <button key={item} onClick={() => scrollToSection(idx)}
                  style={{
                    fontFamily: "'Bebas Neue'", fontSize: '2.5rem', letterSpacing: '0.1em',
                    color: 'oklch(96% 0.005 264)', background: 'none', border: 'none', cursor: 'pointer'
                  }}>
                  {item}
                </button>
              ))}
              <a href="assets/Amr_Abdelazeem_Resume.pdf" download
                style={{
                  marginTop: '2rem', fontFamily: 'DM Sans', fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '1rem 2.5rem', background: '#00FFD1', color: '#0a0a0f', fontWeight: 'bold',
                  borderRadius: '9999px', textDecoration: 'none'
                }}>
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side label */}
      <div className="fixed left-5 top-1/2 hidden md:block"
        style={{
          zIndex: 50, writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)',
          fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'oklch(22% 0.02 264)'
        }}>AMRSAEEDCSE · 2025</div>

      {/* Progress dots — 9 stops */}
      <div className="fixed right-5 top-1/2 flex flex-col gap-2"
        style={{ zIndex: 50, transform: 'translateY(-50%)' }}>
        {SNAP_POINTS.map((_, i) => (
          <div key={i} ref={el => dotRefs.current[i] = el}
            onClick={() => window.scrollTo({ top: (i / STOPS) * TOTAL_SCROLL, behavior: 'smooth' })}
            style={{
              width: i === 0 ? 7 : [3, 6].includes(i) ? 5 : 6,
              height: i === 0 ? 7 : [3, 6].includes(i) ? 5 : 6,
              borderRadius: '50%', background: '#f4f4f5',
              opacity: i === 0 ? 1 : 0.25, transform: i === 0 ? 'scale(1.8)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)', cursor: 'pointer',
            }} />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="fixed bottom-7 left-1/2 flex flex-col items-center gap-2 pointer-events-none"
        style={{ zIndex: 50, transform: 'translateX(-50%)', opacity: 0.35 }}>
        <span style={{
          fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.25em',
          color: 'oklch(52% 0.02 264)', textTransform: 'uppercase'
        }}>Scroll</span>
        <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, #00FFD1, transparent)' }} />
      </div>

      {/* ── PINNED CONTAINER ─────────────────────────────────────────────────── */}
      <motion.div ref={pinnedRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: (loaderExiting || loaded) ? 1 : 0, scale: (loaderExiting || loaded) ? 1 : 0.95 }}
        transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
        style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 10 }}>
        <HeroPanel panelRef={el => panelRefs.current[0] = el} scrollToSection={scrollToSection} />
        {isMobile ? (
          <>
            <AboutPanel panelRef={el => panelRefs.current[1] = el} />
            <SkillsPanel panelRef={el => panelRefs.current[2] = el} />
            <ProjectsPanel panelRef={el => panelRefs.current[3] = el} onProjectClick={setActiveProject} />
            <ExperiencePanelMobile1 panelRef={el => panelRefs.current[4] = el} />
            <ExperiencePanelMobile2 panelRef={el => panelRefs.current[5] = el} />
            <ContactPanelMobile1 panelRef={el => panelRefs.current[6] = el} />
            <ContactPanelMobile2 panelRef={el => panelRefs.current[7] = el} />
          </>
        ) : (
          <>
            <AboutPanel panelRef={el => panelRefs.current[1] = el} />
            <SkillsPanel panelRef={el => panelRefs.current[2] = el} />
            <ProjectsPanel panelRef={el => panelRefs.current[3] = el} onProjectClick={setActiveProject} />
            <ExperiencePanel panelRef={el => panelRefs.current[4] = el} />
            <ContactPanel panelRef={el => panelRefs.current[5] = el} />
          </>
        )}
      </motion.div>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 10, borderTop: '1px solid #ffffff0d',
        padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem', background: '#0a0a0f'
      }}>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', color: 'oklch(28% 0.02 264)' }}>
          © 2025 Amr Abdelazeem — Built with React &amp; Three.js
        </p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[['LinkedIn', 'https://linkedin.com/in/amrsaeed-cse'], ['GitHub', 'https://github.com/amrsaeedcse'], ['WhatsApp', 'https://wa.me/201121153059']].map(([l, h]) => (
            <a key={l} href={h} target="_blank" rel="noreferrer"
              style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', color: 'oklch(35% 0.02 264)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#00FFD1'}
              onMouseLeave={e => e.target.style.color = 'oklch(35% 0.02 264)'}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
