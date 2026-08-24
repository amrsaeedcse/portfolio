import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

export default function Work({ onProjectClick }) {
  const targetRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const featured = PROJECTS_DATA.slice(0, 5);

  // Desktop Pinned Scroll Physics
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-83.5%']);
  const smoothX = useSpring(xTransform, { damping: 28, stiffness: 130, restDelta: 0.001 });

  // Handle Mobile Horizontal Touch Scroll Tracking
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = mobileScrollRef.current;
    const totalItems = featured.length + 1;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const idx = Math.min(
        totalItems - 1,
        Math.max(0, Math.round((scrollLeft / maxScroll) * (totalItems - 1)))
      );
      setMobileIndex(idx);
    }
  };

  const scrollToMobileCard = (index) => {
    playSwitchClick();
    if (!mobileScrollRef.current) return;
    const cards = mobileScrollRef.current.children;
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <div id="work" className="relative">

      {/* ══════════════════════════════════════════════════════════════════════════
          1. MOBILE VIEW: Natural Horizontal Touch-Swipe Reel (md:hidden)
          Allows smooth finger swiping directly horizontally without vertical trap
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="block md:hidden py-10 px-3 sm:px-6 overflow-hidden">
        
        {/* Mobile Section Header */}
        <div className="w-full mb-4 pb-3 border-b border-current/15 select-none">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="bp-stamp text-[#FF4400] border-[#FF4400] !text-[0.6rem] !py-0.5 !px-2 font-bold">
              SHEET 03 // DRAWING REEL
            </span>
            <span className="font-mono text-[0.68rem] text-[#3A57C4] font-bold flex items-center gap-1">
              SWIPE HORIZONTALLY ← →
            </span>
          </div>
          
          <div className="flex items-end justify-between gap-2 mt-1">
            <h2 className="font-display font-black text-2xl tracking-tight uppercase">
              FEATURED DRAWINGS.
            </h2>
            <span className="font-mono text-[0.65rem] text-inherit/70 font-bold whitespace-nowrap">
              0{mobileIndex + 1} / 0{featured.length + 1}
            </span>
          </div>
        </div>

        {/* Mobile Horizontal Touch Track */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="w-full overflow-x-auto flex items-stretch gap-3.5 pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x pl-1 pr-4"
        >
          {featured.map((proj, idx) => (
            <div
              key={`mobile-${proj.id}`}
              className="w-[87vw] max-w-[420px] flex-none snap-center"
            >
              <div className="h-full sheet-frame overflow-hidden shadow-lg flex flex-col justify-between border border-current/20 bg-inherit rounded-sm">

                {/* Top Strip */}
                <div className="flex items-center justify-between px-3.5 py-2 border-b border-current/15 bg-current/5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#FF4400]">
                      DWG-00{idx + 1}
                    </span>
                    <span className="font-mono text-[0.62rem] text-inherit/70">
                      ASSEMBLY // 0{idx + 1} OF 05
                    </span>
                  </div>
                  <span className="bp-stamp !text-[0.55rem] !py-0.5 !px-1.5 text-[#0E8345] border-[#0E8345] font-bold">
                    {proj.status} · {proj.year}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <span className="font-mono text-[0.62rem] text-[#3A57C4] font-bold block mb-0.5 uppercase">
                      {proj.tag}
                    </span>
                    <h3 className="font-display font-black text-xl tracking-tight uppercase leading-tight">
                      {proj.title}
                    </h3>
                    <p className="font-mono text-[0.72rem] text-[#FF4400] font-semibold mt-0.5">
                      {proj.subtitle}
                    </p>

                    {/* Image Preview */}
                    <div
                      onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                      className="my-3 relative h-44 overflow-hidden border border-current/20 bg-current/10 cursor-pointer shadow-inner group rounded-sm"
                    >
                      <img
                        src={proj.img}
                        alt={proj.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: 'grayscale(10%) contrast(1.05)' }}
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-inherit/95 backdrop-blur-sm font-mono text-[0.58rem] font-bold border border-current">
                        FIG. 0{idx + 1} // SCHEMATIC ⤢
                      </div>
                    </div>

                    <p className="text-inherit/75 text-xs leading-relaxed mt-2 line-clamp-3 font-body">
                      {proj.description}
                    </p>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1 mt-3">
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

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-current/15 mt-3.5">
                    <button
                      onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                      className="bp-btn-primary !py-2.5 !px-3 !text-xs min-h-[40px] justify-center text-center font-bold"
                    >
                      Inspect ↗
                    </button>
                    {proj.github ? (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={playSwitchClick}
                        className="bp-btn-secondary !py-2.5 !px-3 !text-xs min-h-[40px] flex items-center justify-center font-bold"
                      >
                        GitHub ↗
                      </a>
                    ) : (
                      <button
                        onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                        className="bp-btn-secondary !py-2.5 !px-3 !text-xs min-h-[40px] justify-center text-center font-bold"
                      >
                        Specs ℹ
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-3.5 py-1.5 border-t border-current/15 font-mono text-[0.58rem] text-[#8A91A5]">
                  <span>DRAWN BY: A. ABDELAZEEM</span>
                  <span>YEAR: {proj.year}</span>
                </div>

              </div>
            </div>
          ))}

          {/* Complete Archive Card on Mobile */}
          <div className="w-[87vw] max-w-[420px] flex-none snap-center">
            <div className="h-full sheet-frame p-6 text-center shadow-lg flex flex-col items-center justify-center border border-current/20 bg-inherit rounded-sm min-h-[420px]">
              <span className="bp-stamp text-[#FF4400] border-[#FF4400] mb-2 font-bold !text-[0.62rem]">
                ARCHIVE // COMPLETE INDEX
              </span>
              <h3 className="font-display font-black text-2xl mt-1 uppercase">
                ALL {PROJECTS_DATA.length} BLUEPRINTS.
              </h3>
              <p className="text-inherit/70 text-xs mt-2 leading-relaxed font-body max-w-xs">
                Inspect all mobile apps, IoT firmware repositories, VHDL processor schematics, and full-stack platforms.
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

        {/* Mobile Dot Navigation Indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {Array.from({ length: featured.length + 1 }).map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => scrollToMobileCard(i)}
              aria-label={`Go to drawing ${i + 1}`}
              className={`h-2 transition-all duration-300 rounded-full ${
                mobileIndex === i
                  ? 'w-7 bg-[#FF4400]'
                  : 'w-2 bg-current/20 hover:bg-current/40'
              }`}
            />
          ))}
        </div>

      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          2. DESKTOP VIEW: 100% Exact Original Pinned Reel (hidden md:block)
          Preserved down to the exact pixel and spring physics as requested
          ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={targetRef} className="relative hidden md:block h-[460vh]">

        {/* ── Sticky Pinned Viewport Container ────────────────────────────── */}
        <div className="sticky top-[3vh] h-screen w-full overflow-hidden flex flex-col justify-center px-8 md:px-14">

          {/* ── Section Title & Progress Bar ───────────────────────────────── */}
          <div className="max-w-7xl mx-auto w-full mb-3 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 select-none pb-2.5 sm:pb-4 border-b border-current/15">
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

          {/* ── Smooth Horizontal Panning Track (Desktop Only) ──────────────── */}
          <div className="w-full flex items-center overflow-visible">
            <motion.div
              style={{ x: smoothX }}
              className="flex items-center gap-8 pl-2 will-change-transform"
            >
              {featured.map((proj, idx) => (
                <div
                  key={`desktop-${proj.id}`}
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

              {/* ── Complete Archive Card at End of Reel ─────────────────────── */}
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

    </div>
  );
}
