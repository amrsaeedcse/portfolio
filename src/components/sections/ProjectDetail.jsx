import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetail = React.memo(function ProjectDetail({ project, onClose }) {
  const [activeImage, setActiveImage] = useState(null);

  const {
    title,
    subtitle,
    tag,
    img,
    year,
    status,
    description,
    tech = [],
    features = [],
    github,
    screenshots = [],
    demos = [],
  } = project;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeImage) setActiveImage(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, onClose]);

  const allImages = Array.from(new Set([img, ...screenshots])).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] overflow-y-auto bg-[#F2EFE7]/98 backdrop-blur-2xl text-[#111318]"
    >
      {/* ── Banner Cover ─────────────────────────────────────────────────── */}
      <div className="relative h-[32vh] sm:h-[38vh] min-h-[220px] sm:min-h-[260px] border-b border-[#111318] overflow-hidden bg-[#E1DCCE]">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover opacity-35"
          style={{ filter: 'grayscale(30%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F2EFE7] via-transparent to-transparent" />

        {/* Top Controls */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 max-w-7xl mx-auto flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="bp-btn-secondary !py-2 !px-3.5 !text-xs !bg-[#F2EFE7] min-h-[38px] shadow-sm"
          >
            ← Back to Set
          </button>
          <span className="bp-stamp text-[#FF4400] border-[#FF4400] bg-[#F2EFE7] !py-1 !text-[0.6rem]">
            {status} · {year}
          </span>
        </div>

        {/* Title in Banner */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 max-w-7xl mx-auto z-10">
          <span className="font-mono text-[0.65rem] sm:text-xs font-bold text-[#3A57C4] tracking-widest uppercase block mb-1">
            SPECIFICATION // {tag}
          </span>
          <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#111318] tracking-tight uppercase">
            {title}
          </h1>
          <p className="font-mono text-xs text-[#FF4400] font-bold mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* ── Content Layout ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-14 items-start">

          {/* Left Column: Spec and Gallery */}
          <div className="space-y-6 sm:space-y-10">
            <div className="sheet-frame p-5 sm:p-6 bg-[#EAE6DC]">
              <h2 className="font-mono text-xs font-bold text-[#3A57C4] tracking-widest uppercase mb-2 sm:mb-3">
                01 // SYSTEM OVERVIEW &amp; ARCHITECTURE
              </h2>
              <p className="text-[#4B5162] text-sm sm:text-base leading-relaxed font-body">
                {description}
              </p>
            </div>

            {/* Screenshots Gallery */}
            {allImages.length > 0 && (
              <div>
                <h2 className="font-mono text-xs font-bold text-[#111318] tracking-widest uppercase mb-3 sm:mb-4">
                  02 // SCHEMATICS &amp; VISUALS ({allImages.length})
                </h2>
                <div className="space-y-4">
                  {allImages.map((src, idx) => (
                    <div
                      key={src}
                      onClick={() => setActiveImage(src)}
                      className="sheet-frame overflow-hidden cursor-pointer group relative border border-[#111318] bg-[#EAE6DC]"
                    >
                      <img
                        src={src}
                        alt={`${title} schematic ${idx + 1}`}
                        loading="lazy"
                        className="w-full max-h-[420px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bp-stamp !bg-[#F2EFE7] !text-[#111318] transition-opacity">
                          Click to Enlarge ⤢
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2.5 pt-4 border-t border-[#111318]/15">
              {github && (
                <a href={github} target="_blank" rel="noreferrer" className="bp-btn-primary !py-3 !px-6 text-center justify-center min-h-[44px]">
                  View on GitHub ↗
                </a>
              )}
              {demos.map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noreferrer" className="bp-btn-secondary !py-3 !px-5 text-center justify-center min-h-[44px]">
                  {d.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Key Features & Stack */}
          <div className="space-y-6 sm:space-y-8">
            {/* Tech Stack */}
            <div className="sheet-frame p-5 sm:p-6 bg-[#EAE6DC]">
              <h3 className="font-mono text-xs font-bold text-[#111318] tracking-widest uppercase mb-3 sm:mb-4">
                PARTS &amp; TECHNOLOGIES
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tech.map((t) => (
                  <span key={t} className="bp-chip font-bold !text-[0.65rem] !py-0.5 !px-2.5">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Engineering Features */}
            {features.length > 0 && (
              <div className="sheet-frame p-5 sm:p-6 bg-[#EAE6DC]">
                <h3 className="font-mono text-xs font-bold text-[#111318] tracking-widest uppercase mb-3 sm:mb-4">
                  KEY SPECIFICATIONS
                </h3>
                <div className="space-y-2.5 sm:space-y-3">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4B5162] leading-relaxed font-body">
                      <span className="font-mono text-xs font-bold text-[#FF4400] mt-0.5">
                        0{i + 1}.
                      </span>
                      <span>{f.replace(/^[^\w"(]*\s*(?=[A-Z"(])/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-md"
          >
            <div className="relative max-w-5xl max-h-[90vh]">
              <img src={activeImage} alt="Expanded schematic" className="max-w-full max-h-[85vh] object-contain border-2 border-white" />
              <button
                onClick={() => setActiveImage(null)}
                className="bp-btn-primary absolute top-4 right-4 !py-1.5 !px-3 !text-xs min-h-[36px]"
              >
                ✕ Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default ProjectDetail;
