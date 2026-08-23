import { motion } from 'framer-motion';
import { SectionHead, Reveal, DomainChip } from '../ui/blueprint';

const GROUPS = [
  {
    cat: 'MOBILE APPS', domain: 'sw',
    items: ['Flutter', 'React Native', 'Dart 3', 'Clean Architecture', 'Bloc / Cubit', 'Firebase'],
  },
  {
    cat: 'WEB & BACKEND', domain: 'sw',
    items: ['React', 'Node.js & Express', 'MongoDB', 'JavaScript / CSS3', 'Vite'],
  },
  {
    cat: 'HARDWARE & IoT', domain: 'hw',
    items: ['RTOS', 'C / C++', 'ESP32', 'VHDL & FPGA', 'Sensors / Arduino'],
  },
  {
    cat: 'TOOLS & ECOSYSTEM', domain: 'hw',
    items: ['Git & GitHub', 'Linux / Bash', 'Vercel Cloud', 'Postman API', 'Figma Design'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative px-5 md:px-14 py-24 md:py-36">
      <div className="max-w-[1150px] mx-auto">
        <SectionHead no="03" code="PARTS LIST — BOM REV.A" title="CAPABILITIES." />

        <Reveal className="mt-10 md:mt-14">
          <div className="sheet-frame px-5 py-7 md:px-12 md:py-11">

            {/* Sheet strip */}
            <div className="flex items-center justify-between border-b border-line pb-4 mb-7 relative z-[4]">
              <span className="mono-label text-signal">INDEX OF PARTS</span>
              <span className="mono-tiny text-ink-3 hidden sm:block">QTY: AS REQUIRED // MATL: CODE</span>
            </div>

            <div className="grid md:grid-cols-2 gap-x-14 gap-y-10 md:gap-y-12">
              {GROUPS.map((g, gi) => (
                <motion.div
                  key={g.cat}
                  data-skill-group
                  data-domain={g.domain}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: gi * 0.08 }}
                  className="border-t-2 border-ink pt-4"
                >
                  <header className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="h-display text-[1.15rem] md:text-[1.45rem] tracking-wide flex items-baseline gap-3">
                      <span className="font-mono text-[0.7rem] font-medium text-signal">{String.fromCharCode(65 + gi)}.</span>
                      {g.cat}
                    </h3>
                    <DomainChip domain={g.domain} />
                  </header>

                  <ul>
                    {g.items.map((item, ii) => (
                      <li key={item} className="parts-row">
                        <span className="mono-tiny text-ink-3 tabular-nums w-6 flex-none">
                          {String(ii + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[0.92rem] font-medium">{item}</span>
                        <span className="leader-dots" aria-hidden="true" />
                        <span className={`mono-tiny ${g.domain === 'hw' ? 'text-bp' : 'text-signal'}`}>
                          {g.domain === 'hw' ? 'HW' : 'SW'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-5 flex items-center justify-between select-none">
          <span className="mono-tiny text-ink-3">APPROVED BY: A. ABDELAZEEM</span>
          <span className="mono-tiny text-ink-3">SHEET 03 OF 06</span>
        </Reveal>
      </div>
    </section>
  );
}
