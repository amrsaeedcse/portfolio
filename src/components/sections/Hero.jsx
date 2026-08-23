import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';
import { PROJECTS_DATA } from '../../data/projects';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const wordVariants = {
  hidden: { y: '120%', opacity: 0, rotate: 3 },
  visible: {
    y: '0%',
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero({ ready = true, scrollToSection, onOpenProject }) {
  const flagship = PROJECTS_DATA[0]; // Loadr Engine

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-center px-5 md:px-14 pt-24 pb-12 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto w-full relative z-10"
      >
        {/* ── Top Status Bar with Pulse Beacon ────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-current/15 select-none"
        >
          <div className="flex items-center gap-3">
            <span className="bp-stamp text-[#FF4400] bg-[#FF4400]/10 border-[#FF4400]">
              <span className="h-2 w-2 rounded-full bg-[#FF4400] animate-pulse" />
              DWG-000 // SPECIFICATION ACTIVE
            </span>
            <span className="font-mono text-xs text-[#8A91A5] hidden sm:inline font-bold">
              SCALE 1:1 · REVISION 2026.08
            </span>
          </div>

          <span className="font-mono text-xs text-inherit/70 font-bold">
            ZAGAZIG, EG · 30.58° N, 31.50° E
          </span>
        </motion.div>

        {/* ── Main Hero Split Grid ────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1.2fr_0.9fr] gap-8 lg:gap-12 items-center relative">

          {/* Left Column: Kinetic Headline & Actions (100% Above Fold) */}
          <div className="relative z-10">
            {/* Kinetic Masked Headline */}
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-[3.2rem] tracking-tight leading-[1.12] uppercase overflow-hidden">
              <span className="inline-block overflow-hidden py-0.5">
                <motion.span variants={wordVariants} className="inline-block mr-2.5">
                  Architecting
                </motion.span>
              </span>
              <span className="inline-block overflow-hidden py-0.5">
                <motion.span variants={wordVariants} className="inline-block mr-2.5">
                  scalable
                </motion.span>
              </span>
              <span className="inline-block overflow-hidden py-0.5">
                <motion.span variants={wordVariants} className="inline-block text-[#FF4400] mr-2.5">
                  Mobile Apps
                </motion.span>
              </span>
              <br className="hidden sm:inline" />
              <span className="inline-block overflow-hidden py-0.5">
                <motion.span variants={wordVariants} className="inline-block mr-2.5">
                  &amp; real-time
                </motion.span>
              </span>
              <span className="inline-block overflow-hidden py-0.5">
                <motion.span variants={wordVariants} className="inline-block text-[#3A57C4]">
                  Embedded Silicon.
                </motion.span>
              </span>
            </h1>

            <motion.p
              variants={itemVariants}
              className="text-inherit/75 text-sm sm:text-base leading-relaxed mt-4 max-w-2xl font-body"
            >
              I am <strong className="text-inherit font-bold">Amr Abdelazeem</strong> — a Computer &amp; Systems Engineer bridging reactive Flutter mobile UIs with bare-metal microcontrollers. Building enterprise Flutter applications with Clean Architecture and engineering C/C++, FreeRTOS &amp; FPGA firmware.
            </motion.p>

            {/* Direct Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3 mt-6"
            >
              <button
                onClick={() => { playSwitchClick(); scrollToSection('work'); }}
                onMouseEnter={playHoverTick}
                className="bp-btn-primary !py-2.5 !px-5"
              >
                Inspect Drawing Set <span aria-hidden="true">↗</span>
              </button>
              <a
                href="assets/Amr_Abdelazeem_Resume.pdf"
                download="Amr_Abdelazeem_Resume.pdf"
                onClick={playSwitchClick}
                onMouseEnter={playHoverTick}
                className="bp-btn-secondary !py-2.5 !px-5"
              >
                Download Resume <span aria-hidden="true">↓</span>
              </a>
              <button
                onClick={() => { playSwitchClick(); scrollToSection('contact'); }}
                onMouseEnter={playHoverTick}
                className="bp-btn-secondary !py-2.5 !px-5"
              >
                Work Order →
              </button>
            </motion.div>

            {/* Quick Metrics & Profiles Bar */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 mt-6 pt-5 border-t border-current/15 text-xs font-mono"
            >
              <span className="text-[#8A91A5] font-bold">CHANNELS:</span>
              <a href="https://github.com/amrsaeedcse" target="_blank" rel="noreferrer" onMouseEnter={playHoverTick} className="hover:text-[#FF4400] font-bold transition-colors">
                GITHUB ↗
              </a>
              <a href="https://linkedin.com/in/amrsaeed-cse" target="_blank" rel="noreferrer" onMouseEnter={playHoverTick} className="hover:text-[#3A57C4] font-bold transition-colors">
                LINKEDIN ↗
              </a>
              <a href="https://wa.me/201121153059" target="_blank" rel="noreferrer" onMouseEnter={playHoverTick} className="hover:text-[#0E8345] font-bold transition-colors">
                WHATSAPP ↗
              </a>

              <span className="text-[#8A91A5] mx-1 hidden sm:inline">|</span>

              <span className="bp-chip !text-[0.62rem] !py-0.5 !px-2 font-bold text-[#0E8345]">
                ● AVAILABLE FOR CONTRACTS
              </span>
            </motion.div>
          </div>

          {/* Right Column: 3D Spatial Flagship Project Spotlight Card */}
          <motion.div variants={itemVariants} className="relative">
            <TiltCard maxTilt={6}>
              <div className="sheet-frame p-6 shadow-2xl relative overflow-hidden bg-current/5 flex flex-col justify-between group">

                {/* Title Block Header */}
                <div className="flex items-center justify-between pb-3 border-b border-current/15 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FF4400] animate-pulse" />
                    <span className="font-mono font-bold text-xs text-[#FF4400]">
                      DWG-001 // FLAGSHIP ARCHITECTURE
                    </span>
                  </div>
                  <span className="bp-stamp !text-[0.55rem] !py-0.2 !px-1.5 text-[#0E8345] border-[#0E8345]">
                    {flagship.status} · {flagship.year}
                  </span>
                </div>

                {/* Flagship App Image Preview with 3D Depth */}
                <div
                  onClick={() => { playSwitchClick(); onOpenProject?.(flagship); }}
                  className="relative h-48 sm:h-52 overflow-hidden border border-current/20 bg-current/10 cursor-pointer group mb-4"
                >
                  <img
                    src={flagship.img}
                    alt={flagship.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'grayscale(15%) contrast(1.05)' }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bp-stamp !bg-[#F2EFE7] !text-[#111318] transition-opacity font-bold">
                      Inspect Drawing ⤢
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-inherit border border-current font-mono text-[0.58rem] font-bold">
                    FIG. 01 // PRODUCTION APP
                  </div>
                </div>

                {/* Project Specs */}
                <div>
                  <h3 className="font-display font-black text-xl tracking-tight uppercase group-hover:text-[#FF4400] transition-colors">
                    {flagship.title}
                  </h3>
                  <p className="font-mono text-xs text-[#FF4400] font-semibold mt-0.5">
                    {flagship.subtitle}
                  </p>

                  <p className="text-inherit/70 text-xs leading-relaxed mt-2 line-clamp-2 font-body">
                    {flagship.description}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {flagship.tech.slice(0, 4).map((t) => (
                      <span key={t} onMouseEnter={playHoverTick} className="bp-chip !text-[0.62rem] !py-0.5 !px-2">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions & Footer Strip */}
                <div className="flex items-center justify-between pt-4 border-t border-current/15 mt-4">
                  <button
                    onClick={() => { playSwitchClick(); onOpenProject?.(flagship); }}
                    onMouseEnter={playHoverTick}
                    className="bp-btn-primary !py-2 !px-4 !text-xs"
                  >
                    Inspect Blueprint ↗
                  </button>

                  <span className="font-mono text-[0.62rem] text-[#8A91A5] font-bold">
                    60 FPS · C-API NATIVE
                  </span>
                </div>

              </div>
            </TiltCard>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
