import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [formState, setFormState] = useState('idle');
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('amrabdelazeem117@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
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
    <section id="contact" className="relative px-5 md:px-14 pt-20 md:pt-28 pb-12">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12 pb-4 border-b border-[#111318]/15"
        >
          <span className="bp-stamp text-[#FF4400] border-[#FF4400] mb-2 block w-fit">
            SHEET 05 // WORK ORDER TRANSMISSION
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#111318] tracking-tight uppercase">
            TRANSMIT SPECIFICATIONS.
          </h2>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">

          {/* Left Column: Direct Info & Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            <p className="text-[#4B5162] text-base sm:text-lg leading-relaxed max-w-lg font-body">
              Have a mobile architecture project, an embedded IoT idea, or need an experienced Flutter &amp; Systems engineer?
              Transmit specifications directly or log a work order — I typically respond within 24 hours.
            </p>

            {/* Direct Channel Cards */}
            <div className="space-y-3">
              {/* Email Card */}
              <div className="sheet-frame p-4 sm:p-5 flex items-center justify-between gap-4 bg-[#EAE6DC]">
                <div>
                  <span className="font-mono text-xs text-[#8A91A5] uppercase block font-bold">DIRECT EMAIL</span>
                  <a
                    href="mailto:amrabdelazeem117@gmail.com"
                    className="font-mono font-bold text-sm sm:text-base text-[#111318] hover:text-[#FF4400] transition-colors"
                  >
                    amrabdelazeem117@gmail.com
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="bp-stamp cursor-pointer hover:bg-[#111318] hover:text-[#F2EFE7]"
                >
                  {copied ? 'COPIED ✓' : 'COPY EMAIL'}
                </button>
              </div>

              {/* WhatsApp Card */}
              <div className="sheet-frame p-4 sm:p-5 flex items-center justify-between gap-4 bg-[#EAE6DC]">
                <div>
                  <span className="font-mono text-xs text-[#8A91A5] uppercase block font-bold">WHATSAPP DIRECT</span>
                  <span className="font-mono font-bold text-sm sm:text-base text-[#111318]">
                    +20 112 115 3059
                  </span>
                </div>
                <a
                  href="https://wa.me/201121153059"
                  target="_blank"
                  rel="noreferrer"
                  className="bp-btn-primary !py-1.5 !px-3.5 !text-xs"
                >
                  Chat ↗
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-[#111318]/15 flex items-center gap-3">
              <span className="text-xs font-mono text-[#8A91A5] mr-2 font-bold">CHANNELS:</span>
              <a href="https://github.com/amrsaeedcse" target="_blank" rel="noreferrer" className="bp-chip font-bold">
                GITHUB ↗
              </a>
              <a href="https://linkedin.com/in/amrsaeed-cse" target="_blank" rel="noreferrer" className="bp-chip font-bold">
                LINKEDIN ↗
              </a>
            </div>
          </motion.div>

          {/* Right Column: Work Order Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sheet-frame p-6 sm:p-8 bg-[#EAE6DC]"
          >
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0E8345]/10 border border-[#0E8345] text-[#0E8345] flex items-center justify-center mx-auto text-xl font-bold mb-4">
                    ✓
                  </div>
                  <h3 className="font-display font-black text-2xl text-[#111318] uppercase">SPECIFICATION LOGGED</h3>
                  <p className="text-[#4B5162] text-sm mt-2 max-w-sm mx-auto font-body">
                    Thank you. Work order transmitted successfully. Response will be delivered shortly.
                  </p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="bp-btn-secondary mt-6 !py-2 !px-5 !text-xs"
                  >
                    Transmit Another Work Order
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="access_key" value="7ebfcffb-3b32-4752-9c44-3253b6f0414e" />
                  <input type="hidden" name="subject" value="New Drawing Request" />
                  <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

                  <div>
                    <label htmlFor="name" className="font-mono text-xs text-[#111318] block mb-1 font-bold">
                      REQUISITIONER NAME <span className="text-[#FF4400]">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Eng. Sarah Connor"
                      className="w-full bg-[#F2EFE7] border border-[#111318]/25 rounded-none px-4 py-3 text-sm text-[#111318] focus:outline-none focus:border-[#FF4400] font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="font-mono text-xs text-[#111318] block mb-1 font-bold">
                      RETURN EMAIL <span className="text-[#FF4400]">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. sarah@organization.com"
                      className="w-full bg-[#F2EFE7] border border-[#111318]/25 rounded-none px-4 py-3 text-sm text-[#111318] focus:outline-none focus:border-[#FF4400] font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="font-mono text-xs text-[#111318] block mb-1 font-bold">
                      SYSTEM SPECIFICATIONS / SCOPE <span className="text-[#FF4400]">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      placeholder="Describe target architecture, mobile scope, or hardware timeline..."
                      className="w-full bg-[#F2EFE7] border border-[#111318]/25 rounded-none px-4 py-3 text-sm text-[#111318] focus:outline-none focus:border-[#FF4400] font-mono resize-none"
                    />
                  </div>

                  {formState === 'error' && (
                    <div className="p-3 bg-red-500/10 border border-red-500 text-red-700 text-xs font-mono">
                      Transmission error. Please email directly to amrabdelazeem117@gmail.com
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="bp-btn-primary w-full !py-3.5 mt-2"
                  >
                    {formState === 'sending' ? 'TRANSMITTING…' : 'TRANSMIT WORK ORDER ↗'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

        {/* ── Title Block Footer ────────────────────────────────────────── */}
        <footer className="mt-20 pt-6 border-t-2 border-[#111318] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#4B5162]">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#111318]">AMR ABDELAZEEM // SYSTEMS ARCHITECT</span>
            <span>SET OF 05 SHEETS</span>
          </div>
          <span>ZAGAZIG, EGYPT · 30.58° N, 31.50° E</span>
        </footer>

      </div>
    </section>
  );
}
