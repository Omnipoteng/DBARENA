"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "@/components/sections/navbar";
import { loadSupabaseFriends, setSupabaseFollowState } from "@/lib/supabase-store";

type SocialProfile = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  banner: string;
  bio: string;
  followsMe: boolean;
  following: boolean;
};

function getActionLabel(profile: SocialProfile) {
  if (profile.following && profile.followsMe) return "Unfriend";
  if (profile.following) return "Unfollow";
  if (profile.followsMe) return "Follow back";
  return "Follow";
}

function ProfileSkeleton() {
  return (
    <div className="overflow-hidden border border-black/10 bg-white">
      <div className="relative h-28 bg-black/5 sm:h-32 md:h-36" />
      <div className="space-y-3 px-4 pb-4 pt-10 sm:px-5 sm:pb-5 sm:pt-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 pl-20 sm:pl-24">
            <div className="h-4 w-3/5 bg-black/10" />
            <div className="mt-2 h-3 w-2/5 bg-black/5" />
          </div>
          <div className="mt-1 h-10 w-24 bg-black/10" />
        </div>
        <div className="h-12 bg-black/5" />
      </div>
    </div>
  );
}

export default function FriendsPage() {
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"all" | "friends" | "following" | "suggested">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void loadSupabaseFriends().then((remoteProfiles) => {
      if (cancelled) return;
      setProfiles(remoteProfiles);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProfiles = profiles.filter((profile) => {
    const needle = query.trim().toLowerCase();
    const searchMatch =
      !needle ||
      profile.name.toLowerCase().includes(needle) ||
      profile.username.toLowerCase().includes(needle) ||
      profile.bio.toLowerCase().includes(needle);

    const relation =
      profile.following && profile.followsMe
        ? "friends"
        : profile.following
          ? "following"
          : profile.followsMe
            ? "followers"
            : "suggested";

    const viewMatch =
      view === "all" ||
      (view === "friends" && relation === "friends") ||
      (view === "following" && relation === "following") ||
      (view === "suggested" && relation === "suggested");

    return searchMatch && viewMatch;
  });

  const toggleFollow = (id: string) => {
    setProfiles((current) => {
      const nextProfiles = current.map((profile) =>
        profile.id === id
          ? {
              ...profile,
              following: !profile.following,
            }
          : profile,
      );

      const next = nextProfiles.find((profile) => profile.id === id);
      if (next) {
        void setSupabaseFollowState(id, next.following);
      }

      return nextProfiles;
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-black">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="border-y border-black/10 bg-white px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-black/40">Social network</p>
          <div className="mt-3 flex flex-col gap-4">
            <div>
              <h1 className="font-display text-4xl uppercase tracking-[0.06em] text-black sm:text-5xl">
                Friends & Following
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-black/65">
                Cari profile, follow satu arah, atau saling follow untuk jadi teman. Semua tetap tersambung ke
                sistem profile DBARENA.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <label className="flex h-11 items-center gap-3 border border-black/10 bg-white px-4">
                <svg className="h-4 w-4 shrink-0 text-black/40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="7" strokeWidth={2} />
                  <path d="M20 20l-3.5-3.5" strokeWidth={2} strokeLinecap="round" />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search profile, username, or bio..."
                  className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-black/30"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all" as const, label: "All" },
                  { key: "friends" as const, label: "Friends" },
                  { key: "following" as const, label: "Following" },
                  { key: "suggested" as const, label: "Suggested" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setView(item.key)}
                    className={`h-11 border px-4 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                      view === item.key
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black/65 hover:bg-black/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="-mx-4 mt-6 space-y-4 sm:mx-0">
          <div className="flex items-center justify-between border-b border-black/10 px-4 pb-3 sm:px-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/40">Add friend</p>
              <h2 className="mt-2 text-2xl font-semibold text-black">Search result</h2>
            </div>
            <p className="text-sm text-black/45">{loading ? "Loading..." : `${filteredProfiles.length} profiles`}</p>
          </div>

          {loading ? (
            <div className="grid gap-4 px-4 sm:px-0 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProfileSkeleton key={index} />
              ))}
            </div>
          ) : filteredProfiles.length > 0 ? (
            <div className="grid gap-4 px-4 sm:px-0 md:grid-cols-2 xl:grid-cols-3">
              {filteredProfiles.map((profile) => {
                const primaryAction = getActionLabel(profile);

                return (
                  <article
                    key={profile.id}
                    className="overflow-hidden border border-black/10 bg-white transition duration-300 rounded-none md:rounded-[24px] md:shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                  >
                    <Link href={`/profile/${profile.id}`} className="block">
                      <div className="relative h-28 overflow-hidden bg-black/5 sm:h-32 md:h-36">
                        <Image
                          src={profile.banner}
                          alt={`${profile.name} banner`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.6)_100%)] md:bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.18)_100%)]" />
                      </div>

                      <div className="relative px-4 pb-4 pt-10 sm:px-5 sm:pb-5 sm:pt-8">
                        <div className="absolute left-4 top-0 -translate-y-1/2 sm:left-5">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white bg-transparent shadow-[0_12px_24px_rgba(0,0,0,0.12)] md:border-black/10">
                            <Image src={profile.avatar} alt={profile.name} fill sizes="64px" className="object-cover" />
                          </div>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 pl-20 sm:pl-24">
                            <h3 className="truncate text-[15px] font-semibold uppercase tracking-[0.08em] text-black sm:text-base">
                              {profile.name}
                            </h3>
                            <p className="mt-0.5 text-sm text-black/45">{profile.username}</p>
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-black/65">{profile.bio}</p>
                      </div>
                    </Link>

                    <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                      <button
                        type="button"
                        onClick={() => toggleFollow(profile.id)}
                        className={`inline-flex h-10 w-full items-center justify-center border px-4 text-sm font-semibold transition ${
                          primaryAction === "Unfriend" || primaryAction === "Unfollow"
                            ? "border-black/10 bg-black text-white hover:opacity-90"
                            : "border-black/10 bg-white text-black hover:bg-black/5"
                        }`}
                      >
                        {primaryAction}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="px-4 sm:px-0">
              <div className="border-y border-black/10 bg-white px-5 py-10 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-black/35">Empty</p>
                <h3 className="mt-3 text-2xl font-semibold text-black">Belum ada profile yang bisa ditampilkan</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-black/55">
                  Saat ini belum ada akun publik yang cocok dengan filter ini. Coba ubah pencarian, atau kembali
                  lagi setelah ada user baru terhubung ke database.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
