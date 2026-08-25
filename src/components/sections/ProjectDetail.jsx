import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

const ProjectDetail = React.memo(function ProjectDetail({ project, onClose }) {
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
    category,
  } = project;

  // Filter unique valid images
  const allImages = Array.from(new Set([img, ...screenshots])).filter(Boolean);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const thumbnailScrollRef = useRef(null);

  const activeImage = allImages[selectedIdx] || img;
  const isMobileProject = category === 'mobile' || tag?.toLowerCase().includes('flutter');

  // Preload adjacent images into browser memory cache for 0ms instant switching
  useEffect(() => {
    if (allImages.length <= 1) return;
    const preload = (index) => {
      if (index >= 0 && index < allImages.length) {
        const i = new Image();
        i.src = allImages[index];
      }
    };
    preload(selectedIdx + 1);
    preload(selectedIdx + 2);
    preload(selectedIdx - 1);
    if (selectedIdx === 0) preload(allImages.length - 1);
  }, [selectedIdx, allImages]);

  const handlePrev = useCallback(() => {
    playSwitchClick();
    setSelectedIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    playSwitchClick();
    setSelectedIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Keep active thumbnail centered in filmstrip
  useEffect(() => {
    if (thumbnailScrollRef.current) {
      const activeEl = thumbnailScrollRef.current.children[selectedIdx];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedIdx]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showGridModal) setShowGridModal(false);
        else if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, showGridModal, onClose, handlePrev, handleNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[200] overflow-y-auto bg-[#F2EFE7] text-[#111318]"
    >
      {/* ── Banner Cover ─────────────────────────────────────────────────── */}
      <div className="relative h-[24vh] sm:h-[30vh] min-h-[180px] sm:min-h-[220px] border-b border-[#111318] overflow-hidden bg-[#E1DCCE]">
        <img
          src={img}
          alt={title}
          decoding="async"
          className="w-full h-full object-cover opacity-20 pointer-events-none select-none"
          style={{ filter: 'grayscale(40%)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F2EFE7] via-transparent to-transparent pointer-events-none" />

        {/* Top Controls */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 max-w-7xl mx-auto flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="bp-btn-secondary !py-2 !px-3.5 !text-xs !bg-[#F2EFE7] min-h-[38px] shadow-sm font-bold cursor-pointer"
          >
            ← Back to Set
          </button>
          <span className="bp-stamp text-[#FF4400] border-[#FF4400] bg-[#F2EFE7] !py-1 !text-[0.6rem] font-bold">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-12 items-start">

          {/* Left Column: Interactive Visual Showcase and Spec */}
          <div className="space-y-6 sm:space-y-8 min-w-0">
            
            {/* ── Visual Showcase & Gallery Stage ─────────────────────────── */}
            <div className="sheet-frame p-4 sm:p-6 bg-[#EAE6DC] overflow-hidden">
              
              {/* Showcase Header */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#111318]/15">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#3A57C4] uppercase">
                  <span>01 // SCHEMATIC SHOWCASE</span>
                  <span className="text-[#FF4400]">
                    [ {selectedIdx + 1 < 10 ? `0${selectedIdx + 1}` : selectedIdx + 1} / {allImages.length < 10 ? `0${allImages.length}` : allImages.length} ]
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {allImages.length > 4 && (
                    <button
                      onClick={() => { playSwitchClick(); setShowGridModal(true); }}
                      className="font-mono text-[0.65rem] font-bold text-[#3A57C4] hover:text-[#FF4400] transition-colors cursor-pointer"
                    >
                      ALL {allImages.length} TILES ⊞
                    </button>
                  )}
                  <button
                    onClick={() => { playSwitchClick(); setLightboxOpen(true); }}
                    className="bp-stamp !py-0.5 !px-2 !text-[0.6rem] !bg-[#F2EFE7] !text-[#111318] hover:border-[#FF4400] transition-colors cursor-pointer font-bold"
                  >
                    ZOOM ⤢
                  </button>
                </div>
              </div>

              {/* Main Showcase Viewport Container (GPU Hardware Accelerated) */}
              <div className="relative rounded-lg overflow-hidden border border-[#111318] bg-[#111318]/5 h-[340px] sm:h-[420px] lg:h-[460px] flex items-center justify-center p-3 sm:p-5 select-none contain-paint">
                
                {/* CAD Grid Texture */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#111318 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Instant Crossfade Render (No mode="wait" blocking delays) */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    key={activeImage}
                    src={activeImage}
                    alt={`${title} schematic ${selectedIdx + 1}`}
                    decoding="async"
                    fetchpriority="high"
                    className={`max-h-full max-w-full object-contain drop-shadow-md rounded transition-opacity duration-150 ${
                      isMobileProject ? 'border border-[#111318]/30 shadow-lg' : ''
                    }`}
                  />
                </div>

                {/* Left/Right Navigation Floating Buttons */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      aria-label="Previous image"
                      className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-[#F2EFE7]/90 hover:bg-[#F2EFE7] border border-[#111318] flex items-center justify-center font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
                    >
                      ←
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next image"
                      className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-[#F2EFE7]/90 hover:bg-[#F2EFE7] border border-[#111318] flex items-center justify-center font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer z-10"
                    >
                      →
                    </button>
                  </>
                )}
              </div>

              {/* Compact Filmstrip Thumbnail Track */}
              {allImages.length > 1 && (
                <div className="mt-3.5 pt-2 border-t border-[#111318]/10 flex items-center gap-2">
                  <div
                    ref={thumbnailScrollRef}
                    className="flex-1 flex gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
                  >
                    {allImages.map((src, idx) => {
                      const isCurrent = idx === selectedIdx;
                      return (
                        <button
                          key={src}
                          type="button"
                          onClick={() => { playSwitchClick(); setSelectedIdx(idx); }}
                          onMouseEnter={playHoverTick}
                          className={`relative flex-none w-14 sm:w-16 h-10 sm:h-11 rounded overflow-hidden border transition-all cursor-pointer ${
                            isCurrent
                              ? 'border-[#FF4400] ring-2 ring-[#FF4400]/40 scale-105 z-10'
                              : 'border-[#111318]/30 opacity-60 hover:opacity-100 hover:border-[#111318]'
                          }`}
                        >
                          <img
                            src={src}
                            alt={`Thumbnail ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover pointer-events-none"
                          />
                          <div className="absolute bottom-0 right-0 px-1 py-0.2 bg-[#111318] text-[#F2EFE7] font-mono text-[0.5rem] font-bold">
                            {idx + 1}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* System Overview */}
            <div className="sheet-frame p-5 sm:p-6 bg-[#EAE6DC]">
              <h2 className="font-mono text-xs font-bold text-[#3A57C4] tracking-widest uppercase mb-2 sm:mb-3">
                02 // SYSTEM OVERVIEW &amp; ARCHITECTURE
              </h2>
              <p className="text-[#4B5162] text-sm sm:text-base leading-relaxed font-body">
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2.5 pt-2 border-t border-[#111318]/15">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playSwitchClick}
                  className="bp-btn-primary !py-3 !px-6 text-center justify-center min-h-[44px] font-bold"
                >
                  View on GitHub ↗
                </a>
              )}
              {demos.map((d, i) => (
                <a
                  key={i}
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={playSwitchClick}
                  className="bp-btn-secondary !py-3 !px-5 text-center justify-center min-h-[44px] font-bold"
                >
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
                PARTS &amp; TECHNOLOGIES ({tech.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tech.map((t) => (
                  <span
                    key={t}
                    onMouseEnter={playHoverTick}
                    className="bp-chip font-bold !text-[0.65rem] !py-0.5 !px-2.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Engineering Features */}
            {features.length > 0 && (
              <div className="sheet-frame p-5 sm:p-6 bg-[#EAE6DC]">
                <h3 className="font-mono text-xs font-bold text-[#111318] tracking-widest uppercase mb-3 sm:mb-4">
                  KEY SPECIFICATIONS ({features.length})
                </h3>
                <div className="space-y-3">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4B5162] leading-relaxed font-body">
                      <span className="font-mono text-xs font-bold text-[#FF4400] mt-0.5 flex-none">
                        0{i + 1}.
                      </span>
                      <span>{f.replace(/^[^\w"(]*\s*(?=[A-Z"(])/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Verification Block */}
            <div className="sheet-frame p-4 bg-[#EAE6DC] font-mono text-[0.65rem] text-[#8A91A5] space-y-1 border border-[#111318]/20">
              <div className="flex justify-between">
                <span>VERIFICATION STATUS:</span>
                <span className="text-[#0E8345] font-bold">VERIFIED PRODUCTION</span>
              </div>
              <div className="flex justify-between">
                <span>TOTAL SCHEMATICS:</span>
                <span className="text-inherit font-bold">{allImages.length} ASSETS</span>
              </div>
              <div className="flex justify-between">
                <span>ARCHITECTURE:</span>
                <span className="text-[#3A57C4] font-bold">CLEAN ARCHITECTURE</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── All Images Grid Modal (Clean Overview for 10+ Images) ─────────── */}
      <AnimatePresence>
        {showGridModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[320] bg-black/90 p-4 sm:p-8 backdrop-blur-sm overflow-y-auto flex flex-col justify-between"
          >
            <div className="max-w-6xl mx-auto w-full">
              <div className="flex items-center justify-between text-white pb-4 mb-6 border-b border-white/20">
                <div>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-[#FF4400]">
                    {title} // COMPLETE SCHEMATIC TILES
                  </h3>
                  <p className="font-mono text-xs text-white/60">
                    CLICK ANY TILE TO OPEN IN SHOWCASE ({allImages.length} TOTAL)
                  </p>
                </div>
                <button
                  onClick={() => setShowGridModal(false)}
                  className="bp-btn-primary !py-1.5 !px-3.5 !text-xs font-bold cursor-pointer"
                >
                  ✕ Close (ESC)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pb-8">
                {allImages.map((src, idx) => (
                  <div
                    key={src}
                    onClick={() => {
                      setSelectedIdx(idx);
                      setShowGridModal(false);
                    }}
                    className="group relative bg-[#111318] border border-white/20 rounded overflow-hidden cursor-pointer hover:border-[#FF4400] transition-all aspect-[4/5] flex items-center justify-center p-2"
                  >
                    <img
                      src={src}
                      alt={`Tile ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform pointer-events-none"
                    />
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 font-mono text-[0.6rem] text-white font-bold border border-white/20">
                      #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fullscreen Lightbox Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[300] bg-black/95 flex flex-col items-center justify-between p-4 sm:p-6 backdrop-blur-sm select-none"
          >
            {/* Top Lightbox Header */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white font-mono text-xs z-10">
              <div>
                <span className="font-bold text-[#FF4400]">{title}</span>
                <span className="text-white/60 ml-2">
                  [ {selectedIdx + 1} / {allImages.length} ]
                </span>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="bp-btn-primary !py-1.5 !px-3.5 !text-xs min-h-[36px] font-bold cursor-pointer"
              >
                ✕ Close (ESC)
              </button>
            </div>

            {/* Center Image */}
            <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center my-2">
              <img
                src={activeImage}
                alt="Expanded schematic"
                decoding="async"
                className="max-w-full max-h-[80vh] object-contain border border-white/20 shadow-2xl rounded"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous"
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 text-white border border-white/30 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next"
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 text-white border border-white/30 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Compact Lightbox Mini Bar */}
            <div className="flex items-center gap-2 text-white/70 font-mono text-xs py-2">
              <span>NAVIGATE WITH ARROWS ⇄ OR CLICK</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default ProjectDetail;
