import { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from './components/Loader';

const ProjectDetail = lazy(() => import('./components/sections/ProjectDetail'));
const ProjectArchive = lazy(() => import('./components/sections/ProjectArchive'));
import ParticleCanvas from './components/ui/ParticleCanvas';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Work from './components/sections/Work';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';

const SECTION_IDS = ['home', 'about', 'skills', 'work', 'experience', 'contact'];
const NAV_LINKS = [
  ['01', 'About', 'about'],
  ['02', 'Skills', 'skills'],
  ['03', 'Work', 'work'],
  ['04', 'Experience', 'experience'],
  ['05', 'Contact', 'contact'],
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  const [activeSection, setActiveSection] = useState(0);

  const handleLoaderDone = useCallback(() => setLoaded(true), []);
  const handleLoaderExiting = useCallback(() => setLoaderExiting(true), []);

  /* Debounced width tracking */
  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWindowWidth(window.innerWidth), 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* Lock page scroll while a project modal is open */
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeProject]);

  /* Always start at top of drawing set */
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  /* Accurate scroll position tracking to drive active nav link & particle canvas */
  useEffect(() => {
    if (!loaded) return;
    let raf = null;

    const updateActiveSection = () => {
      raf = null;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const midPoint = scrollY + vh * 0.45;

      const els = SECTION_IDS.map((id) => document.getElementById(id));
      let current = 0;

      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (midPoint >= top && midPoint < top + height) {
            current = i;
            break;
          } else if (midPoint >= top) {
            current = i;
          }
        }
      }

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf != null) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [loaded]);

  const scrollToSection = useCallback((id) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 64;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className="grain" style={{ minHeight: '100vh', backgroundColor: 'var(--color-paper)' }}>

      {/* Initial Shutter Loader */}
      <AnimatePresence>
        {!loaded && (
          <Loader key="loader" onComplete={handleLoaderDone} onExiting={handleLoaderExiting} readyToExit />
        )}
      </AnimatePresence>

      {/* Project Detail & Archive Modals */}
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {activeProject === 'ARCHIVE' ? (
            <ProjectArchive key="archive" onClose={() => setActiveProject(null)} onOpenProject={setActiveProject} />
          ) : activeProject ? (
            <ProjectDetail key="project-modal" project={activeProject} onClose={() => setActiveProject(null)} />
          ) : null}
        </AnimatePresence>
      </Suspense>

      {/* Fixed Blueprint Paper Atmosphere */}
      <div className="bp-grid-bg" aria-hidden="true" />
      <div className="bp-vignette" aria-hidden="true" />

      {/* 60FPS Reactive Blueprint Particle Field */}
      <ParticleCanvas
        section={activeSection}
        visible={loaderExiting || loaded}
        isMobile={windowWidth < 768}
      />

      {/* ── Fixed Navigation Bar ─────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 border-b border-line"
        style={{
          background: 'rgba(242, 239, 231, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="h-16 px-5 md:px-14 flex items-center justify-between gap-6">
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-baseline gap-2 group text-left cursor-pointer"
          >
            <span className="font-display font-black text-[1.1rem] tracking-tight text-ink">
              AMR<span className="text-signal">.</span>SAEED
            </span>
            <span className="mono-tiny text-ink-3 hidden sm:inline">[CSE]</span>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(([no, label, id]) => {
              const idx = SECTION_IDS.indexOf(id);
              const isActive = activeSection === idx;
              return (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="flex items-baseline gap-1.5 transition-colors cursor-pointer"
                  style={{ color: isActive ? 'var(--color-signal)' : 'var(--color-ink-2)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-ink)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isActive ? 'var(--color-signal)' : 'var(--color-ink-2)'; }}
                >
                  <span className="font-mono text-[0.58rem] tabular-nums opacity-75 font-semibold">{no}</span>
                  <span className={`font-mono text-[0.68rem] tracking-[0.16em] uppercase font-semibold ${isActive ? 'border-b-2 border-signal pb-0.5' : ''}`}>
                    {label}
                  </span>
                </button>
              );
            })}
            <a
              href="assets/Amr_Abdelazeem_Resume.pdf"
              download="Amr_Abdelazeem_Resume.pdf"
              className="bp-btn !py-1.5 !px-3.5 ml-2 !text-[0.66rem]"
            >
              Resume ↓
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden touch-target cursor-pointer"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="flex flex-col gap-1.5 items-end">
              <span className="block w-6 h-[2px] bg-ink" />
              <span className="block w-4 h-[2px] bg-signal" />
            </span>
          </button>
        </div>
      </nav>

      {/* ── Mobile Fullscreen Menu ────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper"
            style={{
              backgroundImage:
                'linear-gradient(rgba(58,87,196,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(58,87,196,0.06) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          >
            <div className="h-16 px-5 flex items-center justify-between border-b border-line">
              <span className="mono-label text-signal font-bold">[ DRAWING INDEX ]</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="touch-target font-mono text-xl font-bold"
                style={{ color: 'var(--color-signal)' }}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 gap-3">
              {[['00', 'Home', 'home'], ...NAV_LINKS].map(([no, label, id], i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                  onClick={() => scrollToSection(id)}
                  className="text-left flex items-baseline gap-4 py-2 cursor-pointer"
                >
                  <span className="font-mono text-sm tabular-nums font-bold" style={{ color: 'var(--color-signal)' }}>
                    {no}
                  </span>
                  <span className="h-display text-3xl sm:text-4xl text-ink">{label}</span>
                </motion.button>
              ))}
            </div>

            <div className="px-8 pb-10">
              <a
                href="assets/Amr_Abdelazeem_Resume.pdf"
                download="Amr_Abdelazeem_Resume.pdf"
                className="bp-btn bp-btn-primary w-full !py-3"
              >
                Download Complete Resume ↓
              </a>
              <p className="mono-tiny text-ink-3 text-center mt-5">AMRSAEEDCSE © 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Left Edge Drawing Ruler (Desktop Only) ────────────────────────── */}
      <div
        className="edge-ruler fixed left-0 top-0 bottom-0 w-[14px] z-40 pointer-events-none hidden md:block"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0 39px, var(--color-line-strong) 39px 41px)',
          backgroundRepeat: 'repeat-y',
        }}
      >
        <div
          className="absolute top-0 bottom-0 right-0 w-[7px]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0 9px, var(--color-line) 9px 11px)',
            backgroundRepeat: 'repeat-y',
          }}
        />
      </div>

      {/* ── Drawing Set Sections ─────────────────────────────────────────── */}
      <main className="relative z-[2]">
        <Hero ready={loaderExiting || loaded} scrollToSection={scrollToSection} />
        <About />
        <Skills />
        <Work onProjectClick={setActiveProject} />
        <Experience />
        <Contact />
      </main>
    </div>
  );
}
