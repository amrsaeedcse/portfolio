import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

// Hook to ensure animations only run ONCE per session.
export function useHasAnimated(isActive) {
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (isActive && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isActive, hasAnimated]);
  
  return hasAnimated;
}

// Global Reusable Variants
export const VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  },
  fastContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.05 }
    }
  },
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, y: 0, 
      transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.8 }
    }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, scale: 1, 
      transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.8 }
    }
  },
  charReveal: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0, 
      transition: { type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.6 }
    }
  }
};

// Character/Word Stagger Component
export const AnimatedText = ({ text, style, className }) => {
  return (
    <motion.div
      variants={VARIANTS.fastContainer}
      style={{ display: 'inline-block', ...style }}
      className={className}
    >
      {text.split(' ').map((word, wordIdx) => (
        <span key={wordIdx} style={{ display: 'inline-block', marginRight: '0.25em', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              variants={VARIANTS.charReveal}
              style={{ display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

// Counter Component (0 to N)
export const AnimatedCounter = ({ targetValue, isActive, format = (v) => Math.round(v) }) => {
  const nodeRef = useRef(null);
  const hasAnimated = useHasAnimated(isActive);
  const count = useMotionValue(0);

  useEffect(() => {
    if (hasAnimated) {
      const controls = animate(count, targetValue, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (value) => {
          if (nodeRef.current) {
            nodeRef.current.textContent = format(value);
          }
        }
      });
      return controls.stop;
    }
  }, [hasAnimated, targetValue, count, format]);

  return <span ref={nodeRef}>{hasAnimated ? format(targetValue) : 0}</span>;
};
