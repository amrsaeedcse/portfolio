/// Centralised portfolio data — extracted from the React web source.
/// Separates data concerns from UI components as required by the architecture rules.

// ── Projects ────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  img: string; // URL — remote hosted or local asset path
  year: string;
  status: 'Shipped' | 'Live' | 'Academic';
  description: string;
  tech: string[];
  features: string[];
  github: string;
}

export const kProjects: Project[] = [
  {
    id: 'batrina',
    title: 'Batrina',
    subtitle: 'Full-Stack E-Commerce Mobile App',
    tag: 'Flutter · Node.js · MongoDB',
    color: '#0ea5e9',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    year: '2024',
    status: 'Shipped',
    description:
      'A production-grade e-commerce platform built with Flutter. Originally backed by Firebase, I completely migrated the backend architecture to a custom Node.js and MongoDB REST API to ensure high scalability and avoid "Pay as you go" vendor lock-in. I retained Firebase FCM exclusively for push notifications. The Flutter client follows strict Clean Architecture principles with a Repository pattern and Bloc/Cubit state management.',
    tech: ['Flutter', 'Dart', 'Node.js', 'MongoDB', 'Express', 'Firebase FCM', 'Bloc/Cubit', 'Clean Architecture'],
    features: [
      'User auth & profile management',
      'Product catalog with search & filters',
      'Real-time cart & order flow',
      'Custom Node.js/MongoDB backend',
      'FCM Push notifications',
    ],
    github: 'https://github.com/amrsaeedcse',
  },
  {
    id: 'ai-todo',
    title: 'AI Todo',
    subtitle: 'AI-Powered Task Manager',
    tag: 'Flutter · OpenAI',
    color: '#a855f7',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    year: '2024',
    status: 'Shipped',
    description:
      "An intelligent task management application that integrates OpenAI's GPT API to auto-generate subtasks, suggest priorities, and summarize your day. Built with Flutter using Clean Architecture and the Bloc pattern. Features offline-first Hive local storage.",
    tech: ['Flutter', 'Dart', 'OpenAI API', 'Bloc/Cubit', 'Hive', 'Clean Architecture', 'HTTP'],
    features: [
      'AI-generated task breakdowns',
      'Smart priority suggestions',
      'Daily summary generation',
      'Offline-first with Hive',
      'Beautiful animated UI',
    ],
    github: 'https://github.com/amrsaeedcse/ai_todo_app',
  },
  {
    id: 'green-guardian',
    title: 'Green Guardian',
    subtitle: 'IoT Smart Plant Monitoring System',
    tag: 'ESP32 · Flutter · Blynk',
    color: '#10b981',
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    year: '2024',
    status: 'Live',
    description:
      'An end-to-end IoT solution for real-time plant health monitoring. An ESP32 microcontroller reads soil moisture, temperature, and humidity sensors, transmitting data to the Blynk cloud platform. A companion Flutter app visualizes the live data and triggers automated irrigation via a relay module.',
    tech: ['ESP32', 'C / C++', 'Flutter', 'Blynk IoT', 'Dart', 'DHT22 Sensor', 'Soil Moisture Sensor'],
    features: [
      'Real-time sensor data streaming',
      'Automated irrigation control',
      'Historical data charts',
      'Push alerts for critical readings',
      'Cross-platform Flutter dashboard',
    ],
    github: 'https://github.com/amrsaeedcse/greenGurdian',
  },
  {
    id: 'mips-32',
    title: 'MIPS-32 CPU',
    subtitle: 'Pipelined Hardware Processor Design',
    tag: 'VHDL · Quartus',
    color: '#f59e0b',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    year: '2023',
    status: 'Academic',
    description:
      'A fully functional 32-bit pipelined MIPS processor designed in VHDL and synthesized on an FPGA using Quartus Prime. Implements a 5-stage pipeline (IF, ID, EX, MEM, WB) with hazard detection, data forwarding, and branch prediction logic.',
    tech: ['VHDL', 'Quartus Prime', 'ModelSim', 'FPGA', 'Digital Logic Design', 'Computer Architecture'],
    features: [
      '5-stage pipeline (IF/ID/EX/MEM/WB)',
      'Hazard detection & forwarding',
      'Branch prediction unit',
      '32 general-purpose registers',
      'Full MIPS instruction set support',
    ],
    github: 'https://github.com/amrsaeedcse/mips-32',
  },
  {
    id: 'spotify-clone',
    title: 'Spotify Clone',
    subtitle: 'Music Streaming Mobile Application',
    tag: 'Flutter · Cubit',
    color: '#a855f7',
    img: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&q=80',
    year: '2024',
    status: 'Shipped',
    description:
      'A fully functional Spotify clone built with Flutter. Focuses on complex UI/UX animations, audio streaming, and state management using the Cubit pattern.',
    tech: ['Flutter', 'Dart', 'Cubit', 'Audio API', 'Clean Architecture'],
    features: [
      'Audio streaming playback',
      'Complex UI animations',
      'Playlist management',
      'State management with Cubit',
    ],
    github: 'https://github.com/amrsaeedcse/spotify',
  },
  {
    id: 'drink-app',
    title: 'Drink Recipe App',
    subtitle: 'Mixology & Drink Recipes',
    tag: 'Flutter',
    color: '#ec4899',
    img: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80',
    year: '2024',
    status: 'Shipped',
    description:
      'A visually stunning recipe application for exploring drink recipes. Built with Flutter, prioritizing beautiful UI and smooth transitions.',
    tech: ['Flutter', 'Dart', 'REST APIs', 'UI/UX Design'],
    features: ['Recipe browsing', 'Search functionality', 'Favorites', 'Beautiful animations'],
    github: 'https://github.com/OmarAfifi-CSE/depi-flutter-graduation-project',
  },
];

// ── Skills ─────────────────────────────────────────────────────────────────

export interface SkillGroup {
  cat: string;
  color: string;
  items: string[];
}

export const kSkillGroups: SkillGroup[] = [
  { cat: 'Mobile', color: '#0ea5e9', items: ['Flutter', 'Dart', 'Bloc/Cubit', 'Clean Arch', 'Firebase'] },
  { cat: 'Web', color: '#10b981', items: ['React', 'HTML5/CSS3', 'JavaScript', 'Tailwind', 'REST APIs'] },
  { cat: 'Embedded', color: '#f59e0b', items: ['C / C++', 'ESP32', 'Arduino', 'VHDL', 'Sensors'] },
  { cat: 'DevOps', color: '#a855f7', items: ['Git & GitHub', 'Firebase', 'Postman', 'Figma', 'Linux CLI'] },
];

// ── Experience ─────────────────────────────────────────────────────────────

export interface ExperienceItem {
  date: string;
  title: string;
  org: string;
  desc: string;
  color: string;
}

export const kExperience: ExperienceItem[] = [
  {
    date: '2024–Now',
    title: 'Mobile App Trainee',
    org: 'DEPI — Ministry of CIT',
    desc: 'Intensive Flutter & Dart training program, government initiative.',
    color: '#0ea5e9',
  },
  {
    date: 'Summer 2024',
    title: 'Mobile App Trainee',
    org: 'ITI — Information Technology Institute',
    desc: 'Flutter fundamentals, Dart, state management, and Clean Architecture.',
    color: '#a855f7',
  },
  {
    date: '2021–Now',
    title: 'Computer Engineering Student',
    org: 'Zagazig University',
    desc: 'B.Sc. in Computer & Systems Engineering. GPA focus on Embedded & Software.',
    color: '#10b981',
  },
];

// ── About stats ────────────────────────────────────────────────────────────

export const kAboutStats: Array<[string, string]> = [
  ['3+', 'Years Coding'],
  ['10+', 'Projects'],
  ['2', 'Trainings'],
  ['1', 'University'],
];

// ── Social links ───────────────────────────────────────────────────────────

export const kSocialLinks = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/amr-saeed-0bb957373/', color: '#0ea5e9' },
  { label: 'GitHub', url: 'https://github.com/amrsaeedcse', color: '#a855f7' },
  { label: 'WhatsApp', url: 'https://wa.me/201121153059', color: '#10b981' },
];

// ── Contact ────────────────────────────────────────────────────────────────

export const kContactInfo = {
  email: 'amrabdelazeem117@gmail.com',
  phone: '+20 112 115 3059',
  whatsapp: 'https://wa.me/201121153059',
};
