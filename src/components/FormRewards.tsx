import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
  sections: { label: string; icon: string }[];
}

/* ── Second-last page: Rewards for Consistency ─────────────────────── */
export function FormRewards({ onSubmit, onPrevious, isSubmitting, sections }: Props) {
  return (
    <div className="form-grid-bg">

      {/* Glass header — all sections done, 100% progress */}
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
            <div className="w-7 h-7 rounded-full bg-white text-primary text-sm flex items-center justify-center shadow-sm shrink-0">🏆</div>
          </div>
          <div className="h-[3px] bg-white w-full" />
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="min-h-full flex items-center justify-center px-4 sm:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="dark-card w-full max-w-xl p-6 sm:p-8 text-center text-white"
          >
            {/* Trophy */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 18 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600 to-red-900 border border-red-400/40
                         flex items-center justify-center text-4xl shadow-lg mx-auto mb-5"
            >
              🏆
            </motion.div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-red-400/40
                            text-red-200 text-[10px] font-extrabold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              Before you submit
            </div>

            <h1 className="display-font text-4xl sm:text-5xl tracking-[0.06em] leading-none mb-1">
              <span className="metal-text">Rewards for Consistency</span>
            </h1>
            <p className="text-red-300 font-extrabold text-sm sm:text-base uppercase tracking-[0.2em] mb-6">
              Your commitment will be recognized.
            </p>

            <div className="text-left space-y-4 text-white/80 text-sm sm:text-base leading-relaxed mb-7">
              <p>
                Throughout this 6-month journey, <span className="text-white font-bold">attendance and consistency will be tracked.</span>
              </p>
              <p>
                At the end of the journey, <span className="text-white font-bold">the students with the highest attendance and strongest
                consistency will be rewarded with exciting gifts from The Chief.</span> 🎁🔥
              </p>
            </div>

            {/* Mantra */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
              {[
                ["👊", "Show up"],
                ["📈", "Stay consistent"],
                ["🏁", "Complete the journey"],
                ["🎁", "Get rewarded"],
              ].map(([icon, label]) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{icon}</div>
                  <p className="text-[11px] font-extrabold text-white/90 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Submitting hint — Apps Script round-trips are slow */}
            {isSubmitting && (
              <p className="text-[11px] text-white/45 font-semibold mb-3 -mt-4">
                Saving your registration… this can take up to 20 seconds. Please don't close the page.
              </p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
              <button onClick={onPrevious} disabled={!!isSubmitting}
                className="flex items-center gap-1 text-sm font-semibold text-white/50
                           hover:text-white transition-colors py-2 px-1 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <motion.button onClick={onSubmit} disabled={!!isSubmitting}
                whileTap={!isSubmitting ? { scale: 0.96 } : {}}
                className={cn(
                  "form-button flex items-center gap-2 px-6 sm:px-8 py-2.5 text-sm uppercase tracking-wide rounded-full shadow-md",
                  isSubmitting && "opacity-40 cursor-not-allowed",
                )}>
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>
                  : <>Submit Registration<ChevronRight className="w-4 h-4" /></>
                }
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
