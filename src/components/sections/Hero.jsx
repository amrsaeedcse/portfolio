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
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const child = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

export default function Hero({ ready, scrollToSection }) {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center px-5 md:px-14 pt-28 pb-24">
      <RegMarks inset="1.4rem" />

      <motion.div
        variants={parent}
        initial="hidden"
        animate={ready ? 'visible' : 'hidden'}
        className="w-full max-w-[1150px] mx-auto"
      >
        {/* Sheet header row */}
        <motion.div variants={child} className="flex items-center justify-between gap-4 mb-6 md:mb-8">
          <span className="mono-label text-signal">[ PORTFOLIO // REV.2026 ]</span>
          <span className="mono-tiny text-ink-3 hidden sm:block">SHEET 01 — GENERAL ARRANGEMENT</span>
        </motion.div>

        {/* Title block — particles trace this frame */}
        <div data-particle-target="hero">
          <h1 className="h-display select-none" style={{ marginBottom: '0.35rem' }}>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 60 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              style={{ fontSize: 'clamp(3.4rem, 12vw, 9rem)', fontStretch: '125%' }}
            >
              AMR
            </motion.span>
            <motion.span
              className="block h-outline"
              initial={{ opacity: 0, y: 60 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
              style={{ fontSize: 'clamp(2.5rem, 8.6vw, 6.6rem)', fontStretch: '78%', letterSpacing: '0.01em', WebkitTextStroke: '1.5px var(--color-ink)' }}
            >
              ABDELAZEEM
            </motion.span>
          </h1>

          <motion.div variants={child}>
            <Dim label="FLUTTER × EMBEDDED SYSTEMS" color="#FF4400" className="max-w-[520px] mt-3 mb-7 md:mb-9" />
          </motion.div>
        </div>

        <motion.p
          variants={child}
          className="text-ink-2 max-w-[52ch] leading-[1.75] text-[0.95rem] md:text-[1.02rem] mb-9"
        >
          I bridge mobile software and embedded hardware — engineering products
          from the Flutter view layer all the way down to the bare metal.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={child} className="flex flex-wrap items-center gap-3.5 mb-10">
          <button onClick={() => scrollToSection('work')} className="bp-btn bp-btn-primary">
            View Work <span aria-hidden="true">↗</span>
          </button>
          <a href="assets/Amr_Abdelazeem_Resume.pdf" download className="bp-btn">
            Resume <span aria-hidden="true">↓</span>
          </a>
        </motion.div>

        {/* Social chips */}
        <motion.div variants={child} className="flex flex-wrap gap-2.5">
          {SOCIAL_LINKS.map(({ label, abbr, href }) => (
            <a key={abbr} href={href} target="_blank" rel="noreferrer" aria-label={label} className="bp-chip hover:!border-signal hover:!text-signal transition-colors">
              {abbr} — {label}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom sheet strip */}
      <div className="absolute bottom-5 left-5 right-5 md:left-14 md:right-14 flex items-end justify-between pointer-events-none">
        <span className="mono-tiny text-ink-3">30.5877° N · 31.5006° E — ZAGAZIG, EG</span>
        <div className="flex flex-col items-center gap-2 scroll-cue" aria-hidden="true">
          <span className="mono-tiny text-ink-3 hidden md:block">SCROLL</span>
          <span className="block w-px h-8 bg-gradient-to-b from-signal to-transparent" />
        </div>
        <span className="mono-tiny text-ink-3 hidden md:block">SCALE 1:1 // NOMINAL</span>
      </div>
    </section>
  );
}
