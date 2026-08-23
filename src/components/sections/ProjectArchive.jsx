import { useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import { EASE } from '../../lib/motionPresets';

/* Some project accents are tuned for dark UIs — remap pure white to ink on paper */
const accentOf = (c) => (c && c.toLowerCase() !== '#ffffff' ? c : '#1A1D23');

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 22 },
  },
};

export default function ProjectArchive({ onClose, onOpenProject }) {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto"
      style={{
        background: 'rgba(242,239,231,0.97)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        backgroundImage:
          'linear-gradient(rgba(58,87,196,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(58,87,196,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-7xl flex flex-col sm:flex-row gap-6 justify-between sm:items-end p-8 mt-4 md:mt-12 mb-8">
        <div>
          <p className="mono-label text-signal mb-3">[ ARCHIVE // FULL INDEX ]</p>
          <h1 className="h-display" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
            PROJECT <span className="h-outline">ARCHIVE</span>
          </h1>
          <p className="mono-label text-ink-3 mt-3">
            {PROJECTS_DATA.length} DOCUMENTS — ALL SHEETS STAMPED &amp; FILED
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close archive"
          className="bp-btn self-start"
        >
          ✕ Close
        </button>
      </div>

      {/* ── DRAWING INDEX GRID ─────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-7xl px-8 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {PROJECTS_DATA.map((proj, idx) => {
          const accent = accentOf(proj.color);
          const isHovered = hovered === idx;
          return (
            <motion.div
              key={proj.id}
              variants={itemVariants}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onOpenProject(proj)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenProject(proj)}
              className="sheet-frame relative flex flex-col group cursor-pointer overflow-hidden transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: 'var(--color-paper-2)',
                borderColor: isHovered ? accent : undefined,
                boxShadow: isHovered ? `0 14px 34px rgba(26,29,35,0.14)` : 'none',
              }}
            >
              {/* Title strip */}
              <div className="relative z-[4] flex items-center justify-between px-4 py-2.5 border-b border-line">
                <span className="mono-tiny tabular-nums text-ink-3">DWG-{String(idx + 1).padStart(3, '0')}</span>
                <span
                  className="stamp"
                  style={{ color: accent, fontSize: '0.48rem', transform: isHovered ? 'rotate(-2deg) scale(1.06)' : 'rotate(-2deg)' }}
                >
                  {proj.status}
                </span>
              </div>

              {/* Figure */}
              <div className="relative h-[200px] overflow-hidden border-b border-line">
                <motion.img
                  src={proj.img}
                  alt={proj.title}
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'grayscale(20%) contrast(1.04)' }}
                />
              </div>

              {/* Notes */}
              <div className="relative z-[4] p-5 flex flex-col flex-grow">
                <span
                  className="bp-chip self-start mb-3"
                  style={{ borderColor: `${accent}66`, color: accent, background: `${accent}0d` }}
                >
                  {proj.tag.split('·')[0].trim()}
                </span>
                <h2 className="font-display font-extrabold tracking-tight leading-tight" style={{ fontSize: '1.55rem' }}>
                  {proj.title}
                </h2>
                <p className="text-[0.84rem] mt-2 mb-5 flex-grow" style={{ color: 'var(--color-ink-2)', lineHeight: 1.65 }}>
                  {proj.description.slice(0, 110)}...
                </p>
                <span
                  className="mono-label inline-flex items-center gap-2 transition-colors"
                  style={{ color: isHovered ? accent : 'var(--color-ink-3)' }}
                >
                  READ CASE STUDY
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
