import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

export default function Work({ onProjectClick }) {
  const targetRef = useRef(null);
  const featured = PROJECTS_DATA.slice(0, 5);

  // Desktop Pinned Scroll Physics
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-83.5%']);
  const smoothX = useSpring(xTransform, { damping: 28, stiffness: 130, restDelta: 0.001 });

  // Mobile Swipe State & Navigation
  const [mobileActive, setMobileActive] = useState(0);
  const totalMobileCards = featured.length + 1; // 5 featured + 1 archive

  const handleMobileSwipe = (direction) => {
    playSwitchClick();
    if (direction === 'left' && mobileActive < totalMobileCards - 1) {
      setMobileActive((prev) => prev + 1);
    } else if (direction === 'right' && mobileActive > 0) {
      setMobileActive((prev) => prev - 1);
    }
  };

  return (
    <div id="work" className="relative">

      {/* ══════════════════════════════════════════════════════════════════════════
          1. MOBILE VIEW: Clean Horizontal Swipe Reel (md:hidden)
          Swiping horizontally with finger smoothly slides cards with spring physics
          ══════════════════════════════════════════════════════════════════════════ */}
      <section className="block md:hidden py-8 px-3 overflow-hidden">

        {/* Section Header */}
        <div className="w-full mb-4 pb-2.5 border-b border-current/15 select-none">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="bp-stamp text-[#FF4400] border-[#FF4400] !text-[0.6rem] !py-0.5 !px-2">
              SHEET 03 // DRAWING REEL
            </span>
            <span className="font-mono text-[0.65rem] text-[#3A57C4] font-bold">
              SWIPE HORIZONTALLY ← →
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <h2 className="font-display font-black text-2xl tracking-tight uppercase">
              FEATURED DRAWINGS.
            </h2>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.65rem] text-inherit/70 font-bold">
                0{mobileActive + 1} / 0{totalMobileCards}
              </span>
              <div className="w-16 h-1.5 bg-current/10 border border-current overflow-hidden">
                <div
                  className="h-full bg-[#FF4400] transition-all duration-300"
                  style={{ width: `${((mobileActive + 1) / totalMobileCards) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Motion Track */}
        <div className="w-full overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40 || info.velocity.x < -300) {
                handleMobileSwipe('left');
              } else if (info.offset.x > 40 || info.velocity.x > 300) {
                handleMobileSwipe('right');
              }
            }}
            animate={{ x: `-${mobileActive * 100}%` }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="flex items-stretch w-full touch-pan-y will-change-transform cursor-grab active:cursor-grabbing"
          >
            {featured.map((proj, idx) => (
              <div
                key={`m-card-${proj.id}`}
                className="w-full flex-none px-1"
              >
                <div className="h-full sheet-frame overflow-hidden shadow-xl flex flex-col justify-between border border-current/20 bg-inherit min-h-[530px]">

                  {/* Top Strip */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-current/15 bg-current/5">
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
                      <h3 className="font-display font-black text-xl tracking-tight uppercase">
                        {proj.title}
                      </h3>
                      <p className="font-mono text-xs text-[#FF4400] font-semibold mt-0.5">
                        {proj.subtitle}
                      </p>

                      {/* Image Preview */}
                      <div
                        onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                        className="my-3 relative h-40 overflow-hidden border border-current/20 bg-current/10 cursor-pointer shadow-inner group"
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

                      <p className="text-inherit/75 text-xs leading-relaxed mt-1 line-clamp-3 font-body">
                        {proj.description}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1 mt-2.5 max-h-[52px] overflow-hidden">
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
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-current/15 mt-3">
                      <button
                        onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                        className="bp-btn-primary !py-2.5 !px-3 !text-xs min-h-[40px] justify-center text-center font-bold"
                      >
                        Inspect Drawing ↗
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
                  <div className="flex items-center justify-between px-4 py-1.5 border-t border-current/15 font-mono text-[0.58rem] text-[#8A91A5]">
                    <span>DRAWN BY: A. ABDELAZEEM</span>
                    <span>YEAR: {proj.year}</span>
                  </div>

                </div>
              </div>
            ))}

            {/* Archive Card on Mobile */}
            <div className="w-full flex-none px-1">
              <div className="h-full sheet-frame p-6 text-center shadow-xl flex flex-col items-center justify-center border border-current/20 bg-inherit min-h-[530px]">
                <span className="bp-stamp text-[#FF4400] border-[#FF4400] mb-2 font-bold">
                  ARCHIVE // COMPLETE INDEX
                </span>
                <h3 className="font-display font-black text-2xl mt-2 uppercase">
                  ALL {PROJECTS_DATA.length} BLUEPRINTS.
                </h3>
                <p className="text-inherit/70 text-xs mt-3 leading-relaxed font-body max-w-xs">
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

          </motion.div>
        </div>

        {/* Mobile Navigation Controls (Arrow Buttons & Dots) */}
        <div className="flex items-center justify-between mt-3 px-1">
          <button
            onClick={() => handleMobileSwipe('right')}
            disabled={mobileActive === 0}
            className="bp-btn-secondary !py-1 !px-3 !text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← PREV
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalMobileCards }).map((_, i) => (
              <button
                key={`dot-${i}`}
                onClick={() => { playSwitchClick(); setMobileActive(i); }}
                className={`h-2 transition-all duration-300 rounded-full ${
                  mobileActive === i
                    ? 'w-6 bg-[#FF4400]'
                    : 'w-2 bg-current/20 hover:bg-current/40'
                }`}
                aria-label={`Go to drawing ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => handleMobileSwipe('left')}
            disabled={mobileActive === totalMobileCards - 1}
            className="bp-btn-secondary !py-1 !px-3 !text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed"
          >
            NEXT →
          </button>
        </div>

      </section>


      {/* ══════════════════════════════════════════════════════════════════════════
          2. DESKTOP VIEW: Exact 460vh Pinned Reel (hidden md:block)
          Preserved 100% with exact physics, mouse wheel translation, and layout
          ══════════════════════════════════════════════════════════════════════════ */}
      <section ref={targetRef} className="relative hidden md:block h-[460vh]">

        {/* Sticky Pinned Viewport */}
        <div className="sticky top-[3vh] h-screen w-full overflow-hidden flex flex-col justify-center px-8 md:px-14">

          {/* Section Title & Progress Bar */}
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

          {/* Smooth Horizontal Panning Track */}
          <div className="w-full flex items-center overflow-visible">
            <motion.div
              style={{ x: smoothX }}
              className="flex items-center gap-8 pl-2 will-change-transform"
            >
              {featured.map((proj, idx) => (
                <div
                  key={`d-${proj.id}`}
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
                        <span className="hidden sm:inline">CHECKED: APPROVED ✓</span>
                        <span>YEAR: {proj.year}</span>
                      </div>

                    </div>
                  </TiltCard>
                </div>
              ))}

              {/* Archive Card on Desktop */}
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
