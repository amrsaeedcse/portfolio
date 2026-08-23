import { motion } from 'framer-motion';
import { SectionHead, Reveal, DomainChip } from '../ui/blueprint';

const GROUPS = [
  {
    cat: 'MOBILE APPLICATION ENGINEERING',
    domain: 'sw',
    spec: 'CORE DISCIPLINE',
    items: [
      { name: 'Flutter & Dart 3', level: 'Production' },
      { name: 'Clean Architecture & SOLID', level: 'Standard' },
      { name: 'BLoC / Cubit / Riverpod', level: 'State Mgmt' },
      { name: 'Native Platform Channels (C/C++)', level: 'Bridge' },
      { name: 'Firebase & Push Notifications (FCM)', level: 'Cloud' },
      { name: 'REST APIs & Offline Hive DB', level: 'Data Layer' },
    ],
  },
  {
    cat: 'EMBEDDED SYSTEMS & HARDWARE',
    domain: 'hw',
    spec: 'CORE DISCIPLINE',
    items: [
      { name: 'C / C++ Embedded Programming', level: 'Firmware' },
      { name: 'ESP32, STM32 & Arduino', level: 'MCU' },
      { name: 'FreeRTOS Multitasking', level: 'Real-Time' },
      { name: 'VHDL & FPGA Digital Logic', level: 'Synthesis' },
      { name: 'UART, I2C, SPI Protocols', level: 'Buses' },
      { name: 'Sensors, Actuators & Relays', level: 'Hardware' },
    ],
  },
  {
    cat: 'BACKEND & FULL-STACK ECOSYSTEM',
    domain: 'sw',
    spec: 'INTEGRATIONS',
    items: [
      { name: 'Node.js & Express.js', level: 'Server' },
      { name: 'MongoDB Atlas & Mongoose', level: 'NoSQL' },
      { name: 'Socket.io Bidirectional Chat', level: 'Real-time' },
      { name: 'JWT & Refresh Token Auth', level: 'Security' },
      { name: 'React 19 & Vite', level: 'Frontend' },
      { name: 'RESTful API Architecture', level: 'Protocols' },
    ],
  },
  {
    cat: 'ENGINEERING WORKFLOW & TOOLS',
    domain: 'hw',
    spec: 'TOOLCHAIN',
    items: [
      { name: 'Git, GitHub & CI/CD Actions', level: 'VCS' },
      { name: 'Linux / Bash Scripting', level: 'CLI' },
      { name: 'PlatformIO & Arduino IDE', level: 'Embedded' },
      { name: 'Quartus Prime & ModelSim', level: 'EDA' },
      { name: 'Postman API Testing', level: 'QA' },
      { name: 'Figma UI/UX Prototyping', level: 'Design' },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative px-5 md:px-14 py-20 md:py-32">
      <div className="max-w-[1150px] mx-auto">
        <SectionHead no="02" code="PARTS LIST // BOM REV.2026" title="CAPABILITIES &amp; STACK." outlineWord="STACK." />

        <Reveal className="mt-10 md:mt-14">
          <div className="sheet-frame px-5 py-6 md:px-10 md:py-9 bg-paper-2">

            {/* Bill of Materials Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 mb-7 relative z-[4]">
              <div className="flex items-center gap-3">
                <span className="mono-label text-signal">BILL OF MATERIALS [BOM]</span>
                <span className="stamp !text-[0.48rem] !py-0.5 !px-2">VERIFIED SPEC</span>
              </div>
              <span className="mono-tiny text-ink-3">SYS ARCHITECTURE // DUAL STACK [SW / HW]</span>
            </div>

            {/* 4 Category Matrix */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
              {GROUPS.map((g, gi) => (
                <motion.div
                  key={g.cat}
                  data-skill-group
                  data-domain={g.domain}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: gi * 0.07 }}
                  className="border-t-2 border-ink pt-4"
                >
                  <header className="flex items-center justify-between gap-3 mb-3.5">
                    <h3 className="h-display text-[1.1rem] md:text-[1.3rem] tracking-wide flex items-baseline gap-2.5">
                      <span className="font-mono text-[0.72rem] font-bold text-signal">{String.fromCharCode(65 + gi)}.</span>
                      {g.cat}
                    </h3>
                    <DomainChip domain={g.domain} />
                  </header>

                  <ul className="divide-y divide-line/40">
                    {g.items.map((item, ii) => (
                      <li key={item.name} className="parts-row">
                        <span className="mono-tiny text-ink-3 tabular-nums w-6 flex-none">
                          {String(ii + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[0.92rem] font-medium text-ink flex-none">{item.name}</span>
                        <span className="leader-dots" aria-hidden="true" />
                        <span className="mono-tiny px-2 py-0.5 border border-line bg-paper/60 text-ink-2 font-mono">
                          {item.level}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Footer Sign-off */}
            <div className="mt-8 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-2 select-none">
              <span className="mono-tiny text-ink-3">DESIGNATION: SOFTWARE &amp; HARDWARE SYSTEMS</span>
              <span className="mono-tiny text-ink-3">STATUS: PRODUCTION READY</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
