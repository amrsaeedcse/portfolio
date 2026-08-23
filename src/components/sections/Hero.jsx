import { motion } from 'framer-motion';
import { RegMarks, Dim } from '../ui/blueprint';
import { EASE } from '../../lib/motionPresets';

const SOCIAL_LINKS = [
  { label: 'GitHub', abbr: 'GH', href: 'https://github.com/amrsaeedcse' },
  { label: 'LinkedIn', abbr: 'LI', href: 'https://linkedin.com/in/amrsaeed-cse' },
  { label: 'WhatsApp', abbr: 'WA', href: 'https://wa.me/201121153059' },
];

const parent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const child = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Hero({ ready, scrollToSection }) {
  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-center px-5 md:px-14 pt-24 pb-20">
      <RegMarks inset="1.4rem" />

      <motion.div
        variants={parent}
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
        className="w-full max-w-[1150px] mx-auto"
      >
        {/* Sheet header row */}
        <motion.div variants={child} className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <span className="mono-label text-signal">[ PORTFOLIO // REV.2026 ]</span>
            <span className="stamp !text-[0.52rem] text-signal !py-1 !px-2.5">AVAILABLE FOR WORK</span>
          </div>
          <span className="mono-tiny text-ink-3 hidden sm:block">SHEET 00 — GENERAL ARRANGEMENT &amp; INDEX</span>
        </motion.div>

        {/* Title block */}
        <div data-particle-target="hero" className="relative">
          <h1 className="h-display select-none" style={{ marginBottom: '0.35rem' }}>
            <motion.span
              className="block tracking-tight text-ink"
              initial={{ opacity: 0, y: 40 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, ease: EASE }}
              style={{ fontSize: 'clamp(3.6rem, 12vw, 9.2rem)', fontStretch: '120%', lineHeight: 0.9 }}
            >
              AMR
            </motion.span>
            <motion.span
              className="block h-outline"
              initial={{ opacity: 0, y: 40 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.4rem, 8.4vw, 6.4rem)',
                fontStretch: '85%',
                letterSpacing: '0.01em',
                lineHeight: 0.95,
                WebkitTextStroke: '1.5px var(--color-ink)',
              }}
            >
              ABDELAZEEM
            </motion.span>
          </h1>

          <motion.div variants={child}>
            <Dim label="FLUTTER ARCHITECTURE × EMBEDDED SYSTEMS" color="#FF4400" className="max-w-[560px] mt-4 mb-7 md:mb-8" />
          </motion.div>
        </div>

        <motion.p
          variants={child}
          className="text-ink-2 max-w-[54ch] leading-[1.8] text-[0.96rem] md:text-[1.05rem] mb-9"
        >
          Computer Systems Engineer bridging the gap between high-level mobile user experiences
          and bare-metal embedded hardware — from reactive Flutter Clean Architecture down to C/C++, FreeRTOS &amp; FPGA logic.
        </motion.p>

        {/* Action CTAs */}
        <motion.div variants={child} className="flex flex-wrap items-center gap-3.5 mb-10">
          <button onClick={() => scrollToSection('work')} className="bp-btn bp-btn-primary">
            Explore Work <span aria-hidden="true">↗</span>
          </button>
          <a href="assets/Amr_Abdelazeem_Resume.pdf" download="Amr_Abdelazeem_Resume.pdf" className="bp-btn">
            Download Resume <span aria-hidden="true">↓</span>
          </a>
          <button onClick={() => scrollToSection('contact')} className="bp-btn">
            Direct Contact <span aria-hidden="true">→</span>
          </button>
        </motion.div>

        {/* Social link chips */}
        <motion.div variants={child} className="flex flex-wrap items-center gap-2.5">
          <span className="mono-tiny text-ink-3 mr-2">INDEX:</span>
          {SOCIAL_LINKS.map(({ label, abbr, href }) => (
            <a
              key={abbr}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="bp-chip hover:!border-signal hover:!text-signal transition-colors"
            >
              {abbr} — {label}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom sheet footer notes */}
      <div className="mt-14 max-w-[1150px] mx-auto w-full flex items-end justify-between select-none border-t border-line pt-4 pointer-events-none">
        <span className="mono-tiny text-ink-3">COORDINATES: 30.5877° N · 31.5006° E — ZAGAZIG, EG</span>
        <div className="flex items-center gap-2 scroll-cue" aria-hidden="true">
          <span className="mono-tiny text-ink-3 hidden sm:inline">SCROLL TO INSPECT</span>
          <span className="mono-tiny text-signal">↓</span>
        </div>
        <span className="mono-tiny text-ink-3 hidden md:block">SCALE 1:1 // NOMINAL SPEC</span>
      </div>
    </section>
  );
}
