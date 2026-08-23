import { motion } from 'framer-motion';
import TiltCard from '../ui/TiltCard';
import { playHoverTick } from '../../lib/soundFx';

const METRICS = [
  { val: '03+', label: 'Years Experience', desc: 'Software architecture & hardware engineering' },
  { val: '10+', label: 'Shipped Systems', desc: 'Enterprise apps, IoT nodes & RISC CPUs' },
  { val: '02', label: 'Scholarships', desc: 'Selected for prestigious DEPI & ITI programs' },
  { val: 'B.Sc.', label: 'Computer Engineering', desc: 'Faculty of Engineering, Zagazig University' },
];

export default function About() {
  return (
    <section id="about" className="relative px-5 md:px-14 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12 pb-4 border-b border-current/15 flex items-baseline justify-between gap-4"
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
        <div className="grid lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-start">

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
                  src="assets/about_me/WhatsApp Image 2025-08-06 at 19.10.21_4322cf4b.jpg"
                  alt="Amr Abdelazeem"
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover border border-current/15"
                  style={{ filter: 'grayscale(15%) contrast(1.05)' }}
                />

                {/* Title Block on Portrait */}
                <div className="absolute bottom-6 inset-x-6 bg-inherit p-3 border border-current shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs">FIG. 01 // DOSSIER</span>
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
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 text-inherit/80 text-base sm:text-lg leading-relaxed font-body"
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
            <div className="grid sm:grid-cols-2 gap-4">
              {METRICS.map((m, idx) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                >
                  <TiltCard maxTilt={4}>
                    <div
                      onMouseEnter={playHoverTick}
                      className="sheet-frame p-5 border border-current/15"
                    >
                      <div className="font-mono font-bold text-3xl sm:text-4xl text-[#FF4400]">
                        {m.val}
                      </div>
                      <div className="font-display font-bold text-base mt-1 uppercase">
                        {m.label}
                      </div>
                      <div className="text-inherit/60 text-xs font-mono mt-1">
                        {m.desc}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            {/* Core Domain Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-current/15">
              <span className="text-xs font-mono text-[#8A91A5] mr-2">DISCIPLINES:</span>
              <span onMouseEnter={playHoverTick} className="bp-chip font-bold !text-[#FF4400]">FLUTTER &amp; DART 3</span>
              <span onMouseEnter={playHoverTick} className="bp-chip font-bold !text-[#3A57C4]">C / C++ &amp; EMBEDDED</span>
              <span onMouseEnter={playHoverTick} className="bp-chip font-bold !text-[#0E8345]">FREERTOS &amp; IOT</span>
              <span onMouseEnter={playHoverTick} className="bp-chip font-bold">CLEAN ARCHITECTURE</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
