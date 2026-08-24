import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

export default function Work({ onProjectClick }) {
  const targetRef = useRef(null);
  const featured = PROJECTS_DATA.slice(0, 5);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Smooth horizontal translation across devices
  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-83.5%']);
  const smoothX = useSpring(xTransform, { damping: 28, stiffness: 130, restDelta: 0.001 });

  return (
    <section id="work" ref={targetRef} className="relative h-[460vh]">

      {/* ── Sticky Pinned Viewport Container (Active on Mobile & Desktop) ─ */}
      <div className="sticky top-[3vh] h-screen w-full overflow-hidden flex flex-col justify-center px-3 sm:px-8 md:px-14">

        {/* ── Section Title & Progress Bar ───────────────────────────────── */}
        <div className="max-w-7xl mx-auto w-full mb-3 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 select-none pb-2.5 sm:pb-4 border-b border-current/15">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bp-stamp text-[#FF4400] border-[#FF4400] !text-[0.6rem] !py-0.5 !px-2">
                SHEET 03 // DRAWING REEL
              </span>
              <span className="font-mono text-[0.65rem] sm:text-xs text-[#3A57C4] font-bold">
                SCROLL TO ADVANCE SHEETS →
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight uppercase">
              FEATURED DRAWINGS.
            </h2>
          </div>

          {/* Progress Line */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="font-mono text-[0.65rem] sm:text-xs text-inherit/70 font-bold">
              05 DRAWINGS + ARCHIVE
            </span>
            <div className="w-28 sm:w-40 h-1.5 sm:h-2 bg-current/10 border border-current overflow-hidden">
              <motion.div
                className="h-full bg-[#FF4400]"
                style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
              />
            </div>
          </div>
        </div>

        {/* ── Smooth Horizontal Panning Track (All Devices) ──────────────── */}
        <div className="w-full flex items-center overflow-visible">
          <motion.div
            style={{ x: smoothX }}
            className="flex items-center gap-4 sm:gap-8 pl-1 sm:pl-2 will-change-transform"
          >
            {featured.map((proj, idx) => (
              <div
                key={proj.id}
                className="w-[88vw] sm:w-[680px] lg:w-[860px] h-[540px] sm:h-[500px] lg:h-[520px] flex-none"
              >
                <TiltCard maxTilt={4} className="h-full w-full">
                  <div className="h-full sheet-frame overflow-hidden shadow-xl flex flex-col justify-between border border-current/20 bg-inherit">

                    {/* Top Strip */}
                    <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-current/15 bg-current/5">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="font-mono font-bold text-xs sm:text-sm text-[#FF4400]">
                          DWG-00{idx + 1}
                        </span>
                        <span className="font-mono text-[0.65rem] sm:text-[0.7rem] text-inherit/70">
                          ASSEMBLY // 0{idx + 1} OF 05
                        </span>
                      </div>
                      <span className="bp-stamp !text-[0.55rem] sm:!text-[0.6rem] !py-0.5 !px-2 text-[#0E8345] border-[#0E8345] font-bold">
                        {proj.status} · {proj.year}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex-1 grid lg:grid-cols-[1.15fr_1fr] min-h-0">

                      {/* Left: Specs & Info */}
                      <div className="p-4 sm:p-7 flex flex-col justify-between overflow-hidden">
                        <div>
                          <span className="font-mono text-[0.65rem] sm:text-[0.7rem] text-[#3A57C4] font-bold block mb-0.5 sm:mb-1 uppercase">
                            {proj.tag}
                          </span>
                          <h3 className="font-display font-black text-xl sm:text-2xl lg:text-3xl tracking-tight uppercase">
                            {proj.title}
                          </h3>
                          <p className="font-mono text-xs text-[#FF4400] font-semibold mt-0.5">
                            {proj.subtitle}
                          </p>

                          {/* Large, prominent image preview on mobile */}
                          <div
                            onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                            className="block lg:hidden my-3 relative h-40 sm:h-44 overflow-hidden border border-current/20 bg-current/10 cursor-pointer shadow-inner group"
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

                          <p className="text-inherit/75 text-xs sm:text-sm leading-relaxed mt-1 sm:mt-3 line-clamp-2 sm:line-clamp-3 font-body">
                            {proj.description}
                          </p>

                          {/* Tech Stack Pills */}
                          <div className="flex flex-wrap gap-1.5 mt-2.5 sm:mt-4 max-h-[60px] overflow-hidden">
                            {proj.tech.slice(0, 4).map((t) => (
                              <span
                                key={t}
                                onMouseEnter={playHoverTick}
                                className="bp-chip !text-[0.62rem] sm:!text-[0.68rem] !py-0.5 !px-2.5 font-bold"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTAs */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-current/15 mt-3 sm:mt-0">
                          <button
                            onClick={() => { playSwitchClick(); onProjectClick(proj); }}
                            onMouseEnter={playHoverTick}
                            className="bp-btn-primary !py-2.5 sm:!py-2.5 !px-4 sm:!px-5 !text-xs min-h-[42px] justify-center text-center font-bold"
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
                              className="bp-btn-secondary !py-2.5 sm:!py-2.5 !px-4 sm:!px-5 !text-xs min-h-[42px] flex items-center justify-center font-bold"
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
                    <div className="flex items-center justify-between px-4 sm:px-6 py-1.5 border-t border-current/15 font-mono text-[0.6rem] sm:text-[0.65rem] text-[#8A91A5]">
                      <span>DRAWN BY: A. ABDELAZEEM</span>
                      <span className="hidden sm:inline">CHECKED: APPROVED ✓</span>
                      <span>YEAR: {proj.year}</span>
                    </div>

                  </div>
                </TiltCard>
              </div>
            ))}

            {/* ── Complete Archive Card at End of Reel ─────────────────────── */}
            <div className="w-[88vw] sm:w-[460px] lg:w-[500px] h-[540px] sm:h-[500px] lg:h-[520px] flex-none">
              <TiltCard maxTilt={4} className="h-full w-full">
                <div className="h-full sheet-frame p-6 sm:p-10 text-center shadow-xl flex flex-col items-center justify-center border border-current/20 bg-inherit">
                  <span className="bp-stamp text-[#FF4400] border-[#FF4400] mb-2 font-bold">
                    ARCHIVE // COMPLETE INDEX
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl mt-2 uppercase">
                    ALL {PROJECTS_DATA.length} BLUEPRINTS.
                  </h3>
                  <p className="text-inherit/70 text-xs sm:text-sm max-w-sm mt-3 leading-relaxed font-body">
                    Inspect all mobile apps, IoT firmware repositories, VHDL processor schematics, and full-stack platforms.
                  </p>
                  <button
                    onClick={() => { playSwitchClick(); onProjectClick('ARCHIVE'); }}
                    onMouseEnter={playHoverTick}
                    className="bp-btn-primary mt-6 sm:mt-8 !py-3 !px-8 min-h-[46px] w-full sm:w-auto"
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
  );
}
