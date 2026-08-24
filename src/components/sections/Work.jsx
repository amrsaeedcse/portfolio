import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

export default function Work({ onProjectClick }) {
  const targetRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const featured = PROJECTS_DATA.slice(0, 5);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Smooth horizontal translation for desktop
  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-83.5%']);
  const smoothX = useSpring(xTransform, { damping: 28, stiffness: 130, restDelta: 0.001 });

  // Handle mobile horizontal scroll with finger
  const handleMobileScroll = (e) => {
    const el = e.currentTarget;
    const cardWidth = el.offsetWidth * 0.85;
    const index = Math.round(el.scrollLeft / cardWidth);
    setMobileActiveIdx(Math.min(Math.max(index, 0), featured.length));
  };

  const scrollToCard = (idx) => {
    playSwitchClick();
    if (mobileScrollRef.current) {
      const cardWidth = mobileScrollRef.current.offsetWidth * 0.86;
      mobileScrollRef.current.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE VIEW: Direct Finger Touch-Swipe Reel (Left & Right)
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="work" className="block md:hidden py-8 px-3 bg-inherit border-b border-current/15">
        
        {/* Mobile Header & Controls */}
        <div className="mb-3 px-1 flex flex-col gap-2 select-none border-b border-current/15 pb-3">
          <div className="flex items-center justify-between">
            <span className="bp-stamp text-[#FF4400] border-[#FF4400] !text-[0.6rem] !py-0.5 !px-2 font-bold">
              SHEET 03 // DRAWINGS
            </span>
            <span className="font-mono text-[0.65rem] text-[#3A57C4] font-bold animate-pulse">
              👉 اسحب بصباعك يمين وشمال 👈
            </span>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-2xl tracking-tight uppercase">
              FEATURED DRAWINGS.
            </h2>

            {/* Mobile Arrow Buttons for quick tapping */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollToCard(Math.max(0, mobileActiveIdx - 1))}
                disabled={mobileActiveIdx === 0}
                className="w-8 h-8 flex items-center justify-center border border-current font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed bg-current/5 active:bg-[#FF4400] active:text-white"
                aria-label="Previous drawing"
              >
                ←
              </button>
              <button
                onClick={() => scrollToCard(Math.min(featured.length, mobileActiveIdx + 1))}
                disabled={mobileActiveIdx === featured.length}
                className="w-8 h-8 flex items-center justify-center border border-current font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed bg-current/5 active:bg-[#FF4400] active:text-white"
                aria-label="Next drawing"
              >
                →
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[0.65rem] font-mono text-inherit/70">
            <span>05 BLUEPRINTS + ARCHIVE</span>
            <span className="text-[#FF4400] font-bold">
              CARD {mobileActiveIdx + 1} OF {featured.length + 1}
            </span>
          </div>
        </div>

        {/* ── Direct Finger Touch Scroll Track ──────────────────────────── */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-4 pt-1 px-1 no-scrollbar scroll-smooth -mx-3 px-3 touch-pan-x will-change-scroll"
          style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
        >
          {featured.map((proj, idx) => (
            <div
              key={proj.id}
              className="w-[85vw] max-w-[360px] snap-center flex-none"
            >
              <div className="h-full sheet-frame overflow-hidden shadow-lg flex flex-col justify-between border border-current/20 bg-inherit rounded-sm">
                
                {/* Top Card Strip */}
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-current/15 bg-current/5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#FF4400]">
                      DWG-00{idx + 1}
                    </span>
                    <span className="font-mono text-[0.62rem] text-inherit/70">
                      ASSEMBLY 0{idx + 1}
                    </span>
                  </div>
                  <span className="bp-stamp !text-[0.55rem] !py-0.5 !px-2 text-[#0E8345] border-[#0E8345] font-bold">
                    {proj.status} · {proj.year}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="font-mono text-[0.62rem] text-[#3A57C4] font-bold block mb-0.5 uppercase tracking-wide">
                      {proj.tag}
                    </span>
                    <h3 className="font-display font-black text-xl tracking-tight uppercase line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="font-mono text-xs text-[#FF4400] font-semibold mt-0.5 line-clamp-1">
                      {proj.subtitle}
                    </p>

                    {/* Screenshot Preview */}
                    <div
                      onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                      className="my-3 relative h-40 overflow-hidden border border-current/20 bg-current/10 cursor-pointer shadow-inner group rounded-sm"
                    >
                      <img
                        src={proj.img}
                        alt={proj.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: 'grayscale(5%) contrast(1.05)' }}
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-inherit/95 backdrop-blur-sm font-mono text-[0.58rem] font-bold border border-current">
                        FIG. 0{idx + 1} // TAP TO EXPAND ⤢
                      </div>
                    </div>

                    <p className="text-inherit/80 text-xs leading-relaxed line-clamp-3 font-body">
                      {proj.description}
                    </p>

                    {/* Tech Chips */}
                    <div className="flex flex-wrap gap-1 mt-3 max-h-[50px] overflow-hidden">
                      {proj.tech.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="bp-chip !text-[0.6rem] !py-0.5 !px-2 font-bold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-current/15 mt-3">
                    <button
                      onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                      className="bp-btn-primary !py-2.5 !px-2 !text-xs min-h-[40px] justify-center text-center font-bold"
                    >
                      Inspect Drawing ↗
                    </button>
                    {proj.github ? (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={playSwitchClick}
                        className="bp-btn-secondary !py-2.5 !px-2 !text-xs min-h-[40px] flex items-center justify-center font-bold"
                      >
                        GitHub ↗
                      </a>
                    ) : (
                      <button
                        onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                        className="bp-btn-secondary !py-2.5 !px-2 !text-xs min-h-[40px] justify-center text-center font-bold"
                      >
                        Specs ℹ
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-3.5 py-1.5 border-t border-current/15 font-mono text-[0.58rem] text-[#8A91A5]">
                  <span>DRAWN: A. ABDELAZEEM</span>
                  <span>APPROVED ✓</span>
                </div>

              </div>
            </div>
          ))}

          {/* Archive Card on Mobile */}
          <div className="w-[85vw] max-w-[360px] snap-center flex-none">
            <div className="h-full sheet-frame p-6 text-center shadow-lg flex flex-col items-center justify-center border border-current/20 bg-inherit rounded-sm min-h-[440px]">
              <span className="bp-stamp text-[#FF4400] border-[#FF4400] mb-2 font-bold !text-xs">
                ARCHIVE // COMPLETE INDEX
              </span>
              <h3 className="font-display font-black text-2xl mt-1 uppercase">
                ALL {PROJECTS_DATA.length} BLUEPRINTS.
              </h3>
              <p className="text-inherit/70 text-xs mt-2 leading-relaxed font-body">
                Inspect all mobile apps, IoT firmware, VHDL CPU schematics, and full-stack systems.
              </p>
              <button
                onClick={() => { playSwitchClick(); onProjectClick('ARCHIVE'); }}
                className="bp-btn-primary mt-6 !py-3 !px-6 min-h-[44px] w-full font-bold"
              >
                Open Complete Archive ({PROJECTS_DATA.length}) ↗
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Indicator Dots on Mobile */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {Array.from({ length: featured.length + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                mobileActiveIdx === i ? 'w-7 bg-[#FF4400]' : 'w-2 bg-current/25'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP VIEW: Cinematic Pinned 460vh Horizontal Scroll Reel
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="work-desktop" ref={targetRef} className="hidden md:block relative h-[460vh]">

        {/* Sticky Pinned Viewport Container */}
        <div className="sticky top-[3vh] h-screen w-full overflow-hidden flex flex-col justify-center px-8 md:px-14">

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
                        <div className="relative h-full w-full border-l border-current/15 overflow-hidden bg-current/5 group">
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
                    <h3 className="font-display font-black text-3xl mt-2 uppercase">
                      ALL {PROJECTS_DATA.length} BLUEPRINTS.
                    </h3>
                    <p className="text-inherit/70 text-sm max-w-sm mt-3 leading-relaxed font-body">
                      Inspect all mobile apps, IoT firmware repositories, VHDL processor schematics, and full-stack platforms.
                    </p>
                    <button
                      onClick={() => { playSwitchClick(); onProjectClick('ARCHIVE'); }}
                      onMouseEnter={playHoverTick}
                      className="bp-btn-primary mt-8 !py-3 !px-8 min-h-[46px]"
                    >
                      Open Complete Archive ({PROJECTS_DATA.length}) ↗
                    </button>
                  </div>
                </TiltCard>
              </div>

            </motion.div>
          </div>

        </div>

      </section>
    </>
  );
}
