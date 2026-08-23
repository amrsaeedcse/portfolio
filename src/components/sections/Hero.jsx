import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero({ ready = true, scrollToSection }) {
  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-center px-5 md:px-14 pt-24 pb-12 overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto w-full relative z-10"
      >
        {/* ── Top Status Bar ─────────────────────────────────────────────── */}
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
        <div className="grid lg:grid-cols-[1.25fr_0.85fr] gap-8 lg:gap-12 items-center">

          {/* Left Column: Thesis & Actions (Compact, 100% Above the Fold) */}
          <div>
            <motion.h1
              variants={itemVariants}
              className="font-display font-black text-3xl sm:text-4xl lg:text-[3.2rem] tracking-tight leading-[1.12] uppercase"
            >
              Architecting scalable <span className="text-[#FF4400]">Mobile Apps</span> &amp; real-time <span className="text-[#3A57C4]">Embedded Silicon</span>.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-inherit/75 text-sm sm:text-base leading-relaxed mt-4 max-w-2xl font-body"
            >
              I am <strong className="text-inherit font-bold">Amr Abdelazeem</strong> — a Computer &amp; Systems Engineer bridging reactive Flutter mobile UIs with bare-metal microcontrollers. Building enterprise Flutter applications with Clean Architecture and engineering C/C++, FreeRTOS &amp; FPGA firmware.
            </motion.p>

            {/* Direct Action Buttons (Prominent & Immediately Visible) */}
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

          {/* Right Column: Executive Engineering Dossier Showcase */}
          <motion.div variants={itemVariants}>
            <TiltCard maxTilt={5}>
              <div className="sheet-frame p-6 shadow-lg relative overflow-hidden bg-current/5">
                {/* Title Block Header */}
                <div className="flex items-center justify-between pb-3 border-b border-current/15 mb-4">
                  <span className="font-mono font-bold text-xs text-[#FF4400]">
                    FIG. 00 // ENGINEER DOSSIER
                  </span>
                  <span className="bp-stamp !text-[0.55rem] !py-0.2 !px-1.5 text-[#0E8345] border-[#0E8345]">
                    VERIFIED ✓
                  </span>
                </div>

                {/* Portrait & Meta */}
                <div className="relative overflow-hidden mb-4 border border-current/20 bg-current/10">
                  <img
                    src="assets/about_me/WhatsApp Image 2025-08-06 at 19.10.21_4322cf4b.jpg"
                    alt="Amr Abdelazeem"
                    className="w-full h-56 sm:h-64 object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                    style={{ filter: 'grayscale(15%) contrast(1.05)' }}
                  />
                  {/* Schematic stamp overlay */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-inherit border border-current font-mono text-[0.6rem] font-bold">
                    SPECIFICATION // 1:1
                  </div>
                </div>

                {/* Core Credentials Breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-inherit border border-current/10 font-mono text-xs">
                    <span className="text-inherit/60">DISCIPLINE</span>
                    <span className="font-bold text-[#FF4400]">Flutter &amp; Systems Architecture</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-inherit border border-current/10 font-mono text-xs">
                    <span className="text-inherit/60">ACADEMICS</span>
                    <span className="font-bold">B.Sc. Computer Engineering</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-inherit border border-current/10 font-mono text-xs">
                    <span className="text-inherit/60">FELLOWSHIPS</span>
                    <span className="font-bold text-[#3A57C4]">DEPI &amp; ITI Scholar</span>
                  </div>
                </div>

                {/* Footer Stamp */}
                <div className="flex items-center justify-between pt-3 border-t border-current/15 mt-4 font-mono text-[0.62rem] text-[#8A91A5]">
                  <span>DWG-000-HERO</span>
                  <span>APPROVED: A. ABDELAZEEM</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
