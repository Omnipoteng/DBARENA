"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-black/70">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 w-full border-b border-black/20 bg-transparent px-0 text-sm text-black outline-none transition-colors placeholder:text-black/30 focus:border-black"
      />
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

    // profiles.user_key is an app-controlled key; load using the same source as save/load defaults.
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
    }, params.userId);

    await saveSupabaseTokenWallet({
      balance: 0,
      unlocks: [],
      history: [],
    }, params.userId);

    await saveSupabaseSitePreferences(getDefaultPreferences(), params.userId);

    const existingPreferences = await loadSupabaseOnboardingPreferences(params.userId);
    if (!existingPreferences) {
      await saveSupabaseOnboardingPreferences({
        interests: [],
        debateTopics: [],
        favoriteVerses: [],
        location: "",
        onboardingCompleted: false,
      }, params.userId);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("database belum terhubung. Isi .env.local dulu.");
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
            "Akun belum aktif atau password salah. Jika baru daftar, cek email verifikasi lalu login lagi."
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("database belum terhubung. Isi .env.local dulu.");
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
      setMessage("Akun berhasil dibuat. Silakan login untuk melanjutkan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-black selection:bg-black selection:text-white">
      {/* Header */}
      <header className="absolute left-0 top-0 w-full p-6 sm:p-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-black uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
          >
            DBARENA
          </Link>
          <Link
            href="/landing"
            className="text-[11px] font-semibold uppercase tracking-widest text-black/60 transition-colors hover:text-black"
          >
            &larr; Kembali
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-[380px] space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {mode === "login" ? "Selamat datang" : "Buat akun"}
            </h1>
            <p className="mt-2 text-sm text-black/60">
              {mode === "login"
                ? "Masukkan kredensial Anda untuk masuk ke sistem."
                : "Daftar untuk mengakses fitur penuh platform."}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={mode === "login" ? handleLogin : handleRegister}
            className="space-y-6"
          >
            <div className="space-y-4">
              {mode === "login" ? (
                <>
                  <Field
                    label="Username atau Email"
                    value={identifier}
                    onChange={setIdentifier}
                    placeholder="namaemail@gmail.com"
                    autoComplete="username"
                  />
                  <Field
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    type="password"
                    placeholder="gunakan pasword kuat"
                    autoComplete="current-password"
                  />
                </>
              ) : (
                <>
                  <Field
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    placeholder="namaemail@gmail.com"
                    autoComplete="email"
                  />
                  <Field
                    label="Username"
                    value={username}
                    onChange={setUsername}
                    placeholder="nama_pengguna"
                    autoComplete="username"
                  />
                  <Field
                    label="Display Name"
                    value={displayName}
                    onChange={setDisplayName}
                    placeholder="Nama Tampilan"
                    autoComplete="name"
                  />
                  <Field
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    type="password"
                    placeholder="gunakan pasword kuat"
                    autoComplete="new-password"
                  />
                </>
              )}
            </div>

            {/* Error/Success Messages */}
            {(error || message) && (
              <div
                className={`border-l-2 p-3 text-sm ${
                  error ? "border-black bg-black/5 text-black" : "border-black bg-black text-white"
                }`}
              >
                {error || message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 bg-black text-sm font-semibold text-white transition-all hover:bg-black/90 disabled:opacity-50"
            >
              {loading
                ? mode === "login"
                  ? "Memproses..."
                  : "Mendaftar..."
                : mode === "login"
                ? "login sekarang"
                : "Daftar Sekarang"}
              {!loading && (
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                resetState();
              }}
              className="text-xs font-semibold uppercase tracking-widest text-black/60 transition-colors hover:text-black"
            >
              {mode === "login"
                ? "Belum punya akun? Daftar"
                : "Sudah punya akun? Masuk"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
