"use client";

import { useEffect, useState } from "react";
import { WifiOff, RotateCw, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.href = "/";
      } else {
        setIsRetrying(false);
        // Tampilkan feedback visual bahwa masih offline
        const toast = document.getElementById("offline-toast");
        if (toast) {
          toast.classList.remove("opacity-0", "translate-y-2");
          toast.classList.add("opacity-100", "translate-y-0");
          setTimeout(() => {
            toast.classList.add("opacity-0", "translate-y-2");
            toast.classList.remove("opacity-100", "translate-y-0");
          }, 3000);
        }
      }
    }, 1000);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#f4f4f2] px-4 text-black dark:bg-[#090909] dark:text-white transition-colors duration-300">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

      {/* Main card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-neutral-900/60 p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md">
        {/* Glow decoration */}
        <div className="absolute -left-10 -top-10 -z-10 h-28 w-28 rounded-full bg-red-500/10 blur-xl dark:bg-red-500/5" />
        <div className="absolute -bottom-10 -right-10 -z-10 h-28 w-28 rounded-full bg-neutral-400/10 blur-xl dark:bg-neutral-400/5" />

        {/* Icon with pulse animation */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 dark:bg-red-500/5 text-red-500">
          <WifiOff className="h-10 w-10 animate-pulse" />
        </div>

        {/* Text Details */}
        <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">Koneksi Terputus</h1>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Sepertinya perangkat Anda sedang tidak terhubung ke internet. Kami menyimpan halaman ini agar Anda tetap mendapatkan informasi.
        </p>

        {/* Status Indicator */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/5 dark:border-white/5 bg-black/[0.03] dark:bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500 animate-pulse"}`} />
          {isOnline ? "Koneksi terdeteksi kembali!" : "Perangkat Offline"}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 rounded-xl bg-black dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            <RotateCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
            {isRetrying ? "Mencoba menghubungkan..." : "Coba Lagi"}
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-black/10 dark:border-white/10 px-5 py-3 text-sm font-semibold transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Floating alert toast */}
      <div
        id="offline-toast"
        className="fixed bottom-6 left-1/2 z-[10000] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 dark:bg-red-500/5 px-4 py-3 text-xs font-semibold text-red-500 shadow-lg backdrop-blur-md transition-all duration-300 opacity-0 translate-y-2 pointer-events-none"
      >
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>Koneksi gagal. Anda masih offline!</span>
      </div>
    </div>
  );
}
