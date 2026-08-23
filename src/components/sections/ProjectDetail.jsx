import React from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../../lib/motionPresets';

/* Some project accents are tuned for dark UIs — remap pure white to ink on paper */
const accentOf = (c) => (c && c.toLowerCase() !== '#ffffff' ? c : '#1A1D23');

const overlayVariants = {
  hidden:  { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { y: '100%', opacity: 0, transition: { type: 'tween', duration: 0.2 } },
};

const ProjectDetail = React.memo(function ProjectDetail({ project, onClose }) {
  const { title, subtitle, tag, color, img, year, status, description, tech, features, github, screenshots, demos = [] } = project;
  const accent = accentOf(color);

  return (
    <motion.div
      key="detail"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'var(--color-paper)',
        overflowY: 'auto',
      }}
    >
      {/* Hero figure banner */}
      <div className="relative" style={{ height: '45vh', overflow: 'hidden', borderBottom: '1px solid var(--color-line-strong)' }}>
        <img src={img} alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(18%) contrast(1.04) brightness(0.92)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--color-paper) 2%, rgba(242,239,231,0.35) 45%, transparent 100%)' }} />

        {/* Back button */}
        <motion.button
          onClick={onClose}
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="bp-btn"
          style={{ position: 'absolute', top: '1.4rem', left: '1.6rem', zIndex: 50, background: 'var(--color-paper)' }}
        >
          ← Back
        </motion.button>

        {/* Status stamp */}
        <span className="stamp" style={{ position: 'absolute', top: '1.6rem', right: '2rem', color: accent }}>
          {status}
        </span>

        {/* Title overlay */}
        <div style={{ position: 'absolute', bottom: '1.6rem', left: '1.6rem', right: '1.6rem' }}>
          <div className="mono-label" style={{ color: accent, marginBottom: '0.5rem' }}>
            DWG // {tag} · {year}
          </div>
          <h1 className="h-display" style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)', color: 'var(--color-ink)' }}>
            {title}
          </h1>
          <p className="mono-label" style={{ color: 'var(--color-ink-2)', marginTop: '0.6rem' }}>{subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: '3rem', alignItems: 'start' }}
          className="md:[grid-template-columns:1fr_1fr]">

          {/* Left — description + figures */}
          <div>
            <div className="mono-label flex items-center gap-3 mb-4">
              <span style={{ color: accent }}>01</span>
              <span className="text-ink-3">SPECIFICATION</span>
              <span className="flex-1 h-px bg-line-strong" />
            </div>
            <p className="text-[0.98rem]" style={{ lineHeight: 1.85, color: 'var(--color-ink-2)', marginBottom: '2.5rem' }}>
              {description}
            </p>

            {screenshots.map((src, i) => (
              <div key={i} className="sheet-frame sheet-frame--plain relative"
                style={{ marginBottom: '1rem' }}>
                <img src={src} alt={`${title} screenshot ${i + 1}`} loading="lazy"
                  style={{ width: '100%', height: '230px', objectFit: 'cover', display: 'block' }} />
                <span className="mono-tiny absolute bottom-2 right-3 z-10 px-1.5 py-0.5"
                  style={{ background: 'var(--color-paper)', color: 'var(--color-ink-3)' }}>
                  FIG. {i + 1}
                </span>
              </div>
            ))}

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1.6rem' }}>
              <a href={github} target="_blank" rel="noreferrer" className="bp-btn bp-btn-primary">
                View on GitHub ↗
              </a>
              {demos.map((d, i) => (
                <a key={i} href={d.url} target="_blank" rel="noreferrer" className="bp-btn">
                  {d.label.replace(/[💼🚀]/gu, '').trim()} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Right — parts & features */}
          <div>
            <div className="mono-label flex items-center gap-3 mb-4">
              <span style={{ color: accent }}>02</span>
              <span className="text-ink-3">PARTS USED</span>
              <span className="flex-1 h-px bg-line-strong" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '2.4rem' }}>
              {tech.map(t => (
                <span key={t} className="bp-chip">{t}</span>
              ))}
            </div>

            <div className="mono-label flex items-center gap-3 mb-4">
              <span style={{ color: accent }}>03</span>
              <span className="text-ink-3">KEY FEATURES</span>
              <span className="flex-1 h-px bg-line-strong" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {features.map((f, i) => {
                const clean = f.replace(/^[^\w"(]*\s*(?=[A-Z"(])/, '');
                return (
                  <motion.div key={f}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.45, ease: EASE }}
                    style={{
                      display: 'flex', gap: '0.9rem', alignItems: 'baseline',
                      padding: '0.8rem 0.2rem',
                      borderBottom: '1px solid var(--color-line)',
                    }}
                  >
                    <span className="mono-tiny tabular-nums flex-none" style={{ color: accent }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[0.88rem]" style={{ color: 'var(--color-ink-2)', lineHeight: 1.65 }}>{clean}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Year plate */}
            <div className="sheet-frame mt-8 px-6 py-5 flex items-end justify-between bg-paper-2">
              <div>
                <div className="font-display font-black leading-none" style={{ fontSize: '2.6rem', color: accent }}>{year}</div>
                <div className="mono-tiny mt-1.5" style={{ color: 'var(--color-ink-3)' }}>YEAR BUILT</div>
              </div>
              <span className="mono-tiny" style={{ color: 'var(--color-ink-3)' }}>REV ✓ APPROVED</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default ProjectDetail;
