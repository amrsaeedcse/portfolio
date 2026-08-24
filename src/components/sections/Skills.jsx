import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

const SKILL_CATEGORIES = [
  {
    id: 'mobile',
    label: 'Mobile Architecture',
    shortLabel: 'Mobile',
    code: 'SW // CORE',
    dotColor: '#3B82F6',
    skills: [
      { name: 'Flutter Framework', level: 'EXPERT', desc: 'Cross-platform native compilation, custom render objects & engine hooks' },
      { name: 'Dart 3 Language', level: 'ADVANCED', desc: 'Pattern matching, records, isolates, asynchronous reactive streams' },
      { name: 'Clean Architecture', level: 'EXPERT', desc: 'Strict separation of Presentation, Domain, and Data layers' },
      { name: 'BLoC & Cubit State', level: 'EXPERT', desc: 'Predictable, unidirectional reactive event-to-state stream pipelines' },
      { name: 'Native Platform Channels', level: 'SPECIALIST', desc: 'C/C++ APIs & Native Android/iOS method channel bridging' },
      { name: 'Firebase & Cloud Messaging', level: 'ADVANCED', desc: 'Authentication, Cloud Firestore, Cloud Storage, and FCM Push' },
      { name: 'Offline-First & Hive DB', level: 'ADVANCED', desc: 'High-speed local NoSQL binary storage with encrypted box schemas' },
      { name: 'REST & GraphQL Client', level: 'ADVANCED', desc: 'Dio client, token refresh interceptors, queue locks & caching' },
    ],
  },
  {
    id: 'embedded',
    label: 'Hardware & IoT',
    shortLabel: 'Hardware',
    code: 'HW // SYS',
    dotColor: '#FFB800',
    skills: [
      { name: 'C / C++ Embedded', level: 'ADVANCED', desc: 'Memory pointers, bitwise register manipulation, and low-level drivers' },
      { name: 'ESP32 & STM32 MCUs', level: 'ADVANCED', desc: 'Wi-Fi/BLE stacks, hardware interrupts, timers, and ADC calibrations' },
      { name: 'FreeRTOS Real-Time OS', level: 'PROFICIENT', desc: 'Preemptive multitasking, semaphores, mutexes, and event queues' },
      { name: 'VHDL & FPGA Design', level: 'ACADEMIC', desc: '5-stage pipelined RISC datapath, hazard units & synthesizable RTL' },
      { name: 'Hardware Protocols', level: 'ADVANCED', desc: 'UART, I2C, SPI serial buses, signal analyzers, and debugging' },
      { name: 'Sensors & Actuators', level: 'ADVANCED', desc: 'DHT22, Capacitive probes, Relay drivers, and PWM motor control' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Cloud',
    shortLabel: 'Backend',
    code: 'SRV // NET',
    dotColor: '#0E8345',
    skills: [
      { name: 'Node.js & Express.js', level: 'ADVANCED', desc: 'High-throughput REST API controllers, middleware, and services' },
      { name: 'MongoDB & Mongoose', level: 'ADVANCED', desc: 'ACID transactions, schemas, compound indexing, and aggregations' },
      { name: 'Socket.io Real-Time', level: 'PROFICIENT', desc: 'Low-latency bidirectional WebSocket rooms & presence tracking' },
      { name: 'JWT & Dual Token Auth', level: 'ADVANCED', desc: 'Access/Refresh token rotation, bcrypt salting, and OAuth2 security' },
      { name: 'React 19 & Vite', level: 'PROFICIENT', desc: 'Modern responsive web frontend development & state synchronization' },
    ],
  },
  {
    id: 'tools',
    label: 'DevOps & Toolchain',
    shortLabel: 'Tools',
    code: 'ENV // DEV',
    dotColor: '#8B5CF6',
    skills: [
      { name: 'Git & GitHub CI/CD', level: 'ADVANCED', desc: 'Gitflow branching strategies, actions, and automated builds' },
      { name: 'Linux & Bash Scripting', level: 'ADVANCED', desc: 'Command-line system administration, shell scripts, and daemons' },
      { name: 'PlatformIO & Arduino', level: 'ADVANCED', desc: 'Microcontroller build toolchains, library management, and flashing' },
      { name: 'Quartus Prime & ModelSim', level: 'PROFICIENT', desc: 'FPGA compilation, timing analysis, and RTL waveform simulation' },
      { name: 'Postman & API Testing', level: 'ADVANCED', desc: 'Automated test collections, environments, and mock servers' },
      { name: 'Figma UI/UX Design', level: 'PROFICIENT', desc: 'Design system components, responsive prototypes, and dev handoff' },
    ],
  },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState('mobile');
  const currentCategory = SKILL_CATEGORIES.find((c) => c.id === activeTab) || SKILL_CATEGORIES[0];

  return (
    <section id="skills" className="relative px-4 sm:px-8 md:px-14 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-current/15 select-none"
        >
          <div>
            <span className="bp-stamp text-[#3A57C4] border-[#3A57C4] mb-2 block w-fit font-bold">
              SHEET 02 // BILL OF MATERIALS (BOM)
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase">
              TECHNICAL MATRIX.
            </h2>
          </div>

          {/* Active Domain Stamp */}
          <div className="flex items-center gap-2 font-mono text-xs text-inherit/70">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentCategory.dotColor }} />
            <span className="font-bold text-inherit">{currentCategory.code}</span>
            <span className="text-inherit/40">//</span>
            <span className="text-[#FF4400] font-bold">{currentCategory.skills.length} MODULES</span>
          </div>
        </motion.div>

        {/* ── Unified Segmented Switcher (Distinct Navigation Pill) ─────────── */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="w-full max-w-3xl p-1.5 bg-current/5 border border-current/15 rounded-full flex items-center justify-between gap-1 shadow-inner overflow-x-auto no-scrollbar">
            {SKILL_CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    playSwitchClick();
                    setActiveTab(cat.id);
                  }}
                  onMouseEnter={playHoverTick}
                  className={`relative flex-1 py-2 sm:py-2.5 px-3 sm:px-5 rounded-full font-mono text-xs font-bold uppercase transition-colors cursor-pointer select-none text-center whitespace-nowrap min-h-[40px] flex items-center justify-center gap-2 ${
                    isActive
                      ? 'text-white'
                      : 'text-inherit opacity-70 hover:opacity-100 hover:bg-current/5'
                  }`}
                >
                  {/* Sliding Active Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="skillsSegmentedActivePill"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-[#111318] border border-[#FF4400] rounded-full shadow-md z-0"
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-transform"
                      style={{
                        backgroundColor: isActive ? '#FF4400' : cat.dotColor,
                        transform: isActive ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                    <span className="hidden md:inline">{cat.label}</span>
                    <span className="md:hidden">{cat.shortLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Skills Bento Grid (Refined Components) ───────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5"
          >
            {currentCategory.skills.map((skill, idx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.025, duration: 0.2 }}
              >
                <TiltCard maxTilt={4} className="h-full">
                  <div
                    onMouseEnter={playHoverTick}
                    className="sheet-frame p-4 sm:p-5 border border-current/15 flex flex-col justify-between group h-full hover:border-[#FF4400] transition-colors shadow-sm bg-inherit min-h-[145px] sm:min-h-[155px] relative"
                  >
                    <div>
                      {/* Title & Badge */}
                      <div className="flex items-start justify-between gap-2.5 mb-2 sm:mb-2.5">
                        <span className="font-display font-black text-base sm:text-lg group-hover:text-[#FF4400] transition-colors uppercase tracking-tight leading-snug">
                          {skill.name}
                        </span>
                        <span className={`bp-stamp !text-[0.58rem] sm:!text-[0.62rem] !py-0.5 !px-2 flex-none font-bold ${
                          skill.level === 'EXPERT'
                            ? 'text-[#FF4400] border-[#FF4400]'
                            : skill.level === 'SPECIALIST'
                            ? 'text-[#3A57C4] border-[#3A57C4]'
                            : 'text-current border-current group-hover:border-[#FF4400] group-hover:text-[#FF4400]'
                        }`}>
                          {skill.level}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-inherit/80 text-xs font-mono leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>

                    {/* Bottom Hairline Datum */}
                    <div className="mt-3.5 pt-2 border-t border-current/10 flex items-center justify-between text-[0.6rem] font-mono text-inherit/50">
                      <span>MODULE // 0{idx + 1}</span>
                      <span className="text-[#FF4400] font-bold">● VERIFIED</span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
