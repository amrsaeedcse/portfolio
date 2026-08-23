import { motion } from 'framer-motion';
import { EASE } from '../../lib/motionPresets';

/* ── Registration cross "+" — corner mark on drawing sheets ─────────────────── */
export function Cross({ className = '', style }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute block h-3.5 w-3.5 ${className}`} style={style}>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-ink/45" />
      <span className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-ink/45" />
    </span>
  );
}

/* Four corner registration marks — parent must be relative */
export function RegMarks({ inset = '1.1rem', className = '' }) {
  const corners = [
    { top: inset, left: inset },
    { top: inset, right: inset },
    { bottom: inset, left: inset },
    { bottom: inset, right: inset },
  ];
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      className={className}
    >
      {corners.map((c, i) => <Cross key={i} style={c} />)}
    </div>
  );
}

/* ── Dimension annotation — [tick ───── LABEL ───── tick] ───────────────────── */
export function Dim({ label, color = '#82868F', className = '', style }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-2 select-none ${className}`}
      style={{ color, ...style }}
    >
      <span className="dim-tick" />
      <span className="dim-line-h" />
      <span className="mono-tiny whitespace-nowrap">{label}</span>
      <span className="dim-line-h" />
      <span className="dim-tick" />
    </div>
  );
}

/* Vertical variant */
export function DimV({ label, color = '#82868F', className = '', style }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col items-center gap-2 select-none ${className}`}
      style={{ color, ...style }}
    >
      <span className="dim-line-h" style={{ height: 14, width: 1 }} />
      <span className="mono-tiny whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>{label}</span>
      <span className="dim-line-h" style={{ flex: '1 1 auto', width: 1, minHeight: 14 }} />
      <span className="w-[9px] h-px bg-current flex-none" />
    </div>
  );
}

/* ── Section header — index / rule / title / code hint ─────────────────────── */
export function SectionHead({ no, code, title, outlineWord, className = '' }) {
  return (
    <div className={className}>
      <Reveal className="flex items-center gap-4 mb-5 md:mb-7">
        <span className="font-mono text-signal text-sm font-medium tabular-nums">{no}</span>
        <motion.span
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
          transition={{ duration: 0.9, ease: EASE }}
          className="h-px flex-1 bg-line-strong origin-left"
        />
        <span className="mono-tiny text-ink-3 hidden sm:block">{code}</span>
      </Reveal>
      <Reveal>
        <h2 className="h-display text-[clamp(2.6rem,7.5vw,5.5rem)]">
          {title.split(' ').map((word, i) => (
            <span key={i} className={outlineWord && word === outlineWord ? 'h-outline' : ''}>
              {word}
              {i < title.split(' ').length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </h2>
      </Reveal>
    </div>
  );
}

/* ── Scroll reveal wrapper — enters once when in view ──────────────────────── */
export function Reveal({ children, delay = 0, y = 26, className = '', as = 'div' }) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/* Domain chip for skills parts list */
export function DomainChip({ domain }) {
  return domain === 'hw'
    ? <span className="bp-chip bp-chip--blue">[HW // SYS]</span>
    : <span className="bp-chip bp-chip--signal">[SW // CORE]</span>;
}
