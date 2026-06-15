import Navbar from "@/components/sections/navbar";

type LeaderboardEntry = {
  rank: number;
  name: string;
  handle: string;
  role: string;
  location: string;
  evolution: "up" | "down" | "flat";
  delta: number;
  score: number;
  metrics: [number, number, number, number, number, number];
};

const leaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Singularity",
    handle: "@singularity_55",
    role: "Scaler",
    location: "ID",
    evolution: "up",
    delta: 1,
    score: 65,
    metrics: [67, 68, 66, 65, 62, 62],
  },
  {
    rank: 2,
    name: "Kiriin",
    handle: "@kiriin",
    role: "Editor",
    location: "SG",
    evolution: "down",
    delta: 1,
    score: 63,
    metrics: [46, 79, 63, 60, 83, 48],
  },
  {
    rank: 3,
    name: "Vanta",
    handle: "@vanta",
    role: "Contributor",
    location: "JP",
    evolution: "flat",
    delta: 0,
    score: 58,
    metrics: [41, 69, 58, 63, 64, 51],
  },
  {
    rank: 4,
    name: "Raven",
    handle: "@raven",
    role: "Scaler",
    location: "ID",
    evolution: "down",
    delta: 1,
    score: 50,
    metrics: [47, 47, 56, 45, 53, 51],
  },
  {
    rank: 5,
    name: "Astra",
    handle: "@astra",
    role: "Member",
    location: "MY",
    evolution: "up",
    delta: 1,
    score: 47,
    metrics: [46, 49, 49, 51, 37, 50],
  },
  {
    rank: 6,
    name: "Morrow",
    handle: "@morrow",
    role: "Moderator",
    location: "PH",
    evolution: "down",
    delta: 1,
    score: 45,
    metrics: [39, 45, 54, 40, 50, 43],
  },
  {
    rank: 7,
    name: "Reina",
    handle: "@reina",
    role: "Contributor",
    location: "TH",
    evolution: "flat",
    delta: 0,
    score: 45,
    metrics: [53, 42, 47, 42, 41, 47],
  },
  {
    rank: 8,
    name: "Axis",
    handle: "@axis",
    role: "Member",
    location: "VN",
    evolution: "down",
    delta: 1,
    score: 45,
    metrics: [57, 46, 55, 38, 30, 41],
  },
  {
    rank: 9,
    name: "Mika",
    handle: "@mika",
    role: "Member",
    location: "ID",
    evolution: "up",
    delta: 1,
    score: 42,
    metrics: [25, 50, 49, 46, 51, 34],
  },
  {
    rank: 10,
    name: "Lyra",
    handle: "@lyra",
    role: "Contributor",
    location: "SG",
    evolution: "up",
    delta: 1,
    score: 41,
    metrics: [25, 54, 39, 44, 52, 29],
  },
];

const metricLabels = ["VIT", "DEL", "TIR", "DEF", "PAS", "PHY"] as const;

function AvatarMark({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-black">
      {name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)}
    </div>
  );
}

function EvolutionBadge({ evolution, delta }: { evolution: LeaderboardEntry["evolution"]; delta: number }) {
  const icon = evolution === "up" ? "▲" : evolution === "down" ? "▼" : "≡";
  const label = evolution === "flat" ? "0" : `${evolution === "up" ? "+" : "-"}${delta}`;

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span
        className={`text-xs font-black ${
          evolution === "up" ? "text-black" : evolution === "down" ? "text-black/45" : "text-black/45"
        }`}
      >
        {icon}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
        {label}
      </span>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-black/10 bg-white px-4 py-3">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 shrink-0 text-black/45">
        <circle cx="11" cy="11" r="6.5" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 16l4 4" />
      </svg>
      <input
        type="text"
        readOnly
        value="Search a player"
        className="w-full bg-transparent text-sm text-black/55 outline-none placeholder:text-black/35"
        aria-label="Search leaderboard player"
      />
    </div>
  );
}

function BoardHeader() {
  return (
    <div className="grid grid-cols-[74px_68px_78px_minmax(220px,1.2fr)_repeat(6,minmax(36px,1fr))_74px_34px] items-center gap-3 border-b border-black/8 px-4 py-3 text-[10px] uppercase tracking-[0.26em] text-black/40">
      <span>Rank</span>
      <span>Evolution</span>
      <span>Avatar</span>
      <span>Player</span>
      {metricLabels.map((label) => (
        <span key={label} className="text-center">
          {label}
        </span>
      ))}
      <span className="text-center">Score</span>
      <span />
    </div>
  );
}

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const isTop = entry.rank === 1;

  return (
    <div
      className={`grid grid-cols-[74px_68px_78px_minmax(220px,1.2fr)_repeat(6,minmax(36px,1fr))_74px_34px] items-center gap-3 border-b border-black/6 px-4 py-3 transition last:border-b-0 ${
        isTop ? "bg-black/[0.03]" : "bg-transparent hover:bg-black/[0.02]"
      }`}
    >
      <div className="flex items-center gap-2">
        {isTop ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d="M7 14.5 5 6l5 3.5L12 4l2 5.5L19 6l-2 8.5H7Z" fill="currentColor" />
            </svg>
          </div>
        ) : (
          <span className="text-xl font-black text-black">{entry.rank}</span>
        )}
      </div>

      <EvolutionBadge evolution={entry.evolution} delta={entry.delta} />

      <AvatarMark name={entry.name} />

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-sans text-[15px] font-black uppercase tracking-[0.06em] text-black">
            {entry.name}
          </p>
          <span className="rounded-full border border-black/10 bg-black/[0.03] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-black/55">
            {entry.role}
          </span>
        </div>
        <p className="truncate text-xs text-black/45">
          {entry.handle} · {entry.location}
        </p>
      </div>

      {entry.metrics.map((metric, index) => (
        <div key={`${entry.rank}-${metricLabels[index]}`} className="text-center">
          <div className="inline-flex min-w-[30px] justify-center rounded-full px-2 py-1 text-sm font-black text-black">
            {metric}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <div className="flex h-10 w-16 items-center justify-center rounded-[14px] bg-black px-3 text-lg font-black text-white">
          {entry.score}
        </div>
      </div>

      <button
        type="button"
        className="flex h-10 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black/60 transition hover:bg-black/[0.03]"
        aria-label={`Open ${entry.name}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.04),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#f8f8f7_52%,_#f0f0ee_100%)] text-black">
      <Navbar />

      <section className="border-b border-black/8 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/70"
            aria-label="Open leaderboard menu"
          >
            <span className="flex flex-col gap-1">
              <span className="h-0.5 w-4 bg-current" />
              <span className="h-0.5 w-4 bg-current" />
              <span className="h-0.5 w-4 bg-current" />
            </span>
          </button>

          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/45">DBARENA</p>
            <h1 className="mt-1 font-sans text-xl font-black uppercase tracking-[0.1em] text-black">
              Top Leaderboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/55 sm:inline-flex">
              Martin Lafarge
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-xs font-black uppercase tracking-[0.18em] text-black">
              M
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <section className="rounded-[26px] border border-black/8 bg-white p-4 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.42em] text-black/35">Weekly ranking</p>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Papan klasemen compact untuk melihat urutan, pergerakan rank, dan performa battleboarding.
              </p>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-3xl">
              <div className="rounded-[18px] border border-black/8 bg-black/[0.02] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-black/35">Top score</p>
                <p className="mt-1 text-2xl font-black text-black">65</p>
              </div>
              <div className="rounded-[18px] border border-black/8 bg-black/[0.02] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-black/35">Active players</p>
                <p className="mt-1 text-2xl font-black text-black">84</p>
              </div>
              <div className="rounded-[18px] border border-black/8 bg-black/[0.02] px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.28em] text-black/35">Matches</p>
                <p className="mt-1 text-2xl font-black text-black">1,452</p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[26px] border border-black/8 bg-white shadow-[0_22px_80px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 border-b border-black/8 px-4 py-3">
            <SearchBar />
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[1240px]">
              <BoardHeader />
              <div>
                {leaderboardEntries.map((entry) => (
                  <LeaderboardRow key={entry.rank} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
