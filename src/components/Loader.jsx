import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

// GSAP SKILL: timeline with stagger for sequenced boot lines
const BOOT_LINES = [
  'FLUTTER SDK ............ OK',
  'IoT SYSTEMS ........... OK',
  'WebGL ENGINE .......... OK',
  'REACT CORE ............ OK',
  'ALL SYSTEMS NOMINAL',
];

export default function Loader({ onComplete }) {
  const [phase, setPhase]     = useState('boot');  // boot → name → done
  const [done, setDone]       = useState(false);
  const linesRef              = useRef(null);
  const progressRef           = useRef(null);
  const progressBarRef        = useRef(null);
  const nameRef               = useRef(null);
  const lineWipeRef           = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Phase 1 — animate boot lines with stagger
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onComplete: () => {
          // Phase 2 — reveal giant name
          setPhase('name');
        },
      });

      // Each line fades in staggered
      tl.from('.boot-line', {
        autoAlpha: 0,
        x: -12,
        stagger: { each: 0.15, from: 'start' },
        duration: 0.2,
      });

      // Progress bar sweeps to 100% while lines appear
      tl.fromTo(progressBarRef.current,
        { width: '0%' },
        { width: '100%', duration: tl.duration() - 0.2, ease: 'power1.inOut' },
        0.1);

      // Progress counter
      const obj = { val: 0 };
      tl.to(obj, {
        val: 100,
        duration: tl.duration() - 0.2,
        ease: 'power1.inOut',
        onUpdate() {
          if (progressRef.current)
            progressRef.current.textContent = `${Math.round(obj.val)}%`;
        },
      }, 0.1);
    });

    return () => ctx.revert();
  }, []);

  // Phase 2 — name reveal + line wipe, then fade out entire loader
  useEffect(() => {
    if (phase !== 'name') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Trigger fade-out
          setTimeout(() => setDone(true), 100);
          setTimeout(() => onComplete(), 800);
        },
      });

      // Line wipe reveal on name
      tl.fromTo(lineWipeRef.current,
        { scaleX: 1, transformOrigin: 'left center' },
        { scaleX: 0, duration: 0.7, ease: 'power3.inOut' });
      // Name fades up behind the wipe
      tl.fromTo(nameRef.current,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.2)' },
        0.1);
      // Brief pause at full name
      tl.to({}, { duration: 0.3 });
    });

    return () => ctx.revert();
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            pointerEvents: 'none'
          }}
        >
          {/* TOP SHUTTER */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1], delay: 0.2 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '50vh', background: '#05050a', pointerEvents: 'auto' }}
          />

          {/* BOTTOM SHUTTER */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1], delay: 0.2 }}
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100vw', height: '50vh', background: '#05050a', pointerEvents: 'auto' }}
          />

          {/* CONTENT WRAPPER */}
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center', alignItems: 'flex-start',
              padding: '0 8vw', overflow: 'hidden',
              pointerEvents: 'none'
            }}
          >
            {/* Ambient grid lines in background */}
            <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', opacity:0.04 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ position:'absolute', top:0, bottom:0, left:`${i * 8.5}%`, width:'1px', background:'#00FFD1' }} />
              ))}
            </div>

            {/* Top-left badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{ position:'absolute', top:'2.5rem', left:'8vw',
                fontFamily:'monospace', fontSize:'0.65rem', letterSpacing:'0.3em',
                color:'#00FFD166', textTransform:'uppercase' }}>
              PORTFOLIO_OS v3.0
            </motion.div>

            {/* PHASE: boot — terminal */}
            {phase === 'boot' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                ref={linesRef}
                style={{ marginBottom: '3rem' }}
              >
                <div style={{ fontFamily:'monospace', fontSize:'0.7rem', color:'#00FFD144',
                  letterSpacing:'0.2em', marginBottom:'1.5rem' }}>
                  &gt; BOOT SEQUENCE INITIATED
                </div>
                {BOOT_LINES.map((line, i) => (
                  <div key={i} className="boot-line"
                    style={{ fontFamily:'monospace', fontSize:'clamp(0.75rem,1.4vw,0.9rem)',
                      color: i === BOOT_LINES.length - 1 ? '#00FFD1' : '#00FFD188',
                      letterSpacing:'0.1em', marginBottom:'0.5rem',
                      display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <span style={{ color:'#00FFD133' }}>[{String(i+1).padStart(2,'0')}]</span>
                    {line}
                  </div>
                ))}
              </motion.div>
            )}

            {/* PHASE: name — big cinematic reveal */}
            {phase === 'name' && (
              <div style={{ marginBottom: '3rem', position:'relative', display:'inline-block' }}>
                {/* Line wipe overlay */}
                <div ref={lineWipeRef}
                  style={{ position:'absolute', inset:0, background:'#00FFD1', zIndex:2, transformOrigin:'left center' }} />
                {/* Name */}
                <div ref={nameRef} style={{ opacity:0 }}>
                  <div style={{ fontFamily:"'Bebas Neue', sans-serif",
                    fontSize:'clamp(5rem, 22vw, 16rem)', lineHeight:0.88,
                    color:'#f4f4f5', letterSpacing:'0.01em' }}>
                    AMR
                  </div>
                  <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:'clamp(0.8rem, 1.6vw, 1rem)',
                    letterSpacing:'0.35em', textTransform:'uppercase', color:'#00FFD1', marginTop:'0.5rem' }}>
                    Flutter Developer &amp; Hardware Engineer
                  </div>
                </div>
              </div>
            )}

            {/* Progress bar — always visible */}
            <div style={{ width:'100%', maxWidth:'500px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.6rem',
                fontFamily:'monospace', fontSize:'0.65rem', color:'oklch(38% 0.02 264)' }}>
                <span style={{ letterSpacing:'0.15em' }}>LOADING EXPERIENCE</span>
                <span ref={progressRef} style={{ color:'#00FFD1' }}>0%</span>
              </div>
              <div style={{ height:'1px', background:'#ffffff0d', borderRadius:'999px', overflow:'hidden' }}>
                <div ref={progressBarRef}
                  style={{ height:'100%', width:'0%', borderRadius:'999px',
                    background:'linear-gradient(to right, #00FFD1, #00b8a9)',
                    boxShadow:'0 0 12px #00FFD166' }} />
              </div>
            </div>

            {/* Bottom-right decoration */}
            <div style={{ position:'absolute', bottom:'2rem', right:'8vw',
              fontFamily:'monospace', fontSize:'0.6rem', color:'oklch(22% 0.02 264)',
              letterSpacing:'0.15em' }}>
              AMRSAEEDCSE © 2025
            </div>

            {/* Radial glow pulse */}
            <motion.div
              animate={{ opacity: [0.03, 0.09, 0.03] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position:'absolute', top:'20%', right:'-8%',
                width:'50vw', height:'50vh', borderRadius:'50%',
                background:'#00FFD1', filter:'blur(90px)', pointerEvents:'none' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
