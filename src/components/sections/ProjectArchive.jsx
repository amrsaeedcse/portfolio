import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS_DATA } from './ProjectDetail';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

export default function ProjectArchive({ onClose, onOpenProject }) {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto"
      style={{ background: '#0a0a0ff0' }}
    >
      {/* ── HEADER ── */}
      <div className="w-full max-w-7xl flex justify-between items-center p-8 mt-4 md:mt-12 mb-8">
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.9, color: '#f4f4f5' }}>
            PROJECT <span style={{ color: '#00FFD1' }}>ARCHIVE</span>
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '0.9rem', color: '#ffffff88', letterSpacing: '0.1em', marginTop: '0.5rem' }}>
            A COMPLETE LIST OF MY CRAFTED EXPERIENCES
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            fontFamily: 'DM Sans', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #ffffff33',
            background: 'transparent', color: '#f4f4f5', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onMouseEnter={(e) => { e.target.style.background = '#ffffff11'; }}
          onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
        >
          ✕
        </button>
      </div>

      {/* ── BENTO GRID ── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-7xl px-8 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {PROJECTS_DATA.map((proj, idx) => (
          <motion.div
            key={proj.id}
            variants={itemVariants}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onOpenProject(proj)}
            style={{
              position: 'relative',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              cursor: 'pointer',
              background: '#ffffff05',
              border: `1px solid ${hovered === idx ? proj.color + 'aa' : '#ffffff15'}`,
              boxShadow: hovered === idx ? `0 0 24px ${proj.color}22` : 'none',
              transition: 'all 0.3s ease'
            }}
            className="flex flex-col group"
          >
            {/* Image Thumbnail */}
            <div style={{ height: '220px', width: '100%', overflow: 'hidden', position: 'relative' }}>
              <motion.img 
                src={proj.img} 
                alt={proj.title}
                animate={{ scale: hovered === idx ? 1.05 : 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, #0a0a0f, transparent)` }} />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow relative z-10 -mt-12">
              <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: `${proj.color}22`, border: `1px solid ${proj.color}55`, borderRadius: '999px', fontSize: '0.65rem', color: proj.color, fontFamily: 'DM Sans', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', alignSelf: 'flex-start' }}>
                {proj.tag}
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: '2.5rem', color: '#f4f4f5', lineHeight: 1, marginBottom: '0.5rem' }}>
                {proj.title}
              </h2>
              <p style={{ fontFamily: 'DM Sans', fontSize: '0.85rem', color: '#ffffff88', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
                {proj.description.slice(0, 110)}...
              </p>
              <div className="flex items-center gap-2 mt-auto" style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: proj.color, letterSpacing: '0.05em' }}>
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">READ CASE STUDY →</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
