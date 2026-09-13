import { useEffect } from "react";

interface FormWelcomeProps { onStart: () => void; }

export function FormWelcome({ onStart }: FormWelcomeProps) {
  /* Enter ↵ starts the form */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Enter") onStart(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onStart]);

  return (
    <div className="form-grid-bg">

      {/* Bottom-left ember glow */}
      <div className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,40,40,0.22) 0%, transparent 70%)" }} />

      {/* Scrollable area (root is overflow-hidden, so the page scrolls here) */}
      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: "touch" }}>
      <div className="min-h-full flex items-center justify-center px-4 py-10 sm:py-14">

      <div className="form-welcome w-full max-w-5xl mx-auto
                      grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-8 md:gap-12 items-center">

        {/* ── Poster ── */}
        <div className="flex justify-center md:justify-end">
          <div className="poster-frame form-logo w-full max-w-[270px] sm:max-w-[340px] md:max-w-[380px]">
            <img src="/poster.jpg" alt="The Chief's Blueprint — Mastering the Markets — Mr. Raghav Selvaraj, Chief Mentor"
              className="w-full h-auto block" draggable={false} />
          </div>
        </div>

        {/* ── Copy ── */}
        <div className="text-center md:text-left">

          {/* Logo */}
          <div className="mb-6 flex justify-center md:justify-start">
            <img src="/logo.webp" alt="Delta Trading Academy"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-xl" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-red-400/40
                          text-white text-[10px] font-extrabold uppercase tracking-[3px]
                          px-4 py-1.5 rounded-full mb-5 form-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            Official Registration
          </div>

          {/* Heading */}
          <h1 className="display-font leading-[0.9] mb-2">
            <span className="block text-white/85 text-3xl sm:text-4xl md:text-5xl tracking-[0.12em]">The Chief's</span>
            <span className="metal-text block text-6xl sm:text-7xl md:text-8xl">Blueprint</span>
          </h1>
          <p className="display-font text-red-400 text-lg sm:text-xl tracking-[0.35em] uppercase mb-4">
            Mastering the Markets
          </p>

          {/* Pills */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5 form-fade-in">
            <span className="px-3 py-1.5 rounded-lg bg-red-700/90 text-white text-xs font-bold tracking-wide">
              6 Months&nbsp;|&nbsp;6 Phases&nbsp;|&nbsp;One Journey
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white text-xs font-bold tracking-wide">
              🗓 Starts 16th Sep · Wednesday
            </span>
          </div>

          <p className="text-white/70 text-sm sm:text-base mb-2 leading-relaxed">
            A 6-month trading journey with <span className="text-white font-bold">Chief Mentor Raghav Selvaraj</span>,
            Chief Technical Analyst.
          </p>
          <p className="text-white/50 text-xs sm:text-sm mb-7 leading-relaxed">
            Live market analysis · Learn beyond the curriculum · Discover new strategies · WD Gann concepts
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <button
              onClick={onStart}
              className="px-12 sm:px-14 py-4 sm:py-5 text-base sm:text-lg font-black uppercase
                         tracking-widest rounded-full shadow-2xl transition-all duration-300
                         hover:-translate-y-1 hover:shadow-red-500/40 border-0"
              style={{ background: "#fff", color: "#b80c0c", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Begin Registration →
            </button>
            <div className="flex items-center gap-2 text-xs text-white/35 form-fade-in">
              press <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-[10px] font-mono">Enter ↵</kbd> to begin
            </div>
          </div>

          {/* Info strip */}
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-5 text-xs text-white/40 form-fade-in">
            {[
              ["⏱", "~5 minutes"],
              ["📋", "16 questions"],
              ["🔒", "Secure & private"],
            ].map(([icon, label]) => (
              <span key={label} className="flex items-center gap-1.5">{icon} {label}</span>
            ))}
          </div>
        </div>
      </div>

      </div>
      </div>
    </div>
  );
}
