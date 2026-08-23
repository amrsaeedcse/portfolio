import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

const SKILL_CATEGORIES = [
  {
    id: 'mobile',
    title: 'Mobile Architecture',
    code: 'SW // CORE',
    skills: [
      { name: 'Flutter Framework', level: 'ADVANCED', desc: 'Cross-platform native compilation & engine hooks' },
      { name: 'Dart 3 Language', level: 'ADVANCED', desc: 'Pattern matching, records, isolates, async streams' },
      { name: 'Clean Architecture', level: 'EXPERT', desc: 'Strict separation of Presentation, Domain, Data' },
      { name: 'BLoC & Cubit State', level: 'ADVANCED', desc: 'Predictable unidirectional state streams' },
      { name: 'Native Platform Channels', level: 'SPECIALIST', desc: 'C/C++ & Native Android/iOS bridging' },
      { name: 'Firebase & Push (FCM)', level: 'ADVANCED', desc: 'Auth, Cloud Firestore, Remote Messaging' },
      { name: 'Offline-First & Hive DB', level: 'ADVANCED', desc: 'High-speed local NoSQL binary storage' },
      { name: 'REST & GraphQL APIs', level: 'ADVANCED', desc: 'Dio client, token interceptors, caching' },
    ],
  },
  {
    id: 'embedded',
    title: 'Embedded & Hardware',
    code: 'HW // SYS',
    skills: [
      { name: 'C / C++ Embedded', level: 'ADVANCED', desc: 'Memory management, pointers, register manipulation' },
      { name: 'ESP32 & STM32 MCUs', level: 'ADVANCED', desc: 'Wi-Fi, Bluetooth, GPIO, hardware timers, ADC' },
      { name: 'FreeRTOS Real-Time OS', level: 'PROFICIENT', desc: 'Preemptive multitasking, semaphores, queues' },
      { name: 'VHDL & FPGA Design', level: 'ACADEMIC', desc: 'Pipelined RISC CPU datapath & synthesizable logic' },
      { name: 'Hardware Protocols', level: 'ADVANCED', desc: 'UART, I2C, SPI serial buses & analyzers' },
      { name: 'Sensors & Actuators', level: 'ADVANCED', desc: 'DHT22, Soil capacitive, Relays, PWM control' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Full-Stack',
    code: 'SRV // NET',
    skills: [
      { name: 'Node.js & Express.js', level: 'ADVANCED', desc: 'REST API endpoints, middleware, controllers' },
      { name: 'MongoDB & Mongoose', level: 'ADVANCED', desc: 'ACID transactions, schemas, aggregation' },
      { name: 'Socket.io Real-Time', level: 'PROFICIENT', desc: 'Low-latency live chat & presence tracking' },
      { name: 'JWT & Dual Token Auth', level: 'ADVANCED', desc: 'Access/Refresh token rotation & security' },
      { name: 'React 19 & Vite', level: 'PROFICIENT', desc: 'Modern reactive frontend development' },
    ],
  },
  {
    id: 'tools',
    title: 'Developer Toolchain',
    code: 'ENV // DEV',
    skills: [
      { name: 'Git & GitHub CI/CD', level: 'ADVANCED', desc: 'Branching strategies, actions, automated builds' },
      { name: 'Linux & Bash Scripting', level: 'ADVANCED', desc: 'Command-line system administration & scripts' },
      { name: 'PlatformIO & Arduino IDE', level: 'ADVANCED', desc: 'Microcontroller toolchains & debugging' },
      { name: 'Quartus Prime & ModelSim', level: 'PROFICIENT', desc: 'FPGA compilation & RTL wave simulation' },
      { name: 'Postman API Testing', level: 'ADVANCED', desc: 'Endpoint automation & test suites' },
      { name: 'Figma UI/UX Design', level: 'PROFICIENT', desc: 'Component design & developer handoff' },
    ],
  },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState('mobile');

  return (
    <section id="skills" className="relative px-4 sm:px-8 md:px-14 py-16 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 md:mb-12 pb-4 border-b border-current/15"
        >
          <div>
            <span className="bp-stamp text-[#3A57C4] border-[#3A57C4] mb-2 block w-fit">
              SHEET 02 // BILL OF MATERIALS (BOM)
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase">
              TECHNICAL MATRIX.
            </h2>
          </div>

          {/* Adaptive Category Switcher Tabs (Large, thumb-friendly on mobile) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1.5 px-1 bg-current/5 border border-current/15 max-w-full">
            {SKILL_CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { playSwitchClick(); setActiveTab(cat.id); }}
                  onMouseEnter={playHoverTick}
                  className={`relative flex-none px-4 sm:px-5 py-2.5 font-mono text-xs sm:text-xs font-bold uppercase transition-colors cursor-pointer select-none min-h-[44px] ${
                    isActive
                      ? 'text-white'
                      : 'text-inherit opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Sliding Active Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSkillTabPill"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-[#111318] border border-[#FF4400] z-0 shadow-md"
                      style={{ backgroundColor: '#111318' }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                    <span className={isActive ? 'text-[#FF4400] font-bold' : 'text-inherit/60'}>[{cat.code}]</span>
                    <span>{cat.title}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Skills Bento Grid (Large, bold, prominent cards on mobile) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {SKILL_CATEGORIES.find((c) => c.id === activeTab)?.skills.map((skill, idx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.25 }}
              >
                <TiltCard maxTilt={5}>
                  <div
                    onMouseEnter={playHoverTick}
                    className="sheet-frame p-5 sm:p-6 border border-current/15 flex flex-col justify-between group h-full hover:border-[#FF4400] transition-colors shadow-sm bg-inherit min-h-[140px] sm:min-h-[150px]"
                  >
                    <div>
                      {/* Title & Badge */}
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <span className="font-display font-black text-base sm:text-lg group-hover:text-[#FF4400] transition-colors uppercase tracking-tight">
                          {skill.name}
                        </span>
                        <span className="bp-stamp !text-[0.62rem] sm:!text-[0.65rem] !py-0.5 !px-2 text-current border-current group-hover:border-[#FF4400] group-hover:text-[#FF4400] transition-colors flex-none font-bold">
                          {skill.level}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-inherit/80 text-xs sm:text-xs font-mono leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>

                    {/* Bottom Hairline Datum */}
                    <div className="mt-4 pt-2 border-t border-current/10 flex items-center justify-between text-[0.6rem] font-mono text-inherit/50">
                      <span>VERIFIED SPEC</span>
                      <span className="text-[#FF4400]">● ACTIVE</span>
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
