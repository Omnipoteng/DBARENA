"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/components/sections/navbar";
import ElectricBorder from "@/components/ElectricBorder";
import {
  borderThemes,
  getRankProgress,
  rankThemes,
  resolveRank,
  RankBadge,
  RankEmblem,
} from "@/components/profile-visuals";
import { getSupabaseAuthClient } from "@/lib/supabase-auth";
import { setDbaUserKey } from "@/lib/dba-user";
import {
  loadSupabaseFriendCountsByUserKey,
  loadSupabaseProfileSnapshotByKey,
  loadSupabaseRankedMatchesByUserKey,
  setSupabaseFollowState,
  type ProfileSnapshot,
  type RankedMatchSnapshot,
} from "@/lib/supabase-store";

type ViewState = "loading" | "guest" | "not-found" | "ready";

function getRankTheme(profile: ProfileSnapshot | null) {
  const currentRank = (profile?.rankKey ?? resolveRank(profile?.rankedPoints ?? 0)) as keyof typeof rankThemes;
  return rankThemes[currentRank];
}

function getBorderTheme(profile: ProfileSnapshot | null) {
  const key = (profile?.border ?? "legend") as keyof typeof borderThemes;
  return borderThemes[key];
}

function VisitorLoading() {
  return (
    <div className="min-h-screen bg-[#f8f8f6] text-black">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-black/55">Memuat profile pengguna...</p>
      </main>
    </div>
  );
}

export default function VisitorProfilePage() {
  const router = useRouter();
  const params = useParams<{ userKey: string }>();
  const targetUserKey = useMemo(() => {
    const raw = params?.userKey;
    return Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  }, [params]);

  const supabase = useMemo(() => getSupabaseAuthClient(), []);
  const [state, setState] = useState<ViewState>("loading");
  const [profile, setProfile] = useState<ProfileSnapshot | null>(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [friends, setFriends] = useState(0);
  const [matches, setMatches] = useState<RankedMatchSnapshot[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followsMe, setFollowsMe] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (!supabase || !targetUserKey) {
        if (!cancelled) setState("guest");
        return;
      }

      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      setDbaUserKey(user.id);

      if (user.id === targetUserKey) {
        router.replace("/profile");
        return;
      }

      const targetProfile = await loadSupabaseProfileSnapshotByKey(targetUserKey);
      if (!targetProfile) {
        if (!cancelled) setState("not-found");
        return;
      }

      const counts = await loadSupabaseFriendCountsByUserKey(targetUserKey);
      const targetMatches = await loadSupabaseRankedMatchesByUserKey(targetUserKey);
      const relationRows = await supabase
        .from("follows")
        .select("follower_user_key,following_user_key")
        .or(`follower_user_key.eq.${user.id},following_user_key.eq.${user.id}`);

      if (cancelled) return;

      const rows = relationRows.data ?? [];
      setProfile(targetProfile);
      setFollowers(counts.followers);
      setFollowing(counts.following);
      setFriends(counts.friends);
      setMatches(targetMatches);
      setIsFollowing(rows.some((row) => row.follower_user_key === user.id && row.following_user_key === targetUserKey));
      setFollowsMe(rows.some((row) => row.follower_user_key === targetUserKey && row.following_user_key === user.id));
      setState("ready");
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [router, supabase, targetUserKey]);

  const rankTheme = getRankTheme(profile);
  const borderTheme = getBorderTheme(profile);
  const rankProgress = getRankProgress(profile?.rankedPoints ?? 0);
  const currentRank = (profile?.rankKey ?? resolveRank(profile?.rankedPoints ?? 0)) as keyof typeof rankThemes;

  const stats = profile
    ? [
        { label: "Ranked points", value: new Intl.NumberFormat("en-US").format(profile.rankedPoints ?? 0) },
        { label: "Highest rank", value: profile.highestRank || rankTheme.title },
        { label: "Total match", value: String(profile.totalMatch ?? 0) },
        { label: "Win rate", value: `${Number.isFinite(profile.winRate ?? 0) ? Number(profile.winRate ?? 0).toFixed(0) : "0"}%` },
      ]
    : [];

  const handleFollow = async () => {
    if (!profile) return;
    const next = !isFollowing;
    setIsFollowing(next);
    await setSupabaseFollowState(targetUserKey, next);
  };

  const handleAddFriend = async () => {
    if (!profile) return;
    if (isFollowing && followsMe) return;
    setIsFollowing(true);
    await setSupabaseFollowState(targetUserKey, true);
  };

  const handleShare = async () => {
    if (!profile) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.displayName} | DBARENA`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // ignore share cancellation
    }
  };

  if (state === "loading") return <VisitorLoading />;

  if (state === "not-found" || !profile) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] text-black">
        <Navbar />
        <main className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg border-y border-black/10 bg-white px-5 py-8 text-left sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-black/35">Not found</p>
            <h1 className="mt-3 font-display text-4xl uppercase tracking-[0.06em] text-black sm:text-5xl">
              Profile tidak ditemukan
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-black/60">
              Data profile untuk user ini belum tersedia di database.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/friends"
                className="inline-flex h-11 items-center justify-center border border-black/10 bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Kembali ke Friends
              </Link>
              <Link
                href="/profile"
                className="inline-flex h-11 items-center justify-center border border-black/10 bg-white px-4 text-sm font-semibold text-black transition hover:bg-black/5"
              >
                Buka profile sendiri
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const bannerSrc = profile.bannerSrc ?? "";
  const canRenderVideo =
    profile.bannerKind === "video" && bannerSrc && (bannerSrc.startsWith("http") || bannerSrc.startsWith("blob:") || bannerSrc.startsWith("data:"));

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-black">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="mt-6 border-y border-black/8 bg-white">
          <div className="relative h-36 overflow-hidden border-b border-black/8 sm:h-44 lg:h-48">
            {canRenderVideo ? (
              <video
                src={bannerSrc}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  ...(profile.bannerCrop ? {
                    objectPosition: `${profile.bannerCrop.x}% ${profile.bannerCrop.y}%`,
                    transform: profile.bannerCrop.zoom > 1 ? `scale(${profile.bannerCrop.zoom})` : undefined,
                    transformOrigin: `${profile.bannerCrop.x}% ${profile.bannerCrop.y}%`,
                  } : {}),
                }}
              />
            ) : bannerSrc ? (
              <Image
                src={bannerSrc}
                alt={`${profile.displayName} banner`}
                fill
                sizes="(max-width: 1024px) 100vw, 1280px"
                unoptimized
                className="object-cover"
                style={{
                  ...(profile.bannerCrop ? {
                    objectPosition: `${profile.bannerCrop.x}% ${profile.bannerCrop.y}%`,
                    transform: profile.bannerCrop.zoom > 1 ? `scale(${profile.bannerCrop.zoom})` : undefined,
                    transformOrigin: `${profile.bannerCrop.x}% ${profile.bannerCrop.y}%`,
                  } : {
                    objectPosition: `50% ${profile.bannerFocus}%`,
                  }),
                }}
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
                  {profile.border === "none" ? (
                    <div className="relative h-full w-full overflow-hidden rounded-full border-[4px] border-black/12 bg-white">
                      <Image
                        src={profile.avatarSrc}
                        alt={profile.displayName}
                        fill
                        sizes="208px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="relative h-full w-full">
                      <div className="absolute inset-0 rounded-full opacity-95 blur-[1px]" style={{ backgroundImage: borderTheme.ring }} />
                      <ElectricBorder color={borderTheme.electricColor} speed={1} chaos={0.12} borderRadius={999} className="h-full w-full">
                        <div className="relative h-full w-full rounded-full bg-white p-1.5">
                          <div className="relative h-full w-full overflow-hidden rounded-full border-[4px] border-black/12 bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9)]">
                            <Image
                              src={profile.avatarSrc}
                              alt={profile.displayName}
                              fill
                              sizes="208px"
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </ElectricBorder>
                    </div>
                  )}
                  <div
                    className="absolute -bottom-3 left-1/2 z-10 h-12 w-12 -translate-x-1/2 rounded-full border border-black/10 bg-white p-1.5 shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
                    style={profile.border !== "none" ? { boxShadow: `0 0 34px ${borderTheme.glow}` } : undefined}
                  >
                    <RankEmblem variant={rankTheme.emblem} />
                  </div>
                </div>

                <div className="min-w-0 pb-1 pt-3 sm:pt-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-display text-3xl uppercase tracking-[0.08em] text-black sm:text-4xl">
                      {profile.displayName}
                    </h1>
                    <RankBadge rank={currentRank} />
                  </div>
                  <p className="mt-1 text-sm leading-none text-black/55">@{profile.username}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-black/65">{profile.bio || "Belum ada bio."}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {profile.tags.map((tag) => (
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

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={handleFollow}
                  className={`inline-flex h-11 items-center justify-center border px-4 text-sm font-semibold transition ${
                    isFollowing
                      ? "border-black/10 bg-black text-white hover:opacity-90"
                      : "border-black/10 bg-white text-black hover:bg-black/5"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
                <button
                  type="button"
                  onClick={handleAddFriend}
                  className="inline-flex h-11 items-center justify-center border border-black/10 bg-white px-4 text-sm font-semibold text-black transition hover:bg-black/5"
                >
                  {isFollowing && followsMe ? "Friends" : "Add Friend"}
                </button>
                <button
                  type="button"
                  disabled
                  title="Messaging belum tersedia"
                  className="inline-flex h-11 items-center justify-center border border-black/10 bg-white px-4 text-sm font-semibold text-black/35"
                >
                  Message
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex h-11 items-center justify-center border border-black/10 bg-white px-4 text-sm font-semibold text-black transition hover:bg-black/5"
                >
                  {copied ? "Copied" : "Share Profile"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="border-y border-black/8 bg-white px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-3 border-b border-black/8 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Overview</p>
                <h3 className="mt-2 text-2xl font-semibold text-black">Account summary</h3>
              </div>
              <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/55">
                Visitor view
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {stats.map((item) => (
                <div key={item.label} className="border border-black/8 bg-black/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-black">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 border border-black/8 bg-gradient-to-br from-black/[0.02] to-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Rank</p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className={`rounded-full p-4 ${rankTheme.accent}`}>
                  <div className="h-24 w-24">
                    <RankEmblem variant={rankTheme.emblem} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-4xl uppercase tracking-[0.08em] text-black">{rankTheme.title}</p>
                  <p className="mt-2 text-sm text-black/55">{rankTheme.subtitle}</p>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-black/65">
                    Border rank, statistik, dan match history disusun seperti akun sosial kompetitif yang tetap fokus
                    ke battleboarding DBA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-y border-black/8 bg-white px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-3 border-b border-black/8 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Social</p>
                <h3 className="mt-2 text-2xl font-semibold text-black">Followers & Friends</h3>
              </div>
              <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/55">
                Live counts
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { title: "Followers", value: followers },
                { title: "Following", value: following },
                { title: "Friends", value: friends },
                { title: "Matches", value: profile.totalMatch ?? 0 },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between border border-black/8 bg-black/[0.02] px-4 py-4">
                  <span className="text-xs uppercase tracking-[0.28em] text-black/35">{item.title}</span>
                  <span className="text-sm font-semibold text-black">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="h-3 bg-black/10">
                <div
                  className="h-full bg-gradient-to-r from-black via-slate-500 to-slate-300 transition-all duration-500"
                  style={{ width: `${rankProgress.progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-black/45">
                <span>0</span>
                <span>{profile.rankedPoints ?? 0}</span>
                <span>8500+</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 border-y border-black/8 bg-white px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-3 border-b border-black/8 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Activity</p>
              <h3 className="mt-2 text-2xl font-semibold text-black">Recent match</h3>
            </div>
            <span className="text-xs uppercase tracking-[0.22em] text-black/45">{matches.length} logs</span>
          </div>

          {matches.length > 0 ? (
            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              {matches.map((match) => (
                <article key={`${match.id}-${match.date}`} className="border border-black/8 bg-black/[0.02]">
                  <div className="relative aspect-[4/3] bg-black/5">
                    <Image
                      src={match.image || "/images/1.jpg"}
                      alt={`${match.opponent} match preview`}
                      fill
                      sizes="(max-width: 1280px) 100vw, 33vw"
                      className="object-cover grayscale contrast-110"
                    />
                  </div>
                  <div className="space-y-3 border-t border-black/8 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-black">{match.opponent}</p>
                        <p className="mt-1 text-xs text-black/45">
                          {match.platform} - {match.date}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] ${
                          match.result === "Win" ? "bg-black text-white" : "bg-black/10 text-black/60"
                        }`}
                      >
                        {match.result}
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="border border-black/8 bg-white p-3">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">Progress</p>
                        <p className="mt-2 text-sm font-semibold text-black">
                          {match.fromRank} → {match.toRank}
                        </p>
                      </div>
                      <div className="border border-black/8 bg-white p-3">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">Points change</p>
                        <p className="mt-2 text-sm font-semibold text-black">{match.delta >= 0 ? `+${match.delta}` : match.delta}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 border-t border-black/8 pt-5">
              <div className="border border-black/8 bg-black/[0.02] p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-black/35">Recent match</p>
                <p className="mt-2 text-lg font-semibold text-black">Ups, tidak ada riwayat di sini</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
                  Riwayat battle akan muncul setelah user ini punya data ranked match di database.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
