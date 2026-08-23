import { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from './components/Loader';

const ProjectDetail = lazy(() => import('./components/sections/ProjectDetail'));
const ProjectArchive = lazy(() => import('./components/sections/ProjectArchive'));
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Work from './components/sections/Work';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';

const NAV_LINKS = [
  { no: '01', label: 'About', id: 'about' },
  { no: '02', label: 'Skills', id: 'skills' },
  { no: '03', label: 'Work', id: 'work' },
  { no: '04', label: 'Milestones', id: 'experience' },
  { no: '05', label: 'Contact', id: 'contact' },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleLoaderDone = useCallback(() => setLoaded(true), []);

  /* Lock page scroll when a project modal is open */
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeProject]);

  /* Track active section for navbar highlighting */
  useEffect(() => {
    if (!loaded) return;
    const ids = ['home', 'about', 'skills', 'work', 'experience', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loaded]);

  const scrollToSection = useCallback((id) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 70;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navOffset,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F2EFE7] text-[#111318]">

      {/* ── Blueprint CAD Loader ─────────────────────────────────────────── */}
      <AnimatePresence>
        {!loaded && (
          <Loader key="loader" onComplete={handleLoaderDone} />
        )}
      </AnimatePresence>

      {/* ── Project Modals ──────────────────────────────────────────────── */}
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {activeProject === 'ARCHIVE' ? (
            <ProjectArchive key="archive" onClose={() => setActiveProject(null)} onOpenProject={setActiveProject} />
          ) : activeProject ? (
            <ProjectDetail key="project-modal" project={activeProject} onClose={() => setActiveProject(null)} />
          ) : null}
        </AnimatePresence>
      </Suspense>

      {/* ── Blueprint Drafting Grid Atmosphere ──────────────────────────── */}
      <div className="bp-grid" aria-hidden="true" />
      <div className="bp-vignette" aria-hidden="true" />

      {/* ── Left Edge Drawing Ruler (Desktop) ───────────────────────────── */}
      <div
        className="fixed left-0 top-0 bottom-0 w-[14px] z-40 pointer-events-none hidden md:block"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0 39px, rgba(17,19,24,0.25) 39px 41px)',
          backgroundRepeat: 'repeat-y',
        }}
      >
        <div
          className="absolute top-0 bottom-0 right-0 w-[7px]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0 9px, rgba(17,19,24,0.12) 9px 11px)',
            backgroundRepeat: 'repeat-y',
          }}
        />
      </div>

      {/* ── Fixed Header Navbar ─────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 px-5 md:px-14 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between border-b-2 border-[#111318] px-5 py-2.5 bg-[#F2EFE7]/92 backdrop-blur-xl">

          {/* Brand Mark */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-baseline gap-2 cursor-pointer text-left group"
          >
            <span className="font-display font-black text-lg tracking-tight text-[#111318]">
              AMR<span className="text-[#FF4400]">.</span>SAEED
            </span>
            <span className="font-mono text-[0.62rem] text-[#8A91A5] font-bold hidden sm:inline">
              [CSE // DWG-SET]
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-baseline gap-1.5 transition-colors cursor-pointer"
                  style={{ color: isActive ? '#FF4400' : '#4B5162' }}
                >
                  <span className="font-mono text-[0.6rem] font-bold tabular-nums opacity-75">{link.no}</span>
                  <span className={`font-mono text-[0.72rem] tracking-[0.14em] uppercase font-bold ${isActive ? 'border-b-2 border-[#FF4400] pb-0.5' : ''}`}>
                    {link.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="assets/Amr_Abdelazeem_Resume.pdf"
              download="Amr_Abdelazeem_Resume.pdf"
              className="bp-btn-secondary !py-1.5 !px-3.5 !text-[0.68rem]"
            >
              Resume ↓
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="bp-btn-primary !py-1.5 !px-3.5 !text-[0.68rem]"
            >
              Work Order ↗
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden p-2 text-[#111318] hover:bg-[#EAE6DC] transition-colors"
          >
            <span className="flex flex-col gap-1 w-5">
              <span className="h-0.5 w-full bg-[#111318]" />
              <span className="h-0.5 w-full bg-[#FF4400]" />
              <span className="h-0.5 w-full bg-[#111318]" />
            </span>
          </button>

        </div>
      </header>

      {/* ── Mobile Fullscreen Menu ────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#F2EFE7] flex flex-col justify-between p-6 border-8 border-[#111318]"
          >
            <div className="flex items-center justify-between pb-6 border-b border-[#111318]">
              <div className="font-mono font-bold text-[#FF4400] text-sm">
                [ DRAWING INDEX ]
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#111318] font-mono text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4 py-8">
              {[{ no: '00', label: 'Home', id: 'home' }, ...NAV_LINKS].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left flex items-baseline gap-3"
                >
                  <span className="font-mono font-bold text-sm text-[#FF4400]">{link.no}</span>
                  <span className="font-display font-black text-3xl text-[#111318] hover:text-[#FF4400] transition-colors uppercase">
                    {link.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[#111318]">
              <a
                href="assets/Amr_Abdelazeem_Resume.pdf"
                download="Amr_Abdelazeem_Resume.pdf"
                className="bp-btn-secondary w-full text-center"
              >
                Download Resume PDF ↓
              </a>
              <button
                onClick={() => scrollToSection('contact')}
                className="bp-btn-primary w-full"
              >
                Transmit Work Order ↗
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Application Sections ─────────────────────────────────────────── */}
      <main className="relative z-10">
        <Hero scrollToSection={scrollToSection} />
        <About />
        <Skills />
        <Work onProjectClick={setActiveProject} />
        <Experience />
        <Contact />
      </main>

    </div>
  );
}
