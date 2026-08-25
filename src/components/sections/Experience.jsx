import { useRef, memo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import TiltCard from '../ui/TiltCard';
import { playHoverTick } from '../../lib/soundFx';

const MILESTONES = [
  {
    period: '2024 — PRESENT',
    role: 'Mobile Application Trainee',
    organization: 'DEPI — Ministry of Communications & Information Technology',
    description:
      'Selected for nationwide engineering scholarship focusing on enterprise Flutter architecture, Clean Code standards, state management streams, asynchronous native channels, and cloud backends.',
    badge: 'GOVERNMENT SCHOLARSHIP',
    color: '#FF4400',
    tags: ['Flutter', 'Dart 3', 'Clean Architecture', 'REST APIs', 'BLoC', 'Firebase'],
  },
  {
    period: 'SUMMER 2024',
    role: 'Mobile Software Development Trainee',
    organization: 'ITI — Information Technology Institute',
    description:
      'Specialized software engineering training covering Dart fundamentals, cross-platform mobile UI engineering, stateful architectures, local database caching, and collaborative Git workflows.',
    badge: 'TECHNICAL SCHOLARSHIP',
    color: '#3A57C4',
    tags: ['Flutter', 'Cubit', 'Hive Local DB', 'Firebase FCM', 'Git'],
  },
  {
    period: '2021 — PRESENT',
    role: 'B.Sc. in Computer & Systems Engineering',
    organization: 'Zagazig University — Faculty of Engineering',
    description:
      'Pursuing undergraduate engineering degree in Computer & Systems Engineering. Extensive coursework in Computer Architecture, Operating Systems, Real-Time Embedded Systems, Digital Logic Design (VHDL & FPGA), and Advanced Data Structures.',
    badge: 'ACADEMIC DEGREE',
    color: '#0E8345',
    tags: ['Computer Architecture', 'C / C++', 'VHDL & FPGA', 'Operating Systems', 'Algorithms'],
  },
];

const Experience = memo(function Experience() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 60%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <section id="experience" ref={containerRef} className="relative px-4 sm:px-8 md:px-14 py-16 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 pb-4 border-b border-current/15 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3"
        >
          <div>
            <span className="bp-stamp text-[#3A57C4] border-[#3A57C4] mb-2 block w-fit">
              SHEET 04 // CAREER &amp; CREDENTIALS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase">
              MILESTONES &amp; TRACK RECORD.
            </h2>
          </div>
          <span className="font-mono text-xs text-[#8A91A5] font-bold">
            DWG-004 // TIMELINE
          </span>
        </motion.div>

        {/* Timeline Stream with Dynamic Scroll-Reactive Rail */}
        <div className="relative max-w-4xl space-y-6 sm:space-y-8 pl-6 sm:pl-8 md:pl-12">

          {/* ── Background Static Rail ──────────────────────────────────── */}
          <div
            className="absolute left-[9px] sm:left-[13px] md:left-[17px] top-4 bottom-4 w-[2px] bg-current/15 pointer-events-none"
            aria-hidden="true"
          />

          {/* ── Dynamic Glowing Laser Rail (Fills with Scroll) ─────────── */}
          <motion.div
            style={{
              scaleY: smoothProgress,
              transformOrigin: 'top',
            }}
            className="absolute left-[8px] sm:left-[12px] md:left-[16px] top-4 bottom-4 w-[4px] bg-gradient-to-b from-[#FF4400] via-[#3A57C4] to-[#0E8345] shadow-[0_0_12px_rgba(255,68,0,0.5)] pointer-events-none rounded-full"
            aria-hidden="true"
          />

          {MILESTONES.map((m, idx) => (
            <motion.div
              key={m.organization}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Dynamic Luminous Datum Node */}
              <div
                className="absolute -left-[24px] sm:-left-[30px] md:-left-[42px] top-4 sm:top-5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 bg-inherit flex items-center justify-center transition-all duration-300 group-hover:scale-125 shadow-sm"
                style={{ borderColor: m.color }}
              >
                <div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-transform duration-300 group-hover:scale-110 animate-pulse"
                  style={{ backgroundColor: m.color }}
                />
              </div>

              {/* Milestone Card with 3D Tilt */}
              <TiltCard maxTilt={4}>
                <div
                  onMouseEnter={playHoverTick}
                  className="sheet-frame p-5 sm:p-8 bg-current/5 border border-current/15 shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span
                      className="bp-stamp !text-[0.58rem] sm:text-xs font-bold"
                      style={{ borderColor: m.color, color: m.color }}
                    >
                      {m.badge}
                    </span>
                    <span className="font-mono text-xs text-inherit/70 font-bold">{m.period}</span>
                  </div>

                  <h3 className="font-display font-black text-lg sm:text-2xl mt-1.5 uppercase">
                    {m.role}
                  </h3>
                  <p className="font-mono text-xs text-[#FF4400] font-bold mt-1">
                    {m.organization}
                  </p>

                  <p className="text-inherit/75 text-xs sm:text-base leading-relaxed mt-3 sm:mt-4 font-body">
                    {m.description}
                  </p>

                  {/* Tech Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-4 sm:mt-5">
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        onMouseEnter={playHoverTick}
                        className="bp-chip !text-[0.6rem] sm:!text-[0.65rem] !py-0.5 !px-2 sm:!px-2.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
});

export default Experience;
