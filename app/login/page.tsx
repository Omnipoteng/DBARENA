"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { setDbaUserKey } from "@/lib/dba-user";
import { getDefaultPreferences } from "@/lib/site-preferences";
import { getSupabaseAuthClient, resolveLoginEmail } from "@/lib/supabase-auth";
import {
  loadSupabaseProfileSnapshot,
  loadSupabaseOnboardingPreferences,
  saveSupabaseProfileSnapshot,
  saveSupabaseOnboardingPreferences,
  saveSupabaseSitePreferences,
  saveSupabaseTokenWallet,
} from "@/lib/supabase-store";

type Mode = "login" | "register";

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.34em] text-black/45">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-12 w-full border-b border-black/10 bg-transparent px-1 text-sm text-black outline-none transition placeholder:text-black/28 focus:border-black/35"
      />
    </label>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-xs font-black uppercase tracking-[0.22em] transition ${
        active ? "bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.14)]" : "border border-black/10 bg-white text-black/55 hover:bg-black/[0.03]"
      }`}
    >
      {children}
    </button>
  );
}

function FeatureChip({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-black/8 pb-4">
      <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">{title}</p>
      <p className="mt-2 text-sm leading-6 text-black/70">{description}</p>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseAuthClient(), []);
  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setMessage(null);
    setError(null);
  };

  const bootstrapAccount = async (params: {
    userId: string;
    email?: string;
    username?: string;
    displayName?: string;
  }) => {
    setDbaUserKey(params.userId);

    const existingProfile = await loadSupabaseProfileSnapshot();
    if (existingProfile) {
      return;
    }

    const nextUsername = (params.username ?? params.email ?? "member").replace(/^@/, "").trim();
    const nextDisplayName = (params.displayName?.trim() || nextUsername || "Member").trim();
    const nextEmail = params.email?.trim().toLowerCase();

    await saveSupabaseProfileSnapshot({
      email: nextEmail || undefined,
      displayName: nextDisplayName,
      username: nextUsername,
      bio: "",
      avatarSrc: "",
      bannerSrc: "",
      bannerKind: "image",
      bannerFocus: 50,
      rankKey: "Recruit",
      rankedPoints: 0,
      highestRank: "Recruit",
      totalMatch: 0,
      winRate: 0,
      border: "none",
      tags: [],
    });

    await saveSupabaseTokenWallet({
      balance: 0,
      unlocks: [],
      history: [],
    });

    await saveSupabaseSitePreferences(getDefaultPreferences());

    const existingPreferences = await loadSupabaseOnboardingPreferences();
    if (!existingPreferences) {
      await saveSupabaseOnboardingPreferences({
        interests: [],
        debateTopics: [],
        favoriteVerses: [],
        location: "",
        onboardingCompleted: false,
      });
    }
  };

  const handleLogin = async () => {
    if (!supabase) {
      setError("Supabase belum terhubung. Isi .env.local dulu.");
      return;
    }

    resetState();
    setLoading(true);

    try {
      const resolvedEmail = await resolveLoginEmail(identifier);
      if (!resolvedEmail) {
        setError("Username atau email tidak ditemukan.");
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: resolvedEmail,
        password,
      });

      if (signInError) {
        const lowered = signInError.message?.toLowerCase() ?? "";
        if (lowered.includes("invalid login credentials")) {
          setError(
            "Akun belum aktif atau password salah. Jika baru daftar, cek email verifikasi lalu login lagi.",
          );
        } else {
          setError(signInError.message || "Masuk gagal. Cek data login lalu coba lagi.");
        }
        return;
      }

      if (!data.user) {
        setError("Masuk gagal. Cek data login lalu coba lagi.");
        return;
      }

      const metadata = data.user.user_metadata as Record<string, string | undefined> | undefined;
      await bootstrapAccount({
        userId: data.user.id,
        email: resolvedEmail,
        username: identifier.includes("@") ? metadata?.username : identifier,
        displayName: metadata?.display_name,
      });

      const onboarding = await loadSupabaseOnboardingPreferences();
      router.push(onboarding?.onboardingCompleted ? "/profile" : "/onboarding");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!supabase) {
      setError("Supabase belum terhubung. Isi .env.local dulu.");
      return;
    }

    resetState();
    setLoading(true);

    try {
      const cleanUsername = username.trim().replace(/^@/, "");
      const cleanDisplayName = displayName.trim() || cleanUsername || "Member";
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanUsername) {
        setError("Username wajib diisi.");
        return;
      }

      if (!cleanEmail) {
        setError("Email wajib diisi.");
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            username: cleanUsername,
            display_name: cleanDisplayName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Pendaftaran gagal. Cek data lalu coba lagi.");
        return;
      }

      if (!data.user) {
        setError("Pendaftaran gagal. Cek data lalu coba lagi.");
        return;
      }

      await bootstrapAccount({
        userId: data.user.id,
        email: cleanEmail,
        username: cleanUsername,
        displayName: cleanDisplayName,
      });

      setMode("login");
      setIdentifier(cleanEmail);
      setPassword("");
      setMessage("Akun berhasil dibuat. Silakan login untuk lanjut ke onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.05),_transparent_28%),linear-gradient(180deg,_#ffffff_0%,_#f2f2f0_100%)] text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-black/8 pb-4">
          <Link href="/" className="font-sans text-xl font-black uppercase tracking-[0.12em] sm:text-2xl">
            DBARENA
          </Link>
          <Link
            href="/landing"
            className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-black transition hover:bg-black/[0.03]"
          >
            Kembali ke landing
          </Link>
        </div>

        <section className="grid flex-1 gap-6 py-6 lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-10">
          <div className="space-y-6">
            <div className="max-w-2xl space-y-3">
              <p className="text-[10px] uppercase tracking-[0.42em] text-black/35">Account access</p>
              <h1 className="font-sans text-4xl font-black uppercase tracking-[0.04em] sm:text-5xl">
                Masuk ke DBARENA
              </h1>
              <p className="max-w-xl text-sm leading-7 text-black/60">
                Login dipakai untuk menautkan profile, token, friends, inventory, dan histori ke akun Supabase yang
                sama. Username tetap bisa dipakai di UI, email dipakai di backend.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="border-b border-black/8 pb-4">
                <p className="text-[10px] uppercase tracking-[0.34em] text-black/35">Profile</p>
                <p className="mt-2 text-sm leading-6 text-black/70">Data profil tersimpan ke database.</p>
              </div>
              <FeatureChip title="Token" description="Wallet, history, dan daily login mengikuti akun yang sama." />
              <FeatureChip title="Social" description="Friends dan follow ikut user yang sama." />
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <div className="overflow-hidden border border-black/10 bg-white shadow-[0_28px_90px_rgba(0,0,0,0.08)]">
              <div className="bg-[linear-gradient(180deg,#111111_0%,#2c2c2c_45%,#fdfdfd_100%)] px-5 pb-6 pt-6 text-white sm:px-6 sm:pb-7 sm:pt-7">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl font-black tracking-[0.08em]">
                  DB
                </div>
                <div className="mt-6 max-w-sm">
                  <p className="text-[10px] uppercase tracking-[0.42em] text-white/55">DBARENA ACCESS</p>
                  <h2 className="mt-2 font-sans text-3xl font-black uppercase tracking-[0.04em]">
                    {mode === "login" ? "Masuk" : "Daftar akun"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/72">
                    {mode === "login"
                      ? "Masukkan username atau email lalu password."
                      : "Buat akun baru untuk mengaktifkan profile, token, dan social system."}
                  </p>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6 sm:py-6">
                <div className="flex gap-2">
                  <ModeButton active={mode === "login"} onClick={() => setMode("login")}>
                    Masuk
                  </ModeButton>
                  <ModeButton active={mode === "register"} onClick={() => setMode("register")}>
                    Daftar
                  </ModeButton>
                </div>

                <div className="mt-5 space-y-4">
                  {mode === "login" ? (
                    <>
                      <Field
                        label="Username atau email"
                        value={identifier}
                        onChange={setIdentifier}
                        placeholder="singularity_55 atau singularity@email.com"
                        autoComplete="username"
                      />
                      <Field
                        label="Password"
                        value={password}
                        onChange={setPassword}
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                    </>
                  ) : (
                    <>
                      <Field
                        label="Username"
                        value={username}
                        onChange={setUsername}
                        placeholder="singularity_55"
                        autoComplete="username"
                      />
                      <Field
                        label="Display name"
                        value={displayName}
                        onChange={setDisplayName}
                        placeholder="Singularity"
                        autoComplete="name"
                      />
                      <Field
                        label="Email"
                        value={email}
                        onChange={setEmail}
                        type="email"
                        placeholder="singularity@email.com"
                        autoComplete="email"
                      />
                      <Field
                        label="Password"
                        value={password}
                        onChange={setPassword}
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </>
                  )}

                  {error ? (
                    <p className="border-b border-black/10 pb-3 text-sm text-black/70">{error}</p>
                  ) : null}
                  {message ? (
                    <p className="border-b border-black/10 pb-3 text-sm text-black/70">{message}</p>
                  ) : null}

                  <button
                    type="button"
                    onClick={mode === "login" ? handleLogin : handleRegister}
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center bg-black px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (mode === "login" ? "Memproses..." : "Mendaftar...") : mode === "login" ? "Masuk" : "Buat akun"}
                  </button>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className={`inline-flex h-11 items-center justify-center border px-4 text-xs font-black uppercase tracking-[0.22em] transition ${
                        mode === "login"
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white text-black/55 hover:bg-black/[0.03]"
                      }`}
                    >
                      Sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className={`inline-flex h-11 items-center justify-center border px-4 text-xs font-black uppercase tracking-[0.22em] transition ${
                        mode === "register"
                          ? "border-black bg-black text-white"
                          : "border-black/10 bg-white text-black/55 hover:bg-black/[0.03]"
                      }`}
                    >
                      Create account
                    </button>
                  </div>

                  <p className="text-center text-xs leading-6 text-black/48">
                    Dengan login, profile, token, friends, dan inventory akan tersambung ke database Supabase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
