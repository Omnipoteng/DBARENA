"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getSupabaseAuthClient } from "@/lib/supabase-auth";
import { setDbaUserKey } from "@/lib/dba-user";
import {
  loadSupabaseProfileSnapshot,
  loadSupabaseOnboardingPreferences,
  saveSupabaseProfileSnapshot,
  saveSupabaseOnboardingPreferences,
} from "@/lib/supabase-store";

const INTEREST_OPTIONS = [
  "Anime", "Manga", "Manhwa", "Comic", "Novel",
  "Game", "Film & TV Series", "Mythology", "SCP", "Original Character (OC)",
];

const TOPIC_OPTIONS = [
  "Power Scaling", "Speed Scaling", "Cosmology", "Hax & Ability",
  "IQ / Strategy", "Matchup Analysis", "Death Battle", "Lore Discussion",
];

const VERSE_OPTIONS = [
  "Naruto / Boruto", "Dragon Ball", "One Piece", "Bleach",
  "Marvel", "DC", "Fate", "Honkai", "Genshin Impact", "Jujutsu Kaisen", "Lainnya",
];

const PROVINCES = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi",
  "Sumatera Selatan", "Bangka Belitung", "Bengkulu", "Lampung", "DKI Jakarta",
  "Jawa Barat", "Banten", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Bali",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Kalimantan Barat", "Kalimantan Tengah",
  "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara", "Sulawesi Utara",
  "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo",
  "Sulawesi Barat", "Maluku", "Maluku Utara", "Papua", "Papua Barat",
  "Papua Tengah", "Papua Pegunungan", "Papua Selatan", "Papua Barat Daya",
];

type StepId = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { id: 1, label: "Minat", hint: "Pilih kategori konten yang kamu sukai" },
  { id: 2, label: "Debat", hint: "Pilih topik debat yang kamu minati" },
  { id: 3, label: "Verse", hint: "Pilih universe favorit kamu" },
  { id: 4, label: "Lokasi", hint: "Opsional — bisa diubah kapan saja" },
  { id: 5, label: "Selesai", hint: "Tinjau dan simpan preferensi kamu" },
];

function Tag({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
        active
          ? "border-black bg-black text-white"
          : "border-black/15 bg-white text-black/60 hover:border-black/30 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseAuthClient(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<StepId>(1);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedVerses, setSelectedVerses] = useState<string[]>([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (!supabase) { router.replace("/login"); return; }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      const user = data.session?.user;
      if (!user) { router.replace("/login"); return; }

      setUserId(user.id);
      setDbaUserKey(user.id);

      const preferences = await loadSupabaseOnboardingPreferences(user.id);
      if (cancelled) return;

      if (preferences?.onboardingCompleted) { router.replace("/profile"); return; }

      if (preferences) {
        setSelectedInterests(preferences.interests);
        setSelectedTopics(preferences.debateTopics);
        setSelectedVerses(preferences.favoriteVerses);
        setLocation(preferences.location);
      }

      setReady(true);
    };

    void hydrate();
    return () => { cancelled = true; };
  }, [router, supabase]);

  const toggle = (value: string, current: string[], setter: (next: string[]) => void) => {
    setter(current.includes(value) ? current.filter((i) => i !== value) : [...current, value]);
  };

  const handleSave = async (onboardingCompleted: boolean) => {
    if (!userId) return;
    setError(null);
    setSaving(true);
    try {
      await saveSupabaseOnboardingPreferences({
        interests: selectedInterests,
        debateTopics: selectedTopics,
        favoriteVerses: selectedVerses,
        location: location.trim(),
        onboardingCompleted,
      }, userId);

      const existingProfile = await loadSupabaseProfileSnapshot(userId);
      if (!existingProfile) {
        await saveSupabaseProfileSnapshot({
          displayName: "Member", username: "member", bio: "",
          avatarSrc: "", bannerSrc: "", bannerKind: "image", bannerFocus: 50,
          border: "none", tags: [], rankKey: "Recruit", rankedPoints: 0,
          highestRank: "Recruit", totalMatch: 0, winRate: 0,
        }, userId);
      }

      router.replace("/profile");
    } catch {
      setError("Gagal menyimpan preference. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="text-sm text-black/40 tracking-widest uppercase">Menyiapkan...</p>
      </main>
    );
  }

  const currentStep = STEPS[step - 1];

  return (
    <main className="flex min-h-screen flex-col bg-white text-black selection:bg-black selection:text-white">
      {/* Top bar */}
      <header className="absolute left-0 top-0 w-full p-6 sm:p-10 z-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
          >
            DBARENA
          </Link>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="text-[11px] font-semibold uppercase tracking-widest text-black/50 transition-colors hover:text-black disabled:opacity-30"
          >
            Lewati →
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-black/10">
        <div
          className="h-full bg-black transition-all duration-500 ease-in-out"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {/* Main layout */}
      <div className="flex flex-1 pt-24 sm:pt-28">
        {/* Left sidebar — step nav */}
        <nav className="hidden lg:flex w-56 flex-shrink-0 flex-col justify-center border-r border-black/8 px-8 py-12">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-black/35">Setup</p>
          <ol className="space-y-1">
            {STEPS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setStep(s.id as StepId)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider transition-colors ${
                    step === s.id
                      ? "text-black"
                      : step > s.id
                      ? "text-black/40"
                      : "text-black/25"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border text-[10px] font-black transition-colors ${
                      step === s.id
                        ? "border-black bg-black text-white"
                        : step > s.id
                        ? "border-black/30 text-black/40"
                        : "border-black/10 text-black/20"
                    }`}
                  >
                    {step > s.id ? "✓" : s.id}
                  </span>
                  {s.label}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Center — content */}
        <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12 max-w-2xl">
          {/* Step header */}
          <div className="mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">
              Langkah {step} dari 5
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              {currentStep.label}
            </h1>
            <p className="mt-1.5 text-sm text-black/55">{currentStep.hint}</p>
          </div>

          {/* Step content */}
          <div className="flex-1">
            {step === 1 && (
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => (
                  <Tag key={opt} label={opt} active={selectedInterests.includes(opt)}
                    onClick={() => toggle(opt, selectedInterests, setSelectedInterests)} />
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-wrap gap-2">
                {TOPIC_OPTIONS.map((opt) => (
                  <Tag key={opt} label={opt} active={selectedTopics.includes(opt)}
                    onClick={() => toggle(opt, selectedTopics, setSelectedTopics)} />
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-wrap gap-2">
                {VERSE_OPTIONS.map((opt) => (
                  <Tag key={opt} label={opt} active={selectedVerses.includes(opt)}
                    onClick={() => toggle(opt, selectedVerses, setSelectedVerses)} />
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="max-w-xs space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-black/70">
                    Provinsi
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-11 w-full border-b border-black/20 bg-transparent text-sm text-black outline-none transition-colors focus:border-black"
                  >
                    <option value="">Pilih provinsi...</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-black/40">
                  Lokasi tidak wajib. Bisa diubah kapan saja dari profil.
                </p>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <p className="text-sm text-black/55 leading-6">
                  Preferensi kamu sudah siap disimpan. Klik <strong className="text-black">Simpan & Mulai</strong> untuk masuk ke profil.
                </p>
                <div className="divide-y divide-black/8 border-y border-black/8">
                  {[
                    { label: "Minat", value: selectedInterests.join(", ") || "Belum dipilih" },
                    { label: "Topik Debat", value: selectedTopics.join(", ") || "Belum dipilih" },
                    { label: "Verse Favorit", value: selectedVerses.join(", ") || "Belum dipilih" },
                    { label: "Lokasi", value: location || "Dilewati" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 py-3">
                      <span className="w-28 flex-shrink-0 text-[10px] font-semibold uppercase tracking-widest text-black/40 pt-0.5">
                        {label}
                      </span>
                      <span className="text-sm text-black/75 leading-5">{value}</span>
                    </div>
                  ))}
                </div>
                {error && (
                  <div className="border-l-2 border-black bg-black/5 p-3 text-sm text-black">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="mt-10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as StepId) : prev))}
              disabled={step === 1}
              className="text-[11px] font-semibold uppercase tracking-widest text-black/50 transition-colors hover:text-black disabled:opacity-20"
            >
              ← Kembali
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => ((prev + 1) as StepId))}
                className="group flex h-11 items-center justify-center gap-2 bg-black px-8 text-sm font-semibold text-white transition-all hover:bg-black/90"
              >
                Lanjut
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="group flex h-11 items-center justify-center gap-2 bg-black px-8 text-sm font-semibold text-white transition-all hover:bg-black/90 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan & Mulai"}
                {!saving && <span className="transition-transform group-hover:translate-x-1">→</span>}
              </button>
            )}
          </div>

          {/* Mobile step indicators */}
          <div className="mt-6 flex items-center justify-center gap-1.5 lg:hidden">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1 transition-all duration-300 ${
                  step >= s.id ? "w-6 bg-black" : "w-3 bg-black/15"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right sidebar — live preview (desktop only) */}
        <aside className="hidden xl:flex w-64 flex-shrink-0 flex-col justify-center border-l border-black/8 px-8 py-12">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-widest text-black/35">Preview</p>
          <div className="space-y-5">
            {[
              { label: "Minat", value: selectedInterests.length ? selectedInterests.join(" · ") : "—" },
              { label: "Debat", value: selectedTopics.length ? selectedTopics.join(" · ") : "—" },
              { label: "Verse", value: selectedVerses.length ? selectedVerses.join(" · ") : "—" },
              { label: "Lokasi", value: location || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="border-b border-black/8 pb-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">{label}</p>
                <p className="mt-1.5 text-xs leading-5 text-black/65 break-words">{value}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
