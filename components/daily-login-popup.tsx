"use client";

import { useEffect, useMemo, useState } from "react";

import { getSupabaseAuthClient } from "@/lib/supabase-auth";
import { DBA_TOKEN_KEYS, formatTokenNumber, readTokenWallet, writeTokenWallet } from "@/lib/dba-token";
import {
  appendSupabaseTokenTransaction,
  loadSupabaseTokenWallet,
  recordSupabaseDailyLoginClaim,
  saveSupabaseTokenWallet,
} from "@/lib/supabase-store";

type RewardItem = {
  day: number;
  label: string;
  detail: string;
  type: "token" | "tag";
  amount?: number;
  tag?: string;
};

const REWARDS: RewardItem[] = [
  { day: 1, label: "15 DBA Token", detail: "Login harian pertama.", type: "token", amount: 15 },
  { day: 2, label: "20 DBA Token", detail: "Streak mulai naik.", type: "token", amount: 20 },
  { day: 3, label: "40 DBA Token", detail: "Bonus tiga hari beruntun.", type: "token", amount: 40 },
  { day: 4, label: "Tag Khusus", detail: "Unlock badge khusus profile.", type: "tag", tag: "DBA Special Tag" },
  { day: 5, label: "100 DBA Token", detail: "Reward besar pertengahan streak.", type: "token", amount: 100 },
  { day: 6, label: "120 DBA Token", detail: "Hampir menuju reward puncak.", type: "token", amount: 120 },
  { day: 7, label: "Elite Tag", detail: "Tag premium lebih bagus dari hari ke-4.", type: "tag", tag: "DBA Elite Tag" },
];

function getWibDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getWibYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getWibDateKey(d);
}

function clampDay(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(7, Math.trunc(value)));
}

function readClaimState(): { claimDate: string; streakDay: number } | null {
  if (typeof window === "undefined") return null;

  const storedDate = window.localStorage.getItem(DBA_TOKEN_KEYS.claimDate) ?? "";
  const storedDayRaw = Number(window.localStorage.getItem(DBA_TOKEN_KEYS.streakDay) ?? "0");
  const storedDay = clampDay(storedDayRaw);

  if (!storedDate) return null;

  const today = getWibDateKey();
  const yesterday = getWibYesterdayKey();

  if (storedDate === today || storedDate === yesterday) {
    return { claimDate: storedDate, streakDay: storedDay };
  }

  return null;
}

function persistClaimState(claimDate: string, streakDay: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DBA_TOKEN_KEYS.claimDate, claimDate);
  window.localStorage.setItem(DBA_TOKEN_KEYS.streakDay, String(streakDay));
}

function clearBrokenStreak(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DBA_TOKEN_KEYS.claimDate);
  window.localStorage.setItem(DBA_TOKEN_KEYS.streakDay, "0");
}

export default function DailyLoginPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState(() => readTokenWallet().balance);
  const [claimState, setClaimState] = useState<{ claimDate: string; streakDay: number } | null>(() => readClaimState());

  const todayKey = useMemo(() => getWibDateKey(), []);

  const hasClaimedToday = claimState?.claimDate === todayKey;
  const lastClaimDay = claimState?.streakDay ?? 0;

  const activeDay: number = hasClaimedToday
    ? lastClaimDay || 1
    : lastClaimDay === 0
      ? 1
      : lastClaimDay >= 7
        ? 1
        : lastClaimDay + 1;

  const currentReward = REWARDS[activeDay - 1];

  useEffect(() => {
    const supabase = getSupabaseAuthClient();
    let cancelled = false;

    const applyGuestState = () => {
      if (cancelled) return;
      setIsAuthenticated(false);
      setUserId(null);
      setAuthReady(true);
      setBalance(readTokenWallet().balance);
      setClaimState(readClaimState());
    };

    const applyAuthenticatedState = async (uid: string) => {
      const remoteWallet = await loadSupabaseTokenWallet(uid);
      if (cancelled) return;

      setIsAuthenticated(true);
      setUserId(uid);
      setAuthReady(true);

      if (remoteWallet) {
        setBalance(remoteWallet.balance);
        if (remoteWallet.claimDate && remoteWallet.streakDay) {
          setClaimState({
            claimDate: remoteWallet.claimDate,
            streakDay: remoteWallet.streakDay,
          });
          return;
        }
      }

      setBalance(0);
      setClaimState(null);
    };

    if (!supabase) {
      applyGuestState();
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session?.user) {
        void applyAuthenticatedState(data.session.user.id);
        return;
      }

      applyGuestState();
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session?.user) {
        void applyAuthenticatedState(session.user.id);
        return;
      }

      applyGuestState();
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady || !isAuthenticated || hasClaimedToday) return;

    const timer = window.setTimeout(() => setIsOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, [authReady, hasClaimedToday, isAuthenticated]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const saved = readClaimState();
    if (!saved && window.localStorage.getItem(DBA_TOKEN_KEYS.claimDate)) {
      clearBrokenStreak();
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      if (isAuthenticated) {
        setIsOpen(true);
      }
    };

    window.addEventListener("open-daily-login", handler);
    return () => window.removeEventListener("open-daily-login", handler);
  }, [isAuthenticated]);

  if (!authReady || !isAuthenticated || !isOpen) return null;

  const handleClaim = () => {
    if (hasClaimedToday) return;

    const wallet = readTokenWallet();
    const nextBalance = balance + (currentReward.type === "token" ? currentReward.amount ?? 0 : 0);
    const nextUnlocks =
      currentReward.type === "tag" && currentReward.tag
        ? Array.from(new Set([...wallet.unlocks, currentReward.tag]))
        : wallet.unlocks;

    writeTokenWallet({
      balance: nextBalance,
      unlocks: nextUnlocks,
      history: wallet.history,
      claimDate: todayKey,
      streakDay: activeDay,
    });
    void saveSupabaseTokenWallet({
      balance: nextBalance,
      unlocks: nextUnlocks,
      history: wallet.history,
      claimDate: todayKey,
      streakDay: activeDay,
    }, userId || undefined);
    void recordSupabaseDailyLoginClaim({
      claimDate: todayKey,
      streakDay: activeDay,
      rewardDay: currentReward.day,
      rewardType: currentReward.type,
      rewardAmount: currentReward.amount,
      rewardTag: currentReward.tag,
    }, userId || undefined);
    void appendSupabaseTokenTransaction({
      title: currentReward.label,
      cost: 0,
      kind: "claim",
      balanceAfter: nextBalance,
    }, userId || undefined);

    persistClaimState(todayKey, activeDay);

    setBalance(nextBalance);
    setClaimState({ claimDate: todayKey, streakDay: activeDay });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-[0_30px_120px_rgba(0,0,0,0.22)]">
        <div className="border-b border-black/8 bg-[linear-gradient(180deg,#ffffff_0%,#f4f4f4_100%)] px-4 py-4 text-black sm:px-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.45em] text-black/45">DBA TOKEN</p>
              <h3 className="mt-2 font-sans text-2xl font-black uppercase tracking-[0.02em] sm:text-3xl">
                Daily Reward
              </h3>
              <p className="mt-1 text-sm text-black/65">
                Come back once a day for rewards. Reset setiap 00:00 WIB.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-black/[0.04]"
            >
              Close
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="rounded-full bg-black px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
              {hasClaimedToday ? "Sudah klaim hari ini" : "Belum klaim"}
            </div>
            <div className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-black/75">
              Day {activeDay} / 7
            </div>
            <div className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-black/75">
              {formatTokenNumber(balance)} token
            </div>
          </div>
        </div>

        <div className="bg-[#f5f5f5] px-4 py-4 sm:px-5 sm:py-5">
          <div className="rounded-[24px] border border-black/10 bg-white px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-4">
            <div className="flex items-center justify-center gap-3 text-center text-black">
              <span className="h-px w-10 bg-black/20" />
              <p className="font-sans text-lg font-black uppercase tracking-[0.08em] sm:text-xl">Reward Track</p>
              <span className="h-px w-10 bg-black/20" />
            </div>

            <p className="mt-1 text-center text-xs font-medium text-black/60 sm:text-sm">
              Claim item yang menyala untuk ambil reward harian.
            </p>

            <div className="no-scrollbar mt-4 overflow-x-auto pb-2">
              <div className="min-w-[960px]">
                <div className="flex items-end justify-between gap-3">
                  {REWARDS.map((reward) => {
                    const isClaimed = reward.day <= lastClaimDay;
                    const isActive = !hasClaimedToday && reward.day === activeDay;
                    const isLocked = reward.day > activeDay || (hasClaimedToday && reward.day > lastClaimDay);

                    return (
                      <article
                        key={reward.day}
                        className={`relative flex w-[122px] flex-col items-center rounded-[18px] border p-2.5 pb-3 transition ${
                          isActive
                            ? "border-black bg-black text-white shadow-[0_14px_26px_rgba(0,0,0,0.18)]"
                            : isClaimed
                              ? "border-black/10 bg-white"
                              : "border-black/10 bg-white/70"
                        } ${isLocked ? "opacity-70" : ""}`}
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-[16px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,240,240,0.82))]">
                          <div
                            className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                              isActive ? "bg-white text-black" : "bg-black text-white"
                            }`}
                          >
                            {reward.day}
                          </div>
                        </div>

                        <p
                          className={`mt-2 text-center font-sans text-[12px] font-black uppercase tracking-[0.08em] ${
                            isActive ? "text-white" : "text-black"
                          }`}
                        >
                          {reward.label}
                        </p>
                        <p className={`mt-1 text-center text-[11px] leading-4 ${isActive ? "text-white/75" : "text-black/58"}`}>
                          {reward.day === 4
                            ? "Special tag unlock."
                            : reward.day === 7
                              ? "Elite tag unlock."
                              : `+${reward.amount} token reward.`}
                        </p>

                        <div className="mt-3 w-full">
                          {isActive && !hasClaimedToday ? (
                            <button
                              type="button"
                              onClick={handleClaim}
                              className="inline-flex h-8 w-full items-center justify-center rounded-full bg-white px-3 text-[11px] font-black uppercase tracking-[0.18em] text-black transition hover:opacity-90"
                            >
                              Claim
                            </button>
                          ) : (
                            <div className="inline-flex h-8 w-full items-center justify-center rounded-full border border-dashed border-black/15 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
                              {isClaimed ? "Claimed" : "Locked"}
                            </div>
                          )}
                        </div>

                        {reward.type === "tag" ? (
                          <div
                            className={`absolute -top-2 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${
                              reward.day === 7 ? "bg-black text-white" : "border border-black/10 bg-white text-black"
                            }`}
                          >
                            {reward.day === 4 ? "Special" : "Elite"}
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>

                <div className="relative mt-5 h-6">
                  <div className="absolute left-3 right-3 top-1/2 h-1 -translate-y-1/2 rounded-full bg-black/10" />
                  <div className="absolute left-3 right-3 top-1/2 h-1 -translate-y-1/2 rounded-full bg-black/30 opacity-60" />
                  <div className="flex justify-between">
                    {REWARDS.map((reward) => (
                      <span
                        key={reward.day}
                        className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-white text-[10px] font-black text-black"
                      >
                        {reward.day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/8 px-4 py-4 sm:flex-row sm:px-5">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-black/75 transition hover:border-black/20 hover:bg-black/[0.03]"
          >
            Nanti saja
          </button>
          <button
            type="button"
            onClick={handleClaim}
            disabled={hasClaimedToday}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {hasClaimedToday ? "Sudah diklaim" : "Claim hari ini"}
          </button>
        </div>
      </div>
    </div>
  );
}
