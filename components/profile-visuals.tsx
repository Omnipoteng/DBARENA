import type { ReactNode } from "react";

export type BorderKey = "none" | "legend" | "mythic" | "apex";
export type RankKey = "Recruit" | "Challenger" | "Vanguard" | "Legend" | "Mythic" | "Apex";

export type BorderTheme = {
  label: string;
  description: string;
  ring: string;
  glow: string;
  electricColor: string;
  text: string;
};

export type RankTheme = {
  title: RankKey;
  subtitle: string;
  emblem: number;
  accent: string;
};

export const borderThemes: Record<BorderKey, BorderTheme> = {
  none: {
    label: "No Border",
    description: "Clean avatar without a border effect.",
    ring: "linear-gradient(135deg, rgba(17,17,17,0.12), rgba(17,17,17,0.04))",
    glow: "rgba(17, 17, 17, 0.08)",
    electricColor: "#111111",
    text: "text-black",
  },
  legend: {
    label: "Legend Border",
    description: "Gold border with a prestige feel.",
    ring:
      "conic-gradient(from 180deg, #26190a 0deg, #c9952f 90deg, #fff0bf 180deg, #8a5d16 270deg, #26190a 360deg)",
    glow: "rgba(244, 196, 76, 0.34)",
    electricColor: "#f4c44c",
    text: "text-amber-100",
  },
  mythic: {
    label: "Mythic Border",
    description: "Crimson-violet border for a sharper high tier.",
    ring:
      "conic-gradient(from 180deg, #1b0913 0deg, #d946ef 110deg, #ff6b6b 190deg, #6d28d9 280deg, #1b0913 360deg)",
    glow: "rgba(217, 70, 239, 0.34)",
    electricColor: "#d946ef",
    text: "text-rose-100",
  },
  apex: {
    label: "Apex Border",
    description: "Obsidian, electric cyan, and silver.",
    ring:
      "conic-gradient(from 180deg, #05070c 0deg, #19d7ff 110deg, #eef3f8 180deg, #6b7280 270deg, #05070c 360deg)",
    glow: "rgba(25, 215, 255, 0.34)",
    electricColor: "#19d7ff",
    text: "text-cyan-100",
  },
};

export const rankThemes: Record<RankKey, RankTheme> = {
  Recruit: {
    title: "Recruit",
    subtitle: "Fresh entry in the arena.",
    emblem: 1,
    accent: "bg-slate-100",
  },
  Challenger: {
    title: "Challenger",
    subtitle: "The first real climb.",
    emblem: 2,
    accent: "bg-blue-100",
  },
  Vanguard: {
    title: "Vanguard",
    subtitle: "A stable contender.",
    emblem: 4,
    accent: "bg-emerald-100",
  },
  Legend: {
    title: "Legend",
    subtitle: "A proven battleboarder.",
    emblem: 6,
    accent: "bg-amber-100",
  },
  Mythic: {
    title: "Mythic",
    subtitle: "High pressure, high reward.",
    emblem: 7,
    accent: "bg-rose-100",
  },
  Apex: {
    title: "Apex",
    subtitle: "The final boss tier.",
    emblem: 8,
    accent: "bg-cyan-100",
  },
};

export function resolveRank(points: number): RankKey {
  if (points >= 8500) return "Apex";
  if (points >= 6500) return "Mythic";
  if (points >= 4500) return "Legend";
  if (points >= 2500) return "Vanguard";
  if (points >= 1000) return "Challenger";
  return "Recruit";
}

export function getRankProgress(points: number) {
  const tiers = [
    { key: "Recruit" as const, min: 0, max: 1000 },
    { key: "Challenger" as const, min: 1000, max: 2500 },
    { key: "Vanguard" as const, min: 2500, max: 4500 },
    { key: "Legend" as const, min: 4500, max: 6500 },
    { key: "Mythic" as const, min: 6500, max: 8500 },
    { key: "Apex" as const, min: 8500, max: 8500 },
  ];

  const current =
    tiers.find((tier, index) => {
      const next = tiers[index + 1];
      return points >= tier.min && (next ? points < next.min : true);
    }) ?? tiers[0];

  const nextTier = tiers[tiers.findIndex((tier) => tier.key === current.key) + 1] ?? current;
  const span = Math.max(nextTier.min - current.min, 1);
  const progress = Math.min(Math.max(((points - current.min) / span) * 100, 0), 100);

  return {
    current: current.key,
    next: nextTier.key,
    progress,
  };
}

export function RankBadge({ rank }: { rank: RankKey }) {
  const theme = rankThemes[rank];
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-black/10 ${theme.accent} px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-black`}>
      <span className="h-2 w-2 rounded-full bg-black/70" />
      {theme.title}
    </div>
  );
}

export function RankEmblem({ variant }: { variant: number }) {
  switch (variant) {
    case 1:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="p1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="42%" stopColor="#d7dbe2" />
              <stop offset="100%" stopColor="#5f6674" />
            </linearGradient>
            <linearGradient id="p1a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M28 72 62 36h32l6 20h4l6-20h32l34 36-40 30H68L28 72Z" fill="url(#p1)" stroke="#111111" strokeWidth="8" />
          <path d="M68 102 100 126l32-24 20 16-52 42-52-42 20-16Z" fill="#4b5563" stroke="#111111" strokeWidth="8" />
          <path d="M78 70 90 54h20l12 16-12 10H90L78 70Z" fill="#ffffff" fillOpacity="0.36" />
          <path d="M74 104 92 90h16l18 14-18 10H92L74 104Z" fill="#ffffff" fillOpacity="0.18" />
          <path d="M100 126v42" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
          <path d="M52 64h28M120 64h28" stroke="url(#p1a)" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="p2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="52%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#162a63" />
            </linearGradient>
          </defs>
          <path d="M34 74 58 38l22 10 20-20 20 20 22-10 24 36-22 22H56L34 74Z" fill="url(#p2)" stroke="#0f172a" strokeWidth="8" />
          <path d="M62 96 100 130l38-34 18 22-30 34H74L44 118l18-22Z" fill="#2b5cc5" stroke="#0f172a" strokeWidth="8" />
          <path d="M82 56 100 42l18 14-8 16H90l-8-16Z" fill="#ffffff" fillOpacity="0.38" />
          <path d="M80 96 92 84h16l12 12-10 18H90L80 96Z" fill="#ffffff" fillOpacity="0.22" />
          <path d="M100 130v28" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="p4" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ecfeff" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0b1324" />
            </linearGradient>
          </defs>
          <path d="M32 70 58 34l18 14 12-18 12 18 18-14 26 36-22 22-34-10-34 10-22-22Z" fill="url(#p4)" stroke="#111827" strokeWidth="8" />
          <path d="M72 84 100 68l28 16v56l-28 18-28-18V84Z" fill="#0f766e" stroke="#111827" strokeWidth="8" />
          <path d="M86 70 100 56l14 14-14 12-14-12Z" fill="#ffffff" fillOpacity="0.34" />
          <path d="M84 108 100 94l16 14-16 12-16-12Z" fill="#ffffff" fillOpacity="0.2" />
          <path d="M100 138v18" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case 6:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="p6" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff7cc" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#6b2d08" />
            </linearGradient>
          </defs>
          <path d="M100 18 156 56l22 36-18 34-40 22h-40L40 126l-18-34 22-36 56-38Z" fill="url(#p6)" stroke="#1f1300" strokeWidth="8" />
          <path d="M62 62 82 48h36l20 14-14 20H76L62 62Z" fill="#ffffff" fillOpacity="0.28" />
          <path d="M48 102 76 84h48l28 18-22 28H70L48 102Z" fill="#ffffff" fillOpacity="0.14" />
          <path d="M100 52 118 86 100 138 82 86 100 52Z" fill="#1f1300" fillOpacity="0.25" />
          <path d="M100 138v18" stroke="#1f1300" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case 7:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="p7" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe4e6" />
              <stop offset="45%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
          </defs>
          <path d="M100 18 150 44l26 32-10 38-32 22-34 18-34-18-32-22-10-38 26-32 50-26Z" fill="url(#p7)" stroke="#111111" strokeWidth="8" />
          <path d="M72 56 88 42h24l16 14-8 22H80L72 56Z" fill="#ffffff" fillOpacity="0.28" />
          <path d="M54 94 82 74h36l28 20-18 30H72L54 94Z" fill="#ffffff" fillOpacity="0.14" />
          <path d="M100 142v18" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="p8" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0b0f16" />
              <stop offset="42%" stopColor="#19d7ff" />
              <stop offset="100%" stopColor="#bfc7d5" />
            </linearGradient>
            <linearGradient id="p8b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19d7ff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M100 14 156 34l26 28-10 38-14 18 14 18-26 36-46 18-46-18-26-36 14-18-14-18-10-38 26-28 56-20Z" fill="url(#p8)" stroke="#111111" strokeWidth="8" />
          <path d="M74 42 88 28h24l14 14-12 18H86L74 42Z" fill="#ffffff" fillOpacity="0.22" />
          <path d="M54 80 82 58h36l28 22-10 18H64L54 80Z" fill="#19d7ff" fillOpacity="0.16" />
          <path d="M82 96 96 82h8l14 14-8 10H90l-8-10Z" fill="#0b0f16" fillOpacity="0.55" />
          <path d="M100 124 120 90 100 56 80 90 100 124Z" fill="#bfc7d5" fillOpacity="0.18" />
          <path d="M62 132 86 122h28l24 10-10 14H72L62 132Z" fill="url(#p8b)" />
          <path d="M100 124v28" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
          <path d="M50 62 34 52" stroke="#19d7ff" strokeOpacity="0.7" strokeWidth="8" strokeLinecap="round" />
          <path d="M150 62 166 52" stroke="#bfc7d5" strokeOpacity="0.75" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
  }
}
