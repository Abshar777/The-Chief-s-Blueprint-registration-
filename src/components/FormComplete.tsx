import { useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import confetti from "canvas-confetti";

interface Props { onRegisterAnother: () => void; sections: { label: string; icon: string }[]; }

/* Chief's Blueprint colours — crimson, silver, gold */
const CONFETTI_COLORS = [
  "#d41111", "#ff3b3b", "#8a0000",   // crimson shades
  "#ffffff", "#c0c0c0", "#e8e8e8",   // silver / white
  "#ffd700", "#f7971e",              // gold, orange
];

function fireConfetti() {
  confetti({ particleCount: 80, spread: 70, angle: 60,  origin: { x: 0, y: 0.2 }, colors: CONFETTI_COLORS, scalar: 1.1, gravity: 1.2, drift: 0.5 });
  confetti({ particleCount: 80, spread: 70, angle: 120, origin: { x: 1, y: 0.2 }, colors: CONFETTI_COLORS, scalar: 1.1, gravity: 1.2, drift: -0.5 });
  setTimeout(() => {
    confetti({ particleCount: 120, spread: 100, angle: 90, origin: { x: 0.5, y: 0.35 }, colors: CONFETTI_COLORS, scalar: 1.2, gravity: 1.0, ticks: 220 });
  }, 220);
  setTimeout(() => {
    confetti({ particleCount: 50, spread: 120, angle: 90, origin: { x: 0.5, y: 0.3 }, colors: CONFETTI_COLORS, shapes: ["circle"], scalar: 0.7, gravity: 0.8, ticks: 160 });
  }, 600);
}

/* ── Last page: Thank you ──────────────────────────────────────────── */
export function FormComplete({ onRegisterAnother, sections }: Props) {

  useEffect(() => {
    const t = setTimeout(fireConfetti, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="form-grid-bg">

      {/* Glass header — 100% progress */}
      <header className="relative z-30 shrink-0">
        <div className="bg-white/10 backdrop-blur-xl border-b border-white/15">
          <div className="max-w-2xl mx-auto px-4 sm:px-5 py-2.5 flex items-center gap-3">
            <img src="/logo.webp" alt="Delta" className="h-7 sm:h-8 w-auto object-contain shrink-0 drop-shadow" />
            <div className="flex-1 flex items-center justify-center gap-1">
              {sections.map((s, i) => (
                <div key={s.label} className="flex items-center gap-1">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-primary whitespace-nowrap">
                    ✓<span className="hidden lg:inline">{s.label}</span>
                  </div>
                  {i < sections.length - 1 && <div className="w-3 h-px bg-white/60" />}
                </div>
              ))}
            </div>
            <div className="w-7 h-7 rounded-full bg-white text-primary text-[11px] font-black flex items-center justify-center shadow-sm shrink-0">✓</div>
          </div>
          <div className="h-[3px] bg-white w-full" />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide">
        <div className="min-h-full flex items-center justify-center px-4 sm:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="question-card w-full max-w-xl p-6 sm:p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 18 }}
              className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-4xl shadow-lg mx-auto mb-5"
            >
              🎉
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.35 }}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1"
            >
              Thank You!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32, duration: 0.35 }}
              className="display-font text-primary text-lg tracking-[0.25em] uppercase mb-3"
            >
              Welcome to The Chief's Blueprint
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.35 }}
            >
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-7 px-1">
                Your registration has been received. Our team will reach out to you with the
                next steps before the journey begins on <span className="font-bold text-slate-800">16th September</span>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.35 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              {[
                { icon: "✅", label: "Registered", sub: "Successfully"    },
                { icon: "📞", label: "Our Team",   sub: "Will reach out"  },
                { icon: "🗓", label: "16th Sep",   sub: "Journey begins"  },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="bg-primary/5 rounded-xl p-3 text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <p className="text-[11px] font-extrabold text-primary">{label}</p>
                  <p className="text-[10px] text-slate-400">{sub}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="relative"
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-primary/25 pointer-events-none"
                animate={{ scale: [1, 1.1, 1], opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.button
                onClick={onRegisterAnother}
                whileHover={{ scale: 1.03, y: -2, boxShadow: "0 12px 32px rgba(212,17,17,0.35)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative form-button w-full flex items-center justify-center gap-2.5 py-3.5 text-sm uppercase tracking-widest rounded-full shadow-lg"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                Register Another Student
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
