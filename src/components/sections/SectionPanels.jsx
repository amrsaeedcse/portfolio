import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS_DATA } from './ProjectDetail';

// ── HERO PANEL ────────────────────────────────────────────────────────────────
export function HeroPanel({ panelRef, scrollToSection }) {
  return (
    <div ref={panelRef} className="section-panel absolute inset-0 flex items-center px-10 md:px-20"
      style={{ opacity: 1, pointerEvents: 'auto' }}>
      <div id="hero-content" className="w-full max-w-5xl mx-auto">
        {/* Eyebrow */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
          className="flex items-center gap-3 mb-4">
          <div style={{ width: 32, height: 1, background: 'oklch(68% 0.15 200)' }} />
          <span style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'oklch(68% 0.15 200)' }}>
            01 / Flutter · IoT · Systems
          </span>
        </motion.div>

        {/* Giant name */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.76,0,0.24,1] }}
          style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(5rem, 15vw, 11rem)', lineHeight: 0.9, letterSpacing: '0.02em', color: 'oklch(96% 0.005 264)', marginBottom: '0.5rem' }}>
          HI, I'M<br />
          <span style={{ color: 'oklch(68% 0.15 200)' }}>AMR.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
          style={{ fontFamily: 'DM Sans', fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: 'oklch(52% 0.02 264)', maxWidth: '42ch', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Computer & Systems Engineering student at Zagazig University. I bridge the gap between Software Elegance and Hardware Logic.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <motion.button onClick={() => scrollToSection(3)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2rem', borderRadius: '9999px', background: 'oklch(68% 0.15 200)', color: 'oklch(10% 0.01 264)', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.88rem', border:'none', cursor:'pointer', letterSpacing: '0.04em' }}>
            See My Work →
          </motion.button>
          <motion.a href="/assets/Amr_Abdelazeem_Resume.pdf" download whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2rem', borderRadius: '9999px', border: '1px solid oklch(30% 0.02 264)', color: 'oklch(70% 0.01 264)', fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.88rem', textDecoration: 'none' }}>
            Resume ↓
          </motion.a>
        </motion.div>

        {/* Social links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
          style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem' }}>
          {[['GH', 'https://github.com/amrsaeedcse'], ['LI', 'https://linkedin.com/in/amrsaeed-cse'], ['WA', 'https://wa.me/201121153059']].map(([abbr, href]) => (
            <motion.a key={abbr} href={href} target="_blank" rel="noreferrer" whileHover={{ scale: 1.2, color: 'oklch(68% 0.15 200)' }}
              style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.2em', color: 'oklch(35% 0.02 264)', textDecoration: 'none' }}>
              {abbr}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ── ABOUT PANEL ───────────────────────────────────────────────────────────────
export function AboutPanel({ panelRef }) {
  const stats = [['3+', 'Years Coding'], ['10+', 'Projects'], ['2', 'Trainings'], ['1', 'University']];
  return (
    <div ref={panelRef} className="section-panel absolute inset-0 flex items-center px-10 md:px-20"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%', maxWidth: '900px' }}>

        {/* Photo — IoT terminal viewfinder frame, GSAP target: #about-photo */}
        <div id="about-photo" style={{ position: 'relative', padding: '1rem' }}>
          {/* Viewfinder corner brackets */}
          {[['top:0,left:0','borderTop,borderLeft'],['top:0,right:0','borderTop,borderRight'],['bottom:0,left:0','borderBottom,borderLeft'],['bottom:0,right:0','borderBottom,borderRight']].map((_, ci) => {
            const tops = [0,0,'auto','auto']; const lefts = [0,'auto',0,'auto'];
            const rights = ['auto',0,'auto',0]; const bottoms = ['auto','auto',0,0];
            const bTop = ci<2?'2px solid #00FFD1':'none'; const bBot = ci>=2?'2px solid #00FFD1':'none';
            const bLeft = ci%2===0?'2px solid #00FFD1':'none'; const bRight = ci%2===1?'2px solid #00FFD1':'none';
            return <div key={ci} style={{ position:'absolute', top:tops[ci], left:lefts[ci], right:rights[ci], bottom:bottoms[ci], width:32, height:32, borderTop:bTop, borderBottom:bBot, borderLeft:bLeft, borderRight:bRight, zIndex:2 }} />;
          })}
          {/* Scan line effect */}
          <div style={{ position:'absolute', top:0, left:'1rem', right:'1rem', height:'1px', background:'linear-gradient(to right, transparent, #00FFD155, transparent)', zIndex:2 }} />
          {/* Photo container */}
          <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', aspectRatio: '4/5', border:'1px solid #00FFD122' }}>
            <img src="/assets/about_me/WhatsApp Image 2025-08-06 at 19.10.21_4322cf4b.jpg"
              alt="Amr Abdelazeem" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, oklch(10% 0.01 264) 0%, transparent 55%)' }} />
            {/* IoT terminal overlay text */}
            <div style={{ position:'absolute', bottom:'1rem', left:'1rem', fontFamily:'monospace', fontSize:'0.65rem', color:'#00FFD1aa', letterSpacing:'0.1em' }}>AMR.ENG // STATUS: AVAILABLE</div>
          </div>
          {/* Stat badge */}
          <div style={{ position: 'absolute', bottom: '0rem', right: '0rem', background: '#00FFD1', borderRadius: '0.75rem', padding: '0.8rem 1.2rem' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2.2rem', lineHeight: 1, color: '#0a0a0a' }}>10+</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: '#0a0a0a', letterSpacing: '0.1em' }}>PROJECTS</div>
          </div>
        </div>

        {/* Text — GSAP target: #about-text-content */}
        <div id="about-text-content">
          <div style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#00FFD1', marginBottom: '1rem' }}>02 / About Me</div>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.95, color: 'oklch(96% 0.005 264)', marginBottom: '1.5rem' }}>
            ENGINEER<br />AT HEART.
          </h2>
          <p style={{ fontFamily: 'DM Sans', fontSize: '1rem', lineHeight: 1.75, color: 'oklch(52% 0.02 264)', marginBottom: '2rem', maxWidth: '38ch' }}>
            I design scalable systems with Clean Architecture. My engineering background lets me tackle Mobile, Backend, and IoT with equal depth — I don't just code, I <em style={{ color: '#00FFD1' }}>engineer solutions</em>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {stats.map(([num, label]) => (
              <div key={label} style={{ padding: '1rem', border: '1px solid #00FFD122', borderRadius: '0.75rem', background: '#00FFD108' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: '#00FFD1', lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', color: 'oklch(45% 0.02 264)', letterSpacing: '0.1em', marginTop: '0.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SKILLS PANEL ──────────────────────────────────────────────────────────────
const SKILL_GROUPS = [
  { cat: 'Mobile', color: '#0ea5e9', items: ['Flutter', 'Dart', 'Bloc/Cubit', 'Clean Arch', 'Firebase'] },
  { cat: 'Web', color: '#10b981', items: ['React', 'HTML5/CSS3', 'JavaScript', 'Tailwind', 'REST APIs'] },
  { cat: 'Embedded', color: '#f59e0b', items: ['C / C++', 'ESP32', 'Arduino', 'VHDL', 'Sensors'] },
  { cat: 'DevOps', color: '#a855f7', items: ['Git & GitHub', 'Firebase', 'Postman', 'Figma', 'Linux CLI'] },
];

export function SkillsPanel({ panelRef }) {
  return (
    <div ref={panelRef} className="section-panel absolute inset-0 flex items-center px-10 md:px-20"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'oklch(68% 0.15 200)', marginBottom: '1rem' }}>03 / Technical Stack</div>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 0.95, color: 'oklch(96% 0.005 264)', marginBottom: '2rem' }}>
          FULL-STACK<br />THINKING.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {SKILL_GROUPS.map(({ cat, color, items }) => (
            // GSAP target: .skill-card — stagger scale + opacity on scroll enter
            <div key={cat} className="skill-card" style={{
              padding: '1.5rem',
              border: `1px solid ${color}44`,
              borderRadius: '1rem',
              background: `${color}08`,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 0 18px ${color}22, inset 0 0 24px ${color}08`,
            }}>
              {/* Colored glow left border */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: `linear-gradient(to bottom, ${color}, ${color}44)`, boxShadow: `2px 0 12px ${color}88` }} />
              {/* Category label */}
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.2rem', letterSpacing: '0.08em', color, marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>{cat}</div>
              {/* Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                {items.map((item) => (
                  <span key={item} style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '9999px', background: `${color}18`, color: 'oklch(75% 0.01 264)', border: `1px solid ${color}44` }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PROJECTS PANEL — Full-screen horizontal carousel ─────────────────────────
// GSAP controls #project-track xPercent (0 / -25 / -50 / -75) per carousel stop

export function ProjectsPanel({ panelRef, onProjectClick }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div ref={panelRef} className="section-panel absolute inset-0"
      style={{ opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}>

      {/* Section label — top-left, always visible in Projects */}
      <div style={{ position:'absolute', top:'5rem', left:'8vw', zIndex:4,
        fontFamily:'DM Sans', fontSize:'0.7rem', letterSpacing:'0.3em',
        textTransform:'uppercase', color:'#00FFD1' }}>04 / Featured Work</div>

      {/* Progress indicator — which card of 4 */}
      <div style={{ position:'absolute', bottom:'2.5rem', left:'8vw', zIndex:4,
        display:'flex', gap:'0.5rem', alignItems:'center' }}>
        {PROJECTS_DATA.map((_, i) => (
          <div key={i} className={`proj-dot-${i}`}
            style={{ width: i===0?28:8, height:2, borderRadius:999,
              background: i===0?'#00FFD1':'#ffffff22', transition:'all 0.35s ease' }} />
        ))}
      </div>

      {/* The 400vw horizontal track — GSAP targets this element */}
      <div id="project-track"
        style={{ display:'flex', width:'400%', height:'100%', willChange:'transform' }}>

        {PROJECTS_DATA.map((proj, idx) => (
          /* Each card = exactly 25% of 400% track = 100vw */
          <div key={proj.id} style={{ flex:'0 0 25%', position:'relative',
            display:'flex', alignItems:'center', overflow:'hidden' }}>

            {/* Full-bleed background image — right 55% */}
            <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'58%', overflow:'hidden' }}>
              <motion.img src={proj.img} alt={proj.title}
                animate={{ scale: hovered === idx ? 1.06 : 1 }}
                transition={{ duration: 0.6, ease:'easeOut' }}
                style={{ width:'100%', height:'100%', objectFit:'cover',
                  display:'block', filter:'brightness(0.55)' }} />
              {/* Left-to-right gradient masks image edge */}
              <div style={{ position:'absolute', inset:0,
                background:`linear-gradient(to right, #0a0a0f 0%, ${proj.color}18 50%, transparent 100%)` }} />
            </div>

            {/* Left content panel */}
            <div style={{ position:'relative', zIndex:2, padding:'0 8vw',
              maxWidth:'55%', width:'100%' }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}>

              {/* Giant index number */}
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:'clamp(7rem,16vw,13rem)',
                lineHeight:0.85, color:'#ffffff04', marginBottom:'-1rem',
                userSelect:'none' }}>0{idx+1}</div>

              {/* Tech tag */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem',
                padding:'0.3rem 0.8rem', background:`${proj.color}22`,
                border:`1px solid ${proj.color}55`, borderRadius:'9999px',
                fontFamily:'DM Sans', fontSize:'0.7rem', color:proj.color,
                letterSpacing:'0.1em', marginBottom:'1rem' }}>
                {proj.tag}
              </div>

              {/* Title */}
              <h2 style={{ fontFamily:"'Bebas Neue'", fontSize:'clamp(3.5rem,8vw,6.5rem)',
                lineHeight:0.9, color:'#f4f4f5', marginBottom:'1.2rem',
                letterSpacing:'0.02em' }}>{proj.title}</h2>

              {/* Description */}
              <p style={{ fontFamily:'DM Sans', fontSize:'clamp(0.88rem,1.4vw,1rem)',
                color:'#ffffff66', lineHeight:1.75, maxWidth:'36ch',
                marginBottom:'2rem' }}>
                {proj.description.slice(0, 130)}...
              </p>

              {/* CTA buttons */}
              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                <motion.button
                  onClick={() => onProjectClick && onProjectClick(proj)}
                  whileHover={{ scale:1.04, x:3 }}
                  whileTap={{ scale:0.97 }}
                  transition={{ type:'spring', stiffness:400, damping:18 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem',
                    padding:'0.7rem 1.6rem', background:proj.color, color:'#0a0a0f',
                    border:'none', borderRadius:'9999px', fontFamily:'DM Sans',
                    fontWeight:700, fontSize:'0.85rem', cursor:'pointer',
                    letterSpacing:'0.04em' }}>
                  View Project →
                </motion.button>
                <motion.a href={proj.github} target="_blank" rel="noreferrer"
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
                  transition={{ type:'spring', stiffness:400, damping:18 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem',
                    padding:'0.7rem 1.6rem', border:`1px solid ${proj.color}44`,
                    color:proj.color, borderRadius:'9999px', fontFamily:'DM Sans',
                    fontSize:'0.85rem', textDecoration:'none', letterSpacing:'0.04em' }}>
                  GitHub ↗
                </motion.a>
              </div>

              {/* Tech pills */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem', marginTop:'1.5rem' }}>
                {proj.tech.slice(0,5).map(t => (
                  <span key={t} style={{ fontFamily:'DM Sans', fontSize:'0.7rem',
                    padding:'0.2rem 0.55rem', borderRadius:'9999px',
                    background:`${proj.color}14`, color:'#ffffff77',
                    border:`1px solid ${proj.color}30` }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Right-edge vertical line accent */}
            <div style={{ position:'absolute', right:0, top:'15%', bottom:'15%',
              width:1, background:`linear-gradient(to bottom, transparent, ${proj.color}44, transparent)`,
              zIndex:3 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EXPERIENCE PANEL ──────────────────────────────────────────────────────────
const EXP_ITEMS = [
  { date: '2024–Now', title: 'Mobile App Trainee', org: 'DEPI — Ministry of CIT', desc: 'Intensive Flutter & Dart training program, government initiative.', color: '#0ea5e9' },
  { date: 'Summer 2024', title: 'Mobile App Trainee', org: 'ITI — Information Technology Institute', desc: 'Flutter fundamentals, Dart, state management, and Clean Architecture.', color: '#a855f7' },
  { date: '2021–Now', title: 'Computer Engineering Student', org: 'Zagazig University', desc: 'B.Sc. in Computer & Systems Engineering. GPA focus on Embedded & Software.', color: '#10b981' },
];

export function ExperiencePanel({ panelRef }) {
  return (
    <div ref={panelRef} className="section-panel absolute inset-0 flex items-center px-10 md:px-20"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <div style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'oklch(68% 0.15 200)', marginBottom: '1rem' }}>05 / Journey</div>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 0.95, color: 'oklch(96% 0.005 264)', marginBottom: '2.5rem' }}>
          GROWING<br />EVERY DAY.
        </h2>
        <div style={{ position: 'relative' }}>
          {/* Vertical timeline line */}
          <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '1px', background: 'oklch(20% 0.02 264)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {EXP_ITEMS.map(({ date, title, org, desc, color }) => (
              <div key={title} style={{ display: 'flex', gap: '1.5rem', paddingLeft: '1rem', position: 'relative' }}>
                {/* Dot */}
                <div style={{ position: 'absolute', left: 0, top: '0.35rem', width: 15, height: 15, borderRadius: '50%', background: color, border: '3px solid oklch(10% 0.01 264)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: '0.1em', color, marginBottom: '0.3rem' }}>{date}</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.4rem', letterSpacing: '0.04em', color: 'oklch(94% 0.005 264)', lineHeight: 1.1 }}>{title}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color, marginTop: '0.2rem', marginBottom: '0.4rem' }}>{org}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '0.82rem', color: 'oklch(50% 0.02 264)', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CONTACT PANEL ─────────────────────────────────────────────────────────────
export function ContactPanel({ panelRef }) {
  return (
    <div ref={panelRef} className="section-panel absolute inset-0 flex items-center px-10 md:px-20"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      <div style={{ width: '100%', maxWidth: '820px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        {/* Left */}
        <div>
          <div style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'oklch(68% 0.15 200)', marginBottom: '1rem' }}>06 / Let's Talk</div>
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.95, color: 'oklch(96% 0.005 264)', marginBottom: '1.5rem' }}>
            LET'S<br />BUILD<br />TOGETHER.
          </h2>
          <p style={{ fontFamily: 'DM Sans', fontSize: '0.95rem', lineHeight: 1.75, color: 'oklch(50% 0.02 264)', marginBottom: '2rem' }}>
            Open to collaborations, freelance, and full-time. Got a project? Let's talk.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[['✉', 'amrabdelazeem117@gmail.com', 'mailto:amrabdelazeem117@gmail.com'], ['📱', '+20 112 115 3059', 'https://wa.me/201121153059']].map(([icon, text, href]) => (
              <a key={text} href={href} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'DM Sans', fontSize: '0.85rem', color: 'oklch(60% 0.02 264)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'oklch(68% 0.15 200)'}
                onMouseLeave={e => e.currentTarget.style.color = 'oklch(60% 0.02 264)'}>
                <span>{icon}</span>{text}
              </a>
            ))}
          </div>
        </div>
        {/* Right — Form */}
        <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[['Name', 'text', 'Your name'], ['Email', 'email', 'your@email.com']].map(([label, type, ph]) => (
            <div key={label}>
              <label style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(50% 0.02 264)', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
              <input type={type} placeholder={ph} style={{ width: '100%', background: 'oklch(13% 0.012 264)', border: '1px solid oklch(20% 0.02 264)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'oklch(90% 0.005 264)', fontFamily: 'DM Sans', fontSize: '0.9rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'oklch(68% 0.15 200)'}
                onBlur={e => e.target.style.borderColor = 'oklch(20% 0.02 264)'} />
            </div>
          ))}
          <div>
            <label style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'oklch(50% 0.02 264)', display: 'block', marginBottom: '0.35rem' }}>Message</label>
            <textarea rows={4} placeholder="Tell me about your project..." style={{ width: '100%', background: 'oklch(13% 0.012 264)', border: '1px solid oklch(20% 0.02 264)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'oklch(90% 0.005 264)', fontFamily: 'DM Sans', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
              onFocus={e => e.target.style.borderColor = 'oklch(68% 0.15 200)'}
              onBlur={e => e.target.style.borderColor = 'oklch(20% 0.02 264)'} />
          </div>
          <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{ padding: '0.9rem', background: 'oklch(68% 0.15 200)', color: 'oklch(10% 0.01 264)', border: 'none', borderRadius: '0.5rem', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.04em' }}>
            Send Message →
          </motion.button>
        </form>
      </div>
    </div>
  );
}
