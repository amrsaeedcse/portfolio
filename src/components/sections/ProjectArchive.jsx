import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

const CATEGORIES = [
  { id: 'all', label: 'ALL BLUEPRINTS' },
  { id: 'mobile', label: 'MOBILE APPS' },
  { id: 'hardware', label: 'HARDWARE & IOT' },
  { id: 'fullstack', label: 'FULL-STACK & WEB' },
];

export default function ProjectArchive({ onClose, onOpenProject }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filtered = useMemo(() => {
    return PROJECTS_DATA.filter((p) => {
      const matchCat =
        selectedCat === 'all' ||
        (selectedCat === 'mobile' && p.category === 'mobile') ||
        (selectedCat === 'hardware' && p.category === 'hardware') ||
        (selectedCat === 'fullstack' && (p.category === 'fullstack' || p.category === 'web'));

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchQuery;
    });
  }, [selectedCat, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[150] overflow-y-auto bg-[#F2EFE7] text-[#111318] flex flex-col items-center"
    >
      <div className="w-full max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#111318]/15">
          <div>
            <span className="bp-stamp text-[#3A57C4] border-[#3A57C4] mb-2 block w-fit">
              MASTER CATALOG // COMPLETE DRAWING INDEX
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#111318] tracking-tight uppercase">
              PROJECT ARCHIVE.
            </h1>
            <p className="text-[#4B5162] text-sm mt-1 font-mono">
              All {PROJECTS_DATA.length} mobile applications, embedded IoT firmware, and full-stack software repositories.
            </p>
          </div>

          <button
            onClick={() => { playSwitchClick(); onClose(); }}
            onMouseEnter={playHoverTick}
            className="bp-btn-secondary self-start md:self-auto !py-2.5 !px-5 !text-xs"
          >
            ✕ Close Archive
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 p-1 bg-[#EAE6DC] border border-[#111318]/15">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { playSwitchClick(); setSelectedCat(cat.id); }}
                  onMouseEnter={playHoverTick}
                  className={`relative px-4 py-2 font-mono text-xs font-bold uppercase transition-colors cursor-pointer select-none ${
                    isActive
                      ? 'text-white'
                      : 'text-[#4B5162] hover:text-[#111318]'
                  }`}
                >
                  {/* Animated sliding active indicator pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeArchiveTabPill"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-[#111318] border border-[#FF4400] z-0 shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, stack…"
              className="w-full bg-[#EAE6DC] border border-[#111318]/20 rounded-none px-4 py-2 text-xs text-[#111318] placeholder:text-[#8A91A5] font-mono focus:outline-none focus:border-[#FF4400]"
            />
          </div>
        </div>

        {/* Animated Projects Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          <AnimatePresence mode="popLayout">
            {filtered.map((proj) => (
              <motion.div
                layout
                key={proj.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => { playSwitchClick(); onOpenProject(proj); }}
                onMouseEnter={playHoverTick}
                className="sheet-frame overflow-hidden cursor-pointer group flex flex-col justify-between border border-[#111318]/20 bg-[#EAE6DC] hover:border-[#FF4400] transition-colors"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-[#E1DCCE] border-b border-[#111318]/15">
                    <img
                      src={proj.img}
                      alt={proj.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ filter: 'grayscale(20%)' }}
                    />
                    <span className="absolute top-3 right-3 bp-stamp !bg-[#F2EFE7] !text-[0.6rem] !py-0.2 !px-1.5 text-[#111318] border-[#111318]">
                      {proj.status}
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="font-mono text-[0.65rem] text-[#3A57C4] tracking-wider uppercase font-bold">
                      {proj.tag.split('·')[0].trim()} · {proj.year}
                    </span>
                    <h3 className="font-display font-black text-xl text-[#111318] mt-1 group-hover:text-[#FF4400] transition-colors uppercase">
                      {proj.title}
                    </h3>
                    <p className="text-[#4B5162] text-xs leading-relaxed mt-2 line-clamp-3 font-body">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-[#111318]/10 mt-4 text-xs font-mono text-[#111318] font-bold group-hover:text-[#FF4400] transition-colors">
                  <span>INSPECT DRAWING</span>
                  <span>→</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
