export const PROJECTS_DATA = [
  {
    id: 'loadr',
    title: 'Loadr Engine',
    subtitle: 'Serverless Native Python & FFmpeg Media Extractor',
    tag: 'Flutter · Python · Native Channels · FFmpeg',
    category: 'mobile',
    color: '#3B82F6',
    img: 'assets/loadr/loadr.png',
    year: '2026',
    status: 'Shipped',
    description:
      'Loadr is a premium, serverless open-source mobile application built with Flutter designed to redefine media extraction. Traditional downloading apps rely on centralized backend scrapers that easily get crushed by IP bans and rate limits. Loadr completely eliminates the backend by running a fully embedded Python runtime (yt-dlp) natively on the client side using Flutter Native Platform Channels. Requests are bridged over the C-API to execute directly through residential IPs, making it bulletproof against server scraping blocks. Features an autonomous Over-The-Air (OTA) self-healing engine updater, background DASH stream remuxing via Native ARM FFmpeg binaries, headless webview session cookie synchronization for authenticated streaming, stealth network layer packet extraction, and multithreaded Dart Isolate background queues.',
    tech: [
      'Flutter',
      'Dart 3',
      'Embedded Python',
      'Native Channels',
      'C-API Bridge',
      'Native FFmpeg (ARM)',
      'yt-dlp Engine',
      'Dart Isolates',
      'Foreground Services',
      'Stateful Queue'
    ],
    features: [
      'Serverless Client-Side Engine: Embedded lightweight Python runtime inside native Android/iOS layers communicating via asynchronous Platform Channels',
      'Autonomous OTA Script Updates: Self-healing background handshake with GitHub to dynamically download and replace yt-dlp scripts without App Store releases',
      'Native ARM FFmpeg DASH Remuxing: Background subprocess merging 4K/2K/1080p separate video & audio stream packets into high-fidelity MP4 containers without RAM crashes',
      'Headless Cookie Synchronization: Secure headless webview extracting active session cookies to bypass OAuth walls and authenticate private video streams',
      'Stealth Network Sniffer: Built-in smart engine sniffing raw video streams and bypassing Cloudflare protection & advertisements',
      'Bulletproof Background Queue: Multithreaded execution via Dart Isolates & foreground services ensuring download persistence across app terminations',
      'Native Precision Trimming: Built-in local library manager for fast post-download media clipping and audio extraction'
    ],
    github: 'https://github.com/amrsaeedcse',
    demos: [
      { label: 'LinkedIn Showcase 01', url: 'https://www.linkedin.com/posts/amr-saeed-cse_flutter-python-softwareengineering-ugcPost-7470505209228582913-v5C2/' },
      { label: 'LinkedIn Showcase 02', url: 'https://www.linkedin.com/posts/amr-saeed-cse_flutter-python-softwareengineering-ugcPost-7481524462291636224-ffxS/' }
    ],
    screenshots: [
      'assets/loadr/loadr.png'
    ],
  },
  {
    id: 'batrina',
    title: 'Batrina Full-Stack',
    subtitle: 'High-Performance Social E-Commerce Platform',
    tag: 'Flutter · Node.js · MongoDB · Socket.io',
    category: 'fullstack',
    color: '#FF4400',
    img: 'assets/batrina/hero.webp',
    year: '2026',
    status: 'Shipped',
    description:
      'A social e-commerce ecosystem transforming fashion shopping into a dynamic, community-driven experience. Built with a highly reactive Flutter Clean Architecture mobile client and powered by a scalable, event-driven Node.js, Express & MongoDB backend server. Features low-latency bidirectional live chat between buyers and admins powered by Socket.io, atomic Mongoose transactional inventory locks for concurrency-proof checkouts, Universal App Links & cryptographic Deep Linking (.well-known/assetlinks.json) for zero-friction flows, live color & size matrix customization, JWT & Refresh Token rotation, automated Firebase FCM batch push notifications, and global i18n support across 10+ languages with OLED dark mode and full Arabic RTL styling.',
    tech: [
      'Flutter',
      'Dart 3',
      'Node.js',
      'Express',
      'MongoDB Atlas',
      'Mongoose',
      'Socket.io',
      'Firebase FCM',
      'Cubit / BLoC',
      'Clean Architecture',
      'JWT & OAuth 2.0',
      'Universal Links',
      'i18n & RTL',
      'Figma'
    ],
    features: [
      'Real-time Social Shopping: Low-latency live chat with verified buyers & store admins via Socket.io rooms with typing presence',
      'Enterprise Deep Linking: Cryptographically verified App Links (.well-known/assetlinks.json) for 2-step password recovery and catalog virality',
      'Matrix Inventory Engine: Instantaneous color switching & real-time dynamic sizing stock counts powered by Mongoose schemas',
      'ACID Concurrency Safeguards: Atomic transactional inventory decrements preventing overselling during traffic peaks',
      'Live Promo Code Engine: Real-time discount rule validations for percentage & fixed pricing reductions',
      'Dual-Token Security: Bcrypt salting, JWT Access/Refresh token rotation, and Google OAuth 2.0 integration',
      'Global UX: 10+ localized native dialects with flawless Arabic Right-to-Left (RTL) mirroring and OLED theme',
      'Integrated Admin Suite: Instantaneous toggling between consumer storefront and executive business fulfillment command'
    ],
    github: 'https://github.com/amrsaeedcse/batrina-fullstack',
    demos: [
      { label: 'LinkedIn Demonstration', url: 'https://www.linkedin.com/posts/amr-saeed-cse_flutter-nodejs-mongodb-ugcPost-7452397423475384320-1sYN/' }
    ],
    screenshots: [
      'assets/batrina/hero.webp',
      'assets/batrina/3- Home.png',
      'assets/batrina/Gemini_Generated_Image_d6zbovd6zbovd6zb.jpg'
    ],
  },
  {
    id: 'green-guardian',
    title: 'Green Guardian IoT',
    subtitle: 'Automated Smart Plant Monitoring & Irrigation System',
    tag: 'ESP32 · C++ · Flutter · Blynk IoT',
    category: 'hardware',
    color: '#10B981',
    img: 'assets/GreenGuardian/cover.webp',
    year: '2024',
    status: 'Shipped',
    description:
      'An end-to-end IoT engineering solution for real-time agricultural telemetry and automated plant health management. An ESP32 microcontroller interfaces directly with DHT22 environmental sensors and analog soil moisture capacitive probes. Telemetry is streamed over Wi-Fi to cloud endpoints with automated threshold triggers that actuate relay-driven water pumps. A custom Flutter companion application visualizes real-time sensor analytics, logs historical soil hydration data, and allows remote manual override via clean bidirectional MQTT/Blynk protocols.',
    tech: [
      'ESP32 Microcontroller',
      'C / C++',
      'Flutter Mobile',
      'Blynk IoT Protocol',
      'Dart 3',
      'DHT22 Sensor',
      'Capacitive Soil Sensor',
      'Relay Actuators',
      'Embedded PWM'
    ],
    features: [
      'Real-Time Telemetry Streaming: Instantaneous soil moisture, ambient temperature, and humidity sampling',
      'Automated Irrigation Logic: Autonomous threshold evaluation on-chip for fail-safe local pump actuation',
      'Cross-Platform Control Panel: Flutter mobile dashboard for live telemetry graphs and manual pump overrides',
      'Fault Detection & Alerts: Push notification triggers when soil moisture drops below critical botanical thresholds',
      'Low-Power Hardware Design: Optimized ESP32 deep sleep cycles for solar/battery-powered edge deployments'
    ],
    github: 'https://github.com/amrsaeedcse/greenGurdian',
    demos: [],
    screenshots: [
      'assets/GreenGuardian/cover.webp',
      'assets/GreenGuardian/GreenGuardian.png',
      'assets/GreenGuardian/Blynk.png'
    ],
  },
  {
    id: 'mips-32',
    title: 'MIPS-32 Pipelined CPU',
    subtitle: '5-Stage Hardware Architecture with Hazard Forwarding',
    tag: 'VHDL · ModelSim · Quartus · FPGA',
    category: 'hardware',
    color: '#F59E0B',
    img: 'assets/mips-32/MIPS32_Block.png',
    year: '2023',
    status: 'Academic',
    description:
      'A hardware realization of a 32-bit pipelined MIPS RISC processor designed and synthesized in VHDL for FPGA deployment. Architected with a classic 5-stage pipeline: Instruction Fetch (IF), Instruction Decode (ID), Execution (EX), Memory Access (MEM), and Write-Back (WB). Features a dedicated hardware forwarding unit and hazard detection circuitry to resolve data dependencies without stalling, branch prediction logic, a 32-word 32-bit dual-port Register File, and a comprehensive ALU capable of arithmetic, bitwise logical, shift, and comparison operations.',
    tech: [
      'VHDL Hardware Description',
      'Quartus Prime',
      'ModelSim Simulation',
      'FPGA Synthesis',
      'Computer Architecture',
      'Digital Logic Design'
    ],
    features: [
      '5-Stage Pipelined Datapath: Instruction Fetch, Decode, Execute, Memory, and Writeback stages running in parallel',
      'Hardware Hazard & Forwarding Unit: Resolves Read-After-Write (RAW) data hazards seamlessly with minimum pipeline stalls',
      'Branch Prediction & Flushes: Resolves control hazards with branch evaluation and pipeline clearing',
      '32-bit Dual-Port Register File: Supports simultaneous two-register reads and one write in a single clock cycle',
      'Full Instruction Set Coverage: Arithmetic (ADD, SUB), Logical (AND, OR, XOR, NOR), Memory (LW, SW), and Branching (BEQ, BNE, J)'
    ],
    github: 'https://github.com/amrsaeedcse/mips-32',
    demos: [],
    screenshots: [
      'assets/mips-32/MIPS32_Block.png',
      'assets/mips-32/MIPS32_multi-cycle_diagram.png'
    ],
  },
  {
    id: 'ai-todo',
    title: 'AI Smart Task Planner',
    subtitle: 'Intelligent Task Orchestration with OpenAI Integration',
    tag: 'Flutter · OpenAI API · Clean Architecture',
    category: 'mobile',
    color: '#8B5CF6',
    img: 'assets/ai_todo/hero.webp',
    year: '2024',
    status: 'Shipped',
    description:
      'An intelligent task management and productivity application that uses OpenAI GPT models to deconstruct high-level goals into actionable, prioritized subtasks. Built with Flutter adhering to Clean Architecture principles with BLoC state management and offline-first persistence using Hive. Generates automated daily summaries, workload estimations, and smart scheduling recommendations.',
    tech: [
      'Flutter',
      'Dart 3',
      'OpenAI GPT API',
      'BLoC / Cubit',
      'Hive Local DB',
      'Clean Architecture',
      'Offline First'
    ],
    features: [
      'AI-Powered Goal Decomposition: Automatically breaks complex multi-step objectives into bite-sized actionable tasks',
      'Smart Priority & Time Estimation: Uses machine intelligence to suggest optimal execution orders',
      'Offline-First Synchronized Storage: Fast local caching using Hive NoSQL storage',
      'Interactive Progress Analytics: Dynamic charts tracking completion rates and productivity momentum'
    ],
    github: 'https://github.com/amrsaeedcse/ai_todo_app',
    demos: [],
    screenshots: [
      'assets/ai_todo/hero.webp',
      'assets/ai_todo/ChatGPT Image Sep 9, 2025, 11_29_07 AM.png',
      'assets/ai_todo/Gemini_Generated_Image_u2yiku2yiku2yiku.jpg'
    ],
  },
  {
    id: 'spotify-clone',
    title: 'Spotify Audio Experience',
    subtitle: 'Music Streaming Client with Audio Pipeline',
    tag: 'Flutter · Audio Player · BLoC',
    category: 'mobile',
    color: '#1DB954',
    img: 'assets/spoify-app/Gemini_Generated_Image_27hq3827hq3827hq.jpg',
    year: '2024',
    status: 'Shipped',
    description:
      'A high-fidelity mobile music streaming application replicating Spotify’s responsive UI and audio streaming pipeline. Features persistent bottom playback controls, dynamic audio buffering, playlist queuing, search filtering, and fluid gesture-driven view transitions.',
    tech: ['Flutter', 'Dart', 'BLoC / Cubit', 'Just Audio', 'Audio Service', 'Clean Architecture'],
    features: [
      'Persistent Background Audio Service: Background playback with lock-screen media controls and notification integration',
      'Dynamic Queue Management: Add to queue, shuffle, repeat, and custom playlist curation',
      'Fluid Micro-Interactions: Custom animations matching modern music streaming standards'
    ],
    github: 'https://github.com/amrsaeedcse/spotify',
    demos: [],
    screenshots: [
      'assets/spoify-app/Gemini_Generated_Image_27hq3827hq3827hq.jpg',
      'assets/spoify-app/Screenshot 2025-08-13 063102.png'
    ],
  },
  {
    id: 'ecommerce-app',
    title: 'Flutter E-Commerce Store',
    subtitle: 'Full-Featured Mobile Shopping App with Firebase',
    tag: 'Flutter · Firebase · Stripe / Paymob',
    category: 'mobile',
    color: '#0EA5E9',
    img: 'assets/eccomerce-app/Gemini_Generated_Image_cjsjaicjsjaicjsj.jpg',
    year: '2024',
    status: 'Shipped',
    description:
      'A full-featured mobile shopping platform built with Flutter and Firebase Firestore backend. Includes secure authentication, product catalog with dynamic category filters, shopping cart state management with Cubit, wishlist synchronization, order history, and payment gateway readiness.',
    tech: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Firebase Storage', 'Cubit'],
    features: [
      'Live Cloud Synchronization: Real-time product inventory and cart updates across devices',
      'Category & Price Filtering: Instant search and multi-criteria product filtering',
      'Secure User Profiles: Address book, order tracking, and order history'
    ],
    github: 'https://github.com/amrsaeedcse/ecommerce-app',
    demos: [],
    screenshots: [
      'assets/eccomerce-app/Gemini_Generated_Image_cjsjaicjsjaicjsj.jpg',
      'assets/eccomerce-app/Screenshot 2025-08-13 040331.png'
    ],
  },
  {
    id: 'drink-app',
    title: 'Drink Recipe Explorer',
    subtitle: 'Interactive Mixology & Recipe Discovery',
    tag: 'Flutter · REST API · Custom UI',
    category: 'mobile',
    color: '#EC4899',
    img: 'assets/drink-app/Gemini_Generated_Image_u6zljzu6zljzu6zl (2).jpg',
    year: '2024',
    status: 'Shipped',
    description:
      'An interactive mixology discovery application developed as part of DEPI graduation track. Consumes external REST endpoints to deliver categorized cocktail recipes, ingredient breakdowns, step-by-step preparation guides, and custom search filters.',
    tech: ['Flutter', 'Dart', 'REST API', 'Dio HTTP Client', 'BLoC'],
    features: [
      'Dynamic Recipe Search: Search by ingredient, glass type, or category',
      'Favorites & Offline Caching: Save recipes locally for offline viewing',
      'Custom Visual Presentation: Tailored image hero transitions and ingredient cards'
    ],
    github: 'https://github.com/OmarAfifi-CSE/depi-flutter-graduation-project',
    demos: [],
    screenshots: [
      'assets/drink-app/Gemini_Generated_Image_u6zljzu6zljzu6zl (2).jpg'
    ],
  },
  {
    id: 'interactive-portfolio',
    title: 'Engineering Blueprint Portfolio',
    subtitle: 'High-Performance 60FPS Reactive Web Experience',
    tag: 'React 19 · Vite · Framer Motion · Canvas 2D',
    category: 'web',
    color: '#3A57C4',
    img: 'assets/portfolio/cover.png',
    year: '2026',
    status: 'Live',
    description:
      'A bespoke technical portfolio designed with an Engineering Blueprint aesthetic. Engineered with React 19, TailwindCSS v4, Framer Motion, and a custom 60FPS Canvas 2D particle constellation engine that dynamically responds to scroll progression and mouse interaction.',
    tech: ['React 19', 'Vite', 'Framer Motion', 'Canvas 2D API', 'Vanilla CSS', 'TailwindCSS v4'],
    features: [
      'Dynamic Particle Engine: 60FPS real-time Canvas 2D particle system reacting dynamically to scroll and mouse physics',
      'Engineering Drafting Design System: Custom technical styling, dimension rules, title blocks, and tactile feedback',
      'Zero Layout Thrashing: Hardware-accelerated transitions with pure transforms and layer isolation'
    ],
    github: 'https://github.com/amrsaeedcse/portfolio',
    demos: [],
    screenshots: [
      'assets/portfolio/cover.png'
    ],
  },
];
