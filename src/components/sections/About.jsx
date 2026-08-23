import { motion } from 'framer-motion';
import { SectionHead, Reveal } from '../ui/blueprint';
import { staggerParent, riseChild } from '../../lib/motionPresets';

const STATS = [
  { value: '3+', label: 'YEARS CODING' },
  { value: '10+', label: 'PROJECTS SHIPPED' },
  { value: '02', label: 'TRAININGS — DEPI / ITI' },
  { value: 'B.SC', label: 'COMPUTER ENGINEERING' },
];

export default function About() {
  return (
    <section id="about" className="relative px-5 md:px-14 py-24 md:py-36">
      <div className="max-w-[1150px] mx-auto grid md:grid-cols-[300px_1fr] gap-12 md:gap-20 items-start">

        {/* ── FIG.01 — personnel photograph ─────────────────────────────── */}
        <Reveal className="relative max-w-[320px] md:max-w-none mx-auto w-full">
          <figure id="photo-frame-border" data-particle-target="about-figure" className="sheet-frame relative">
            <img
              src="assets/about_me/WhatsApp Image 2025-08-06 at 19.10.21_4322cf4b.jpg"
              alt="Amr Abdelazeem"
              loading="lazy"
              className="w-full aspect-[4/5] object-cover block"
              style={{ filter: 'grayscale(16%) contrast(1.04)' }}
            />
            <figcaption className="absolute bottom-0 inset-x-0 z-[4] flex items-center justify-between px-3 py-2 border-t border-line bg-paper/90 backdrop-blur-sm">
              <span className="mono-tiny text-signal">FIG. 01</span>
              <span className="mono-tiny text-ink-3">THE ENGINEER</span>
              <span className="mono-tiny text-ink-3">SCALE 1:1</span>
            </figcaption>
          </figure>

          {/* Dimension annotation on the right edge of the figure */}
          <div className="absolute top-0 bottom-0 -right-7 hidden md:flex flex-col items-center gap-2 select-none" aria-hidden="true" style={{ color: '#82868F' }}>
            <span className="w-px h-4 bg-current" />
            <span className="mono-tiny whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>180 MM</span>
            <span className="w-px flex-1 bg-current" />
            <span className="w-2 h-px bg-current self-center" style={{ marginLeft: '-4px' }} />
          </div>
        </Reveal>

        {/* ── Personnel file ─────────────────────────────────────────────── */}
        <div className="min-w-0">
          <SectionHead no="02" code="PERSONNEL FILE" title="ENGINEER AT HEART." outlineWord="AT" />

          <Reveal>
            <p className="text-ink-2 leading-[1.8] text-[0.95rem] md:text-[1.02rem] mt-6 md:mt-8 max-w-[58ch]">
              Clean Architecture across mobile, backend, and embedded systems.
              I don't just write code — I{' '}
              <em className="not-italic text-signal font-medium">engineer solutions</em>{' '}
              that survive contact with real hardware and real users.
            </p>
          </Reveal>

          {/* Stats — title-block ruled grid */}
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            className="tb-grid mt-9 grid border border-line-strong bg-paper-2"
          >
            {STATS.map(({ value, label }) => {
              const hasPlus = /\+$/.test(value);
              const num = value.replace(/\+$/, '');
              return (
                <motion.div key={label} variants={riseChild}>
                  <div className="font-display font-extrabold text-[1.75rem] leading-none tracking-tight">
                    {num}
                    {hasPlus && <span className="text-signal">+</span>}
                  </div>
                  <div className="mono-tiny text-ink-3 mt-2 leading-relaxed">{label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Field note strip */}
          <Reveal className="mt-8 flex items-center gap-3 select-none">
            <span className="mono-label text-signal">FIELD NOTE</span>
            <span className="h-px w-10 bg-signal/60 inline-block" aria-hidden="true" />
            <span className="mono-label text-ink-2">BUILDING BETWEEN WORLDS</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
