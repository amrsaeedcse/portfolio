import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import { EASE } from '../../lib/motionPresets';

const CATEGORIES = [
  { id: 'all', label: 'ALL DOCUMENTS' },
  { id: 'mobile', label: 'MOBILE APPS' },
  { id: 'hardware', label: 'HARDWARE & IOT' },
  { id: 'fullstack', label: 'FULL-STACK & WEB' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

export default function ProjectArchive({ onClose, onOpenProject }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hovered, setHovered] = useState(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((proj) => {
      const matchCat =
        selectedCat === 'all' ||
        (selectedCat === 'mobile' && proj.category === 'mobile') ||
        (selectedCat === 'hardware' && proj.category === 'hardware') ||
        (selectedCat === 'fullstack' && (proj.category === 'fullstack' || proj.category === 'web'));

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.subtitle.toLowerCase().includes(q) ||
        proj.tag.toLowerCase().includes(q) ||
        proj.tech.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [selectedCat, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto bg-paper"
      style={{
        backgroundImage:
          'linear-gradient(rgba(58,87,196,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(58,87,196,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-7xl px-6 md:px-12 pt-10 pb-6 flex flex-col md:flex-row gap-6 justify-between md:items-end border-b border-line">
        <div>
          <p className="mono-label text-signal font-bold mb-2">[ ARCHIVE // COMPLETE DRAWING INDEX ]</p>
          <h1 className="h-display text-4xl sm:text-6xl text-ink">
            PROJECT <span className="h-outline">ARCHIVE</span>
          </h1>
          <p className="mono-label text-ink-3 mt-2">
            {PROJECTS_DATA.length} ENGINEERING DOCUMENTS CATALOGED &amp; FILED
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close archive"
          className="bp-btn self-start md:self-auto !py-2.5 !px-5"
        >
          ✕ Close Index
        </button>
      </div>

      {/* ── Search & Filter Controls ───────────────────────────────────────── */}
      <div className="w-full max-w-7xl px-6 md:px-12 py-6 flex flex-wrap items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`bp-chip !py-1.5 !px-3.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bp-chip--signal !bg-signal !text-white !border-signal font-bold'
                    : 'hover:!border-ink'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stack, tech, title…"
            className="wo-input !text-sm !py-1.5"
          />
        </div>
      </div>

      {/* ── Projects Grid ─────────────────────────────────────────────────── */}
      <div className="w-full max-w-7xl px-6 md:px-12 pb-24 flex-1">
        <div className="mono-tiny text-ink-3 mb-4">
          SHOWING {filteredProjects.length} OF {PROJECTS_DATA.length} DOCUMENTS
        </div>

        {filteredProjects.length === 0 ? (
          <div className="sheet-frame p-12 text-center bg-paper-2 my-10">
            <span className="mono-label text-signal">NO MATCHING DOCUMENTS FOUND</span>
            <p className="text-ink-3 text-sm mt-2">Try clearing your search query or selecting another category filter.</p>
            <button
              onClick={() => { setSelectedCat('all'); setSearchQuery(''); }}
              className="bp-btn bp-btn-primary mt-6 !py-2 !px-4"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((proj, idx) => {
              const accent = proj.color || '#FF4400';
              const isHovered = hovered === proj.id;

              return (
                <motion.div
                  key={proj.id}
                  variants={itemVariants}
                  onMouseEnter={() => setHovered(proj.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onOpenProject(proj)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpenProject(proj)}
                  className="sheet-frame relative flex flex-col group cursor-pointer overflow-hidden bg-paper-2 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-lg"
                  style={{
                    borderColor: isHovered ? accent : undefined,
                  }}
                >
                  {/* Title strip */}
                  <div className="relative z-[4] flex items-center justify-between px-4 py-2 border-b border-line bg-paper-2">
                    <span className="mono-tiny tabular-nums font-bold text-signal">
                      DWG-{String(idx + 1).padStart(3, '0')}
                    </span>
                    <span className="stamp !text-[0.44rem] !py-0.5 !px-2" style={{ color: accent }}>
                      {proj.status}
                    </span>
                  </div>

                  {/* Figure */}
                  <div className="relative h-[180px] overflow-hidden border-b border-line bg-paper-3">
                    <img
                      src={proj.img}
                      alt={proj.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: 'grayscale(15%) contrast(1.05)' }}
                    />
                    <div className="absolute inset-0 bg-ink/5 group-hover:bg-ink/0 transition-colors" />
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="mono-tiny text-ink-3 mb-1">{proj.tag.split('·')[0].trim()} · {proj.year}</div>
                      <h2 className="font-display font-extrabold text-xl leading-tight text-ink">
                        {proj.title}
                      </h2>
                      <p className="text-[0.85rem] text-ink-2 mt-2 leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-line flex items-center justify-between">
                      <span className="mono-tiny text-ink-3">INSPECT SCHEMATIC</span>
                      <span className="mono-label text-signal font-bold flex items-center gap-1">
                        READ MORE →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
