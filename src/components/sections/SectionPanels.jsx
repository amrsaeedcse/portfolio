import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS_DATA } from '../../data/projects';
import { useHasAnimated, AnimatedText, AnimatedCounter, VARIANTS } from '../ui/AnimatedElements';

// ── Shared social link data ───────────────────────────────────────────────────
const SOCIAL_LINKS = [
  { label: 'GitHub',    abbr: 'GH', href: 'https://github.com/amrsaeedcse' },
  { label: 'LinkedIn',  abbr: 'LI', href: 'https://linkedin.com/in/amrsaeed-cse' },
  { label: 'WhatsApp',  abbr: 'WA', href: 'https://wa.me/201121153059' },
];

// ── HERO PANEL ────────────────────────────────────────────────────────────────
// VERCEL SKILL: rerender-memo — wrap with memo since panelRef and scrollToSection are stable
export const HeroPanel = memo(function HeroPanel({ panelRef, scrollToSection, isActive }) {
  const hasAnimated = useHasAnimated(isActive);
  return (
    <div ref={panelRef} className="section-panel hero-panel absolute inset-0 flex items-center px-6 md:px-20 pt-24 pb-8 md:pt-0 md:pb-0"
      style={{ opacity: 1, pointerEvents: 'auto' }}>
      <div className="hero-system-visual" aria-hidden="true">
        <div className="hero-orbit hero-orbit-a" />
        <div className="hero-orbit hero-orbit-b" />
        <div className="hero-core"><span>AMR</span><i /></div>
        <div className="hero-readout"><span>FIELD / 01</span><b>SOFTWARE × SYSTEMS</b></div>
        <div className="hero-axis hero-axis-x" /><div className="hero-axis hero-axis-y" />
      </div>
      <motion.div id="hero-content" className="w-full max-w-5xl mx-auto hero-glow"
        variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"}>
        {/* Giant name — heading carries its own weight, no eyebrow needed */}
        <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(4.5rem, 15vw, 11rem)', lineHeight: 0.9, letterSpacing: '0.02em', color: 'oklch(96% 0.005 264)', marginBottom: '0.5rem', textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
          <AnimatedText text="HI, I'M" style={{ display: 'block' }} />
          <AnimatedText text="AMR." style={{ color: 'oklch(68% 0.15 200)' }} />
        </h1>

        <motion.p variants={VARIANTS.fadeUp}
          style={{ fontFamily: 'DM Sans', fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: 'oklch(56% 0.025 264)', maxWidth: '42ch', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Flutter & Hardware Engineer. I bridge mobile software and embedded systems.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={VARIANTS.container}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <motion.button onClick={() => scrollToSection(3)}
            variants={VARIANTS.scaleUp} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2rem', borderRadius: '9999px', background: 'oklch(68% 0.15 200)', color: 'oklch(10% 0.01 264)', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.88rem', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>
            See My Work →
          </motion.button>
          <motion.a href="assets/Amr_Abdelazeem_Resume.pdf" download variants={VARIANTS.scaleUp} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 2rem', borderRadius: '9999px', border: '1px solid oklch(30% 0.02 264)', color: 'oklch(70% 0.01 264)', fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.88rem', textDecoration: 'none' }}>
            Resume ↓
          </motion.a>
        </motion.div>

        {/* Social links — DM Sans, not monospace costume */}
        <motion.div variants={VARIANTS.container}
          style={{ marginTop: '2.5rem', display: 'flex', gap: '1.5rem' }}>
          {SOCIAL_LINKS.map(({ label, abbr, href }) => (
            <motion.a key={abbr} href={href} target="_blank" rel="noreferrer"
              variants={VARIANTS.fadeUp}
              aria-label={label}
              whileHover={{ color: 'oklch(68% 0.15 200)' }}
              style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', color: 'oklch(35% 0.02 264)', textDecoration: 'none' }}>
              {abbr}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
});

// ── ABOUT PANEL ───────────────────────────────────────────────────────────────
export const AboutPanel = memo(function AboutPanel({ panelRef, isActive }) {
  const stats = [['3+', 'Years Coding', 3], ['10+', 'Projects', 10], ['2', 'Trainings', 2], ['1', 'University', 1]];
  const hasAnimated = useHasAnimated(isActive);
  return (
    <section ref={panelRef} aria-labelledby="about-heading"
      className="section-panel about-panel absolute inset-0 flex items-center px-6 md:px-20 pt-24 pb-8 md:pt-0 md:pb-0"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      {/* Photo column min-width prevents collapse; 1fr text column fills remaining space */}
      <motion.div variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"}
        className="w-full max-w-[900px] flex flex-col md:grid gap-6 md:gap-16 items-center"
        style={{ gridTemplateColumns: '280px 1fr' }}>

        {/* Photo — Y-axis card flip: premium reveal */}
        <motion.div variants={VARIANTS.photoFlip} id="about-photo" className="relative p-2 md:p-4 w-36 md:w-full mx-auto md:mx-0" style={{ perspective: '800px', transformStyle: 'preserve-3d' }}>
          {/* Viewfinder corner brackets */}
          {[0, 1, 2, 3].map((ci) => {
            const tops = [0, 0, 'auto', 'auto']; const lefts = [0, 'auto', 0, 'auto'];
            const rights = ['auto', 0, 'auto', 0]; const bottoms = ['auto', 'auto', 0, 0];
            const bTop = ci < 2 ? '2px solid #00FFD1' : 'none'; const bBot = ci >= 2 ? '2px solid #00FFD1' : 'none';
            const bLeft = ci % 2 === 0 ? '2px solid #00FFD1' : 'none'; const bRight = ci % 2 === 1 ? '2px solid #00FFD1' : 'none';
            return <div key={ci} style={{ position: 'absolute', top: tops[ci], left: lefts[ci], right: rights[ci], bottom: bottoms[ci], width: '20px', height: '20px', borderTop: bTop, borderBottom: bBot, borderLeft: bLeft, borderRight: bRight, zIndex: 2 }} className="md:w-[32px] md:h-[32px]" />;
          })}
          <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', aspectRatio: '4/5', border: '1px solid #00FFD122' }}>
            <img src="assets/about_me/WhatsApp Image 2025-08-06 at 19.10.21_4322cf4b.jpg"
              alt="Amr Abdelazeem" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, oklch(10% 0.01 264) 0%, transparent 55%)' }} />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div id="about-text-content" variants={VARIANTS.container}>
          <h2 id="about-heading" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(2.5rem, 8vw, 5rem)', lineHeight: 0.95, color: 'oklch(96% 0.005 264)', marginBottom: '1.5rem', textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
            <AnimatedText text="ENGINEER" style={{ display: 'block' }} />
            <AnimatedText text="AT HEART." />
          </h2>
          <motion.p variants={VARIANTS.fadeUp} style={{ fontFamily: 'DM Sans', fontSize: 'clamp(0.85rem, 2vw, 1rem)', lineHeight: 1.6, color: 'oklch(62% 0.025 264)', marginBottom: '2rem', maxWidth: '38ch' }}>
            Clean Architecture across mobile, backend, and embedded. I don't just code — I <em style={{ color: '#00FFD1', fontStyle: 'normal' }}>engineer solutions</em>.
          </motion.p>
          {/* Stats: staggered bounce-pop entrance */}
          <motion.div variants={VARIANTS.cardFlipContainer} className="grid grid-cols-1 min-[360px]:grid-cols-2" style={{ gap: '0.75rem', perspective: '600px' }}>
            {stats.map(([, label, numVal]) => (
              <motion.div variants={VARIANTS.statPop} key={label} style={{ padding: '0.75rem 1rem', border: '1px solid #00FFD133', borderRadius: '0.75rem', background: '#00FFD114' }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: '#00FFD1', lineHeight: 1 }}>
                  <AnimatedCounter targetValue={numVal} isActive={hasAnimated} />+
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.68rem', color: 'oklch(60% 0.02 264)', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{label}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={VARIANTS.fadeUp} className="about-spec-strip">
            <span>FIELD NOTE</span><strong>BUILDING BETWEEN WORLDS</strong><i />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
});

// ── SKILLS PANEL ──────────────────────────────────────────────────────────────
// Two semantic tones only: cyan (digital) and amber (hardware) — from brand palette
// domain: 'digital' = cyan, 'systems' = amber — used as non-colour secondary cue (WCAG 1.4.1)
const SKILL_GROUPS = [
  { cat: 'Mobile',   color: '#00FFD1',           domain: 'DIGITAL',  items: ['Flutter', 'Dart', 'Bloc/Cubit', 'Clean Arch', 'Firebase'] },
  { cat: 'Web',      color: '#00FFD1',           domain: 'DIGITAL',  items: ['React', 'JavaScript', 'Tailwind', 'REST APIs', 'Vite'] },
  { cat: 'Embedded', color: 'oklch(75% 0.18 60)', domain: 'SYSTEMS', items: ['C / C++', 'ESP32', 'Arduino', 'VHDL', 'Sensors'] },
  { cat: 'DevOps',   color: 'oklch(75% 0.18 60)', domain: 'SYSTEMS', items: ['Git & GitHub', 'Vercel', 'Postman', 'Figma', 'Linux'] },
];

export const SkillsPanel = memo(function SkillsPanel({ panelRef, isActive }) {
  const hasAnimated = useHasAnimated(isActive);
  return (
    <section ref={panelRef} aria-labelledby="skills-heading"
      className="section-panel skills-panel absolute inset-0 flex items-center px-6 md:px-20 pt-24 pb-8 md:pt-0 md:pb-0"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      <motion.div variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"} className="w-full max-w-[900px]">
        <h2 id="skills-heading"
          className="text-[clamp(2.5rem,12vw,5.5rem)] leading-[0.95] text-[oklch(96%_0.005_264)] mb-6 md:mb-10"
          style={{ fontFamily: "'Bebas Neue'", textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
          <AnimatedText text="FULL-STACK THINKING." />
        </h2>
        {/* cardFlipContainer staggers each card 0.12s apart — domino cascade */}
        <motion.div variants={VARIANTS.cardFlipContainer} className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', perspective: '900px', transformStyle: 'preserve-3d' }}>
          {SKILL_GROUPS.map(({ cat, color, domain, items }, idx) => {
            const headingId = `skill-cat-${cat.toLowerCase()}`;
            // Insert a structural separator between DIGITAL (0,1) and SYSTEMS (2,3) groups
            // The separator spans the full grid width to act as a visual section break
            const isFirstSystems = idx === 2;
            const isFirstDigital  = idx === 0;
            const separatorStyle  = { gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 0' };
            const lineStyle       = { flex: 1, height: '1px', background: 'oklch(22% 0.025 264)' };
            const labelStyle      = { fontFamily: 'DM Sans', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'oklch(38% 0.025 264)' };
            return (
              <React.Fragment key={cat}>
                {isFirstDigital && (
                  <motion.div variants={VARIANTS.fadeUp} style={separatorStyle}>
                    <div style={lineStyle} />
                    <span style={labelStyle}>Digital</span>
                    <div style={lineStyle} />
                  </motion.div>
                )}
                {isFirstSystems && (
                  <motion.div variants={VARIANTS.fadeUp} style={separatorStyle}>
                    <div style={lineStyle} />
                    <span style={labelStyle}>Systems</span>
                    <div style={lineStyle} />
                  </motion.div>
                )}
                <motion.div variants={VARIANTS.cardFlip}
                  role="group"
                  aria-labelledby={headingId}
                  className="skill-card p-3 md:p-6 rounded-xl md:rounded-2xl relative overflow-hidden"
                  style={{
                    border: `1px solid ${color}55`,
                    background: `${color}14`,
                    boxShadow: `0 0 24px ${color}18, inset 0 0 24px ${color}0a`,
                  }}>
                  {/* Colored glow left border */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: `linear-gradient(to bottom, ${color}, ${color}44)`, boxShadow: `2px 0 12px ${color}88` }} />
                  {/* Domain badge — non-colour secondary cue (WCAG 1.4.1) */}
                  <div style={{
                    position: 'absolute', top: '0.6rem', right: '0.6rem',
                    fontFamily: 'DM Sans', fontSize: '0.55rem', letterSpacing: '0.12em',
                    color: `${color}99`, border: `1px solid ${color}33`,
                    padding: '0.15rem 0.4rem', borderRadius: '9999px',
                  }}>{domain}</div>
                  {/* Category heading — pl-3/pl-4 gives deliberate breathing room from left border */}
                  <h3 id={headingId}
                    className="text-[1rem] md:text-[1.2rem] mb-2 md:mb-3 pl-3 md:pl-4 tracking-[0.08em]"
                    style={{ fontFamily: "'Bebas Neue'", color, fontWeight: 'normal' }}>{cat}</h3>
                  {/* Pills — fluid font floor prevents sub-11px rendering at narrow widths */}
                  {/* Pills: clipPath wipe-in from left — sequential typewriter reveal */}
                  <motion.div variants={VARIANTS.fastContainer} className="flex flex-wrap gap-1.5 pl-3 md:pl-4">
                    {items.map((item) => (
                      <motion.span variants={VARIANTS.pillWipe} key={item}
                        style={{
                          fontFamily: 'DM Sans',
                          fontSize: 'clamp(0.68rem, 1.8vw, 0.75rem)',
                          color: 'oklch(88% 0.005 264)',
                          background: `${color}18`,
                          border: `1px solid ${color}44`,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          lineHeight: 1.4,
                          display: 'inline-block',
                        }}>
                        {item}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              </React.Fragment>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
});

// ── PROJECTS PANEL — Full-screen horizontal carousel ─────────────────────────
// GSAP controls #project-track xPercent (0 / -25 / -50 / -75) per carousel stop

export const ProjectsPanel = memo(function ProjectsPanel({ panelRef, onProjectClick, isActive }) {
  const hasAnimated = useHasAnimated(isActive);
  const [hovered, setHovered] = useState(null);

  return (
    <div ref={panelRef} className="section-panel absolute inset-0 backdrop-blur-md md:backdrop-blur-none bg-[#0a0a0f]/40 md:bg-transparent"
      style={{ opacity: 0, pointerEvents: 'none', overflow: 'hidden' }}>

      <motion.div variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"} style={{ width: '100%', height: '100%' }}>
      {/* Section label — top-left, always visible in Projects */}
      <motion.div className="project-label" variants={VARIANTS.fadeUp} style={{
        position: 'absolute', top: '5rem', left: '8vw', zIndex: 4,
        fontFamily: 'DM Sans', fontSize: '0.7rem', letterSpacing: '0.3em',
        textTransform: 'uppercase', color: '#00FFD1', filter: 'none', backdropFilter: 'none', transform: 'translateZ(0)'
      }}>Featured Work</motion.div>

      {/* Progress indicator — which card of 4 */}
      <motion.div variants={VARIANTS.fadeUp} style={{
        position: 'absolute', bottom: '2.5rem', left: '8vw', zIndex: 4,
        display: 'flex', gap: '0.5rem', alignItems: 'center'
      }}>
        {[0, 1, 2, 3, 4].map((_, i) => (
          <div key={i} className={`proj-dot-${i}`}
            style={{
              width: i === 0 ? 28 : 8, height: 2, borderRadius: 999,
              background: i === 0 ? '#00FFD1' : '#ffffff22', transition: 'all 0.35s ease'
            }} />
        ))}
      </motion.div>

      {/* The 400vw horizontal track — GSAP targets this element */}
      <div id="project-track"
        style={{ display: 'flex', width: '500%', height: '100%', willChange: 'transform' }}>

        {PROJECTS_DATA.slice(0, 4).map((proj, idx) => (
          /* Each card = exactly 20% of 500% track = 100vw */
          <div key={proj.id} style={{
            flex: '0 0 20%', position: 'relative',
            display: 'flex', alignItems: 'center', overflow: 'hidden'
          }}>

            {/* Full-bleed background image — right 55% */}
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '58%', overflow: 'hidden' }}>
              <motion.img src={proj.img} alt={proj.title}
                animate={{ scale: hovered === idx ? 1.06 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  display: 'block', filter: 'brightness(0.55)'
                }} />
              {/* Left-to-right gradient masks image edge */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to right, #0a0a0f 0%, ${proj.color}18 50%, transparent 100%)`
              }} />
            </div>

            {/* Left content panel */}
            <motion.div variants={VARIANTS.container} style={{
              position: 'relative', zIndex: 2, padding: '0 8vw',
              maxWidth: '55%', width: '100%'
            }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}>

              {/* Giant index number */}
              <motion.div variants={VARIANTS.fadeUp} style={{
                fontFamily: "'Bebas Neue'", fontSize: 'clamp(7rem,16vw,13rem)',
                lineHeight: 0.85, color: '#ffffff04', marginBottom: '-1rem',
                userSelect: 'none'
              }}>0{idx + 1}</motion.div>

              {/* Tech tag */}
              <motion.div variants={VARIANTS.fadeUp} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.3rem 0.8rem', background: `${proj.color}22`,
                border: `1px solid ${proj.color}55`, borderRadius: '9999px',
                fontFamily: 'DM Sans', fontSize: '0.7rem', color: proj.color,
                letterSpacing: '0.1em', marginBottom: '1rem'
              }}>
                {proj.tag}
              </motion.div>

              {/* Title */}
              <h2 style={{
                fontFamily: "'Bebas Neue'", fontSize: 'clamp(3.5rem,8vw,6.5rem)',
                lineHeight: 0.9, color: '#f4f4f5', marginBottom: '1.2rem',
                letterSpacing: '0.02em'
              }}>{proj.title}</h2>

              {/* Description */}
              <p style={{
                fontFamily: 'DM Sans', fontSize: 'clamp(0.88rem,1.4vw,1rem)',
                color: '#ffffff66', lineHeight: 1.75, maxWidth: '36ch',
                marginBottom: '2rem'
              }}>
                {proj.description.slice(0, 130)}...
              </p>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => onProjectClick(proj)}
                  style={{
                    fontFamily: 'DM Sans', fontSize: '0.75rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '0.7rem 1.5rem', background: proj.color,
                    color: '#0a0a0f', border: 'none', borderRadius: '9999px', cursor: 'pointer',
                    fontWeight: 600
                  }}>
                  View Details
                </motion.button>
              </div>
            </motion.div>

            {/* Right-edge vertical line accent */}
            <div style={{
              position: 'absolute', right: 0, top: '15%', bottom: '15%',
              width: 1, background: `linear-gradient(to bottom, transparent, ${proj.color}44, transparent)`,
              zIndex: 3
            }} />
          </div>
        ))}

        {/* 5th Card: View All Projects CTA — no emoji decoration */}
        <div style={{ flex: '0 0 20%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#050508' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #00FFD111 0%, transparent 70%)' }} />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onProjectClick('ARCHIVE')}
            style={{ textAlign: 'center', cursor: 'pointer', zIndex: 10, padding: '3rem', border: '1px solid #ffffff11', borderRadius: '2rem' }}
          >
            <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem,6vw,5rem)', lineHeight: 0.9, color: '#f4f4f5', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
              VIEW ALL <span style={{ color: '#00FFD1' }}>PROJECTS</span>
            </h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: '0.9rem', color: '#ffffff66', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Complete archive →
            </p>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </div>
  );
});

// ── EXPERIENCE PANEL ──────────────────────────────────────────────────────────
// Two accent tones: cyan (training) and amber (education) — matches skills palette
const EXP_ITEMS = [
  { date: '2024–Now',    title: 'Mobile App Trainee',          org: 'DEPI — Ministry of CIT',           desc: 'Intensive Flutter & Dart, government initiative.', color: '#00FFD1' },
  { date: 'Summer 2024', title: 'Mobile App Trainee',          org: 'ITI — Information Technology Inst.', desc: 'Flutter, Dart, state management, Clean Architecture.', color: '#00FFD1' },
  { date: '2021–Now',    title: 'Computer Engineering Student', org: 'Zagazig University',                desc: 'B.Sc. in Computer & Systems Engineering — Embedded & Software focus.', color: 'oklch(75% 0.18 60)' },
];

export const ExperiencePanel = memo(function ExperiencePanel({ panelRef, isActive }) {
  const hasAnimated = useHasAnimated(isActive);
  return (
    <section ref={panelRef} aria-labelledby="experience-heading"
      className="section-panel experience-panel absolute inset-0 flex items-center px-10 md:px-20"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      <div className="experience-orbit" aria-hidden="true"><span>03</span></div>
      <motion.div variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"} style={{ width: '100%', maxWidth: '720px' }}>
        <h2 id="experience-heading" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 0.95, color: 'oklch(96% 0.005 264)', marginBottom: '2.5rem' }}>
          <AnimatedText text="GROWING" style={{ display: 'block' }} />
          <AnimatedText text="EVERY DAY." />
        </h2>
        {/* Timeline — line at left:8px; dot centred on line via left:-8px + marginLeft:8px on content */}
        <motion.div variants={VARIANTS.container} style={{ position: 'relative', paddingLeft: '2rem' }}>
          <motion.div variants={VARIANTS.fadeUp} style={{ position: 'absolute', left: '8px', top: '6px', bottom: 0, width: '1px', background: 'oklch(30% 0.025 264)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {EXP_ITEMS.map(({ date, title, org, desc, color }, i) => (
              <motion.div variants={VARIANTS.timelineItem} key={i} className="exp-item" style={{ position: 'relative', transformOrigin: 'left center' }}>
                {/* Dot centred on the line: centre at 8px from container left */}
                <div style={{
                  position: 'absolute', left: '-1.5rem', top: '0.3rem',
                  width: 16, height: 16, borderRadius: '50%',
                  background: color, border: '3px solid oklch(10% 0.01 264)',
                  transform: 'translateX(50%)',
                }} />
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.68rem', letterSpacing: '0.1em', color, marginBottom: '0.25rem' }}>{date}</div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.5rem', letterSpacing: '0.04em', color: 'oklch(94% 0.005 264)', lineHeight: 1.05, marginBottom: '0.25rem' }}>{title}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.82rem', color, marginBottom: '0.5rem' }}>{org}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.88rem', color: 'oklch(55% 0.02 264)', lineHeight: 1.65 }}>{desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
});

// ── EXPERIENCE MOBILE PANEL — shared parameterized component ─────────────────
function ExpMobilePanel({ panelRef, items, showHeading, isActive }) {
  const hasAnimated = useHasAnimated(isActive);
  return (
    <div ref={panelRef} className="section-panel experience-panel experience-panel-mobile absolute inset-0 flex items-center px-6 pt-24 pb-8"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      <motion.div variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"} className="w-full">
        {showHeading && (
          <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem, 12vw, 5.5rem)', lineHeight: 0.95, color: 'oklch(96% 0.005 264)', marginBottom: '2.5rem', textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
            <AnimatedText text="GROWING" style={{ display: 'block' }} />
            <AnimatedText text="EVERY DAY." />
          </h2>
        )}
        <motion.div variants={VARIANTS.container} style={{ position: 'relative' }}>
          <motion.div variants={VARIANTS.fadeUp} style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '1px', background: 'oklch(20% 0.02 264)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {items.map(({ date, title, org, desc, color }, i) => (
              <motion.div variants={VARIANTS.fadeUp} key={i} style={{ display: 'flex', gap: '1.5rem', paddingLeft: '1rem', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: '0.35rem', width: 15, height: 15, borderRadius: '50%', background: color, border: '3px solid oklch(10% 0.01 264)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '0.68rem', letterSpacing: '0.05em', color, marginBottom: '0.3rem' }}>{date}</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.3rem', letterSpacing: '0.04em', color: 'oklch(94% 0.005 264)', lineHeight: 1.1 }}>{title}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color, marginTop: '0.2rem', marginBottom: '0.4rem' }}>{org}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)', color: 'oklch(65% 0.02 264)', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export const ExperiencePanelMobile1 = memo(function ExperiencePanelMobile1({ panelRef, isActive }) {
  return <ExpMobilePanel panelRef={panelRef} items={EXP_ITEMS.slice(0, 2)} showHeading isActive={isActive} />;
});

export const ExperiencePanelMobile2 = memo(function ExperiencePanelMobile2({ panelRef, isActive }) {
  return <ExpMobilePanel panelRef={panelRef} items={EXP_ITEMS.slice(2)} showHeading={false} isActive={isActive} />;
});

// ── CONTACT PANEL ─────────────────────────────────────────────────────────────
const CONTACT_LINKS = [
  { label: 'Email',    text: 'amrabdelazeem117@gmail.com', href: 'mailto:amrabdelazeem117@gmail.com' },
  { label: 'WhatsApp', text: '+20 112 115 3059',            href: 'https://wa.me/201121153059' },
];

// ContactPanel has its own state — cannot be a pure memo anymore.
// formState: 'idle' | 'sending' | 'success' | 'error'
export function ContactPanel({ panelRef, isActive }) {
  const hasAnimated = useHasAnimated(isActive);
  const [formState, setFormState] = React.useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState === 'sending') return;
    setFormState('sending');
    const form = e.target;
    const data = new FormData(form);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        setFormState('success');
        form.reset();
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  const inputStyle = {
    width: '100%', background: 'oklch(14% 0.014 264)',
    border: '1px solid oklch(25% 0.025 264)', borderRadius: '0.5rem',
    padding: '0.75rem 1rem', color: 'oklch(90% 0.005 264)',
    fontFamily: 'DM Sans', fontSize: '0.9rem', outline: 'none',
  };
  const labelStyle = {
    fontFamily: 'DM Sans', fontSize: '0.72rem', letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'oklch(50% 0.02 264)',
    display: 'block', marginBottom: '0.35rem',
  };

  return (
    <section ref={panelRef} aria-labelledby="contact-heading"
      className="section-panel contact-panel absolute inset-0 flex items-center px-6 md:px-20 pt-24 pb-8 md:pt-0 md:pb-0"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      <div className="contact-orbit" aria-hidden="true"><span>OPEN</span></div>
      <motion.div variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"} className="w-full max-w-[820px] flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left */}
        <motion.div variants={VARIANTS.container}>
          <h2 id="contact-heading" style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.95, color: 'oklch(96% 0.005 264)', marginBottom: '1.5rem' }}>
            <AnimatedText text="LET'S" style={{ display: 'block' }} />
            <AnimatedText text="BUILD" style={{ display: 'block' }} />
            <AnimatedText text="TOGETHER." />
          </h2>
          <motion.p variants={VARIANTS.fadeUp} style={{ fontFamily: 'DM Sans', fontSize: '0.95rem', lineHeight: 1.75, color: 'oklch(50% 0.02 264)', marginBottom: '2rem' }}>
            Open to freelance and collaboration. Got a project?
          </motion.p>
          <motion.div variants={VARIANTS.container} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CONTACT_LINKS.map(({ label, text, href }) => (
              <motion.a variants={VARIANTS.fadeUp} key={label} href={href}
                aria-label={label}
                style={{ fontFamily: 'DM Sans', fontSize: '0.85rem', color: 'oklch(60% 0.02 264)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'oklch(68% 0.15 200)'}
                onMouseLeave={e => e.currentTarget.style.color = 'oklch(60% 0.02 264)'}>
                {text}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right — Form */}
        <AnimatePresence mode="wait">
          {formState === 'success' ? (
            <motion.div key="success" className="contact-success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem',
                padding: '2rem', border: '1px solid #00FFD133', borderRadius: '0.75rem', background: '#00FFD108' }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: '2rem', color: '#00FFD1', lineHeight: 1 }}>Message Sent.</div>
              <p style={{ fontFamily: 'DM Sans', fontSize: '0.9rem', color: 'oklch(65% 0.02 264)', lineHeight: 1.6 }}>
                Got it — I'll get back to you soon.
              </p>
              <button onClick={() => setFormState('idle')}
                style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: 'oklch(68% 0.15 200)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.08em' }}>
                Send another →
              </button>
            </motion.div>
          ) : (
          <motion.form variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Web3Forms access key — public key, safe to commit */}
            <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />
            <input type="hidden" name="subject" value="Portfolio contact form submission" />
            <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

            {[['Name', 'name', 'text', 'Your name', true], ['Email', 'email', 'email', 'your@email.com', true]].map(([label, name, type, ph, req]) => (
              <div key={label}>
                <label style={labelStyle} htmlFor={`field-${name}`}>{label}</label>
                <input id={`field-${name}`} type={type} name={name} placeholder={ph}
                  required={req} autoComplete={name}
                  style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle} htmlFor="field-message">Message</label>
              <textarea id="field-message" name="message" rows={4}
                placeholder="Tell me about your project..."
                required
                style={{ ...inputStyle, resize: 'none' }} />
            </div>

            {formState === 'error' && (
              <p role="alert" style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: 'oklch(62% 0.2 25)', margin: 0 }}>
                Something went wrong — try emailing me directly.
              </p>
            )}

              <motion.button type="submit"
                variants={VARIANTS.fadeUp}
                disabled={formState === 'sending'}
                whileHover={formState !== 'sending' ? { scale: 1.03 } : {}}
                whileTap={formState !== 'sending' ? { scale: 0.97 } : {}}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                style={{
                  padding: '0.9rem', background: 'oklch(68% 0.15 200)',
                  color: 'oklch(10% 0.01 264)', border: 'none', borderRadius: '0.5rem',
                  fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.9rem',
                  cursor: formState === 'sending' ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.04em', opacity: formState === 'sending' ? 0.7 : 1,
                }}>
                {formState === 'sending' ? 'Sending…' : 'Send Message'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Merged into Contact Panel */}
      <footer className="hidden md:flex absolute bottom-0 left-0 right-0 z-10 border-t border-[#ffffff0d] py-8 px-16 justify-between items-center bg-[#0a0a0f]">
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', color: 'oklch(28% 0.02 264)' }}>
          © 2026 Amr Abdelazeem — Built with React &amp; Three.js
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[['LinkedIn', 'https://www.linkedin.com/in/amr-saeed-0bb957373/', '#0ea5e9'], ['GitHub', 'https://github.com/amrsaeedcse', '#a855f7'], ['WhatsApp', 'https://wa.me/201121153059', '#10b981']].map(([l, h, c]) => (
            <a key={l} href={h} target="_blank" rel="noreferrer"
              style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', fontWeight: 600, color: '#f4f4f5', textDecoration: 'none', border: `1px solid ${c}66`, padding: '0.4rem 1.2rem', borderRadius: '9999px', transition: 'all 0.2s', background: `${c}11` }}
              onMouseEnter={e => { e.currentTarget.style.background = c; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = c; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${c}11`; e.currentTarget.style.color = '#f4f4f5'; e.currentTarget.style.borderColor = `${c}66`; }}>{l}</a>
          ))}
        </div>
      </footer>
    </section>
  );
}


// ── CONTACT MOBILE PANEL — shared parameterized component ────────────────────
const FOOTER_LINKS = [
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/amr-saeed-0bb957373/' },
  { label: 'GitHub',   href: 'https://github.com/amrsaeedcse' },
  { label: 'WhatsApp', href: 'https://wa.me/201121153059' },
];

export const ContactPanelMobile1 = memo(function ContactPanelMobile1({ panelRef, isActive }) {
  const hasAnimated = useHasAnimated(isActive);
  return (
    <div ref={panelRef} className="section-panel contact-panel contact-panel-mobile absolute inset-0 flex items-center px-6 pt-24 pb-8"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>
      <motion.div variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"} className="w-full">
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem, 12vw, 5.5rem)', lineHeight: 0.95, color: 'oklch(96% 0.005 264)', marginBottom: '1.5rem', textShadow: '0 4px 24px rgba(0,0,0,0.8)' }}>
          <AnimatedText text="LET'S" style={{ display: 'block' }} />
          <AnimatedText text="BUILD" style={{ display: 'block' }} />
          <AnimatedText text="TOGETHER." />
        </h2>
        <motion.p variants={VARIANTS.fadeUp} style={{ fontFamily: 'DM Sans', fontSize: 'clamp(0.9rem, 2.5vw, 1rem)', lineHeight: 1.6, color: 'oklch(62% 0.025 264)', marginBottom: '2rem' }}>
          Open to freelance and collaboration.
        </motion.p>
        <motion.div variants={VARIANTS.container} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {CONTACT_LINKS.map(({ label, text, href }) => (
            <motion.a variants={VARIANTS.fadeUp} key={label} href={href} aria-label={label}
              style={{ fontFamily: 'DM Sans', fontSize: '0.9rem', color: '#00FFD1', textDecoration: 'none' }}>
              {text}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
});

// Mobile form — fully wired to Web3Forms, same 4-state machine as desktop
export function ContactPanelMobile2({ panelRef, isActive }) {
  const hasAnimated = useHasAnimated(isActive);
  const [formState, setFormState] = React.useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState === 'sending') return;
    setFormState('sending');
    const form = e.target;
    const data = new FormData(form);
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      if (res.ok) { setFormState('success'); form.reset(); }
      else setFormState('error');
    } catch { setFormState('error'); }
  };

  const mobileInputStyle = {
    width: '100%', background: 'oklch(14% 0.014 264)',
    border: '1px solid oklch(25% 0.025 264)', borderRadius: '0.5rem',
    padding: '0.6rem 0.8rem', color: 'oklch(90% 0.005 264)',
    fontFamily: 'DM Sans', fontSize: '0.85rem', outline: 'none',
  };
  const mobileLabelStyle = {
    fontFamily: 'DM Sans', fontSize: '0.65rem', letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'oklch(56% 0.025 264)',
    display: 'block', marginBottom: '0.25rem',
  };

  return (
    <div ref={panelRef} className="section-panel contact-panel contact-panel-mobile absolute inset-0 flex flex-col justify-center px-6 pt-24 pb-4"
      style={{ opacity: 0, transform: 'translateY(40px)', pointerEvents: 'none' }}>

      <AnimatePresence mode="wait">
        {formState === 'success' ? (
          <motion.div key="success" className="contact-success"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ padding: '1.5rem', border: '1px solid #00FFD133', borderRadius: '0.75rem', background: '#00FFD114', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '1.8rem', color: '#00FFD1', lineHeight: 1, marginBottom: '0.5rem' }}>Message Sent.</div>
            <p style={{ fontFamily: 'DM Sans', fontSize: '0.85rem', color: 'oklch(62% 0.025 264)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Got it — I'll get back to you soon.
            </p>
            <button onClick={() => setFormState('idle')}
              style={{ fontFamily: 'DM Sans', fontSize: '0.78rem', color: '#00FFD1', background: 'none', border: 'none', cursor: 'pointer', padding: 0, letterSpacing: '0.08em' }}>
              Send another →
            </button>
          </motion.div>
        ) : (
          <motion.form variants={VARIANTS.container} initial="hidden" animate={hasAnimated ? "visible" : "hidden"} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_KEY" />
            <input type="hidden" name="subject" value="Portfolio contact (mobile)" />
            <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
            {[['Name', 'name', 'text', 'Your name'], ['Email', 'email', 'email', 'your@email.com']].map(([lbl, name, type, ph]) => (
              <div key={lbl}>
                <label style={mobileLabelStyle} htmlFor={`m-${name}`}>{lbl}</label>
                <input id={`m-${name}`} type={type} name={name} placeholder={ph}
                  required autoComplete={name} style={mobileInputStyle} />
              </div>
            ))}
            <div>
              <label style={mobileLabelStyle} htmlFor="m-message">Message</label>
              <textarea id="m-message" name="message" rows={3}
                placeholder="Tell me about your project..."
                required style={{ ...mobileInputStyle, resize: 'none' }} />
            </div>
            {formState === 'error' && (
              <p role="alert" style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: 'oklch(62% 0.2 25)', margin: 0 }}>
                Something went wrong — try again.
              </p>
            )}
            <motion.button type="submit" disabled={formState === 'sending'} variants={VARIANTS.fadeUp}
              style={{ padding: '0.8rem', background: 'oklch(68% 0.15 200)', color: 'oklch(10% 0.01 264)', border: 'none', borderRadius: '0.5rem', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '0.85rem', cursor: formState === 'sending' ? 'not-allowed' : 'pointer', letterSpacing: '0.04em', opacity: formState === 'sending' ? 0.7 : 1 }}>
              {formState === 'sending' ? 'Sending…' : 'Send Message'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <footer style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        {FOOTER_LINKS.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer"
            style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', fontWeight: 600, color: 'oklch(56% 0.025 264)', textDecoration: 'none' }}>
            {label}
          </a>
        ))}
      </footer>
      <p style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', color: 'oklch(30% 0.02 264)', textAlign: 'center', marginTop: '0.5rem' }}>
        © 2026 Amr Abdelazeem
      </p>
    </div>
  );
}
