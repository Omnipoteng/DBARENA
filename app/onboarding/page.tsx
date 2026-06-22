"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
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
  "Anime",
  "Manga",
  "Manhwa",
  "Comic",
  "Novel",
  "Game",
  "Film & TV Series",
  "Mythology",
  "SCP",
  "Original Character (OC)",
];

const TOPIC_OPTIONS = [
  "Power Scaling",
  "Speed Scaling",
  "Cosmology",
  "Hax & Ability",
  "IQ / Strategy",
  "Matchup Analysis",
  "Death Battle",
  "Lore Discussion",
];

const VERSE_OPTIONS = [
  "Naruto / Boruto",
  "Dragon Ball",
  "One Piece",
  "Bleach",
  "Marvel",
  "DC",
  "Fate",
  "Honkai",
  "Genshin Impact",
  "Jujutsu Kaisen",
  "Lainnya",
];

const PROVINCES = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bangka Belitung",
  "Bengkulu",
  "Lampung",
  "DKI Jakarta",
  "Jawa Barat",
  "Banten",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Sulawesi Tengah",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Gorontalo",
  "Sulawesi Barat",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Barat Daya",
];

type StepId = 1 | 2 | 3 | 4 | 5;

function StepChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center border px-3 py-2 text-left text-xs font-black uppercase tracking-[0.18em] transition sm:px-4 sm:text-[11px] ${
        active ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/65 hover:bg-black/[0.03]"
      }`}
    >
      {children}
    </button>
  );
}

function SectionBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-black/8 py-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.42em] text-black/35">{title}</p>
          <h2 className="mt-1 font-sans text-2xl font-black uppercase tracking-[0.04em] text-black">
            {subtitle}
          </h2>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseAuthClient(), []);
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
      if (!supabase) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      const user = data.session?.user;
      if (!user) {
        router.replace("/login");
        return;
      }

      setDbaUserKey(user.id);

      const preferences = await loadSupabaseOnboardingPreferences();
      if (cancelled) return;

      if (preferences?.onboardingCompleted) {
        router.replace("/profile");
        return;
      }

      if (preferences) {
        setSelectedInterests(preferences.interests);
        setSelectedTopics(preferences.debateTopics);
        setSelectedVerses(preferences.favoriteVerses);
        setLocation(preferences.location);
      }

      setReady(true);
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  const toggleValue = (value: string, current: string[], setter: (next: string[]) => void) => {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const handleSave = async (onboardingCompleted: boolean) => {
    setError(null);
    setSaving(true);

    try {
      await saveSupabaseOnboardingPreferences({
        interests: selectedInterests,
        debateTopics: selectedTopics,
        favoriteVerses: selectedVerses,
        location: location.trim(),
        onboardingCompleted,
      });

      const existingProfile = await loadSupabaseProfileSnapshot();
      if (!existingProfile) {
        await saveSupabaseProfileSnapshot({
          displayName: "Member",
          username: "member",
          bio: "",
          avatarSrc: "",
          bannerSrc: "",
          bannerKind: "image",
          bannerFocus: 50,
          border: "none",
          tags: [],
          rankKey: "Recruit",
          rankedPoints: 0,
          highestRank: "Recruit",
          totalMatch: 0,
          winRate: 0,
        });
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
        <p className="text-sm font-medium text-black/55">Menyiapkan onboarding...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-black/8 pb-4">
          <Link href="/" className="font-sans text-xl font-black uppercase tracking-[0.12em] sm:text-2xl">
            DBARENA
          </Link>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex h-10 items-center justify-center border-b border-black/10 px-4 text-sm font-semibold text-black/65 transition hover:bg-black/[0.03] disabled:opacity-50"
          >
            Lewati
          </button>
        </header>

        <div className="flex items-center gap-2 border-b border-black/8 py-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className={`h-1 flex-1 ${step >= item ? "bg-black" : "bg-black/10"}`}
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.42em] text-black/35">Preference setup</p>
              <h1 className="max-w-xl font-sans text-4xl font-black uppercase tracking-[0.04em] sm:text-5xl">
                Bantu kami kenali minatmu.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-black/60">
                Pilih preferensi untuk menyesuaikan feed, rekomendasi, dan topik yang relevan dengan akun DBA-mu.
              </p>
            </div>

            <div className="space-y-4 border-t border-black/8 pt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`h-10 border-b px-4 text-xs font-black uppercase tracking-[0.22em] ${
                    step === 1 ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/55"
                  }`}
                >
                  Minat
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`h-10 border-b px-4 text-xs font-black uppercase tracking-[0.22em] ${
                    step === 2 ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/55"
                  }`}
                >
                  Debat
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={`h-10 border-b px-4 text-xs font-black uppercase tracking-[0.22em] ${
                    step === 3 ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/55"
                  }`}
                >
                  Verse
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className={`h-10 border-b px-4 text-xs font-black uppercase tracking-[0.22em] ${
                    step === 4 ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/55"
                  }`}
                >
                  Lokasi
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className={`h-10 border-b px-4 text-xs font-black uppercase tracking-[0.22em] ${
                    step === 5 ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/55"
                  }`}
                >
                  Selesai
                </button>
              </div>

              {step === 1 ? (
                <SectionBlock title="Step 1" subtitle="Minat utama">
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((option) => (
                      <StepChip
                        key={option}
                        active={selectedInterests.includes(option)}
                        onClick={() => toggleValue(option, selectedInterests, setSelectedInterests)}
                      >
                        {option}
                      </StepChip>
                    ))}
                  </div>
                </SectionBlock>
              ) : null}

              {step === 2 ? (
                <SectionBlock title="Step 2" subtitle="Topik debat favorit">
                  <div className="flex flex-wrap gap-2">
                    {TOPIC_OPTIONS.map((option) => (
                      <StepChip
                        key={option}
                        active={selectedTopics.includes(option)}
                        onClick={() => toggleValue(option, selectedTopics, setSelectedTopics)}
                      >
                        {option}
                      </StepChip>
                    ))}
                  </div>
                </SectionBlock>
              ) : null}

              {step === 3 ? (
                <SectionBlock title="Step 3" subtitle="Verse favorit">
                  <div className="flex flex-wrap gap-2">
                    {VERSE_OPTIONS.map((option) => (
                      <StepChip
                        key={option}
                        active={selectedVerses.includes(option)}
                        onClick={() => toggleValue(option, selectedVerses, setSelectedVerses)}
                      >
                        {option}
                      </StepChip>
                    ))}
                  </div>
                </SectionBlock>
              ) : null}

              {step === 4 ? (
                <SectionBlock title="Step 4" subtitle="Lokasi opsional">
                  <div className="max-w-md">
                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.34em] text-black/45">
                        Provinsi
                      </span>
                      <select
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        className="h-12 w-full border-b border-black/10 bg-transparent px-1 text-sm text-black outline-none transition focus:border-black/35"
                      >
                        <option value="">Lewati</option>
                        {PROVINCES.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </label>
                    <p className="mt-2 text-xs leading-5 text-black/45">
                      Lokasi tidak wajib diisi. Bisa diubah nanti dari profile atau settings.
                    </p>
                  </div>
                </SectionBlock>
              ) : null}

              {step === 5 ? (
                <SectionBlock title="Step 5" subtitle="Selesai">
                  <div className="grid gap-4 border-b border-black/8 pb-4 md:grid-cols-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Minat</p>
                      <p className="mt-2 text-sm leading-6 text-black/70">
                        {selectedInterests.length > 0 ? selectedInterests.join(", ") : "Belum dipilih"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Debat</p>
                      <p className="mt-2 text-sm leading-6 text-black/70">
                        {selectedTopics.length > 0 ? selectedTopics.join(", ") : "Belum dipilih"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Verse / Lokasi</p>
                      <p className="mt-2 text-sm leading-6 text-black/70">
                        {selectedVerses.length > 0 ? selectedVerses.join(", ") : "Belum dipilih"}
                        <br />
                        {location ? location : "Lokasi dilewati"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60">
                    Klik simpan untuk menandai onboarding selesai. Setelah itu profile akan langsung memakai data
                    Supabase yang sama.
                  </p>
                </SectionBlock>
              ) : null}
            </div>
          </div>

          <aside className="space-y-4 border-t border-black/8 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="border-b border-black/8 pb-4">
              <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Preview</p>
              <p className="mt-2 text-lg font-black uppercase tracking-[0.06em] text-black">Preferensi kamu</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Minat dipilih</p>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  {selectedInterests.length > 0 ? selectedInterests.join(" · ") : "Belum ada pilihan"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Topik debat</p>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  {selectedTopics.length > 0 ? selectedTopics.join(" · ") : "Belum ada pilihan"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Verse favorit</p>
                <p className="mt-2 text-sm leading-6 text-black/70">
                  {selectedVerses.length > 0 ? selectedVerses.join(" · ") : "Belum ada pilihan"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Lokasi</p>
                <p className="mt-2 text-sm leading-6 text-black/70">{location || "Dilewati"}</p>
              </div>
            </div>

            {error ? <p className="border-b border-black/8 pb-3 text-sm text-black/65">{error}</p> : null}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as StepId) : prev))}
                className="inline-flex h-11 flex-1 items-center justify-center border-b border-black/10 px-4 text-sm font-semibold text-black/65 transition hover:bg-black/[0.03]"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => setStep((prev) => (prev < 5 ? ((prev + 1) as StepId) : prev))}
                className="inline-flex h-11 flex-1 items-center justify-center bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {step < 5 ? "Lanjut" : saving ? "Menyimpan..." : "Simpan preference"}
              </button>
            </div>

            {step === 5 ? (
              <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="inline-flex h-11 flex-1 items-center justify-center border-b border-black/10 px-4 text-sm font-semibold text-black/65 transition hover:bg-black/[0.03] disabled:opacity-50"
              >
                Lewati
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="inline-flex h-11 flex-1 items-center justify-center bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan & masuk"}
                </button>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
