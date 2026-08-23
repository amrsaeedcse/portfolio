import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHead, Reveal } from '../ui/blueprint';

const CONTACT_LINKS = [
  { label: 'EMAIL ADDRESS', text: 'amrabdelazeem117@gmail.com', href: 'mailto:amrabdelazeem117@gmail.com', copyable: true },
  { label: 'WHATSAPP DIRECT', text: '+20 112 115 3059', href: 'https://wa.me/201121153059' },
  { label: 'GITHUB PROFILE', text: 'github.com/amrsaeedcse', href: 'https://github.com/amrsaeedcse' },
  { label: 'LINKEDIN PROFILE', text: 'linkedin.com/in/amrsaeed-cse', href: 'https://linkedin.com/in/amrsaeed-cse' },
];

export default function Contact() {
  const [formState, setFormState] = useState('idle'); // idle | sending | success | error
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('amrabdelazeem117@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

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
    <section id="contact" className="relative px-5 md:px-14 pt-20 md:pt-32 pb-8 min-h-screen flex flex-col justify-between">
      <div className="max-w-[1150px] mx-auto w-full flex-1 flex flex-col">

        <SectionHead
          no="05"
          code="WORK ORDER // OPEN CHANNEL REV.2026"
          title="LET'S BUILD TOGETHER."
          outlineWord="TOGETHER."
        />

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 mt-10 md:mt-14 items-start flex-1">

          {/* ── Left Column: Channel & Specs ──────────────────────────────── */}
          <div>
            <Reveal>
              <p className="text-ink-2 leading-[1.85] text-[0.96rem] md:text-[1.05rem] max-w-[50ch]">
                Available for engineering contracts, software architecture consulting, mobile app development,
                and embedded IoT prototyping. Submit a work order or contact me directly through channels below.
              </p>
            </Reveal>

            <Reveal className="mt-7 flex items-center gap-3">
              <span className="stamp text-signal font-bold">COMMUNICATION LINES OPEN</span>
              <span className="mono-tiny text-ink-3">RESPONSE TIME: &lt; 24H</span>
            </Reveal>

            <Reveal className="mt-8">
              <ul className="divide-y divide-line">
                {CONTACT_LINKS.map(({ label, text, href, copyable }) => (
                  <li key={label}>
                    <div className="flex items-center justify-between gap-4 py-4 group">
                      <div>
                        <span className="mono-tiny text-ink-3 block mb-0.5">{label}</span>
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : undefined}
                          rel={href.startsWith('http') ? 'noreferrer' : undefined}
                          className="font-mono text-[0.88rem] md:text-[0.96rem] font-medium text-ink group-hover:text-signal transition-colors flex items-center gap-2"
                        >
                          {text}
                          <span aria-hidden="true" className="text-signal inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            ↗
                          </span>
                        </a>
                      </div>

                      {copyable && (
                        <button
                          onClick={handleCopyEmail}
                          className="bp-chip !text-[0.6rem] !py-1 !px-2.5 hover:!border-signal hover:!text-signal cursor-pointer"
                        >
                          {copied ? 'COPIED ✓' : 'COPY'}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ── Right Column: Work Order Form ─────────────────────────────── */}
          <Reveal delay={0.08}>
            <div className="sheet-frame p-6 md:p-9 bg-paper-2 shadow-sm relative z-[4]">
              <div className="flex items-center justify-between border-b border-line pb-3 mb-6">
                <span className="mono-label text-signal font-bold">TRANSMISSION TERMINAL</span>
                <span className="mono-tiny text-ink-3">SECURE TRANSMISSION</span>
              </div>

              <AnimatePresence mode="wait">
                {formState === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="py-8 text-center"
                  >
                    <span className="stamp text-signal !text-sm mb-4 inline-block">RECEIVED &amp; LOGGED ✓</span>
                    <h3 className="h-display text-2xl mt-4">WORK ORDER TRANSMITTED.</h3>
                    <p className="text-ink-2 text-sm leading-relaxed mt-2 max-w-[38ch] mx-auto">
                      Thank you. Your message has been logged directly into my queue. I will follow up via email within one working day.
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="bp-btn bp-btn-primary mt-6 !py-2 !px-5"
                    >
                      File Another Work Order →
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="wo-form flex flex-col gap-6">
                    <input type="hidden" name="access_key" value="7ebfcffb-3b32-4752-9c44-3253b6f0414e" />
                    <input type="hidden" name="subject" value="New Work Order Submission from Portfolio" />
                    <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

                    <div>
                      <label htmlFor="wo-name" className="mono-tiny text-ink-3 block mb-1">
                        NAME / CLIENT DESIGNATION <span className="text-signal">*</span>
                      </label>
                      <input
                        id="wo-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Alex Vance"
                        className="wo-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="wo-email" className="mono-tiny text-ink-3 block mb-1">
                        EMAIL / RETURN ADDRESS <span className="text-signal">*</span>
                      </label>
                      <input
                        id="wo-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="e.g. alex@company.com"
                        className="wo-input"
                      />
                    </div>

                    <div>
                      <label htmlFor="wo-message" className="mono-tiny text-ink-3 block mb-1">
                        PROJECT SPECIFICATION &amp; SCOPE <span className="text-signal">*</span>
                      </label>
                      <textarea
                        id="wo-message"
                        name="message"
                        rows={4}
                        required
                        placeholder="Describe your requirements, timeline, and platform..."
                        className="wo-input resize-none"
                      />
                    </div>

                    {formState === 'error' && (
                      <div className="p-3 border border-red-500/40 bg-red-500/10 text-red-700 mono-tiny">
                        TRANSMISSION ERROR: Please email directly to amrabdelazeem117@gmail.com
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formState === 'sending'}
                      className="bp-btn bp-btn-primary w-full !justify-between !py-3 !px-5 mt-2"
                      style={{ opacity: formState === 'sending' ? 0.65 : 1, cursor: formState === 'sending' ? 'wait' : 'pointer' }}
                    >
                      <span>{formState === 'sending' ? 'Transmitting Data…' : 'Submit Work Order'}</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* ── Engineering Title Block Footer ────────────────────────────── */}
        <footer className="mt-16 md:mt-24 pt-4 select-none">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <p className="mono-tiny text-ink-3">
                © 2026 AMR ABDELAZEEM — ALL DRAWINGS, SPECS &amp; REPOSITORIES ARCHIVED
              </p>
              <div className="flex gap-2">
                <a href="https://github.com/amrsaeedcse" target="_blank" rel="noreferrer" className="bp-chip hover:!border-signal hover:!text-signal">
                  GITHUB
                </a>
                <a href="https://linkedin.com/in/amrsaeed-cse" target="_blank" rel="noreferrer" className="bp-chip hover:!border-signal hover:!text-signal">
                  LINKEDIN
                </a>
                <a href="https://wa.me/201121153059" target="_blank" rel="noreferrer" className="bp-chip hover:!border-signal hover:!text-signal">
                  WHATSAPP
                </a>
              </div>
            </div>

            {/* Drawing Title Block Table */}
            <div
              className="grid grid-cols-2 md:grid-cols-5 border border-line-strong bg-paper-2"
              role="contentinfo"
              aria-label="Engineering Drawing Title Block"
            >
              {[
                ['DRAWN BY', 'AMR ABDELAZEEM'],
                ['DISCIPLINE', 'FLUTTER × HARDWARE'],
                ['LOCATION', 'ZAGAZIG, EGYPT'],
                ['RELEASE', 'PORTFOLIO REV.2026'],
              ].map(([k, v]) => (
                <div key={k} className="tb-cell">
                  <div className="mono-tiny text-ink-3">{k}</div>
                  <div className="mono-label font-bold text-ink mt-1 truncate">{v}</div>
                </div>
              ))}
              <div className="tb-cell !bg-signal" style={{ color: '#FFF6EF' }}>
                <div className="mono-tiny text-white/80">DRAWING SET</div>
                <div className="mono-label font-bold mt-1 text-white">05 OF 05 // COMPLETED</div>
              </div>
            </div>
          </Reveal>
        </footer>

      </div>
    </section>
  );
}
