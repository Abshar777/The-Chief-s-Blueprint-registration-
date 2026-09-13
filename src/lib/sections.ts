/* ── Section config shared by header, rewards and complete pages ── */
export const SECTIONS = [
  { label: "Personal",    icon: "👤", from: 1,  to: 4  },
  { label: "Background",  icon: "📈", from: 5,  to: 8  },
  { label: "Commitment",  icon: "🔥", from: 9,  to: 11 },
  { label: "Final Check", icon: "✅", from: 12, to: 15 },
  { label: "Chief's Q",   icon: "👑", from: 16, to: 16 },
];
export const getSection = (n: number) => SECTIONS.find(s => n >= s.from && n <= s.to);
