"use client";

import Image from "next/image";
import Link from "next/link"; 
import { useEffect, useRef, useState, type ChangeEvent, Suspense } from "react"; 
import { useRouter, useSearchParams } from "next/navigation";
import ElectricBorder from "@/components/ElectricBorder"; 
import ImageCropper from "@/components/ImageCropper"; 
import GradientText from "@/components/gradient-text";
import {
  getProfileBannerVideoKey,
  loadProfileBannerVideo,
  saveProfileBannerVideo,
} from "@/lib/profile-banner-store";
import { setDbaUserKey } from "@/lib/dba-user";
import Navbar from "@/components/sections/navbar"; 
import { getSupabaseAuthClient } from "@/lib/supabase-auth";
import {
  loadSupabaseOnboardingPreferences,
  loadSupabaseProfileSnapshot,
  loadSupabaseRankedMatches,
  loadSupabaseSocialCounts,
  saveSupabaseProfileSnapshot,
} from "@/lib/supabase-store";

type BorderKey = "none" | "legend" | "mythic" | "apex";
type RankKey = "Recruit" | "Challenger" | "Vanguard" | "Legend" | "Mythic" | "Apex";
type EditorMode = "name" | "profile" | "border" | "skin";
type SkinKey = "none" | "sunset" | "neon" | "ocean" | "emerald" | "cosmic";
type AccessState = "loading" | "guest" | "onboarding" | "ready";

type SkinTheme = {
  label: string;
  description: string;
  colors: string[];
};

const skinThemes: Record<SkinKey, SkinTheme> = {
  none: {
    label: "No Skin",
    description: "Standard solid color name text.",
    colors: ["#000000", "#000000"],
  },
  sunset: {
    label: "Sunset Glow",
    description: "Warm gradient inspired by sunset hues.",
    colors: ["#ff7e5f", "#feb47b", "#ff7e5f"],
  },
  neon: {
    label: "Neon Dreams",
    description: "Vibrant electric pink, violet, and purple.",
    colors: ["#5227FF", "#FF9FFC", "#B497CF"],
  },
  ocean: {
    label: "Ocean Breeze",
    description: "Deep sea cyan and electric blue.",
    colors: ["#00c6ff", "#0072ff", "#00c6ff"],
  },
  emerald: {
    label: "Emerald Rush",
    description: "Rich mint and bright emerald green.",
    colors: ["#11998e", "#38ef7d", "#11998e"],
  },
  cosmic: {
    label: "Cosmic Flare",
    description: "Fiery orange, scarlet, and magenta.",
    colors: ["#833ab4", "#fd1d1d", "#fcb045"],
  },
};

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

type MatchEntry = {
  opponent: string;
  platform: string;
  result: "Win" | "Loss" | "Draw" | "No Contest";
  delta: string;
  fromRank: RankKey;
  toRank: RankKey;
  date: string;
  image: string;
};

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

const menuItems: Array<{ label: string; kind: "edit"; target: EditorMode }> = [
  { label: "Kustomisasi Border", kind: "edit", target: "border" },
  { label: "Kustomisasi Profil", kind: "edit", target: "profile" },
  { label: "Kustomisasi Nama", kind: "edit", target: "name" },
  { label: "Kustomisasi Skin", kind: "edit", target: "skin" },
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
  website,
  selectedBorder,
  selectedSkin,
  customSkinColors,
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
  website: string;
  selectedBorder: BorderKey;
  selectedSkin: SkinKey;
  customSkinColors: string[];
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
    website?: string;
    border?: BorderKey;
    skin?: SkinKey;
    customSkinColors?: string[];
    bannerFile?: File | null;
  }) => void;
}) {
  const [draftName, setDraftName] = useState(displayName);
  const [draftWebsite, setDraftWebsite] = useState(website);
  const [draftUsername, setDraftUsername] = useState(username);
  const [draftBio, setDraftBio] = useState(bio);
  const [draftAvatar, setDraftAvatar] = useState(avatarSrc);
  const [draftBanner, setDraftBanner] = useState(bannerPreviewUrl ?? (bannerKind === "video" ? "" : bannerSrc));
  const [draftBannerKind, setDraftBannerKind] = useState<"image" | "video">(bannerKind);
  const [draftBannerFocus] = useState(bannerFocus);
  const [draftBannerCrop, setDraftBannerCrop] = useState<BannerCrop | null>(initialBannerCrop ?? null);
  const [draftTags, setDraftTags] = useState(tags);
  const [nextTag, setNextTag] = useState("");
  const [draftBorder, setDraftBorder] = useState<BorderKey>(selectedBorder);
  const [draftSkin, setDraftSkin] = useState<SkinKey>(selectedSkin);
  const [draftCustomSkinColors, setDraftCustomSkinColors] = useState<string[]>(customSkinColors);
  const draftBannerFileRef = useRef<File | null>(null);
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
    mode === "border" ? "Kustomisasi Border" : mode === "profile" ? "Kustomisasi Profil" : mode === "skin" ? "Kustomisasi Skin" : "Kustomisasi Nama";

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
            label: "Video terlalu panjang! Maksimal 10 detik.",
            progress: 100,
          });
          window.setTimeout(() => setUploadProgress(null), 3500);
        } else {
          const previewUrl = URL.createObjectURL(file);
          setDraftBannerKind("video");
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
                        draftBannerFileRef.current = null;
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

              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 sm:text-xs">Website (Opsional)</span>
                <input
                  type="text"
                  value={draftWebsite}
                  onChange={(event) => setDraftWebsite(event.target.value)}
                  className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-black/25 focus:border-black/30 sm:h-12"
                  placeholder="https://example.com"
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

          {mode === "skin" ? (
            <div className="grid gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 sm:text-xs mb-3">Pilih Preset Skin</p>
                <div className="grid gap-3">
                  {(["none", "sunset", "neon", "ocean", "emerald", "cosmic"] as SkinKey[]).map((skin) => {
                    const theme = skinThemes[skin];
                    const active = draftSkin === skin;

                    return (
                      <button
                        key={skin}
                        type="button"
                        onClick={() => {
                          setDraftSkin(skin);
                          setDraftCustomSkinColors(theme.colors);
                        }}
                        className={`flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                          active
                            ? "border-black/30 bg-black/[0.04]"
                            : "border-black/10 bg-white hover:border-black/20 hover:bg-black/[0.02]"
                        }`}
                      >
                        <div className="flex gap-2 shrink-0">
                          {theme.colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="h-8 w-8 rounded-lg border border-black/10"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
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
              </div>

              <div className="pt-4 border-t border-black/8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 sm:text-xs mb-3">Custom Warna Gradient</p>
                <div className="grid gap-3">
                  {draftCustomSkinColors.map((color, idx) => (
                    <label key={idx} className="grid gap-2">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-black/40">Warna {idx + 1}</span>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...draftCustomSkinColors];
                            newColors[idx] = e.target.value;
                            setDraftCustomSkinColors(newColors);
                          }}
                          className="h-12 w-16 rounded-xl border border-black/10 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...draftCustomSkinColors];
                            newColors[idx] = e.target.value;
                            setDraftCustomSkinColors(newColors);
                          }}
                          className="h-11 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-sm text-black outline-none transition placeholder:text-black/25 focus:border-black/30"
                          placeholder="#000000"
                        />
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-4 rounded-[22px] border border-black/8 bg-black/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-black/35 mb-2 sm:text-[11px]">Preview</p>
                  <GradientText
                    colors={draftCustomSkinColors}
                    direction="horizontal"
                    animationSpeed={8}
                    className="w-full py-3 text-lg"
                  >
                    Preview Gradient Text
                  </GradientText>
                </div>
              </div>
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
                            website: draftWebsite,
                            bannerFile: draftBannerKind === "video" ? draftBannerFileRef.current : null,
                          }
                        : mode === "border"
                          ? { border: draftBorder }
                          : { skin: draftSkin, customSkinColors: draftCustomSkinColors },
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
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarSrc, setAvatarSrc] = useState("");
  const [bannerSrc, setBannerSrc] = useState("");
  const [bannerKind, setBannerKind] = useState<"image" | "video">("image");
  const [bannerFocus, setBannerFocus] = useState(50);
  const [bannerCrop, setBannerCrop] = useState<BannerCrop | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [selectedBorder, setSelectedBorder] = useState<BorderKey>("legend");
  const [tags, setTags] = useState<string[]>([]);
  const [rankKey, setRankKey] = useState<RankKey>("Recruit");
  const [rankedPoints, setRankedPoints] = useState(0);
  const [highestRank, setHighestRank] = useState("Recruit");
  const [totalMatch, setTotalMatch] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [recentMatches, setRecentMatches] = useState<MatchEntry[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<EditorMode | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [accessState, setAccessState] = useState<AccessState>("loading");
  const [activeTab, setActiveTab] = useState<"activity" | "debates" | "achievements" | "inventory" | "perks">("activity");
  const [userLocation, setUserLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [socialCounts, setSocialCounts] = useState({ following: 0, followers: 0, friends: 0 });
  const [selectedSkin, setSelectedSkin] = useState<SkinKey>("none");
  const [customSkinColors, setCustomSkinColors] = useState<string[]>(["#000000", "#000000"]);

  const currentRank = rankKey || resolveRank(rankedPoints);
  const rankTheme = rankThemes[currentRank];
  const borderTheme = borderThemes[selectedBorder];
  const rankProgress = getRankProgress(rankedPoints);
  const profileStats = [
    { label: "Total Match", value: totalMatch.toLocaleString("en-US") },
    { label: "Ranked Points", value: new Intl.NumberFormat("en-US").format(rankedPoints) },
    { label: "Highest Rank", value: highestRank },
    { label: "Win Rate", value: `${Number.isFinite(winRate) ? winRate.toFixed(0) : "0"}%` },
  ];

  useEffect(() => {
    let cancelled = false;
    let fallbackFrame = 0;

    const hydrateProfile = async () => {
      const supabase = getSupabaseAuthClient();
      if (!supabase) {
        if (!cancelled) {
          setAccessState("guest");
          setLoaded(true);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        if (!cancelled) {
          setAccessState("guest");
          setLoaded(true);
        }
        return;
      }

      setDbaUserKey(user.id);

      const remote = await loadSupabaseProfileSnapshot();
      if (!remote) {
        const fallbackDisplayName = (user.user_metadata?.display_name as string | undefined)?.trim() || "Member";
        const fallbackUsername = (user.user_metadata?.username as string | undefined)?.replace(/^@/, "").trim() || "member";

        const seededProfile = {
          displayName: fallbackDisplayName,
          username: fallbackUsername,
          bio: "",
          avatarSrc: "",
          bannerSrc: "",
          bannerKind: "image" as const,
          bannerFocus: 50,
          bannerCrop: null,
          border: "none" as const,
          tags: [] as string[],
          rankKey: "Recruit" as const,
          rankedPoints: 0,
          highestRank: "Recruit",
          totalMatch: 0,
          winRate: 0,
        };

        await saveSupabaseProfileSnapshot(seededProfile);

        if (!cancelled) {
          setDisplayName(seededProfile.displayName);
          setUsername(seededProfile.username);
          setBio(seededProfile.bio);
          setAvatarSrc(seededProfile.avatarSrc);
          setBannerSrc(seededProfile.bannerSrc);
          setBannerKind(seededProfile.bannerKind);
          setBannerFocus(seededProfile.bannerFocus);
          setBannerCrop(seededProfile.bannerCrop);
          setSelectedBorder(seededProfile.border);
          setTags(seededProfile.tags);
          setRankKey(seededProfile.rankKey);
          setRankedPoints(seededProfile.rankedPoints);
          setHighestRank(seededProfile.highestRank);
          setTotalMatch(seededProfile.totalMatch);
          setWinRate(seededProfile.winRate);
          setAccessState("ready");
          fallbackFrame = window.requestAnimationFrame(() => setLoaded(true));
        }
        return;
      }

      if (cancelled) return;

      if (typeof remote.displayName === "string") setDisplayName(remote.displayName);
      if (typeof remote.username === "string") setUsername(remote.username);
      if (typeof remote.bio === "string") setBio(remote.bio);
      if (typeof remote.avatarSrc === "string") setAvatarSrc(remote.avatarSrc);
      if (typeof remote.rankKey === "string") setRankKey(remote.rankKey as RankKey);
      if (typeof remote.rankedPoints === "number") setRankedPoints(remote.rankedPoints);
      if (typeof remote.highestRank === "string") setHighestRank(remote.highestRank);
      if (typeof remote.totalMatch === "number") setTotalMatch(remote.totalMatch);
      if (typeof remote.winRate === "number") setWinRate(remote.winRate);
      if (typeof remote.bannerKind === "string" && (remote.bannerKind === "video" || remote.bannerKind === "image")) {
        setBannerKind(remote.bannerKind);
      }
      if (typeof remote.bannerFocus === "number") setBannerFocus(remote.bannerFocus);
      if (remote.bannerCrop && typeof remote.bannerCrop.x === "number") setBannerCrop(remote.bannerCrop);
      if (remote.border && ["none", "legend", "mythic", "apex"].includes(remote.border)) {
        setSelectedBorder(remote.border);
      }
      if (remote.selectedSkin && ["none", "sunset", "neon", "ocean", "emerald", "cosmic"].includes(remote.selectedSkin)) {
        setSelectedSkin(remote.selectedSkin);
      }
      if (Array.isArray(remote.customSkinColors) && remote.customSkinColors.every((c): c is string => typeof c === "string")) {
        setCustomSkinColors(remote.customSkinColors);
      }
      if (Array.isArray(remote.tags)) {
        const rawTags = remote.tags.filter((item): item is string => typeof item === "string");
        const webTag = rawTags.find((t) => t.startsWith("web:"));
        if (webTag) {
          setWebsite(webTag.substring(4));
        } else {
          setWebsite("");
        }
        setTags(rawTags.filter((t) => !t.startsWith("web:")));
      }

      const preferences = await loadSupabaseOnboardingPreferences();
      if (!cancelled && preferences && preferences.location) {
        setUserLocation(preferences.location);
      } else if (!cancelled) {
        setUserLocation("");
      }

      if (typeof remote.bannerSrc === "string" && remote.bannerSrc.length > 0) {
        if (remote.bannerKind === "video" && remote.bannerSrc === getProfileBannerVideoKey()) {
          const blob = await loadProfileBannerVideo();
          if (!cancelled) {
            setBannerSrc(getProfileBannerVideoKey());
            if (blob) {
              const objectUrl = URL.createObjectURL(blob);
              setBannerPreviewUrl(objectUrl);
            }
          }
        } else if (remote.bannerKind === "video" && remote.bannerSrc.startsWith("data:video/")) {
          const blob = await fetch(remote.bannerSrc).then((response) => response.blob());
          if (!cancelled) {
            await saveProfileBannerVideo(blob);
            const objectUrl = URL.createObjectURL(blob);
            setBannerPreviewUrl(objectUrl);
            setBannerSrc(getProfileBannerVideoKey());
          }
        } else {
          setBannerSrc(remote.bannerSrc);
          setBannerPreviewUrl(null);
        }
      } else {
        setBannerSrc("");
        setBannerPreviewUrl(null);
      }

      const matches = await loadSupabaseRankedMatches();
      if (!cancelled) {
        setRecentMatches(
          matches.map((match) => ({
            opponent: match.opponent,
            platform: match.platform,
            result: match.result,
            delta: `${match.delta >= 0 ? "+" : ""}${match.delta}`,
            fromRank: match.fromRank,
            toRank: match.toRank,
            date: match.date,
            image: match.image || "/images/1.jpg",
          })),
        );
      }

      const social = await loadSupabaseSocialCounts();
      if (!cancelled && social) {
        setSocialCounts(social);
      }

      if (!cancelled) {
        fallbackFrame = window.requestAnimationFrame(() => setLoaded(true));
        setAccessState("ready");
      }
    };

    void hydrateProfile();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(fallbackFrame);
    };
  }, [router]);

  useEffect(() => {
    if (!loaded) return;
    try {
      const finalTags = [...tags];
      if (website) {
        finalTags.push(`web:${website}`);
      }
      void saveSupabaseProfileSnapshot({
        displayName,
        username,
        bio,
        avatarSrc,
        bannerSrc,
        bannerKind,
        bannerFocus,
        bannerCrop,
        border: selectedBorder,
        selectedSkin,
        customSkinColors,
        tags: finalTags,
        rankKey,
        rankedPoints,
        highestRank,
        totalMatch,
        winRate,
      }); 
    } catch { 
      // ignore storage quota issues so profile edits don't break 
    } 
  }, [avatarSrc, bannerCrop, bannerFocus, bannerKind, bannerSrc, bio, customSkinColors, displayName, highestRank, loaded, rankKey, rankedPoints, selectedBorder, selectedSkin, tags, website, totalMatch, username, winRate]); 

  useEffect(() => {
    return () => {
      if (bannerPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreviewUrl);
      }
    };
  }, [bannerPreviewUrl]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-black">
        <Navbar />
        <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-[13px] font-medium text-black/40">Menyiapkan profile dari Supabase...</p>
        </main>
      </div>
    );
  }

  if (accessState === "guest") {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-black">
        <Navbar />
        <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg rounded-2xl border border-black/6 bg-white px-6 py-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] sm:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/30">
              Account required
            </p>
            <h1 className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-black sm:text-4xl">
              Anda belum memiliki akun
            </h1>
            <p className="mt-3 max-w-md text-[13px] leading-[1.7] text-black/50">
              Buat akun dulu atau masuk ke akun yang sudah ada supaya profile, token, friends, dan history bisa
              tersambung ke Supabase.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/login?mode=register"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-[13px] font-semibold text-white transition hover:bg-black/85"
              >
                Buat akun
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-black/8 bg-white px-5 text-[13px] font-semibold text-black transition hover:bg-black/[0.03]"
              >
                Masuk
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (accessState === "onboarding") {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-black">
        <Navbar />
        <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg rounded-2xl border border-black/6 bg-white px-6 py-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] sm:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/30">
              Onboarding needed
            </p>
            <h1 className="mt-3 font-display text-3xl uppercase tracking-[0.04em] text-black sm:text-4xl">
              Profile belum siap
            </h1>
            <p className="mt-3 max-w-md text-[13px] leading-[1.7] text-black/50">
              Akun sudah masuk, tapi preference profile belum lengkap. Lanjutkan onboarding supaya data akun
              tersimpan penuh di database.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/onboarding"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-5 text-[13px] font-semibold text-white transition hover:bg-black/85"
              >
                Lanjut onboarding
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-black/8 bg-white px-5 text-[13px] font-semibold text-black transition hover:bg-black/[0.03]"
              >
                Kembali ke login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      <main className="w-full flex flex-col pb-16">
        {/* Banner Section - Edge-to-Edge */}
        <div className="relative w-full h-44 sm:h-60 md:h-72 lg:h-80 bg-zinc-900 overflow-hidden border-b border-zinc-200">
          {bannerKind === "video" && bannerPreviewUrl ? (
            <video
              src={bannerPreviewUrl}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              style={{
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
              sizes="100vw"
              unoptimized
              className="object-cover"
              style={{ objectPosition: bannerSrc.startsWith("data:") ? "50% 50%" : `50% ${bannerFocus}%` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Content Section - Constrained Width (X/Github profile look) */}
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Profile Area */}
          <div className="relative pb-6 border-b border-zinc-200">
            {/* Avatar & Action Buttons Row */}
            <div className="flex justify-between items-end -mt-16 sm:-mt-20 md:-mt-24 mb-4 relative">
              {/* Avatar */}
              <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full bg-white p-1 shadow-md shrink-0">
                {selectedBorder === "none" ? (
                  <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white bg-zinc-100">
                    <Image
                      src={avatarSrc}
                      alt="Profile avatar"
                      fill
                      sizes="(max-width: 640px) 112px, 160px"
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
                    <div className="relative h-full w-full rounded-full bg-white p-0.5">
                      <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white bg-zinc-100">
                        <Image
                          src={avatarSrc}
                          alt="Profile avatar"
                          fill
                          sizes="(max-width: 640px) 112px, 160px"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </ElectricBorder>
                )}
                {/* Emblem Overlay */}
                <div
                  className="absolute -bottom-1 left-1/2 z-10 h-7 w-7 sm:h-9 sm:w-9 -translate-x-1/2 rounded-full border border-zinc-200 bg-white p-1 shadow-sm"
                  style={selectedBorder !== "none" ? { boxShadow: `0 0 16px ${borderTheme.glow}` } : undefined}
                >
                  <RankEmblem variant={rankTheme.emblem} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((value) => !value)}
                    className="inline-flex h-9 px-4 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs sm:text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Edit Profile
                  </button>

                  {menuOpen ? (
                    <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
                      {menuItems.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            setEditorMode(item.target);
                            setMenuOpen(false);
                          }}
                          className="flex h-9 w-full items-center rounded-lg px-3 text-left text-xs sm:text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-black"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 transition hover:bg-zinc-50"
                  aria-label="Share profile"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.632-2.316m0 0a3 3 0 100-4.632 3 3 0 000 4.632zm0 4.632l-4.632 2.316m0 0a3 3 0 100 4.632 3 3 0 000-4.632z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Details */}
            <div className="mt-2 space-y-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {selectedSkin !== "none" ? (
                    <GradientText
                      colors={customSkinColors}
                      direction="horizontal"
                      animationSpeed={1}
                      pauseOnHover={false}
                      yoyo={false}
                      minimal
                      className="font-display text-2xl sm:text-3xl uppercase tracking-wider"
                    >
                      {displayName}
                    </GradientText>
                  ) : (
                    <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-black">
                      {displayName}
                    </h2>
                  )}
                  <RankBadge rank={currentRank} />
                </div>
                <p className="text-sm text-zinc-400 font-normal">@{username}</p>
              </div>

              {bio ? (
                <p className="text-sm sm:text-[15px] leading-relaxed text-zinc-700 font-normal whitespace-pre-wrap">
                  {bio}
                </p>
              ) : (
                <p className="text-sm text-zinc-400 italic font-normal">Belum ada deskripsi bio.</p>
              )}

              {/* Location, Date, Web */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-zinc-500 font-normal">
                {userLocation && (
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {userLocation}
                  </span>
                )}
                {website && (
                  <a
                    href={website.startsWith("http") ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-black hover:underline cursor-pointer"
                  >
                    <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {website}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Bergabung Juni 2026
                </span>
              </div>

              {/* Tags (Location/Border/Fokus info) */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs font-medium text-zinc-600 border border-zinc-200">
                    {tag}
                  </span>
                ))}
                <span className="rounded-full bg-zinc-50 border border-zinc-200 px-3 py-0.5 text-xs font-medium text-zinc-500">
                  {borderTheme.label}
                </span>
              </div>

              {/* Profile stats inline (Followers, Following, Friends, Debates, Wins, Losses, Tokens) */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs sm:text-sm text-zinc-600 font-normal">
                <span className="flex gap-1">
                  <strong className="font-semibold text-black">{socialCounts.following}</strong>
                  <span className="text-zinc-500">Following</span>
                </span>
                <span className="flex gap-1">
                  <strong className="font-semibold text-black">{socialCounts.followers}</strong>
                  <span className="text-zinc-500">Followers</span>
                </span>
                <span className="flex gap-1">
                  <strong className="font-semibold text-black">{socialCounts.friends}</strong>
                  <span className="text-zinc-500">Friends</span>
                </span>
                <span className="flex gap-1">
                  <strong className="font-semibold text-black">{totalMatch}</strong>
                  <span className="text-zinc-500">Debates</span>
                </span>
                <span className="flex gap-1">
                  <strong className="font-semibold text-black">{Number.isFinite(totalMatch * (winRate / 100)) ? (totalMatch * (winRate / 100)).toFixed(0) : "0"}</strong>
                  <span className="text-zinc-500">Wins</span>
                </span>
                <span className="flex gap-1">
                  <strong className="font-semibold text-black">{Number.isFinite(totalMatch * ((100 - winRate) / 100)) ? (totalMatch * ((100 - winRate) / 100)).toFixed(0) : "0"}</strong>
                  <span className="text-zinc-500">Losses</span>
                </span>
                <span className="flex gap-1">
                  <strong className="font-semibold text-black">350</strong>
                  <span className="text-zinc-500">Tokens</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tabs Bar */}
          <div className="flex border-b border-zinc-200 overflow-x-auto scrollbar-none bg-white z-10">
            {(["activity", "debates", "achievements", "inventory", "perks"] as const).map((tab) => {
              const label = tab === "activity" ? "Activity" 
                          : tab === "debates" ? "Debates" 
                          : tab === "achievements" ? "Achievements" 
                          : tab === "inventory" ? "Inventory" 
                          : "Supporter Perks";
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex-1 py-3.5 px-4 text-center text-xs sm:text-sm font-semibold tracking-wider transition-colors hover:bg-zinc-50 shrink-0 ${
                    active ? "text-black animate-fade-in" : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  {label}
                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Tab Contents */}
          {activeTab === "activity" && (
            <div className="mt-6 space-y-6">
              {/* Current Rank Card */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-wider text-black">Current Rank Progress</h3>
                    <p className="text-xs text-zinc-400 font-normal">Point required for the next rank tier</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1 text-[11px] font-semibold text-zinc-800 uppercase tracking-wider">
                    {rankProgress.current} → {rankProgress.next}
                  </span>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl">
                  <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-black transition-all duration-700 ease-out"
                      style={{ width: `${rankProgress.progress}%` }}
                    />
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-zinc-500">
                    <span>0 pts</span>
                    <span className="text-black font-bold">{rankedPoints} pts</span>
                    <span>8500+ pts</span>
                  </div>
                </div>
              </section>

              {/* Match History */}
              <section className="space-y-4 pt-2">
                <div>
                  <h3 className="font-display text-lg uppercase tracking-wider text-black">Recent Matches</h3>
                  <p className="text-xs text-zinc-400 font-normal">Logs of latest battleboarding matches in the arena</p>
                </div>

                {recentMatches.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {recentMatches.map((match) => (
                      <article key={`${match.opponent}-${match.date}`} className="overflow-hidden bg-white border border-zinc-200 rounded-xl transition hover:border-zinc-400 hover:shadow-sm">
                        <div className="relative aspect-[4/3] bg-zinc-50">
                          <Image
                            src={match.image}
                            alt={`${match.opponent} match preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, 250px"
                            className="object-cover grayscale hover:grayscale-0 transition duration-300"
                          />
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-black">{match.opponent}</p>
                              <p className="text-[11px] text-zinc-400 font-normal">
                                {match.platform} · {match.date}
                              </p>
                            </div>
                            <span
                              className={`rounded px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                                match.result === "Win" ? "bg-black text-white" : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                              }`}
                            >
                              {match.result}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-center text-xs font-normal">
                            <div className="bg-zinc-50 border border-zinc-100 p-2 rounded-lg">
                              <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Rank Path</span>
                              <span className="font-semibold text-zinc-700">{match.toRank}</span>
                            </div>
                            <div className="bg-zinc-50 border border-zinc-100 p-2 rounded-lg">
                              <span className="block text-[9px] uppercase tracking-wider text-zinc-400">Delta</span>
                              <span className={`font-semibold ${match.delta.startsWith("-") ? "text-red-600" : "text-emerald-600"}`}>
                                {match.delta}
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-8 text-center">
                    <p className="font-display text-base uppercase text-zinc-500">Belum ada riwayat match</p>
                    <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto font-normal">
                      Riwayat battle akan tercatat di sini setelah Anda menyelesaikan pertarungan resmi.
                    </p>
                    <Link
                      href="/ranked"
                      className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
                    >
                      Buka Ranked Ladder
                    </Link>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === "debates" && (
            <div className="mt-6 space-y-6">
              {/* Account Summary Stats */}
              <section className="space-y-4">
                <div>
                  <h3 className="font-display text-lg uppercase tracking-wider text-black">Account Summary</h3>
                  <p className="text-xs text-zinc-400 font-normal">Detailed statistics of your battle boarding debates</p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {profileStats.map((item) => (
                    <div key={item.label} className="border border-zinc-200 bg-white p-4 rounded-xl text-center">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{item.label}</span>
                      <span className="block mt-1.5 text-xl font-bold text-black">{item.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Featured Rank */}
              <section className="space-y-4 pt-2">
                <div>
                  <h3 className="font-display text-lg uppercase tracking-wider text-black">Featured Arena Rank</h3>
                  <p className="text-xs text-zinc-400 font-normal">Your current status symbol in the global community</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 border border-zinc-200 p-5 rounded-2xl bg-zinc-50/50">
                  <div className={`rounded-xl p-4 ${rankTheme.accent} shrink-0`}>
                    <div className="h-20 w-20 sm:h-24 sm:w-24">
                      <RankEmblem variant={rankTheme.emblem} />
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                    <h4 className="font-display text-2xl uppercase tracking-wider text-black">{rankTheme.title}</h4>
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{rankTheme.subtitle}</p>
                    <p className="text-sm text-zinc-600 leading-relaxed max-w-lg font-normal">
                      Border rank, statistik, dan riwayat match disusun secara rapi untuk mengedepankan reputasi Anda sebagai debater. Dapatkan poin dari memenangkan duel dan naik ke kasta lebih tinggi.
                    </p>
                  </div>
                </div>
              </section>

              {/* Actions Section */}
              <section className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/ranked"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-black px-4 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Open Ranked Ladder
                </Link>
                <Link
                  href="/friends"
                  className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-zinc-300 bg-white px-4 text-xs sm:text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  Find Friends
                </Link>
              </section>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-display text-lg uppercase tracking-wider text-black">Debater Achievements</h3>
                <p className="text-xs text-zinc-400 font-normal">Badge and milestones unlocked from competitive matches</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Achievement 1: Rank */}
                <div className="flex items-start gap-4 border border-zinc-200 p-4 rounded-xl bg-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 font-bold shrink-0">
                    🏆
                  </div>
                  <div className="space-y-1 font-normal">
                    <h4 className="text-sm font-semibold text-black">Highest Rank Reached</h4>
                    <p className="text-xs text-zinc-500">You achieved the prestigious rank of <strong className="font-semibold text-black">{highestRank}</strong> in the arena.</p>
                  </div>
                </div>

                {/* Achievement 2: Win Rate */}
                <div className="flex items-start gap-4 border border-zinc-200 p-4 rounded-xl bg-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 font-bold shrink-0">
                    ⚡
                  </div>
                  <div className="space-y-1 font-normal">
                    <h4 className="text-sm font-semibold text-black">Win Rate Record</h4>
                    <p className="text-xs text-zinc-500">Maintaining an impressive <strong className="font-semibold text-black">{Number.isFinite(winRate) ? winRate.toFixed(0) : "0"}%</strong> win rate across all official debates.</p>
                  </div>
                </div>

                {/* Achievement 3: Total Matches */}
                <div className="flex items-start gap-4 border border-zinc-200 p-4 rounded-xl bg-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 font-bold shrink-0">
                    ⚔️
                  </div>
                  <div className="space-y-1 font-normal">
                    <h4 className="text-sm font-semibold text-black">Veteran Fighter</h4>
                    <p className="text-xs text-zinc-500">Participated in <strong className="font-semibold text-black">{totalMatch}</strong> total debates in the community arena.</p>
                  </div>
                </div>

                {/* Achievement 4: Tokens */}
                <div className="flex items-start gap-4 border border-zinc-200 p-4 rounded-xl bg-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 font-bold shrink-0">
                    💎
                  </div>
                  <div className="space-y-1 font-normal">
                    <h4 className="text-sm font-semibold text-black">Token Collector</h4>
                    <p className="text-xs text-zinc-500">Accrued tokens for marketplace trade and customization.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display text-lg uppercase tracking-wider text-black">Border Inventory</h3>
                  <p className="text-xs text-zinc-400 font-normal">Customize the visual borders around your profile avatar</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditorMode("border")}
                  className="inline-flex h-9 px-4 items-center justify-center rounded-full bg-black text-xs font-semibold text-white transition hover:opacity-90"
                >
                  Change Border
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(["none", "legend", "mythic", "apex"] as BorderKey[]).map((border) => {
                  const theme = borderThemes[border];
                  const active = selectedBorder === border;
                  return (
                    <div
                      key={border}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                        active
                          ? "border-black bg-zinc-50"
                          : "border-zinc-200 bg-white"
                      }`}
                    >
                      <div className="shrink-0 scale-90">
                        <BorderSwatch border={border} active={active} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-black">{theme.label}</p>
                          {active && (
                            <span className="rounded bg-black px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                              Equipped
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-zinc-500 font-normal">{theme.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "perks" && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-display text-lg uppercase tracking-wider text-black">Supporter Perks</h3>
                <p className="text-xs text-zinc-400 font-normal">Exclusive perks unlocked for active contributors</p>
              </div>

              <div className="border border-zinc-200 p-5 rounded-2xl bg-zinc-50/50 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shrink-0 font-normal">
                    🎬
                  </div>
                  <div className="space-y-1 font-normal">
                    <h4 className="text-sm font-semibold text-black">Custom Video Banner</h4>
                    <p className="text-xs text-zinc-500">
                      You can upload short videos (up to 10 seconds) to be played directly on your profile page. This is currently enabled for your account.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shrink-0 font-normal">
                    🌈
                  </div>
                  <div className="space-y-1 font-normal">
                    <h4 className="text-sm font-semibold text-black">Animated Avatar Borders</h4>
                    <p className="text-xs text-zinc-500">
                      Gain access to Legend, Mythic, and Apex borders featuring custom conic and electric glow animations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shrink-0 font-normal">
                    🏷️
                  </div>
                  <div className="space-y-1 font-normal">
                    <h4 className="text-sm font-semibold text-black">Profile Tags</h4>
                    <p className="text-xs text-zinc-500">
                      Apply up to 6 custom text tags on your profile header to specify your specialties, location, and credentials.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row gap-3 items-center justify-between font-normal">
                  <p className="text-xs text-zinc-400">Thank you for supporting DBA community development!</p>
                  <button
                    type="button"
                    onClick={() => setEditorMode("profile")}
                    className="inline-flex h-9 px-4 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Manage Profile Media
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

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
            website={website}
            selectedBorder={selectedBorder}
            selectedSkin={selectedSkin}
            customSkinColors={customSkinColors}
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
                  } catch (error) {
                    console.error("Failed to save video banner:", error);
                    alert(`Gagal menyimpan video: ${error instanceof Error ? error.message : "Unknown error"}`);
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
              if (typeof next.website === "string") setWebsite(next.website);
              if (next.border) setSelectedBorder(next.border);
              if (next.skin) setSelectedSkin(next.skin);
              if (Array.isArray(next.customSkinColors)) setCustomSkinColors(next.customSkinColors);
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

