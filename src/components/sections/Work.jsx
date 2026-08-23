import { useRef, useState } from 'react';
import {
  motion, useScroll, useTransform, useSpring,
  useMotionValueEvent, useReducedMotion,
} from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import { SectionHead } from '../ui/blueprint';

/* Some project accents are tuned for dark UIs — remap pure white to ink on paper */
const accentOf = (c) => (c && c.toLowerCase() !== '#ffffff' ? c : '#1A1D23');

const GRID_OVERLAY = {
  position: 'absolute', inset: 0, pointerEvents: 'none',
  backgroundImage:
    'linear-gradient(rgba(58,87,196,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(58,87,196,0.10) 1px, transparent 1px)',
  backgroundSize: '28px 28px',
};

function SheetCard({ proj, idx, flow = false, onProjectClick }) {
  const accent = accentOf(proj.color);
  return (
    <article
      className={
        flow
          ? 'sheet-frame relative flex flex-col overflow-hidden'
          : 'relative w-screen h-full shrink-0 px-4 sm:px-[6vw] flex items-center justify-center'
      }
    >
      <div className={
        flow
          ? 'flex flex-col flex-1'
          : 'sheet-frame relative w-full max-w-[1180px] h-[72vh] md:h-[76vh] my-auto flex flex-col overflow-hidden bg-paper-2'
      }>
        {/* ── Title strip ──────────────────────────────────────────────── */}
        <div className="relative z-[4] flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-line bg-paper-2">
          <span className="mono-label">DWG-{String(idx + 1).padStart(3, '0')}</span>
          <span className="mono-tiny text-ink-3 truncate hidden sm:block">{proj.tag}</span>
          <span className="stamp flex-none" style={{ color: accent, fontSize: '0.52rem' }}>{proj.status}</span>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="relative z-[4] flex-1 min-h-0 grid md:grid-cols-[1fr_1.05fr]">
          {/* Left — drawing notes */}
          <div className="p-5 md:p-9 flex flex-col min-w-0 overflow-hidden">
            <div className="flex items-baseline gap-4">
              <span className="h-outline font-display font-black leading-none select-none" style={{ fontSize: 'clamp(3rem, 7vw, 5.2rem)', fontStretch: '82%', opacity: 0.85 }}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="mono-tiny text-ink-3">SHEET {String(idx + 1).padStart(2, '0')} — ASSEMBLY</span>
            </div>

            <h3 className="h-display mt-3" style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.1rem)' }}>
              {proj.title}
            </h3>
            <p className="text-signal mono-label mt-2">{proj.subtitle}</p>

            <p
              className="text-ink-2 text-[0.88rem] md:text-[0.94rem] leading-[1.75] mt-4"
              style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4, overflow: 'hidden' }}
            >
              {proj.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-5">
              {proj.tech.slice(0, 4).map((t) => (
                <span key={t} className="bp-chip">{t}</span>
              ))}
              {proj.tech.length > 4 && (
                <span className="bp-chip">+{proj.tech.length - 4} MORE</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-auto pt-6">
              <button onClick={() => onProjectClick(proj)} className="bp-btn bp-btn-primary">
                Open Drawing <span aria-hidden="true">↗</span>
              </button>
              {proj.github && (
                <a href={proj.github} target="_blank" rel="noreferrer" className="bp-btn">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Right — figure area */}
          <div className={`relative border-line ${flow ? 'min-h-[230px] border-t' : 'min-h-[160px] md:border-l md:border-t-0 border-t'} overflow-hidden`}>
            <img
              src={proj.img}
              alt={`${proj.title} cover`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
              style={{ filter: 'grayscale(20%) contrast(1.05)' }}
            />
            <div style={GRID_OVERLAY} aria-hidden="true" />
          </div>
        </div>

        {/* ── Footer strip ─────────────────────────────────────────────── */}
        <div className="relative z-[4] hidden md:flex items-center justify-between px-6 py-2.5 border-t border-line bg-paper-2">
          <span className="mono-tiny text-ink-3">DRAWN BY: A. ABDELAZEEM</span>
          <span className="mono-tiny text-ink-3">CHECKED: ✓</span>
          <span className="mono-tiny text-ink-3">REV: {proj.year}</span>
        </div>
      </div>
    </article>
  );
}

function ArchiveSheet({ flow = false, onOpenArchive }) {
  return (
    <div
      className={
        flow
          ? 'py-16 flex justify-center'
          : 'relative w-screen h-full shrink-0 flex items-center justify-center px-[6vw]'
      }
    >
      <div className="sheet-frame relative px-8 py-14 md:px-20 md:py-20 text-center bg-paper-2 max-w-[720px] w-full">
        <span className="mono-label text-signal">INDEX OF DRAWINGS</span>
        <h3 className="h-display mt-4" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>
          FULL <span className="h-outline">ARCHIVE</span>
        </h3>
        <p className="mono-label text-ink-3 mt-3">{PROJECTS_DATA.length} DOCUMENTS INDEXED</p>
        <button onClick={onOpenArchive} className="bp-btn bp-btn-primary mt-8">
          Open Index <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}

export default function Work({ onProjectClick }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const [sheet, setSheet] = useState(1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const rawX = useTransform(scrollYProgress, [0, 1], ['0vw', '-400vw']);
  const x = useSpring(rawX, { stiffness: 110, damping: 26, mass: 0.35 });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setSheet(Math.min(5, Math.max(1, Math.round(v * 4) + 1)));
  });

  const cards = PROJECTS_DATA.slice(0, 4);

  /* Reduced motion → plain vertical document flow */
  if (reduce) {
    return (
      <section id="work" className="relative px-5 md:px-14 py-24 md:py-32">
        <div className="max-w-[1180px] mx-auto">
          <SectionHead no="04" code="DRAWING SET — 05 SHEETS" title="FEATURED WORK." />
          <div className="mt-12 space-y-14">
            {cards.map((proj, i) => (
              <SheetCard key={proj.id} proj={proj} idx={i} flow onProjectClick={onProjectClick} />
            ))}
            <ArchiveSheet flow onOpenArchive={() => onProjectClick('ARCHIVE')} />
          </div>
        </div>
      </section>
    );
  }

  /* Default — pinned viewport, sheets pan horizontally with natural scroll */
  return (
    <section id="work" ref={ref} className="relative" style={{ height: '470vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Section head floats above the sheets */}
        <div className="absolute top-20 md:top-24 inset-x-0 px-5 md:px-14 z-20 pointer-events-none">
          <SectionHead no="04" code="DRAWING SET — 05 SHEETS" title="FEATURED WORK." />
        </div>

        {/* Horizontal track */}
        <motion.div style={{ x }} className="flex h-full w-[500vw] will-change-transform">
          {cards.map((proj, i) => (
            <SheetCard key={proj.id} proj={proj} idx={i} onProjectClick={onProjectClick} />
          ))}
          <ArchiveSheet onOpenArchive={() => onProjectClick('ARCHIVE')} />
        </motion.div>

        {/* Progress — sheet counter + ruled bar */}
        <div className="absolute bottom-6 left-5 md:left-14 z-20 flex items-center gap-4 pointer-events-none">
          <span className="mono-label tabular-nums">SHEET {String(sheet).padStart(2, '0')} / 05</span>
          <span className="block w-28 h-px bg-line-strong relative overflow-visible" aria-hidden="true">
            <motion.span style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-signal" />
          </span>
        </div>
        <div className="absolute bottom-6 right-5 md:right-14 z-20 hidden md:flex items-center gap-2 pointer-events-none">
          <span className="mono-tiny text-ink-3">SCROLL TO PAN</span>
          <span className="mono-tiny text-signal">→→→</span>
        </div>
      </div>
    </section>
  );
}
