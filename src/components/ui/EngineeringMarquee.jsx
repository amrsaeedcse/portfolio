import { motion } from 'framer-motion';

const TICKER_ITEMS = [
  'FLUTTER & DART 3',
  'REACT NATIVE',
  'CLEAN ARCHITECTURE & MVVM',
  'BLOC / CUBIT & REDUX',
  'NODE.JS & EXPRESS REST APIS',
  'MONGODB ATLAS & SQL',
  'DEEP LINKING & APP LINKS',
  'JAVA & ANDROID CHANNELS',
  'EMBEDDED PYTHON IN FLUTTER',
  'ESP32 & ARDUINO IOT',
  'C / C++ & FREERTOS',
  'VHDL / FPGA RISC CPU',
  'ZAGAZIG SYSTEMS ENGINEERING',
  'DEPI & ITI SCHOLAR',
];

export default function EngineeringMarquee() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative w-full overflow-hidden border-y-2 border-current bg-current/5 py-3 select-none">
      {/* Subtle CAD Ambient Backdrop */}
      <div className="flex w-max will-change-transform">
        <motion.div
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 28,
          }}
          className="flex items-center gap-8 whitespace-nowrap"
        >
          {repeated.map((item, idx) => (
            <div key={idx} className="flex items-center gap-8">
              <span className="font-mono text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-inherit flex items-center gap-2">
                <span className="text-[#FF4400] font-bold">#</span>
                {item}
              </span>
              <span className="font-mono text-xs text-[#FF4400] opacity-60">✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
