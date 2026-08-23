import { SectionHead, Reveal } from '../ui/blueprint';

const ITEMS = [
  {
    rev: 'REV.01',
    date: '2024 — PRESENT',
    title: 'Mobile Application Trainee',
    org: 'DEPI — MINISTRY OF COMMUNICATIONS & INFORMATION TECHNOLOGY',
    desc: 'Selected for intensive national scholarship focusing on enterprise Flutter & Dart mobile application architecture, Clean Code practices, state management patterns, and production deployment.',
    tone: 'signal',
    tags: ['Flutter', 'Dart 3', 'Clean Architecture', 'REST APIs', 'BLoC'],
  },
  {
    rev: 'REV.02',
    date: 'SUMMER 2024',
    title: 'Mobile Application Trainee',
    org: 'ITI — INFORMATION TECHNOLOGY INSTITUTE',
    desc: 'Rigorous specialized software development training covering Dart fundamentals, cross-platform UI/UX engineering with Flutter, responsive layouts, and local database caching.',
    tone: 'signal',
    tags: ['Flutter', 'Cubit', 'Hive DB', 'Firebase', 'Git'],
  },
  {
    rev: 'REV.03',
    date: '2021 — PRESENT',
    title: 'B.Sc. in Computer & Systems Engineering',
    org: 'ZAGAZIG UNIVERSITY — FACULTY OF ENGINEERING',
    desc: 'Pursuing undergraduate degree in Computer Engineering. Deep coursework spanning Computer Architecture, Operating Systems, Embedded Firmware, Digital Logic Design (VHDL/FPGA), Algorithms, and Data Structures.',
    tone: 'blue',
    tags: ['Computer Architecture', 'C / C++', 'VHDL & FPGA', 'Data Structures', 'OS'],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative px-5 md:px-14 py-20 md:py-32">
      <div className="max-w-[1150px] mx-auto">
        <SectionHead no="04" code="REVISION HISTORY // LOG REV.2026" title="TRACK RECORD." outlineWord="RECORD." />

        {/* Revision rail timeline */}
        <div className="relative mt-12 md:mt-16 max-w-[820px]">
          {/* Vertical Bus Line */}
          <div
            data-exp-rail
            className="absolute top-2 bottom-2 w-px bg-line-strong"
            style={{ left: '15px' }}
            aria-hidden="true"
          />

          {ITEMS.map(({ rev, date, title, org, desc, tone, tags }, i) => (
            <Reveal
              key={rev}
              delay={i * 0.08}
              className={`relative pb-12 md:pb-16 pl-10 md:pl-16 ${i === ITEMS.length - 1 ? '!pb-2' : ''}`}
            >
              {/* Datum Node Icon on the Rail */}
              <span
                aria-hidden="true"
                className="absolute block h-3.5 w-3.5 rotate-45 border-2 bg-paper transition-transform duration-300 hover:rotate-[135deg]"
                style={{
                  left: '9px',
                  top: '5px',
                  borderColor: tone === 'blue' ? 'var(--color-bp)' : 'var(--color-signal)',
                  backgroundColor: tone === 'blue' ? 'rgba(58,87,196,0.1)' : 'rgba(255,68,0,0.1)',
                }}
              />

              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="bp-chip tabular-nums font-bold"
                  style={
                    tone === 'blue'
                      ? { borderColor: 'rgba(58,87,196,0.55)', color: 'var(--color-bp)', background: 'rgba(58,87,196,0.06)' }
                      : { borderColor: 'rgba(255,68,0,0.55)', color: 'var(--color-signal)', background: 'rgba(255,68,0,0.06)' }
                  }
                >
                  {rev}
                </span>
                <span className="mono-tiny text-ink-3 font-medium">{date}</span>
              </div>

              <h3 className="font-display font-black tracking-tight text-[1.4rem] md:text-[1.8rem] mt-3 leading-tight text-ink">
                {title}
              </h3>
              <p
                className="mono-label font-bold mt-1.5 text-[0.75rem]"
                style={{ color: tone === 'blue' ? 'var(--color-bp)' : 'var(--color-signal)' }}
              >
                {org}
              </p>
              <p className="text-ink-2 text-[0.93rem] leading-[1.8] mt-3 max-w-[62ch]">
                {desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {tags.map((t) => (
                  <span key={t} className="bp-chip !text-[0.6rem] !py-0.5 !px-2 bg-paper/60">{t}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Footer Note */}
        <Reveal className="mt-10 select-none border-t border-line pt-4 flex items-center justify-between">
          <span className="mono-tiny text-ink-3">CONTINUOUS REVISION // EXPANDING EXPERTISE</span>
          <span className="mono-tiny text-ink-3">SHEET 04 OF 05</span>
        </Reveal>
      </div>
    </section>
  );
}
