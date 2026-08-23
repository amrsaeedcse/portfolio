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
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  const [activeSection, setActiveSection] = useState(0);

  const handleLoaderDone = useCallback(() => setLoaded(true), []);
  const handleLoaderExiting = useCallback(() => setLoaderExiting(true), []);

  /* Debounced width tracking (mobile layout switches) */
  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWindowWidth(window.innerWidth), 250);
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

  /* Always start at the top of the drawing set */
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  /* Track which sheet is in view — drives nav state + particle choreography */
  useEffect(() => {
    if (!loaded) return;
    let raf = null;
    const els = SECTION_IDS.map((id) => document.getElementById(id));
    const update = () => {
      raf = null;
      const mid = window.innerHeight * 0.5;
      let cur = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) cur = i;
      });
      setActiveSection((prev) => (prev === cur ? prev : cur));
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf != null) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [loaded]);

  const scrollToSection = useCallback((id) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="grain" style={{ minHeight: '100vh' }}>

      <AnimatePresence>
        {!loaded && (
          <Loader key="loader" onComplete={handleLoaderDone} onExiting={handleLoaderExiting} readyToExit />
        )}
      </AnimatePresence>

      {/* Project overlays — canvas stays mounted underneath */}
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {activeProject === 'ARCHIVE' ? (
            <ProjectArchive key="archive" onClose={() => setActiveProject(null)} onOpenProject={setActiveProject} />
          ) : activeProject ? (
            <ProjectDetail key="project-modal" project={activeProject} onClose={() => setActiveProject(null)} />
          ) : null}
        </AnimatePresence>
      </Suspense>

      {/* Paper atmosphere layers */}
      <div className="bp-grid-bg" aria-hidden="true" />
      <div className="bp-vignette" aria-hidden="true" />

      {/* Drafting pins — full-page particle engine */}
      <ParticleCanvas
        section={activeSection}
        visible={loaderExiting || loaded}
        isMobile={windowWidth < 768}
      />

      {/* ── NAV — drawing header strip ─────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 border-b border-line"
        style={{
          background: 'rgba(242,239,231,0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div className="h-16 px-5 md:px-14 flex items-center justify-between gap-6">
          <button onClick={() => scrollToSection('home')} className="flex items-baseline gap-2 group">
            <span className="font-display font-black text-[1.05rem] tracking-tight">
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
                  className="flex items-baseline gap-1.5 transition-colors"
                  style={{ color: isActive ? 'var(--color-signal)' : 'var(--color-ink-3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-ink)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isActive ? 'var(--color-signal)' : 'var(--color-ink-3)'; }}
                >
                  <span className="font-mono text-[0.56rem] tabular-nums opacity-70">{no}</span>
                  <span className={`font-mono text-[0.66rem] tracking-[0.16em] uppercase ${isActive ? 'border-b border-signal pb-0.5' : ''}`}>
                    {label}
                  </span>
                </button>
              );
            })}
            <a href="assets/Amr_Abdelazeem_Resume.pdf" download className="bp-btn !py-2 !px-4 ml-2">
              Resume ↓
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden touch-target"
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

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper"
            style={{ backgroundImage: 'linear-gradient(rgba(58,87,196,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(58,87,196,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          >
            <div className="h-16 px-5 flex items-center justify-between border-b border-line">
              <span className="mono-label text-signal">INDEX</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="touch-target font-mono text-lg"
                style={{ color: 'var(--color-signal)' }}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {[['00', 'Home', 'home'], ...NAV_LINKS].map(([no, label, id], i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.45 }}
                  onClick={() => scrollToSection(id)}
                  className="text-left flex items-baseline gap-4 py-2"
                >
                  <span className="font-mono text-xs tabular-nums" style={{ color: 'var(--color-signal)' }}>{no}</span>
                  <span className="h-display text-[2.2rem]">{label}</span>
                </motion.button>
              ))}
            </div>

            <div className="px-8 pb-10">
              <a href="assets/Amr_Abdelazeem_Resume.pdf" download className="bp-btn bp-btn-primary w-full">
                Download Resume ↓
              </a>
              <p className="mono-tiny text-ink-3 text-center mt-5">AMRSAEEDCSE © 2026</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left edge ruler — desktop only */}
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
          className="absolute top-0 bottom-0 left-auto right-0 w-[7px]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0 9px, var(--color-line) 9px 11px)',
            backgroundRepeat: 'repeat-y',
          }}
        />
      </div>

      {/* ── THE DRAWING SET ──────────────────────────────────────────────────── */}
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
