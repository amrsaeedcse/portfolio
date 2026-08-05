import { useRef, useEffect, useState, useCallback, Suspense, lazy } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from './components/Loader';
const ProjectDetail = lazy(() => import('./components/sections/ProjectDetail'));
const ProjectArchive = lazy(() => import('./components/sections/ProjectArchive'));
import { scrollState } from './lib/scrollState';
import {
  HeroPanel, AboutPanel, SkillsPanel,
  ProjectsPanel, ExperiencePanel, ContactPanel,
  ContactPanelMobile1, ContactPanelMobile2,
  ExperiencePanelMobile
} from './components/sections/SectionPanels';
import ParticleCanvas from './components/ui/ParticleCanvas';


gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);



// Map scroll stop → panel index
function stopToPanel(stop, isMobile) {
  if (!isMobile) {
    if (stop <= 2) return stop;
    if (stop <= 7) return 3; // projects
    return stop - 4;         // 8→4 Exp, 9→5 Contact
  } else {
    if (stop <= 2) return stop; // 0 Hero, 1 About, 2 Skills
    if (stop <= 7) return 3; // projects 3,4,5,6,7
    if (stop === 8) return 4; // Exp (single mobile screen)
    if (stop === 9) return 5; // Contact1
    return 6; // Contact2 (stop 10)
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [sceneReady] = useState(true);

  const [activeProject, setActiveProject] = useState(null);
  const [activePanel, setActivePanel] = useState(0);
  const activePanelRef = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pinnedRef = useRef(null);
  const panelRefs = useRef([]);
  const dotRefs = useRef([]);
  const tlRef = useRef(null);
  const currentStop = useRef(0);
  const isAnimating = useRef(false);
  const obsRef = useRef(null);
  const goToStopRef = useRef(null);
  const reducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  // VERCEL SKILL: rerender-lazy-state-init — pass a function to useState
  // so window.innerWidth is only read once during mount, not on every render.
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);

  const handleLoaderDone = useCallback(() => setLoaded(true), []);
  const handleLoaderExiting = useCallback(() => setLoaderExiting(true), []);

  useEffect(() => {
    let timeoutId = null;
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth !== lastWidth) {
          lastWidth = window.innerWidth;
          setWindowWidth(window.innerWidth);
        }
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
      obsRef.current?.disable();
    } else {
      document.body.style.overflow = '';
      obsRef.current?.enable();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProject]);

  const isMobile = windowWidth < 768;
  const STOPS = isMobile ? 10 : 9;
  const TOTAL_SCROLL = isMobile ? 2600 : 2400;
  const SNAP_POINTS = Array.from({ length: STOPS + 1 }, (_, i) => i / STOPS);

  // Nav helper — maps logical section (0-5) to scroll stop
  const scrollToSection = useCallback((sectionIdx) => {
    const sectionToStop = isMobile ? [0, 1, 2, 3, 8, 9] : [0, 1, 2, 3, 8, 9];
    const stop = sectionToStop[sectionIdx] ?? sectionIdx;
    if (goToStopRef.current) goToStopRef.current(stop);
    else window.scrollTo({ top: (stop / STOPS) * TOTAL_SCROLL, behavior: 'smooth' });
    setMobileMenuOpen(false); // Close mobile menu on navigate
  }, [isMobile, STOPS, TOTAL_SCROLL]);

  useEffect(() => {
    if (!loaded) return;
    let disposeTimeline = null;
    const raf = requestAnimationFrame(() => requestAnimationFrame(buildTimeline));

    function buildTimeline() {
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
        ['s8', 3, 4], // Proj -> Exp (at stop 8)
        ['s9', 4, 5], // Exp -> Contact1 (at stop 9)
        ['s10', 5, 6], // Contact1 -> Contact2 (at stop 10)
      ] : [
        ['s1', 0, 1],   // Hero → About (starts at s1)
        ['s2', 1, 2],   // About → Skills (starts at s2)
        ['s3', 2, 3],   // Skills → Projects (starts at s3)
        ['s8', 3, 4],  // Projects → Experience (starts at s8)
        ['s9', 4, 5],   // Experience → Contact (starts at s9)
      ];
      const transitionFor = (fromIdx, toIdx) => {
        if (fromIdx === 0 && toIdx === 1) return {
          out: { clipPath: 'inset(0 0 100% 0)' }, in: { clipPath: 'inset(100% 0 0 0)' },
        };
        if (fromIdx === 1 && toIdx === 2) return {
          out: { rotateX: -38, yPercent: -8, scale: 0.96 }, in: { rotateX: 32, yPercent: 8, scale: 0.96 },
        };
        // The project carousel stays visually uninterrupted.
        if (toIdx === 3 || fromIdx === 2) return { out: { xPercent: -8 }, in: { xPercent: 8 } };
        // Experience lands like a precise technical sweep, never a cube flip.
        if (fromIdx === 3 && toIdx === 4) return {
          out: { xPercent: -18, rotateZ: -2.5, scale: 0.96 },
          in: { xPercent: 18, rotateZ: 2.5, scale: 0.96 },
        };
        // The final sequence closes through an aperture, not another flip.
        if (toIdx >= 6 || (!isMobile && toIdx === 5)) return {
          out: { clipPath: 'inset(0 50% 0 50% round 50%)', scale: 0.9 },
          in: { clipPath: 'inset(0 50% 0 50% round 50%)', scale: 0.9 },
        };
        return { out: { xPercent: -14, rotateZ: -1.5 }, in: { xPercent: 14, rotateZ: 1.5 } };
      };

      const scrubPanels = false;
      crossfades.forEach(([label, fromIdx, toIdx]) => {
        // Panel transitions are handled discretely by navigateToStop below.
        // Keeping them out of the scrubbed timeline makes reverse scrolling deterministic.
        if (!scrubPanels) return;
        const startAt = `${label}-=${1 / STOPS}`;
        if (reducedMotion.current) {
          tl.to(panels[fromIdx], { autoAlpha: 0, duration: 0.01 }, startAt);
          tl.to(panels[toIdx], { autoAlpha: 1, duration: 0.01 }, startAt);
          return;
        }
        const motion = transitionFor(fromIdx, toIdx);
        tl.set(panels[toIdx], { autoAlpha: 1, y: 0, ...motion.in }, startAt);
        tl.to(panels[fromIdx], { autoAlpha: 0, y: 0, ...motion.out, duration: 1 / STOPS }, startAt);
        tl.to(panels[toIdx], {
          autoAlpha: 1, xPercent: 0, yPercent: 0, rotateX: 0, rotateY: 0,
          rotateZ: 0, z: 0, scale: 1, clipPath: 'inset(0 0 0 0)', duration: 1 / STOPS,
        }, startAt);
      });

      // ── PROJECT CAROUSEL (xPercent of #project-track) ─────────────────────
      // Projects stays a discrete, deterministic carousel. It is driven only
      // at completed stops so a wheel event cannot strand the track mid-card.
      const updateScrollDots = (activeIdx) => {
        dotRefs.current.forEach((d, i) => {
          if (!d) return;
          const inner = d.firstElementChild;
          if (!inner) return;
          const isActive = i === activeIdx;
          gsap.to(inner, {
            height: isActive ? (isMobile ? 14 : 24) : (isMobile ? 4 : 6),
            width: isMobile ? 3 : 6,
            backgroundColor: isActive ? '#00FFD1' : '#f4f4f5',
            boxShadow: isActive ? '0 0 12px rgba(0,255,209,0.8)' : '0 0 0px transparent',
            opacity: isActive ? 1 : 0.25,
            duration: 0.35,
            ease: 'back.out(1.7)',
            overwrite: 'auto',
          });
        });
      };

      const syncProjectTrack = (stopIdx, duration = 0.5) => {
        const card = Math.max(0, Math.min(4, stopIdx - 3));
        gsap.to('#project-track', {
          xPercent: -card * 20,
          duration: reducedMotion.current ? 0 : duration,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        // Animate the bottom indicator dots in Projects section!
        [0, 1, 2, 3, 4].forEach(i => {
          gsap.to(`.proj-dot-${i}`, {
            width: i === card ? 28 : 8,
            backgroundColor: i === card ? '#00FFD1' : 'rgba(255, 255, 255, 0.22)',
            boxShadow: i === card ? '0 0 10px rgba(0,255,209,0.7)' : 'none',
            duration: reducedMotion.current ? 0 : 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      };
      gsap.set('#project-track', { xPercent: 0 });

      gsap.set(panels, { autoAlpha: 0, x: 0, y: 0, xPercent: 0, yPercent: 0, rotate: 0, scale: 1 });
      gsap.set(panels[activePanelRef.current], { autoAlpha: 1 });

      function animatePanelTransition(fromIdx, toIdx, direction) {
        if (fromIdx === toIdx) return;
        const from = panels[fromIdx];
        const to = panels[toIdx];
        if (!from || !to) return;
        gsap.killTweensOf([from, to]);

        if (reducedMotion.current) {
          gsap.set(from, { autoAlpha: 0 });
          gsap.set(to, { autoAlpha: 1, rotateY: 0, rotateX: 0, z: 0, scale: 1 });
          return;
        }

        // ── True 3-D Cube Rotation ─────────────────────────────────────────────
        // The pinned container has perspective set in CSS (.motion-stage).
        // Exiting face rotates -90° (forward) or +90° (backward) on Y axis.
        // Entering face starts at +90° (forward) or -90° (backward) and lands at 0°.
        // A subtle Z push (-80px) and scale-down (0.88) sells depth on exit.
        const fwdOut  = direction > 0 ? -88 : 88;
        const fwdIn   = direction > 0 ?  88 : -88;

        // Choose axis per transition pair for variety:
        // Projects carousel (idx 3) keeps a horizontal slide — never cube-flipped.
        const useXAxis = (fromIdx === 1 && toIdx === 2) || (fromIdx === 2 && toIdx === 1);
        const rotateKey = useXAxis ? 'rotateX' : 'rotateY';

        // Outgoing panel: spin off-screen
        gsap.to(from, {
          autoAlpha: 0,
          [rotateKey]: fwdOut,
          z: -120,
          scale: 0.88,
          duration: 0.42,
          ease: 'power2.in',
          overwrite: 'auto',
        });

        // Incoming panel: pre-position on opposite face, then spin to 0
        gsap.set(to, { autoAlpha: 1, [rotateKey]: fwdIn, z: -120, scale: 0.88 });
        gsap.to(to, {
          [rotateKey]: 0,
          z: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.56,
          ease: 'power3.out',
          delay: 0.06,
          overwrite: 'auto',
          onComplete: () => {
            // Clean up transform state so panel is pristine for next transition
            gsap.set(from, { rotateY: 0, rotateX: 0, z: 0, scale: 1 });
          },
        });
      }


      // ── SCROLL TRIGGER — snap to exact stop positions ─────────────────────
      // ── SCROLL TRIGGER — fallback snap for native scrollbar dragging ────────
      const scrollTrigger = ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: 'top top',
        end: `+=${TOTAL_SCROLL}`,
        pin: true,
        anticipatePin: 1,
        fastScrollEnd: false,
        invalidateOnRefresh: true,
        animation: tl,
        // VERCEL SKILL: Use scrub: 0.5 instead of true.
        // scrub:true = instant (causes jank when scroll jumps).
        // scrub:0.5 = 500ms lerp — eliminates perceived lag while staying smooth.
        scrub: reducedMotion.current ? false : 0.1,
        snap: false,
        onUpdate(self) {
          scrollState.progress = self.progress;
          const stop = Math.min(STOPS, Math.round(self.progress * STOPS));
          const panelIdx = stopToPanel(stop, isMobile);
          scrollState.section = panelIdx;
          
          // Compute logical section for the Phone Mockup screens (0 to 5)
          let logicalSection;
          if (stop <= 7) logicalSection = Math.min(3, stop);
          else if (stop === 8) logicalSection = 4;
          else logicalSection = 5;
          scrollState.logicalSection = logicalSection;

          // Sync pointer-events
          panels.forEach((p, i) => { p.style.pointerEvents = i === activePanelRef.current ? 'auto' : 'none'; });

          // Sync project carousel & scroll dots with smooth GSAP animations
          if (!isAnimating.current) {
            currentStop.current = stop;
            syncProjectTrack(stop, 0.2);
            updateScrollDots(stop);
          }
        },
      });

      // Presentation scrolling: one intentional wheel or swipe equals one stop.
      // Observer owns the gesture; ScrollTrigger owns the visual timeline.
      if (!reducedMotion.current) {
        obsRef.current = Observer.create({
          target: window,
          type: 'wheel,touch',
          preventDefault: true,
          wheelSpeed: -1,
          tolerance: 38,
          onUp: () => snapToStop(Math.min(STOPS, currentStop.current + 1)),
          onDown: () => snapToStop(Math.max(0, currentStop.current - 1)),
        });
      }

      // ── OBSERVER — Intercept Wheel/Touch for Strict Presentation Snapping ───

      // ── KEYBOARD NAVIGATION — WCAG 2.1.1 Keyboard (Level A) ─────────────────
      // Pause observer when a form field has focus so typing doesn't nav sections.
      const isFormField = () => {
        const el = document.activeElement;
        return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT');
      };

      const handleKeyDown = (e) => {
        if (isFormField()) return; // never hijack typing
        switch (e.key) {
          case 'ArrowDown':
          case 'PageDown':
          case ' ':              // Space
            e.preventDefault();
            snapToStop(Math.min(STOPS, currentStop.current + 1));
            break;
          case 'ArrowUp':
          case 'PageUp':
            e.preventDefault();
            snapToStop(Math.max(0, currentStop.current - 1));
            break;
          case 'Home':
            e.preventDefault();
            snapToStop(0);
            break;
          case 'End':
            e.preventDefault();
            snapToStop(STOPS);
            break;
          default:
            break;
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      function snapToStop(stopIdx) {
        if (isAnimating.current || stopIdx === currentStop.current) return;
        isAnimating.current = true;
        const fromPanel = activePanelRef.current;
        const toPanel = stopToPanel(stopIdx, isMobile);
        activePanelRef.current = toPanel;
        setActivePanel(toPanel);
        pinnedRef.current?.setAttribute('data-active-panel', String(toPanel));
        animatePanelTransition(fromPanel, toPanel, stopIdx > currentStop.current ? 1 : -1);
        currentStop.current = stopIdx;
        syncProjectTrack(stopIdx);
        updateScrollDots(stopIdx);
        const targetScroll = scrollTrigger.start + (stopIdx / STOPS) * TOTAL_SCROLL;
        gsap.to(window, {
          scrollTo: targetScroll,
          duration: reducedMotion.current ? 0 : 0.58,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => {
            isAnimating.current = false;
          },
          onInterrupt: () => { isAnimating.current = false; },
        });
      }
      goToStopRef.current = snapToStop;

      // ── ENTRANCE ANIMATION — phone swoops in after loader ─────────────────
      // Skipped entirely under prefers-reduced-motion — phone appears at rest position
      ScrollTrigger.refresh();
      disposeTimeline = () => {
        obsRef.current?.kill();
        goToStopRef.current = null;
        scrollTrigger.kill();
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      disposeTimeline?.();
    };
  }, [loaded, windowWidth, STOPS, TOTAL_SCROLL, isMobile]);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>

      <AnimatePresence>
        {!loaded && <Loader key="loader" onComplete={handleLoaderDone} onExiting={handleLoaderExiting} readyToExit={sceneReady} />}
      </AnimatePresence>

      {/* Point 4: Canvas is ALWAYS mounted at top level — never unmounts on project open */}
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {activeProject === 'ARCHIVE' ? (
            <ProjectArchive key="archive" onClose={() => setActiveProject(null)} onOpenProject={setActiveProject} />
          ) : activeProject ? (
            <ProjectDetail key="project-modal" project={activeProject} onClose={() => setActiveProject(null)} />
          ) : null}
        </AnimatePresence>
      </Suspense>

      <div className="fixed inset-0" style={{ zIndex: 0 }}>
      </div>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 md:px-16 py-5"
        style={{
          zIndex: 50,
          background: 'linear-gradient(to bottom, rgba(8, 8, 14, 0.95) 0%, transparent 100%)',
        }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', letterSpacing: '0.06em', cursor: 'pointer' }}
          onClick={() => scrollToSection(0)}>
          <span style={{ color: '#00FFD1' }}>&lt;</span>
          <span style={{ color: '#f4f4f5' }}>AMR</span>
          <span style={{ color: '#00FFD1' }}>/&gt;</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[['About', 1], ['Skills', 2], ['Work', 3], ['Experience', 4], ['Contact', 5]].map(([item, idx]) => (
            <button key={item} onClick={() => scrollToSection(idx)}
              className="nav-link"
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
            className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a0f]/98"
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
          color: 'oklch(32% 0.02 264)'
        }}>AMRSAEEDCSE · 2026</div>

      {/* Progress dots — sleek compact indicator on mobile, standard on desktop */}
      <div className={`fixed ${isMobile ? 'right-2 gap-[4px]' : 'right-5 gap-2'} top-1/2 flex flex-col`}
        style={{ zIndex: 50, transform: 'translateY(-50%)' }}>
        {SNAP_POINTS.map((_, i) => (
          <div key={i} className="touch-target flex items-center justify-center cursor-pointer"
            style={{ width: isMobile ? 18 : 28, height: isMobile ? 14 : 28 }}
            ref={el => dotRefs.current[i] = el}
            role="button"
            tabIndex={0}
            aria-label={`Go to section ${i + 1}`}
            onClick={() => goToStopRef.current?.(i)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && goToStopRef.current?.(i)}>
            <div style={{
              width: isMobile ? 3 : 6,
              height: i === 0 ? (isMobile ? 14 : 24) : (isMobile ? 4 : 6),
              borderRadius: 999,
              background: i === 0 ? '#00FFD1' : '#f4f4f5',
              opacity: i === 0 ? 1 : 0.25,
              boxShadow: i === 0 ? '0 0 12px rgba(0,255,209,0.8)' : '0 0 0px transparent',
              transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }} />
          </div>
        ))}
      </div>

      {/* Scroll indicator — line only; dots already signal position */}
      <div className="fixed bottom-7 left-1/2 pointer-events-none"
        style={{ zIndex: 50, transform: 'translateX(-50%)', opacity: 0.35 }}>
        <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, #00FFD1, transparent)' }} />
      </div>

      {/* Full-viewport particle overlay — fixed, always above everything */}
      <ParticleCanvas section={activePanel} visible={loaderExiting || loaded} isMobile={isMobile} />

      {/* ── PINNED CONTAINER ─────────────────────────────────────────────────── */}
      <motion.div ref={pinnedRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: (loaderExiting || loaded) ? 1 : 0, scale: (loaderExiting || loaded) ? 1 : 0.95 }}
        transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
        className="motion-stage"
        style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 10 }}>
        <HeroPanel panelRef={el => panelRefs.current[0] = el} scrollToSection={scrollToSection} isActive={activePanel === 0} isMobile={isMobile} />
        {isMobile ? (
          <>
            <AboutPanel panelRef={el => panelRefs.current[1] = el} isActive={activePanel === 1} isMobile={true} />
            <SkillsPanel panelRef={el => panelRefs.current[2] = el} isActive={activePanel === 2} isMobile={true} />
            <ProjectsPanel panelRef={el => panelRefs.current[3] = el} onProjectClick={setActiveProject} isActive={activePanel === 3} />
            <ExperiencePanelMobile panelRef={el => panelRefs.current[4] = el} isActive={activePanel === 4} />
            <ContactPanelMobile1 panelRef={el => panelRefs.current[5] = el} isActive={activePanel === 5} />
            <ContactPanelMobile2 panelRef={el => panelRefs.current[6] = el} isActive={activePanel === 6} />
          </>
        ) : (
          <>
            <AboutPanel panelRef={el => panelRefs.current[1] = el} isActive={activePanel === 1} />
            <SkillsPanel panelRef={el => panelRefs.current[2] = el} isActive={activePanel === 2} />
            <ProjectsPanel panelRef={el => panelRefs.current[3] = el} onProjectClick={setActiveProject} isActive={activePanel === 3} />
            <ExperiencePanel panelRef={el => panelRefs.current[4] = el} isActive={activePanel === 4} />
            <ContactPanel panelRef={el => panelRefs.current[5] = el} isActive={activePanel === 5} />
          </>
        )}
      </motion.div>
    </div>
  );
}
