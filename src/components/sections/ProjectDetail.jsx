import React from 'react';
import { motion } from 'framer-motion';

export const PROJECTS_DATA = [
  {
    id: 'batrina',
    title: 'Batrina',
    subtitle: 'Full-Stack E-Commerce Mobile Application',
    tag: 'Flutter · Node.js · MongoDB',
    color: '#0ea5e9',
    img: '/assets/batrina/3- Home.png',
    year: '2024',
    status: 'Shipped',
    description:
      'A production-grade e-commerce platform built with Flutter. Originally backed by Firebase, I completely migrated the backend architecture to a custom Node.js and MongoDB REST API to ensure high scalability and avoid "Pay as you go" vendor lock-in. I retained Firebase FCM exclusively for push notifications. The Flutter client follows strict Clean Architecture principles with a Repository pattern and Bloc/Cubit state management.',
    tech: ['Flutter', 'Dart', 'Node.js', 'MongoDB', 'Express', 'Firebase FCM', 'Bloc/Cubit', 'Clean Architecture', 'REST APIs', 'Figma'],
    features: ['User auth & profile management', 'Product catalog with search & filters', 'Real-time cart & order flow', 'Custom Node.js/MongoDB backend', 'FCM Push notifications'],
    github: 'https://github.com/amrsaeedcse', // Note: Need exact Batrina repo name if it exists, leaving as profile for now since it wasn't in top 100 search results.
    screenshots: ['/assets/batrina/3- Home.png'],
  },
  {
    id: 'ai-todo',
    title: 'AI Todo',
    subtitle: 'AI-Powered Task Manager',
    tag: 'Flutter · OpenAI',
    color: '#a855f7',
    img: '/assets/ai_todo/ChatGPT Image Sep 9, 2025, 11_29_07 AM.png',
    year: '2024',
    status: 'Shipped',
    description:
      'An intelligent task management application that integrates OpenAI\'s GPT API to auto-generate subtasks, suggest priorities, and summarize your day. Built with Flutter using Clean Architecture and the Bloc pattern. Features offline-first Hive local storage.',
    tech: ['Flutter', 'Dart', 'OpenAI API', 'Bloc/Cubit', 'Hive', 'Clean Architecture', 'HTTP'],
    features: ['AI-generated task breakdowns', 'Smart priority suggestions', 'Daily summary generation', 'Offline-first with Hive', 'Beautiful animated UI'],
    github: 'https://github.com/amrsaeedcse/ai_todo_app',
    screenshots: ['/assets/ai_todo/ChatGPT Image Sep 9, 2025, 11_29_07 AM.png'],
  },
  {
    id: 'green-guardian',
    title: 'Green Guardian',
    subtitle: 'IoT Smart Plant Monitoring System',
    tag: 'ESP32 · Flutter · Blynk',
    color: '#10b981',
    img: '/assets/GreenGuardian/cover.jpeg',
    year: '2024',
    status: 'Live',
    description:
      'An end-to-end IoT solution for real-time plant health monitoring. An ESP32 microcontroller reads soil moisture, temperature, and humidity sensors, transmitting data to the Blynk cloud platform. A companion Flutter app visualizes the live data and triggers automated irrigation via a relay module.',
    tech: ['ESP32', 'C / C++', 'Flutter', 'Blynk IoT', 'Dart', 'DHT22 Sensor', 'Soil Moisture Sensor', 'Relay Module'],
    features: ['Real-time sensor data streaming', 'Automated irrigation control', 'Historical data charts', 'Push alerts for critical readings', 'Cross-platform Flutter dashboard'],
    github: 'https://github.com/amrsaeedcse/greenGurdian',
    screenshots: ['/assets/GreenGuardian/cover.jpeg'],
  },
  {
    id: 'mips-32',
    title: 'MIPS-32 CPU',
    subtitle: 'Pipelined Hardware Processor Design',
    tag: 'VHDL · Quartus',
    color: '#f59e0b',
    img: '/assets/mips-32/MIPS32_Block.png',
    year: '2023',
    status: 'Academic',
    description:
      'A fully functional 32-bit pipelined MIPS processor designed in VHDL and synthesized on an FPGA using Quartus Prime. Implements a 5-stage pipeline (IF, ID, EX, MEM, WB) with hazard detection, data forwarding, and branch prediction logic.',
    tech: ['VHDL', 'Quartus Prime', 'ModelSim', 'FPGA', 'Digital Logic Design', 'Computer Architecture'],
    features: ['5-stage pipeline (IF/ID/EX/MEM/WB)', 'Hazard detection & forwarding', 'Branch prediction unit', '32 general-purpose registers', 'Full MIPS instruction set support'],
    github: 'https://github.com/amrsaeedcse/mips-32',
    screenshots: ['/assets/mips-32/MIPS32_Block.png'],
  },
  {
    id: 'spotify-clone',
    title: 'Spotify Clone',
    subtitle: 'Music Streaming Mobile Application',
    tag: 'Flutter · Cubit',
    color: '#a855f7',
    img: '/assets/spoify-app/Gemini_Generated_Image_27hq3827hq3827hq.jpg',
    year: '2024',
    status: 'Shipped',
    description:
      'A fully functional Spotify clone built with Flutter. Focuses on complex UI/UX animations, audio streaming, and state management using the Cubit pattern.',
    tech: ['Flutter', 'Dart', 'Cubit', 'Audio API', 'Clean Architecture'],
    features: ['Audio streaming playback', 'Complex UI animations', 'Playlist management', 'State management with Cubit'],
    github: 'https://github.com/amrsaeedcse/spotify',
    screenshots: ['/assets/spoify-app/Gemini_Generated_Image_27hq3827hq3827hq.jpg'],
  },
  {
    id: 'ecommerce-app',
    title: 'Flutter E-Commerce',
    subtitle: 'Shopping Application with Firebase',
    tag: 'Flutter · Firebase',
    color: '#0ea5e9',
    img: '/assets/eccomerce-app/Gemini_Generated_Image_cjsjaicjsjaicjsj.jpg',
    year: '2024',
    status: 'Shipped',
    description:
      'A robust E-commerce application featuring product browsing, cart management, and user authentication, backed by Firebase and managed with Cubit.',
    tech: ['Flutter', 'Dart', 'Firebase Auth', 'Cloud Firestore', 'Cubit'],
    features: ['User authentication', 'Product catalog', 'Shopping cart', 'Order history'],
    github: 'https://github.com/amrsaeedcse/ecommerce-app',
    screenshots: ['/assets/eccomerce-app/Gemini_Generated_Image_cjsjaicjsjaicjsj.jpg'],
  },
  {
    id: 'drink-app',
    title: 'Drink Recipe App',
    subtitle: 'Mixology & Drink Recipes',
    tag: 'Flutter',
    color: '#ec4899',
    img: '/assets/drink-app/Gemini_Generated_Image_u6zljzu6zljzu6zl (2).jpg',
    year: '2024',
    status: 'Shipped',
    description:
      'A visually stunning recipe application for exploring drink recipes. Built with Flutter, prioritizing beautiful UI and smooth transitions.',
    tech: ['Flutter', 'Dart', 'REST APIs', 'UI/UX Design'],
    features: ['Recipe browsing', 'Search functionality', 'Favorites', 'Beautiful animations'],
    github: 'https://github.com/OmarAfifi-CSE/depi-flutter-graduation-project',
    screenshots: ['/assets/drink-app/Gemini_Generated_Image_u6zljzu6zljzu6zl (2).jpg'],
  },
];

// framer-motion SKILL: tween (not spring) for exit = predictable fast duration
const overlayVariants = {
  hidden:  { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { y: '100%', opacity: 0, transition: { type: 'tween', duration: 0.2 } },
};

// Point 4: React.memo prevents re-render when parent App state changes (Canvas stays fast)
const ProjectDetail = React.memo(function ProjectDetail({ project, onClose }) {
  const { title, subtitle, tag, color, img, year, status, description, tech, features, github, screenshots } = project;

  return (
    <motion.div
      key="detail"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#08080f',
        overflowY: 'auto',
      }}
    >
      {/* Hero image banner */}
      <div style={{ position: 'relative', height: '45vh', overflow: 'hidden' }}>
        <img src={img} alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} />
        {/* Gradient */}
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, #08080f 0%, ${color}22 50%, transparent 100%)` }} />
        {/* Back button */}
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.05, x: -3 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type:'spring', stiffness:400, damping:20 }}
          style={{ position:'absolute', top:'1.5rem', left:'2rem', zIndex: 50, display:'flex', alignItems:'center',
            gap:'0.5rem', background:'#ffffff10', border:`1px solid ${color}44`, borderRadius:'9999px',
            padding:'0.5rem 1.2rem', color:'#f4f4f5', fontFamily:'DM Sans', fontSize:'0.82rem',
            cursor:'pointer', backdropFilter:'blur(8px)' }}>
          ← Back
        </motion.button>
        {/* Title overlay */}
        <div style={{ position:'absolute', bottom:'2rem', left:'2rem', right:'2rem' }}>
          <div style={{ fontFamily:'monospace', fontSize:'0.7rem', color, letterSpacing:'0.2em',
            marginBottom:'0.5rem' }}>{tag} · {year}</div>
          <h1 style={{ fontFamily:"'Bebas Neue'", fontSize:'clamp(3rem, 8vw, 6rem)',
            color:'#f4f4f5', lineHeight:0.9, letterSpacing:'0.02em' }}>{title}</h1>
          <p style={{ fontFamily:'DM Sans', fontSize:'1.05rem', color:'#ffffff88', marginTop:'0.5rem' }}>{subtitle}</p>
        </div>
        {/* Status badge */}
        <div style={{ position:'absolute', top:'1.5rem', right:'2rem', padding:'0.4rem 1rem',
          background:`${color}22`, border:`1px solid ${color}55`, borderRadius:'9999px',
          fontFamily:'DM Sans', fontSize:'0.72rem', color, letterSpacing:'0.1em',
          fontWeight:600 }}>{status}</div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'3rem 2rem 5rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'start' }}>

          {/* Left — Description + screenshots */}
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:'0.7rem', letterSpacing:'0.3em',
              textTransform:'uppercase', color, marginBottom:'1rem' }}>About</div>
            <p style={{ fontFamily:'DM Sans', fontSize:'1rem', lineHeight:1.8,
              color:'#ffffff88', marginBottom:'2.5rem' }}>{description}</p>

            {/* Screenshot(s) */}
            {screenshots.map((src, i) => (
              <div key={i} style={{ borderRadius:'1rem', overflow:'hidden',
                border:`1px solid ${color}22`, marginBottom:'1rem' }}>
                <img src={src} alt={`${title} screenshot ${i+1}`}
                  style={{ width:'100%', height:'220px', objectFit:'cover', display:'block' }} />
              </div>
            ))}

            {/* GitHub CTA */}
            <motion.a href={github} target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              transition={{ type:'spring', stiffness:400, damping:17 }}
              style={{ display:'inline-flex', alignItems:'center', gap:'0.6rem',
                marginTop:'1.5rem', padding:'0.85rem 2rem', borderRadius:'9999px',
                background: color, color:'#0a0a0f', fontFamily:'DM Sans', fontWeight:700,
                fontSize:'0.88rem', textDecoration:'none', letterSpacing:'0.04em' }}>
              View on GitHub ↗
            </motion.a>
          </div>

          {/* Right — Tech stack + Features */}
          <div>
            {/* Tech stack */}
            <div style={{ marginBottom:'2.5rem' }}>
              <div style={{ fontFamily:'DM Sans', fontSize:'0.7rem', letterSpacing:'0.3em',
                textTransform:'uppercase', color, marginBottom:'1rem' }}>Tech Stack</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                {tech.map(t => (
                  <span key={t} style={{ fontFamily:'DM Sans', fontSize:'0.78rem',
                    padding:'0.35rem 0.85rem', borderRadius:'9999px',
                    background:`${color}18`, color:'#f4f4f5cc',
                    border:`1px solid ${color}44`, letterSpacing:'0.03em' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Features list */}
            <div>
              <div style={{ fontFamily:'DM Sans', fontSize:'0.7rem', letterSpacing:'0.3em',
                textTransform:'uppercase', color, marginBottom:'1rem' }}>Key Features</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {features.map((f, i) => (
                  <motion.div key={f}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, ease: 'power3.out' }}
                    style={{ display:'flex', alignItems:'flex-start', gap:'0.75rem',
                      padding:'0.85rem 1rem', background:`${color}0a`,
                      border:`1px solid ${color}20`, borderRadius:'0.6rem' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:color,
                      flexShrink:0, marginTop:'0.3rem' }} />
                    <span style={{ fontFamily:'DM Sans', fontSize:'0.88rem', color:'#ffffff88',
                      lineHeight:1.5 }}>{f}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Color accent card */}
            <div style={{ marginTop:'2rem', padding:'1.5rem', borderRadius:'1rem',
              background:`linear-gradient(135deg, ${color}15, ${color}05)`,
              border:`1px solid ${color}30` }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:'3rem', color, lineHeight:1 }}>{year}</div>
              <div style={{ fontFamily:'DM Sans', fontSize:'0.75rem', color:'#ffffff55',
                letterSpacing:'0.15em', marginTop:'0.25rem', textTransform:'uppercase' }}>Year Built</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default ProjectDetail;
