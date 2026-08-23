import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <section id="skills" className="relative px-5 md:px-14 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-4 border-b border-[#111318]/15"
        >
          <div>
            <span className="bp-stamp text-[#3A57C4] border-[#3A57C4] mb-2 block w-fit">
              SHEET 02 // BILL OF MATERIALS (BOM)
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-[#111318] tracking-tight uppercase">
              TECHNICAL MATRIX.
            </h2>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex flex-wrap gap-2">
            {SKILL_CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-3.5 py-1.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#111318] text-[#F2EFE7] shadow-sm'
                      : 'text-[#4B5162] hover:text-[#111318] bg-transparent border border-[#111318]/20'
                  }`}
                >
                  [{cat.code}] {cat.title}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Skills Bento Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {SKILL_CATEGORIES.find((c) => c.id === activeTab)?.skills.map((skill, idx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="sheet-frame p-5 border border-[#111318]/15 bg-[#EAE6DC] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-display font-bold text-[#111318] text-base group-hover:text-[#FF4400] transition-colors">
                      {skill.name}
                    </span>
                    <span className="bp-stamp !text-[0.58rem] !py-0.2 !px-1.5 text-[#111318] border-[#111318]">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-[#4B5162] text-xs font-mono leading-relaxed">
                    {skill.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
