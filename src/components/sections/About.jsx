import { memo } from 'react';
import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';

const METRICS = [
  { val: '03+', label: 'Years Experience', desc: 'Software architecture & hardware engineering' },
  { val: '10+', label: 'Shipped Systems', desc: 'Enterprise apps, IoT nodes & RISC CPUs' },
  { val: '02', label: 'Scholarships', desc: 'Selected for prestigious DEPI & ITI programs' },
  { val: 'B.Sc.', label: 'Computer Engineering', desc: 'Faculty of Engineering, Zagazig University' },
];

const About = memo(function About() {
  return (
    <section id="about" className="relative px-4 sm:px-8 md:px-14 py-16 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 pb-4 border-b border-current/15 flex items-baseline justify-between gap-4"
        >
          <div>
            <span className="bp-stamp text-[#3A57C4] border-[#3A57C4] mb-2 block w-fit">
              SHEET 01 // PERSONNEL SPECIFICATION
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase">
              ABOUT THE ENGINEER.
            </h2>
          </div>
          <span className="font-mono text-xs text-[#8A91A5] hidden sm:inline">DWG-001 // SEC-01</span>
        </motion.div>

        {/* Dossier Grid */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-8 lg:gap-14 items-start">

          {/* Left Column: FIG.01 Portrait with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto lg:mx-0 w-full max-w-[360px]"
          >
            <TiltCard maxTilt={6}>
              <div className="sheet-frame p-3 shadow-md relative group">
                <img
                  src="assets/about_me/WhatsApp Image 2025-08-06 at 19.10.21_4322cf4b.webp"
                  alt="Amr Abdelazeem"
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[4/5] object-cover border border-current/15"
                  style={{ filter: 'grayscale(15%) contrast(1.05)' }}
                />

                {/* Title Block on Portrait */}
                <div className="absolute bottom-5 inset-x-5 bg-inherit/95 backdrop-blur-sm p-3 border border-current shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[0.65rem] sm:text-xs">FIG. 01 // DOSSIER</span>
                    <span className="bp-stamp !text-[0.55rem] !py-0.2 !px-1.5 text-[#0E8345] border-[#0E8345]">
                      VERIFIED
                    </span>
                  </div>
                  <div className="font-display font-black text-sm mt-1">
                    AMR ABDELAZEEM
                  </div>
                  <div className="font-mono text-[0.62rem] text-[#FF4400] font-bold">
                    COMPUTER &amp; SYSTEMS ENGINEER
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Right Column: Technical Bio & BOM Cards */}
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="space-y-3 sm:space-y-4 text-inherit/80 text-sm sm:text-lg leading-relaxed font-body"
            >
              <p>
                I am a dedicated <strong className="font-bold text-current">Flutter Mobile Developer and Computer Systems Engineer</strong> from Egypt.
                My unique engineering edge lies in mastering the complete computing stack — from user-facing reactive mobile UIs down to memory registers,
                real-time operating system schedulers, and microcontroller buses.
              </p>
              <p>
                Whether architecting enterprise Flutter applications with Clean Architecture and BLoC, or writing low-latency C/C++ firmware
                for ESP32 sensor networks and synthesizing 32-bit pipelined RISC CPUs on FPGAs, I build systems engineered for speed and reliability.
              </p>
            </motion.div>

            {/* 4 BOM Metric Cards with 3D Tilt */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {METRICS.map((m, idx) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <TiltCard maxTilt={4}>
                    <div className="sheet-frame p-4 sm:p-5 h-full flex flex-col justify-between shadow-sm bg-current/5">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono font-bold text-[0.65rem] text-[#3A57C4]">
                            SPEC 0{idx + 1}
                          </span>
                          <span className="bp-chip !text-[0.55rem] !py-0.2 !px-1.5 font-bold">
                            PASS ✓
                          </span>
                        </div>
                        <div className="font-display font-black text-2xl sm:text-3xl text-[#FF4400]">
                          {m.val}
                        </div>
                        <div className="font-display font-bold text-xs sm:text-sm tracking-tight uppercase mt-1">
                          {m.label}
                        </div>
                      </div>
                      <p className="font-mono text-[0.65rem] sm:text-xs text-inherit/70 mt-2">
                        {m.desc}
                      </p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            {/* Engineering Mission Quote Block */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sheet-frame p-4 sm:p-5 bg-current/5 border-l-4 border-l-[#FF4400]"
            >
              <div className="font-mono text-xs text-[#FF4400] font-bold mb-1">
                ENGINEERING PHILOSOPHY // 01
              </div>
              <p className="font-body text-xs sm:text-sm italic text-inherit/85 leading-relaxed">
                "Writing clean, testable Flutter code backed by solid low-level systems principles —
                delivering zero-jank 60fps animations, resilient offline state, and bulletproof software reliability."
              </p>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
});

export default About;
