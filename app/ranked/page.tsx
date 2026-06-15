"use client";

import Footer from "@/components/sections/footer";
import Navbar from "@/components/sections/navbar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type RankStage = {
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  text: string;
  ring: string;
  milestone: string;
  emblem: number;
  hero: string;
  glow: string;
};

const ranks: RankStage[] = [
  {
    name: "Recruit",
    subtitle: "Entry point",
    description:
      "Tier awal untuk member yang baru mulai ranked dan sedang membangun rekam jejak.",
    badge: "from-slate-100 via-slate-300 to-slate-500",
    text: "text-slate-950",
    ring: "ring-slate-200",
    milestone: "0",
    emblem: 1,
    hero: "from-[#4d4f58] via-[#30323a] to-[#1b1d23]",
    glow: "bg-slate-200/25",
  },
  {
    name: "Challenger",
    subtitle: "First climb",
    description:
      "Mulai stabil di debat private dan sudah punya evidence dasar yang bisa diandalkan.",
    badge: "from-sky-200 via-blue-400 to-indigo-700",
    text: "text-white",
    ring: "ring-blue-200",
    milestone: "750",
    emblem: 2,
    hero: "from-[#2557b7] via-[#23469a] to-[#101b39]",
    glow: "bg-sky-300/25",
  },
  {
    name: "Contender",
    subtitle: "Consistent wins",
    description:
      "Cocok untuk member yang sering menang dan mulai punya gaya argumentasi yang rapi.",
    badge: "from-cyan-200 via-sky-500 to-blue-900",
    text: "text-white",
    ring: "ring-cyan-200",
    milestone: "1500",
    emblem: 3,
    hero: "from-[#4dd8ff] via-[#2da6ea] to-[#0f2451]",
    glow: "bg-cyan-300/25",
  },
  {
    name: "Vanguard",
    subtitle: "Front line",
    description:
      "Masuk ke tingkat yang lebih serius dengan rekam jejak debat yang mulai kuat.",
    badge: "from-emerald-100 via-cyan-400 to-slate-900",
    text: "text-white",
    ring: "ring-emerald-200",
    milestone: "2500",
    emblem: 4,
    hero: "from-[#2fc1a3] via-[#0f8f8f] to-[#101828]",
    glow: "bg-emerald-300/25",
  },
  {
    name: "Elite",
    subtitle: "High control",
    description:
      "Tier kuat dengan konsistensi penilaian yang sudah matang dan bisa dibaca dengan jelas.",
    badge: "from-violet-200 via-indigo-500 to-slate-900",
    text: "text-white",
    ring: "ring-violet-200",
    milestone: "4000",
    emblem: 5,
    hero: "from-[#9b8cff] via-[#5f48d6] to-[#131728]",
    glow: "bg-violet-300/25",
  },
  {
    name: "Legend",
    subtitle: "Trusted record",
    description: "Untuk debat yang bersih, teruji, dan biasanya sudah dikenal di komunitas.",
    badge: "from-amber-100 via-amber-400 to-orange-700",
    text: "text-black",
    ring: "ring-amber-200",
    milestone: "6000",
    emblem: 6,
    hero: "from-[#ffd85e] via-[#dca11d] to-[#6c3a05]",
    glow: "bg-amber-200/25",
  },
  {
    name: "Mythic",
    subtitle: "Upper ladder",
    description:
      "Masuk ke level yang sangat selektif, dengan performa debat yang harus konsisten tinggi.",
    badge: "from-rose-100 via-red-400 to-zinc-950",
    text: "text-white",
    ring: "ring-rose-200",
    milestone: "8500",
    emblem: 7,
    hero: "from-[#f9718c] via-[#dc3b56] to-[#121420]",
    glow: "bg-rose-300/25",
  },
  {
    name: "DBA Apex",
    subtitle: "Top rank",
    description:
      "Puncak ladder untuk member yang sudah membuktikan diri di banyak match ranked.",
    badge: "from-[#0b0f16] via-[#19d7ff] to-[#bfc7d5]",
    text: "text-white",
    ring: "ring-cyan-200",
    milestone: "12000",
    emblem: 8,
    hero: "from-[#0b0f16] via-[#19d7ff] to-[#bfc7d5]",
    glow: "bg-cyan-300/25",
  },
];

const platforms = ["WhatsApp", "Discord", "Facebook"];

function RankEmblem({ variant }: { variant: number }) {
  switch (variant) {
    case 1:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="r1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="42%" stopColor="#d7dbe2" />
              <stop offset="100%" stopColor="#5f6674" />
            </linearGradient>
            <linearGradient id="r1a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M28 72 62 36h32l6 20h4l6-20h32l34 36-40 30H68L28 72Z" fill="url(#r1)" stroke="#111111" strokeWidth="8" />
          <path d="M68 102 100 126l32-24 20 16-52 42-52-42 20-16Z" fill="#4b5563" stroke="#111111" strokeWidth="8" />
          <path d="M78 70 90 54h20l12 16-12 10H90L78 70Z" fill="#ffffff" fillOpacity="0.36" />
          <path d="M74 104 92 90h16l18 14-18 10H92L74 104Z" fill="#ffffff" fillOpacity="0.18" />
          <path d="M100 126v42" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
          <path d="M52 64h28M120 64h28" stroke="url(#r1a)" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="r2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="52%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#162a63" />
            </linearGradient>
          </defs>
          <path d="M34 74 58 38l22 10 20-20 20 20 22-10 24 36-22 22H56L34 74Z" fill="url(#r2)" stroke="#0f172a" strokeWidth="8" />
          <path d="M62 96 100 130l38-34 18 22-30 34H74L44 118l18-22Z" fill="#2b5cc5" stroke="#0f172a" strokeWidth="8" />
          <path d="M82 56 100 42l18 14-8 16H90l-8-16Z" fill="#ffffff" fillOpacity="0.38" />
          <path d="M80 96 92 84h16l12 12-10 18H90L80 96Z" fill="#ffffff" fillOpacity="0.22" />
          <path d="M100 130v28" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="r3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d9f99d" />
              <stop offset="50%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0b1b2d" />
            </linearGradient>
          </defs>
          <path d="M100 24 154 54l18 38-34 52H62L28 92l18-38 54-30Z" fill="url(#r3)" stroke="#0f172a" strokeWidth="8" />
          <path d="M66 76 48 56l18-6 14 16-14 10Z" fill="#ffffff" fillOpacity="0.25" />
          <path d="M134 76 152 56l-18-6-14 16 14 10Z" fill="#ffffff" fillOpacity="0.25" />
          <path d="M100 48 120 84 100 140 80 84 100 48Z" fill="#ffffff" fillOpacity="0.18" />
          <path d="M74 110 90 94h20l16 16-16 14H90L74 110Z" fill="#0f172a" fillOpacity="0.45" />
          <path d="M100 140v18" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="r4" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ecfeff" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0b1324" />
            </linearGradient>
          </defs>
          <path d="M32 70 58 34l18 14 12-18 12 18 18-14 26 36-22 22-34-10-34 10-22-22Z" fill="url(#r4)" stroke="#111827" strokeWidth="8" />
          <path d="M72 84 100 68l28 16v56l-28 18-28-18V84Z" fill="#0f766e" stroke="#111827" strokeWidth="8" />
          <path d="M86 70 100 56l14 14-14 12-14-12Z" fill="#ffffff" fillOpacity="0.34" />
          <path d="M84 108 100 94l16 14-16 12-16-12Z" fill="#ffffff" fillOpacity="0.2" />
          <path d="M100 138v18" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case 5:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="r5" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ede9fe" />
              <stop offset="48%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
          </defs>
          <path d="M100 22 144 48l22 30-18 46-48 30-48-30-18-46 22-30 44-26Z" fill="url(#r5)" stroke="#0f172a" strokeWidth="8" />
          <path d="M72 62 92 48h16l20 14-10 18H82L72 62Z" fill="#ffffff" fillOpacity="0.3" />
          <path d="M62 102 86 82h28l24 20-16 22H78L62 102Z" fill="#ffffff" fillOpacity="0.16" />
          <path d="M100 142v16" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case 6:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="r6" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff7cc" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#6b2d08" />
            </linearGradient>
          </defs>
          <path d="M100 18 156 56l22 36-18 34-40 22h-40L40 126l-18-34 22-36 56-38Z" fill="url(#r6)" stroke="#1f1300" strokeWidth="8" />
          <path d="M62 62 82 48h36l20 14-14 20H76L62 62Z" fill="#ffffff" fillOpacity="0.28" />
          <path d="M48 102 76 84h48l28 18-22 28H70L48 102Z" fill="#ffffff" fillOpacity="0.14" />
          <path d="M100 52 118 86 100 138 82 86 100 52Z" fill="#1f1300" fillOpacity="0.25" />
          <path d="M100 138v18" stroke="#1f1300" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case 7:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="r7" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe4e6" />
              <stop offset="45%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
          </defs>
          <path d="M100 18 150 44l26 32-10 38-32 22-34 18-34-18-32-22-10-38 26-32 50-26Z" fill="url(#r7)" stroke="#111111" strokeWidth="8" />
          <path d="M72 56 88 42h24l16 14-8 22H80L72 56Z" fill="#ffffff" fillOpacity="0.28" />
          <path d="M54 94 82 74h36l28 20-18 30H72L54 94Z" fill="#ffffff" fillOpacity="0.14" />
          <path d="M100 142v18" stroke="#111111" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="r8" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0b0f16" />
              <stop offset="42%" stopColor="#19d7ff" />
              <stop offset="100%" stopColor="#bfc7d5" />
            </linearGradient>
            <linearGradient id="r8b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19d7ff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#111111" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M100 14 156 34l26 28-10 38-14 18 14 18-26 36-46 18-46-18-26-36 14-18-14-18-10-38 26-28 56-20Z"
            fill="url(#r8)"
            stroke="#111111"
            strokeWidth="8"
          />
          <path
            d="M74 42 88 28h24l14 14-12 18H86L74 42Z"
            fill="#ffffff"
            fillOpacity="0.22"
          />
          <path
            d="M54 80 82 58h36l28 22-10 18H64L54 80Z"
            fill="#19d7ff"
            fillOpacity="0.16"
          />
          <path
            d="M82 96 96 82h8l14 14-8 10H90l-8-10Z"
            fill="#0b0f16"
            fillOpacity="0.55"
          />
          <path
            d="M100 124 120 90 100 56 80 90 100 124Z"
            fill="#bfc7d5"
            fillOpacity="0.18"
          />
          <path
            d="M62 132 86 122h28l24 10-10 14H72L62 132Z"
            fill="url(#r8b)"
          />
          <path
            d="M100 124v28"
            stroke="#111111"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M50 62 34 52"
            stroke="#19d7ff"
            strokeOpacity="0.7"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M150 62 166 52"
            stroke="#bfc7d5"
            strokeOpacity="0.75"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

type RewardPreviewProps = {
  name: string;
  subtitle: string;
  description: string;
  badgeLabel: string;
  ringGradient: string;
  glowGradient: string;
  ringText: string;
};

function RewardPreviewCard({
  name,
  subtitle,
  description,
  badgeLabel,
  ringGradient,
  glowGradient,
  ringText,
}: RewardPreviewProps) {
  return (
    <article className="overflow-hidden border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
            {badgeLabel}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-black">{name}</h3>
          <p className="mt-2 text-sm leading-6 text-black/60">{subtitle}</p>
        </div>
        <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/55">
          Avatar border
        </span>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="rank-border-float relative h-44 w-44 sm:h-48 sm:w-48">
          <div
            className="rank-border-spin absolute inset-0 rounded-full p-[7px] shadow-[0_0_28px_rgba(0,0,0,0.14)]"
            style={{ background: ringGradient }}
          />

          <div
            className="absolute inset-[10px] rounded-full blur-2xl"
            style={{ background: glowGradient }}
          />

          <div
            className="absolute inset-[18px] rounded-full border border-black/8 bg-[radial-gradient(circle_at_30%_30%,_#ffffff_0%,_#f4f4f2_52%,_#dfdfdb_100%)] shadow-[inset_0_0_22px_rgba(0,0,0,0.08)]"
          />
          <div
            className="absolute inset-[32px] flex items-center justify-center rounded-full border border-black/10 bg-black text-white shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
          >
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
                DBA
              </p>
              <p className={`mt-2 font-display text-3xl uppercase leading-none ${ringText}`}>
                {name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-black/65">{description}</p>
    </article>
  );
}

export default function RankedPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const seenIntro = window.localStorage.getItem("dba-ranked-intro-seen");
      if (!seenIntro) {
        setShowIntro(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;

    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const width = element.clientWidth || 1;
        const nextIndex = Math.round(element.scrollLeft / width);
        setActiveIndex(Math.max(0, Math.min(ranks.length - 1, nextIndex)));
      });
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      element.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const closeIntro = () => {
    window.localStorage.setItem("dba-ranked-intro-seen", "true");
    setShowIntro(false);
  };

  const openIntro = () => {
    setShowIntro(true);
  };

  const scrollToRank = (index: number) => {
    const element = carouselRef.current;
    if (!element) return;

    const width = element.clientWidth || 1;
    element.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7f7f6_0%,_#efefec_100%)] text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden border border-black/8 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="border-b border-black/8 px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  DBA Ranked
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-black sm:text-4xl lg:text-5xl">
                  Ranked ladder
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-black/60">
                  Geser hero di atas untuk berpindah dari Recruit sampai DBA Apex.
                  Setiap request ranked tetap butuh approval dan link debat private.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/60"
                  >
                    {platform}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={openIntro}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-black hover:text-white"
                >
                  Apa itu ranked
                </button>
              </div>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth touch-pan-x"
          >
            {ranks.map((rank, index) => {
              const isActive = index === activeIndex;
              const isLast = index === ranks.length - 1;

              return (
                <article
                  key={rank.name}
                  className="min-w-full snap-center"
                  aria-label={`Rank ${rank.name}`}
                >
                  <div className={`relative overflow-hidden bg-gradient-to-br ${rank.hero}`}>
                    <div className={`absolute inset-0 ${rank.glow} blur-3xl`} />
                    <div
                      className={`relative px-5 py-6 text-white sm:px-8 sm:py-8 lg:px-10 lg:py-10 ${
                        isActive ? "rank-hero-pop" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <Link
                          href="/"
                          className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
                        >
                          Back
                        </Link>
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">
                          Swipe ladder
                        </span>
                      </div>

                      <div className="mt-8 grid items-center gap-8 lg:min-h-[34rem] lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="max-w-2xl">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
                            Tier {String(index + 1).padStart(2, "0")}
                          </p>
                          <h2 className="mt-3 max-w-xl font-display text-5xl uppercase leading-[0.9] text-white sm:text-7xl">
                            {rank.name}
                          </h2>
                          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                            {rank.subtitle}
                          </p>
                          <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">
                            {rank.description}
                          </p>

                          <div className="mt-6 flex flex-wrap gap-2">
                            {platforms.map((platform) => (
                              <span
                                key={`${rank.name}-${platform}`}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>

                          <div className="mt-7 hidden gap-3 sm:grid sm:grid-cols-3">
                            <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
                              <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                                Milestone
                              </p>
                              <p className="mt-2 text-xl font-semibold text-white">
                                {rank.milestone}
                              </p>
                              <p className="mt-1 text-sm text-white/65">DBA points</p>
                            </div>
                            <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
                              <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                                Status
                              </p>
                              <p className="mt-2 text-xl font-semibold text-white">
                                {isActive ? "Selected" : "Ready"}
                              </p>
                              <p className="mt-1 text-sm text-white/65">Swipe to switch rank</p>
                            </div>
                            <div className="rounded-[1.25rem] border border-white/10 bg-white/10 p-4">
                              <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                                Action
                              </p>
                              <p className="mt-2 text-xl font-semibold text-white">
                                {isLast ? "Apex" : "Advance"}
                              </p>
                              <p className="mt-1 text-sm text-white/65">
                                {isLast ? "Final rank unlocked" : "Continue climbing"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                              href="/ranked/request"
                              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:brightness-95"
                            >
                              Start Ranked
                            </Link>
                            {!isLast ? (
                              <button
                                type="button"
                                onClick={() => scrollToRank(index + 1)}
                                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                              >
                                Next rank
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => scrollToRank(0)}
                                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                              >
                                Back to Recruit
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-8 rounded-full bg-white/10 blur-3xl" />
                          <div className="relative flex w-full max-w-[22rem] flex-col items-center rounded-[2rem] border border-white/10 bg-white/10 p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:p-8">
                            <div
                              className={`flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48 ${
                                isActive ? "rank-emblem-pop" : ""
                              }`}
                            >
                              <RankEmblem variant={rank.emblem} />
                            </div>
                            <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
                              Ladder focus
                            </p>
                            <h3 className="mt-2 font-display text-4xl uppercase leading-none text-white sm:text-5xl">
                              {rank.name}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-white/70">
                              {rank.subtitle} untuk request ranked yang sudah di-approve.
                            </p>
                            <div className="mt-6 w-full rounded-[1.25rem] border border-white/10 bg-black/10 p-4 text-left">
                              <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                                Required
                              </p>
                              <ul className="mt-3 space-y-2 text-sm text-white/75">
                                <li>Private debate link</li>
                                <li>Platform: WhatsApp, Discord, or Facebook</li>
                                <li>Match details and opponent name</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="border-t border-black/8 px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Rank path
                </p>
                <p className="mt-2 hidden text-sm text-black/60 sm:block">
                  Swipe sampai DBA Apex. Dots di bawah ini bisa dipencet.
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.22em] text-black/40">
                {String(activeIndex + 1).padStart(2, "0")} / {String(ranks.length).padStart(2, "0")}
              </p>
            </div>

            <div className="relative mt-5">
              <div className="h-[2px] rounded-full bg-black/10" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                <div className="flex items-center justify-between">
                  {ranks.map((rank, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={rank.name}
                        type="button"
                        onClick={() => scrollToRank(index)}
                        className="flex flex-col items-center"
                        aria-label={`Go to ${rank.name}`}
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                            isActive ? "border-black bg-black" : "border-black/15 bg-white"
                          }`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full transition ${
                              isActive ? "rank-dot-active bg-white" : "bg-[#c8a94f]"
                            }`}
                          />
                        </div>
                        <span className="mt-3 hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45 md:block">
                          {rank.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex flex-col gap-4 border-b border-black/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Rank rewards
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-black">
                Avatar border preview
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-black/60">
                Ini contoh reward border profil untuk rank tinggi. Fokus dulu ke
                Legend, Mythic, dan DBA Apex supaya feel hadiahnya kebaca jelas.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.22em] text-black/40">
              Animated preview
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <RewardPreviewCard
              name="Legend"
              subtitle="Reward border bernuansa emas terang, cocok buat profile yang terlihat clean dan prestige."
              description="Border ini bisa dipakai sebagai hadiah saat member berhasil mencapai Legend. Efek glow dibuat lebih lembut supaya tetap premium."
              badgeLabel="Tier reward"
              ringGradient="conic-gradient(from 180deg, #fff8c7, #f5c84c, #b97300, #fff2a6, #fff8c7)"
              glowGradient="radial-gradient(circle, rgba(245,200,76,0.26) 0%, rgba(245,200,76,0.08) 42%, rgba(255,255,255,0) 75%)"
              ringText="text-amber-100"
            />
            <RewardPreviewCard
              name="Mythic"
              subtitle="Border lebih agresif dengan tone merah-ungu, terasa lebih rare dan kompetitif."
              description="Cocok untuk reward tier yang lebih tinggi. Wujudnya dibuat lebih gelap supaya aura Mythic terasa berat dan elite."
              badgeLabel="Tier reward"
              ringGradient="conic-gradient(from 180deg, #ffd3da, #ef4b64, #7e3ff2, #111111, #ffd3da)"
              glowGradient="radial-gradient(circle, rgba(239,75,100,0.28) 0%, rgba(126,63,242,0.16) 38%, rgba(0,0,0,0) 74%)"
              ringText="text-rose-100"
            />
            <RewardPreviewCard
              name="Apex"
              subtitle="Puncak reward border, paling monster dan paling mencolok untuk profile utama."
              description="Border Apex dibuat dengan obsidian, electric cyan, dan silver agar jauh dari Legend dan terasa lebih final boss."
              badgeLabel="Top reward"
              ringGradient="conic-gradient(from 180deg, #0b0f16, #19d7ff, #bfc7d5, #111827, #19d7ff, #0b0f16)"
              glowGradient="radial-gradient(circle, rgba(25,215,255,0.28) 0%, rgba(191,199,213,0.16) 38%, rgba(0,0,0,0) 76%)"
              ringText="text-cyan-100"
            />
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Match flow
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-black">How ranked works</h2>

            <div className="mt-5 space-y-3">
              {["Submit request", "Admin approval", "Result update"].map((title, index) => (
                <div
                  key={title}
                  className="flex gap-4 border-b border-black/8 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-black/60">
                      {index === 0
                        ? "Ajukan ranked match dengan link debat private yang valid."
                        : index === 1
                          ? "Admin review dan approve sebelum debat dimulai."
                          : "Setelah debat selesai, admin observasi hasil dan update rank."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-black/8 bg-black/[0.03] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              To prepare
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-black">Before you request</h2>

            <div className="mt-5 space-y-3">
              {[
                "Link debat private yang aktif",
                "Platform debat: WhatsApp, Discord, atau Facebook",
                "Nama lawan atau target match",
                "Waktu debat dan catatan singkat",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b border-black/8 pb-3 last:border-b-0 last:pb-0"
                >
                  <span className="pr-4 text-sm leading-6 text-black/70">{item}</span>
                  <span className="shrink-0 text-black/35">&rsaquo;</span>
                </div>
              ))}
            </div>

            <Link
              href="/ranked/request"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#2f80ed] text-sm font-semibold text-white shadow-[0_12px_24px_rgba(47,128,237,0.28)] transition hover:brightness-110"
            >
              Start Ranked
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      {showIntro ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
            <div className="flex flex-col gap-4 border-b border-black/8 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Ranked intro
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-black sm:text-4xl">
                  Sistem ranked DBARENA
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-black/60">
                  Pop-up ini memperkenalkan urutan rank dan logo tiap tier sebelum kamu
                  masuk ke request approval. Geser hero di halaman utama untuk melihat
                  rank berikutnya, atau pilih rank langsung dari daftar di bawah.
                </p>
              </div>

              <button
                type="button"
                onClick={closeIntro}
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 bg-black px-5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Close
              </button>
            </div>

            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {ranks.map((rank, index) => (
                  <button
                    key={rank.name}
                    type="button"
                    onClick={() => {
                      closeIntro();
                      scrollToRank(index);
                    }}
                    className="group text-left"
                  >
                    <div className={`rounded-[1.5rem] bg-gradient-to-br ${rank.badge} p-4 ${rank.text} ring-1 ${rank.ring} transition group-hover:scale-[1.01]`}>
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-20 w-20 shrink-0 items-center justify-center ${
                            index === activeIndex ? "rank-emblem-pop" : ""
                          }`}
                        >
                          <RankEmblem variant={rank.emblem} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-80">
                            Tier {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3 className="mt-2 truncate font-display text-3xl uppercase leading-none">
                            {rank.name}
                          </h3>
                          <p className="mt-2 text-xs uppercase tracking-[0.22em] opacity-75">
                            {rank.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] opacity-80">
                        <span>{rank.milestone} points</span>
                        <span>Tap to jump</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-4 sm:p-5">
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    "1. Ajukan ranked request dari Start Ranked.",
                    "2. Cantumkan link debat private yang aktif.",
                    "3. Admin menonton dan menetapkan hasil match.",
                  ].map((item) => (
                    <div key={item} className="border-b border-black/8 pb-3 text-sm leading-6 text-black/65 last:border-b-0 last:pb-0 md:border-b-0 md:pb-0">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
