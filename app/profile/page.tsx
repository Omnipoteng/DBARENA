"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import ElectricBorder from "@/components/ElectricBorder";
import ImageCropper from "@/components/ImageCropper";
import {
  getProfileBannerVideoKey,
  loadProfileBannerVideo,
  saveProfileBannerVideo,
} from "@/lib/profile-banner-store";
import Navbar from "@/components/sections/navbar";

type BorderKey = "none" | "legend" | "mythic" | "apex";
type RankKey = "Recruit" | "Challenger" | "Vanguard" | "Legend" | "Mythic" | "Apex";
type EditorMode = "name" | "profile" | "border";

type BorderTheme = {
  label: string;
  description: string;
  ring: string;
  glow: string;
  electricColor: string;
  text: string;
};

type RankTheme = {
  title: RankKey;
  subtitle: string;
  emblem: number;
  accent: string;
};

type BannerCrop = { x: number; y: number; zoom: number };

type SavedProfile = {
  displayName: string;
  username: string;
  bio: string;
  avatarSrc: string;
  bannerSrc: string;
  bannerKind: "image" | "video";
  bannerFocus: number;
  bannerCrop?: BannerCrop | null;
  border: BorderKey;
  tags: string[];
};

type MatchEntry = {
  opponent: string;
  platform: string;
  result: "Win" | "Loss";
  delta: string;
  fromRank: RankKey;
  toRank: RankKey;
  date: string;
  image: string;
};

const STORAGE_KEY = "dbarena-profile-draft";

const borderThemes: Record<BorderKey, BorderTheme> = {
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

const rankThemes: Record<RankKey, RankTheme> = {
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

const profileStats = [
  { label: "Total Match", value: "184" },
  { label: "Ranked Points", value: "6,120" },
  { label: "Highest Rank", value: "Mythic" },
  { label: "Win Rate", value: "66%" },
];

const menuItems: Array<{ label: string; kind: "edit"; target: EditorMode }> = [
  { label: "Kustomisasi Border", kind: "edit", target: "border" },
  { label: "Kustomisasi Profil", kind: "edit", target: "profile" },
  { label: "Kustomisasi Nama", kind: "edit", target: "name" },
];

const matchEntries: MatchEntry[] = [
  {
    opponent: "Madara Uchiha",
    platform: "Discord",
    result: "Win",
    delta: "+32",
    fromRank: "Vanguard",
    toRank: "Legend",
    date: "Yesterday",
    image: "/images/1.jpg",
  },
  {
    opponent: "Gojo Satoru",
    platform: "WhatsApp",
    result: "Loss",
    delta: "-18",
    fromRank: "Legend",
    toRank: "Legend",
    date: "2 days ago",
    image: "/images/2.jpg",
  },
  {
    opponent: "Ichigo Kurosaki",
    platform: "Facebook",
    result: "Win",
    delta: "+25",
    fromRank: "Legend",
    toRank: "Mythic",
    date: "5 days ago",
    image: "/images/3.jpg",
  },
];

function resolveRank(points: number): RankKey {
  if (points >= 8500) return "Apex";
  if (points >= 6500) return "Mythic";
  if (points >= 4500) return "Legend";
  if (points >= 2500) return "Vanguard";
  if (points >= 1000) return "Challenger";
  return "Recruit";
}

function getRankProgress(points: number) {
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

function RankEmblem({ variant }: { variant: number }) {
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

function RankBadge({ rank }: { rank: RankKey }) {
  const theme = rankThemes[rank];
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border border-black/10 ${theme.accent} px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-black`}>
      <span className="h-2 w-2 rounded-full bg-black/70" />
      {theme.title}
    </div>
  );
}

function BorderSwatch({ border, active }: { border: BorderKey; active: boolean }) {
  const theme = borderThemes[border];
  return (
    <div className={`relative flex h-14 w-14 items-center justify-center rounded-full transition ${active ? "scale-105 ring-2 ring-black/35" : "ring-1 ring-black/10"}`}>
      <div className={`absolute inset-0 rounded-full opacity-95 blur-[1px] ${border !== "none" ? "animate-[spin_18s_linear_infinite]" : ""}`} style={{ backgroundImage: theme.ring }} />
      <div className="absolute inset-[4px] rounded-full border border-black/10 bg-white" />
      <div className="relative h-6 w-6 rounded-full bg-black/10" style={{ boxShadow: `0 0 18px ${theme.glow}` }} />
    </div>
  );
}

function EditorModal({
  mode,
  displayName,
  username,
  bio,
  avatarSrc,
  bannerSrc,
  bannerKind,
  bannerFocus,
  bannerCrop: initialBannerCrop,
  tags,
  selectedBorder,
  bannerPreviewUrl,
  onClose,
  onApply,
}: {
  mode: EditorMode;
  displayName: string;
  username: string;
  bio: string;
  avatarSrc: string;
  bannerSrc: string;
  bannerKind: "image" | "video";
  bannerFocus: number;
  bannerCrop?: BannerCrop | null;
  tags: string[];
  selectedBorder: BorderKey;
  bannerPreviewUrl?: string | null;
  onClose: () => void;
  onApply: (next: {
    displayName?: string;
    username?: string;
    bio?: string;
    avatarSrc?: string;
    bannerSrc?: string;
    bannerKind?: "image" | "video";
    bannerFocus?: number;
    bannerCrop?: BannerCrop | null;
    tags?: string[];
    border?: BorderKey;
    bannerFile?: File | null;
  }) => void;
}) {
  const [draftName, setDraftName] = useState(displayName);
  const [draftUsername, setDraftUsername] = useState(username);
  const [draftBio, setDraftBio] = useState(bio);
  const [draftAvatar, setDraftAvatar] = useState(avatarSrc);
  const [draftBanner, setDraftBanner] = useState(bannerPreviewUrl ?? (bannerKind === "video" ? "" : bannerSrc));
  const [draftBannerKind, setDraftBannerKind] = useState<"image" | "video">(bannerKind);
  const [draftBannerFocus, setDraftBannerFocus] = useState(bannerFocus);
  const [draftBannerCrop, setDraftBannerCrop] = useState<BannerCrop | null>(initialBannerCrop ?? null);
  const [draftTags, setDraftTags] = useState(tags);
  const [nextTag, setNextTag] = useState("");
  const [draftBorder, setDraftBorder] = useState<BorderKey>(selectedBorder);
  const [draftBannerFile, setDraftBannerFile] = useState<File | null>(null);
  const draftBannerFileRef = useRef<File | null>(null); // always holds the latest value, safe to read in async closures
  const [draftBannerObjectUrl, setDraftBannerObjectUrl] = useState<string | null>(null);
  const [cropTargetUrl, setCropTargetUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    target: "avatar" | "banner";
    label: string;
    progress: number;
  } | null>(null);
  const progressTimersRef = useRef<number[]>([]);
  const previewTheme = borderThemes[draftBorder];

  const title =
    mode === "border" ? "Kustomisasi Border" : mode === "profile" ? "Kustomisasi Profil" : "Kustomisasi Nama";

  // No re-encoding needed — videos are stored and played as-is (original quality / fps).
  // Crop is applied via CSS transforms at display time.

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, target: "avatar" | "banner") => {
    const file = event.target.files?.[0];
    if (!file) return;

    progressTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    progressTimersRef.current = [];

    const queueProgress = (updates: Array<{ delay: number; progress: number }>, done?: () => void) => {
      setUploadProgress({
        target,
        label: target === "banner" ? (file.type.startsWith("video/") ? "Mengolah video banner" : "Mengunggah banner") : "Mengunggah foto profil",
        progress: updates[0]?.progress ?? 0,
      });

      updates.forEach((update, index) => {
        const timer = window.setTimeout(() => {
          setUploadProgress({
            target,
            label: target === "banner" ? (file.type.startsWith("video/") ? "Mengolah video banner" : "Mengunggah banner") : "Mengunggah foto profil",
            progress: update.progress,
          });

          if (index === updates.length - 1) {
            done?.();
          }
        }, update.delay);
        progressTimersRef.current.push(timer);
      });
    };

    if (target === "banner") {
      setDraftBannerFile(null);
      draftBannerFileRef.current = null;
      setDraftBannerObjectUrl(null);
    }

    const isVideo = target === "banner" && file.type.startsWith("video/");

    if (isVideo) {
      // Check duration before opening cropper — reject videos longer than 10 seconds.
      const tempUrl = URL.createObjectURL(file);
      const tempEl = document.createElement("video");
      tempEl.preload = "metadata";
      tempEl.src = tempUrl;
      tempEl.onloadedmetadata = () => {
        URL.revokeObjectURL(tempUrl);
        if (tempEl.duration > 10) {
          setUploadProgress({
            target: "banner",
            label: "⚠️ Video terlalu panjang! Maksimal 10 detik.",
            progress: 100,
          });
          window.setTimeout(() => setUploadProgress(null), 3500);
        } else {
          const previewUrl = URL.createObjectURL(file);
          setDraftBannerKind("video");
          setDraftBannerFile(file);
          draftBannerFileRef.current = file; // update ref immediately so onCropVideo closure sees the correct file
          setCropTargetUrl(previewUrl);
        }
      };
      tempEl.onerror = () => {
        URL.revokeObjectURL(tempUrl);
        setUploadProgress({
          target: "banner",
          label: "Gagal memuat video. Coba file lain.",
          progress: 100,
        });
        window.setTimeout(() => setUploadProgress(null), 3000);
      };
      return;
    }

    if (target === "banner") {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCropTargetUrl(reader.result);
          setDraftBannerKind("image");
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const value = Math.min(95, Math.max(8, Math.round((event.loaded / event.total) * 82)));
      setUploadProgress({
        target,
        label: "Mengunggah foto profil",
        progress: value,
      });
    };
    reader.onerror = () => {
      setUploadProgress(null);
    };
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraftAvatar(reader.result);
        queueProgress(
          [
            { delay: 0, progress: 84 },
            { delay: 220, progress: 100 },
          ],
          () => {
            const doneTimer = window.setTimeout(() => setUploadProgress(null), 500);
            progressTimersRef.current.push(doneTimer);
          },
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    const value = nextTag.trim();
    if (!value) return;
    setDraftTags((current) => Array.from(new Set([...current, value])).slice(0, 6));
    setNextTag("");
  };

  const removeTag = (tag: string) => {
    setDraftTags((current) => current.filter((item) => item !== tag));
  };

  const focusStyle = (focus: number) => ({ objectPosition: `50% ${focus}%` });

  useEffect(() => {
    return () => {
      if (draftBannerObjectUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(draftBannerObjectUrl);
      }
      progressTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, [draftBannerObjectUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-6">
      <div className="max-h-[calc(100vh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-[24px] border border-black/10 bg-white p-4 shadow-[0_30px_120px_rgba(0,0,0,0.22)] sm:max-h-[calc(100vh-3rem)] sm:p-5">
        <div className="flex items-start justify-between gap-3 border-b border-black/8 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/35 sm:text-[11px]">Profile settings</p>
            <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-black sm:text-3xl">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 bg-black px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 sm:text-sm"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-4 sm:mt-5">
          {mode === "name" ? (
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 sm:text-xs">Display name</span>
                <input
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-black/25 focus:border-black/30 sm:h-12"
                  placeholder="Your display name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 sm:text-xs">Username</span>
                <input
                  value={draftUsername}
                  onChange={(event) => setDraftUsername(event.target.value)}
                  className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-black/25 focus:border-black/30 sm:h-12"
                  placeholder="@username"
                />
              </label>
            </div>
          ) : null}

          {mode === "profile" ? (
            <div className="grid gap-4">
              <div className="grid gap-2 rounded-[22px] border border-black/8 bg-black/[0.03] p-3 sm:rounded-[24px] sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.32em] text-black/35 sm:text-[11px]">Banner preview</p>
                <div className="relative h-20 w-full overflow-hidden rounded-[18px] border border-black/8 bg-white sm:h-24 sm:rounded-[20px]">
                  {draftBanner ? (
                    draftBannerKind === "video" ? (
                      <video
                        src={draftBanner}
                        className="absolute inset-0 h-full w-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : (
                      <Image
                        src={draftBanner}
                        alt="Banner preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        unoptimized
                        className="object-cover"
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,_#111111_0%,_#d9d9d7_45%,_#f7f5ef_100%)]" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[22px] border border-black/8 bg-black/[0.03] p-3 sm:gap-4 sm:rounded-[24px] sm:p-4">
                <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
                  {draftBorder === "none" ? (
                    <div className="relative h-full w-full overflow-hidden rounded-full border border-black/10 bg-white">
                      <Image
                        src={draftAvatar}
                        alt="Avatar preview"
                        fill
                        sizes="80px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <ElectricBorder
                      color={previewTheme.electricColor}
                      speed={1}
                      chaos={0.12}
                      borderRadius={999}
                      className="h-full w-full"
                    >
                      <div className="relative h-full w-full rounded-full bg-white p-1">
                        <div className="relative h-full w-full overflow-hidden rounded-full border border-black/10 bg-white">
                          <Image
                            src={draftAvatar}
                            alt="Avatar preview"
                            fill
                            sizes="80px"
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </ElectricBorder>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-black/35 sm:text-[11px]">Preview</p>
                  <p className="mt-2 text-sm text-black/65">
                    Upload foto profile baru untuk testing border dan avatar.
                  </p>
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 sm:text-xs">Banner photo</span>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-white px-3 py-3">
                  <span className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold text-white">
                    Ambil foto/video
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-black/55">
                    {draftBanner ? "Banner sudah dipilih" : "Pilih file untuk banner"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(event) => handleImageUpload(event, "banner")}
                    className="sr-only"
                  />
                </label>
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/35">
                  Bisa upload foto atau video untuk banner
                </p>
              </div>
              <div className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 sm:text-xs">Profile photo</span>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-white px-3 py-3">
                  <span className="inline-flex h-10 items-center justify-center rounded-full bg-black px-4 text-xs font-semibold text-white">
                    Ambil foto
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-black/55">
                    {draftAvatar ? "Foto profile sudah dipilih" : "Pilih file untuk profile"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageUpload(event, "avatar")}
                    className="sr-only"
                  />
                </label>
              </div>

              {uploadProgress ? (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4 backdrop-blur-md">
                  <div className="w-full max-w-sm rounded-[32px] border border-white/10 bg-zinc-950 p-6 text-center text-white shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                      <svg
                        className="h-6 w-6 animate-bounce text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </div>
                    <h4 className="mt-4 font-semibold text-lg text-white">{uploadProgress.label}</h4>
                    <p className="mt-2 text-xs text-white/55 font-normal">Harap tunggu sebentar...</p>
                    
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                        <span>Proses</span>
                        <span className="font-semibold">{uploadProgress.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-white via-zinc-400 to-zinc-600 transition-all duration-300"
                          style={{ width: `${uploadProgress.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {cropTargetUrl ? (
                <ImageCropper
                  mediaSrc={cropTargetUrl}
                  mediaType={draftBannerKind}
                  onCancel={() => setCropTargetUrl(null)}
                  onCropImage={(croppedBase64) => {
                    setCropTargetUrl(null);
                    setUploadProgress({
                      target: "banner",
                      label: "Mengunggah hasil crop banner",
                      progress: 0,
                    });
                    let progress = 0;
                    const interval = setInterval(() => {
                      progress += 20;
                      setUploadProgress({
                        target: "banner",
                        label: "Mengunggah hasil crop banner",
                        progress: Math.min(100, progress),
                      });
                      if (progress >= 100) {
                        clearInterval(interval);
                        setDraftBannerKind("image");
                        setDraftBanner(croppedBase64);
                        setDraftBannerFile(null);
                        setTimeout(() => setUploadProgress(null), 300);
                      }
                    }, 60);
                  }}
                  onCropVideo={({ cropX, cropY, cropZoom }) => {
                    setCropTargetUrl(null);
                    // Store crop params; original file remains untouched (no re-encoding).
                    setDraftBannerCrop({ x: cropX, y: cropY, zoom: cropZoom });
                    const file = draftBannerFileRef.current; // use ref to avoid stale closure
                    if (file) {
                      const previewUrl = URL.createObjectURL(file);
                      setDraftBanner(previewUrl);
                      setDraftBannerObjectUrl(previewUrl);
                    }
                  }}
                />
              ) : null}

              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 sm:text-xs">Bio</span>
                <textarea
                  value={draftBio}
                  onChange={(event) => setDraftBio(event.target.value)}
                  className="min-h-24 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/25 focus:border-black/30 sm:min-h-28"
                  placeholder="Tulis bio profil kamu"
                />
              </label>

              <div className="grid gap-3 rounded-[22px] border border-black/8 bg-black/[0.03] p-3 sm:rounded-[24px] sm:p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 sm:text-xs">Tags</p>
                    <p className="mt-1 text-sm text-black/55">Tambah tag profil seperti lokasi, role, atau fokus debat.</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-black/35">{draftTags.length}/6</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {draftTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/75 transition hover:bg-black hover:text-white"
                    >
                      {tag}
                      <span className="text-[10px]">×</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    value={nextTag}
                    onChange={(event) => setNextTag(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addTag();
                      }
                    }}
                    className="h-10 min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-black/25 focus:border-black/30 sm:h-11"
                    placeholder="Tambah tag baru"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-black px-4 text-xs font-semibold text-white transition hover:opacity-90 sm:h-11 sm:text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {mode === "border" ? (
            <div className="grid gap-3">
              {(["none", "legend", "mythic", "apex"] as BorderKey[]).map((border) => {
                const theme = borderThemes[border];
                const active = draftBorder === border;

                return (
                  <button
                    key={border}
                    type="button"
                    onClick={() => setDraftBorder(border)}
                    className={`flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-black/30 bg-black/[0.04]"
                        : "border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.02]"
                    }`}
                  >
                    <BorderSwatch border={border} active={active} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-black">{theme.label}</p>
                        <span className="text-[10px] uppercase tracking-[0.35em] text-black/35">
                          {active ? "Active" : "Select"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-black/50">{theme.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-black/75 transition hover:border-black/20 hover:bg-black/[0.03]"
          >
            Cancel
          </button>
              <button
                type="button"
                onClick={() => {
                  onApply(
                    mode === "name"
                  ? { displayName: draftName, username: draftUsername }
                      : mode === "profile"
                        ? {
                            bio: draftBio,
                            avatarSrc: draftAvatar,
                            bannerSrc: draftBannerKind === "video" ? getProfileBannerVideoKey() : draftBanner,
                            bannerKind: draftBannerKind,
                            bannerFocus: draftBannerFocus,
                            bannerCrop: draftBannerCrop,
                            tags: draftTags,
                            bannerFile: draftBannerKind === "video" ? draftBannerFileRef.current : null,
                          }
                        : { border: draftBorder },
                  );
                  onClose();
                }}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const defaultProfile = {
  displayName: "DBA Reign",
  username: "@dba.reign",
  bio: "Battleboarding profile untuk DBARENA dengan border rank, progress, dan riwayat match yang tetap terasa seperti akun kompetitif modern.",
  avatarSrc: "/images/staff/staff-1.svg",
  bannerSrc: "",
  bannerKind: "image" as const,
  bannerFocus: 50,
  border: "legend" as BorderKey,
  tags: ["Indonesia / Surabaya", "Scaler", "Boruto"],
};

  const [displayName, setDisplayName] = useState(defaultProfile.displayName);
  const [username, setUsername] = useState(defaultProfile.username);
  const [bio, setBio] = useState(defaultProfile.bio);
  const [avatarSrc, setAvatarSrc] = useState(defaultProfile.avatarSrc);
  const [bannerSrc, setBannerSrc] = useState(defaultProfile.bannerSrc);
  const [bannerKind, setBannerKind] = useState<"image" | "video">(defaultProfile.bannerKind);
  const [bannerFocus, setBannerFocus] = useState(defaultProfile.bannerFocus);
  const [bannerCrop, setBannerCrop] = useState<BannerCrop | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [selectedBorder, setSelectedBorder] = useState<BorderKey>(defaultProfile.border);
  const [tags, setTags] = useState<string[]>(defaultProfile.tags);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode | null>(null);
  const [loaded, setLoaded] = useState(false);

  const rankedPoints = 6120;
  const currentRank = resolveRank(rankedPoints);
  const rankTheme = rankThemes[currentRank];
  const borderTheme = borderThemes[selectedBorder];
  const rankProgress = getRankProgress(rankedPoints);

  useEffect(() => {
    let cancelled = false;
    let fallbackFrame = 0;

    const hydrateProfile = async () => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<SavedProfile>;

          if (typeof parsed.displayName === "string") setDisplayName(parsed.displayName);
          if (typeof parsed.username === "string") setUsername(parsed.username);
          if (typeof parsed.bio === "string") setBio(parsed.bio);
          if (typeof parsed.avatarSrc === "string") setAvatarSrc(parsed.avatarSrc);
          if (typeof parsed.bannerKind === "string" && (parsed.bannerKind === "video" || parsed.bannerKind === "image")) {
            setBannerKind(parsed.bannerKind);
          }
          if (typeof parsed.bannerFocus === "number") setBannerFocus(parsed.bannerFocus);
          if (parsed.bannerCrop && typeof parsed.bannerCrop.x === "number") setBannerCrop(parsed.bannerCrop);
          if (parsed.border && ["none", "legend", "mythic", "apex"].includes(parsed.border)) {
            setSelectedBorder(parsed.border);
          }
          if (Array.isArray(parsed.tags)) {
            setTags(parsed.tags.filter((item): item is string => typeof item === "string"));
          }

          if (typeof parsed.bannerSrc === "string") {
            if (
              parsed.bannerKind === "video" &&
              parsed.bannerSrc === getProfileBannerVideoKey()
            ) {
              const blob = await loadProfileBannerVideo();
              if (!cancelled) {
                setBannerSrc(getProfileBannerVideoKey());
                if (blob) {
                  const objectUrl = URL.createObjectURL(blob);
                  setBannerPreviewUrl(objectUrl);
                }
              }
            } else if (parsed.bannerKind === "video" && parsed.bannerSrc.startsWith("data:video/")) {
              const blob = await fetch(parsed.bannerSrc).then((response) => response.blob());
              if (!cancelled) {
                await saveProfileBannerVideo(blob);
                const objectUrl = URL.createObjectURL(blob);
                setBannerPreviewUrl(objectUrl);
                setBannerSrc(getProfileBannerVideoKey());
              }
            } else {
              setBannerSrc(parsed.bannerSrc);
              setBannerPreviewUrl(null);
            }
          }
        }
      } catch {
        // ignore malformed draft
      }

      if (!cancelled) {
        fallbackFrame = window.requestAnimationFrame(() => setLoaded(true));
      }
    };

    void hydrateProfile();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(fallbackFrame);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          displayName,
          username,
          bio,
          avatarSrc,
          bannerSrc,
          bannerKind,
          bannerFocus,
          border: selectedBorder,
          tags,
        } satisfies SavedProfile),
      );
    } catch {
      // ignore storage quota issues so profile edits don't break
    }
  }, [avatarSrc, bannerFocus, bannerKind, bannerSrc, bio, displayName, loaded, selectedBorder, tags, username]);

  useEffect(() => {
    return () => {
      if (bannerPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreviewUrl);
      }
    };
  }, [bannerPreviewUrl]);

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-black">
      <Navbar />

      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">

        <section className="mt-6 overflow-hidden rounded-[32px] border border-black/8 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="relative h-36 overflow-hidden border-b border-black/8 sm:h-44 lg:h-48">
            {bannerKind === "video" && bannerPreviewUrl ? (
              <video
                src={bannerPreviewUrl}
                className="absolute inset-0 h-full w-full"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  objectFit: "cover",
                  ...(bannerCrop ? {
                    objectPosition: `${bannerCrop.x}% ${bannerCrop.y}%`,
                    transform: bannerCrop.zoom > 1 ? `scale(${bannerCrop.zoom})` : undefined,
                    transformOrigin: `${bannerCrop.x}% ${bannerCrop.y}%`,
                  } : {}),
                }}
              />
            ) : bannerSrc ? (
                <Image
                  src={bannerSrc}
                  alt="Profile banner"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1280px"
                  unoptimized
                  className="object-cover"
                  style={{ objectPosition: bannerSrc.startsWith("data:") ? "50% 50%" : `50% ${bannerFocus}%` }}
                />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,_#111111_0%,_#d9d9d7_45%,_#f7f5ef_100%)]" />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.55)_0%,_transparent_42%),radial-gradient(circle_at_80%_0%,_rgba(25,215,255,0.22)_0%,_transparent_35%)]" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.6)_100%)]" />
          </div>

          <div className="relative px-5 pb-5 sm:px-6">
            <div className="-mt-14 flex flex-col gap-5 lg:-mt-18 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
                <div className="relative h-36 w-36 shrink-0 lg:h-44 lg:w-44">
                  {selectedBorder === "none" ? (
                    <div className="relative h-full w-full overflow-hidden rounded-full border-[4px] border-black/12 bg-white">
                      <Image
                        src={avatarSrc}
                        alt="Profile avatar preview"
                        fill
                        sizes="208px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <ElectricBorder
                      color={borderTheme.electricColor}
                      speed={1}
                      chaos={0.12}
                      borderRadius={999}
                      className="h-full w-full"
                    >
                      <div className="relative h-full w-full rounded-full bg-white p-1.5">
                        <div className="relative h-full w-full overflow-hidden rounded-full border-[4px] border-black/12 bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)]">
                          <Image
                            src={avatarSrc}
                            alt="Profile avatar preview"
                            fill
                            sizes="208px"
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </ElectricBorder>
                  )}
                  <div
                    className="absolute -bottom-3 left-1/2 z-10 h-12 w-12 -translate-x-1/2 rounded-full border border-black/10 bg-white p-1.5 shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
                    style={selectedBorder !== "none" ? { boxShadow: `0 0 34px ${borderTheme.glow}` } : undefined}
                  >
                    <RankEmblem variant={rankTheme.emblem} />
                  </div>
                </div>

                <div className="min-w-0 pb-1 pt-3 sm:pt-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-black sm:text-4xl">
                      {displayName}
                    </h2>
                    <div className="flex items-center gap-2">
                      <RankBadge rank={currentRank} />
                      <div className="relative sm:hidden">
                        <button
                          type="button"
                          onClick={() => setMenuOpen((value) => !value)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-lg font-semibold text-black transition hover:bg-black hover:text-white"
                          aria-label="Open profile menu"
                        >
                          ⋮
                        </button>

                        {menuOpen ? (
                          <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-[22px] border border-black/10 bg-white p-2 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
                            {menuItems.map((item) => (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => {
                                  setEditorMode(item.target);
                                  setMenuOpen(false);
                                }}
                                className="flex h-11 w-full items-center rounded-2xl px-4 text-left text-sm text-black/70 transition hover:bg-black/[0.04] hover:text-black"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <p className="mt-1 text-sm leading-none text-black/55">{username}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-black/65">{bio}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/70">
                        {tag}
                      </span>
                    ))}
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70">
                      Border: {borderTheme.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative hidden self-start sm:block">
                <button
                  type="button"
                  onClick={() => setMenuOpen((value) => !value)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-xl font-semibold text-black transition hover:bg-black hover:text-white"
                  aria-label="Open profile menu"
                >
                  ⋮
                </button>

                {menuOpen ? (
                  <div className="absolute right-0 top-13 z-20 w-64 rounded-[22px] border border-black/10 bg-white p-2 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
                    {menuItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                          setEditorMode(item.target);
                          setMenuOpen(false);
                        }}
                        className="flex h-11 w-full items-center rounded-2xl px-4 text-left text-sm text-black/70 transition hover:bg-black/[0.04] hover:text-black"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-black/8 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Overview
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-black">Account summary</h3>
              </div>
              <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/55">
                DBA profile
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {profileStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-black/8 bg-black/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-black">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[26px] border border-black/8 bg-gradient-to-br from-black/[0.02] to-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Featured rank
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className={`rounded-full p-4 ${rankTheme.accent}`}>
                  <div className="h-24 w-24">
                    <RankEmblem variant={rankTheme.emblem} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-4xl uppercase tracking-[0.08em] text-black">
                    {rankTheme.title}
                  </p>
                  <p className="mt-2 text-sm text-black/55">{rankTheme.subtitle}</p>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-black/65">
                    Border rank, statistik, dan match history disusun seperti akun sosial kompetitif yang
                    tetap fokus ke battleboarding DBA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-black/8 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                  Quick view
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-black">Live status</h3>
              </div>
              <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/55">
                {currentRank}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { title: "Border", value: borderTheme.label },
                { title: "Ranked points", value: rankedPoints.toString() },
                { title: "Win rate", value: profileStats[3].value },
                { title: "Focus", value: "AP / Speed" },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-2xl border border-black/8 bg-black/[0.02] px-4 py-4">
                  <span className="text-xs uppercase tracking-[0.28em] text-black/35">{item.title}</span>
                  <span className="text-sm font-semibold text-black">{item.value}</span>
                </div>
              ))}
            </div>

            <Link
              href="/ranked"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Open ranked ladder
            </Link>
            <Link
              href="/friends"
              className="mt-3 inline-flex h-11 w-full items-center justify-center border border-black/10 bg-white px-4 text-sm font-semibold text-black transition hover:bg-black/5"
            >
              Find friends
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-black/8 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Rank stat
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-black">Current rank</h3>
            </div>
            <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/55">
              {rankProgress.current} → {rankProgress.next}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">Current rank</p>
              <p className="mt-2 text-lg font-semibold text-black">{rankTheme.title}</p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">Highest rank</p>
              <p className="mt-2 text-lg font-semibold text-black">Mythic</p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">Total match</p>
              <p className="mt-2 text-lg font-semibold text-black">{profileStats[0].value}</p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-4">
              <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">Win rate</p>
              <p className="mt-2 text-lg font-semibold text-black">{profileStats[3].value}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="h-3 rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-black via-slate-500 to-slate-300 transition-all duration-500"
                style={{ width: `${rankProgress.progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-black/45">
              <span>0</span>
              <span>{rankedPoints}</span>
              <span>8500+</span>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[30px] border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-black/8 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Recent match
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-black">Match history</h3>
            </div>
            <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/55">
              Private battle logs
            </span>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            {matchEntries.map((match) => (
              <article key={`${match.opponent}-${match.date}`} className="overflow-hidden rounded-[26px] border border-black/8 bg-black/[0.02]">
                <div className="relative aspect-[4/3] bg-black/5">
                  <Image
                    src={match.image}
                    alt={`${match.opponent} match preview`}
                    fill
                    sizes="(max-width: 1280px) 100vw, 33vw"
                    className="object-cover grayscale contrast-110"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-black">{match.opponent}</p>
                      <p className="mt-1 text-xs text-black/45">
                        {match.platform} - {match.date}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] ${match.result === "Win" ? "bg-black text-white" : "bg-black/10 text-black/60"}`}>
                      {match.result}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-black/8 bg-white p-3">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">Progress</p>
                      <p className="mt-2 text-sm font-semibold text-black">
                        {match.fromRank} → {match.toRank}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-black/8 bg-white p-3">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">Points change</p>
                      <p className="mt-2 text-sm font-semibold text-black">{match.delta}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {editorMode ? (
          <EditorModal
            mode={editorMode}
            displayName={displayName}
            username={username}
            bio={bio}
            avatarSrc={avatarSrc}
            bannerSrc={bannerSrc}
            bannerKind={bannerKind}
            bannerFocus={bannerFocus}
            bannerCrop={bannerCrop}
            tags={tags}
            selectedBorder={selectedBorder}
            bannerPreviewUrl={bannerPreviewUrl}
            onClose={() => setEditorMode(null)}
            onApply={async (next) => {
              if (typeof next.displayName === "string") setDisplayName(next.displayName);
              if (typeof next.username === "string") setUsername(next.username);
              if (typeof next.bio === "string") setBio(next.bio);
              if (typeof next.avatarSrc === "string") setAvatarSrc(next.avatarSrc);
              if (next.bannerKind === "video") {
                if (next.bannerFile) {
                  try {
                    // Save the ORIGINAL uncompressed file — no re-encoding, preserves all fps/quality.
                    await saveProfileBannerVideo(next.bannerFile);
                    const previewUrl = URL.createObjectURL(next.bannerFile);
                    setBannerPreviewUrl(previewUrl);
                    setBannerSrc(getProfileBannerVideoKey());
                    setBannerKind("video");
                  } catch {
                    // Keep the profile usable even if IndexedDB is not available.
                  }
                } else {
                  setBannerKind("video");
                }
                // Always update crop params when video banner is applied.
                if (next.bannerCrop !== undefined) setBannerCrop(next.bannerCrop ?? null);
              } else if (typeof next.bannerSrc === "string") {
                setBannerSrc(next.bannerSrc);
                setBannerPreviewUrl(null);
                setBannerKind("image");
                setBannerCrop(null);
              }
              if (typeof next.bannerFocus === "number") setBannerFocus(next.bannerFocus);
              if (Array.isArray(next.tags)) setTags(next.tags);
              if (next.border) setSelectedBorder(next.border);
            }}
          />
        ) : null}

        {menuOpen ? (
          <button
            type="button"
            aria-label="Close menu backdrop"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-10 bg-transparent"
          />
        ) : null}
      </main>
    </div>
  );
}
