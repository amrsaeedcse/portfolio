import { SectionHead, Reveal } from '../ui/blueprint';

const ITEMS = [
  {
    rev: 'R1',
    date: '2024 — NOW',
    title: 'Mobile App Trainee',
    org: 'DEPI — MINISTRY OF COMMUNICATIONS & IT',
    desc: 'Intensive Flutter & Dart track under a national government initiative.',
    tone: 'signal',
  },
  {
    rev: 'R2',
    date: 'SUMMER 2024',
    title: 'Mobile App Trainee',
    org: 'ITI — INFORMATION TECHNOLOGY INSTITUTE',
    desc: 'Flutter, Dart, state management patterns and Clean Architecture.',
    tone: 'signal',
  },
  {
    rev: 'R3',
    date: '2021 — NOW',
    title: 'B.Sc. Computer Engineering',
    org: 'ZAGAZIG UNIVERSITY',
    desc: 'Computer & Systems Engineering — embedded and software focus.',
    tone: 'blue',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative px-5 md:px-14 py-24 md:py-36">
      <div className="max-w-[1150px] mx-auto">
        <SectionHead no="05" code="REVISION HISTORY" title="TRACK RECORD." />

        {/* Revision rail */}
        <div className="relative mt-12 md:mt-16 max-w-[780px]">
          <div
            data-exp-rail
            className="absolute top-1 bottom-1 w-px bg-line-strong"
            style={{ left: '15px' }}
            aria-hidden="true"
          />

          {ITEMS.map(({ rev, date, title, org, desc, tone }, i) => (
            <Reveal
              key={rev}
              delay={i * 0.07}
              className={`relative pb-12 md:pb-14 pl-10 md:pl-16 ${i === ITEMS.length - 1 ? '!pb-0' : ''}`}
            >
              {/* Datum node on the rail */}
              <span
                aria-hidden="true"
                className="absolute block h-[13px] w-[13px] rotate-45 border-2 bg-paper transition-transform duration-300 hover:rotate-[135deg]"
                style={{
                  left: '9px',
                  top: '4px',
                  borderColor: tone === 'blue' ? 'var(--color-bp)' : 'var(--color-signal)',
                }}
              />

              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="bp-chip tabular-nums"
                  style={tone === 'blue'
                    ? { borderColor: 'rgba(58,87,196,0.55)', color: 'var(--color-bp)', background: 'rgba(58,87,196,0.06)' }
                    : { borderColor: 'rgba(255,68,0,0.55)', color: 'var(--color-signal)', background: 'rgba(255,68,0,0.06)' }}
                >
                  {rev}
                </span>
                <span className="mono-tiny text-ink-3">{date}</span>
              </div>

              <h3 className="font-display font-extrabold tracking-tight text-[1.35rem] md:text-[1.7rem] mt-3 leading-tight">
                {title}
              </h3>
              <p
                className="mono-label mt-2"
                style={{ color: tone === 'blue' ? 'var(--color-bp)' : 'var(--color-signal)' }}
              >
                {org}
              </p>
              <p className="text-ink-2 text-[0.92rem] leading-[1.75] mt-2 max-w-[54ch]">{desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 select-none">
          <span className="mono-tiny text-ink-3">FURTHER REVISIONS IN PROGRESS // UNRELEASED</span>
        </Reveal>
      </div>
    </section>
  );
}
