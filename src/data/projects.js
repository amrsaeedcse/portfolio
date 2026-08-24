export const PROJECTS_DATA = [
  {
    id: 'loadr',
    title: 'Loadr Engine',
    subtitle: 'Serverless Native Python & FFmpeg Media Extractor',
    tag: 'Flutter · Python · Native Channels · FFmpeg',
    category: 'mobile',
    color: '#3B82F6',
    img: 'assets/loadr/loadr.webp',
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
      'assets/loadr/loadr.webp'
    ],
  },
  {
    id: 'batrina',
    title: 'Batrina Full-Stack',
    subtitle: 'High-Performance Social E-Commerce Platform',
    tag: 'Flutter · Node.js · MongoDB · Socket.io',
    category: 'fullstack',
    color: '#FF4400',
    img: 'assets/batrina/3- Home.webp',
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
      'assets/batrina/3- Home.webp',
      'assets/batrina/1- Onboarding.webp',
      'assets/batrina/2- Authentication.webp',
      'assets/batrina/4- Categories.webp',
      'assets/batrina/5- Product.webp',
      'assets/batrina/6- Product White.webp',
      'assets/batrina/7- Wishlist.webp',
      'assets/batrina/8- Cart.webp',
      'assets/batrina/9- Shipping.webp',
      'assets/batrina/10- Order Details.webp',
      'assets/batrina/11- Chat.webp',
      'assets/batrina/12- Profile.webp',
      'assets/batrina/13- Languages.webp',
      'assets/batrina/14- Profile Arabic.webp',
      'assets/batrina/15- Add Product.webp',
      'assets/batrina/16- Edit Product.webp'
    ],
  },
  {
    id: 'souq-corner',
    title: 'Souq Corner',
    subtitle: 'Localized Real-Time Social Marketplace & In-Stream Chat',
    tag: 'Flutter 3.9+ · Firebase · Node.js · Vercel',
    category: 'mobile',
    color: '#0E8345',
    img: 'assets/souq_corner/home.webp',
    year: '2026',
    status: 'Shipped',
    description:
      'An enterprise-grade, localized, real-time social marketplace platform built with Flutter, Firebase, and Node.js. Engineered for zero-latency communication, offline resilience, and Android system-level background execution. Features product-isolated chat threads, high-fidelity waveform voice notes (1.0x/1.5x/2.0x playback), in-stream price negotiation with atomic Mark-as-Sold and Rate-Seller deal completion, public seller profiles with Firestore 1-per-buyer verified reviews, Android system inline quick reply notifications, adaptive RTL/LTR layout mirroring, and strict Clean Architecture.',
    tech: [
      'Flutter 3.9+',
      'Dart 3.9+',
      'Cloud Firestore',
      'Firebase Auth',
      'Firebase FCM',
      'Node.js Serverless',
      'Vercel Cloud',
      'BLoC / Cubit',
      'GetIt & Injectable',
      'Waveform Audio Player',
      'Android BroadcastReceiver',
      'i18n & RTL Localization'
    ],
    features: [
      'Real-Time Chat & Isolated Threads: Inquiring about distinct products with the same seller routes to isolated conversations (userId1 + userId2 + productId) preventing context collisions',
      'Waveform Voice Notes & Playback: High-fidelity AAC/m4a microphone recording with waveform visualizer and 1.0x / 1.5x / 2.0x playback scrubbers',
      'In-Stream Price Negotiation: Live proposal cards with seller accept/reject actions, atomic "Mark as Sold" transactions, and direct buyer review prompts',
      'Verified Seller Profiles & 1-Review Policy: Atomic recalculation of rating averages and 1-per-buyer review spam protection in Firestore subcollections',
      'Android System-Level Quick Reply: Custom native broadcast receiver for background inline replies directly from notification shades',
      'Adaptive RTL/LTR Localization: Comprehensive Arabic & English locale support with dynamic right-to-left layout flipping'
    ],
    github: 'https://github.com/amrsaeedcse/souq_corner',
    demos: [],
    screenshots: [
      'assets/souq_corner/home.webp',
      'assets/souq_corner/home (2).webp',
      'assets/souq_corner/home (3).webp',
      'assets/souq_corner/pr_details.webp',
      'assets/souq_corner/chats_screen.webp',
      'assets/souq_corner/chat.webp',
      'assets/souq_corner/chat (2).webp',
      'assets/souq_corner/chat (3).webp',
      'assets/souq_corner/chat (4).webp',
      'assets/souq_corner/outer_reply.webp',
      'assets/souq_corner/search_products.webp',
      'assets/souq_corner/add_listing_screen.webp',
      'assets/souq_corner/rate_user.webp',
      'assets/souq_corner/rate_user_2.webp',
      'assets/souq_corner/profile_tab.webp',
      'assets/souq_corner/splash.webp',
      'assets/souq_corner/login.webp'
    ],
  },
  {
    id: 'ai-todo',
    title: 'Smart AI Voice Todo',
    subtitle: 'Task System with Gemini AI Voice Intent & Background Isolates',
    tag: 'Flutter 3.24+ · Node.js · MongoDB · Google Gemini',
    category: 'fullstack',
    color: '#8B5CF6',
    img: 'assets/ai_todo/home2.webp',
    year: '2026',
    status: 'Shipped',
    description:
      'An enterprise-grade, full-stack intelligent Task & Productivity application with multi-lingual AI voice intent parsing, background notification actionable commands, cross-isolate UI synchronizations, and cinematic glassmorphic aesthetics. Built with Flutter Clean Architecture (BLoC/Cubit) and backed by a high-throughput Node.js, Express & MongoDB REST API server with dual JWT access/refresh token rotation.',
    tech: [
      'Flutter 3.24+',
      'Dart 3.5+',
      'Google Gemini AI (Flash-Lite)',
      'Node.js & Express',
      'MongoDB Atlas & Mongoose',
      'BLoC / Cubit',
      'Background Isolates',
      'Android ActionBroadcastReceiver',
      'Dio QueuedInterceptors',
      'flutter_secure_storage',
      'Clean Architecture',
      'go_router'
    ],
    features: [
      'Intelligent Gemini AI Voice Engine: Natural spoken intent parsing in Arabic and English with strict JSON schema extraction for titles, descriptions, and ISO 8601 deadlines',
      'Direct Background Notification Action: Custom Android 12+ ActionBroadcastReceiver executes "Mark as Done ✅" via background isolate REST API without foregrounding the app',
      'Cross-Isolate Real-Time Sync: IsolateNameServer pings the active UI isolate within 1ms to instantly check off tasks and strike through text live on screen',
      'Zero-Deadlock Token Interceptor: Dio QueuedInterceptorsWrapper pauses concurrent 401s, executes single /auth/refresh rotation, and auto-retries queued requests',
      '6-Layer Cinematic UI & Haptics: Radial neon mesh glows, orbital cosmic stardust particles, spotlight deep-link highlights, and smart relative date formatting',
      'Hardware-Level Security: Sensitive tokens stored strictly inside Android Keystore & iOS Keychain via FlutterSecureStorage'
    ],
    github: 'https://github.com/amrsaeedcse/ai_todo_app',
    demos: [],
    screenshots: [
      'assets/ai_todo/home2.webp',
      'assets/ai_todo/home.webp',
      'assets/ai_todo/edit_todo.webp',
      'assets/ai_todo/profile.webp',
      'assets/ai_todo/sign_in.webp',
      'assets/ai_todo/sign_up.webp',
      'assets/ai_todo/reser_pass.webp'
    ],
  },
  {
    id: 'mips-32',
    title: 'MIPS-32 Pipelined CPU',
    subtitle: '5-Stage Hardware Architecture with Hazard Forwarding',
    tag: 'VHDL · ModelSim · Quartus · FPGA',
    category: 'hardware',
    color: '#F59E0B',
    img: 'assets/mips-32/MIPS32_Block.webp',
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
      'assets/mips-32/MIPS32_Block.webp',
      'assets/mips-32/MIPS32_multi-cycle_diagram.webp'
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
      'assets/GreenGuardian/GreenGuardian.webp',
      'assets/GreenGuardian/Blynk.webp'
    ],
  },
  {
    id: 'spotify-clone',
    title: 'Spotify Audio Experience',
    subtitle: 'Music Streaming Client with Audio Pipeline',
    tag: 'Flutter · Audio Player · BLoC',
    category: 'mobile',
    color: '#1DB954',
    img: 'assets/spoify-app/Gemini_Generated_Image_27hq3827hq3827hq.webp',
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
      'assets/spoify-app/Gemini_Generated_Image_27hq3827hq3827hq.webp',
      'assets/spoify-app/Screenshot 2025-08-13 063102.webp'
    ],
  },
  {
    id: 'ecommerce-app',
    title: 'Flutter E-Commerce Store',
    subtitle: 'Full-Featured Mobile Shopping App with Firebase',
    tag: 'Flutter · Firebase · Stripe / Paymob',
    category: 'mobile',
    color: '#0EA5E9',
    img: 'assets/eccomerce-app/Gemini_Generated_Image_cjsjaicjsjaicjsj.webp',
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
      'assets/eccomerce-app/Gemini_Generated_Image_cjsjaicjsjaicjsj.webp',
      'assets/eccomerce-app/Screenshot 2025-08-13 040331.webp'
    ],
  },
  {
    id: 'drink-app',
    title: 'Drink Recipe Explorer',
    subtitle: 'Interactive Mixology & Recipe Discovery',
    tag: 'Flutter · REST API · Custom UI',
    category: 'mobile',
    color: '#EC4899',
    img: 'assets/drink-app/Gemini_Generated_Image_u6zljzu6zljzu6zl (2).webp',
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
      'assets/drink-app/Gemini_Generated_Image_u6zljzu6zljzu6zl (2).webp'
    ],
  },
  {
    id: 'interactive-portfolio',
    title: 'Engineering Blueprint Portfolio',
    subtitle: 'High-Performance 60FPS Reactive Web Experience',
    tag: 'React 19 · Vite · Framer Motion · Canvas 2D',
    category: 'web',
    color: '#3A57C4',
    img: 'assets/portfolio/cover.webp',
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
      'assets/portfolio/cover.webp'
    ],
  },
];
