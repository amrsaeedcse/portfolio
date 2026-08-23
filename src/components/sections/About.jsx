import { motion } from 'framer-motion';
import { SectionHead, Reveal } from '../ui/blueprint';
import { staggerParent, riseChild } from '../../lib/motionPresets';

const STATS = [
  { value: '3+', label: 'YEARS CODING', desc: 'Continuous engineering practice' },
  { value: '10+', label: 'PROJECTS SHIPPED', desc: 'Mobile, IoT & Full-Stack' },
  { value: '02', label: 'SCHOLARSHIPS // ITI & DEPI', desc: 'Ministry of Communications' },
  { value: 'B.SC', label: 'COMPUTER ENGINEERING', desc: 'Systems & Embedded focus' },
];

export default function About() {
  return (
    <section id="about" className="relative px-5 md:px-14 py-20 md:py-32">
      <div className="max-w-[1150px] mx-auto">
        <SectionHead no="01" code="PERSONNEL FILE // DWG.01" title="ENGINEER AT HEART." outlineWord="AT" />

        <div className="grid md:grid-cols-[320px_1fr] gap-10 md:gap-16 items-start mt-10 md:mt-14">

          {/* ── FIG.01 — Photograph ─────────────────────────────── */}
          <Reveal className="relative max-w-[340px] md:max-w-none mx-auto w-full">
            <figure id="photo-frame-border" className="sheet-frame relative overflow-hidden bg-paper-2 shadow-sm">
              <img
                src="assets/about_me/WhatsApp Image 2025-08-06 at 19.10.21_4322cf4b.jpg"
                alt="Amr Abdelazeem"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover block transition-transform duration-700 hover:scale-[1.02]"
                style={{ filter: 'grayscale(12%) contrast(1.05)' }}
              />
              <figcaption className="absolute bottom-0 inset-x-0 z-[4] flex items-center justify-between px-3.5 py-2.5 border-t border-line bg-paper/95 backdrop-blur-sm">
                <span className="mono-tiny text-signal font-semibold">FIG. 01</span>
                <span className="mono-tiny text-ink-2">AMR ABDELAZEEM</span>
                <span className="mono-tiny text-ink-3">ENG // SCALE 1:1</span>
              </figcaption>
            </figure>

            {/* Dimension Callout Annotation */}
            <div className="hidden lg:flex absolute top-0 bottom-0 -right-8 flex-col items-center gap-1.5 select-none" aria-hidden="true" style={{ color: '#82868F' }}>
              <span className="w-px h-6 bg-current" />
              <span className="mono-tiny whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>180 MM // NOMINAL</span>
              <span className="w-px flex-1 bg-current" />
              <span className="w-2.5 h-px bg-current self-center" />
            </div>
          </Reveal>

          {/* ── Dossier Details ─────────────────────────────────────────────── */}
          <div className="min-w-0">
            <Reveal>
              <div className="space-y-4 text-ink-2 leading-[1.85] text-[0.95rem] md:text-[1.03rem]">
                <p>
                  I am a <strong className="text-ink font-semibold">Computer &amp; Systems Engineer</strong> specializing in{' '}
                  <span className="text-signal font-medium">Flutter Mobile Architecture</span> and{' '}
                  <span className="text-bp font-medium">Embedded Systems / IoT</span>.
                </p>
                <p>
                  My engineering philosophy is rooted in Clean Architecture and robust design principles.
                  I don&apos;t build fragile UI wrappers — I construct resilient end-to-end applications that withstand high concurrency,
                  handle complex asynchronous platform channels, and communicate flawlessly with real microcontrollers and cloud endpoints.
                </p>
              </div>
            </Reveal>

            {/* Stats matrix */}
            <motion.div
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="tb-grid mt-8 grid border border-line-strong bg-paper-2"
            >
              {STATS.map(({ value, label, desc }) => {
                const hasPlus = /\+$/.test(value);
                const num = value.replace(/\+$/, '');
                return (
                  <motion.div key={label} variants={riseChild} className="p-4 md:p-5">
                    <div className="font-display font-extrabold text-[1.85rem] md:text-[2.1rem] leading-none tracking-tight text-ink">
                      {num}
                      {hasPlus && <span className="text-signal">+</span>}
                    </div>
                    <div className="mono-label text-ink font-medium mt-2 leading-tight">{label}</div>
                    <div className="mono-tiny text-ink-3 mt-1 leading-snug">{desc}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Technical focus tags */}
            <Reveal className="mt-8 flex flex-wrap items-center gap-2">
              <span className="mono-tiny text-ink-3 mr-2">CORE DISCIPLINES:</span>
              <span className="bp-chip bp-chip--signal">FLUTTER &amp; DART 3</span>
              <span className="bp-chip bp-chip--signal">CLEAN ARCHITECTURE</span>
              <span className="bp-chip bp-chip--blue">C / C++ &amp; EMBEDDED</span>
              <span className="bp-chip bp-chip--blue">ESP32 &amp; FREERTOS</span>
              <span className="bp-chip">NODE.JS &amp; REST APIS</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
