import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import { SectionHead } from '../ui/blueprint';

const GRID_OVERLAY = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  backgroundImage:
    'linear-gradient(rgba(58,87,196,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(58,87,196,0.08) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
};

function SheetCard({ proj, idx, onProjectClick, isMobile = false }) {
  const accent = proj.color || '#FF4400';

  if (isMobile) {
    // ── Mobile Card Layout: Vertical Stream ───────────────────────────
    return (
      <article className="sheet-frame relative flex flex-col bg-paper-2 overflow-hidden shadow-sm">
        {/* Title strip */}
        <div className="relative z-[4] flex items-center justify-between gap-2 px-4 py-2.5 border-b border-line bg-paper-2">
          <span className="mono-tiny font-bold text-signal">DWG-{String(idx + 1).padStart(3, '0')}</span>
          <span className="mono-tiny text-ink-3 truncate">{proj.tag.split('·')[0].trim()}</span>
          <span className="stamp !text-[0.46rem] !py-0.5 !px-2" style={{ color: accent }}>{proj.status}</span>
        </div>

        {/* Cover image */}
        <div className="relative h-[210px] overflow-hidden border-b border-line">
          <img
            src={proj.img}
            alt={proj.title}
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(15%) contrast(1.05)' }}
          />
          <div style={GRID_OVERLAY} aria-hidden="true" />
        </div>

        {/* Notes & Actions */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-baseline gap-3">
            <span className="h-outline font-display font-black text-2xl select-none">
              {String(idx + 1).padStart(2, '0')}
            </span>
            <h3 className="h-display text-xl leading-tight">{proj.title}</h3>
          </div>
          <p className="text-signal mono-tiny font-medium mt-1">{proj.subtitle}</p>
          <p className="text-ink-2 text-[0.88rem] leading-relaxed mt-3 line-clamp-3">
            {proj.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {proj.tech.slice(0, 4).map((t) => (
              <span key={t} className="bp-chip !text-[0.58rem] !py-0.5 !px-2">{t}</span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5 mt-5 pt-3 border-t border-line">
            <button onClick={() => onProjectClick(proj)} className="bp-btn bp-btn-primary !py-2 !px-3.5 !text-[0.68rem]">
              Open Drawing ↗
            </button>
            {proj.github && (
              <a href={proj.github} target="_blank" rel="noreferrer" className="bp-btn !py-2 !px-3.5 !text-[0.68rem]">
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </article>
    );
  }

  // ── Desktop Card Layout: Horizontal Sheet ───────────────────────────
  return (
    <div className="w-screen h-full shrink-0 flex items-center justify-center px-6 md:px-12 lg:px-16">
      <article className="sheet-frame relative w-full max-w-[1150px] h-[520px] lg:h-[560px] flex flex-col bg-paper-2 overflow-hidden shadow-md">

        {/* ── Title strip ──────────────────────────────────────────────── */}
        <div className="relative z-[4] flex items-center justify-between gap-4 px-6 py-2.5 border-b border-line bg-paper-2">
          <div className="flex items-center gap-3">
            <span className="mono-label font-bold text-signal">DWG-{String(idx + 1).padStart(3, '0')}</span>
            <span className="mono-tiny text-ink-3 hidden sm:inline">ASSEMBLY // SHEET {String(idx + 1).padStart(2, '0')} OF 04</span>
          </div>
          <span className="mono-tiny text-ink-2 font-mono truncate hidden md:inline">{proj.tag}</span>
          <span className="stamp !text-[0.52rem] !py-0.5 !px-2.5 flex-none" style={{ color: accent }}>{proj.status}</span>
        </div>

        {/* ── Card Body Grid ───────────────────────────────────────────── */}
        <div className="relative z-[4] flex-1 min-h-0 grid md:grid-cols-[1.1fr_1fr]">

          {/* Left Column: Drawing Notes & Specs */}
          <div className="p-6 lg:p-8 flex flex-col min-w-0 justify-between overflow-y-auto">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="h-outline font-display font-black text-4xl lg:text-5xl leading-none select-none opacity-80">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="mono-tiny text-ink-3">SPECIFICATION &amp; ARCHITECTURE</span>
              </div>

              <h3 className="h-display text-2xl lg:text-3xl mt-2 tracking-tight">
                {proj.title}
              </h3>
              <p className="text-signal mono-label font-medium mt-1 text-[0.72rem]">{proj.subtitle}</p>

              <p className="text-ink-2 text-[0.88rem] lg:text-[0.92rem] leading-[1.7] mt-3 line-clamp-4">
                {proj.description}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {proj.tech.slice(0, 5).map((t) => (
                  <span key={t} className="bp-chip !text-[0.6rem] !py-1 !px-2.5">{t}</span>
                ))}
                {proj.tech.length > 5 && (
                  <span className="bp-chip !text-[0.6rem] !py-1 !px-2.5">+{proj.tech.length - 5} MORE</span>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-line mt-4">
              <button onClick={() => onProjectClick(proj)} className="bp-btn bp-btn-primary !py-2.5 !px-5">
                Open Drawing <span aria-hidden="true">↗</span>
              </button>
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noreferrer" className="bp-btn !py-2.5 !px-5">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Figure Showcase */}
          <div className="relative border-t md:border-t-0 md:border-l border-line overflow-hidden bg-paper-3">
            <img
              src={proj.img}
              alt={`${proj.title} preview`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              style={{ filter: 'grayscale(15%) contrast(1.04)' }}
            />
            <div style={GRID_OVERLAY} aria-hidden="true" />
            <div className="absolute bottom-3 right-3 z-10 px-2 py-1 bg-paper/90 backdrop-blur-sm border border-line mono-tiny text-ink-3">
              FIG. {String(idx + 1).padStart(2, '0')} // SCHEMATIC
            </div>
          </div>
        </div>

        {/* ── Footer Strip ─────────────────────────────────────────────── */}
        <div className="relative z-[4] hidden md:flex items-center justify-between px-6 py-2 border-t border-line bg-paper-2">
          <span className="mono-tiny text-ink-3">DRAWN BY: A. ABDELAZEEM</span>
          <span className="mono-tiny text-ink-3">CHECKED: ✓ APPROVED</span>
          <span className="mono-tiny text-ink-3">YEAR: {proj.year}</span>
        </div>
      </article>
    </div>
  );
}

function ArchiveSheetCard({ onOpenArchive, isMobile = false }) {
  if (isMobile) {
    return (
      <div className="sheet-frame relative p-6 text-center bg-paper-2">
        <span className="mono-label text-signal">[ ARCHIVE // INDEX ]</span>
        <h3 className="h-display text-2xl mt-2">FULL PROJECT ARCHIVE</h3>
        <p className="mono-tiny text-ink-3 mt-1.5">{PROJECTS_DATA.length} DOCUMENTS INDEXED &amp; CATALOGED</p>
        <button onClick={onOpenArchive} className="bp-btn bp-btn-primary w-full mt-5">
          Open Complete Archive ↗
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-full shrink-0 flex items-center justify-center px-6 md:px-12 lg:px-16">
      <div className="sheet-frame relative w-full max-w-[800px] p-8 lg:p-12 text-center bg-paper-2 shadow-md">
        <span className="mono-label text-signal">[ ARCHIVE // COMPLETE INDEX ]</span>
        <h3 className="h-display text-3xl lg:text-5xl mt-3">
          FULL <span className="h-outline">DRAWING SET</span>
        </h3>
        <p className="mono-label text-ink-2 mt-2">{PROJECTS_DATA.length} ENGINEERING DOCUMENTS CATALOGED</p>
        <p className="text-ink-3 text-sm max-w-[48ch] mx-auto mt-4 leading-relaxed">
          Inspect mobile applications, IoT firmware repositories, VHDL processor blueprints, and full-stack platforms.
        </p>
        <button onClick={onOpenArchive} className="bp-btn bp-btn-primary mt-7 !py-3 !px-7">
          Open Complete Archive <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}

export default function Work({ onProjectClick }) {
  const containerRef = useRef(null);
  const [currentSheet, setCurrentSheet] = useState(1);

  const featuredProjects = PROJECTS_DATA.slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring for horizontal scroll
  const rawX = useTransform(scrollYProgress, [0, 1], ['0vw', '-400vw']);
  const smoothX = useSpring(rawX, { stiffness: 120, damping: 28, mass: 0.3 });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCurrentSheet(Math.min(5, Math.max(1, Math.round(v * 4) + 1)));
  });

  return (
    <section id="work" className="relative">

      {/* ── MOBILE VIEW (< 768px): Vertical blueprint stream ── */}
      <div className="block md:hidden px-5 py-20">
        <SectionHead no="03" code="DRAWING SET // 04 SHEETS" title="FEATURED WORK." />
        <div className="mt-8 space-y-8">
          {featuredProjects.map((proj, i) => (
            <SheetCard key={proj.id} proj={proj} idx={i} onProjectClick={onProjectClick} isMobile />
          ))}
          <ArchiveSheetCard onOpenArchive={() => onProjectClick('ARCHIVE')} isMobile />
        </div>
      </div>

      {/* ── DESKTOP VIEW (md+): Pinned horizontal drafting canvas ── */}
      <div ref={containerRef} className="hidden md:block relative" style={{ height: '420vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-16 pb-8">

          {/* Section Header with generous margin */}
          <div className="w-full max-w-[1150px] mx-auto px-6 md:px-14 z-20 pointer-events-none flex-none">
            <SectionHead no="03" code="DRAWING SET // 04 SHEETS" title="FEATURED WORK." />
          </div>

          {/* Horizontal Pan Track */}
          <div className="relative flex-1 min-h-0 w-full flex items-center">
            <motion.div style={{ x: smoothX }} className="flex h-full w-[500vw] will-change-transform items-center">
              {featuredProjects.map((proj, i) => (
                <SheetCard key={proj.id} proj={proj} idx={i} onProjectClick={onProjectClick} />
              ))}
              <ArchiveSheetCard onOpenArchive={() => onProjectClick('ARCHIVE')} />
            </motion.div>
          </div>

          {/* Bottom Progress Bar & Navigation hints */}
          <div className="w-full max-w-[1150px] mx-auto px-6 md:px-14 z-20 flex items-center justify-between flex-none select-none">
            <div className="flex items-center gap-4">
              <span className="mono-label tabular-nums font-bold text-signal">
                SHEET {String(currentSheet).padStart(2, '0')} / 05
              </span>
              <div className="w-36 h-1 bg-line-strong relative overflow-hidden rounded-none" aria-hidden="true">
                <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-signal" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="mono-tiny text-ink-3">SCROLL DOWN TO INSPECT NEXT SHEET</span>
              <span className="mono-tiny text-signal">→→</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
