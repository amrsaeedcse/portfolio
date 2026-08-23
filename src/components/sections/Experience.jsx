import { motion } from 'framer-motion';

const MILESTONES = [
  {
    period: '2024 — PRESENT',
    role: 'Mobile Application Trainee',
    organization: 'DEPI — Ministry of Communications & Information Technology',
    description:
      'Selected for nationwide engineering scholarship focusing on enterprise Flutter architecture, Clean Code standards, state management streams, asynchronous native channels, and cloud backends.',
    badge: 'GOVERNMENT SCHOLARSHIP',
    color: '#FF4400',
    tags: ['Flutter', 'Dart 3', 'Clean Architecture', 'REST APIs', 'BLoC', 'Firebase'],
  },
  {
    period: 'SUMMER 2024',
    role: 'Mobile Software Development Trainee',
    organization: 'ITI — Information Technology Institute',
    description:
      'Specialized software engineering training covering Dart fundamentals, cross-platform mobile UI engineering, stateful architectures, local database caching, and collaborative Git workflows.',
    badge: 'TECHNICAL SCHOLARSHIP',
    color: '#3A57C4',
    tags: ['Flutter', 'Cubit', 'Hive Local DB', 'Firebase FCM', 'Git'],
  },
  {
    period: '2021 — PRESENT',
    role: 'B.Sc. in Computer & Systems Engineering',
    organization: 'Zagazig University — Faculty of Engineering',
    description:
      'Pursuing undergraduate engineering degree in Computer & Systems Engineering. Extensive coursework in Computer Architecture, Operating Systems, Real-Time Embedded Systems, Digital Logic Design (VHDL & FPGA), and Advanced Data Structures.',
    badge: 'ACADEMIC DEGREE',
    color: '#0E8345',
    tags: ['Computer Architecture', 'C / C++', 'VHDL & FPGA', 'Operating Systems', 'Algorithms'],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="relative px-5 md:px-14 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12 pb-4 border-b border-[#111318]/15"
        >
          <span className="bp-stamp text-[#3A57C4] border-[#3A57C4] mb-2 block w-fit">
            SHEET 04 // CAREER &amp; CREDENTIALS
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#111318] tracking-tight uppercase">
            MILESTONES &amp; TRACK RECORD.
          </h2>
        </motion.div>

        {/* Timeline Stream */}
        <div className="relative max-w-4xl space-y-8 pl-6 md:pl-10 border-l-2 border-[#111318]/25">
          {MILESTONES.map((m, idx) => (
            <motion.div
              key={m.organization}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Glowing Datum Node */}
              <div
                className="absolute -left-[32px] md:-left-[48px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#F2EFE7] transition-transform duration-300 group-hover:scale-125"
                style={{ borderColor: m.color }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mx-auto mt-0.5"
                  style={{ backgroundColor: m.color }}
                />
              </div>

              {/* Milestone Card */}
              <div className="sheet-frame p-6 sm:p-8 bg-[#EAE6DC]">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span
                    className="bp-stamp text-xs"
                    style={{ borderColor: m.color, color: m.color }}
                  >
                    {m.badge}
                  </span>
                  <span className="font-mono text-xs text-[#4B5162] font-bold">{m.period}</span>
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-[#111318] mt-2 uppercase">
                  {m.role}
                </h3>
                <p className="font-mono text-xs text-[#FF4400] font-bold mt-1">
                  {m.organization}
                </p>

                <p className="text-[#4B5162] text-sm sm:text-base leading-relaxed mt-4 font-body">
                  {m.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {m.tags.map((t) => (
                    <span key={t} className="bp-chip !text-[0.65rem] !py-0.5 !px-2.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
