import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCard from '../ui/TiltCard';
import { playSwitchClick, playHoverTick } from '../../lib/soundFx';

const SKILL_CATEGORIES = [
  {
    id: 'mobile',
    label: 'Mobile Development',
    shortLabel: 'Mobile',
    code: 'SW // MOBILE',
    dotColor: '#3B82F6',
    clusters: [
      {
        title: 'Cross-Platform Frameworks & Languages',
        stamp: 'CORE ENGINES',
        tags: ['Flutter', 'React Native', 'Dart 3', 'Python', 'Java', 'JavaScript (ES6+)', 'SQL'],
        desc: 'Developing high-performance, cross-platform mobile apps across iOS and Android with custom widget trees, native compile hooks, and fluid 60fps UI.',
      },
      {
        title: 'Software Architecture & Design Patterns',
        stamp: 'ARCHITECTURE',
        tags: ['Clean Architecture', 'MVVM', 'Custom Hooks Pattern', 'SOLID Principles', 'Repository Pattern', 'GetIt'],
        desc: 'Structuring scalable multi-module codebases with strict separation across Presentation, Domain, Data, and DataSource layers.',
      },
      {
        title: 'State Management & Reactive Systems',
        stamp: 'REACTIVE FLOW',
        tags: ['BLoC / Cubit', 'Provider', 'Riverpod', 'Redux Toolkit (RTK)', 'Context API', 'Zustand'],
        desc: 'Designing predictable unidirectional state flows, managing widget/component lifecycles, and decoupling business logic cleanly from UI layers.',
      },
      {
        title: 'Native Channels & Python Integration',
        stamp: 'SYSTEM HOOKS',
        tags: ['MethodChannel', 'Embedded Python in Flutter', 'Java / Android Bridge', 'Share Intent Receiving', 'Background Isolates'],
        desc: 'Bridging Flutter with native Android Java layers, executing embedded Python runtimes natively via C-API, receiving OS share intents, and running background isolates.',
      },
      {
        title: 'Networking, REST & Secure Storage',
        stamp: 'DATA & STORAGE',
        tags: ['Dio Client', 'Axios', 'REST APIs', 'JWT Interceptors', 'SharedPreferences', 'FlutterSecureStorage', 'SQLite (SQL)', 'AsyncStorage'],
        desc: 'Building robust network layers with automatic token refresh locks, secure Keystore/Keychain encryption, and local SharedPreferences/SQLite SQL persistence.',
      },
      {
        title: 'Deep Linking, Notifications & Cloud',
        stamp: 'DEEP LINKS & PUSH',
        tags: ['Deep Linking (App Links)', 'FCM Push Notifications', 'Action Notifications', 'Firebase Suite', 'Socket.io'],
        desc: 'Implementing cryptographic Deep Links (.well-known/assetlinks.json), handling foreground/background actionable push notifications, and real-time database listeners.',
      },
    ],
  },
  {
    id: 'backend',
    label: 'Web & Backend',
    shortLabel: 'Backend & Web',
    code: 'SRV // WEB',
    dotColor: '#0E8345',
    clusters: [
      {
        title: 'REST APIs & Server Development',
        stamp: 'REST APIS',
        tags: ['Node.js', 'Express', 'Modular Routing', 'Custom Middlewares', 'REST Architecture'],
        desc: 'Building clean and organized RESTful backend services, handling HTTP requests, custom middleware validation, and controllers.',
      },
      {
        title: 'Database Modeling (SQL & NoSQL)',
        stamp: 'DATABASE',
        tags: ['SQL (Relational)', 'MongoDB Atlas', 'Mongoose', 'Schema Design', 'CRUD Operations', 'Indexing'],
        desc: 'Working with relational SQL databases and NoSQL document schemas in MongoDB, modeling data relationships, and writing optimized queries.',
      },
      {
        title: 'Frontend Web & Responsive UI',
        stamp: 'WEB INTERFACES',
        tags: ['React', 'Vanilla CSS3', 'TailwindCSS', 'Vite', 'Framer Motion'],
        desc: 'Developing modern responsive web applications, interactive portfolios, component systems, and clean UI styling.',
      },
      {
        title: 'Real-Time WebSockets & Live Chat',
        stamp: 'REAL-TIME',
        tags: ['Socket.io', 'Bidirectional Events', 'Room Isolation', 'Typing Presence'],
        desc: 'Building low-latency in-app chat systems, live presence indicators, typing indicators, and room event broadcasting.',
      },
      {
        title: 'Authentication & API Security',
        stamp: 'SECURITY',
        tags: ['JWT (Access / Refresh)', 'Bcrypt Password Hashing', 'Token Rotation', 'CORS Middleware'],
        desc: 'Securing API endpoints with Access and Refresh tokens, encrypting passwords with Bcrypt, and handling CORS policies.',
      },
      {
        title: 'Cloud Deployment & Deep Links Hosting',
        stamp: 'DEPLOYMENT',
        tags: ['Vercel', 'Deep Linking (assetlinks.json)', 'Serverless Hosting', 'Environment Variables'],
        desc: 'Deploying backend APIs and frontend web apps to Vercel, hosting cryptographic assetlinks.json for deep links, and configuring environment variables.',
      },
    ],
  },
  {
    id: 'embedded',
    label: 'Hardware & IoT',
    shortLabel: 'Hardware & IoT',
    code: 'HW // SYSTEMS',
    dotColor: '#FFB800',
    clusters: [
      {
        title: 'C / C++ Programming for Hardware',
        stamp: 'PROGRAMMING',
        tags: ['C Language', 'C++ (OOP & Logic)', 'Microcontroller Code', 'Pointers & Memory'],
        desc: 'Writing structured and efficient C and C++ programs for microcontrollers, handling logic, memory, and algorithms.',
      },
      {
        title: 'Microcontrollers & IoT Development',
        stamp: 'MICROCONTROLLERS',
        tags: ['ESP32', 'Arduino IDE', 'STM32', 'GPIO Pins', 'Analog Sensors (ADC)', 'Wi-Fi / BLE'],
        desc: 'Building connected IoT projects using ESP32 and Arduino, reading analog sensor data, and controlling outputs over Wi-Fi/Bluetooth.',
      },
      {
        title: 'Real-Time Operating Systems (FreeRTOS)',
        stamp: 'REAL-TIME OS',
        tags: ['FreeRTOS', 'Task Scheduling', 'Queues', 'Semaphores', 'Multitasking'],
        desc: 'Creating multi-tasking embedded applications with FreeRTOS, managing task priorities and sharing data across tasks safely.',
      },
      {
        title: 'Digital Logic & Computer Architecture',
        stamp: 'FPGA & CPU',
        tags: ['VHDL', 'MIPS Pipelined CPU', 'Digital Logic Design', 'ModelSim', 'Quartus Prime'],
        desc: 'Designing and simulating digital circuits and pipelined RISC processor architectures in VHDL using Quartus and ModelSim.',
      },
      {
        title: 'Hardware Communication Protocols',
        stamp: 'PROTOCOLS',
        tags: ['UART', 'I2C', 'SPI', 'MQTT Protocol', 'Serial Communication'],
        desc: 'Connecting sensors, displays, and modules to microcontrollers over standard serial buses (UART, I2C, SPI) and MQTT.',
      },
      {
        title: 'Sensors, Actuators & Circuit Wiring',
        stamp: 'CIRCUIT DESIGN',
        tags: ['Relay Modules', 'PWM Control', 'Soil Moisture Sensors', 'DHT22 Sensors', 'OLED Displays'],
        desc: 'Wiring sensors and actuators with microcontrollers, controlling relays, reading environmental data, and driving OLED screens.',
      },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Ecosystem',
    shortLabel: 'Tools & DevOps',
    code: 'ENV // TOOLING',
    dotColor: '#8B5CF6',
    clusters: [
      {
        title: 'Version Control & Code Management',
        stamp: 'VERSION CONTROL',
        tags: ['Git', 'GitHub', 'Branching & PRs', 'Merge Workflows', 'Repository Hosting'],
        desc: 'Managing project codebases, tracking versions, collaborating via feature branches, and handling pull requests on GitHub.',
      },
      {
        title: 'API Testing & Documentation',
        stamp: 'TESTING',
        tags: ['Postman', 'Environment Variables', 'API Collections', 'Endpoint Testing'],
        desc: 'Testing and debugging REST API endpoints, managing environment variables, and organizing API request collections.',
      },
      {
        title: 'Command Line & Operating Systems',
        stamp: 'TERMINAL',
        tags: ['Linux (Basic CLI)', 'Terminal Commands', 'Package Managers', 'SSH Basics'],
        desc: 'Navigating Linux systems through terminal commands, managing packages, and running development environments.',
      },
      {
        title: 'UI/UX Design Inspection',
        stamp: 'DESIGN TO CODE',
        tags: ['Figma', 'UI Inspection', 'Asset Export', 'Spacing & Color Tokens', 'Design-to-Code'],
        desc: 'Inspecting Figma design files, measuring paddings and font sizes, exporting assets, and translating designs to code.',
      },
      {
        title: 'Hardware & Simulation Toolchains',
        stamp: 'HARDWARE TOOLS',
        tags: ['PlatformIO', 'Arduino IDE', 'Quartus Prime', 'ModelSim', 'Serial Monitor'],
        desc: 'Compiling and flashing code to microcontrollers, serial debugging, and running VHDL hardware simulations.',
      },
      {
        title: 'Development Environments & IDEs',
        stamp: 'IDEs & EDITORS',
        tags: ['VS Code', 'Android Studio', 'Gradle Basics', 'Extensions & Tooling'],
        desc: 'Configuring modern development editors, managing extensions, debugging applications, and building release packages.',
      },
    ],
  },
];

const Skills = memo(function Skills() {
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
            <span className="text-[#FF4400] font-bold">{currentCategory.clusters.length} DOMAIN CLUSTERS</span>
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

        {/* ── Grouped Domain Clusters Bento Grid ────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {currentCategory.clusters.map((cluster, idx) => (
              <motion.div
                key={cluster.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.2 }}
                className="h-full"
              >
                <TiltCard maxTilt={4} className="h-full">
                  <div
                    onMouseEnter={playHoverTick}
                    className="sheet-frame p-5 sm:p-6 border border-current/15 flex flex-col justify-between group h-full hover:border-[#FF4400] transition-colors shadow-sm bg-inherit relative min-h-[220px]"
                  >
                    <div>
                      {/* Top Header & Stamp */}
                      <div className="flex items-start justify-between gap-2 mb-3 pb-2 border-b border-current/10">
                        <span className="font-display font-black text-base sm:text-lg group-hover:text-[#FF4400] transition-colors uppercase tracking-tight leading-snug">
                          {cluster.title}
                        </span>
                        <span className="bp-stamp !text-[0.55rem] sm:!text-[0.58rem] !py-0.5 !px-2 flex-none font-bold text-[#3A57C4] border-[#3A57C4] group-hover:border-[#FF4400] group-hover:text-[#FF4400] transition-colors">
                          {cluster.stamp}
                        </span>
                      </div>

                      {/* Clustered Tech Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {cluster.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 font-mono text-[0.65rem] font-bold rounded border transition-colors ${
                              tag === 'Flutter' || tag === 'React Native' || tag === 'Node.js' || tag === 'C Language' || tag === 'C++ (OOP & Logic)' || tag === 'Java' || tag === 'Python' || tag === 'SQL' || tag === 'SQL (Relational)' || tag === 'Git'
                                ? 'bg-[#FF4400]/10 border-[#FF4400]/40 text-[#FF4400]'
                                : 'bg-current/5 border-current/15 text-inherit'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Focused Engineering Description */}
                      <p className="text-inherit/80 text-xs font-mono leading-relaxed">
                        {cluster.desc}
                      </p>
                    </div>

                    {/* Bottom Hairline Datum */}
                    <div className="mt-4 pt-2.5 border-t border-current/10 flex items-center justify-between text-[0.6rem] font-mono text-inherit/50">
                      <span>CLUSTER // 0{idx + 1}</span>
                      <span className="text-[#FF4400] font-bold">● ACTIVE PRODUCTION</span>
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
});

export default Skills;
