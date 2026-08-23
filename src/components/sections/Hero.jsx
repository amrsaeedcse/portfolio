import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ARCH_MODES = {
  mobile: {
    id: 'mobile',
    title: 'Mobile Architecture',
    tag: 'FLUTTER × CLEAN ARCHITECTURE',
    badgeColor: '#FF4400',
    layers: [
      { name: 'UI Presentation Layer', desc: '60FPS Reactive Widgets & Material/Cupertino', icon: '📱', status: '60 FPS' },
      { name: 'BLoC State Machine', desc: 'Unidirectional Event/State Stream Pipelines', icon: '⚡', status: 'STREAMING' },
      { name: 'Domain Models & UseCases', desc: 'Pure Business Logic & Entity Abstractions', icon: '🧠', status: 'SYNCHRONIZED' },
      { name: 'Data Engine & Hive DB', desc: 'Dio REST Client & Local NoSQL Caching', icon: '💾', status: 'CACHED' },
    ],
    telemetry: [
      { label: 'State Latency', val: '< 1.8ms' },
      { label: 'Platform Bridge', val: 'Native C-API' },
      { label: 'Architecture', val: 'Clean / SOLID' },
    ],
  },
  embedded: {
    id: 'embedded',
    title: 'Embedded Systems & IoT',
    tag: 'C++ × FREERTOS × HARDWARE',
    badgeColor: '#3A57C4',
    layers: [
      { name: 'Sensor Telemetry Bus', desc: 'Soil Hydration 78% · Temp 24.5°C Sampling', icon: '🌱', status: 'SAMPLING' },
      { name: 'FreeRTOS Scheduler', desc: '4 Deterministic Real-Time Scheduled Tasks', icon: '⏱️', status: 'RUNNING' },
      { name: 'Relay Actuation Unit', desc: 'Autonomous GPIO Micro-Relay Controller', icon: '🔌', status: 'ARMED' },
      { name: 'MQTT Cloud Endpoint', desc: 'Blynk IoT Bidirectional Telemetry Sync', icon: '☁️', status: 'CONNECTED' },
    ],
    telemetry: [
      { label: 'MCU Core', val: 'ESP32 Dual-Core' },
      { label: 'Serial Buses', val: 'UART / I2C / SPI' },
      { label: 'Digital Logic', val: 'VHDL / FPGA' },
    ],
  },
};

export default function Hero({ scrollToSection }) {
  const [activeMode, setActiveMode] = useState('mobile');
  const current = ARCH_MODES[activeMode];

  return (
    <section id="home" className="relative min-h-[94vh] flex flex-col justify-center px-5 md:px-14 pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* ── Top Technical Header Bar ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-[#111318]/15"
        >
          <div className="flex items-center gap-3">
            <span className="bp-stamp text-[#FF4400] bg-[#FF4400]/10 border-[#FF4400]">
              <span className="h-2 w-2 rounded-full bg-[#FF4400] animate-pulse" />
              DWG-000 // SPECIFICATION READY
            </span>
            <span className="font-mono text-xs text-[#8A91A5] hidden sm:inline">
              SCALE 1:1 · REVISION 2026.08
            </span>
          </div>

          <span className="font-mono text-xs text-[#4B5162]">
            ZAGAZIG, EG · 30.58° N, 31.50° E
          </span>
        </motion.div>

        {/* ── Hero Blueprint Grid ────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">

          {/* Left Column: Technical Thesis & Actions */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-4xl sm:text-6xl lg:text-[4.2rem] text-[#111318] tracking-tight leading-[1.08] uppercase"
            >
              Architecting systems at the intersection of{' '}
              <span className="text-[#FF4400]">Mobile Apps</span> &amp;{' '}
              <span className="text-[#3A57C4]">Embedded Hardware</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="text-[#4B5162] text-base sm:text-lg leading-relaxed mt-6 max-w-2xl font-body"
            >
              I am <strong className="text-[#111318] font-bold">Amr Abdelazeem</strong> — a Computer &amp; Systems Engineer
              specializing in enterprise Flutter Clean Architecture applications and bare-metal C/C++, FreeRTOS &amp; FPGA firmware.
            </motion.p>

            {/* Direct Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="flex flex-wrap items-center gap-3.5 mt-8"
            >
              <button
                onClick={() => scrollToSection('work')}
                className="bp-btn-primary"
              >
                Inspect Drawing Set <span aria-hidden="true">↗</span>
              </button>
              <a
                href="assets/Amr_Abdelazeem_Resume.pdf"
                download="Amr_Abdelazeem_Resume.pdf"
                className="bp-btn-secondary"
              >
                Download Resume <span aria-hidden="true">↓</span>
              </a>
              <button
                onClick={() => scrollToSection('contact')}
                className="bp-btn-secondary"
              >
                Work Order →
              </button>
            </motion.div>

            {/* Profiles Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="flex items-center gap-4 mt-8 pt-6 border-t border-[#111318]/15 text-xs font-mono text-[#4B5162]"
            >
              <span>PROFILES:</span>
              <a href="https://github.com/amrsaeedcse" target="_blank" rel="noreferrer" className="hover:text-[#FF4400] transition-colors font-bold">
                GITHUB ↗
              </a>
              <a href="https://linkedin.com/in/amrsaeed-cse" target="_blank" rel="noreferrer" className="hover:text-[#3A57C4] transition-colors font-bold">
                LINKEDIN ↗
              </a>
              <a href="https://wa.me/201121153059" target="_blank" rel="noreferrer" className="hover:text-[#0E8345] transition-colors font-bold">
                WHATSAPP ↗
              </a>
            </motion.div>
          </div>

          {/* Right Column: Interactive Blueprint Architecture Hub */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="sheet-frame p-6 sm:p-8 shadow-md relative overflow-hidden"
          >
            {/* Top Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-[#111318]/15 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMode('mobile')}
                  className={`px-3.5 py-1.5 rounded-sm font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    activeMode === 'mobile'
                      ? 'bg-[#111318] text-[#F2EFE7] shadow-sm'
                      : 'text-[#4B5162] hover:text-[#111318] bg-transparent border border-[#111318]/20'
                  }`}
                >
                  📱 Mobile Stack
                </button>
                <button
                  onClick={() => setActiveMode('embedded')}
                  className={`px-3.5 py-1.5 rounded-sm font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    activeMode === 'embedded'
                      ? 'bg-[#3A57C4] text-white shadow-sm'
                      : 'text-[#4B5162] hover:text-[#111318] bg-transparent border border-[#111318]/20'
                  }`}
                >
                  ⚡ Embedded IoT
                </button>
              </div>

              <span className="bp-stamp text-[#0E8345] border-[#0E8345] bg-[#0E8345]/10">
                ACTIVE BOM
              </span>
            </div>

            {/* Architecture Visual Layers */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-[#FF4400] mb-1">
                  <span>{current.tag}</span>
                  <span className="text-[#8A91A5] text-[0.65rem]">STATUS: COMPILED</span>
                </div>

                {/* 4 Technical Layer Items */}
                {current.layers.map((layer, idx) => (
                  <motion.div
                    key={layer.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    className="p-3 bg-[#F2EFE7] border border-[#111318]/15 hover:border-[#111318] transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg flex-none">{layer.icon}</span>
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-[#111318] text-xs sm:text-sm group-hover:text-[#FF4400] transition-colors truncate">
                          {layer.name}
                        </div>
                        <div className="font-mono text-[0.68rem] text-[#4B5162] truncate">
                          {layer.desc}
                        </div>
                      </div>
                    </div>

                    <span className="bp-stamp !text-[0.58rem] !py-0.5 !px-2 flex-none text-[#111318] border-[#111318]">
                      {layer.status}
                    </span>
                  </motion.div>
                ))}

                {/* Live Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#111318]/15 mt-2">
                  {current.telemetry.map((t) => (
                    <div key={t.label} className="p-2 bg-[#F2EFE7] border border-[#111318]/15 text-center">
                      <div className="font-mono text-[0.6rem] text-[#8A91A5] uppercase">{t.label}</div>
                      <div className="font-mono text-xs text-[#111318] font-bold mt-0.5 truncate">{t.val}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
