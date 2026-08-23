import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHead, Reveal } from '../ui/blueprint';

const CONTACT_LINKS = [
  { label: 'EMAIL', text: 'amrabdelazeem117@gmail.com', href: 'mailto:amrabdelazeem117@gmail.com' },
  { label: 'WHATSAPP', text: '+20 112 115 3059', href: 'https://wa.me/201121153059' },
];

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/amrsaeedcse' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/amr-saeed-0bb957373/' },
  { label: 'WhatsApp', href: 'https://wa.me/201121153059' },
];

export default function Contact() {
  const [formState, setFormState] = useState('idle'); // idle | sending | success | error

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

  return (
    <section id="contact" className="relative px-5 md:px-14 pt-24 md:pt-36 pb-8 min-h-screen flex flex-col">
      <div className="max-w-[1150px] mx-auto w-full flex-1 flex flex-col">

        <SectionHead no="06" code="WORK ORDER — OPEN CHANNEL" title="LET'S BUILD TOGETHER." outlineWord="TOGETHER." />

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 mt-10 md:mt-14 items-start flex-1">

          {/* ── Left — channel info ─────────────────────────────────────── */}
          <div>
            <Reveal>
              <p className="text-ink-2 leading-[1.8] text-[0.95rem] md:text-[1.02rem] max-w-[48ch]">
                Open to freelance and collaboration. Send a work order and I'll
                respond within one working day.
              </p>
            </Reveal>

            <Reveal className="mt-8">
              <span className="stamp text-signal">AVAILABLE FOR FREELANCE</span>
            </Reveal>

            <Reveal className="mt-9">
              <ul>
                {CONTACT_LINKS.map(({ label, text, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className="group flex items-baseline justify-between gap-4 py-4 border-b border-line transition-colors"
                    >
                      <span className="mono-tiny text-ink-3">{label}</span>
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-[0.85rem] md:text-[0.95rem] truncate group-hover:text-signal transition-colors">
                          {text}
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-signal inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                        >
                          ↗
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ── Right — the work order form ─────────────────────────────── */}
          <Reveal delay={0.08}>
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="sheet-frame px-7 py-10 bg-paper-2 relative z-[4]"
                >
                  <span className="stamp text-signal" style={{ transform: 'rotate(-3deg)' }}>RECEIVED ✓</span>
                  <h3 className="h-display text-[1.6rem] mt-6">WORK ORDER FILED.</h3>
                  <p className="text-ink-2 text-[0.92rem] leading-relaxed mt-2">
                    Got it — I'll get back to you within one working day.
                  </p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="mono-label mt-6 hover:text-signal transition-colors"
                  >
                    Submit another →
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="wo-form flex flex-col gap-7">
                  {/* Web3Forms access key — public key, safe to commit */}
                  <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_KEY} />
                  <input type="hidden" name="subject" value="Portfolio work order submission" />
                  <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

                  <div>
                    <label htmlFor="wo-name" className="mono-tiny text-ink-3 block mb-1.5">
                      NAME / REQ. BY <span className="text-signal">*</span>
                    </label>
                    <input id="wo-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className="wo-input" />
                  </div>

                  <div>
                    <label htmlFor="wo-email" className="mono-tiny text-ink-3 block mb-1.5">
                      EMAIL / RETURN ADDR. <span className="text-signal">*</span>
                    </label>
                    <input id="wo-email" name="email" type="email" required autoComplete="email" placeholder="your@email.com" className="wo-input" />
                  </div>

                  <div>
                    <label htmlFor="wo-message" className="mono-tiny text-ink-3 block mb-1.5">
                      SPECIFICATION / MESSAGE <span className="text-signal">*</span>
                    </label>
                    <textarea id="wo-message" name="message" rows={4} required placeholder="Tell me about your project..." className="wo-input resize-none" />
                  </div>

                  {formState === 'error' && (
                    <p role="alert" className="mono-label" style={{ color: '#B33000' }}>
                      TRANSMISSION FAILED — TRY EMAILING ME DIRECTLY.
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={formState === 'sending'}
                    whileHover={formState !== 'sending' ? { y: -2 } : {}}
                    whileTap={formState !== 'sending' ? { y: 0 } : {}}
                    className="bp-btn bp-btn-primary w-full !justify-between"
                    style={{ opacity: formState === 'sending' ? 0.65 : 1, cursor: formState === 'sending' ? 'wait' : 'pointer' }}
                  >
                    <span>{formState === 'sending' ? 'Transmitting…' : 'Submit Work Order'}</span>
                    <span aria-hidden="true">↗</span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>

        {/* ── Footer — engineering drawing title block ────────────────────── */}
        <footer className="mt-16 md:mt-28 pb-2">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <p className="mono-tiny text-ink-3">© 2026 AMR ABDELAZEEM — BUILT WITH REACT + GSAP-FREE MOTION</p>
              <div className="flex gap-2.5">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="bp-chip hover:!border-signal hover:!text-signal transition-colors">
                    {label.toUpperCase()}
                  </a>
                ))}
              </div>
            </div>

            <div
              className="grid grid-cols-2 md:grid-cols-5 border border-line-strong bg-paper-2"
              role="contentinfo"
              aria-label="Drawing title block"
            >
              {[
                ['DRAWN BY', 'A. ABDELAZEEM'],
                ['DISCIPLINE', 'FLUTTER × HARDWARE'],
                ['LOCATION', 'ZAGAZIG, EGYPT'],
                ['DATE', '2026'],
              ].map(([k, v]) => (
                <div key={k} className="tb-cell">
                  <div className="mono-tiny text-ink-3">{k}</div>
                  <div className="mono-label mt-1.5 whitespace-nowrap overflow-hidden text-ellipsis">{v}</div>
                </div>
              ))}
              <div
                className="tb-cell !bg-signal"
                style={{ color: '#FFF6EF' }}
              >
                <div className="mono-tiny" style={{ color: 'rgba(255,246,239,0.75)' }}>SHEET</div>
                <div className="mono-label mt-1.5">06 — 06</div>
              </div>
            </div>
          </Reveal>
        </footer>
      </div>
    </section>
  );
}
