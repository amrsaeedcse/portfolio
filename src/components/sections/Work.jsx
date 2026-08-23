import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

export default function Work({ onProjectClick }) {
  const targetRef = useRef(null);
  const featured = PROJECTS_DATA.slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Transform vertical scroll progress into smooth horizontal translation
  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-74%']);
  const smoothX = useSpring(xTransform, { damping: 25, stiffness: 110 });

  return (
    <section id="work" ref={targetRef} className="relative h-[380vh]">

      {/* ── Sticky Pinned Viewport Container ────────────────────────────── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-6 md:px-14">

        {/* ── Section Title & Progress Bar ───────────────────────────────── */}
        <div className="max-w-7xl mx-auto w-full mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 select-none pb-4 border-b border-current/15">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bp-stamp text-[#FF4400] border-[#FF4400]">
                SHEET 03 // DRAWING REEL
              </span>
              <span className="font-mono text-xs text-[#3A57C4] font-bold">
                SCROLL DOWN TO ADVANCE SHEETS →
              </span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase">
              FEATURED DRAWINGS.
            </h2>
          </div>

          {/* Progress Line */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-inherit/70 font-bold">
              04 DRAWINGS + ARCHIVE
            </span>
            <div className="w-32 sm:w-48 h-2 bg-current/10 border border-current overflow-hidden">
              <motion.div
                className="h-full bg-[#FF4400]"
                style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
              />
            </div>
          </div>
        </div>

        {/* ── Smooth Horizontal Panning Track ────────────────────────────── */}
        <div className="w-full flex items-center overflow-visible">
          <motion.div
            style={{ x: smoothX }}
            className="flex items-center gap-8 pl-2 will-change-transform"
          >
            {featured.map((proj, idx) => (
              <div
                key={proj.id}
                className="w-[85vw] sm:w-[720px] lg:w-[860px] h-[480px] lg:h-[510px] flex-none"
              >
                <TiltCard maxTilt={4} className="h-full w-full">
                  <div className="h-full sheet-frame overflow-hidden shadow-lg flex flex-col justify-between">

                    {/* Top Title Strip */}
                    <div className="flex items-center justify-between px-6 py-2.5 border-b border-current/15 bg-current/5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs text-[#FF4400]">
                          DWG-00{idx + 1}
                        </span>
                        <span className="font-mono text-[0.68rem] text-inherit/70 hidden sm:inline">
                          ASSEMBLY // SHEET 0{idx + 1} OF 04
                        </span>
                      </div>
                      <span className="bp-stamp !text-[0.55rem] !py-0.2 !px-2 text-[#0E8345] border-[#0E8345]">
                        {proj.status} · {proj.year}
                      </span>
                    </div>

                    {/* Body Grid */}
                    <div className="flex-1 grid lg:grid-cols-[1.15fr_1fr] min-h-0">

                      {/* Left Column: Specs */}
                      <div className="p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
                        <div>
                          <span className="font-mono text-[0.68rem] text-[#3A57C4] font-bold block mb-1 uppercase">
                            {proj.tag}
                          </span>
                          <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight uppercase">
                            {proj.title}
                          </h3>
                          <p className="font-mono text-xs text-[#FF4400] font-semibold mt-0.5">
                            {proj.subtitle}
                          </p>

                          <p className="text-inherit/70 text-sm leading-relaxed mt-3 line-clamp-3 font-body">
                            {proj.description}
                          </p>

                          {/* Tech Stack Pills */}
                          <div className="flex flex-wrap gap-1.5 mt-4 max-h-[64px] overflow-hidden">
                            {proj.tech.slice(0, 5).map((t) => (
                              <span
                                key={t}
                                onMouseEnter={playHoverTick}
                                className="bp-chip !text-[0.65rem] !py-0.5 !px-2.5"
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
                            className="bp-btn-primary !py-2.5 !px-5 !text-xs"
                          >
                            Open Drawing <span aria-hidden="true">↗</span>
                          </button>
                          {proj.github && (
                            <a
                              href={proj.github}
                              target="_blank"
                              rel="noreferrer"
                              onClick={playSwitchClick}
                              onMouseEnter={playHoverTick}
                              className="bp-btn-secondary !py-2.5 !px-5 !text-xs"
                            >
                              GitHub Source ↗
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Right Column: Figure Schematics */}
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

                    {/* Bottom Footer Strip */}
                    <div className="hidden sm:flex items-center justify-between px-6 py-1.5 border-t border-current/15 font-mono text-[0.62rem] text-[#8A91A5]">
                      <span>DRAWN BY: A. ABDELAZEEM</span>
                      <span>CHECKED: APPROVED ✓</span>
                      <span>YEAR: {proj.year}</span>
                    </div>

                  </div>
                </TiltCard>
              </div>
            ))}

            {/* ── Archive Drawing Card at End of Reel ─────────────────────── */}
            <div className="w-[85vw] sm:w-[520px] h-[480px] lg:h-[510px] flex-none">
              <TiltCard maxTilt={4} className="h-full w-full">
                <div className="h-full sheet-frame p-8 sm:p-12 text-center shadow-lg flex flex-col items-center justify-center">
                  <span className="bp-stamp text-[#FF4400] border-[#FF4400]">
                    ARCHIVE // COMPLETE INDEX
                  </span>
                  <h3 className="font-display font-black text-3xl sm:text-4xl mt-3 uppercase">
                    ALL {PROJECTS_DATA.length} BLUEPRINTS.
                  </h3>
                  <p className="text-inherit/70 text-sm max-w-sm mt-3 leading-relaxed font-body">
                    Inspect mobile applications, IoT firmware repositories, VHDL processor schematics, and full-stack platforms.
                  </p>
                  <button
                    onClick={() => { playSwitchClick(); onProjectClick('ARCHIVE'); }}
                    onMouseEnter={playHoverTick}
                    className="bp-btn-primary mt-8 !py-3 !px-8"
                  >
                    Open Complete Archive ↗
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
