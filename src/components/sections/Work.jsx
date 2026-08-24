import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

export default function Work({ onProjectClick }) {
  const targetRef = useRef(null);
  const mobileCarouselRef = useRef(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);
  const featured = PROJECTS_DATA.slice(0, 5);

  // Desktop sticky wheel scroll
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-83.5%']);
  const smoothX = useSpring(xTransform, { damping: 28, stiffness: 130, restDelta: 0.001 });

  // Scroll to card index on mobile
  const scrollMobileTo = (idx) => {
    playSwitchClick();
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const cardWidth = container.clientWidth * 0.88 + 16;
    container.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth',
    });
    setActiveMobileIdx(idx);
  };

  // Track active slide on mobile scroll
  const handleMobileScroll = () => {
    if (!mobileCarouselRef.current) return;
    const container = mobileCarouselRef.current;
    const cardWidth = container.clientWidth * 0.88 + 16;
    const currentIdx = Math.round(container.scrollLeft / cardWidth);
    if (currentIdx !== activeMobileIdx) {
      setActiveMobileIdx(currentIdx);
    }
  };

  return (
    <section id="work" className="relative">

      {/* ══════════════════════════════════════════════════════════════════════
          📱 MOBILE LAYOUT (< md): Free Vertical Scrolling + Fluid Touch Carousel
          ══════════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden py-10 px-3 sm:px-6">

        {/* Section Header with Controls */}
        <div className="mb-4 pb-3 border-b border-current/15">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="bp-stamp text-[#FF4400] border-[#FF4400] !text-[0.6rem] !py-0.5 !px-2">
              SHEET 03 // DRAWINGS
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[0.65rem] text-[#3A57C4] font-bold">
              <span>{Math.min(activeMobileIdx + 1, featured.length + 1)}</span>
              <span>/</span>
              <span>{featured.length + 1}</span>
            </div>
          </div>
          <h2 className="font-display font-black text-2xl tracking-tight uppercase mt-1">
            FEATURED DRAWINGS.
          </h2>
          <div className="flex items-center justify-between mt-2">
            <p className="font-mono text-[0.65rem] text-inherit/70">
              05 BLUEPRINTS + ARCHIVE
            </p>
            {/* Quick Tap Navigation Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollMobileTo(Math.max(0, activeMobileIdx - 1))}
                disabled={activeMobileIdx === 0}
                className="px-2 py-0.5 border border-current/25 font-mono text-xs disabled:opacity-30 active:bg-current/10"
                aria-label="Previous Drawing"
              >
                ←
              </button>
              <button
                onClick={() => scrollMobileTo(Math.min(featured.length, activeMobileIdx + 1))}
                disabled={activeMobileIdx === featured.length}
                className="px-2 py-0.5 border border-current/25 font-mono text-xs disabled:opacity-30 active:bg-current/10"
                aria-label="Next Drawing"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* ── Fluid Horizontal Carousel Container (NO touch-pan-x lock) ── */}
        <div
          ref={mobileCarouselRef}
          onScroll={handleMobileScroll}
          style={{ overscrollBehaviorX: 'contain' }}
          className="overflow-x-auto flex gap-3.5 pb-3 pt-1 -mx-3 px-3 scrollbar-none scroll-smooth"
        >
          {featured.map((proj, idx) => (
            <div
              key={proj.id}
              className="w-[86vw] max-w-[340px] h-[510px] flex-none"
            >
              <div className="h-full sheet-frame overflow-hidden shadow-md flex flex-col justify-between border border-current/20 bg-inherit rounded-sm">

                {/* Top Strip */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-current/15 bg-current/5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-[#FF4400]">
                      DWG-00{idx + 1}
                    </span>
                    <span className="font-mono text-[0.62rem] text-inherit/70">
                      0{idx + 1} OF 05
                    </span>
                  </div>
                  <span className="bp-stamp !text-[0.55rem] !py-0.5 !px-1.5 text-[#0E8345] border-[#0E8345] font-bold">
                    {proj.status} · {proj.year}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between overflow-hidden">
                  <div>
                    <span className="font-mono text-[0.6rem] text-[#3A57C4] font-bold block uppercase truncate">
                      {proj.tag}
                    </span>
                    <h3 className="font-display font-black text-lg tracking-tight uppercase mt-0.5">
                      {proj.title}
                    </h3>
                    <p className="font-mono text-[0.68rem] text-[#FF4400] font-semibold mt-0.5 truncate">
                      {proj.subtitle}
                    </p>

                    {/* Image Preview with Tap to Inspect */}
                    <div
                      onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                      className="my-2 relative h-36 w-full overflow-hidden border border-current/20 bg-current/10 cursor-pointer shadow-inner group rounded-sm"
                    >
                      <img
                        src={proj.img}
                        alt={proj.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ filter: 'contrast(1.05)' }}
                      />
                      <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-inherit/95 backdrop-blur-sm font-mono text-[0.55rem] font-bold border border-current">
                        FIG. 0{idx + 1} // INSPECT ⤢
                      </div>
                    </div>

                    <p className="text-inherit/75 text-xs leading-relaxed line-clamp-2 font-body">
                      {proj.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1 mt-2 max-h-[44px] overflow-hidden">
                      {proj.tech.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="bp-chip !text-[0.58rem] !py-0.5 !px-2 font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-current/15 mt-2">
                    <button
                      onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                      className="bp-btn-primary !py-2 !px-2 !text-[0.75rem] min-h-[38px] justify-center text-center font-bold"
                    >
                      Inspect ↗
                    </button>
                    {proj.github ? (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={playSwitchClick}
                        className="bp-btn-secondary !py-2 !px-2 !text-[0.75rem] min-h-[38px] flex items-center justify-center font-bold"
                      >
                        GitHub ↗
                      </a>
                    ) : (
                      <button
                        onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                        className="bp-btn-secondary !py-2 !px-2 !text-[0.75rem] min-h-[38px] justify-center text-center font-bold"
                      >
                        Specs ℹ
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="flex items-center justify-between px-3 py-1.5 border-t border-current/15 font-mono text-[0.58rem] text-[#8A91A5]">
                  <span>A. ABDELAZEEM</span>
                  <span>YEAR: {proj.year}</span>
                </div>

              </div>
            </div>
          ))}

          {/* Archive Card on Mobile */}
          <div className="w-[82vw] max-w-[320px] h-[510px] flex-none">
            <div className="h-full sheet-frame p-6 text-center shadow-md flex flex-col items-center justify-center border border-current/20 bg-inherit rounded-sm">
              <span className="bp-stamp text-[#FF4400] border-[#FF4400] mb-2 font-bold !text-[0.65rem]">
                ARCHIVE // INDEX
              </span>
              <h3 className="font-display font-black text-xl mt-2 uppercase">
                ALL {PROJECTS_DATA.length} BLUEPRINTS.
              </h3>
              <p className="text-inherit/70 text-xs mt-3 leading-relaxed font-body">
                Inspect all mobile apps, IoT firmware repositories, VHDL schematics, and full-stack platforms.
              </p>
              <button
                onClick={() => { playSwitchClick(); onProjectClick('ARCHIVE'); }}
                className="bp-btn-primary mt-6 !py-2.5 !px-6 min-h-[42px] w-full text-xs font-bold"
              >
                Open Archive ({PROJECTS_DATA.length}) ↗
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Interactive Indicator Dots (Tap to Switch) */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollMobileTo(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                activeMobileIdx === i ? 'w-5 bg-[#FF4400]' : 'w-1.5 bg-current/30'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
          <button
            onClick={() => scrollMobileTo(featured.length)}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              activeMobileIdx === featured.length ? 'w-5 bg-[#3A57C4]' : 'w-1.5 bg-current/30'
            }`}
            aria-label="Go to archive"
          />
        </div>

      </div>


      {/* ══════════════════════════════════════════════════════════════════════
          🖥️ DESKTOP LAYOUT (md:block): Cinematic Sticky Wheel Scroll Track
          ══════════════════════════════════════════════════════════════════════ */}
      <div ref={targetRef} className="hidden md:block relative h-[460vh]">

        <div className="sticky top-[3vh] h-screen w-full overflow-hidden flex flex-col justify-center px-8 lg:px-14">

          {/* Section Title & Progress Bar */}
          <div className="max-w-7xl mx-auto w-full mb-6 flex items-end justify-between gap-2.5 select-none pb-4 border-b border-current/15">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bp-stamp text-[#FF4400] border-[#FF4400] !text-[0.6rem] !py-0.5 !px-2">
                  SHEET 03 // DRAWING REEL
                </span>
                <span className="font-mono text-xs text-[#3A57C4] font-bold">
                  SCROLL TO ADVANCE SHEETS →
                </span>
              </div>
              <h2 className="font-display font-black text-4xl lg:text-5xl tracking-tight uppercase">
                FEATURED DRAWINGS.
              </h2>
            </div>

            {/* Progress Line */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-inherit/70 font-bold">
                05 DRAWINGS + ARCHIVE
              </span>
              <div className="w-40 h-2 bg-current/10 border border-current overflow-hidden">
                <motion.div
                  className="h-full bg-[#FF4400]"
                  style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Smooth Horizontal Panning Track */}
          <div className="w-full flex items-center overflow-visible">
            <motion.div
              style={{ x: smoothX }}
              className="flex items-center gap-8 pl-2 will-change-transform"
            >
              {featured.map((proj, idx) => (
                <div
                  key={proj.id}
                  className="w-[680px] lg:w-[860px] h-[500px] lg:h-[520px] flex-none"
                >
                  <TiltCard maxTilt={4} className="h-full w-full">
                    <div className="h-full sheet-frame overflow-hidden shadow-xl flex flex-col justify-between border border-current/20 bg-inherit">

                      {/* Top Strip */}
                      <div className="flex items-center justify-between px-6 py-2.5 border-b border-current/15 bg-current/5">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-[#FF4400]">
                            DWG-00{idx + 1}
                          </span>
                          <span className="font-mono text-[0.7rem] text-inherit/70">
                            ASSEMBLY // 0{idx + 1} OF 05
                          </span>
                        </div>
                        <span className="bp-stamp !text-[0.6rem] !py-0.5 !px-2 text-[#0E8345] border-[#0E8345] font-bold">
                          {proj.status} · {proj.year}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="flex-1 grid lg:grid-cols-[1.15fr_1fr] min-h-0">

                        {/* Left: Specs & Info */}
                        <div className="p-7 flex flex-col justify-between overflow-hidden">
                          <div>
                            <span className="font-mono text-[0.7rem] text-[#3A57C4] font-bold block mb-1 uppercase">
                              {proj.tag}
                            </span>
                            <h3 className="font-display font-black text-2xl lg:text-3xl tracking-tight uppercase">
                              {proj.title}
                            </h3>
                            <p className="font-mono text-xs text-[#FF4400] font-semibold mt-0.5">
                              {proj.subtitle}
                            </p>

                            <p className="text-inherit/75 text-sm leading-relaxed mt-3 line-clamp-3 font-body">
                              {proj.description}
                            </p>

                            {/* Tech Stack Pills */}
                            <div className="flex flex-wrap gap-1.5 mt-4 max-h-[60px] overflow-hidden">
                              {proj.tech.slice(0, 4).map((t) => (
                                <span
                                  key={t}
                                  onMouseEnter={playHoverTick}
                                  className="bp-chip !text-[0.68rem] !py-0.5 !px-2.5 font-bold"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* CTAs */}
                          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-current/15">
                            <button
                              onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                              onMouseEnter={playHoverTick}
                              className="bp-btn-primary !py-2.5 !px-5 !text-xs min-h-[42px] justify-center text-center font-bold"
                            >
                              Inspect Drawing ↗
                            </button>
                            {proj.github ? (
                              <a
                                href={proj.github}
                                target="_blank"
                                rel="noreferrer"
                                onClick={playSwitchClick}
                                onMouseEnter={playHoverTick}
                                className="bp-btn-secondary !py-2.5 !px-5 !text-xs min-h-[42px] flex items-center justify-center font-bold"
                              >
                                GitHub ↗
                              </a>
                            ) : (
                              <button
                                onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                                className="bp-btn-secondary !py-2.5 !px-4 !text-xs min-h-[42px] justify-center text-center font-bold"
                              >
                                Specs ℹ
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Right: Desktop Full Schematic */}
                        <div className="relative h-full w-full hidden lg:block border-l border-current/15 overflow-hidden bg-current/5 group">
                          <img
                            src={proj.img}
                            alt={proj.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            style={{ filter: 'grayscale(15%) contrast(1.05)' }}
                          />
                          <div className="absolute bottom-3 right-3 px-2 py-1 bg-inherit border border-current font-mono text-[0.62rem] font-bold">
                            FIG. 0{idx + 1} // SCHEMATIC
                          </div>
                        </div>

                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between px-6 py-1.5 border-t border-current/15 font-mono text-[0.65rem] text-[#8A91A5]">
                        <span>DRAWN BY: A. ABDELAZEEM</span>
                        <span>CHECKED: APPROVED ✓</span>
                        <span>YEAR: {proj.year}</span>
                      </div>

                    </div>
                  </TiltCard>
                </div>
              ))}

              {/* Complete Archive Card at End of Reel */}
              <div className="w-[460px] lg:w-[500px] h-[500px] lg:h-[520px] flex-none">
                <TiltCard maxTilt={4} className="h-full w-full">
                  <div className="h-full sheet-frame p-10 text-center shadow-xl flex flex-col items-center justify-center border border-current/20 bg-inherit">
                    <span className="bp-stamp text-[#FF4400] border-[#FF4400] mb-2 font-bold">
                      ARCHIVE // COMPLETE INDEX
                    </span>
                    <h3 className="font-display font-black text-2xl sm:text-3xl mt-2 uppercase">
                      ALL {PROJECTS_DATA.length} BLUEPRINTS.
                    </h3>
                    <p className="text-inherit/70 text-sm max-w-sm mt-3 leading-relaxed font-body">
                      Inspect all mobile apps, IoT firmware repositories, VHDL processor schematics, and full-stack platforms.
                    </p>
                    <button
                      onClick={() => { playSwitchClick(); onProjectClick('ARCHIVE'); }}
                      onMouseEnter={playHoverTick}
                      className="bp-btn-primary mt-8 !py-3 !px-8 min-h-[46px] w-auto"
                    >
                      Open Complete Archive ({PROJECTS_DATA.length}) ↗
                    </button>
                  </div>
                </TiltCard>
              </div>

            </motion.div>
          </div>

        </div>

      </div>

    </section>
  );
}
