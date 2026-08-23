import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const overlayVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: 30, transition: { duration: 0.25, ease: 'easeIn' } },
};

const ProjectDetail = React.memo(function ProjectDetail({ project, onClose }) {
  const [activeImage, setActiveImage] = useState(null);

  const {
    title,
    subtitle,
    tag,
    color,
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

  const accent = color && color.toLowerCase() !== '#ffffff' ? color : '#FF4400';

  // Handle ESC key to close modal
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
      key="detail-modal"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[200] overflow-y-auto bg-paper"
      style={{
        backgroundImage:
          'linear-gradient(rgba(58,87,196,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(58,87,196,0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    >
      {/* ── Banner Hero ─────────────────────────────────────────────────── */}
      <div className="relative h-[38vh] min-h-[260px] md:h-[46vh] border-b border-line-strong overflow-hidden bg-paper-3">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(15%) contrast(1.05) brightness(0.92)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent" />

        {/* Navigation Bar in Banner */}
        <div className="absolute top-5 left-5 right-5 md:left-12 md:right-12 flex items-center justify-between z-20">
          <button
            onClick={onClose}
            className="bp-btn !bg-paper/90 backdrop-blur-sm !py-2 !px-4 hover:!bg-ink hover:!text-paper"
          >
            ← Back to Drawing Set
          </button>
          <span className="stamp !bg-paper/90 backdrop-blur-sm" style={{ color: accent }}>
            {status}
          </span>
        </div>

        {/* Title in Banner */}
        <div className="absolute bottom-6 left-5 right-5 md:left-12 md:right-12 z-10 max-w-[1150px] mx-auto">
          <div className="mono-label font-bold mb-1" style={{ color: accent }}>
            DWG // {tag} · REV.{year}
          </div>
          <h1 className="h-display text-3xl sm:text-5xl md:text-6xl text-ink leading-tight">
            {title}
          </h1>
          <p className="mono-label text-ink-2 mt-1 text-[0.8rem] md:text-[0.9rem]">{subtitle}</p>
        </div>
      </div>

      {/* ── Content Body ────────────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-5 md:px-12 py-10 md:py-16">
        <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-16 items-start">

          {/* Left Column: Specification & Image Gallery */}
          <div>
            <div className="mono-label flex items-center gap-3 mb-4">
              <span className="font-bold" style={{ color: accent }}>01</span>
              <span className="text-ink font-semibold">SPECIFICATION &amp; ARCHITECTURE</span>
              <span className="flex-1 h-px bg-line-strong" />
            </div>

            <p className="text-ink-2 text-[0.96rem] md:text-[1.02rem] leading-[1.85] mb-8">
              {description}
            </p>

            {/* Screenshots Gallery */}
            {allImages.length > 0 && (
              <div>
                <div className="mono-label flex items-center gap-3 mb-4">
                  <span className="font-bold" style={{ color: accent }}>02</span>
                  <span className="text-ink font-semibold">FIGURES &amp; SCHEMATICS ({allImages.length})</span>
                  <span className="flex-1 h-px bg-line-strong" />
                </div>

                <div className="space-y-4">
                  {allImages.map((src, i) => (
                    <div
                      key={src}
                      onClick={() => setActiveImage(src)}
                      className="sheet-frame sheet-frame--plain relative overflow-hidden group cursor-pointer bg-paper-2 shadow-sm"
                    >
                      <img
                        src={src}
                        alt={`${title} figure ${i + 1}`}
                        loading="lazy"
                        className="w-full max-h-[360px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bp-chip !bg-paper/90 backdrop-blur-sm transition-opacity">
                          Click to Enlarge ⤢
                        </span>
                      </div>
                      <span className="mono-tiny absolute bottom-2 right-2 px-2 py-1 bg-paper/90 border border-line text-ink-3">
                        FIG. {String(i + 1).padStart(2, '0')} // SCHEMATIC
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-line">
              {github && (
                <a href={github} target="_blank" rel="noreferrer" className="bp-btn bp-btn-primary !py-3 !px-6">
                  View Source on GitHub ↗
                </a>
              )}
              {demos.map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noreferrer" className="bp-btn !py-3 !px-5">
                  {d.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Key Features & Parts BOM */}
          <div className="space-y-8">
            {/* Parts Used (Tech Stack) */}
            <div>
              <div className="mono-label flex items-center gap-3 mb-4">
                <span className="font-bold" style={{ color: accent }}>03</span>
                <span className="text-ink font-semibold">PARTS USED // BILL OF MATERIALS</span>
                <span className="flex-1 h-px bg-line-strong" />
              </div>
              <div className="flex flex-wrap gap-2">
                {tech.map((t) => (
                  <span key={t} className="bp-chip font-medium !py-1 !px-2.5 bg-paper-2">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features List */}
            {features.length > 0 && (
              <div>
                <div className="mono-label flex items-center gap-3 mb-4">
                  <span className="font-bold" style={{ color: accent }}>04</span>
                  <span className="text-ink font-semibold">ENGINEERING HIGHLIGHTS</span>
                  <span className="flex-1 h-px bg-line-strong" />
                </div>
                <div className="divide-y divide-line border-y border-line">
                  {features.map((f, i) => {
                    const clean = f.replace(/^[^\w"(]*\s*(?=[A-Z"(])/, '');
                    return (
                      <div key={i} className="py-3.5 flex items-start gap-3">
                        <span className="mono-tiny tabular-nums font-bold flex-none mt-0.5" style={{ color: accent }}>
                          [{String(i + 1).padStart(2, '0')}]
                        </span>
                        <span className="text-[0.92rem] text-ink-2 leading-relaxed">{clean}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Document Release Plate */}
            <div className="sheet-frame p-5 bg-paper-2 flex items-center justify-between border border-line-strong">
              <div>
                <div className="mono-tiny text-ink-3">YEAR ENGINEERED</div>
                <div className="font-display font-black text-2xl text-ink">{year}</div>
              </div>
              <div className="text-right">
                <div className="mono-tiny text-ink-3">DOCUMENT STATUS</div>
                <span className="stamp !text-[0.48rem] !py-0.5 !px-2" style={{ color: accent }}>
                  {status}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Image Lightbox Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-[300] bg-ink/90 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-md"
          >
            <div className="relative max-w-5xl max-h-[90vh] overflow-hidden sheet-frame p-2 bg-paper">
              <img src={activeImage} alt="Expanded schematic" className="max-w-full max-h-[82vh] object-contain block mx-auto" />
              <button
                onClick={() => setActiveImage(null)}
                className="bp-btn bp-btn-primary absolute top-4 right-4 !py-1.5 !px-3"
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
